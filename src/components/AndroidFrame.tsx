import React from 'react';
import { Wifi, Battery, Signal, Sparkles } from 'lucide-react';
import { AppLogo } from './AppLogo';
import { Language } from '../types';

interface AndroidFrameProps {
  children: React.ReactNode;
  isRtl: boolean;
  language: Language;
  onToggleLanguage: () => void;
  isVip: boolean;
  activeTab: string;
  onTabChange: (tab: any) => void;
  showDevPanel: boolean;
  onToggleDevPanel: () => void;
}

export const AndroidFrame: React.FC<AndroidFrameProps> = ({
  children,
  isRtl,
  language,
  onToggleLanguage,
  isVip,
  activeTab,
  onTabChange,
  showDevPanel,
  onToggleDevPanel
}) => {
  const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
  
  // Detect if running directly on a mobile phone or inside Android APK WebView
  const isDirectMobile = typeof window !== 'undefined' && (
    window.location.hostname === 'appassets.androidplatform.net' ||
    /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent) ||
    window.innerWidth <= 640
  );

  if (isDirectMobile) {
    return (
      <div
        dir={isRtl ? 'rtl' : 'ltr'}
        className="w-full min-h-screen bg-[#090A0F] text-neutral-100 flex flex-col font-sans selection:bg-purple-600 selection:text-white"
        style={{ fontFamily: isRtl ? "'Vazirmatn', sans-serif" : "'Plus Jakarta Sans', sans-serif" }}
      >
        <main className="flex-1 w-full max-w-lg mx-auto flex flex-col min-h-screen">
          {children}
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-4 px-2 sm:px-4 bg-neutral-950 text-neutral-100 selection:bg-purple-600 selection:text-white">
      {/* Top Bar Controls for preview */}
      <header className="w-full max-w-md sm:max-w-xl md:max-w-2xl flex items-center justify-between pb-3 px-2 text-xs text-neutral-400">
        <div className="flex items-center gap-2">
          <AppLogo
            size="sm"
            shape="square"
            className="w-5 h-5 border border-purple-500/40 shadow-sm shadow-purple-900/40 shrink-0"
          />
          <span className="font-semibold text-neutral-200">CreatorFlow AI</span>
          <span className="hidden sm:inline text-neutral-400">توسعه‌دهنده: سیدحمیدموسوی زاده</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            id="btn-lang-toggle"
            onClick={onToggleLanguage}
            className="px-2.5 py-1 rounded-md bg-neutral-800/80 hover:bg-neutral-700 text-neutral-200 border border-neutral-700 transition flex items-center gap-1.5"
          >
            <span className="font-bold">{language === 'en' ? 'فارسی (FA)' : 'English (EN)'}</span>
          </button>
          <button
            id="btn-toggle-dev-hub"
            onClick={onToggleDevPanel}
            className={`px-2.5 py-1 rounded-md border transition flex items-center gap-1.5 font-medium ${
              showDevPanel
                ? 'bg-purple-600 text-white border-purple-500 shadow-md shadow-purple-900/40'
                : 'bg-neutral-800/80 text-purple-300 border-purple-500/40 hover:bg-neutral-800'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Android Code &amp; APK</span>
          </button>
        </div>
      </header>

      {/* Realistic Mobile Device Container for Desktop Preview */}
      <div className="relative w-full max-w-[412px] h-[850px] max-h-[92vh] rounded-[42px] p-[10px] bg-neutral-900 shadow-2xl shadow-purple-950/40 border-[3px] border-neutral-700/80 ring-1 ring-neutral-800 flex flex-col overflow-hidden">
        {/* Device Inner Screen */}
        <div
          dir={isRtl ? 'rtl' : 'ltr'}
          className="relative w-full h-full rounded-[34px] bg-[#090A0F] overflow-hidden flex flex-col font-sans"
          style={{ fontFamily: isRtl ? "'Vazirmatn', sans-serif" : "'Plus Jakarta Sans', sans-serif" }}
        >
          {/* Android Status Bar */}
          <div className="h-9 px-6 flex items-center justify-between text-[13px] font-medium text-neutral-400 select-none z-20 shrink-0 bg-[#090A0F]">
            <span>{currentTime}</span>
            {/* Camera Punch Hole */}
            <div className="w-4 h-4 rounded-full bg-black ring-1 ring-neutral-800 flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-neutral-900"></div>
            </div>
            <div className="flex items-center gap-1.5 text-neutral-400">
              <Signal className="w-3.5 h-3.5" />
              <Wifi className="w-3.5 h-3.5" />
              <Battery className="w-4 h-4 text-neutral-300" />
            </div>
          </div>

          {/* Main Scrollable Screen Area */}
          <main className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-neutral-800">
            {children}
          </main>

          {/* Android Navigation Gestures Pill Bar */}
          <div className="h-4 w-full bg-[#131622] flex items-center justify-center shrink-0">
            <div className="w-32 h-1 rounded-full bg-neutral-600"></div>
          </div>
        </div>
      </div>
    </div>
  );
};
