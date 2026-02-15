
import React from 'react';
import { Language } from '../types';
import { UI_STRINGS } from '../constants';
import { Info, User, Send, ExternalLink, Sparkles, Code2 } from 'lucide-react';

interface FooterInfoProps {
  lang: Language;
}

const FooterInfo: React.FC<FooterInfoProps> = ({ lang }) => {
  const strings = UI_STRINGS[lang];

  return (
    <section className="pt-20 pb-10 space-y-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* About the Platform Card */}
        <div className="bg-white rounded-[3rem] p-8 md:p-10 border border-slate-100 shadow-xl space-y-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:rotate-12 transition-transform">
            <Info size={120} />
          </div>
          <div className="flex items-center gap-4 text-emerald-600">
            <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center">
              <Sparkles size={24} />
            </div>
            <h2 className="text-2xl font-black">{strings.aboutPlatform}</h2>
          </div>
          <div className="space-y-4 relative z-10">
            <h3 className="text-lg font-black text-slate-800">{strings.platformPurpose}</h3>
            <p className="text-slate-500 font-medium leading-relaxed">
              {strings.platformDesc}
            </p>
            <div className="grid grid-cols-2 gap-4 pt-4">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="text-xl font-black text-slate-900">16</div>
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Zamonlar</div>
              </div>
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="text-xl font-black text-slate-900">AI</div>
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Aqlli Tahlil</div>
              </div>
            </div>
          </div>
        </div>

        {/* About the Developer Card */}
        <div className="bg-slate-900 rounded-[3rem] p-8 md:p-10 text-white shadow-2xl space-y-6 relative overflow-hidden group border border-slate-800">
          <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:rotate-12 transition-transform">
            <Code2 size={120} />
          </div>
          <div className="flex items-center gap-4 text-emerald-400">
            <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-md">
              <User size={24} />
            </div>
            <h2 className="text-2xl font-black">{strings.aboutDev}</h2>
          </div>
          <div className="space-y-4 relative z-10">
            <h3 className="text-xl font-black text-white">Sodiqjon Mukhtorov</h3>
            <p className="text-slate-400 font-medium leading-relaxed">
              {strings.devBio}
            </p>
            
            <div className="pt-6 border-t border-white/10 flex flex-wrap items-center gap-4">
              <a 
                href="https://t.me/sodiqjon_lutfullayevich" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 bg-emerald-500 hover:bg-emerald-400 text-slate-900 px-6 py-3 rounded-2xl font-black text-sm transition-all shadow-lg hover:scale-105 active:scale-95"
              >
                <Send size={18} />
                {strings.telegramProfile}
                <ExternalLink size={14} className="opacity-50" />
              </a>
              
              <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-xl border border-white/10">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Available for Projects</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="text-center">
        <p className="text-slate-300 font-black text-[10px] uppercase tracking-[0.5em]">
          © {new Date().getFullYear()} TenseGenius • Made with 💚 in Uzbekistan
        </p>
      </div>
    </section>
  );
};

export default FooterInfo;
