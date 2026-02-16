
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
const syncChannel = typeof window !== 'undefined' ? new BroadcastChannel('tensegenius_v4_sync') : null;

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
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
      window.dispatchEvent(new CustomEvent('local_db_update', { detail: users }));
      syncChannel?.postMessage({ type: 'DATA_CHANGED', data: users });
      return true;
    } catch (e) { return false; }
  }
};

export const db = {
  // Cloud holatini tekshirish
  getCloudStatus(): { connected: boolean; reason?: string } {
    if (!supabaseUrl) return { connected: false, reason: "SUPABASE_URL topilmadi. Vercel-da 'Redeploy' qiling!" };
    if (!supabaseKey) return { connected: false, reason: "SUPABASE_ANON_KEY topilmadi. Vercel-da 'Redeploy' qiling!" };
    if (!supabase) return { connected: false, reason: "Supabase client yaratib bo'lmadi." };
    return { connected: true };
  },

  async testCloudConnection(): Promise<{ success: boolean; message: string }> {
    const status = this.getCloudStatus();
    if (!status.connected) return { success: false, message: status.reason || "Ulanish xatosi" };
    
    try {
      // Users jadvalidan 1 ta qatorni o'qib ko'ramiz
      const { error } = await supabase!.from('users').select('id').limit(1);
      if (error) throw error;
      return { success: true, message: "Cloud aloqasi muvaffaqiyatli! Foydalanuvchilar saqlanmoqda." };
    } catch (err: any) {
      return { success: false, message: `Cloud xatosi: ${err.message}. SQL Editor-da jadval yaratilganini tekshiring.` };
    }
  },

  async getAllUsers(): Promise<User[]> {
    if (supabase) {
      try {
        const { data, error } = await supabase.from('users').select('*').order('created_at', { ascending: false });
        if (!error && data) {
          const cloudUsers = data.map(row => ({
            fullName: row.full_name,
            username: row.username,
            phone: row.phone,
            password: row.password,
            userCode: row.user_code,
            progress: row.progress
          }));
          mockDb.saveUsers(cloudUsers);
          return cloudUsers;
        }
      } catch (err) {}
    }
    return mockDb.getUsers();
  },

  async getUserByUsername(username: string): Promise<User | null> {
    const norm = username.toLowerCase().trim();
    if (supabase) {
      try {
        const { data, error } = await supabase.from('users').select('*').eq('username', norm).maybeSingle();
        if (!error && data) return {
          fullName: data.full_name,
          username: data.username,
          phone: data.phone,
          password: data.password,
          userCode: data.user_code,
          progress: data.progress
        };
      } catch (e) {}
    }
    return mockDb.getUsers().find(u => u.username === norm) || null;
  },

  async registerUser(user: User): Promise<{success: boolean, error?: string}> {
    const norm = user.username.toLowerCase().trim();
    
    // Cloud-ga ulanishni tekshiramiz
    const cloud = this.getCloudStatus();
    
    if (supabase && cloud.connected) {
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
           console.error("Supabase insert failed:", error);
           return { success: false, error: `Supabase Xatosi: ${error.message}. Jadval mavjudligini tekshiring.` };
        }
        return { success: true };
      } catch (err: any) {
        return { success: false, error: "Cloud serverga ulanishda xatolik yuz berdi." };
      }
    } else {
      // Agar cloud ulanmagan bo'lsa, xabar beramiz (ma'lumot yo'qolmasligi uchun)
      return { 
        success: false, 
        error: cloud.reason || "Tizim hali bulutli bazaga ulanmagan. Iltimos, Vercel-da Redeploy qiling!" 
      };
    }
  },

  async updateUserProgress(username: string, progress: UserProgress): Promise<boolean> {
    const norm = username.toLowerCase().trim();
    if (supabase) {
      try {
        const { error } = await supabase.from('users').update({ progress }).eq('username', norm);
        if (!error) {
           const users = mockDb.getUsers();
           const idx = users.findIndex(u => u.username === norm);
           if (idx !== -1) { users[idx].progress = progress; mockDb.saveUsers(users); }
           return true;
        }
      } catch (e) { return false; }
    }
    return false;
  },

  async giftXPByCode(userCode: string, amount: number): Promise<boolean> {
    if (supabase) {
      try {
        const { data: user } = await supabase.from('users').select('*').eq('user_code', userCode).maybeSingle();
        if (user) {
          const newProgress = { ...user.progress, xp: (user.progress.xp || 0) + amount };
          const { error } = await supabase.from('users').update({ progress: newProgress }).eq('user_code', userCode);
          if (!error) {
            const users = mockDb.getUsers();
            const idx = users.findIndex(u => u.userCode === userCode);
            if (idx !== -1) { users[idx].progress = newProgress; mockDb.saveUsers(users); }
            return true;
          }
        }
      } catch (e) {}
    }
    return false;
  },

  async deleteUser(username: string): Promise<boolean> {
    const norm = username.toLowerCase().trim();
    if (supabase) {
      try {
        const { error } = await supabase.from('users').delete().eq('username', norm);
        if (error) return false;
      } catch (e) { return false; }
    }
    return true;
  },

  exportData() {
    const users = mockDb.getUsers();
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(users, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `tensegenius_backup_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  },

  onSync(callback: (users: User[]) => void) {
    syncChannel?.addEventListener('message', (event) => {
      if (event.data.type === 'DATA_CHANGED') callback(event.data.data);
    });
  }
};
