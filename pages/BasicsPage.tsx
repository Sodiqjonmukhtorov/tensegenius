
import React from 'react';
import { Language } from '../types';
import { UI_STRINGS, SVO_EXAMPLES } from '../constants';
import { 
  BookOpen, User, Activity, Box, ArrowRight, Clock, Link, CheckCircle2, 
  Zap, Plus, ArrowLeft, CircleDot, Check
} from 'lucide-react';
import FooterInfo from '../components/FooterInfo';

interface BasicsPageProps {
  lang: Language;
}

const BasicsPage: React.FC<BasicsPageProps> = ({ lang }) => {
  const strings = UI_STRINGS[lang];

  return (
    <div className="max-w-5xl mx-auto py-12 px-6 space-y-24 relative z-10 pb-40">
      {/* Header */}
      <div className="bg-slate-900 rounded-[3rem] p-10 md:p-16 shadow-2xl relative overflow-hidden text-white border border-slate-800">
        <div className="absolute top-0 right-0 p-12 opacity-5 rotate-12">
          <BookOpen size={160} />
        </div>
        <div className="relative z-10 space-y-6 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-5 py-2 bg-emerald-500/20 text-emerald-300 rounded-full text-xs font-black uppercase tracking-widest border border-emerald-500/30">
            <Activity size={14} className="animate-pulse" />
            {strings.basics}
          </div>
          <h1 className="text-4xl md:text-6xl font-black leading-tight">
            {strings.basicsTitle}
          </h1>
          <p className="text-slate-400 text-xl max-w-2xl font-medium leading-relaxed">
            {strings.basicsSubtitle}
          </p>
        </div>
      </div>

      {/* Core Concept: Sentence Logic */}
      <section className="space-y-12">
        <div className="flex flex-col items-center text-center space-y-4">
           <h2 className="text-3xl md:text-5xl font-black text-slate-800 flex items-center gap-4">
             <CheckCircle2 className="text-emerald-500" /> {strings.svoHeading}
           </h2>
           <p className="text-xl text-slate-500 max-w-2xl leading-relaxed">
             {strings.svoSub}
           </p>
        </div>

        {/* Visual S+V+O List Example */}
        <div className="space-y-6">
          {SVO_EXAMPLES.map((ex, i) => (
            <div key={i} className="bg-white p-6 md:p-8 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6 group hover:shadow-md transition-all">
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 md:gap-6">
                <div className="px-5 py-3 bg-blue-50 text-blue-600 rounded-xl font-black text-lg border border-blue-100 min-w-[80px] text-center">{ex.s}</div>
                <div className="text-slate-200 font-black">+</div>
                <div className="px-5 py-3 bg-purple-50 text-purple-600 rounded-xl font-black text-lg border border-purple-100 min-w-[80px] text-center">{ex.v}</div>
                <div className="text-slate-200 font-black">+</div>
                <div className="px-5 py-3 bg-orange-50 text-orange-600 rounded-xl font-black text-lg border border-orange-100 min-w-[80px] text-center">{ex.o}</div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="text-slate-300 font-black text-xl">=</div>
                <div className="px-6 py-3 bg-slate-900 text-emerald-400 rounded-2xl font-black text-xl shadow-lg">
                  "{ex.full}"
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* What is Tense Section */}
      <section className="space-y-12">
        <div className="flex flex-col items-start space-y-4">
           <h2 className="text-3xl md:text-5xl font-black text-slate-800 flex items-center gap-4">
             <Clock className="text-indigo-600" /> {strings.whatIsTense}
           </h2>
           <p className="text-xl text-slate-500 font-medium max-w-3xl leading-relaxed">
             <span className="text-indigo-600 font-black">{lang === 'uz' ? 'Zamon' : 'Tense'}</span> {strings.tenseExplanation}
           </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Past Card */}
          <div className="bg-amber-50/30 border border-amber-100 rounded-[2.5rem] p-8 space-y-8 flex flex-col items-center text-center shadow-sm">
             <div className="w-16 h-16 bg-amber-500 rounded-full flex items-center justify-center text-white shadow-lg shadow-amber-200/50">
                <ArrowLeft size={28} />
             </div>
             <div>
               <h3 className="text-2xl font-black text-amber-700">{strings.pastLabel}</h3>
               <p className="text-sm font-bold text-amber-600/70">{strings.alreadyHappened}</p>
             </div>
             <div className="w-full space-y-3 pt-4">
                <div className="p-4 bg-white rounded-2xl border border-amber-100 text-left">
                   <p className="text-sm font-bold text-slate-800">I <span className="text-amber-600">ate</span> an apple.</p>
                </div>
                <div className="p-4 bg-white rounded-2xl border border-amber-100 text-left">
                   <p className="text-sm font-bold text-slate-800">She <span className="text-amber-600">played</span> yesterday.</p>
                </div>
             </div>
             <div className="flex items-center gap-2 text-amber-600/60 font-black text-[10px] uppercase tracking-widest pt-4">
                {strings.actionFinished} <Check size={14} />
             </div>
          </div>

          {/* Present Card */}
          <div className="bg-emerald-50/30 border-2 border-emerald-500/20 rounded-[2.5rem] p-8 space-y-8 flex flex-col items-center text-center shadow-xl scale-105 bg-white">
             <div className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center text-white shadow-lg shadow-emerald-200/50">
                <CircleDot size={28} />
             </div>
             <div>
               <h3 className="text-2xl font-black text-emerald-700">{strings.presentLabel}</h3>
               <p className="text-sm font-bold text-emerald-600/70">{strings.happeningNow}</p>
             </div>
             <div className="w-full space-y-3 pt-4">
                <div className="p-4 bg-white rounded-2xl border border-emerald-100 text-left">
                   <p className="text-sm font-bold text-slate-800">I <span className="text-emerald-600">eat</span> apples.</p>
                </div>
                <div className="p-4 bg-white rounded-2xl border border-emerald-100 text-left">
                   <p className="text-sm font-bold text-slate-800">She <span className="text-emerald-600">plays</span> every day.</p>
                </div>
             </div>
             <div className="flex items-center gap-2 text-emerald-600/60 font-black text-[10px] uppercase tracking-widest pt-4">
                {strings.actionCurrent} <Check size={14} />
             </div>
          </div>

          {/* Future Card */}
          <div className="bg-blue-50/30 border border-blue-100 rounded-[2.5rem] p-8 space-y-8 flex flex-col items-center text-center shadow-sm">
             <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center text-white shadow-lg shadow-blue-200/50">
                <ArrowRight size={28} />
             </div>
             <div>
               <h3 className="text-2xl font-black text-blue-700">{strings.futureLabel}</h3>
               <p className="text-sm font-bold text-blue-600/70">{strings.willHappenLater}</p>
             </div>
             <div className="w-full space-y-3 pt-4">
                <div className="p-4 bg-white rounded-2xl border border-blue-100 text-left">
                   <p className="text-sm font-bold text-slate-800">I <span className="text-blue-600">will eat</span> an apple.</p>
                </div>
                <div className="p-4 bg-white rounded-2xl border border-blue-100 text-left">
                   <p className="text-sm font-bold text-slate-800">She <span className="text-blue-600">will play</span> tomorrow.</p>
                </div>
             </div>
             <div className="flex items-center gap-2 text-blue-600/60 font-black text-[10px] uppercase tracking-widest pt-4">
                {strings.actionPlanned} <Check size={14} />
             </div>
          </div>
        </div>
      </section>

      {/* The Mystery of Agreement (Tobelik) */}
      <section className="bg-slate-900 rounded-[3rem] p-10 md:p-16 text-white space-y-10 shadow-2xl relative overflow-hidden">
         <div className="absolute bottom-0 right-0 opacity-10 -mb-10 -mr-10">
            <Link size={300} />
         </div>
         <div className="relative z-10 space-y-8">
            <div className="flex items-center gap-4">
               <div className="w-14 h-14 bg-emerald-500 rounded-2xl flex items-center justify-center text-white shadow-lg">
                  <CheckCircle2 size={32} />
               </div>
               <h2 className="text-3xl md:text-5xl font-black">{strings.agreement}</h2>
            </div>
            <p className="text-xl text-slate-400 font-medium leading-relaxed max-w-3xl">
              {strings.agreementDesc}
            </p>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-6">
               <div className="bg-white/5 p-8 rounded-3xl border border-white/10 space-y-6">
                  <div className="flex items-center gap-2 text-blue-400 font-black uppercase tracking-widest text-xs">
                     <Zap size={14} /> Rule 1: Plural & I
                  </div>
                  <div className="space-y-3 font-mono text-lg">
                     <div className="flex justify-between p-4 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 transition-colors">
                        <span className="text-slate-400">I / You / We / They</span> 
                        <span className="text-emerald-400 font-black">EAT</span>
                     </div>
                     <p className="text-[10px] text-slate-500 uppercase font-bold px-4">Tobelik: Fe'l o'zgarmaydi.</p>
                  </div>
               </div>
               <div className="bg-white/5 p-8 rounded-3xl border border-white/10 space-y-6">
                  <div className="flex items-center gap-2 text-rose-400 font-black uppercase tracking-widest text-xs">
                     <Zap size={14} /> Rule 2: 3rd Person Singular
                  </div>
                  <div className="space-y-3 font-mono text-lg">
                     <div className="flex justify-between p-4 bg-white/10 rounded-2xl border-2 border-emerald-500/30 hover:bg-white/20 transition-colors">
                        <span className="text-slate-400">He / She / It</span> 
                        <span className="text-emerald-400 font-black">EAT<span className="text-rose-400 underline decoration-2 underline-offset-4">S</span></span>
                     </div>
                     <p className="text-[10px] text-rose-400 uppercase font-bold px-4">Tobelik: Fe'lga 'S' qo'shiladi.</p>
                  </div>
               </div>
            </div>

            <div className="bg-emerald-500/10 p-8 rounded-[2rem] border border-emerald-500/20 text-emerald-100 italic font-medium">
               {lang === 'uz' 
                 ? "Eslab qoling: Tobelik (Agreement) — bu ega birlik yoki ko'plikdaligiga qarab fe'lning moslashishidir. Bu ingliz tilidagi eng muhim 'qonun'!"
                 : "Remember: Agreement is the matching of the verb to the subject's number (singular or plural). This is the most important 'law' in English!"}
            </div>
         </div>
      </section>

      {/* Start Button */}
      <div className="flex justify-center pb-20">
        <button className="group flex items-center gap-4 bg-slate-900 text-white px-12 py-7 rounded-[2.5rem] font-black text-2xl hover:scale-105 active:scale-95 transition-all shadow-2xl">
          {strings.startJourney} 
          <ArrowRight size={28} className="group-hover:translate-x-2 transition-transform" />
        </button>
      </div>

      <FooterInfo lang={lang} />
    </div>
  );
};

export default BasicsPage;
