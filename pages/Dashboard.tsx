import React, { useState } from 'react';
import { Language, UserProgress, User } from '../types';
import { UI_STRINGS, LEVELS, TENSES_DATA } from '../constants';
import { CircleCheck, Lock, ArrowRight, Star, PenTool, Sparkles, GraduationCap, Zap, Copy, Check, LogOut } from 'lucide-react';
import { analyzeFinalTask } from '../geminiService';
import FooterInfo from '../components/FooterInfo';

interface DashboardProps {
  lang: Language;
  progress: UserProgress;
  user?: User;
  onNavigate: (path: string) => void;
  onUnlock: (tenseId: string) => void;
  onLogout: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ lang, progress, user, onNavigate, onUnlock, onLogout }) => {
  const strings = UI_STRINGS[lang];
  const [finalText, setFinalText] = useState('');
  const [analysis, setAnalysis] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [copied, setCopied] = useState(false);

  const totalTensesCount = TENSES_DATA.length;
  const completedCount = progress.completedTenses.length;
  const isMaster = completedCount >= 10;

  const handleFinalSubmit = async () => {
    if (finalText.length < 100) return;
    setIsAnalyzing(true);
    const res = await analyzeFinalTask(finalText, lang);
    setAnalysis(res);
    setIsAnalyzing(false);
  };

  const copyToClipboard = () => {
    if (user?.userCode) {
      navigator.clipboard.writeText(user.userCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-12 px-6 space-y-16">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-200">
              <Sparkles size={12} />
              {strings.dashboard}
            </div>
            <button 
              onClick={onLogout}
              className="inline-flex items-center gap-2 px-3 py-1 bg-rose-50 text-rose-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-rose-100 hover:bg-rose-100 transition-colors"
            >
              <LogOut size={12} />
              {strings.logout}
            </button>
          </div>
          
          <div className="space-y-1">
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
              Hello, {user?.fullName || 'Genius'}
            </h1>
            <div className="flex items-center gap-3">
              <div 
                onClick={copyToClipboard}
                className="inline-flex items-center gap-2 bg-slate-900 text-white px-3 py-1.5 rounded-xl cursor-pointer group hover:bg-slate-800 transition-all shadow-lg"
              >
                <span className="text-xs font-mono font-black text-emerald-400">{user?.userCode}</span>
                {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} className="opacity-40 group-hover:opacity-100" />}
              </div>
              <p className="text-slate-500 text-sm font-medium">({strings.userCode})</p>
            </div>
          </div>
        </div>
        
        <div className="flex gap-4">
          <div className="bg-slate-900 p-6 rounded-[2.5rem] text-white shadow-2xl flex items-center gap-6 border-b-8 border-slate-800">
            <div className="w-14 h-14 bg-emerald-500 rounded-2xl flex items-center justify-center text-white shadow-lg rotate-3">
              <Zap fill="white" size={28} />
            </div>
            <div>
              <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">Total Chaqmoq (XP)</div>
              <div className="font-black text-3xl">{progress.xp}</div>
            </div>
          </div>
        </div>
      </header>

      {/* Progress Journey */}
      <div className="space-y-16">
        {LEVELS.map((level, idx) => {
          return (
            <section key={level.id} className="relative space-y-8">
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 rounded-[2rem] bg-emerald-600 flex items-center justify-center text-white font-black text-2xl shadow-xl transition-transform hover:scale-110">
                  {level.id}
                </div>
                <div>
                  <h2 className="text-2xl font-black text-slate-800">{level.name}</h2>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="h-2 w-32 bg-slate-100 rounded-full overflow-hidden">
                       <div 
                        className="h-full bg-emerald-500 transition-all duration-1000" 
                        style={{ width: `${(level.tenses.filter(t => progress.completedTenses.includes(t)).length / level.tenses.length) * 100}%` }}
                       />
                    </div>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      {level.tenses.filter(t => progress.completedTenses.includes(t)).length}/{level.tenses.length} Done
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {level.tenses.map(tenseId => {
                  const tense = TENSES_DATA.find(t => t.id === tenseId);
                  const isCompleted = progress.completedTenses.includes(tenseId);
                  const isUnlocked = progress.unlockedTenses.includes(tenseId);
                  if (!tense) return null;

                  return (
                    <div
                      key={tenseId}
                      className={`group relative bg-white p-8 rounded-[2.5rem] border-b-8 border border-slate-200 transition-all text-left shadow-sm ${isUnlocked ? 'hover:border-emerald-400 hover:border-b-emerald-600 hover:-translate-y-2 hover:shadow-2xl cursor-pointer' : 'opacity-80 grayscale-[0.5]'}`}
                      onClick={() => isUnlocked && onNavigate(`/lesson/${tenseId}`)}
                    >
                      {isCompleted && (
                        <div className="absolute top-6 right-6 text-emerald-500">
                          <CircleCheck size={28} fill="currentColor" className="text-white" />
                        </div>
                      )}

                      {!isUnlocked && (
                        <div className="absolute inset-0 bg-white/40 backdrop-blur-[2px] rounded-[2.5rem] flex flex-col items-center justify-center p-6 text-center z-10 transition-all group-hover:backdrop-blur-none group-hover:bg-white/10">
                          <div className="bg-slate-900 text-white p-3 rounded-2xl shadow-xl mb-4">
                            <Lock size={20} />
                          </div>
                          <button 
                            onClick={(e) => { e.stopPropagation(); onUnlock(tenseId); }}
                            className="bg-amber-500 text-white px-5 py-2.5 rounded-xl font-black text-xs shadow-lg hover:scale-110 active:scale-95 transition-all flex items-center gap-2"
                          >
                            <Zap size={14} fill="white" />
                            Unlock: 200 XP
                          </button>
                        </div>
                      )}

                      <div className="space-y-4">
                        <h3 className="text-lg font-black text-slate-900 leading-tight group-hover:text-emerald-600 transition-colors">
                          {tense.name[lang]}
                        </h3>
                        <p className="text-xs text-slate-500 font-medium line-clamp-2 leading-relaxed">
                          {tense.description[lang]}
                        </p>
                        <div className="flex items-center justify-between pt-4">
                           <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${isCompleted ? 'bg-emerald-100 text-emerald-700' : isUnlocked ? 'bg-slate-100 text-slate-500' : 'bg-slate-50 text-slate-300'}`}>
                             {isCompleted ? 'Finished' : isUnlocked ? 'Start' : 'Locked'}
                           </span>
                           {isUnlocked && <ArrowRight size={18} className="text-slate-300 group-hover:text-emerald-500 group-hover:translate-x-2 transition-all" />}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          );
        })}

        {/* Grand Finale Section */}
        {isMaster && (
          <section className="bg-gradient-to-br from-indigo-900 to-slate-900 rounded-[4rem] p-12 md:p-20 text-white shadow-3xl relative overflow-hidden group">
             <div className="absolute top-0 right-0 p-12 opacity-5 rotate-12 group-hover:scale-110 transition-transform">
               <GraduationCap size={200} />
             </div>
             <div className="relative z-10 space-y-12">
                <div className="text-center space-y-4">
                   <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-indigo-500/20 text-indigo-300 rounded-full text-[10px] font-black uppercase tracking-widest border border-indigo-500/30">
                     <PenTool size={14} /> The Grand Finale
                   </div>
                   <h2 className="text-4xl md:text-6xl font-black">{strings.finalTask}</h2>
                   <p className="text-indigo-200 text-lg max-w-2xl mx-auto font-medium">{strings.finalTaskPrompt}</p>
                </div>

                <div className="space-y-6">
                  <textarea 
                    value={finalText}
                    onChange={(e) => setFinalText(e.target.value)}
                    placeholder="Write your story using different tenses..."
                    className="w-full h-80 bg-white/5 border-2 border-white/10 rounded-[3rem] p-10 text-xl font-medium focus:outline-none focus:border-indigo-400 transition-all placeholder:text-indigo-300/30"
                  />
                  <div className="flex justify-between items-center px-4">
                     <span className={`text-sm font-black ${finalText.length < 100 ? 'text-rose-400' : 'text-emerald-400'}`}>
                        {finalText.length} / 100+ characters
                     </span>
                     <button 
                        onClick={handleFinalSubmit}
                        disabled={finalText.length < 100 || isAnalyzing}
                        className="bg-white text-indigo-900 font-black px-12 py-5 rounded-[2rem] hover:scale-105 active:scale-95 transition-all shadow-2xl disabled:opacity-30 disabled:grayscale"
                     >
                        {isAnalyzing ? "Analyzing Mastery..." : "Submit to Panda Tutor"}
                     </button>
                  </div>
                </div>

                {analysis && (
                  <div className="bg-white/10 backdrop-blur-xl rounded-[3rem] p-10 border border-white/10 animate-in slide-in-from-bottom-10">
                     <div className="flex items-center gap-4 mb-8">
                        <div className="w-12 h-12 bg-indigo-500 rounded-2xl flex items-center justify-center shadow-lg">
                           <Sparkles size={24} />
                        </div>
                        <h3 className="text-2xl font-black">AI Master Analysis</h3>
                     </div>
                     <div className="prose prose-invert max-w-none prose-p:text-indigo-100 prose-strong:text-white leading-relaxed whitespace-pre-wrap">
                        {analysis}
                     </div>
                  </div>
                )}
             </div>
          </section>
        )}
      </div>

      <FooterInfo lang={lang} />
    </div>
  );
};

export default Dashboard;