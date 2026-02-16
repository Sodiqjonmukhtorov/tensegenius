
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { User } from './types';

// Vercel yoki .env-dan o'zgaruvchilarni olish
const supabaseUrl = process.env.SUPABASE_URL || (import.meta as any).env?.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY || (import.meta as any).env?.VITE_SUPABASE_ANON_KEY;

const isValid = (val: any): val is string => {
  return typeof val === 'string' && val.trim().length > 10 && val !== 'undefined' && val !== 'null';
};

// Client yaratish
export const supabase: SupabaseClient | null = (isValid(supabaseUrl) && isValid(supabaseKey)) 
  ? createClient(supabaseUrl!, supabaseKey!) 
  : null;

if (!supabase) {
  console.error("❌ SUPABASE INITIALIZATION FAILED: Check your Environment Variables in Vercel.");
}

export const db = {
  /**
   * Barcha foydalanuvchilarni olish
   */
  async getAllUsers(): Promise<User[]> {
    if (!supabase) return [];
    try {
      const { data, error } = await supabase.from('users').select('*').order('created_at', { ascending: false });
      if (error) {
        console.error("Supabase Error (getAllUsers):", error.message);
        return [];
      }
      return (data || []).map(row => ({
        fullName: row.full_name,
        username: row.username,
        phone: row.phone,
        password: row.password,
        userCode: row.user_code,
        progress: row.progress
      }));
    } catch (err) {
      console.error("DB Critical Error:", err);
      return [];
    }
  },

  /**
   * Username orqali foydalanuvchini topish
   */
  async getUserByUsername(username: string): Promise<User | null> {
    if (!supabase) return null;
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('username', username.toLowerCase().trim())
        .maybeSingle(); // .single() o'rniga maybeSingle() ishlatamiz (xato bermasligi uchun)

      if (error) {
        console.error("Supabase Error (getUserByUsername):", error.message);
        return null;
      }
      if (!data) return null;

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

  /**
   * Yangi foydalanuvchini ro'yxatdan o'tkazish
   */
  async registerUser(user: User): Promise<{success: boolean, error?: string}> {
    if (!supabase) return { success: false, error: "Database not connected" };
    try {
      // 1. Avval username band emasligini tekshiramiz
      const existing = await this.getUserByUsername(user.username);
      if (existing) return { success: false, error: "Bu username band!" };

      // 2. Insert qilish
      const { error } = await supabase.from('users').insert([{
        username: user.username.toLowerCase().trim(),
        password: user.password,
        full_name: user.fullName,
        phone: user.phone,
        user_code: user.userCode,
        progress: user.progress
      }]);

      if (error) {
        console.error("Supabase Error (Register):", error.message);
        return { success: false, error: error.message };
      }
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || "Unknown error" };
    }
  },

  /**
   * Progressni yangilash
   */
  async updateUserProgress(username: string, progress: any): Promise<boolean> {
    if (!supabase) return false;
    try {
      const { error } = await supabase
        .from('users')
        .update({ progress })
        .eq('username', username.toLowerCase().trim());
      
      if (error) console.error("Update Progress Error:", error.message);
      return !error;
    } catch (err) {
      return false;
    }
  },

  /**
   * Admin tomonidan XP yuborish
   */
  async giftXPByCode(userCode: string, amount: number): Promise<boolean> {
    if (!supabase) return false;
    try {
      const { data: user, error: findError } = await supabase
        .from('users')
        .select('*')
        .eq('user_code', userCode)
        .maybeSingle();

      if (findError || !user) return false;

      const newProgress = { 
        ...user.progress, 
        xp: (user.progress.xp || 0) + amount 
      };

      const { error: updateError } = await supabase
        .from('users')
        .update({ progress: newProgress })
        .eq('user_code', userCode);

      return !updateError;
    } catch (err) {
      return false;
    }
  }
};
