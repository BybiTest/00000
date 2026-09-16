import React, { useState } from 'react';
import { X, Sparkles, Copy, Check, Palette, Layers } from 'lucide-react';
import { Language } from '../types';
import { translations } from '../locales';

interface AboutModalProps {
  lang: Language;
  onClose: () => void;
}

export const AboutModal: React.FC<AboutModalProps> = ({ lang, onClose }) => {
  const t = translations[lang];
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'info' | 'visuals' | 'colors'>('info');

  const copyDeveloperName = () => {
    navigator.clipboard.writeText(t.profile.developerName);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3">
      <div className="bg-[#0e1017] border border-neutral-800 rounded-2xl w-full max-w-lg max-h-[92vh] flex flex-col shadow-2xl overflow-hidden text-neutral-200">
        
        {/* Header */}
        <div className="p-4 border-b border-neutral-800 flex items-center justify-between bg-[#131622]">
          <div className="flex items-center gap-3">
            <img
              src="/icon.jpg"
              alt="CreatorFlow AI Icon"
              className="w-10 h-10 rounded-xl object-cover border border-purple-500/40 shadow-md shadow-purple-950/40"
            />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold text-white">CreatorFlow AI</h2>
                <span className="text-[11px] text-purple-400 font-medium">{t.persianName}</span>
              </div>
              <p className="text-[11px] text-neutral-400">
                {lang === 'fa' ? 'سازنده و توسعه‌دهنده: ' + t.publisher : 'Developer: ' + t.publisher}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-neutral-800/80 hover:bg-neutral-700 flex items-center justify-center text-neutral-300 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-neutral-800/80 bg-[#0a0c12] text-xs px-2 pt-2 gap-2">
          <button
            onClick={() => setActiveTab('info')}
            className={`pb-2 px-3 font-semibold border-b-2 transition ${
              activeTab === 'info'
                ? 'border-purple-500 text-purple-300'
                : 'border-transparent text-neutral-400 hover:text-neutral-200'
            }`}
          >
            {lang === 'fa' ? 'درباره و توسعه‌دهنده' : 'About & Developer'}
          </button>
          <button
            onClick={() => setActiveTab('visuals')}
            className={`pb-2 px-3 font-semibold border-b-2 transition flex items-center gap-1.5 ${
              activeTab === 'visuals'
                ? 'border-purple-500 text-purple-300'
                : 'border-transparent text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <Sparkles className="w-3 h-3 text-purple-400" />
            <span>{lang === 'fa' ? 'هویت بصری و آیکون' : 'Visual Identity & Icon'}</span>
          </button>
          <button
            onClick={() => setActiveTab('colors')}
            className={`pb-2 px-3 font-semibold border-b-2 transition flex items-center gap-1.5 ${
              activeTab === 'colors'
                ? 'border-purple-500 text-purple-300'
                : 'border-transparent text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <Palette className="w-3 h-3 text-amber-400" />
            <span>{lang === 'fa' ? 'پالت رنگ برند' : 'Brand Colors'}</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
          {activeTab === 'info' && (
            <>
              {/* Product Identity Summary */}
              <div className="p-4 rounded-xl bg-gradient-to-br from-purple-950/30 to-[#131622] border border-purple-800/30 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-neutral-400 font-medium">
                    {lang === 'fa' ? 'نام اپلیکیشن' : 'Application Name'}
                  </span>
                  <div className="text-right">
                    <span className="text-white font-bold block text-sm">CreatorFlow AI</span>
                    <span className="text-purple-300 text-[11px]">{t.persianName}</span>
                  </div>
                </div>
                <div className="border-t border-neutral-800 pt-2 flex items-center justify-between">
                  <span className="text-neutral-400 font-medium">
                    {lang === 'fa' ? 'توسعه‌دهنده رسمی' : 'Official Developer'}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-amber-400 font-bold font-sans text-xs">{t.profile.developerName}</span>
                    <button
                      onClick={copyDeveloperName}
                      title="Copy Developer Name"
                      className="p-1 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-300 transition"
                    >
                      {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    </button>
                  </div>
                </div>
                <div className="border-t border-neutral-800 pt-2 flex items-center justify-between">
                  <span className="text-neutral-400 font-medium">
                    {lang === 'fa' ? 'دسته‌بندی' : 'Category'}
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-purple-900/40 text-purple-300 border border-purple-700/40 font-medium">
                    AI Productivity / Creator Tools
                  </span>
                </div>
              </div>

              {/* Official Description */}
              <div className="p-3.5 rounded-xl bg-[#131622] border border-neutral-800 space-y-1.5">
                <span className="text-[11px] font-bold text-neutral-400 block uppercase tracking-wider">
                  {lang === 'fa' ? 'توضیحات رسمی' : 'Description'}
                </span>
                <p className="text-neutral-200 leading-relaxed text-xs">
                  {t.profile.appDescription}
                </p>
              </div>

              {/* Target Creators Ecosystem */}
              <div className="space-y-2">
                <span className="text-[11px] font-bold text-neutral-400 block uppercase tracking-wider">
                  {lang === 'fa' ? 'اکوسیستم مخاطبان هدف' : 'Target Creator Ecosystem'}
                </span>
                <div className="grid grid-cols-2 gap-2 text-neutral-300">
                  <div className="p-2.5 rounded-lg bg-neutral-900 border border-neutral-800 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-red-500"></span>
                    <span>YouTube &amp; Shorts Creators</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-neutral-900 border border-neutral-800 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-pink-500"></span>
                    <span>Instagram Reels Creators</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-neutral-900 border border-neutral-800 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
                    <span>TikTok Creators</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-neutral-900 border border-neutral-800 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-purple-400"></span>
                    <span>Social Media Marketers</span>
                  </div>
                </div>
              </div>

              {/* Technical Specifications */}
              <div className="p-3 rounded-xl bg-neutral-900/60 border border-neutral-800 space-y-1.5 text-[11px]">
                <div className="flex justify-between py-1 border-b border-neutral-800">
                  <span className="text-neutral-400">Android Package</span>
                  <span className="font-mono text-purple-300">com.creatorflow.ai</span>
                </div>
                <div className="flex justify-between py-1 border-b border-neutral-800">
                  <span className="text-neutral-400">Architecture</span>
                  <span className="text-neutral-200">Jetpack Compose + MVVM + Room + Retrofit</span>
                </div>
                <div className="flex justify-between py-1 border-b border-neutral-800">
                  <span className="text-neutral-400">Minimum SDK / Target SDK</span>
                  <span className="text-neutral-200">API 26 (Android 8.0) / API 35 (Android 15)</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-neutral-400">Publisher</span>
                  <span className="text-amber-400 font-bold">{t.publisher}</span>
                </div>
              </div>
            </>
          )}

          {activeTab === 'visuals' && (
            <div className="space-y-4">
              {/* Master App Icon */}
              <div className="p-4 rounded-xl bg-[#131622] border border-neutral-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-bold text-white block text-xs">
                      {lang === 'fa' ? 'آیکون اصلی لانچر (1024x1024)' : 'Master Launcher Icon (1024x1024)'}
                    </span>
                    <span className="text-[11px] text-neutral-400">
                      {lang === 'fa' ? 'طراحی مدرن ۲۰۲۶ هوش مصنوعی با المان جریان خلاقیت و اسپارک هوشمند' : 'Modern 2026 AI design with dynamic flow curve and creative spark'}
                    </span>
                  </div>
                  <span className="px-2 py-0.5 text-[10px] bg-purple-900/50 text-purple-300 rounded border border-purple-700/40">
                    1024x1024 PX
                  </span>
                </div>

                <div className="flex items-center gap-4">
                  <img
                    src="/icon.jpg"
                    alt="CreatorFlow AI Master Icon"
                    className="w-20 h-20 rounded-2xl object-cover border-2 border-purple-500/50 shadow-xl shadow-purple-950/60 shrink-0"
                  />
                  <div className="space-y-1 text-[11px] text-neutral-300">
                    <p className="flex items-center gap-1.5 text-white font-semibold">
                      <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                      <span>{lang === 'fa' ? 'مفهوم طراحی:' : 'Visual Concept:'}</span>
                    </p>
                    <p className="text-neutral-400 leading-relaxed">
                      {lang === 'fa'
                        ? 'نمایانگر جریان روان تولید محتوا (Flow) به همراه جرقه ایده‌پردازی دیجیتال (Digital Spark) و مونوگرام C/F با ترکیب بنفش نئونی و آبی کرییتیو.'
                        : 'Dynamic creator flow curve fused with an inspiration spark and abstract C/F monogram in electric violet and cobalt.'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Android Adaptive Icon Concept */}
              <div className="p-3.5 rounded-xl bg-[#131622] border border-neutral-800 space-y-2">
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-purple-400" />
                  <span className="font-bold text-white text-xs">
                    {lang === 'fa' ? 'لایه‌های آیکون انطباقی اندروید (Adaptive Icon)' : 'Android Adaptive Icon Layers'}
                  </span>
                </div>
                <p className="text-[11px] text-neutral-400 leading-relaxed">
                  {lang === 'fa'
                    ? 'پیکربندی با وکتور لایه پیش‌زمینه (Foreground Vector) و پس‌زمینه دارک (Obsidian Background) منطبق بر استانداردهای Squircle و دایره‌ای سیستم‌عامل اندروید.'
                    : 'Configured with 432x432 foreground vector layer and obsidian background layer for Samsung OneUI, Pixel, and MIUI adaptive masks.'}
                </p>
                <div className="flex items-center gap-3 pt-1">
                  <div className="w-12 h-12 rounded-full overflow-hidden border border-purple-500/40">
                    <img src="/icon.jpg" alt="Round mask" className="w-full h-full object-cover" />
                  </div>
                  <div className="w-12 h-12 rounded-xl overflow-hidden border border-purple-500/40">
                    <img src="/icon.jpg" alt="Squircle mask" className="w-full h-full object-cover" />
                  </div>
                  <div className="w-12 h-12 rounded-lg overflow-hidden border border-purple-500/40">
                    <img src="/icon.jpg" alt="Square mask" className="w-full h-full object-cover" />
                  </div>
                  <span className="text-[11px] text-neutral-400">
                    {lang === 'fa' ? 'ماسک‌های دایره، اسکویرکل و گوشه‌گرد' : 'Adaptive round, squircle & teardrop masks'}
                  </span>
                </div>
              </div>

              {/* Splash Screen & Store Visual */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-[#131622] border border-neutral-800 space-y-2">
                  <span className="font-bold text-white text-xs block">
                    {lang === 'fa' ? 'اسپلش اسکرین (Splash)' : 'Splash Screen (9:16)'}
                  </span>
                  <div className="aspect-[9/16] rounded-lg overflow-hidden border border-neutral-800 relative group">
                    <img src="/splash.jpg" alt="Splash Screen" className="w-full h-full object-cover" />
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-[#131622] border border-neutral-800 space-y-2">
                  <span className="font-bold text-white text-xs block">
                    {lang === 'fa' ? 'بنر گوگل پلی (16:9)' : 'Store Feature Graphic'}
                  </span>
                  <div className="aspect-[16/9] rounded-lg overflow-hidden border border-neutral-800 mt-4">
                    <img src="/feature-graphic.jpg" alt="Store Graphic" className="w-full h-full object-cover" />
                  </div>
                  <span className="text-[10px] text-neutral-400 block">
                    Google Play 1024x500 Feature Banner
                  </span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'colors' && (
            <div className="space-y-3">
              <span className="text-neutral-400 text-xs block">
                {lang === 'fa'
                  ? 'سیستم رنگ‌بندی رسمی برند CreatorFlow AI طراحی شده برای کنتراست بالا و زیبایی در رابط کاربری تیره:'
                  : 'CreatorFlow AI official brand color system designed for high-contrast creator interfaces and Material You 3:'}
              </span>
              <div className="space-y-2">
                <div className="p-3 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-[#090A0F] border border-neutral-700"></div>
                    <div>
                      <span className="font-bold text-white block">Obsidian Dark Canvas</span>
                      <span className="text-[11px] text-neutral-400">Primary App &amp; System Background</span>
                    </div>
                  </div>
                  <span className="font-mono text-purple-300 text-xs">#090A0F</span>
                </div>

                <div className="p-3 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-[#8B5CF6] shadow-sm shadow-purple-500/50"></div>
                    <div>
                      <span className="font-bold text-white block">Electric AI Violet</span>
                      <span className="text-[11px] text-neutral-400">Creative Intelligence &amp; Primary Accent</span>
                    </div>
                  </div>
                  <span className="font-mono text-purple-300 text-xs">#8B5CF6</span>
                </div>

                <div className="p-3 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-[#2563EB] shadow-sm shadow-blue-500/50"></div>
                    <div>
                      <span className="font-bold text-white block">Creator Flow Cobalt</span>
                      <span className="text-[11px] text-neutral-400">Video Production &amp; Execution</span>
                    </div>
                  </div>
                  <span className="font-mono text-purple-300 text-xs">#2563EB</span>
                </div>

                <div className="p-3 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-[#F59E0B] shadow-sm shadow-amber-500/50"></div>
                    <div>
                      <span className="font-bold text-white block">Radiant Gold</span>
                      <span className="text-[11px] text-neutral-400">VIP Unlimited Membership &amp; Quality</span>
                    </div>
                  </div>
                  <span className="font-mono text-purple-300 text-xs">#F59E0B</span>
                </div>

                <div className="p-3 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-[#131622] border border-neutral-700"></div>
                    <div>
                      <span className="font-bold text-white block">Glassmorphism Card Surface</span>
                      <span className="text-[11px] text-neutral-400">Elevated Containers &amp; Cards</span>
                    </div>
                  </div>
                  <span className="font-mono text-purple-300 text-xs">#131622</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3.5 border-t border-neutral-800 bg-[#131622] flex items-center justify-between text-xs">
          <span className="text-neutral-400">
            {lang === 'fa' ? 'توسعه‌دهنده: ' + t.publisher : 'Publisher: ' + t.publisher}
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold transition"
          >
            {lang === 'fa' ? 'بستن' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
