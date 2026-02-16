import React, { useState, useEffect } from 'react';
import { Language, User, UserProgress, AuthState } from './types';
import { TENSES_DATA, UI_STRINGS } from './constants';
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

const UNLOCK_COST = 200;

const App: React.FC = () => {
  const [lang, setLang] = useState<Language>(() => {
    return (localStorage.getItem('tg_lang') as Language) || 'uz';
  });
  const [currentPath, setCurrentPath] = useState('/dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showSplash, setShowSplash] = useState(true);

  const [auth, setAuth] = useState<AuthState>(() => {
    const saved = localStorage.getItem('tg_current_session');
    const isAdmin = localStorage.getItem('tg_admin_mode') === 'true';
    
    if (isAdmin && saved) {
      return { currentUser: JSON.parse(saved), isAuthenticated: true, isAdmin: true };
    }
    if (saved) {
      return { currentUser: JSON.parse(saved), isAuthenticated: true, isAdmin: false };
    }
    return { currentUser: null, isAuthenticated: false, isAdmin: false };
  });

  useEffect(() => {
    localStorage.setItem('tg_lang', lang);
  }, [lang]);

  useEffect(() => {
    if (auth.isAuthenticated && !auth.isAdmin && auth.currentUser) {
      const interval = setInterval(() => {
        const usersJson = localStorage.getItem('tg_users');
        const users: User[] = usersJson ? JSON.parse(usersJson) : [];
        const freshUser = users.find(u => u.username === auth.currentUser?.username);
        if (freshUser && freshUser.progress.xp !== auth.currentUser.progress.xp) {
           setAuth(prev => ({ ...prev, currentUser: freshUser }));
           localStorage.setItem('tg_current_session', JSON.stringify(freshUser));
        }
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [auth.isAuthenticated, auth.isAdmin, auth.currentUser]);

  const syncToDatabase = (updatedUser: User) => {
    const usersJson = localStorage.getItem('tg_users');
    const users: User[] = usersJson ? JSON.parse(usersJson) : [];
    const index = users.findIndex(u => u.username === updatedUser.username);
    if (index >= 0) {
      users[index] = updatedUser;
      localStorage.setItem('tg_users', JSON.stringify(users));
      localStorage.setItem('tg_current_session', JSON.stringify(updatedUser));
    }
  };

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
    if (!auth.isAuthenticated) return;
    
    if (path.startsWith('/lesson/')) {
      const tenseId = path.split('/').pop() || '';
      if (!auth.currentUser?.progress.unlockedTenses.includes(tenseId)) {
        setErrorMessage(lang === 'uz' ? "Bu dars qulflangan! ⚡ Chaqmoq to'plang." : "Lesson locked! ⚡ Collect XP.");
        setTimeout(() => setErrorMessage(''), 3000);
        return;
      }
    }
    
    setCurrentPath(path);
    setIsSidebarOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleUnlock = (tenseId: string) => {
    if (!auth.currentUser) return;
    
    if (auth.currentUser.progress.xp < UNLOCK_COST) {
      setErrorMessage(lang === 'uz' ? "Chaqmoq yetarli emas! ⚡" : "Not enough XP! ⚡");
      setTimeout(() => setErrorMessage(''), 3000);
      return;
    }

    const updatedUser = {
      ...auth.currentUser,
      progress: {
        ...auth.currentUser.progress,
        xp: auth.currentUser.progress.xp - UNLOCK_COST,
        unlockedTenses: [...auth.currentUser.progress.unlockedTenses, tenseId]
      }
    };

    setAuth(prev => ({ ...prev, currentUser: updatedUser }));
    syncToDatabase(updatedUser);
  };

  const handleTenseComplete = (earnedXp: number) => {
    if (!auth.currentUser) return;
    const tenseId = currentPath.split('/').pop() || '';
    
    const prevProgress = auth.currentUser.progress;
    const alreadyCompleted = prevProgress.completedTenses.includes(tenseId);
    const newCompleted = alreadyCompleted ? prevProgress.completedTenses : [...prevProgress.completedTenses, tenseId];
    
    let newLevel = prevProgress.level;
    if (newCompleted.length >= 4 && newLevel === 1) newLevel = 2;
    if (newCompleted.length >= 8 && newLevel === 2) newLevel = 3;
    if (newCompleted.length >= 12 && newLevel === 3) newLevel = 4;

    const updatedUser = {
      ...auth.currentUser,
      progress: {
        ...prevProgress,
        completedTenses: newCompleted,
        xp: prevProgress.xp + earnedXp,
        level: newLevel
      }
    };

    setAuth(prev => ({ ...prev, currentUser: updatedUser }));
    syncToDatabase(updatedUser);
    setCurrentPath('/dashboard');
  };

  const handleEarnXp = (amount: number) => {
    if (!auth.currentUser) return;
    const updatedUser = {
      ...auth.currentUser,
      progress: {
        ...auth.currentUser.progress,
        xp: auth.currentUser.progress.xp + amount
      }
    };
    setAuth(prev => ({ ...prev, currentUser: updatedUser }));
    syncToDatabase(updatedUser);
  };

  if (showSplash) {
    return <SplashScreen />;
  }

  if (!auth.isAuthenticated) {
    return <AuthPage lang={lang} onLogin={handleLogin} />;
  }

  if (auth.isAdmin) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Navbar 
          lang={lang} 
          setLang={setLang} 
          progress={{ xp: 9999, streak: 99 } as any} 
          onLogout={handleLogout}
        />
        <AdminPanel lang={lang} onLogout={handleLogout} />
      </div>
    );
  }

  const renderContent = () => {
    if (!auth.currentUser) return null;
    const progress = auth.currentUser.progress;

    if (currentPath === '/dashboard') {
      return (
        <Dashboard 
          lang={lang} 
          progress={progress} 
          user={auth.currentUser}
          onNavigate={handleNavigate} 
          onUnlock={handleUnlock}
          onLogout={handleLogout}
        />
      );
    }
    if (currentPath === '/basics') {
      return <BasicsPage lang={lang} />;
    }
    if (currentPath === '/vocabulary') {
      return (
        <VocabularyPage 
          lang={lang} 
          progress={progress}
          onEarnXp={handleEarnXp}
        />
      );
    }
    if (currentPath.startsWith('/lesson/')) {
      const tenseId = currentPath.split('/').pop() || '';
      return (
        <LessonPage 
          tenseId={tenseId} 
          lang={lang} 
          progress={progress}
          onComplete={handleTenseComplete} 
        />
      );
    }
    return <Dashboard lang={lang} progress={progress} onNavigate={handleNavigate} onUnlock={handleUnlock} onLogout={handleLogout} />;
  };

  return (
    <div className="min-h-screen flex flex-col bg-white relative selection:bg-emerald-100 selection:text-emerald-900">
      {errorMessage && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] bg-rose-600 text-white px-8 py-4 rounded-2xl shadow-2xl font-black text-sm animate-in fade-in slide-in-from-top-4 flex items-center gap-3">
          <span className="w-2 h-2 bg-white rounded-full animate-ping"></span>
          {errorMessage}
        </div>
      )}

      <Navbar 
        lang={lang} 
        setLang={setLang} 
        progress={auth.currentUser!.progress} 
        userCode={auth.currentUser?.userCode}
        onLogout={handleLogout}
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} 
      />
      
      <div className="flex-1 flex overflow-hidden relative z-10">
        {/* Mobile Sidebar Overlay */}
        <div 
          className={`fixed inset-0 z-[70] lg:hidden transition-all duration-300 ${isSidebarOpen ? 'opacity-100 pointer-events-auto bg-slate-900/60 backdrop-blur-sm' : 'opacity-0 pointer-events-none'}`}
          onClick={() => setIsSidebarOpen(false)}
        >
          <div 
            className={`absolute left-0 top-0 w-72 h-full bg-white transition-transform duration-300 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
            onClick={(e) => e.stopPropagation()}
          >
            <Sidebar 
              lang={lang} 
              currentPath={currentPath} 
              onNavigate={handleNavigate} 
              unlockedTenses={auth.currentUser!.progress.unlockedTenses}
              completedTenses={auth.currentUser!.progress.completedTenses} 
              onClose={() => setIsSidebarOpen(false)} 
            />
          </div>
        </div>

        {/* Desktop Sidebar */}
        <div className="hidden lg:block border-r border-slate-100">
          <Sidebar 
            lang={lang} 
            currentPath={currentPath} 
            onNavigate={handleNavigate} 
            unlockedTenses={auth.currentUser!.progress.unlockedTenses}
            completedTenses={auth.currentUser!.progress.completedTenses} 
          />
        </div>

        <main className="flex-1 overflow-y-auto relative bg-slate-50/30">
          <div className="relative z-10 min-h-full">
            {renderContent()}
          </div>
        </main>
      </div>

      <PandaMascot lang={lang} />
    </div>
  );
};

export default App;