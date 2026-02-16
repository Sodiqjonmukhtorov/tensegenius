import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { User } from './types';

// Environment variable-larni barcha mumkin bo'lgan usullarda qidirish
const getEnv = (key: string): string => {
  try {
    // 1. Vite define orqali (Vercel Build vaqtida)
    // @ts-ignore
    const processVal = typeof process !== 'undefined' && process.env ? process.env[key] : undefined;
    
    // 2. Vite import.meta.env orqali (Mahalliy va ba'zi buildlar)
    // Fixed: Cast import.meta to any to resolve TS error about property 'env'
    const metaVal = (import.meta as any).env ? ((import.meta as any).env[key] || (import.meta as any).env[`VITE_${key}`]) : undefined;
    
    const finalVal = processVal || metaVal || "";
    
    return (typeof finalVal === 'string' && finalVal.length > 5 && !finalVal.includes('YOUR_')) 
      ? finalVal.trim() 
      : "";
  } catch (e) {
    return "";
  }
};

const supabaseUrl = getEnv('SUPABASE_URL');
const supabaseKey = getEnv('SUPABASE_ANON_KEY');

// Supabase Client yaratish (faqat kalitlar mavjud bo'lsa)
export const supabase: SupabaseClient | null = (supabaseUrl && supabaseKey) 
  ? createClient(supabaseUrl, supabaseKey) 
  : null;

// Mock Database (Agar Supabase ulanmasa ishlatiladi)
const mockDb = {
  getUsers(): User[] {
    const data = localStorage.getItem('tg_mock_users');
    if (!data) return [];
    try { return JSON.parse(data); } catch { return []; }
  },
  saveUsers(users: User[]) {
    localStorage.setItem('tg_mock_users', JSON.stringify(users));
    window.dispatchEvent(new Event('storage_update'));
  }
};

// Brauzer konsolida (F12) holatni tekshirish uchun
console.group("📡 TenseGenius Connection Check");
if (supabase) {
  console.log("%c[OK] Supabase Cloud Connected!", "color: #10b981; font-weight: bold;");
} else {
  console.warn("[FAIL] Supabase keys missing. Running in LOCAL mode.");
  console.log("URL status:", supabaseUrl ? "Found" : "Missing");
  console.log("Key status:", supabaseKey ? "Found" : "Missing");
}
console.groupEnd();

export const db = {
  async getAllUsers(): Promise<User[]> {
    if (!supabase) return mockDb.getUsers();
    try {
      const { data, error } = await supabase.from('users').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      return (data || []).map(row => ({
        fullName: row.full_name,
        username: row.username,
        phone: row.phone,
        password: row.password,
        userCode: row.user_code,
        progress: row.progress
      }));
    } catch (err) { return mockDb.getUsers(); }
  },

  async getUserByUsername(username: string): Promise<User | null> {
    const norm = username.toLowerCase().trim();
    if (!supabase) return mockDb.getUsers().find(u => u.username === norm) || null;
    try {
      const { data, error } = await supabase.from('users').select('*').eq('username', norm).maybeSingle();
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
    } catch (err: any) { return { success: false, error: err.message }; }
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
      const { data: user } = await supabase.from('users').select('*').eq('user_code', userCode).maybeSingle();
      if (!user) return false;
      const newProgress = { ...user.progress, xp: (user.progress.xp || 0) + amount };
      const { error } = await supabase.from('users').update({ progress: newProgress }).eq('user_code', userCode);
      return !error;
    } catch (err) { return false; }
  }
};