
import React from 'react';
import { Language } from '../types';
import { UI_STRINGS, LEVELS } from '../constants';
import { Book, LayoutGrid, Languages, CheckCircle, Lock, GraduationCap, X } from 'lucide-react';

interface SidebarProps {
  lang: Language;
  currentPath: string;
  onNavigate: (path: string) => void;
  completedTenses: string[];
  unlockedTenses: string[];
  onClose?: () => void; // Menyuni yopish funksiyasi
}

const Sidebar: React.FC<SidebarProps> = ({ lang, currentPath, onNavigate, completedTenses, unlockedTenses, onClose }) => {
  const strings = UI_STRINGS[lang];

  const MenuItem = ({ path, icon: Icon, label }: { path: string, icon: any, label: string }) => {
    const isActive = currentPath === path;
    return (
      <button 
        onClick={() => onNavigate(path)}
        className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all group
          ${isActive 
            ? 'text-indigo-600 font-bold' 
            : 'text-slate-500 hover:text-slate-800 font-semibold'}`}
      >
        <div className={`transition-colors ${isActive ? 'text-indigo-600' : 'text-slate-400 group-hover:text-slate-600'}`}>
          <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
        </div>
        <span className="text-base tracking-tight">{label}</span>
      </button>
    );
  };

  return (
    <aside className="w-full h-full lg:w-72 bg-white flex flex-col overflow-y-auto relative">
      {/* Close Button for Mobile (X) */}
      {onClose && (
        <button 
          onClick={onClose}
          className="lg:hidden absolute top-4 right-4 p-2 bg-slate-50 text-slate-400 hover:text-slate-900 rounded-xl transition-colors border border-slate-100"
        >
          <X size={20} />
        </button>
      )}

      <div className="p-6 space-y-8">
        {/* Main Navigation */}
        <div className="space-y-1 mt-4 lg:mt-0">
          <MenuItem path="/dashboard" icon={LayoutGrid} label={strings.dashboard} />
          <MenuItem path="/basics" icon={Book} label={strings.basics} />
          <MenuItem path="/vocabulary" icon={Languages} label={strings.vocabulary} />
        </div>

        <div className="h-px bg-slate-100 mx-2" />

        {/* Levels Section */}
        <div className="space-y-8">
          {LEVELS.map(level => (
            <div key={level.id} className="space-y-4">
              <h3 className="px-4 text-[11px] font-black text-slate-400 uppercase tracking-[0.15em] opacity-80">
                {lang === 'uz' ? 'DARAJA' : 'LEVEL'} {level.id}
              </h3>
              
              <div className="space-y-2">
                {level.tenses.map(tenseId => {
                  const isCompleted = completedTenses.includes(tenseId);
                  const isUnlocked = unlockedTenses.includes(tenseId);
                  const isActive = currentPath === `/lesson/${tenseId}`;

                  return (
                    <button
                      key={tenseId}
                      onClick={() => onNavigate(`/lesson/${tenseId}`)}
                      className={`w-full flex items-center justify-between px-4 py-3.5 rounded-2xl transition-all relative
                        ${isActive 
                          ? 'bg-[#0f172a] text-white font-bold shadow-xl scale-[1.02]' 
                          : 'text-slate-500 hover:bg-slate-50 font-semibold'}
                        ${!isUnlocked && !isActive ? 'opacity-60 grayscale' : ''}`}
                    >
                      <div className="flex items-center gap-3">
                        {isActive ? (
                          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                        ) : isCompleted ? (
                          <CheckCircle size={14} className="text-emerald-500" />
                        ) : !isUnlocked ? (
                          <Lock size={14} className="text-slate-300" />
                        ) : (
                          <div className="w-2 h-2 rounded-full bg-slate-200" />
                        )}
                        <span className={`text-[15px] capitalize tracking-tight ${isActive ? 'ml-0' : 'ml-1'}`}>
                          {tenseId.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                        </span>
                      </div>
                      
                      {!isUnlocked && !isActive && (
                        <div className="text-[9px] font-black text-amber-500">200 XP</div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Promo / Info Card */}
        <div className="bg-slate-50 rounded-[2rem] p-6 border border-slate-100 mt-4 shadow-inner">
           <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center text-white shadow-sm">
                <GraduationCap size={18} />
              </div>
              <span className="text-[10px] font-black text-slate-800 uppercase tracking-widest">Progress</span>
           </div>
           <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
             Yangi darslarni ochish uchun chaqmoq (XP) to'plang. Har bir dars 200 chaqmoq.
           </p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
