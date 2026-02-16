
# 🎯 Global Foydalanuvchilar Bazasi (Supabase ulanishi)

Hamma ro'yxatdan o'tganlarni ko'rish uchun bu bosqichlarni 100% bajarishingiz shart:

### 1. Vercel-da kalitlarni sozlang
Vercel dashboard-ga kiring -> **Settings** -> **Environment Variables**.
Quyidagi 3 ta kalitni qo'shing:
- `API_KEY` (Gemini uchun)
- `SUPABASE_URL` (Supabase URL)
- `SUPABASE_ANON_KEY` (Supabase Anon Key)

**MUHIM:** Kalitlarni saqlagach, **Deployments** bo'limiga o'ting va oxirgi build-ni **Redeploy** qiling.

### 2. Supabase SQL Editor-ga yoziladigan kod
Supabase-da chap menuda **SQL Editor** bo'limiga kiring va quyidagi kodni nusxalab, **RUN** tugmasini bosing:

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

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all" ON users FOR ALL USING (true) WITH CHECK (true);
```

### 3. Tekshirish
Admin panelning tepasida **"Cloud Sync Active"** (yashil rangda) deb chiqsa, demak hamma ro'yxatdan o'tganlar sizga ko'rinadi.

Dasturchi: **Sodiqjon Mukhtorov**
