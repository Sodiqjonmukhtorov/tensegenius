
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { User } from './types';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

// Initialize conditionally to prevent "supabaseUrl is required" error if env vars are missing
export const supabase: SupabaseClient | null = (supabaseUrl && supabaseKey && supabaseUrl !== 'undefined' && supabaseKey !== 'undefined') 
  ? createClient(supabaseUrl, supabaseKey) 
  : null;

export const db = {
  async getAllUsers(): Promise<User[]> {
    if (!supabase) {
      console.warn('Supabase client not initialized. Check your environment variables (SUPABASE_URL and SUPABASE_ANON_KEY).');
      return [];
    }
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching users:', error);
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
  },

  async getUserByUsername(username: string): Promise<User | null> {
    if (!supabase) return null;
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('username', username.toLowerCase())
      .single();
    
    if (error || !data) return null;

    return {
      fullName: data.full_name,
      username: data.username,
      phone: data.phone,
      password: data.password,
      userCode: data.user_code,
      progress: data.progress
    };
  },

  async getUserByCode(userCode: string): Promise<User | null> {
    if (!supabase) return null;
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('user_code', userCode)
      .single();
    
    if (error || !data) return null;

    return {
      fullName: data.full_name,
      username: data.username,
      phone: data.phone,
      password: data.password,
      userCode: data.user_code,
      progress: data.progress
    };
  },

  async registerUser(user: User): Promise<boolean> {
    if (!supabase) {
      console.error('Database connection missing. Ensure SUPABASE_URL and SUPABASE_ANON_KEY are set.');
      return false;
    }
    const { error } = await supabase
      .from('users')
      .insert([{
        username: user.username.toLowerCase(),
        password: user.password,
        full_name: user.fullName,
        phone: user.phone,
        user_code: user.userCode,
        progress: user.progress
      }]);
    
    return !error;
  },

  async updateUserProgress(username: string, progress: any): Promise<boolean> {
    if (!supabase) return false;
    const { error } = await supabase
      .from('users')
      .update({ progress })
      .eq('username', username.toLowerCase());
    
    return !error;
  },

  async giftXPByCode(userCode: string, amount: number): Promise<boolean> {
    const user = await this.getUserByCode(userCode);
    if (!user) return false;

    const newProgress = {
      ...user.progress,
      xp: user.progress.xp + amount
    };

    return await this.updateUserProgress(user.username, newProgress);
  }
};
