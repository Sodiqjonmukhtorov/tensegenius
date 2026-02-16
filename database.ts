
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { User } from './types';

// Muhit o'zgaruvchilarini olish
const getEnv = (key: string): string => {
  try {
    // Vite 'define' orqali kelgan qiymatlarni tekshirish
    // @ts-ignore
    const val = process.env[key];
    return (val && val !== 'undefined') ? val.trim() : "";
  } catch {
    return "";
  }
};

const supabaseUrl = getEnv('SUPABASE_URL');
const supabaseKey = getEnv('SUPABASE_ANON_KEY');

// Kalitlarni tekshirish mantiqi
const isConfigured = (val: string): boolean => {
  return typeof val === 'string' && val.length > 15 && !val.includes('YOUR_');
};

// Supabase Client-ni yaratish
export const supabase: SupabaseClient | null = (isConfigured(supabaseUrl) && isConfigured(supabaseKey)) 
  ? createClient(supabaseUrl, supabaseKey) 
  : null;

// Mock Database (Faqat bitta brauzer uchun fallback)
const mockDb = {
  getUsers(): User[] {
    const data = localStorage.getItem('tg_mock_users');
    return data ? JSON.parse(data) : [];
  },
  saveUsers(users: User[]) {
    localStorage.setItem('tg_mock_users', JSON.stringify(users));
  }
};

// Console log orqali holatni bildirish
if (supabase) {
  console.log("%c✅ TenseGenius: CLOUD SYNC ACTIVE (Supabase connected)", "color: #10b981; font-weight: bold;");
} else {
  console.log("%c⚠️ TenseGenius: LOCAL STORAGE MODE (Data is not shared across devices)", "color: #f59e0b; font-weight: bold;");
  if (!isConfigured(supabaseUrl)) console.warn("Missing: SUPABASE_URL");
  if (!isConfigured(supabaseKey)) console.warn("Missing: SUPABASE_ANON_KEY");
}

export const db = {
  async getAllUsers(): Promise<User[]> {
    if (!supabase) return mockDb.getUsers();
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      return (data || []).map(row => ({
        fullName: row.full_name,
        username: row.username,
        phone: row.phone,
        password: row.password,
        userCode: row.user_code,
        progress: row.progress
      }));
    } catch (err) {
      console.error("Supabase fetch error:", err);
      return mockDb.getUsers();
    }
  },

  async getUserByUsername(username: string): Promise<User | null> {
    const norm = username.toLowerCase().trim();
    if (!supabase) return mockDb.getUsers().find(u => u.username === norm) || null;
    
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('username', norm)
        .maybeSingle();

      if (error || !data) return null;

      return {
        fullName: data.full_name,
        username: data.username,
        phone: data.phone,
        password: data.password,
        userCode: data.user_code,
        progress: data.progress
      };
    } catch (err) { return null; }
  },

  async registerUser(user: User): Promise<{success: boolean, error?: string}> {
    const norm = user.username.toLowerCase().trim();
    if (!supabase) {
      const users = mockDb.getUsers();
      if (users.some(u => u.username === norm)) return { success: false, error: "Username band!" };
      users.push(user);
      mockDb.saveUsers(users);
      return { success: true };
    }
    
    try {
      const { error } = await supabase.from('users').insert([{
        username: norm,
        password: user.password,
        full_name: user.fullName,
        phone: user.phone,
        user_code: user.userCode,
        progress: user.progress
      }]);
      if (error) throw error;
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  },

  async updateUserProgress(username: string, progress: any): Promise<boolean> {
    const norm = username.toLowerCase().trim();
    if (!supabase) {
      const users = mockDb.getUsers();
      const idx = users.findIndex(u => u.username === norm);
      if (idx === -1) return false;
      users[idx].progress = progress;
      mockDb.saveUsers(users);
      return true;
    }
    
    try {
      const { error } = await supabase.from('users').update({ progress }).eq('username', norm);
      return !error;
    } catch (err) { return false; }
  },

  async deleteUser(username: string): Promise<boolean> {
    const norm = username.toLowerCase().trim();
    if (!supabase) {
      const users = mockDb.getUsers().filter(u => u.username !== norm);
      mockDb.saveUsers(users);
      return true;
    }
    try {
      const { error } = await supabase.from('users').delete().eq('username', norm);
      return !error;
    } catch (err) { return false; }
  },

  async giftXPByCode(userCode: string, amount: number): Promise<boolean> {
    if (!supabase) {
      const users = mockDb.getUsers();
      const idx = users.findIndex(u => u.userCode === userCode);
      if (idx === -1) return false;
      users[idx].progress.xp += amount;
      mockDb.saveUsers(users);
      return true;
    }
    try {
      const { data } = await supabase.from('users').select('*').eq('user_code', userCode).maybeSingle();
      if (!data) return false;
      const newProgress = { ...data.progress, xp: (data.progress.xp || 0) + amount };
      const { error } = await supabase.from('users').update({ progress: newProgress }).eq('user_code', userCode);
      return !error;
    } catch (err) { return false; }
  }
};
