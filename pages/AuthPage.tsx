
import React, { useState } from 'react';
import { Language, User } from '../types';
import { UI_STRINGS } from '../constants';
import { UserCircle2, Phone, Lock, CheckCircle2, ArrowRight, ShieldCheck, RefreshCcw, UserPlus } from 'lucide-react';
import { db } from '../database';

interface AuthPageProps {
  lang: Language;
  onLogin: (user: User, isAdmin?: boolean) => void;
}

const AuthPage: React.FC<AuthPageProps> = ({ lang, onLogin }) => {
  const strings = UI_STRINGS[lang];
  const [mode, setMode] = useState<'login' | 'register' | 'reset' | 'admin'>('login');
  const [resetStep, setResetStep] = useState<'identifying' | 'changing'>('identifying');
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
    setLoading(true);

    const normalizedUsername = username.toLowerCase().trim();

    if (!validateUsername(normalizedUsername)) {
      setError(lang === 'uz' ? "Username faqat kichik harflar, raqamlar va pastki chiziqdan iborat bo'lishi kerak!" : "Username must contain only lowercase letters, numbers, and underscores!");
      setLoading(false);
      return;
    }

    const existing = await db.getUserByUsername(normalizedUsername);
    if (existing) {
      setError(lang === 'uz' ? "Bu username band! Boshqa username tanlang." : "This username is already taken! Please choose another.");
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
      setError("Registration failed. Please try again.");
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
    setResetStep('identifying');
    setError('');
    setSuccess('');
    setPassword('');
    setConfirmPassword('');
    setUsername('');
    setFullName('');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
      <div className="w-full max-w-md space-y-8 animate-in fade-in zoom-in duration-500">
        <div className="text-center space-y-2">
           <div className={`inline-flex items-center gap-3 px-4 py-2 ${mode === 'admin' ? 'bg-indigo-600' : 'bg-slate-900'} text-white rounded-2xl shadow-xl rotate-1`}>
             <ShieldCheck className={mode === 'admin' ? 'text-white' : 'text-emerald-400'} />
             <span className="font-black tracking-widest uppercase text-xs">
               {mode === 'admin' ? 'TenseGenius Admin' : 'TenseGenius Auth'}
             </span>
           </div>
           <h1 className="text-4xl font-black text-slate-900 tracking-tight pt-4">
             {mode === 'login' ? strings.login : mode === 'register' ? strings.register : mode === 'admin' ? strings.adminPanel : strings.resetPassword}
           </h1>
        </div>

        <div className="bg-white rounded-[3rem] p-8 shadow-2xl border border-slate-100 relative overflow-hidden">
           {(success || loading) && (
             <div className="absolute inset-0 z-20 bg-white/90 backdrop-blur-sm flex flex-col items-center justify-center space-y-4 animate-in fade-in">
                {success ? (
                  <>
                    <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center text-white shadow-lg animate-bounce">
                       <CheckCircle2 size={40} />
                    </div>
                    <h3 className="text-2xl font-black text-slate-900">{success}</h3>
                  </>
                ) : (
                  <div className="w-12 h-12 border-4 border-slate-900 border-t-transparent rounded-full animate-spin"></div>
                )}
             </div>
           )}

           <form onSubmit={(mode === 'login' || mode === 'admin') ? handleLogin : handleRegister} className="space-y-6">
              <div className="space-y-4">
                 {mode === 'register' && (
                    <div className="space-y-1 animate-in slide-in-from-top-2">
                       <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">{strings.fullName}</label>
                       <div className="relative">
                          <UserCircle2 className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                          <input type="text" required value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Sodiqjon Mukhtorov" className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl pl-12 pr-6 py-4 font-bold focus:outline-none focus:border-slate-900 transition-all" />
                       </div>
                    </div>
                 )}
                 <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">{strings.username}</label>
                    <div className="relative">
                       <UserCircle2 className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                       <input type="text" required value={username} onChange={(e) => setUsername(e.target.value)} placeholder="username_00" className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl pl-12 pr-6 py-4 font-bold focus:outline-none focus:border-slate-900 transition-all" />
                    </div>
                 </div>
                 {mode === 'register' && (
                    <div className="space-y-1 animate-in slide-in-from-top-2">
                       <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">{strings.phone}</label>
                       <div className="relative">
                          <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                          <input type="text" required value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+998" className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl pl-12 pr-6 py-4 font-bold focus:outline-none focus:border-slate-900 transition-all" />
                       </div>
                    </div>
                 )}
                 <div className="space-y-1 animate-in slide-in-from-top-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">{strings.password}</label>
                    <div className="relative">
                       <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                       <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl pl-12 pr-6 py-4 font-bold focus:outline-none focus:border-slate-900 transition-all" />
                    </div>
                 </div>
                 {mode === 'register' && (
                    <div className="space-y-1 animate-in slide-in-from-top-2">
                       <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">{strings.confirmPassword}</label>
                       <div className="relative">
                          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                          <input type="password" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="••••••••" className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl pl-12 pr-6 py-4 font-bold focus:outline-none focus:border-slate-900 transition-all" />
                       </div>
                    </div>
                 )}
              </div>
              {error && <p className="text-xs font-bold text-rose-500 text-center">{error}</p>}
              <button type="submit" className={`w-full ${mode === 'admin' ? 'bg-indigo-600' : 'bg-slate-900'} text-white py-5 rounded-[2rem] font-black text-lg hover:opacity-90 transition-all shadow-xl active:scale-95 flex items-center justify-center gap-3`}>
                {mode === 'login' || mode === 'admin' ? strings.loginBtn : strings.registerBtn}
                <ArrowRight size={20} />
              </button>
           </form>

           <div className="mt-8 pt-6 border-t border-slate-50 flex flex-col items-center gap-4">
              {mode === 'login' ? (
                <>
                  <button onClick={() => switchMode('register')} className="text-xs font-black text-emerald-600 uppercase tracking-widest hover:underline flex items-center gap-2">
                    <UserPlus size={14} /> {lang === 'uz' ? "Akkount ochish" : "Create an Account"}
                  </button>
                  <button onClick={() => switchMode('admin')} className="text-[10px] font-black text-indigo-400 uppercase tracking-widest hover:text-indigo-600">{strings.adminPanel}</button>
                </>
              ) : (
                <button onClick={() => switchMode('login')} className="text-xs font-black text-slate-600 uppercase tracking-widest hover:underline flex items-center gap-2">
                  <RefreshCcw size={14} /> {lang === 'uz' ? "Kirishga qaytish" : "Back to Login"}
                </button>
              )}
           </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
