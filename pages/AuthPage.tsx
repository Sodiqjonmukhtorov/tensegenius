import React, { useState } from 'react';
import { Language, User, UserProgress } from '../types';
import { UI_STRINGS } from '../constants';
import { UserCircle2, Phone, Lock, CheckCircle2, ArrowRight, ShieldCheck, RefreshCcw, KeyRound, UserPlus } from 'lucide-react';

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

  // Form states
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [phone, setPhone] = useState('+998');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const validateUsername = (name: string) => {
    return /^[a-z0-9_]+$/.test(name);
  };

  const generateUserCode = () => {
    return '#' + Math.floor(10000000 + Math.random() * 90000000).toString();
  };

  const getUsers = (): User[] => {
    const data = localStorage.getItem('tg_users');
    return data ? JSON.parse(data) : [];
  };

  const saveUser = (user: User) => {
    const users = getUsers();
    const existingIndex = users.findIndex(u => u.username === user.username);
    if (existingIndex >= 0) {
      users[existingIndex] = user;
    } else {
      users.push(user);
    }
    localStorage.setItem('tg_users', JSON.stringify(users));
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const normalizedUsername = username.toLowerCase().trim();

    if (!validateUsername(normalizedUsername)) {
      setError(lang === 'uz' ? "Username faqat kichik harflar, raqamlar va pastki chiziqdan iborat bo'lishi kerak!" : "Username must contain only lowercase letters, numbers, and underscores!");
      return;
    }

    const users = getUsers();
    // Username bandligini tekshirish (Check if username is taken)
    if (users.find(u => u.username === normalizedUsername)) {
      setError(lang === 'uz' ? "Bu username band! Boshqa username tanlang." : "This username is already taken! Please choose another.");
      return;
    }

    if (password !== confirmPassword) {
      setError(lang === 'uz' ? "Parollar mos kelmadi!" : "Passwords do not match!");
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

    saveUser(newUser);
    setSuccess(strings.confirmed);
    setTimeout(() => {
      onLogin(newUser);
    }, 1500);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const normalizedUsername = username.toLowerCase().trim();

    if (mode === 'admin') {
      if (normalizedUsername === 'sodiqjon_202' && password === 'sodiqjon_2010') {
        // Pass a dummy user object for the admin session to maintain persistence
        const adminUser: User = {
          fullName: 'Sodiqjon (Admin)',
          username: 'sodiqjon_202',
          phone: '+998000000000',
          password: 'sodiqjon_2010',
          userCode: '#ADMIN000',
          progress: {
            completedTenses: [],
            unlockedTenses: [],
            xp: 0,
            streak: 0,
            lastActive: new Date().toISOString(),
            level: 100
          }
        };
        onLogin(adminUser, true);
      } else {
        setError(lang === 'uz' ? "Admin login yoki parol xato!" : "Invalid admin credentials!");
      }
      return;
    }

    const users = getUsers();
    const user = users.find(u => u.username === normalizedUsername && u.password === password);

    if (user) {
      onLogin(user);
    } else {
      setError(lang === 'uz' ? "Username yoki parol xato!" : "Invalid username or password!");
    }
  };

  const handleResetVerification = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    const normalizedUsername = username.toLowerCase().trim();
    const users = getUsers();
    const user = users.find(u => u.username === normalizedUsername && u.phone === phone);

    if (user) {
      setSuccess(strings.confirmed);
      setTimeout(() => {
        setResetStep('changing');
        setSuccess('');
      }, 1500);
    } else {
      setError(lang === 'uz' ? "Username yoki telefon raqami mos kelmadi!" : "Username and phone do not match!");
    }
  };

  const handlePasswordUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError(lang === 'uz' ? "Parollar mos kelmadi!" : "Passwords do not match!");
      return;
    }

    const normalizedUsername = username.toLowerCase().trim();
    const users = getUsers();
    const userIndex = users.findIndex(u => u.username === normalizedUsername && u.phone === phone);

    if (userIndex >= 0) {
      users[userIndex].password = password;
      localStorage.setItem('tg_users', JSON.stringify(users));
      setSuccess(strings.confirmed);
      setTimeout(() => {
        onLogin(users[userIndex]);
      }, 1500);
    }
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
           {success && (
             <div className="absolute inset-0 z-20 bg-white/90 backdrop-blur-sm flex flex-col items-center justify-center space-y-4 animate-in fade-in">
                <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center text-white shadow-lg animate-bounce">
                   <CheckCircle2 size={40} />
                </div>
                <h3 className="text-2xl font-black text-slate-900">{success}</h3>
             </div>
           )}

           <form 
            onSubmit={
              (mode === 'login' || mode === 'admin') ? handleLogin : 
              mode === 'register' ? handleRegister : 
              (resetStep === 'identifying' ? handleResetVerification : handlePasswordUpdate)
            } 
            className="space-y-6"
           >
              <div className="space-y-4">
                 {/* Full Name - Only for registration */}
                 {mode === 'register' && (
                    <div className="space-y-1 animate-in slide-in-from-top-2">
                       <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">{strings.fullName}</label>
                       <div className="relative">
                          <UserCircle2 className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                          <input 
                           type="text" required value={fullName} 
                           onChange={(e) => setFullName(e.target.value)}
                           placeholder="Sodiqjon Mukhtorov"
                           className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl pl-12 pr-6 py-4 font-bold focus:outline-none focus:border-slate-900 transition-all"
                          />
                       </div>
                    </div>
                 )}

                 {/* Username - Hidden in step 2 of reset */}
                 {!(mode === 'reset' && resetStep === 'changing') && (
                    <div className="space-y-1">
                       <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">{strings.username}</label>
                       <div className="relative">
                          <UserCircle2 className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                          <input 
                           type="text" required value={username} 
                           onChange={(e) => setUsername(e.target.value)}
                           placeholder="username_00"
                           className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl pl-12 pr-6 py-4 font-bold focus:outline-none focus:border-slate-900 transition-all"
                          />
                       </div>
                    </div>
                 )}

                 {/* Phone - Only for register and step 1 of reset */}
                 {((mode === 'register') || (mode === 'reset' && resetStep === 'identifying')) && (
                    <div className="space-y-1 animate-in slide-in-from-top-2">
                       <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">{strings.phone}</label>
                       <div className="relative">
                          <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                          <input 
                            type="text" required value={phone} 
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="+998"
                            className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl pl-12 pr-6 py-4 font-bold focus:outline-none focus:border-slate-900 transition-all"
                          />
                       </div>
                    </div>
                 )}

                 {/* Password - Hidden during Step 1 of Reset */}
                 {((mode !== 'reset') || (mode === 'reset' && resetStep === 'changing')) && (
                    <div className="space-y-1 animate-in slide-in-from-top-2">
                       <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">
                         {mode === 'reset' ? (lang === 'uz' ? 'Yangi parol' : 'New Password') : strings.password}
                       </label>
                       <div className="relative">
                          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                          <input 
                           type="password" required value={password} 
                           onChange={(e) => setPassword(e.target.value)}
                           placeholder="••••••••"
                           className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl pl-12 pr-6 py-4 font-bold focus:outline-none focus:border-slate-900 transition-all"
                          />
                       </div>
                    </div>
                 )}

                 {/* Confirm Password - Hidden during Step 1 of Reset & Hidden in Login */}
                 {((mode === 'register') || (mode === 'reset' && resetStep === 'changing')) && (
                    <div className="space-y-1 animate-in slide-in-from-top-2">
                       <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">{strings.confirmPassword}</label>
                       <div className="relative">
                          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                          <input 
                            type="password" required value={confirmPassword} 
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="••••••••"
                            className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl pl-12 pr-6 py-4 font-bold focus:outline-none focus:border-slate-900 transition-all"
                          />
                       </div>
                    </div>
                 )}
              </div>

              {error && <p className="text-xs font-bold text-rose-500 text-center">{error}</p>}

              <button 
                type="submit"
                className={`w-full ${mode === 'admin' ? 'bg-indigo-600' : 'bg-slate-900'} text-white py-5 rounded-[2rem] font-black text-lg hover:opacity-90 transition-all shadow-xl active:scale-95 flex items-center justify-center gap-3`}
              >
                {mode === 'login' || mode === 'admin' ? strings.loginBtn : 
                 mode === 'register' ? strings.registerBtn : 
                 (resetStep === 'identifying' ? (lang === 'uz' ? "Tekshirish" : "Verify") : strings.resetPassword)}
                <ArrowRight size={20} />
              </button>
           </form>

           <div className="mt-8 pt-6 border-t border-slate-50 flex flex-col items-center gap-4">
              {mode === 'login' ? (
                <>
                  <button onClick={() => switchMode('register')} className="text-xs font-black text-emerald-600 uppercase tracking-widest hover:underline flex items-center gap-2">
                    <UserPlus size={14} />
                    {lang === 'uz' ? "Akkount ochish" : "Create an Account"}
                  </button>
                  <button onClick={() => switchMode('reset')} className="text-[10px] font-bold text-slate-400 uppercase tracking-widest hover:text-slate-600 transition-colors">
                    {strings.forgotPassword}
                  </button>
                  <button onClick={() => switchMode('admin')} className="text-[10px] font-black text-indigo-400 uppercase tracking-widest hover:text-indigo-600">
                    {strings.adminPanel}
                  </button>
                </>
              ) : (
                <button onClick={() => switchMode('login')} className="text-xs font-black text-slate-600 uppercase tracking-widest hover:underline flex items-center gap-2">
                  <RefreshCcw size={14} />
                  {lang === 'uz' ? "Kirishga qaytish" : "Back to Login"}
                </button>
              )}
           </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;