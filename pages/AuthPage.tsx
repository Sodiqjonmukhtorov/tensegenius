
import React, { useState } from 'react';
import { Language, User } from '../types';
import { UI_STRINGS } from '../constants';
import { UserCircle2, Phone, Lock, CheckCircle2, ArrowRight, ShieldCheck, RefreshCcw, UserPlus, HelpCircle, AlertCircle, MessageCircle, ArrowLeft, Settings, Key, Globe, Database, ExternalLink, Shield } from 'lucide-react';
import { db, supabase } from '../database';

interface AuthPageProps {
  lang: Language;
  onLogin: (user: User, isAdmin?: boolean) => void;
}

const AuthPage: React.FC<AuthPageProps> = ({ lang, onLogin }) => {
  const strings = UI_STRINGS[lang];
  const [mode, setMode] = useState<'login' | 'register' | 'reset' | 'admin'>('login');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [showSetupGuide, setShowSetupGuide] = useState(false);

  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [phone, setPhone] = useState('+998');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const validateUsername = (name: string) => /^[a-z0-9_]+$/.test(name);
  const generateUserCode = () => '#' + Math.floor(10000000 + Math.random() * 90000000).toString();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!supabase) {
      setError(lang === 'uz' 
        ? "⚠️ Baza ulanmagan! Kalitlarni tekshirib, Vercel-da 'Redeploy' qiling." 
        : "⚠️ DB not connected! Check keys and Redeploy in Vercel.");
      setShowSetupGuide(true);
      return;
    }

    setLoading(true);
    const normalizedUsername = username.toLowerCase().trim();

    if (!validateUsername(normalizedUsername)) {
      setError(lang === 'uz' ? "Username faqat kichik harf va raqamlardan iborat bo'lsin!" : "Username must be lowercase and numbers only!");
      setLoading(false);
      return;
    }

    const existing = await db.getUserByUsername(normalizedUsername);
    if (existing) {
      setError(lang === 'uz' ? "Bu username band!" : "Username already taken!");
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError(lang === 'uz' ? "Parollar mos kelmadi!" : "Passwords do not match!");
      setLoading(false);
      return;
    }

    const newUser: User = {
      fullName,
      username: normalizedUsername,
      phone,
      password,
      userCode: generateUserCode(),
      progress: {
        completedTenses: [],
        unlockedTenses: ['pres-simple', 'pres-cont', 'past-simple'],
        xp: 0,
        streak: 1,
        lastActive: new Date().toISOString(),
        level: 1
      }
    };

    const result = await db.registerUser(newUser);
    if (result.success) {
      setSuccess(strings.confirmed);
      setTimeout(() => onLogin(newUser), 1500);
    } else {
      setError(lang === 'uz' 
        ? `Xatolik: ${result.error}. (Eslatma: Supabase-da SQL Editor-da 'users' jadvalini yaratganingizga ishonch hosil qiling!)` 
        : `Error: ${result.error}. (Make sure you created 'users' table in Supabase SQL Editor!)`);
      if (result.error?.includes('404')) setShowSetupGuide(true);
    }
    setLoading(false);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!supabase && mode !== 'admin') {
      setError(lang === 'uz' ? "⚠️ Baza ulanmagan! Vercel-da 'Redeploy' qiling." : "⚠️ DB not connected! Redeploy in Vercel.");
      setShowSetupGuide(true);
      return;
    }

    setLoading(true);
    const normalizedUsername = username.toLowerCase().trim();

    if (mode === 'admin') {
      if (normalizedUsername === 'sodiqjon_202' && password === 'sodiqjon_2010') {
        const adminUser: User = {
          fullName: 'Sodiqjon (Admin)',
          username: 'sodiqjon_202',
          phone: '+998000000000',
          password: 'sodiqjon_2010',
          userCode: '#ADMIN000',
          progress: { completedTenses: [], unlockedTenses: [], xp: 0, streak: 0, lastActive: new Date().toISOString(), level: 100 }
        };
        onLogin(adminUser, true);
      } else {
        setError(lang === 'uz' ? "Admin parol xato!" : "Invalid admin password!");
      }
      setLoading(false);
      return;
    }

    const user = await db.getUserByUsername(normalizedUsername);
    if (user && user.password === password) {
      onLogin(user);
    } else {
      setError(lang === 'uz' ? "Login yoki parol xato!" : "Invalid login!");
    }
    setLoading(false);
  };

  const switchMode = (newMode: typeof mode) => {
    setMode(newMode);
    setError('');
    setSuccess('');
    setShowSetupGuide(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-[120px] translate-x-1/2 translate-y-1/2"></div>

      <div className="fixed top-4 right-4 md:top-8 md:right-8 z-[100]">
        <button 
          onClick={() => switchMode(mode === 'admin' ? 'login' : 'admin')}
          className={`flex items-center gap-3 px-5 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all shadow-xl hover:scale-105 active:scale-95 border-b-4 ${mode === 'admin' ? 'bg-indigo-600 text-white border-indigo-900' : 'bg-slate-900 text-white border-slate-950'}`}
        >
          <ShieldCheck size={18} className={mode === 'admin' ? 'text-emerald-400' : 'text-emerald-500'} />
          {mode === 'admin' ? (lang === 'uz' ? 'Yopish' : 'Close') : (lang === 'uz' ? 'Admin Panel' : 'Admin')}
        </button>
      </div>

      <div className="w-full max-w-md space-y-6 animate-in fade-in zoom-in duration-500 relative z-10">
        <div className="text-center space-y-2">
           <h1 className="text-4xl font-black text-slate-900 tracking-tight">
             {mode === 'login' ? strings.login : mode === 'register' ? strings.register : mode === 'admin' ? 'Admin Login' : strings.resetPassword}
           </h1>
           <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">TenseGenius Mastery AI</p>
        </div>

        {showSetupGuide && (
          <div className="bg-white rounded-[2.5rem] p-8 shadow-2xl border-4 border-indigo-500 border-dashed animate-in slide-in-from-bottom-8 max-h-[85vh] overflow-y-auto">
             <div className="flex items-center gap-3 text-indigo-600 mb-6">
                <div className="p-2 bg-indigo-50 rounded-xl">
                  <Database size={24} className="animate-pulse" />
                </div>
                <div>
                   <h3 className="font-black text-sm uppercase tracking-widest">Supabase Xatosi (404)</h3>
                   <p className="text-[10px] text-slate-400 font-bold uppercase">Jadval topilmadi!</p>
                </div>
             </div>

             <div className="space-y-6">
                <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800 space-y-3">
                  <span className="text-[9px] font-black text-indigo-400 uppercase tracking-widest">Muhim:</span>
                  <p className="text-xs font-bold text-white">Supabase SQL Editor-da jadval yaratuvchi kodni ishlatdingizmi?</p>
                  <ol className="text-[10px] text-slate-400 space-y-1 list-decimal ml-4">
                    <li>Supabase Dashboard -> SQL Editor</li>
                    <li>"New Query" tugmasini bosing</li>
                    <li>SQL kodni ko'chirib o'tkazing va "RUN" bosing</li>
                  </ol>
                </div>

                <button 
                  onClick={() => window.location.reload()}
                  className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-xl"
                >
                  Qayta urinish
                </button>
             </div>
          </div>
        )}

        <div className="bg-white rounded-[2.5rem] p-6 md:p-10 shadow-2xl border border-slate-100 relative overflow-hidden">
           {(success || loading) && (
             <div className="absolute inset-0 z-20 bg-white/95 backdrop-blur-sm flex flex-col items-center justify-center space-y-6 animate-in fade-in">
                {success ? (
                  <>
                    <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center text-white shadow-2xl animate-bounce">
                       <CheckCircle2 size={40} />
                    </div>
                    <h3 className="text-2xl font-black text-slate-900">{success}</h3>
                  </>
                ) : (
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-slate-900 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Ishlanmoqda...</p>
                  </div>
                )}
             </div>
           )}

           {mode === 'reset' ? (
             <div className="space-y-6 animate-in slide-in-from-bottom-4">
                <div className="bg-indigo-50 p-6 rounded-3xl border border-indigo-100 flex items-start gap-4">
                   <HelpCircle className="text-indigo-600 shrink-0 mt-1" size={24} />
                   <div className="space-y-1">
                      <h4 className="font-black text-indigo-900 text-sm">{strings.resetPassword}</h4>
                      <p className="text-xs text-indigo-700 font-medium leading-relaxed">
                        Parolni tiklash uchun adminga murojaat qiling.
                      </p>
                   </div>
                </div>
                <div className="space-y-3">
                   <a href="https://t.me/sodiqjon_202" target="_blank" rel="noopener noreferrer" className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-3 hover:bg-slate-800 transition-all shadow-xl">
                     <MessageCircle size={18} className="text-emerald-400" /> Telegram
                   </a>
                   <button onClick={() => switchMode('login')} className="w-full bg-slate-50 text-slate-500 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-slate-100 transition-all">
                     <ArrowLeft size={14} /> Orqaga
                   </button>
                </div>
             </div>
           ) : (
             <form onSubmit={(mode === 'login' || mode === 'admin') ? handleLogin : handleRegister} className="space-y-5">
                <div className="space-y-4">
                   {mode === 'register' && (
                      <div className="space-y-1">
                         <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">{strings.fullName}</label>
                         <div className="relative">
                            <UserCircle2 className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                            <input type="text" required value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Ismingiz" className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl pl-14 pr-6 py-4 font-bold focus:outline-none focus:border-slate-900 transition-all shadow-sm" />
                         </div>
                      </div>
                   )}
                   <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">{strings.username}</label>
                      <div className="relative">
                         <UserCircle2 className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                         <input type="text" required value={username} onChange={(e) => setUsername(e.target.value)} placeholder="username" className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl pl-14 pr-6 py-4 font-bold focus:outline-none focus:border-slate-900 transition-all shadow-sm" />
                      </div>
                   </div>
                   {mode === 'register' && (
                      <div className="space-y-1">
                         <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">{strings.phone}</label>
                         <div className="relative">
                            <Phone className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                            <input type="text" required value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+998" className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl pl-14 pr-6 py-4 font-bold focus:outline-none focus:border-slate-900 transition-all shadow-sm" />
                         </div>
                      </div>
                   )}
                   <div className="space-y-1">
                      <div className="flex justify-between items-center ml-4 mr-4">
                         <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">{strings.password}</label>
                         <button type="button" onClick={() => switchMode('reset')} className="text-[9px] font-black text-indigo-500 uppercase tracking-widest hover:text-indigo-700">
                           Unutdingizmi?
                         </button>
                      </div>
                      <div className="relative">
                         <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                         <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl pl-14 pr-6 py-4 font-bold focus:outline-none focus:border-slate-900 transition-all shadow-sm" />
                      </div>
                   </div>
                   {mode === 'register' && (
                      <div className="space-y-1">
                         <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">{strings.confirmPassword}</label>
                         <div className="relative">
                            <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                            <input type="password" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="••••••••" className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl pl-14 pr-6 py-4 font-bold focus:outline-none focus:border-slate-900 transition-all shadow-sm" />
                         </div>
                      </div>
                   )}
                </div>

                {error && (
                  <div className="bg-rose-50 border-2 border-rose-100 p-4 rounded-2xl flex items-start gap-3 animate-in slide-in-from-top-2">
                     <AlertCircle size={18} className="text-rose-500 shrink-0 mt-0.5" />
                     <p className="text-[10px] font-black text-rose-600 leading-tight">{error}</p>
                  </div>
                )}

                <button type="submit" className={`w-full ${mode === 'admin' ? 'bg-indigo-600' : 'bg-slate-900'} text-white py-5 rounded-2xl font-black text-base hover:opacity-95 transition-all shadow-2xl flex items-center justify-center gap-3 border-b-4 ${mode === 'admin' ? 'border-indigo-900' : 'border-slate-950'}`}>
                  {mode === 'login' || mode === 'admin' ? strings.loginBtn : strings.registerBtn}
                  <ArrowRight size={18} />
                </button>
             </form>
           )}

           {mode !== 'reset' && (
             <div className="mt-8 pt-6 border-t border-slate-50 flex flex-col items-center gap-4">
                {mode === 'login' ? (
                  <button onClick={() => switchMode('register')} className="group text-[10px] font-black text-slate-500 hover:text-emerald-600 transition-colors uppercase tracking-widest flex items-center gap-2">
                    <UserPlus size={16} className="text-emerald-500" />
                    Ro'yxatdan o'tish
                  </button>
                ) : (
                  <button onClick={() => switchMode('login')} className="group text-[10px] font-black text-slate-500 hover:text-indigo-600 transition-colors uppercase tracking-widest flex items-center gap-2">
                    <RefreshCcw size={16} className="text-indigo-500" />
                    Kirishga qaytish
                  </button>
                )}
             </div>
           )}
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
