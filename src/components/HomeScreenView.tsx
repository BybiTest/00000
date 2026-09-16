import React from 'react';
import { Sparkles, Zap, Flame, ArrowUpRight, Lightbulb, FileText, MessageSquareQuote, Crown } from 'lucide-react';
import { Language, MonetizationPlan, NavTab } from '../types';
import { translations } from '../locales';

interface HomeScreenViewProps {
  lang: Language;
  onNavigate: (tab: NavTab) => void;
  onOpenTool: (tool: string) => void;
  plan: MonetizationPlan;
  remainingCredits: number;
}

export const HomeScreenView: React.FC<HomeScreenViewProps> = ({
  lang,
  onNavigate,
  onOpenTool,
  plan,
  remainingCredits
}) => {
  const t = translations[lang];

  return (
    <div className="p-4 space-y-4 pb-6">
      {/* Brand Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img
            src="/icon.jpg"
            alt="CreatorFlow AI Icon"
            className="w-10 h-10 rounded-xl object-cover border border-purple-500/40 shadow-md shadow-purple-950/50"
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-1.5">
                <span>{lang === 'fa' ? t.persianName : t.appName}</span>
                <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-purple-600/30 text-purple-300 border border-purple-500/30">
                  PRO
                </span>
              </h1>
            </div>
            <p className="text-xs text-purple-400/90 font-medium">{t.publisher}</p>
          </div>
        </div>

        {/* Plan / Credits Chip */}
        <div
          onClick={() => onNavigate('profile')}
          className={`cursor-pointer px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 border transition ${
            plan === 'VIP'
              ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
              : 'bg-purple-950/40 text-purple-300 border-purple-800/50'
          }`}
        >
          {plan === 'VIP' ? <Crown className="w-3.5 h-3.5 text-amber-400" /> : <Zap className="w-3.5 h-3.5 text-purple-400" />}
          <span>{plan === 'VIP' ? t.home.vipUnlimited : `${remainingCredits} ${t.home.creditsLeft}`}</span>
        </div>
      </div>

      {/* Hero Action Card */}
      <div className="relative overflow-hidden rounded-2xl p-4 bg-gradient-to-br from-purple-900/60 via-[#161926] to-[#0D0F17] border border-purple-500/30 shadow-lg shadow-purple-950/30">
        <div className="relative z-10 space-y-2">
          <div className="flex items-center gap-1.5 text-amber-400 text-xs font-bold uppercase tracking-wider">
            <Flame className="w-4 h-4" />
            <span>{t.home.trendingHook}</span>
          </div>
          <p className="text-sm font-semibold text-white leading-snug">
            "{lang === 'fa' ? '۹۹٪ تولیدکننده‌ها این کار رو اشتباه انجام میدن... این ترفند ۳ ثانیه‌ای بازدیدت رو ۲ برابر می‌کنه.' : '99% of creators mess this up... here is the 3-second hook fix.'}"
          </p>
          <div className="flex items-center justify-between pt-1">
            <span className="text-[11px] text-neutral-400 font-medium">
              {t.home.hookDesc}
            </span>
            <button
              id="btn-use-trending-hook"
              onClick={() => {
                onNavigate('studio');
                onOpenTool('hooks');
              }}
              className="px-2.5 py-1 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold flex items-center gap-1 transition"
            >
              <span>{t.home.startCreation}</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Quick Access AI Tools Grid */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-neutral-200">{t.home.quickTools}</h2>
          <button
            id="btn-see-all-studio"
            onClick={() => onNavigate('studio')}
            className="text-xs text-purple-400 hover:text-purple-300 font-medium"
          >
            {t.home.viewAll}
          </button>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          {/* Card 1: Idea Gen */}
          <button
            id="btn-card-ideas"
            onClick={() => {
              onNavigate('studio');
              onOpenTool('ideas');
            }}
            className="p-3.5 rounded-xl bg-[#131622] hover:bg-[#1A1E2E] border border-purple-900/30 text-start flex flex-col justify-between transition group"
          >
            <div className="w-8 h-8 rounded-lg bg-purple-600/20 text-purple-400 flex items-center justify-center mb-2 group-hover:scale-105 transition">
              <Lightbulb className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-white group-hover:text-purple-300 transition">
                {t.studio.tools.ideas}
              </div>
              <div className="text-[11px] text-neutral-400 leading-tight mt-0.5">
                {lang === 'fa' ? 'ایده‌های ویروسی و زاویه دید' : 'Viral concepts & angles'}
              </div>
            </div>
          </button>

          {/* Card 2: Hook Gen */}
          <button
            id="btn-card-hooks"
            onClick={() => {
              onNavigate('studio');
              onOpenTool('hooks');
            }}
            className="p-3.5 rounded-xl bg-[#131622] hover:bg-[#1A1E2E] border border-amber-900/30 text-start flex flex-col justify-between transition group"
          >
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center mb-2 group-hover:scale-105 transition">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-white group-hover:text-amber-300 transition">
                {t.studio.tools.hooks}
              </div>
              <div className="text-[11px] text-neutral-400 leading-tight mt-0.5">
                {lang === 'fa' ? 'قلاب‌های ۳ ثانیه‌ای جذب' : '3-sec scroll stoppers'}
              </div>
            </div>
          </button>

          {/* Card 3: Script Writer */}
          <button
            id="btn-card-scripts"
            onClick={() => {
              onNavigate('studio');
              onOpenTool('scripts');
            }}
            className="p-3.5 rounded-xl bg-[#131622] hover:bg-[#1A1E2E] border border-blue-900/30 text-start flex flex-col justify-between transition group"
          >
            <div className="w-8 h-8 rounded-lg bg-blue-600/20 text-blue-400 flex items-center justify-center mb-2 group-hover:scale-105 transition">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-white group-hover:text-blue-300 transition">
                {t.studio.tools.scripts}
              </div>
              <div className="text-[11px] text-neutral-400 leading-tight mt-0.5">
                {lang === 'fa' ? 'سناریوهای استاندارد ۵ بخشی' : 'Complete 5-part scripts'}
              </div>
            </div>
          </button>

          {/* Card 4: AI Strategist */}
          <button
            id="btn-card-chat"
            onClick={() => {
              onNavigate('studio');
              onOpenTool('chat');
            }}
            className="p-3.5 rounded-xl bg-[#131622] hover:bg-[#1A1E2E] border border-emerald-900/30 text-start flex flex-col justify-between transition group"
          >
            <div className="w-8 h-8 rounded-lg bg-emerald-600/20 text-emerald-400 flex items-center justify-center mb-2 group-hover:scale-105 transition">
              <MessageSquareQuote className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-white group-hover:text-emerald-300 transition">
                {t.studio.tools.chat}
              </div>
              <div className="text-[11px] text-neutral-400 leading-tight mt-0.5">
                {lang === 'fa' ? 'مشاور الگوریتم و رشد' : '24/7 Growth Strategist'}
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* Production Pipeline Overview */}
      <div className="p-3.5 rounded-xl bg-[#131622] border border-neutral-800 space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-neutral-300 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            {t.home.recentProjects}
          </span>
          <span className="text-[10px] text-purple-400 bg-purple-950/60 px-2 py-0.5 rounded font-mono">Room DB</span>
        </div>

        <div className="space-y-2">
          <div className="p-2.5 rounded-lg bg-[#090A0F] border border-neutral-800/80 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-amber-400"></div>
              <span className="text-neutral-200 font-medium">5 AI Tools for Instagram Creators</span>
            </div>
            <span className="text-[10px] text-neutral-400 bg-neutral-800 px-2 py-0.5 rounded">Reels</span>
          </div>
          <div className="p-2.5 rounded-lg bg-[#090A0F] border border-neutral-800/80 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
              <span className="text-neutral-200 font-medium">How to Fix Low Retention in Shorts</span>
            </div>
            <span className="text-[10px] text-neutral-400 bg-neutral-800 px-2 py-0.5 rounded">Shorts</span>
          </div>
        </div>
      </div>
    </div>
  );
};
