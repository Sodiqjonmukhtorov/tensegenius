
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // 1. .env fayllaridan yuklaymiz
  const env = loadEnv(mode, (process as any).cwd(), '');
  
  return {
    plugins: [react()],
    define: {
      // 2. Vercel-dagi (process.env) yoki .env-dagi (env) qiymatlarni aniq koda yozish.
      // Agar qiymat topilmasa, "" (bo'sh string) qaytaradi (undefined o'rniga).
      'process.env.API_KEY': JSON.stringify(env.API_KEY || process.env.API_KEY || ""),
      'process.env.SUPABASE_URL': JSON.stringify(env.SUPABASE_URL || process.env.SUPABASE_URL || ""),
      'process.env.SUPABASE_ANON_KEY': JSON.stringify(env.SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || ""),
    }
  };
});
