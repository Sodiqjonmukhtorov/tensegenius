

import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // 1. .env fayllaridan yuklaymiz
  // Fix: Cast process to any to access cwd() when Node types are missing or restricted
  const env = loadEnv(mode, (process as any).cwd(), '');
  
  return {
    plugins: [react()],
    define: {
      // 2. Vercel tizimidagi (process.env) yoki .env faylidagi (env) o'zgaruvchilarni qidiramiz
      // Bu qism "process.env.X" so'zlarini haqiqiy qiymatlarga almashtiradi
      'process.env.API_KEY': JSON.stringify(process.env.API_KEY || env.API_KEY),
      'process.env.SUPABASE_URL': JSON.stringify(process.env.SUPABASE_URL || env.SUPABASE_URL),
      'process.env.SUPABASE_ANON_KEY': JSON.stringify(process.env.SUPABASE_ANON_KEY || env.SUPABASE_ANON_KEY),
    }
  };
});