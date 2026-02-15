import React, { useEffect, useState } from 'react';

const SplashScreen: React.FC = () => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[200] bg-white flex items-center justify-center animate-out fade-out duration-1000 fill-mode-forwards">
      <style>
        {`
          @keyframes rainbowText {
            0% { color: #10b981; }
            25% { color: #3b82f6; }
            50% { color: #8b5cf6; }
            75% { color: #f59e0b; }
            100% { color: #10b981; }
          }
          .rainbow-animate {
            animation: rainbowText 2s infinite linear;
          }
        `}
      </style>
      <div className="text-center space-y-4">
        <h1 className="text-7xl md:text-9xl font-black tracking-tighter rainbow-animate scale-100 animate-pulse">
          Welcome!
        </h1>
        <div className="flex justify-center gap-2">
           <div className="w-3 h-3 bg-emerald-500 rounded-full animate-bounce [animation-delay:0s]" />
           <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce [animation-delay:0.2s]" />
           <div className="w-3 h-3 bg-indigo-500 rounded-full animate-bounce [animation-delay:0.4s]" />
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;