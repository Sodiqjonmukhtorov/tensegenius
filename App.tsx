
import React, { useState, useEffect } from 'react';
import { Language, User, AuthState } from './types';
import { UI_STRINGS } from './constants';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import LessonPage from './pages/LessonPage';
import BasicsPage from './pages/BasicsPage';
import VocabularyPage from './pages/VocabularyPage';
import PandaMascot from './components/PandaMascot';
import AuthPage from './pages/AuthPage';
import SplashScreen from './components/SplashScreen';
import AdminPanel from './pages/AdminPanel';
import { db, supabase } from './database';
import { Database, ShieldAlert, RefreshCcw } from 'lucide-react';

const UNLOCK_COST = 200;

const App: React.FC = () => {
  const [lang, setLang] = useState<Language>(() => (localStorage.getItem('tg_lang') as Language) || 'uz');
  const [currentPath, setCurrentPath] = useState('/dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showSplash, setShowSplash] = useState(true);
  const [showSetupBanner, setShowSetupBanner] = useState(!supabase);

  const [auth, setAuth] = useState<AuthState>(() => {
    const saved = localStorage.getItem('tg_current_session');
    const isAdmin = localStorage.getItem('tg_admin_mode') === 'true';
    if (saved) return { currentUser: JSON.parse(saved), isAuthenticated: true, isAdmin };
    return { currentUser: null, isAuthenticated: false, isAdmin: false };
  });

  useEffect(() => {
    localStorage.setItem('tg_lang', lang);
  }, [lang]);

  useEffect(() => {
    if (auth.isAuthenticated && auth.currentUser && supabase) {
      const channel = supabase
        .channel(`user-${auth.currentUser.username}`)
        .on('postgres_changes', { 
          event: 'UPDATE', 
          schema: 'public', 
          table: 'users', 
          filter: `username=eq.${auth.currentUser.username}` 
        }, (payload) => {
          const updatedUser: User = {
            fullName: payload.new.full_name,
            username: payload.new.username,
            phone: payload.new.phone,
            password: payload.new.password,
            userCode: payload.new.user_code,
            progress: payload.new.progress
          };
          setAuth(prev => ({ ...prev, currentUser: updatedUser }));
          localStorage.setItem('tg_current_session', JSON.stringify(updatedUser));
        })
        .subscribe();
      return () => { supabase.removeChannel(channel); };
    }
  }, [auth.isAuthenticated, auth.currentUser?.username]);

  const handleLogin = (user: User, isAdmin: boolean = false) => {
    setAuth({ currentUser: user, isAuthenticated: true, isAdmin });
    localStorage.setItem('tg_current_session', JSON.stringify(user));
    localStorage.setItem('tg_admin_mode', isAdmin.toString());
  };

  const handleLogout = () => {
    setAuth({ currentUser: null, isAuthenticated: false, isAdmin: false });
    localStorage.removeItem('tg_current_session');
    localStorage.removeItem('tg_admin_mode');
    setCurrentPath('/dashboard');
  };

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  const handleNavigate = (path: string) => {
    if (path.startsWith('/lesson/')) {
      const tenseId = path.split('/').pop() || '';
      if (!auth.currentUser?.progress.unlockedTenses.includes(tenseId)) {
        setErrorMessage(lang === 'uz' ? "Dars hali qulflangan! ⚡" : "Lesson is still locked! ⚡");
        setTimeout(() => setErrorMessage(''), 3000);
        return;
      }
    }
    setCurrentPath(path);
    setIsSidebarOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleUnlock = async (tenseId: string) => {
    if (!auth.currentUser || auth.currentUser.progress.xp < UNLOCK_COST) {
      setErrorMessage(lang === 'uz' ? "XP yetarli emas! ⚡" : "Not enough XP! ⚡");
      setTimeout(() => setErrorMessage(''), 3000);
      return;
    }
    const newProgress = {
      ...auth.currentUser.progress,
      xp: auth.currentUser.progress.xp - UNLOCK_COST,
      unlockedTenses: [...auth.currentUser.progress.unlockedTenses, tenseId]
    };
    await db.updateUserProgress(auth.currentUser.username, newProgress);
  };

  const handleTenseComplete = async (earnedXp: number) => {
    if (!auth.currentUser) return;
    const tenseId = currentPath.split('/').pop() || '';
    const prev = auth.currentUser.progress;
    const newCompleted = prev.completedTenses.includes(tenseId) ? prev.completedTenses : [...prev.completedTenses, tenseId];
    
    let newLevel = prev.level;
    if (newCompleted.length >= 12) newLevel = 4;
    else if (newCompleted.length >= 8) newLevel = 3;
    else if (newCompleted.length >= 4) newLevel = 2;

    const updatedProgress = {
      ...prev,
      completedTenses: newCompleted,
      xp: prev.xp + earnedXp,
      level: newLevel
    };

    await db.updateUserProgress(auth.currentUser.username, updatedProgress);
    
    // Manual update for LocalStorage mode sync
    if (!supabase) {
      const updatedUser = { ...auth.currentUser, progress: updatedProgress };
      setAuth(prevAuth => ({ ...prevAuth, currentUser: updatedUser }));
      localStorage.setItem('tg_current_session', JSON.stringify(updatedUser));
    }
    
    setCurrentPath('/dashboard');
  };

  if (showSplash) return <SplashScreen />;

  if (!auth.isAuthenticated) return <AuthPage lang={lang} onLogin={handleLogin} />;

  return (
    <div className="min-h-screen flex flex-col bg-white selection:bg-emerald-100 selection:text-emerald-900">
      {errorMessage && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] bg-rose-600 text-white px-8 py-4 rounded-2xl shadow-2xl font-black text-sm animate-in fade-in slide-in-from-top-4 flex items-center gap-3">
          <span className="w-2 h-2 bg-white rounded-full animate-ping"></span>
          {errorMessage}
        </div>
      )}

      {/* Demo Mode Banner */}
      {!supabase && showSetupBanner && (
        <div className="bg-indigo-600 text-white py-2 px-4 flex items-center justify-between gap-4 relative z-[80]">
           <div className="flex items-center gap-2 text-[10px] md:text-xs font-black uppercase tracking-widest">
              <Database size={14} />
              <span>Demo Mode: Data saved locally. Set up Supabase for Cloud Sync.</span>
           </div>
           <button onClick={() => setShowSetupBanner(false)} className="opacity-60 hover:opacity-100 font-bold text-xs uppercase tracking-widest">Hide</button>
        </div>
      )}

      <Navbar 
        lang={lang} setLang={setLang} 
        progress={auth.isAdmin ? { xp: 9999, streak: 99 } as any : auth.currentUser!.progress} 
        userCode={auth.currentUser?.userCode}
        onLogout={handleLogout}
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} 
      />
      
      <div className="flex-1 flex overflow-hidden relative z-10">
        <div className={`fixed inset-0 z-[70] lg:hidden transition-all duration-300 ${isSidebarOpen ? 'opacity-100 bg-slate-900/60 backdrop-blur-sm' : 'opacity-0 pointer-events-none'}`} onClick={() => setIsSidebarOpen(false)}>
          <div className={`absolute left-0 top-0 w-72 h-full bg-white transition-transform duration-300 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`} onClick={e => e.stopPropagation()}>
            <Sidebar lang={lang} currentPath={currentPath} onNavigate={handleNavigate} unlockedTenses={auth.currentUser!.progress.unlockedTenses} completedTenses={auth.currentUser!.progress.completedTenses} onClose={() => setIsSidebarOpen(false)} />
          </div>
        </div>

        {!auth.isAdmin && (
          <div className="hidden lg:block border-r border-slate-100">
            <Sidebar lang={lang} currentPath={currentPath} onNavigate={handleNavigate} unlockedTenses={auth.currentUser!.progress.unlockedTenses} completedTenses={auth.currentUser!.progress.completedTenses} />
          </div>
        )}

        <main className="flex-1 overflow-y-auto relative bg-slate-50/30">
          <div className="relative z-10 min-h-full">
            {auth.isAdmin ? (
               <AdminPanel lang={lang} onLogout={handleLogout} />
            ) : (
               currentPath === '/dashboard' ? <Dashboard lang={lang} progress={auth.currentUser!.progress} user={auth.currentUser!} onNavigate={handleNavigate} onUnlock={handleUnlock} onLogout={handleLogout} /> :
               currentPath === '/basics' ? <BasicsPage lang={lang} /> :
               currentPath === '/vocabulary' ? <VocabularyPage lang={lang} progress={auth.currentUser!.progress} onEarnXp={amt => {
                 const newProgress = { ...auth.currentUser!.progress, xp: auth.currentUser!.progress.xp + amt };
                 db.updateUserProgress(auth.currentUser!.username, newProgress);
                 if (!supabase) {
                    const updatedUser = { ...auth.currentUser!, progress: newProgress };
                    setAuth(prev => ({ ...prev, currentUser: updatedUser }));
                    localStorage.setItem('tg_current_session', JSON.stringify(updatedUser));
                 }
               }} /> :
               currentPath.startsWith('/lesson/') ? <LessonPage tenseId={currentPath.split('/').pop() || ''} lang={lang} progress={auth.currentUser!.progress} onComplete={handleTenseComplete} /> : null
            )}
          </div>
        </main>
      </div>
      <PandaMascot lang={lang} />
    </div>
  );
};

export default App;
