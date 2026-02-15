
import React, { useState, useRef, useEffect } from 'react';
import { Send, X } from 'lucide-react';
import { chatWithPanda } from '../geminiService';
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
  }, [chatHistory]);

  const handleSend = async () => {
    if (!message.trim() || loading) return;
    
    const userMsg = message;
    setMessage('');
    setChatHistory(prev => [...prev, { role: 'user', text: userMsg }]);
    setLoading(true);

    try {
      const response = await chatWithPanda(userMsg, lang);
      setChatHistory(prev => [...prev, { role: 'panda', text: response }]);
    } catch (err) {
      setChatHistory(prev => [...prev, { role: 'panda', text: "Xatolik yuz berdi 🐾" }]);
    } finally {
      setLoading(false);
    }
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
            @keyframes miniPulse {
              0%, 100% { transform: scale(1); opacity: 1; }
              50% { transform: scale(1.1); opacity: 0.9; }
            }
            .animate-bounce-panda {
              animation: bouncePanda 3s ease-in-out infinite;
            }
            .animate-wave {
              transform-origin: 80px 80px;
              animation: waveArm 1s ease-in-out infinite;
            }
            .animate-hi {
              animation: miniPulse 2s ease-in-out infinite;
            }
          `}
        </style>

        {/* "Hi!" and "Question" Bubble Container */}
        <div className={`absolute -top-16 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 transition-all duration-500 ${isOpen ? 'scale-0 opacity-0' : 'scale-100 opacity-100'}`}>
          {/* Static Hi! Bubble */}
          <div className="bg-emerald-500 text-white text-[10px] font-black px-2.5 py-1 rounded-full shadow-lg animate-hi whitespace-nowrap border-2 border-white">
            Hi! 🐾
          </div>
          {/* Hover Question Bubble */}
          <div className="bg-white text-slate-900 text-[9px] font-black px-3 py-1.5 rounded-2xl shadow-xl border border-green-100 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            {lang === 'uz' ? "Savol?" : "Help?"}
          </div>
        </div>

        {/* The Panda SVG */}
        <div className={`relative w-20 h-28 md:w-24 md:h-32 transform transition-transform group-hover:scale-110 active:scale-90 ${isOpen ? 'scale-0 opacity-0 pointer-events-none' : 'animate-bounce-panda'}`}>
          <svg viewBox="0 0 100 130" className="w-full h-full drop-shadow-2xl">
             {/* Legs */}
             <ellipse cx="35" cy="115" rx="8" ry="10" fill="#1a1a1a" />
             <ellipse cx="65" cy="115" rx="8" ry="10" fill="#1a1a1a" />
             
             {/* Left Arm (Static) */}
             <ellipse cx="20" cy="80" rx="10" ry="7" fill="#1a1a1a" transform="rotate(30 20 80)" />
             
             {/* Right Arm (Waving!) */}
             <g className="animate-wave">
                <ellipse cx="80" cy="80" rx="12" ry="8" fill="#1a1a1a" />
             </g>

             {/* Body */}
             <circle cx="50" cy="85" r="32" fill="white" stroke="#f1f5f9" strokeWidth="0.5" />
             <path d="M25 68 Q50 63 75 68 L75 82 Q50 97 25 82 Z" fill="#1a1a1a" /> 
             
             {/* Head */}
             <circle cx="50" cy="45" r="32" fill="white" stroke="#f1f5f9" strokeWidth="0.5" />
             
             {/* Ears */}
             <circle cx="25" cy="22" r="9" fill="#1a1a1a" />
             <circle cx="75" cy="22" r="9" fill="#1a1a1a" />
             
             {/* Eyes */}
             <ellipse cx="37" cy="45" rx="9" ry="11" fill="#1a1a1a" transform="rotate(-10 37 45)" />
             <ellipse cx="63" cy="45" rx="9" ry="11" fill="#1a1a1a" transform="rotate(10 63 45)" />
             <circle cx="38" cy="43" r="3" fill="white" />
             <circle cx="62" cy="43" r="3" fill="white" />
             
             {/* Blushed Cheeks */}
             <circle cx="28" cy="55" r="4" fill="#ffccd5" opacity="0.7" />
             <circle cx="72" cy="55" r="4" fill="#ffccd5" opacity="0.7" />

             {/* Nose & Mouth */}
             <path d="M47 55 Q50 58 53 55" fill="none" stroke="#1a1a1a" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </div>
      </div>

      {/* Chat Window */}
      <div className={`fixed bottom-6 right-6 z-[110] w-[90vw] md:w-80 bg-white rounded-[2rem] shadow-2xl border border-green-100 flex flex-col overflow-hidden transition-all duration-500 transform ${isOpen ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-20 opacity-0 scale-90 pointer-events-none'}`}>
        <div className="bg-slate-900 p-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center overflow-hidden">
                <svg viewBox="0 0 100 100" className="w-6 h-6">
                   <circle cx="50" cy="50" r="45" fill="white" />
                   <circle cx="30" cy="30" r="10" fill="#1a1a1a" />
                   <circle cx="70" cy="30" r="10" fill="#1a1a1a" />
                   <ellipse cx="35" cy="55" rx="8" ry="10" fill="#1a1a1a" />
                   <ellipse cx="65" cy="55" rx="8" ry="10" fill="#1a1a1a" />
                </svg>
             </div>
             <div>
                <div className="text-[11px] font-black tracking-tight">TenseGenius Panda</div>
                <div className="text-[8px] text-green-400 font-bold uppercase tracking-widest">Online</div>
             </div>
          </div>
          <button onClick={() => setIsOpen(false)} className="p-1.5 hover:bg-white/10 rounded-lg transition-colors">
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 p-4 overflow-y-auto space-y-4 max-h-[350px] bg-green-50/20">
          <div className="flex gap-2">
            <div className="bg-white p-3 rounded-2xl rounded-tl-none border border-green-100 shadow-sm text-[11px] font-medium text-slate-700 max-w-[85%] leading-relaxed">
              {lang === 'uz' ? "Salom! Men TenseGenius pandasiman 🐾 Sodiqjon Mukhtorov tomonidan yaratilganman. Savoling bormi?" : "Hi! I'm the TenseGenius Panda 🐾 Created by Sodiqjon Mukhtorov. Ask me anything!"}
            </div>
          </div>

          {chatHistory.map((chat, i) => (
            <div key={i} className={`flex ${chat.role === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2`}>
              <div className={`p-3 rounded-2xl text-[11px] font-medium max-w-[85%] shadow-sm ${chat.role === 'user' ? 'bg-slate-900 text-white rounded-tr-none' : 'bg-white text-slate-700 border border-green-100 rounded-tl-none'}`}>
                {chat.text}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
               <div className="bg-white p-3 rounded-2xl rounded-tl-none border border-green-100 shadow-sm flex gap-1">
                 <div className="w-1 h-1 bg-green-400 rounded-full animate-bounce" />
                 <div className="w-1 h-1 bg-green-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                 <div className="w-1 h-1 bg-green-400 rounded-full animate-bounce [animation-delay:0.4s]" />
               </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        <div className="p-3 bg-white border-t border-green-50">
          <div className="relative">
            <input 
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder={lang === 'uz' ? "Yozing..." : "Type..."}
              className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5 text-[11px] font-bold focus:outline-none focus:border-green-400 pr-10"
            />
            <button 
              onClick={handleSend}
              disabled={loading || !message.trim()}
              className="absolute right-1.5 top-1/2 -translate-y-1/2 p-1.5 bg-slate-900 text-white rounded-lg active:scale-90 transition-transform disabled:opacity-30"
            >
              <Send size={14} />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default PandaMascot;
