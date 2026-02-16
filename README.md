# 🎯 TenseGenius-ni Vercel-ga yuklash bo'yicha to'liq qo'llanma

Tabriklayman! Saytingiz kodi tayyor. Uni Vercel-da to'liq ishlashi (AI bilan birga) uchun quyidagi amallarni bajaring:

### 1-qadam: GitHub-ga yuklash
Barcha fayllarni o'z GitHub hisobingizdagi yangi repoga joylang.

### 2-qadam: Vercel-da API_KEY-ni o'rnatish ⚠️
Bu eng muhim qadam, aks holda Panda Ustoz javob bermaydi:
1. [Vercel Dashboard](https://vercel.com/dashboard)ga kiring.
2. **tensegenius** loyihangizni tanlang.
3. Yuqoridagi menyudan **"Settings"** (Sozlamalar) tugmasini bosing.
4. Chap tarafdagi ustundan **"Environment Variables"** bo'limini tanlang.
5. **Key:** `API_KEY` deb yozing.
6. **Value:** [aistudio.google.com](https://aistudio.google.com/app/apikey) saytidan olgan maxfiy kalitingizni joylang.
7. **"Save"** yoki **"Add"** tugmasini bosing.

### 3-qadam: Saytni yangilash (Redeploy)
Sozlamalar saqlangandan so'ng:
1. **"Deployments"** bo'limiga o'ting.
2. Eng tepada turgan oxirgi yuklanma (deployment) yonidagi uchta nuqtani bosing.
3. **"Redeploy"** tugmasini bosing.

---
**Eslatma:** Kalitni kodning ichiga yozib yubormang, faqat Vercel Dashboard orqali kiriting. Bu xavfsizlik uchun juda muhim!

Dasturchi: **Sodiqjon Mukhtorov**
Platforma: **TenseGenius v2.5**
