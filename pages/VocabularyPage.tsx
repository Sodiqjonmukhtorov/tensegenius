
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Language, VocabularyCategory, VocabularyItem, UserProgress } from '../types';
import { UI_STRINGS, VOCABULARY_DATA } from '../constants';
import { 
  Search, Languages, PenTool, ArrowRight, EyeOff, Eye, FileSpreadsheet,
  Filter, LayoutGrid, ChevronDown, GraduationCap, Timer, CheckCircle2, XCircle, RefreshCcw, Zap
} from 'lucide-react';
import FooterInfo from '../components/FooterInfo';

interface VocabularyPageProps {
  lang: Language;
  progress: UserProgress;
  onEarnXp: (xp: number) => void;
}

interface ExamQuestion {
  item: VocabularyItem;
  type: 'en-uz' | 'uz-en';
  userAnswer: string;
}

const VocabularyPage: React.FC<VocabularyPageProps> = ({ lang, progress, onEarnXp }) => {
  const strings = UI_STRINGS[lang];
  const [activeTab, setActiveTab] = useState<string>('bplus');
  const [searchQuery, setSearchQuery] = useState('');
  const [testMode, setTestMode] = useState(false);
  const [selectedWord, setSelectedWord] = useState<VocabularyItem | null>(null);

  // Exam States
  const [isExamOpen, setIsExamOpen] = useState(false);
  const [examQuestions, setExamQuestions] = useState<ExamQuestion[]>([]);
  const [currentExamIndex, setCurrentExamIndex] = useState(0);
  const [examTimeLeft, setExamTimeLeft] = useState(420); // 7:00 minutes
  const [examFinished, setExamFinished] = useState(false);
  const [lastExamTime, setLastExamTime] = useState<number>(() => {
    return Number(localStorage.getItem('last_vocab_exam_time') || 0);
  });
  const [cooldownSeconds, setCooldownSeconds] = useState(0);

  const filteredItems = useMemo(() => {
    const category = VOCABULARY_DATA.find(c => c.id === activeTab);
    if (!category) return [];
    
    return category.items.filter(item => 
      item.word.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.translation.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [activeTab, searchQuery]);

  // Cooldown Timer Logic
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      const tenMinutes = 10 * 60 * 1000;
      const diff = now - lastExamTime;
      if (diff < tenMinutes) {
        setCooldownSeconds(Math.ceil((tenMinutes - diff) / 1000));
      } else {
        setCooldownSeconds(0);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [lastExamTime]);

  // Exam Timer Logic
  useEffect(() => {
    let timer: any;
    if (isExamOpen && !examFinished && examTimeLeft > 0) {
      timer = setInterval(() => setExamTimeLeft(prev => prev - 1), 1000);
    } else if (examTimeLeft === 0 && !examFinished) {
      finishExam();
    }
    return () => clearInterval(timer);
  }, [isExamOpen, examFinished, examTimeLeft]);

  const startExam = () => {
    if (cooldownSeconds > 0) return;
    if (filteredItems.length < 5) {
      alert(lang === 'uz' ? "Imtihon uchun kamida 5 ta so'z bo'lishi kerak!" : "Need at least 5 words for an exam!");
      return;
    }

    // Generate 20 questions (or max available)
    const shuffled = [...filteredItems].sort(() => 0.5 - Math.random());
    const questions: ExamQuestion[] = [];
    
    for (let i = 0; i < Math.min(20, shuffled.length); i++) {
      questions.push({
        item: shuffled[i],
        type: i < 10 ? 'en-uz' : 'uz-en',
        userAnswer: ''
      });
    }

    setExamQuestions(questions);
    setCurrentExamIndex(0);
    setExamTimeLeft(420);
    setExamFinished(false);
    setIsExamOpen(true);
  };

  const finishExam = () => {
    setExamFinished(true);
    const now = Date.now();
    setLastExamTime(now);
    localStorage.setItem('last_vocab_exam_time', now.toString());

    // Calculate XP
    const correctCount = examQuestions.filter(q => {
      const target = q.type === 'en-uz' ? q.item.translation : q.item.word;
      return q.userAnswer.trim().toLowerCase() === target.trim().toLowerCase();
    }).length;

    if (correctCount > 0) {
      onEarnXp(correctCount * 5);
    }
  };

  const handleRowClick = (item: VocabularyItem) => {
    if (selectedWord?.word === item.word) {
      setSelectedWord(null);
    } else {
      setSelectedWord(item);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-7xl mx-auto py-6 md:py-12 px-4 md:px-6 space-y-8 md:space-y-12 pb-40">
      {/* Exam Overlay */}
      {isExamOpen && (
        <div className="fixed inset-0 z-[100] bg-slate-900/95 backdrop-blur-xl flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl rounded-[3rem] overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            {/* Exam Header */}
            <div className="bg-slate-900 p-8 text-white flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center rotate-3 shadow-lg">
                   <GraduationCap size={28} />
                </div>
                <div>
                   <h2 className="text-xl font-black">Vocabulary Exam</h2>
                   <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Category: {activeTab}</p>
                </div>
              </div>
              <div className="flex items-center gap-6">
                 <div className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-xl border border-white/10">
                    <Timer size={18} className={examTimeLeft < 60 ? 'text-rose-400 animate-pulse' : 'text-emerald-400'} />
                    <span className="font-mono font-black text-lg">{formatTime(examTimeLeft)}</span>
                 </div>
                 {!examFinished && (
                   <button onClick={() => { if(confirm('Exit exam?')) setIsExamOpen(false); }} className="p-2 hover:bg-white/10 rounded-xl transition-colors">
                      <XCircle size={24} />
                   </button>
                 )}
              </div>
            </div>

            {/* Exam Content */}
            <div className="flex-1 overflow-y-auto p-8 md:p-12">
              {!examFinished ? (
                <div className="space-y-10">
                   <div className="space-y-2">
                      <div className="flex justify-between items-center px-1">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Question {currentExamIndex + 1} of {examQuestions.length}</span>
                        <div className="h-1.5 w-32 bg-slate-100 rounded-full overflow-hidden">
                           <div className="h-full bg-emerald-500 transition-all duration-500" style={{ width: `${((currentExamIndex + 1) / examQuestions.length) * 100}%` }} />
                        </div>
                      </div>
                      <div className="bg-slate-50 p-10 rounded-[2.5rem] border-2 border-slate-100 text-center space-y-4">
                         <span className="text-xs font-black text-indigo-500 uppercase tracking-widest">
                            {examQuestions[currentExamIndex].type === 'en-uz' ? 'Translate to Uzbek' : 'Translate to English'}
                         </span>
                         <h3 className="text-4xl md:text-5xl font-black text-slate-900">
                            {examQuestions[currentExamIndex].type === 'en-uz' 
                              ? examQuestions[currentExamIndex].item.word 
                              : examQuestions[currentExamIndex].item.translation}
                         </h3>
                      </div>
                   </div>

                   <div className="space-y-6">
                      <input 
                        type="text"
                        autoFocus
                        value={examQuestions[currentExamIndex].userAnswer}
                        onChange={(e) => {
                          const newQ = [...examQuestions];
                          newQ[currentExamIndex].userAnswer = e.target.value;
                          setExamQuestions(newQ);
                        }}
                        onKeyDown={(e) => {
                           if (e.key === 'Enter' && examQuestions[currentExamIndex].userAnswer.trim()) {
                              if (currentExamIndex < examQuestions.length - 1) setCurrentExamIndex(prev => prev + 1);
                              else finishExam();
                           }
                        }}
                        placeholder="Type your answer here..."
                        className="w-full bg-white border-4 border-slate-100 rounded-3xl px-8 py-6 text-2xl font-black text-slate-900 focus:outline-none focus:border-indigo-500 transition-all shadow-inner"
                      />
                      <div className="flex justify-between">
                         <button 
                           onClick={() => setCurrentExamIndex(prev => Math.max(0, prev - 1))}
                           disabled={currentExamIndex === 0}
                           className="px-6 py-4 font-black text-slate-400 hover:text-slate-900 disabled:opacity-0 transition-all"
                         >
                           Previous
                         </button>
                         <button 
                           onClick={() => {
                             if (currentExamIndex < examQuestions.length - 1) setCurrentExamIndex(prev => prev + 1);
                             else finishExam();
                           }}
                           className="bg-slate-900 text-white px-10 py-4 rounded-2xl font-black text-lg hover:scale-105 active:scale-95 transition-all shadow-xl"
                         >
                           {currentExamIndex === examQuestions.length - 1 ? 'Finish Exam' : 'Next Question'}
                         </button>
                      </div>
                   </div>
                </div>
              ) : (
                <div className="space-y-12">
                   <div className="text-center space-y-4">
                      <div className="inline-block p-6 bg-emerald-100 text-emerald-600 rounded-[2rem] shadow-inner mb-2 animate-bounce">
                         <CheckCircle2 size={64} />
                      </div>
                      <h2 className="text-4xl font-black text-slate-900">Exam Completed!</h2>
                      <div className="flex justify-center gap-8">
                         <div className="text-center">
                            <div className="text-3xl font-black text-slate-900">{examQuestions.filter(q => (q.type === 'en-uz' ? q.item.translation : q.item.word).toLowerCase() === q.userAnswer.trim().toLowerCase()).length} / {examQuestions.length}</div>
                            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Correct Answers</div>
                         </div>
                         <div className="text-center">
                            <div className="text-3xl font-black text-emerald-600">+{examQuestions.filter(q => (q.type === 'en-uz' ? q.item.translation : q.item.word).toLowerCase() === q.userAnswer.trim().toLowerCase()).length * 5}</div>
                            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">XP Earned</div>
                         </div>
                      </div>
                   </div>

                   <div className="space-y-4">
                      <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest px-2">Analysis & Review</h4>
                      <div className="space-y-2">
                        {examQuestions.map((q, i) => {
                          const target = q.type === 'en-uz' ? q.item.translation : q.item.word;
                          const isCorrect = q.userAnswer.trim().toLowerCase() === target.trim().toLowerCase();
                          return (
                            <div key={i} className={`p-4 rounded-2xl border flex items-center justify-between ${isCorrect ? 'bg-emerald-50 border-emerald-100' : 'bg-rose-50 border-rose-100'}`}>
                               <div className="flex items-center gap-4">
                                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isCorrect ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'}`}>
                                     {isCorrect ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
                                  </div>
                                  <div>
                                     <div className="text-xs font-black text-slate-900">{q.type === 'en-uz' ? q.item.word : q.item.translation}</div>
                                     <div className="text-[10px] font-bold text-slate-500">Your: <span className={isCorrect ? 'text-emerald-600' : 'text-rose-600'}>{q.userAnswer || '(Empty)'}</span></div>
                                  </div>
                               </div>
                               {!isCorrect && (
                                 <div className="text-right">
                                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Correct Answer</div>
                                    <div className="text-xs font-black text-emerald-600">{target}</div>
                                 </div>
                               )}
                            </div>
                          );
                        })}
                      </div>
                   </div>

                   <button 
                     onClick={() => setIsExamOpen(false)}
                     className="w-full bg-slate-900 text-white py-6 rounded-[2rem] font-black text-xl hover:bg-slate-800 transition-all shadow-2xl"
                   >
                     Back to Word Bank
                   </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Spreadsheet Header */}
      <header className="bg-slate-900 rounded-[2rem] md:rounded-[3rem] p-6 md:p-12 text-white shadow-3xl relative overflow-hidden border border-slate-800">
        <div className="absolute top-0 right-0 p-12 opacity-5 hidden md:block">
          <FileSpreadsheet size={240} />
        </div>
        <div className="relative z-10 space-y-4 md:space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-indigo-500/20 text-indigo-300 rounded-full text-[9px] md:text-[10px] font-black uppercase tracking-widest border border-indigo-500/30">
                <FileSpreadsheet size={14} />
                Excel Mastery Edition
              </div>
              <h1 className="text-3xl md:text-6xl font-black tracking-tight">{strings.vocabTitle}</h1>
              <p className="text-slate-400 text-sm md:text-lg max-w-2xl font-medium">{strings.vocabSubtitle}</p>
            </div>
            
            <div className="flex items-center gap-3">
               <button 
                onClick={() => setTestMode(!testMode)}
                className={`flex-1 md:flex-none flex items-center justify-center gap-3 px-5 py-3 md:px-6 md:py-4 rounded-xl md:rounded-2xl font-black transition-all text-xs md:text-base ${testMode ? 'bg-amber-500 text-white shadow-amber-200 shadow-lg' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}
               >
                 {testMode ? <Eye size={18} /> : <EyeOff size={18} />}
                 {testMode ? strings.showTranslation : strings.hideTranslation}
               </button>
            </div>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-10">
        {/* Navigation Sidebar */}
        <div className="lg:col-span-3 space-y-4 md:space-y-6">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={18} />
            <input 
              type="text" 
              placeholder={strings.searchVocab}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border-2 border-slate-100 rounded-2xl md:rounded-[2rem] pl-12 pr-6 py-4 md:py-5 text-sm font-bold focus:outline-none focus:border-indigo-500 shadow-sm transition-all placeholder:text-slate-400"
            />
          </div>

          {/* Categories & Exam Section */}
          <div className="space-y-4">
             <div className="bg-white rounded-2xl md:rounded-[2.5rem] border border-slate-100 p-2 md:p-3 shadow-sm space-y-1">
                <div className="px-4 py-2 text-[9px] md:text-[10px] uppercase font-black text-slate-400 tracking-widest">Kategoriyalar</div>
                <div className="flex lg:flex-col overflow-x-auto lg:overflow-x-visible pb-2 lg:pb-0 gap-1 scrollbar-hide">
                  {VOCABULARY_DATA.map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => { setActiveTab(cat.id); setSelectedWord(null); }}
                      className={`flex-shrink-0 lg:w-full flex items-center justify-between px-4 py-3 md:px-5 md:py-4 rounded-xl md:rounded-2xl transition-all whitespace-nowrap ${activeTab === cat.id ? 'bg-slate-900 text-white font-black shadow-lg' : 'text-slate-600 hover:bg-slate-50 font-bold'}`}
                    >
                      <div className="flex items-center gap-3">
                        {cat.id === 'writing' ? <PenTool size={16} /> : <Languages size={16} />}
                        <span className="text-xs md:text-sm">{cat.name[lang]}</span>
                      </div>
                      <div className={`hidden md:block px-2 py-0.5 rounded-md text-[10px] ${activeTab === cat.id ? 'bg-white/20' : 'bg-slate-100 text-slate-400'}`}>
                          {cat.items.length}
                      </div>
                    </button>
                  ))}
                </div>
             </div>

             {/* EXAM BUTTON - Highlighting based on user image request */}
             <div className="bg-white rounded-[2.5rem] border border-slate-100 p-6 shadow-sm space-y-4">
                <div className="flex items-center gap-3">
                   <div className="w-8 h-8 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center">
                      <GraduationCap size={18} />
                   </div>
                   <span className="text-[10px] font-black text-slate-800 uppercase tracking-widest">Mastery Exam</span>
                </div>
                <p className="text-[10px] text-slate-500 font-medium leading-relaxed">
                   Bilimingizni tekshiring! 20 ta savol, 7 daqiqa. Har bir to'g'ri javob +5 XP.
                </p>
                <button 
                  onClick={startExam}
                  disabled={cooldownSeconds > 0}
                  className={`w-full py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-3 transition-all shadow-lg ${cooldownSeconds > 0 ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 'bg-indigo-600 text-white hover:bg-indigo-700 active:scale-95'}`}
                >
                  {cooldownSeconds > 0 ? (
                    <>
                      <RefreshCcw size={16} className="animate-spin" />
                      {formatTime(cooldownSeconds)}
                    </>
                  ) : (
                    <>
                      <Zap size={16} fill="white" />
                      EXAM
                    </>
                  )}
                </button>
             </div>
          </div>
        </div>

        {/* Excel Table Area */}
        <div className="lg:col-span-9 space-y-6">
          <div className="bg-white rounded-2xl md:rounded-[2.5rem] border border-slate-100 shadow-2xl overflow-hidden min-h-[500px] flex flex-col">
            <div className="bg-slate-50 border-b border-slate-100 px-6 md:px-8 py-4 md:py-5 flex items-center justify-between">
               <div className="flex items-center gap-3 text-slate-400 font-black uppercase tracking-[0.2em] text-[9px] md:text-[10px]">
                 <Filter size={14} /> 
                 {filteredItems.length} Records
               </div>
               <div className="flex items-center gap-2">
                 <div className="w-2 h-2 md:w-3 md:h-3 bg-emerald-500 rounded-full"></div>
                 <span className="text-[9px] md:text-[10px] font-black uppercase text-slate-400">Database</span>
               </div>
            </div>

            {/* Desktop Table */}
            <div className="hidden md:block flex-1 overflow-x-auto">
               <table className="w-full border-collapse">
                  <thead className="sticky top-0 bg-white z-20 shadow-sm">
                    <tr className="bg-white">
                      <th className="w-12 px-6 py-6 border-b border-r border-slate-100 text-[10px] font-black text-slate-400 uppercase">#</th>
                      <th className="px-10 py-6 border-b border-r border-slate-100 text-left text-sm font-black text-slate-800 uppercase tracking-widest">English Word</th>
                      <th className="px-10 py-6 border-b border-r border-slate-100 text-left text-sm font-black text-slate-800 uppercase tracking-widest">O'zbekcha Tarjima</th>
                      <th className="px-8 py-6 border-b border-r border-slate-100 text-left text-sm font-black text-slate-800 uppercase tracking-widest">Type</th>
                      <th className="px-8 py-6 border-b border-slate-100 text-left text-sm font-black text-slate-800 uppercase tracking-widest">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {filteredItems.map((item, idx) => {
                      const isSelected = selectedWord?.word === item.word;
                      return (
                        <React.Fragment key={idx}>
                          <tr 
                            onClick={() => handleRowClick(item)}
                            className={`group transition-all cursor-pointer ${isSelected ? 'bg-indigo-50/50' : 'hover:bg-slate-50'}`}
                          >
                            <td className="px-6 py-6 border-r border-slate-100 text-center font-mono text-[10px] text-slate-300">{idx + 1}</td>
                            <td className="px-10 py-6 border-r border-slate-100">
                               <div className="text-lg font-black text-slate-900 group-hover:text-indigo-600 transition-colors">{item.word}</div>
                            </td>
                            <td className="px-10 py-6 border-r border-slate-100">
                               <div className={`text-lg font-bold transition-all duration-500 ${testMode ? 'blur-md select-none opacity-20' : 'text-slate-500'}`}>
                                 {item.translation}
                               </div>
                            </td>
                            <td className="px-8 py-6 border-r border-slate-100">
                               <span className="px-3 py-1 bg-slate-100 rounded-lg text-[10px] font-black uppercase text-slate-400">
                                 {item.type}
                               </span>
                            </td>
                            <td className="px-8 py-6">
                               <button className={`p-2 rounded-xl transition-all ${isSelected ? 'bg-indigo-600 text-white rotate-90' : 'bg-indigo-50 text-indigo-600 opacity-0 group-hover:opacity-100'}`}>
                                 <ArrowRight size={18} />
                               </button>
                            </td>
                          </tr>
                          {isSelected && (
                            <tr className="bg-gradient-to-br from-indigo-600 to-purple-700">
                              <td colSpan={5} className="p-0 border-b border-indigo-100">
                                <DetailView item={item} lang={lang} />
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      );
                    })}
                  </tbody>
               </table>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden divide-y divide-slate-100">
               {filteredItems.map((item, idx) => {
                 const isSelected = selectedWord?.word === item.word;
                 return (
                   <div key={idx} className="bg-white">
                      <div 
                        onClick={() => handleRowClick(item)}
                        className={`p-4 flex items-center justify-between transition-colors ${isSelected ? 'bg-indigo-50' : 'active:bg-slate-50'}`}
                      >
                         <div className="flex items-center gap-4">
                            <span className="text-[10px] font-mono text-slate-300">{(idx + 1).toString().padStart(2, '0')}</span>
                            <div>
                               <div className="text-base font-black text-slate-900">{item.word}</div>
                               <div className={`text-xs font-bold transition-all ${testMode ? 'blur-sm select-none opacity-20' : 'text-slate-400'}`}>
                                  {item.translation}
                               </div>
                            </div>
                         </div>
                         <div className="flex items-center gap-3">
                            <span className="px-2 py-0.5 bg-slate-100 rounded text-[8px] font-black uppercase text-slate-400">
                               {item.type}
                            </span>
                            <ChevronDown size={18} className={`text-slate-300 transition-transform duration-300 ${isSelected ? 'rotate-180 text-indigo-600' : ''}`} />
                         </div>
                      </div>
                      
                      {isSelected && (
                        <div className="bg-gradient-to-br from-indigo-600 to-purple-700 p-6 text-white space-y-6">
                           <div className="space-y-1">
                              <div className="text-[8px] font-black uppercase tracking-[0.2em] text-indigo-200">Selected Entry</div>
                              <h2 className="text-3xl font-black">{item.word}</h2>
                              <p className="text-xl font-bold opacity-70">{item.translation}</p>
                           </div>
                           
                           <div className="space-y-4">
                              <div className="p-4 bg-white/10 rounded-2xl border border-white/10 backdrop-blur-md">
                                 <div className="text-[9px] font-black uppercase tracking-widest text-indigo-200 mb-2">Ma'nosi:</div>
                                 <p className="text-sm leading-relaxed">{item.definition[lang]}</p>
                              </div>
                              <div className="p-4 bg-white/10 rounded-2xl border border-white/10 backdrop-blur-md">
                                 <div className="text-[9px] font-black uppercase tracking-widest text-indigo-200 mb-2">Misol:</div>
                                 <p className="text-sm italic font-medium leading-relaxed">"{item.example}"</p>
                              </div>
                           </div>
                        </div>
                      )}
                   </div>
                 );
               })}
            </div>
            
            {filteredItems.length === 0 && (
              <div className="py-20 md:py-40 text-center space-y-4 px-6">
                 <Search className="mx-auto text-slate-100 w-20 h-20 md:w-32 md:h-32" />
                 <p className="text-lg md:text-2xl font-black text-slate-300">Nothing found for "{searchQuery}"</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <FooterInfo lang={lang} />
    </div>
  );
};

const DetailView = ({ item, lang }: { item: VocabularyItem, lang: Language }) => (
  <div className="animate-in slide-in-from-top-4 duration-300 overflow-hidden">
    <div className="p-12 space-y-8 text-white shadow-inner">
      <div className="flex flex-col md:flex-row gap-12 items-start md:items-center">
        <div className="md:w-1/3 text-left space-y-4">
          <div className="space-y-2">
            <div className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-200">Selected Entry</div>
            <h2 className="text-5xl font-black leading-tight">{item.word}</h2>
            <p className="text-2xl font-bold opacity-70">{item.translation}</p>
          </div>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/20 rounded-xl text-[10px] font-black uppercase tracking-widest border border-white/10 backdrop-blur-md">
            <LayoutGrid size={12} className="text-indigo-200" />
            <span className="text-indigo-100">Category:</span> {item.type}
          </div>
        </div>
        <div className="md:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 bg-white/10 rounded-3xl border border-white/10 backdrop-blur-md">
            <div className="text-[10px] font-black uppercase tracking-widest text-indigo-200 mb-2">Meaning / Ma'nosi:</div>
            <p className="text-lg leading-relaxed">{item.definition[lang]}</p>
          </div>
          <div className="p-6 bg-white/10 rounded-3xl border border-white/10 backdrop-blur-md">
            <div className="text-[10px] font-black uppercase tracking-widest text-indigo-200 mb-2">Use in Sentence / Gapda:</div>
            <p className="text-lg italic font-medium leading-relaxed">"{item.example}"</p>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default VocabularyPage;
