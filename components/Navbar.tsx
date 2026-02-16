import React, { useState } from 'react';
import { UI_STRINGS } from '../constants';
import { Language, UserProgress } from '../types';
import { Trophy, Zap, Globe, Menu, Code2, Copy, Check, LogOut, Fingerprint, Plus, X, GraduationCap, PenTool, Gift } from 'lucide-react';

interface NavbarProps {
  lang: Language;
  setLang: (l: Language) => void;
  progress: UserProgress;
  userCode?: string;
  onLogout: () => void;
  toggleSidebar?: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ lang, setLang, progress, userCode, onLogout, toggleSidebar }) => {
  const strings = UI_STRINGS[lang];
  const [copied, setCopied] = useState(false);
  const [showXpGuide, setShowXpGuide] = useState(false);

  const copyCode = () => {
    if (userCode) {
      navigator.clipboard.writeText(userCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const xpGuides = {
    uz: [
      { icon: GraduationCap, title: "Darslarni yakunlash", desc: "Har bir muvaffaqiyatli yakunlangan dars uchun XP olasiz.", color: "text-emerald-500" },
      { icon: PenTool, title: "Lug'at imtihoni", desc: "Lug'at bo'limidagi imtihonda har bir to'g'ri javob uchun +5 XP.", color: "text-indigo-500" },
      { icon: Gift, title: "Admin sovg'alari", desc: "O'z ID kodingizni adminga bering va bonus XP oling!", color: "text-amber-500" }
    ],
    en: [
      { icon: GraduationCap, title: "Complete Lessons", desc: "Earn XP for every successfully finished lesson/tense.", color: "text-emerald-500" },
      { icon: PenTool, title: "Vocabulary Exams", desc: "Earn +5 XP for every correct answer in exams.", color: "text-indigo-500" },
      { icon: Gift, title: "Admin Gifts", desc: "Share your ID with the admin to receive bonus XP!", color: "text-amber-500" }
    ]
  };

  return (
    <header className="sticky top-0 z-[60] flex flex-col">
      {/* XP Guide Modal */}
      {showXpGuide && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowXpGuide(false)}></div>
          <div className="relative w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in duration-300">
             <div className="bg-slate-950 p-8 text-white relative">
                <button 
                  onClick={() => setShowXpGuide(false)}
                  className="absolute top-6 right-6 p-2 hover:bg-white/10 rounded-xl transition-colors"
                >
                  <X size={20} />
                </button>
                <div className="flex items-center gap-4">
                   <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center shadow-lg rotate-3">
                      <Zap fill="white" size={24} />
                   </div>
                   <div>
                      <h3 className="text-xl font-black">{lang === 'uz' ? "XP to'plash qo'llanmasi" : "XP Earning Guide"}</h3>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Mastery Program</p>
                   </div>
                </div>
             </div>
             
             <div className="p-8 space-y-6">
                {xpGuides[lang].map((guide, i) => (
                  <div key={i} className="flex items-start gap-4 group">
                     <div className={`w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center group-hover:bg-slate-100 transition-colors ${guide.color}`}>
                        <guide.icon size={24} />
                     </div>
                     <div className="space-y-1">
                        <h4 className="font-black text-slate-900">{guide.title}</h4>
                        <p className="text-xs text-slate-500 font-medium leading-relaxed">{guide.desc}</p>
                     </div>
                  </div>
                ))}

                <button 
                  onClick={() => setShowXpGuide(false)}
                  className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black text-sm hover:bg-slate-800 transition-all shadow-xl active:scale-95"
                >
                  Tushunarli / Got it!
                </button>
             </div>
          </div>
        </div>
      )}

      {/* Developer Badge Bar */}
      <div className="w-full bg-slate-950 py-2 px-4 flex justify-center items-center border-b border-slate-800 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-emerald-500/10 to-transparent animate-pulse"></div>
        <div className="relative flex items-center gap-2">
          <Code2 size={12} className="text-emerald-500" />
          <span className="text-[9px] md:text-[11px] font-black tracking-[0.15em] uppercase text-slate-400">
            Developer: 
            <span className="text-white ml-1.5 bg-emerald-600 px-2 py-0.5 rounded-md shadow-[0_0_10px_rgba(16,185,129,0.3)]">
              Sodiqjon Mukhtorov
            </span>
          </span>
          <div className="h-3 w-px bg-slate-700 mx-2 hidden md:block"></div>
          <span className="hidden md:inline text-[9px] font-bold text-slate-500 uppercase tracking-widest">
            AI Mastery Engine v2.5
          </span>
        </div>
      </div>

      <nav className="glass-morphism shadow-sm border-b px-3 py-3 md:px-8 md:py-4 bg-white/95 backdrop-blur-xl flex items-center justify-between">
        <div className="flex items-center gap-1 md:gap-3">
          <button onClick={toggleSidebar} className="lg:hidden p-2 hover:bg-slate-100 rounded-xl transition-colors">
            <Menu size={18} className="text-slate-600" />
          </button>
          
          <div className="flex items-center gap-2 group cursor-pointer">
            <div className="w-8 h-8 md:w-11 md:h-11 bg-slate-900 rounded-xl flex items-center justify-center text-white shadow-lg overflow-hidden shrink-0 group-hover:rotate-3 transition-transform">
              <svg viewBox="0 0 100 100" className="w-6 h-6 md:w-9 md:h-9">
                 <circle cx="50" cy="50" r="42" fill="white" />
                 <circle cx="28" cy="28" r="10" fill="#1a1a1a" />
                 <circle cx="72" cy="28" r="10" fill="#1a1a1a" />
                 <ellipse cx="36" cy="50" rx="10" ry="12" fill="#1a1a1a" transform="rotate(-10 36 50)" />
                 <ellipse cx="64" cy="50" rx="10" ry="12" fill="#1a1a1a" transform="rotate(10 64 50)" />
                 <circle cx="38" cy="48" r="3" fill="white" />
                 <circle cx="62" cy="48" r="3" fill="white" />
                 <circle cx="39" cy="46" r="1" fill="white" opacity="0.8" />
                 <circle cx="63" cy="46" r="1" fill="white" opacity="0.8" />
                 <path d="M46 62 Q50 66 54 62" fill="none" stroke="#1a1a1a" strokeWidth="2.5" strokeLinecap="round" />
              </svg>
            </div>
            
            <div className="flex flex-col hidden sm:flex">
              <span className="text-base md:text-xl font-black tracking-tighter text-slate-900 leading-none">
                Tense<span className="text-emerald-600">Genius</span>
              </span>
              <span className="text-[7px] md:text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] leading-tight">AI MASTER</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          {userCode && (
            <div className="flex items-center gap-1 md:gap-2">
              <div 
                onClick={copyCode}
                className="group flex items-center gap-2 md:gap-3 bg-slate-900 text-white px-3 py-2 md:px-5 md:py-2.5 rounded-xl md:rounded-2xl cursor-pointer hover:bg-slate-800 transition-all shadow-xl border-b-4 border-slate-950 active:translate-y-1 active:border-b-0"
              >
                <Fingerprint size={16} className="text-emerald-400 hidden xs:block" />
                <span className="text-xs md:text-lg font-mono font-black tracking-wider text-emerald-400">{userCode}</span>
                {copied ? <Check size={16} className="text-emerald-400" /> : <Copy size={16} className="text-slate-500 group-hover:text-white transition-colors" />}
              </div>
              <button 
                onClick={onLogout}
                className="p-2 md:p-3 bg-rose-50 text-rose-600 rounded-xl md:rounded-2xl border-2 border-rose-100 hover:bg-rose-600 hover:text-white transition-all shadow-sm"
              >
                <LogOut size={18} />
              </button>
            </div>
          )}

          <div className="h-8 w-px bg-slate-100 mx-1 hidden md:block"></div>

          <div className="flex items-center gap-1 md:gap-2">
            <div className="flex items-center gap-1 text-orange-500 bg-orange-50 px-2 py-1.5 md:px-3 md:py-2 rounded-lg md:rounded-xl border border-orange-100 font-black text-[10px] md:text-xs shadow-sm">
              <Trophy size={14} className="md:w-4 md:h-4" />
              <span>{progress.streak}</span>
            </div>
            <div className="flex items-center gap-1 bg-emerald-50 rounded-lg md:rounded-xl border border-emerald-100 shadow-sm overflow-hidden pr-1">
              <div className="flex items-center gap-1 text-emerald-600 px-2 py-1.5 md:px-3 md:py-2 font-black text-[10px] md:text-xs">
                <Zap size={14} fill="currentColor" className="md:w-4 md:h-4" />
                <span>{progress.xp}</span>
              </div>
              <button 
                onClick={() => setShowXpGuide(true)}
                className="bg-emerald-600 text-white p-1 md:p-1.5 rounded-lg hover:bg-emerald-700 transition-colors shadow-inner"
              >
                <Plus size={12} className="stroke-[4px]" />
              </button>
            </div>
          </div>

          <button 
            onClick={() => setLang(lang === 'en' ? 'uz' : 'en')}
            className="flex items-center gap-1 px-2.5 py-1.5 md:px-4 md:py-2 bg-slate-900 text-white rounded-lg md:rounded-xl font-black text-[10px] md:text-xs transition-all active:scale-95 shadow-md"
          >
            <Globe size={14} />
            <span className="uppercase">{lang === 'en' ? 'UZB' : 'ENG'}</span>
          </button>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;