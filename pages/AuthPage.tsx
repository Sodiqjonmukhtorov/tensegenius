
import React, { useState } from 'react';
import { Language, User } from '../types';
import { UI_STRINGS } from '../constants';
import { UserCircle2, Phone, Lock, CheckCircle2, ArrowRight, ShieldCheck, RefreshCcw, UserPlus, HelpCircle, AlertCircle } from 'lucide-react';
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
      setError(lang === 'uz' ? "Baza bilan aloqa yo'q! Vercel sozlamalarini tekshiring." : "Database connection missing! Check Vercel settings.");
      return;
    }

    setLoading(true);
    const normalizedUsername = username.toLowerCase().trim();

    if (!validateUsername(normalizedUsername)) {
      setError(lang === 'uz' ? "Username faqat kichik harflar, raqamlar va (_) bo'lishi kerak!" : "Username must be lowercase, numbers and (_).");
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

    const registered = await db.registerUser(newUser);
    if (registered) {
      setSuccess(strings.confirmed);
      setTimeout(() => onLogin(newUser), 1500);
    } else {
      setError(lang === 'uz' ? "Ro'yxatdan o'tishda xatolik. Qaytadan urinib ko'ring." : "Registration failed. Please try again.");
    }
    setLoading(false);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
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
        setError(lang === 'uz' ? "Admin login yoki parol xato!" : "Invalid admin credentials!");
      }
      setLoading(false);
      return;
    }

    const user = await db.getUserByUsername(normalizedUsername);
    if (user && user.password === password) {
      onLogin(user);
    } else {
      setError(lang === 'uz' ? "Username yoki parol xato!" : "Invalid username or password!");
    }
    setLoading(false);
  };

  const switchMode = (newMode: typeof mode) => {
    setMode(newMode);
    setError('');
    setSuccess('');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>

      {/* ADMIN BUTTON - Floating in the top right corner */}
      <div className="fixed top-8 right-8 z-50">
        <button 
          onClick={() => switchMode(mode === 'admin' ? 'login' : 'admin')}
          className={`group flex items-center gap-3 px-5 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl hover:scale-105 active:scale-95 border-b-4 ${mode === 'admin' ? 'bg-slate-900 text-white border-slate-950' : 'bg-white text-indigo-600 border-indigo-100 hover:border-indigo-200'}`}
        >
          <ShieldCheck size={18} className={mode === 'admin' ? 'text-emerald-400' : 'text-indigo-500 group-hover:animate-pulse'} />
          {mode === 'admin' ? (lang === 'uz' ? 'Foydalanuvchi' : 'User Mode') : strings.adminPanel}
        </button>
      </div>

      <div className="w-full max-w-md space-y-8 animate-in fade-in zoom-in duration-500 relative z-10">
        <div className="text-center space-y-4">
           <div className="inline-flex items-center gap-3 px-6 py-2 bg-slate-900 text-white rounded-2xl shadow-2xl rotate-1">
             <div className="w-6 h-6 bg-emerald-500 rounded-lg flex items-center justify-center">
                <ShieldCheck size={14} className="text-white" />
             </div>
             <span className="font-black tracking-[0.2em] uppercase text-[10px]">
               {mode === 'admin' ? 'System Administrator' : 'Secure Access'}
             </span>
           </div>
           <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight pt-2">
             {mode === 'login' ? strings.login : mode === 'register' ? strings.register : mode === 'admin' ? 'Admin Login' : strings.resetPassword}
           </h1>
        </div>

        <div className="bg-white rounded-[3rem] p-8 md:p-10 shadow-3xl border border-slate-100 relative overflow-hidden">
           {(success || loading) && (
             <div className="absolute inset-0 z-20 bg-white/95 backdrop-blur-sm flex flex-col items-center justify-center space-y-4 animate-in fade-in">
                {success ? (
                  <>
                    <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center text-white shadow-lg animate-bounce">
                       <CheckCircle2 size={40} />
                    </div>
                    <h3 className="text-2xl font-black text-slate-900">{success}</h3>
                  </>
                ) : (
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-slate-900 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Processing Data...</p>
                  </div>
                )}
             </div>
           )}

           <form onSubmit={(mode === 'login' || mode === 'admin') ? handleLogin : handleRegister} className="space-y-6">
              <div className="space-y-4">
                 {mode === 'register' && (
                    <div className="space-y-1 animate-in slide-in-from-top-2">
                       <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">{strings.fullName}</label>
                       <div className="relative">
                          <UserCircle2 className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                          <input type="text" required value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Sodiqjon Mukhtorov" className="w-full bg-slate-50 border-2 border-slate-100 rounded-3xl pl-14 pr-6 py-4.5 font-bold focus:outline-none focus:border-slate-900 transition-all placeholder:text-slate-300" />
                       </div>
                    </div>
                 )}
                 <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">{strings.username}</label>
                    <div className="relative">
                       <UserCircle2 className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                       <input type="text" required value={username} onChange={(e) => setUsername(e.target.value)} placeholder="username_00" className="w-full bg-slate-50 border-2 border-slate-100 rounded-3xl pl-14 pr-6 py-4.5 font-bold focus:outline-none focus:border-slate-900 transition-all placeholder:text-slate-300" />
                    </div>
                 </div>
                 {mode === 'register' && (
                    <div className="space-y-1 animate-in slide-in-from-top-2">
                       <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">{strings.phone}</label>
                       <div className="relative">
                          <Phone className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                          <input type="text" required value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+998" className="w-full bg-slate-50 border-2 border-slate-100 rounded-3xl pl-14 pr-6 py-4.5 font-bold focus:outline-none focus:border-slate-900 transition-all placeholder:text-slate-300" />
                       </div>
                    </div>
                 )}
                 <div className="space-y-1 animate-in slide-in-from-top-2">
                    <div className="flex justify-between items-center ml-4 mr-4">
                       <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">{strings.password}</label>
                       {mode === 'login' && (
                         <button type="button" onClick={() => switchMode('reset')} className="text-[9px] font-black text-indigo-500 uppercase tracking-widest hover:text-indigo-700">
                           {strings.forgotPassword}
                         </button>
                       )}
                    </div>
                    <div className="relative">
                       <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                       <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="w-full bg-slate-50 border-2 border-slate-100 rounded-3xl pl-14 pr-6 py-4.5 font-bold focus:outline-none focus:border-slate-900 transition-all placeholder:text-slate-300" />
                    </div>
                 </div>
                 {mode === 'register' && (
                    <div className="space-y-1 animate-in slide-in-from-top-2">
                       <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">{strings.confirmPassword}</label>
                       <div className="relative">
                          <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                          <input type="password" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="••••••••" className="w-full bg-slate-50 border-2 border-slate-100 rounded-3xl pl-14 pr-6 py-4.5 font-bold focus:outline-none focus:border-slate-900 transition-all placeholder:text-slate-300" />
                       </div>
                    </div>
                 )}
              </div>

              {error && (
                <div className="bg-rose-50 border-2 border-rose-100 p-4 rounded-2xl flex items-center gap-3 animate-shake">
                   <AlertCircle size={18} className="text-rose-500 shrink-0" />
                   <p className="text-xs font-black text-rose-600 leading-tight">{error}</p>
                </div>
              )}

              <button type="submit" className={`w-full ${mode === 'admin' ? 'bg-indigo-600' : 'bg-slate-900'} text-white py-5 rounded-3xl font-black text-lg hover:opacity-95 transition-all shadow-2xl active:scale-95 flex items-center justify-center gap-3 group`}>
                {mode === 'login' || mode === 'admin' ? strings.loginBtn : strings.registerBtn}
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </button>
           </form>

           {/* Alternate Mode Links */}
           <div className="mt-8 pt-6 border-t border-slate-50 flex flex-col items-center gap-4">
              {mode === 'login' ? (
                <button onClick={() => switchMode('register')} className="group text-xs font-black text-slate-500 hover:text-emerald-600 transition-colors uppercase tracking-widest flex items-center gap-2">
                  <UserPlus size={16} className="text-emerald-500 group-hover:scale-110 transition-transform" />
                  {lang === 'uz' ? "Yangi hisob ochish" : "Create a new account"}
                </button>
              ) : (
                <button onClick={() => switchMode('login')} className="group text-xs font-black text-slate-500 hover:text-indigo-600 transition-colors uppercase tracking-widest flex items-center gap-2">
                  <RefreshCcw size={16} className="text-indigo-500 group-hover:rotate-180 transition-transform duration-500" />
                  {lang === 'uz' ? "Kirishga qaytish" : "Back to login"}
                </button>
              )}
           </div>
        </div>

        {/* Footer info */}
        <p className="text-center text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">
          Powered by TenseGenius v2.5
        </p>
      </div>
    </div>
  );
};

export default AuthPage;
