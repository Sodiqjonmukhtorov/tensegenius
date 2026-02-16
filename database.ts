
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { User } from './types';

// O'zgaruvchilarni olish
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

// Haqiqiy qiymat ekanligini tekshirish (faqat string bo'lsa va 'undefined' bo'lmasa)
const isDefined = (val: any): val is string => {
  return typeof val === 'string' && val.length > 10 && val !== 'undefined' && val !== 'null';
};

export const supabase: SupabaseClient | null = (isDefined(supabaseUrl) && isDefined(supabaseKey)) 
  ? createClient(supabaseUrl!, supabaseKey!) 
  : null;

if (!supabase) {
  console.warn("Supabase connection is not established. Please ensure SUPABASE_URL and SUPABASE_ANON_KEY are set correctly in Vercel.");
}

export const db = {
  async getAllUsers(): Promise<User[]> {
    if (!supabase) return [];
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
    } catch (err) {
      console.error("DB Error:", err);
      return [];
    }
  },

  async getUserByUsername(username: string): Promise<User | null> {
    if (!supabase) return null;
    try {
      const { data, error } = await supabase.from('users').select('*').eq('username', username.toLowerCase().trim()).single();
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

  async registerUser(user: User): Promise<boolean> {
    if (!supabase) return false;
    try {
      const { error } = await supabase.from('users').insert([{
        username: user.username.toLowerCase().trim(),
        password: user.password,
        full_name: user.fullName,
        phone: user.phone,
        user_code: user.userCode,
        progress: user.progress
      }]);
      if (error) throw error;
      return true;
    } catch (err) {
      console.error("Registration failed:", err);
      return false;
    }
  },

  async updateUserProgress(username: string, progress: any): Promise<boolean> {
    if (!supabase) return false;
    try {
      const { error } = await supabase.from('users').update({ progress }).eq('username', username.toLowerCase().trim());
      return !error;
    } catch (err) {
      return false;
    }
  },

  async giftXPByCode(userCode: string, amount: number): Promise<boolean> {
    if (!supabase) return false;
    try {
      const { data: user, error: findError } = await supabase.from('users').select('*').eq('user_code', userCode).single();
      if (findError || !user) return false;
      const newProgress = { ...user.progress, xp: (user.progress.xp || 0) + amount };
      const { error: updateError } = await supabase.from('users').update({ progress: newProgress }).eq('user_code', userCode);
      return !updateError;
    } catch (err) {
      return false;
    }
  }
};
