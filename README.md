
# 🎯 Global Foydalanuvchilar Bazasi (Supabase ulanishi)

Hamma royxatdan otganlarni korish uchun bu bosqichlarni 100% bajarishingiz shart:

### 1. Vercel-da kalitlarni sozlang
Agar loyihangiz Vercel-da bo'lsa:
1. Vercel dashboard-ga kiring.
2. **Settings** -> **Environment Variables** bo'limiga o'ting.
3. Quyidagi 3 ta kalitni qo'shing:
   - `API_KEY` (Gemini uchun)
   - `SUPABASE_URL` (Supabase URL)
   - `SUPABASE_ANON_KEY` (Supabase Anon Key)
4. Kalitlarni saqlagach, **Deployments** bo'limiga o'ting va oxirgi build-ni **Redeploy** qiling.

### 2. Supabase SQL (Jadval bormi?)
Supabase-da "SQL Editor" bo'limida ushbu jadval yaratilganini tekshiring:
```sql
CREATE TABLE IF NOT EXISTS users (
  id BIGSERIAL PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  user_code TEXT UNIQUE NOT NULL,
  progress JSONB DEFAULT '{"xp":0, "level":1, "completedTenses":[], "unlockedTenses":["pres-simple"]}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
-- RLS (Xavfsizlik) ochiq bo'lishi shart
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all" ON users FOR ALL USING (true) WITH CHECK (true);
```

### 3. Natijani tekshirish
Saytga kirganingizda Admin panelning tepasida **"Cloud Sync Active"** (yashil rangda) deb chiqsa, demak hamma royxatdan otganlar sizga korinadi. Agar **"Local Storage Mode"** (sariq rangda) bo'lsa, demak ulanish xato.

Dasturchi: **Sodiqjon Mukhtorov**
