
import React, { useState, useRef } from 'react';
import { Language, UserProgress, TenseExample } from '../types';
import { UI_STRINGS, TENSES_DATA } from '../constants';
import { 
  CheckCircle2, XCircle, Zap, BookOpen, Plus, AlertTriangle, 
  Play, ChevronRight, ChevronLeft, Sparkles, Lightbulb, 
  HelpCircle, Clock, Info, Target, MessageSquare, Quote
} from 'lucide-react';
import { askGrammarAssistantStream } from '../geminiService';

interface LessonPageProps {
  tenseId: string;
  lang: Language;
  onComplete: (xp: number) => void;
  progress: UserProgress;
}

const LessonPage: React.FC<LessonPageProps> = ({ tenseId, lang, onComplete, progress }) => {
  const strings = UI_STRINGS[lang];
  const tense = TENSES_DATA.find(t => t.id === tenseId);
  const practiceRef = useRef<HTMLElement>(null);

  const [practiceVisible, setPracticeVisible] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<string[]>(new Array(tense?.practice.length || 0).fill(''));
  const [showResults, setShowResults] = useState(false);
  const [userQuestion, setUserQuestion] = useState('');
  const [aiAnswer, setAiAnswer] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);

  const handleWritingChange = (val: string) => {
    const newAnswers = [...answers];
    newAnswers[currentIndex] = val;
    setAnswers(newAnswers);
  };

  const handleOptionSelect = (opt: string) => {
    const newAnswers = [...answers];
    newAnswers[currentIndex] = opt;
    setAnswers(newAnswers);
  };

  if (!tense) return <div className="p-10 text-center font-black text-slate-400">Data Not Found.</div>;

  const themeStyles = {
    present: "from-emerald-600 to-teal-700 bg-emerald-50 text-emerald-600",
    past: "from-amber-600 to-orange-700 bg-amber-50 text-amber-600",
    future: "from-indigo-600 to-blue-700 bg-blue-50 text-blue-600",
    perfect: "from-purple-600 to-indigo-800 bg-purple-50 text-purple-600",
    continuous: "from-cyan-600 to-blue-700 bg-cyan-50 text-cyan-600"
  }[tense.colorTheme];

  const themeColors = {
    present: "emerald",
    past: "amber",
    future: "indigo",
    perfect: "purple",
    continuous: "cyan"
  }[tense.colorTheme];

  const handleStartPractice = () => {
    setPracticeVisible(true);
    setTimeout(() => {
      practiceRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const handleAskPanda = async () => {
    if (!userQuestion.trim() || isAiLoading) return;
    setIsAiLoading(true);
    setAiAnswer(""); // Reset old answer
    
    try {
      const stream = askGrammarAssistantStream(userQuestion, tense.name.en, lang);
      let fullText = "";
      for await (const chunk of stream) {
        fullText += chunk;
        setAiAnswer(fullText);
      }
    } catch (err) {
      setAiAnswer("Error.");
    } finally {
      setIsAiLoading(false);
      setUserQuestion("");
    }
  };

  const calculateResults = () => {
    let correctCount = 0;
    tense.practice.forEach((q, i) => {
      if (answers[i] && answers[i].trim().toLowerCase() === q.answer.toLowerCase()) {
        correctCount++;
      }
    });
    return {
      correct: correctCount,
      total: tense.practice.length,
      xpEarned: correctCount * 10
    };
  };

  const results = showResults ? calculateResults() : null;

  const formatSentence = (sentence: string, type: 'positive' | 'negative' | 'question') => {
    const parts = sentence.split(/(\*\*.*?\*\*)/);
    const highlightColor = {
      positive: 'text-emerald-600',
      negative: 'text-rose-600',
      question: 'text-blue-600'
    }[type];

    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <span key={i} className={`${highlightColor} font-black underline decoration-2 underline-offset-4`}>{part.slice(2, -2)}</span>;
      }
      return part;
    });
  };

  const ExampleCard: React.FC<{ ex: TenseExample }> = ({ ex }) => {
    const typeStyles = {
      positive: { border: 'border-l-emerald-500 bg-emerald-50/30', label: 'Positive', labelBg: 'bg-emerald-100 text-emerald-700' },
      negative: { border: 'border-l-rose-500 bg-rose-50/30', label: 'Negative', labelBg: 'bg-rose-100 text-rose-700' },
      question: { border: 'border-l-blue-500 bg-blue-50/30', label: 'Question', labelBg: 'bg-blue-100 text-blue-700' }
    }[ex.type];

    return (
      <div className={`p-6 rounded-2xl border border-slate-100 border-l-[6px] ${typeStyles.border} shadow-sm group hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-4`}>
        <div className="space-y-2">
          <div className="text-xl font-bold text-slate-800">
            {formatSentence(ex.sentence, ex.type)}
          </div>
          <div className="text-sm font-medium text-slate-400 italic">
            {ex.note[lang]}
          </div>
          <div className="text-[11px] font-bold text-slate-300 uppercase tracking-widest pt-1 border-t border-slate-100">
            {ex.translation}
          </div>
        </div>
        <div className={`shrink-0 self-start md:self-center px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${typeStyles.labelBg}`}>
          {typeStyles.label}
        </div>
      </div>
    );
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8 md:px-10 md:py-12 space-y-16 pb-40 relative z-10">
      <style>
        {`
          @keyframes wiggle {
            0%, 100% { transform: rotate(0deg); }
            25% { transform: rotate(-1deg); }
            75% { transform: rotate(1deg); }
          }
          .animate-wiggle { animation: wiggle 0.5s ease-in-out infinite; }
        `}
      </style>

      {/* Dynamic Header */}
      <header className={`relative bg-gradient-to-br ${themeStyles.split(' ')[0]} ${themeStyles.split(' ')[1]} rounded-[3rem] p-8 md:p-16 text-white shadow-2xl overflow-hidden`}>
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-[100px] -mr-20 -mt-20"></div>
        <div className="relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-[0.2em] border border-white/20">
            <Zap size={12} className="text-yellow-300" />
            {strings.level} {tense.levelId} MASTERCLASS
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-tight">
            {tense.name[lang]}
          </h1>
          <p className="text-lg md:text-2xl text-white/80 font-medium leading-relaxed max-w-3xl">
            {tense.description[lang]}
          </p>
        </div>
      </header>

      {/* Deep Dive */}
      <section className="bg-white rounded-[2.5rem] p-8 md:p-12 border border-slate-100 shadow-xl grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-7 space-y-8">
          <div className={`flex items-center gap-4 text-${themeColors}-600`}>
            <Info size={32} />
            <h2 className="text-2xl md:text-3xl font-black">{lang === 'uz' ? 'Chuqur tahlil' : 'Deep Dive'}</h2>
          </div>
          <p className="text-slate-600 text-lg md:text-xl font-medium leading-relaxed whitespace-pre-line">
            {tense.detailedExplanation[lang]}
          </p>
          
          <div className={`bg-${themeColors}-50 p-6 rounded-3xl border border-${themeColors}-100 flex items-start gap-4`}>
             <Clock className={`text-${themeColors}-600 shrink-0 mt-1`} size={24} />
             <div className="space-y-1">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Vaqt Chizig'i / Timeline</span>
                <p className="font-bold text-slate-700">{tense.timeline}</p>
             </div>
          </div>
        </div>

        <div className="lg:col-span-5 space-y-6">
           <div className="bg-slate-900 text-white rounded-[2.5rem] p-8 space-y-6 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 opacity-10 -mr-4 -mt-4"><Target size={120} /></div>
              <h3 className="text-xl font-black flex items-center gap-2 relative z-10">
                <Target size={20} className={`text-${themeColors}-400`} /> 
                {lang === 'uz' ? 'Qachon ishlatiladi?' : 'When to use it?'}
              </h3>
              <ul className="space-y-4 relative z-10">
                {tense.whenToUse[lang].map((use, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className={`w-6 h-6 bg-white/10 rounded-lg flex items-center justify-center text-${themeColors}-400 font-black text-xs shrink-0`}>{i+1}</div>
                    <span className="text-sm font-medium text-slate-300">{use}</span>
                  </li>
                ))}
              </ul>
           </div>
        </div>
      </section>

      {/* Structure Table */}
      <section className="bg-white rounded-[2.5rem] p-6 md:p-10 border border-slate-100 shadow-xl space-y-8 overflow-hidden">
        <div className="flex items-center gap-3">
           <AlertTriangle className={`text-${themeColors}-500`} size={28} />
           <h2 className="text-2xl md:text-3xl font-black text-slate-900">{strings.structureTable}</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100">Form</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100">Structure</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100">Examples</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              <tr>
                <td className="px-6 py-8"><span className="bg-emerald-600 text-white px-3 py-1 rounded text-[10px] font-black uppercase">Positive (+)</span></td>
                <td className="px-6 py-8 font-bold">{tense.structure.positive.formula}</td>
                <td className="px-6 py-8 text-sm">{tense.structure.positive.rows[0].subject} <span className={`text-${themeColors}-600 font-bold`}>{tense.structure.positive.rows[0].verb}</span>...</td>
              </tr>
              <tr>
                <td className="px-6 py-8"><span className="bg-rose-600 text-white px-3 py-1 rounded text-[10px] font-black uppercase">Negative (-)</span></td>
                <td className="px-6 py-8 font-bold">{tense.structure.negative.formula}</td>
                <td className="px-6 py-8 text-sm">{tense.structure.negative.rows[0].subject} <span className="text-rose-600 font-bold">{tense.structure.negative.rows[0].helper}</span>...</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Mastery Examples */}
      <section className="bg-white rounded-[2.5rem] p-8 md:p-12 border border-slate-100 shadow-xl space-y-8">
        <h2 className="text-2xl md:text-3xl font-black text-slate-900 flex items-center gap-4"><Quote className={`text-${themeColors}-600`} /> {strings.examples}</h2>
        <div className="grid grid-cols-1 gap-4">
          {tense.examples.map((ex, i) => <ExampleCard key={i} ex={ex} />)}
        </div>
      </section>

      {/* AI Assistant Box (STREAMING) */}
      <section className="bg-slate-50 rounded-[2.5rem] p-8 md:p-12 border border-slate-100 space-y-8">
         <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-slate-900 text-white rounded-2xl flex items-center justify-center shadow-lg"><MessageSquare size={28} /></div>
            <div>
               <h2 className="text-2xl font-black text-slate-900">{lang === 'uz' ? 'Panda Ustozdan so\'rang' : 'Ask Panda Teacher'}</h2>
               <p className="text-slate-500 font-bold text-sm">Real-time answers for this tense.</p>
            </div>
         </div>
         <div className="space-y-4">
            <div className="relative">
               <input 
                  type="text" 
                  value={userQuestion}
                  onChange={(e) => setUserQuestion(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAskPanda()}
                  placeholder={lang === 'uz' ? 'Ingliz tili haqida so\'rang...' : 'Ask Panda...'}
                  className="w-full bg-white border-2 border-slate-200 rounded-2xl px-6 py-5 text-base font-bold focus:outline-none focus:border-slate-900 transition-all pr-32 shadow-sm"
               />
               <button 
                  onClick={handleAskPanda}
                  disabled={isAiLoading || !userQuestion.trim()}
                  className="absolute right-2 top-2 bottom-2 bg-slate-900 text-white px-6 rounded-xl font-black text-xs hover:bg-slate-800 transition-all disabled:opacity-30"
               >
                  {isAiLoading ? '...' : (lang === 'uz' ? 'So\'rash' : 'Ask')}
               </button>
            </div>
            {aiAnswer && (
               <div className="bg-white p-6 rounded-2xl border-2 border-emerald-100 shadow-lg animate-in fade-in slide-in-from-top-4">
                  <div className="flex items-center gap-2 text-emerald-600 font-black text-[10px] uppercase mb-2">
                     <Sparkles size={14} /> Panda Teacher:
                  </div>
                  <p className="text-slate-700 font-medium leading-relaxed whitespace-pre-wrap">{aiAnswer}</p>
               </div>
            )}
         </div>
      </section>

      {/* Practice Button */}
      {!practiceVisible && (
        <div className="flex justify-center pt-6">
          <button 
            onClick={handleStartPractice}
            className="group relative bg-slate-900 text-white px-8 py-4 rounded-2xl font-black text-base shadow-xl hover:scale-105 active:scale-95 transition-all animate-wiggle"
          >
            <div className="flex items-center gap-3">
              <Play size={18} fill="white" />
              {lang === 'uz' ? 'MASHQNI BOSHLASH' : 'START PRACTICE'}
            </div>
          </button>
        </div>
      )}

      {/* Practice Engine */}
      {practiceVisible && (
        <section ref={practiceRef} className="bg-slate-900 rounded-[2.5rem] p-6 md:p-10 text-white shadow-2xl relative overflow-hidden border border-slate-800">
          <div className="relative z-10 space-y-6">
            {!showResults ? (
              <>
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-black flex items-center gap-2"><Sparkles className={`text-${themeColors}-400`} size={20} /> Practice Mode</h2>
                  <div className="text-[10px] font-black text-slate-500">Question {currentIndex + 1}/{tense.practice.length}</div>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8 space-y-6">
                  <h3 className="text-lg md:text-xl font-black text-slate-100">{tense.practice[currentIndex]?.question}</h3>
                  <div className="pt-2">
                    {tense.practice[currentIndex]?.type === 'writing' ? (
                      <input 
                        type="text" autoFocus value={answers[currentIndex] || ''} onChange={(e) => handleWritingChange(e.target.value)} 
                        className="w-full bg-slate-800/50 border-2 border-slate-700 rounded-xl px-4 py-3 text-lg font-black focus:outline-none focus:border-emerald-500"
                      />
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {tense.practice[currentIndex]?.options?.map((opt, i) => (
                          <button key={i} onClick={() => handleOptionSelect(opt)} className={`p-3 rounded-xl border-2 font-black text-left transition-all ${answers[currentIndex] === opt ? `bg-${themeColors}-600 border-${themeColors}-400` : 'bg-slate-800/50 border-slate-700 hover:border-slate-500'}`}>
                            {opt}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex justify-between">
                  <button onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))} className="text-xs font-black opacity-50">Back</button>
                  <button onClick={() => { if (currentIndex < (tense.practice.length - 1)) setCurrentIndex(currentIndex + 1); else setShowResults(true); }} className={`px-8 py-3 bg-${themeColors}-600 rounded-xl font-black`}>Next</button>
                </div>
              </>
            ) : (
              <div className="text-center space-y-6 py-10">
                <h2 className="text-4xl font-black">Score: {results?.correct}/{tense.practice.length}</h2>
                <button onClick={() => onComplete(results?.xpEarned || 0)} className={`px-10 py-4 bg-${themeColors}-600 rounded-2xl font-black shadow-2xl`}>Finish & Get XP</button>
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  );
};

export default LessonPage;
