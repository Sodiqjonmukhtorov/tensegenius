
import React, { useState } from 'react';
import { Language, User } from '../types';
import { UI_STRINGS } from '../constants';
import { CheckCircle2, ArrowRight, ShieldCheck, RefreshCcw, UserPlus, HelpCircle, AlertCircle, MessageCircle } from 'lucide-react';
import { db } from '../database';

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
    if (loading) return;

    setError('');
    setLoading(true);
    const normalizedUsername = username.toLowerCase().trim();

    if (!validateUsername(normalizedUsername)) {
      setError(lang === 'uz' ? "Username xato! Faqat kichik harf, son va underscore." : "Invalid username!");
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
      // MUHIM: Loading-ni to'xtatamiz va visual pitichkani yoqamiz
      setLoading(false);
      setSuccess(strings.confirmed);
      
      // Majburiy 2.5 soniya visual "Pitichka"ni ko'rsatamiz
      setTimeout(() => {
        onLogin(newUser);
      }, 2500);
    } else {
      setError(result.error || "Database Error");
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    setError('');
    setLoading(true);
    const normalizedUsername = username.toLowerCase().trim();

    if (mode === 'admin') {
      if (normalizedUsername === 'sodiqjon_202' && password === 'sodiqjon_2010') {
        setLoading(false);
        setSuccess("Admin verified!");
        setTimeout(() => {
          onLogin({
            fullName: 'Sodiqjon (Admin)',
            username: 'sodiqjon_202',
            phone: '+998000000000',
            password: 'sodiqjon_2010',
            userCode: '#ADMIN000',
            progress: { completedTenses: [], unlockedTenses: [], xp: 9999, streak: 99, lastActive: new Date().toISOString(), level: 100 }
          }, true);
        }, 1500);
      } else {
        setError(lang === 'uz' ? "Admin parol xato!" : "Invalid admin password!");
        setLoading(false);
      }
      return;
    }

    const user = await db.getUserByUsername(normalizedUsername);
    if (user && user.password === password) {
      setLoading(false);
      setSuccess("Welcome back!");
      setTimeout(() => onLogin(user), 1500);
    } else {
      setError(lang === 'uz' ? "Login yoki parol xato!" : "Invalid login!");
      setLoading(false);
    }
  };

  const switchMode = (newMode: typeof mode) => {
    setMode(newMode);
    setError('');
    setSuccess('');
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4 relative overflow-hidden">
      <div className="fixed top-4 right-4 z-[100]">
        <button 
          onClick={() => switchMode(mode === 'admin' ? 'login' : 'admin')}
          className={`flex items-center gap-3 px-5 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all shadow-xl hover:scale-105 active:scale-95 border-b-4 ${mode === 'admin' ? 'bg-indigo-600 text-white border-indigo-900' : 'bg-slate-900 text-white border-slate-950'}`}
        >
          <ShieldCheck size={18} className="text-emerald-400" />
          {mode === 'admin' ? (lang === 'uz' ? 'Yopish' : 'Close') : (lang === 'uz' ? 'Admin Panel' : 'Admin')}
        </button>
      </div>

      <div className="w-full max-w-md space-y-6 animate-in fade-in zoom-in duration-500 relative z-10">
        <div className="text-center space-y-2">
           <h1 className="text-4xl font-black text-slate-900 tracking-tight">
             {mode === 'login' ? strings.login : mode === 'register' ? strings.register : mode === 'admin' ? 'Admin Login' : strings.resetPassword}
           </h1>
        </div>

        <div className="bg-white rounded-[2.5rem] p-6 md:p-10 shadow-2xl border border-slate-100 relative overflow-hidden min-h-[400px]">
           {(success || loading) && (
             <div className="absolute inset-0 z-20 bg-white/95 backdrop-blur-sm flex flex-col items-center justify-center space-y-6 animate-in fade-in">
                {success ? (
                  <div className="flex flex-col items-center gap-4">
                     <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center animate-in zoom-in duration-500">
                        <CheckCircle2 size={48} className="animate-bounce" />
                     </div>
                     <span className="text-xl font-black text-slate-900 text-center px-6">{success}</span>
                     <span className="text-xs font-bold text-slate-400 animate-pulse">Entering path...</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-4">
                     <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                     <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Database Sync...</span>
                  </div>
                )}
             </div>
           )}

           {mode === 'reset' ? (
             <div className="space-y-6 animate-in slide-in-from-bottom-4 text-center">
                <div className="bg-indigo-50 p-6 rounded-3xl border border-indigo-100 flex items-start gap-4 text-left">
                   <HelpCircle className="text-indigo-600 shrink-0 mt-1" size={24} />
                   <p className="text-xs text-indigo-700 font-medium leading-relaxed">
                     Parolni tiklash uchun adminga murojaat qiling.
                   </p>
                </div>
                <a 
                  href="https://t.me/sodiqjon_lutfullayevich" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-3 hover:bg-slate-800 transition-all shadow-xl"
                >
                  <MessageCircle size={18} className="text-emerald-400" /> Telegram Support
                </a>
                <button onClick={() => switchMode('login')} className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-slate-900">
                  Orqaga
                </button>
             </div>
           ) : (
             <form onSubmit={(mode === 'login' || mode === 'admin') ? handleLogin : handleRegister} className="space-y-5">
                <div className="space-y-4">
                   {mode === 'register' && (
                      <div className="space-y-1">
                         <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Ism-familiya</label>
                         <input type="text" required value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Full Name" className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 font-bold focus:outline-none focus:border-slate-900 transition-all shadow-sm" />
                      </div>
                   )}
                   <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Username</label>
                      <input type="text" required value={username} onChange={(e) => setUsername(e.target.value)} placeholder="username" className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 font-bold focus:outline-none focus:border-slate-900 transition-all shadow-sm" />
                   </div>
                   {mode === 'register' && (
                      <div className="space-y-1">
                         <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Telefon</label>
                         <input type="text" required value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+998" className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 font-bold focus:outline-none focus:border-slate-900 transition-all shadow-sm" />
                      </div>
                   )}
                   <div className="space-y-1">
                      <div className="flex justify-between items-center ml-4 mr-4">
                         <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Parol</label>
                         <button type="button" onClick={() => switchMode('reset')} className="text-[9px] font-black text-indigo-500 uppercase tracking-widest">
                           Unutdingizmi?
                         </button>
                      </div>
                      <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 font-bold focus:outline-none focus:border-slate-900 transition-all shadow-sm" />
                   </div>
                   {mode === 'register' && (
                      <div className="space-y-1">
                         <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Tasdiqlash</label>
                         <input type="password" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="••••••••" className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 font-bold focus:outline-none focus:border-slate-900 transition-all shadow-sm" />
                      </div>
                   )}
                </div>

                {error && (
                  <div className="bg-rose-50 border-2 border-rose-100 p-4 rounded-2xl flex items-start gap-3">
                     <AlertCircle size={18} className="text-rose-500 shrink-0 mt-0.5" />
                     <p className="text-[10px] font-black text-rose-600 leading-tight">{error}</p>
                  </div>
                )}

                <button type="submit" disabled={loading} className={`w-full ${mode === 'admin' ? 'bg-indigo-600' : 'bg-slate-900'} text-white py-5 rounded-2xl font-black text-base hover:opacity-95 transition-all shadow-2xl flex items-center justify-center gap-3 border-b-4 ${mode === 'admin' ? 'border-indigo-900' : 'border-slate-950'} disabled:opacity-50`}>
                  {mode === 'login' || mode === 'admin' ? strings.loginBtn : strings.registerBtn}
                  <ArrowRight size={18} />
                </button>
             </form>
           )}

           {mode !== 'reset' && (
             <div className="mt-8 pt-6 border-t border-slate-50 flex flex-col items-center gap-4">
                {mode === 'login' ? (
                  <button onClick={() => switchMode('register')} className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                    <UserPlus size={16} className="text-emerald-500" /> Ro'yxatdan o'tish
                  </button>
                ) : (
                  <button onClick={() => switchMode('login')} className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <RefreshCcw size={16} /> Kirishga qaytish
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
