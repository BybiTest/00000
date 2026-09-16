import React, { useEffect, useState } from 'react';
import { AppLogo } from './AppLogo';
import { Sparkles, ArrowRight } from 'lucide-react';
import { Language } from '../types';

interface SplashScreenProps {
  lang: Language;
  onFinish: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ lang, onFinish }) => {
  const [fading, setFading] = useState(false);

  useEffect(() => {
    // Auto-transition to home after 1.4s
    const timer = setTimeout(() => {
      setFading(true);
      setTimeout(onFinish, 300);
    }, 1400);

    return () => clearTimeout(timer);
  }, [onFinish]);

  const handleSkip = () => {
    setFading(true);
    setTimeout(onFinish, 150);
  };

  const isFa = lang === 'fa';

  return (
    <div
      onClick={handleSkip}
      className={`fixed inset-0 z-50 bg-[#090A0F] flex flex-col items-center justify-between p-6 select-none cursor-pointer transition-opacity duration-300 ${
        fading ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Top indicator */}
      <div className="w-full flex justify-end">
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleSkip();
          }}
          className="text-xs text-neutral-500 hover:text-purple-400 flex items-center gap-1 font-mono transition"
        >
          <span>{isFa ? 'رد شدن' : 'Skip'}</span>
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>

      {/* Centered Brand Experience */}
      <div className="flex flex-col items-center text-center space-y-5 my-auto">
        <div className="relative group">
          {/* Ambient Glow */}
          <div className="absolute -inset-4 bg-gradient-to-r from-purple-600/30 to-indigo-600/30 rounded-3xl blur-xl animate-pulse" />
          
          <div className="relative border-2 border-purple-500/50 rounded-3xl p-1 bg-[#131622] shadow-2xl shadow-purple-950/70">
            <AppLogo
              size="xl"
              shape="squircle"
              className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl shadow-inner"
            />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              CreatorFlow <span className="text-purple-400">AI</span>
            </h1>
            <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-purple-900/60 text-purple-300 border border-purple-700/40">
              PRO
            </span>
          </div>

          <p className="text-sm font-semibold text-purple-300/90">
            {isFa ? 'دستیار و استودیوی هوشمند تولید محتوای وایرال' : 'AI Content Studio & Viral Growth Engine'}
          </p>
        </div>

        {/* Loading line */}
        <div className="w-44 h-1 bg-neutral-800 rounded-full overflow-hidden mt-4">
          <div className="h-full bg-gradient-to-r from-purple-500 via-indigo-500 to-amber-400 w-full animate-[pulse_1s_ease-in-out_infinite]" />
        </div>
      </div>

      {/* Footer Branding & Publisher */}
      <div className="flex flex-col items-center space-y-1 text-center">
        <div className="flex items-center gap-1.5 text-xs text-neutral-400">
          <Sparkles className="w-3.5 h-3.5 text-purple-400" />
          <span className="font-medium text-neutral-300">
            {isFa ? 'توسعه‌دهنده: سیدحمیدموسوی زاده' : 'Developer: Seyed Hamid Mousavi Zadeh'}
          </span>
        </div>
        <span className="text-[10px] text-neutral-600 font-mono">
          Release 2026.1 • Android Studio & Web Engine
        </span>
      </div>
    </div>
  );
};
