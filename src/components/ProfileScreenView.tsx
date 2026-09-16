import React, { useState, useEffect } from 'react';
import { User, Crown, Zap, Globe, Smartphone, Terminal, PlayCircle, Info, Key, Sparkles, Check, RefreshCw } from 'lucide-react';
import { Language, MonetizationPlan } from '../types';
import { translations } from '../locales';
import { AboutModal } from './AboutModal';

interface ProfileScreenViewProps {
  lang: Language;
  onToggleLanguage: () => void;
  plan: MonetizationPlan;
  remainingCredits: number;
  onUpgradeVip: () => void;
  onWatchAd: () => void;
  onOpenAndroidHub: () => void;
}

export const ProfileScreenView: React.FC<ProfileScreenViewProps> = ({
  lang,
  onToggleLanguage,
  plan,
  remainingCredits,
  onUpgradeVip,
  onWatchAd,
  onOpenAndroidHub
}) => {
  const t = translations[lang];
  const [adPlaying, setAdPlaying] = useState(false);
  const [showAboutModal, setShowAboutModal] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Gemini API Key state
  const [apiKeyInput, setApiKeyInput] = useState('');
  const [hasSavedKey, setHasSavedKey] = useState(false);
  const [testingConnection, setTestingConnection] = useState(false);
  const [testResult, setTestResult] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('creatorflow_gemini_key');
    if (saved) {
      setApiKeyInput(saved);
      setHasSavedKey(true);
    }
  }, []);

  const handleSaveApiKey = () => {
    if (apiKeyInput.trim()) {
      localStorage.setItem('creatorflow_gemini_key', apiKeyInput.trim());
      setHasSavedKey(true);
      showToast(lang === 'fa' ? 'کلید API اختصاصی ذخیره شد!' : 'Custom API Key saved successfully!');
    } else {
      localStorage.removeItem('creatorflow_gemini_key');
      setHasSavedKey(false);
      showToast(lang === 'fa' ? 'کلید پاک شد؛ موتور محلی فعال است.' : 'Key cleared; Local engine active.');
    }
  };

  const handleTestConnection = async () => {
    setTestingConnection(true);
    setTestResult(null);
    try {
      const res = await fetch('/api/health');
      if (res.ok) {
        const data = await res.json();
        setTestResult(
          lang === 'fa'
            ? `اتصال ابری فعال است (${data.publisher || 'سیدحمیدموسوی زاده'}) - هوش مصنوعی آماده پاسخگویی`
            : `Cloud Engine Active (${data.publisher}) - AI Ready`
        );
      } else {
        setTestResult(
          lang === 'fa'
            ? 'موتور هوشمند محلی داخلی (Standalone) کاملاً آماده و فعال است.'
            : 'Standalone Offline Engine active.'
        );
      }
    } catch {
      setTestResult(
        lang === 'fa'
          ? 'موتور هوشمند محلی داخلی (Standalone) فعال و بدون نیاز به اینترنت آماده است.'
          : 'Standalone Offline Engine ready.'
      );
    } finally {
      setTestingConnection(false);
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleSimulateRewardedAd = () => {
    setAdPlaying(true);
    setTimeout(() => {
      setAdPlaying(false);
      onWatchAd();
      showToast(lang === 'fa' ? '۳ اعتبار رایگان با موفقیت اضافه شد!' : '+3 Free credits added successfully!');
    }, 1200);
  };

  const handleUpgradeWithToast = () => {
    onUpgradeVip();
    showToast(lang === 'fa' ? 'طرح نامحدود VIP با موفقیت فعال شد!' : 'VIP Unlimited plan activated!');
  };

  return (
    <div className="p-4 space-y-4 pb-8">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="p-3 rounded-xl bg-emerald-950/90 border border-emerald-500/50 text-emerald-200 text-xs font-semibold flex items-center justify-between shadow-lg shadow-emerald-950/50 animate-fade-in">
          <span>{toastMessage}</span>
          <span className="text-[10px] bg-emerald-800/60 px-2 py-0.5 rounded text-emerald-100">OK</span>
        </div>
      )}

      {/* Header */}
      <div>
        <h1 className="text-lg font-bold text-white tracking-tight flex items-center gap-1.5">
          <User className="w-4 h-4 text-purple-400" />
          <span>{t.profile.title}</span>
        </h1>
        <p className="text-xs text-purple-400 font-medium">{t.publisher}</p>
      </div>

      {/* Monetization Tier Card */}
      <div
        className={`p-4 rounded-2xl border transition ${
          plan === 'VIP'
            ? 'bg-gradient-to-br from-amber-950/40 via-[#131622] to-[#090A0F] border-amber-500/40 shadow-lg shadow-amber-950/20'
            : 'bg-[#131622] border-purple-900/40'
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                plan === 'VIP' ? 'bg-amber-500/20 text-amber-400' : 'bg-purple-600/20 text-purple-400'
              }`}
            >
              {plan === 'VIP' ? <Crown className="w-5 h-5" /> : <Zap className="w-5 h-5" />}
            </div>
            <div>
              <span className="text-xs font-bold text-white block">
                {plan === 'VIP' ? t.profile.vipPlan : t.profile.freePlan}
              </span>
              <span className="text-[11px] text-neutral-400">
                {plan === 'VIP' ? t.home.vipUnlimited : `${remainingCredits} ${t.home.creditsLeft}`}
              </span>
            </div>
          </div>
          <span
            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
              plan === 'VIP'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                : 'bg-neutral-800 text-neutral-300'
            }`}
          >
            {plan}
          </span>
        </div>

        <p className="text-xs text-neutral-300 leading-relaxed mt-2.5">
          {plan === 'VIP' ? t.profile.vipDesc : t.profile.freeDesc}
        </p>

        {plan === 'FREE' && (
          <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-neutral-800">
            <button
              id="btn-profile-upgrade-vip"
              onClick={handleUpgradeWithToast}
              className="py-2 px-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black text-xs font-bold flex items-center justify-center gap-1.5 shadow-md shadow-amber-900/30 transition"
            >
              <Crown className="w-3.5 h-3.5 text-black" />
              <span>{t.profile.upgradeVip}</span>
            </button>
            <button
              id="btn-profile-watch-ad"
              onClick={handleSimulateRewardedAd}
              disabled={adPlaying}
              className="py-2 px-2.5 rounded-xl bg-[#090A0F] hover:bg-neutral-900 text-purple-300 border border-purple-700/40 text-xs font-semibold flex items-center justify-center gap-1.5 transition disabled:opacity-50"
            >
              <PlayCircle className="w-3.5 h-3.5 text-purple-400" />
              <span>{adPlaying ? (lang === 'fa' ? 'در حال پخش...' : 'Playing Ad...') : t.profile.watchAd}</span>
            </button>
          </div>
        )}
      </div>

      {/* Language Switcher Card */}
      <div className="p-3.5 rounded-2xl bg-[#131622] border border-neutral-800 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-neutral-800 flex items-center justify-center text-neutral-300">
            <Globe className="w-4 h-4" />
          </div>
          <div>
            <span className="text-xs font-bold text-white block">{t.profile.language}</span>
            <span className="text-[11px] text-neutral-400">
              {lang === 'fa' ? 'فارسی (Persian RTL)' : 'English (LTR)'}
            </span>
          </div>
        </div>
        <button
          onClick={onToggleLanguage}
          className="px-3 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-semibold border border-neutral-700 transition"
        >
          {lang === 'fa' ? 'تغییر به English' : 'Switch to فارسی'}
        </button>
      </div>

      {/* AI Engine & Gemini Configuration Card */}
      <div className="p-3.5 rounded-2xl bg-[#131622] border border-neutral-800 space-y-3 text-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-purple-600/20 flex items-center justify-center text-purple-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-white block">
                {lang === 'fa' ? 'تنظیمات هوش مصنوعی (Gemini AI)' : 'AI Engine & Gemini Settings'}
              </span>
              <span className="text-[11px] text-neutral-400">
                {hasSavedKey
                  ? (lang === 'fa' ? 'کلید API اختصاصی فعال است' : 'Custom Gemini API Key active')
                  : (lang === 'fa' ? 'موتور ابری و محلی یکپارچه فعال است' : 'Unified Cloud & Local Neural active')}
              </span>
            </div>
          </div>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-950/60 text-emerald-400 border border-emerald-500/40 font-mono">
            {lang === 'fa' ? 'آماده تولید' : 'Active'}
          </span>
        </div>

        <div className="space-y-2 pt-1 border-t border-neutral-800/80">
          <label className="text-[11px] text-neutral-400 block">
            {lang === 'fa'
              ? 'کلید اختصاصی Google Gemini (اختیاری جهت اتصال مستقیم از گوشی):'
              : 'Custom Google Gemini API Key (Optional for direct mobile device connection):'}
          </label>
          <div className="flex items-center gap-2">
            <input
              type="password"
              value={apiKeyInput}
              onChange={(e) => setApiKeyInput(e.target.value)}
              placeholder="AIzaSy..."
              className="flex-1 px-3 py-1.5 rounded-xl bg-[#090A0F] border border-neutral-700 text-white text-xs font-mono placeholder:text-neutral-600 focus:outline-none focus:border-purple-500"
            />
            <button
              onClick={handleSaveApiKey}
              className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs transition shrink-0"
            >
              {lang === 'fa' ? 'ذخیره' : 'Save'}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between pt-1">
          <button
            onClick={handleTestConnection}
            disabled={testingConnection}
            className="text-[11px] text-purple-400 hover:text-purple-300 flex items-center gap-1.5 transition disabled:opacity-50"
          >
            <RefreshCw className={`w-3 h-3 ${testingConnection ? 'animate-spin' : ''}`} />
            <span>{testingConnection ? (lang === 'fa' ? 'در حال بررسی...' : 'Testing...') : (lang === 'fa' ? 'تست وضعیت اتصال هوش مصنوعی' : 'Test AI Status')}</span>
          </button>
          {testResult && (
            <span className="text-[10px] text-emerald-400 font-sans">{testResult}</span>
          )}
        </div>
      </div>

      {/* Android Native Architecture & Export Hub Launcher */}
      <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-950/40 to-[#131622] border border-purple-500/40 space-y-2.5">
        <div className="flex items-center gap-2 text-purple-300">
          <Smartphone className="w-4 h-4 text-purple-400" />
          <span className="text-xs font-bold text-white">{t.profile.exportAndroid}</span>
        </div>
        <p className="text-xs text-neutral-300 leading-relaxed">
          {lang === 'fa'
            ? 'سورس کد کامل کاتلین و جت‌پک کامپوز، پایگاه داده Room و پایپ‌لاین بیلد ابری جهت خروجی مستقیم فایل نصبی APK و باندل انتشار AAB.'
            : 'Explore full Kotlin Jetpack Compose code, Room database, Retrofit networking, and GitHub Actions CI/CD to generate APK and AAB.'}
        </p>
        <button
          id="btn-open-android-hub"
          onClick={onOpenAndroidHub}
          className="w-full py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-md shadow-purple-900/30 transition"
        >
          <Terminal className="w-3.5 h-3.5" />
          <span>{lang === 'fa' ? 'مشاهده کدهای اندروید و راهنمای ساخت' : 'View Android Code & Build Hub'}</span>
        </button>
      </div>

      {/* Brand Identity & Icon Preview */}
      <div className="p-3.5 rounded-2xl bg-[#131622] border border-neutral-800 space-y-3 text-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-bold text-white block">
              {lang === 'fa' ? 'هویت بصری و آیکون رسمی' : 'Official Visual Identity'}
            </span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-900/60 text-purple-300 border border-purple-700/40">
              2026 AI
            </span>
          </div>
          <button
            onClick={() => setShowAboutModal(true)}
            className="text-[11px] text-purple-400 hover:text-purple-300 transition underline"
          >
            {lang === 'fa' ? 'مشاهده در ابعاد بزرگ' : 'View Full Assets'}
          </button>
        </div>

        <div className="flex items-center gap-3 bg-[#0A0C14] p-2.5 rounded-xl border border-neutral-800/80">
          <img
            src="/icon.jpg"
            alt="CreatorFlow AI Icon"
            className="w-14 h-14 rounded-2xl object-cover border-2 border-purple-500/40 shadow-lg shadow-purple-950/50 shrink-0"
          />
          <div className="space-y-1">
            <span className="font-bold text-white block text-xs">CreatorFlow AI (کریتورفلو AI)</span>
            <p className="text-[11px] text-neutral-400 leading-tight">
              {lang === 'fa'
                ? 'آیکون ۱۰۲۴x۱۰۲۴ با مونوگرام C/F، جریان خلاقیت و اسپارک هوشمند'
                : '1024x1024 master icon with dynamic flow ribbon & golden spark'}
            </p>
            <div className="flex items-center gap-1 pt-0.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#8B5CF6]" title="Electric AI Violet"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-[#2563EB]" title="Creator Flow Cobalt"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]" title="Radiant Gold"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-[#090A0F] border border-neutral-700" title="Obsidian Canvas"></span>
              <span className="text-[10px] text-neutral-500 ms-1 font-mono">Brand Palette</span>
            </div>
          </div>
        </div>
      </div>

      {/* Developer & About Information */}
      <div className="p-3.5 rounded-2xl bg-[#131622] border border-neutral-800 space-y-3 text-xs">
        <div className="flex items-center justify-between">
          <span className="font-bold text-neutral-300 block">{t.profile.aboutTitle}</span>
          <button
            onClick={() => setShowAboutModal(true)}
            className="px-2.5 py-1 rounded-lg bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/30 text-[11px] font-semibold flex items-center gap-1 transition"
          >
            <Info className="w-3 h-3" />
            <span>{lang === 'fa' ? 'اطلاعات کامل' : 'About Page'}</span>
          </button>
        </div>

        <div className="flex items-center justify-between text-neutral-400">
          <span>{t.profile.developer}</span>
          <span className="text-amber-400 font-bold font-sans">{t.profile.developerName}</span>
        </div>
        <div className="flex items-center justify-between text-neutral-400">
          <span>{lang === 'fa' ? 'دسته‌بندی' : 'Category'}</span>
          <span className="text-purple-300 font-medium text-[11px]">AI Productivity / Creator Tools</span>
        </div>
        <div className="flex items-center justify-between text-neutral-400">
          <span>{t.profile.package}</span>
          <span className="text-purple-400 font-mono text-[11px]">com.creatorflow.ai</span>
        </div>
        <div className="flex items-center justify-between text-neutral-400">
          <span>Target Platform</span>
          <span className="text-white font-medium">Android API 26 – 35</span>
        </div>
        <div className="flex items-center justify-between text-neutral-400">
          <span>Version</span>
          <span className="text-white font-medium">1.0.0 (Build 1)</span>
        </div>

        <p className="text-[11px] text-neutral-400 leading-relaxed border-t border-neutral-800/80 pt-2.5">
          {t.profile.appDescription}
        </p>
      </div>

      {/* About Modal */}
      {showAboutModal && (
        <AboutModal lang={lang} onClose={() => setShowAboutModal(false)} />
      )}
    </div>
  );
};
