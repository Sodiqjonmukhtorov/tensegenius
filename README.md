
# 🎯 TenseGenius-ni Bulutli Bazaga Ulash (Global Sinxronizatsiya)

Agar siz Admin panelida hamma foydalanuvchilarni ko'rishni xohlasangiz, quyidagi muhim bosqichlarni bajaring:

### 1-qadam: Supabase SQL-ni sozlash
1. [supabase.com](https://supabase.com)ga kiring va loyihangizni oching.
2. **"SQL Editor"** bo'limiga kiring va quyidagi kodni yuboring (run):

```sql
-- Jadval yaratish
CREATE TABLE IF NOT EXISTS users (
  id BIGSERIAL PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  user_code TEXT UNIQUE NOT NULL,
  progress JSONB DEFAULT '{"completedTenses": [], "unlockedTenses": ["pres-simple", "pres-cont", "past-simple"], "xp": 0, "streak": 1, "lastActive": "2024-01-01", "level": 1}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Xavfsizlik qoidalarini sozlash
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow all access" ON users;
CREATE POLICY "Allow all access" ON users FOR ALL USING (true) WITH CHECK (true);
```

### 2-qadam: Kalitlarni Vercel-ga qo'shish
Vercel settings (Environment Variables) bo'limida quyidagi kalitlar bo'lishi shart:
1. `API_KEY` - (Gemini AI kaliti)
2. `SUPABASE_URL` - (Supabase URL)
3. `SUPABASE_ANON_KEY` - (Supabase anon kaliti)

**DIQQAT:** Agar saytingizda hali ham "Local Storage Mode" deb chiqayotgan bo'lsa, demak Vercel-dagi kalitlar dasturga yetib bormayapti. Vercel-da kalitlarni saqlagandan keyin saytni "Redeploy" qilishni unutmang.

Dasturchi: **Sodiqjon Mukhtorov**
