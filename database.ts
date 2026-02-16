
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { User, UserProgress } from './types';

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

export const supabase: SupabaseClient | null = (supabaseUrl && supabaseKey) 
  ? createClient(supabaseUrl, supabaseKey) 
  : null;

const STORAGE_KEY = 'tg_mock_users';

// Barcha oynalarni bir vaqtda yangilash uchun kanal
const syncChannel = typeof window !== 'undefined' ? new BroadcastChannel('db_sync_channel') : null;

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
    localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
    
    // 1. O'sha oynadagi komponentlarga signal
    window.dispatchEvent(new CustomEvent('local_db_update', { detail: users }));
    
    // 2. Boshqa ochiq oynalarga (tabs) signal
    syncChannel?.postMessage({ type: 'UPDATE_USERS', data: users });
  }
};

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
    const localUsers = mockDb.getUsers();

    if (localUsers.some(u => u.username === norm)) {
      return { success: false, error: "Username band!" };
    }

    // Har doim LOCAL xotiraga saqlaymiz (persistence uchun)
    const updatedLocal = [...localUsers, user];
    mockDb.saveUsers(updatedLocal);

    if (!supabase) return { success: true };

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

  // Fix: Added missing updateUserProgress method to handle progress updates
  async updateUserProgress(username: string, progress: UserProgress): Promise<boolean> {
    const norm = username.toLowerCase().trim();
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

  async deleteUser(username: string): Promise<boolean> {
    const norm = username.toLowerCase().trim();
    const users = mockDb.getUsers().filter(u => u.username !== norm);
    mockDb.saveUsers(users);

    if (!supabase) return true;
    try {
      const { error } = await supabase.from('users').delete().eq('username', norm);
      return !error;
    } catch (err) { return false; }
  },

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
  },

  // Sinxronizatsiya kanali uchun ochiq metod
  onSync(callback: (users: User[]) => void) {
    syncChannel?.addEventListener('message', (event) => {
      if (event.data.type === 'UPDATE_USERS') {
        callback(event.data.data);
      }
    });
  }
};
