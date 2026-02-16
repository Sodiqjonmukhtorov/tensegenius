
import React, { useState, useRef, useEffect } from 'react';
import { Send, X } from 'lucide-react';
import { chatWithPandaStream } from '../geminiService';
import { Language } from '../types';

interface PandaMascotProps {
  lang: Language;
}

const PandaMascot: React.FC<PandaMascotProps> = ({ lang }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<{role: 'user' | 'panda', text: string}[]>([]);
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory, loading]);

  const handleSend = async () => {
    if (!message.trim() || loading) return;
    
    const userMsg = message.trim();
    setMessage('');
    
    // Foydalanuvchi xabarini qo'shish va Panda uchun joy tayyorlash
    setChatHistory(prev => [
      ...prev, 
      { role: 'user', text: userMsg },
      { role: 'panda', text: '' } // Bo'sh panda xabari oqim uchun
    ]);
    
    setLoading(true);

    try {
      const stream = chatWithPandaStream(userMsg, lang);
      let fullResponse = "";
      
      for await (const chunk of stream) {
        fullResponse += chunk;
        setChatHistory(prev => {
          const newHistory = [...prev];
          const lastIdx = newHistory.length - 1;
          if (newHistory[lastIdx].role === 'panda') {
            newHistory[lastIdx] = { ...newHistory[lastIdx], text: fullResponse };
          }
          return newHistory;
        });
      }
    } catch (err) {
      console.error("Panda Stream UI Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const formatText = (text: string) => {
    if (!text) return null;
    return text.split('\n').map((line, i) => (
      <span key={i} className="block mb-1">
        {line.split('**').map((part, j) => (
          j % 2 === 1 ? <strong key={j} className="text-emerald-700 font-black">{part}</strong> : part
        ))}
      </span>
    ));
  };

  return (
    <>
      {/* Panda Mascot Body */}
      <div 
        className={`fixed bottom-6 right-6 z-[100] transition-all duration-500 ease-in-out cursor-pointer group`}
        onClick={() => !isOpen && setIsOpen(true)}
      >
        <style>
          {`
            @keyframes bouncePanda {
              0%, 100% { transform: translateY(0); }
              50% { transform: translateY(-15px); }
            }
            @keyframes waveArm {
              0%, 100% { transform: rotate(-30deg); }
              50% { transform: rotate(-60deg); }
            }
            .animate-bounce-panda { animation: bouncePanda 3s ease-in-out infinite; }
            .animate-wave { transform-origin: 80px 80px; animation: waveArm 1s ease-in-out infinite; }
          `}
        </style>

        <div className={`absolute -top-16 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 transition-all duration-500 ${isOpen ? 'scale-0 opacity-0' : 'scale-100 opacity-100'}`}>
          <div className="bg-emerald-500 text-white text-[10px] font-black px-2.5 py-1 rounded-full shadow-lg animate-bounce-panda whitespace-nowrap border-2 border-white">
            Hi! 🐾
          </div>
        </div>

        <div className={`relative w-20 h-28 md:w-24 md:h-32 transform transition-transform group-hover:scale-110 active:scale-90 ${isOpen ? 'scale-0 opacity-0 pointer-events-none' : 'animate-bounce-panda'}`}>
          <svg viewBox="0 0 100 130" className="w-full h-full drop-shadow-2xl">
             <ellipse cx="35" cy="115" rx="8" ry="10" fill="#1a1a1a" />
             <ellipse cx="65" cy="115" rx="8" ry="10" fill="#1a1a1a" />
             <ellipse cx="20" cy="80" rx="10" ry="7" fill="#1a1a1a" transform="rotate(30 20 80)" />
             <g className="animate-wave">
                <ellipse cx="80" cy="80" rx="12" ry="8" fill="#1a1a1a" />
             </g>
             <circle cx="50" cy="85" r="32" fill="white" stroke="#f1f5f9" strokeWidth="0.5" />
             <path d="M25 68 Q50 63 75 68 L75 82 Q50 97 25 82 Z" fill="#1a1a1a" /> 
             <circle cx="50" cy="45" r="32" fill="white" stroke="#f1f5f9" strokeWidth="0.5" />
             <circle cx="25" cy="22" r="9" fill="#1a1a1a" />
             <circle cx="75" cy="22" r="9" fill="#1a1a1a" />
             <ellipse cx="37" cy="45" rx="9" ry="11" fill="#1a1a1a" transform="rotate(-10 37 45)" />
             <ellipse cx="63" cy="45" rx="9" ry="11" fill="#1a1a1a" transform="rotate(10 63 45)" />
             <circle cx="38" cy="43" r="3" fill="white" />
             <circle cx="62" cy="43" r="3" fill="white" />
             <circle cx="28" cy="55" r="4" fill="#ffccd5" opacity="0.7" />
             <circle cx="72" cy="55" r="4" fill="#ffccd5" opacity="0.7" />
             <path d="M47 55 Q50 58 53 55" fill="none" stroke="#1a1a1a" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </div>
      </div>

      {/* Chat Window */}
      <div className={`fixed bottom-6 right-6 z-[110] w-[90vw] md:w-96 bg-white rounded-[2rem] shadow-2xl border border-green-100 flex flex-col overflow-hidden transition-all duration-500 transform ${isOpen ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-20 opacity-0 scale-90 pointer-events-none'}`}>
        <div className="bg-slate-900 p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center overflow-hidden border-2 border-emerald-500 shadow-inner">
                <svg viewBox="0 0 100 100" className="w-8 h-8">
                   <circle cx="50" cy="50" r="45" fill="white" />
                   <circle cx="30" cy="30" r="10" fill="#1a1a1a" />
                   <circle cx="70" cy="30" r="10" fill="#1a1a1a" />
                   <ellipse cx="35" cy="55" rx="8" ry="10" fill="#1a1a1a" />
                   <ellipse cx="65" cy="55" rx="8" ry="10" fill="#1a1a1a" />
                </svg>
             </div>
             <div>
                <div className="text-xs font-black tracking-tight uppercase">Panda Ustoz</div>
                <div className="text-[8px] text-green-400 font-bold uppercase tracking-widest flex items-center gap-1">
                   <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span> Online
                </div>
             </div>
          </div>
          <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-white/10 rounded-xl transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 p-5 overflow-y-auto space-y-5 max-h-[450px] bg-emerald-50/10">
          <div className="flex gap-2">
            <div className="bg-white p-4 rounded-3xl rounded-tl-none border border-emerald-100 shadow-sm text-[12px] font-medium text-slate-700 max-w-[90%] leading-relaxed">
              {lang === 'uz' ? "Salom! Men TenseGenius pandasiman 🐾 Sizga ingliz tilini o'rganishda yordam beraman. Qanday savolingiz bor?" : "Hi! I'm the TenseGenius Panda 🐾 I'm here to help you master English. What's your question?"}
            </div>
          </div>

          {chatHistory.map((chat, i) => (
            <div key={i} className={`flex ${chat.role === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2`}>
              <div className={`p-4 rounded-3xl text-[12px] font-medium max-w-[90%] shadow-md ${chat.role === 'user' ? 'bg-slate-900 text-white rounded-tr-none' : 'bg-white text-slate-700 border border-emerald-100 rounded-tl-none'}`}>
                {chat.role === 'panda' ? (chat.text ? formatText(chat.text) : <div className="flex gap-1"><span className="w-1 h-1 bg-emerald-400 rounded-full animate-bounce"></span><span className="w-1 h-1 bg-emerald-400 rounded-full animate-bounce [animation-delay:0.2s]"></span><span className="w-1 h-1 bg-emerald-400 rounded-full animate-bounce [animation-delay:0.4s]"></span></div>) : chat.text}
              </div>
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>

        <div className="p-4 bg-white border-t border-emerald-50">
          <div className="relative group">
            <input 
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder={lang === 'uz' ? "Ingliz tili haqida so'rang..." : "Ask about English..."}
              className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-5 py-3.5 text-xs font-bold focus:outline-none focus:border-emerald-500 transition-all pr-12 shadow-inner"
            />
            <button 
              onClick={handleSend}
              disabled={loading || !message.trim()}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2.5 bg-slate-900 text-white rounded-xl active:scale-90 transition-transform disabled:opacity-30 shadow-lg"
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default PandaMascot;
