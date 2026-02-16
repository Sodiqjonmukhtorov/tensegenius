
# 🚀 TenseGenius - Doimiy Bazani Sozlash

Foydalanuvchilar Admin panelda har doim saqlanib qolishi uchun quyidagi bosqichlarni bajaring:

### 1. Vercel-da kalitlarni qo'shish
Vercel dashboard-ga kiring -> **Project Settings** -> **Environment Variables**.
Quyidagi 2 ta kalitni qo'shing (Ularni Supabase-dan olasiz):
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`

**MUHIM:** Kalitlarni saqlagach, oxirgi marta **Redeploy** qiling.

### 2. Supabase SQL Editor-da jadval yaratish
Supabase dashboard-ga kiring, chap menyudan **SQL Editor** bo'limini oching va quyidagi kodni **Run** qiling:

```sql
CREATE TABLE IF NOT EXISTS users (
  id BIGSERIAL PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  user_code TEXT UNIQUE NOT NULL,
  progress JSONB DEFAULT '{"xp":0, "level":1, "completedTenses":[], "unlockedTenses":["pres-simple", "pres-cont", "past-simple"]}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Xavfsizlikni o'chirish (o'quv loyihasi uchun osonlik yaratadi)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all" ON users FOR ALL USING (true) WITH CHECK (true);
```

### 3. Tekshirish
Admin panelga kiring. Agar yuqorida **"Cloud Live"** (yashil) degan yozuv paydo bo'lsa, demak ma'lumotlar endi hech qachon yo'qolmaydi!

---
Dasturchi: **Sodiqjon Mukhtorov**
