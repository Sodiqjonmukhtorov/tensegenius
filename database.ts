
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { User } from './types';

// Environment variable-larni o'qish (Vercel va mahalliy muhit uchun)
const getEnv = (key: string): string => {
  try {
    // @ts-ignore
    const processVal = typeof process !== 'undefined' && process.env ? process.env[key] : undefined;
    const metaVal = (import.meta as any).env ? ((import.meta as any).env[key] || (import.meta as any).env[`VITE_${key}`]) : undefined;
    const finalVal = processVal || metaVal || "";
    return (typeof finalVal === 'string' && finalVal.length > 5 && !finalVal.includes('YOUR_')) ? finalVal.trim() : "";
  } catch (e) { return ""; }
};

const supabaseUrl = getEnv('SUPABASE_URL');
const supabaseKey = getEnv('SUPABASE_ANON_KEY');

// Supabase ulanishi
export const supabase: SupabaseClient | null = (supabaseUrl && supabaseKey) 
  ? createClient(supabaseUrl, supabaseKey) 
  : null;

const STORAGE_KEY = 'tg_mock_users';

const mockDb = {
  getUsers(): User[] {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return [];
    try { 
      const parsed = JSON.parse(data);
      return Array.isArray(parsed) ? parsed : [];
    } catch { return []; }
  },
  saveUsers(users: User[]) {
    // Ma'lumotni Local Storagega yozish
    localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
    
    // Boshqa ochiq oynalarni (tabs) ogohlantirish uchun native event
    window.dispatchEvent(new StorageEvent('storage', {
      key: STORAGE_KEY,
      newValue: JSON.stringify(users)
    }));

    // Joriy oyna ichidagi komponentlarni ogohlantirish uchun custom event
    window.dispatchEvent(new CustomEvent('local_db_update', { detail: users }));
  }
};

export const db = {
  // Barcha foydalanuvchilarni olish
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
      console.warn("Supabase fetch failed, falling back to local storage.");
      return mockDb.getUsers(); 
    }
  },

  // Username orqali qidirish
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

  // Yangi foydalanuvchini ro'yxatdan o'tkazish
  async registerUser(user: User): Promise<{success: boolean, error?: string}> {
    const norm = user.username.toLowerCase().trim();
    
    // 1. Local Storage-da saqlash (Har doim zaxira sifatida va offline rejim uchun)
    const localUsers = mockDb.getUsers();
    if (localUsers.some(u => u.username === norm)) {
      return { success: false, error: "Bu username band! (Local)" };
    }
    
    if (!supabase) {
      mockDb.saveUsers([...localUsers, user]);
      return { success: true };
    }

    // 2. Supabase-da saqlash (Agar ulangan bo'lsa)
    try {
      const { error } = await supabase.from('users').insert([{
        username: norm,
        password: user.password,
        full_name: user.fullName,
        phone: user.phone,
        user_code: user.userCode,
        progress: user.progress
      }]);
      
      if (error) {
        if (error.code === '23505') return { success: false, error: "Bu username yoki ID band!" };
        throw error;
      }
      
      // Muvaffaqiyatli bo'lsa local-ni ham yangilab qo'yamiz (offline kirish uchun)
      mockDb.saveUsers([...localUsers, user]);
      return { success: true };
    } catch (err: any) { 
      return { success: false, error: err.message }; 
    }
  },

  // Progressni yangilash
  async updateUserProgress(username: string, progress: any): Promise<boolean> {
    const norm = username.toLowerCase().trim();
    
    // Har doim local-da yangilash
    const users = mockDb.getUsers();
    const idx = users.findIndex(u => u.username === norm);
    if (idx !== -1) {
      users[idx].progress = progress;
      mockDb.saveUsers(users);
    }

    if (!supabase) return idx !== -1;

    try {
      const { error } = await supabase.from('users').update({ progress }).eq('username', norm);
      return !error;
    } catch (err) { return false; }
  },

  // O'chirish
  async deleteUser(username: string): Promise<boolean> {
    const norm = username.toLowerCase().trim();
    
    // Local-dan o'chirish
    const users = mockDb.getUsers().filter(u => u.username !== norm);
    mockDb.saveUsers(users);

    if (!supabase) return true;

    try {
      const { error } = await supabase.from('users').delete().eq('username', norm);
      return !error;
    } catch (err) { return false; }
  },

  // XP sovg'a qilish
  async giftXPByCode(userCode: string, amount: number): Promise<boolean> {
    const users = mockDb.getUsers();
    const idx = users.findIndex(u => u.userCode === userCode);
    if (idx !== -1) {
      users[idx].progress.xp += amount;
      mockDb.saveUsers(users);
    }

    if (!supabase) return idx !== -1;

    try {
      const { data: user } = await supabase.from('users').select('*').eq('user_code', userCode).maybeSingle();
      if (!user) return false;
      const newProgress = { ...user.progress, xp: (user.progress.xp || 0) + amount };
      const { error } = await supabase.from('users').update({ progress: newProgress }).eq('user_code', userCode);
      return !error;
    } catch (err) { return false; }
  }
};
