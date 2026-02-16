
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { User } from './types';

// Detect environment variables from Vite's define or process.env
const getEnv = (key: string): string => {
  try {
    // @ts-ignore - process.env might be defined by Vite
    return (process.env[key] || "").trim();
  } catch {
    return "";
  }
};

const supabaseUrl = getEnv('SUPABASE_URL');
const supabaseKey = getEnv('SUPABASE_ANON_KEY');

// Enhanced validation for Supabase credentials
const isConfigured = (val: string): boolean => {
  return typeof val === 'string' && val.length > 10 && !val.includes('YOUR_') && val !== 'undefined';
};

// Initialize Supabase Client
export const supabase: SupabaseClient | null = (isConfigured(supabaseUrl) && isConfigured(supabaseKey)) 
  ? createClient(supabaseUrl, supabaseKey) 
  : null;

// Mock Database Implementation (Local Storage Fallback)
const mockDb = {
  getUsers(): User[] {
    const data = localStorage.getItem('tg_mock_users');
    return data ? JSON.parse(data) : [];
  },
  saveUsers(users: User[]) {
    localStorage.setItem('tg_mock_users', JSON.stringify(users));
  }
};

// Log current storage mode for developers without using console.error for expected missing config
console.group("📡 TenseGenius Data Connectivity");
if (supabase) {
  console.info("✅ Status: CLOUD SYNC ACTIVE");
  console.info("📍 Provider: Supabase");
} else {
  console.warn("⚠️ Status: LOCAL STORAGE MODE");
  console.info("ℹ️ Note: Global user sync is disabled because SUPABASE_URL/KEY are not set in environment variables.");
}
console.groupEnd();

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
      console.warn("Supabase fetch failed, falling back to local storage:", err);
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
    } catch (err) {
      return null;
    }
  },

  async registerUser(user: User): Promise<{success: boolean, error?: string}> {
    const norm = user.username.toLowerCase().trim();
    if (!supabase) {
      const users = mockDb.getUsers();
      if (users.some(u => u.username === norm)) return { success: false, error: "Bu username band!" };
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
      const { error } = await supabase
        .from('users')
        .update({ progress })
        .eq('username', norm);
      return !error;
    } catch (err) {
      return false;
    }
  },

  async deleteUser(username: string): Promise<boolean> {
    const norm = username.toLowerCase().trim();
    if (!supabase) {
      const users = mockDb.getUsers().filter(u => u.username !== norm);
      mockDb.saveUsers(users);
      return true;
    }
    
    try {
      const { error } = await supabase
        .from('users')
        .delete()
        .eq('username', norm);
      return !error;
    } catch (err) {
      return false;
    }
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
    } catch (err) {
      return false;
    }
  }
};
