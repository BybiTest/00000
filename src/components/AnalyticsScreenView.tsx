import React, { useState } from 'react';
import { BarChart3, Sparkles, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import { Language, AnalyticsData, AnalyticsAudit } from '../types';
import { translations } from '../locales';
import { generateAnalyticsAuditInsight } from '../services/creatorAiEngine';

interface AnalyticsScreenViewProps {
  lang: Language;
}

export const AnalyticsScreenView: React.FC<AnalyticsScreenViewProps> = ({ lang }) => {
  const t = translations[lang];
  const [metrics, setMetrics] = useState<AnalyticsData>({
    views: 142000,
    likes: 9800,
    followers: 24500,
    comments: 420,
    saves: 1850
  });

  const [loading, setLoading] = useState(false);
  const [audit, setAudit] = useState<AnalyticsAudit | null>({
    engagementRatePercentage: 8.5,
    performanceVerdict: lang === 'fa' ? 'تعامل بسیار مطلوب - فاز گسترش و اسکیل' : 'High Engagement - Ready to Scale',
    coreStrengths: [
      lang === 'fa' ? 'نسبت بالای ذخیره (Saves) به بازدید نشانه ارزش بالای آموزشی است.' : 'High save-to-view ratio indicates strong educational value.',
      lang === 'fa' ? 'تبدیل عالی بازدید به لایک در ۵ ثانیه ابتدایی.' : 'Strong view-to-like conversion in the initial 5 seconds.'
    ],
    criticalBottlenecks: [
      lang === 'fa' ? 'افت مخاطب در ثانیه ۳۵ به دلیل طولانی شدن دعوت به اقدام CTA.' : 'Retention dropoff around 0:35 due to prolonged verbal CTA.',
      lang === 'fa' ? 'تعداد کامنت‌ها نسبت به سیوها کمتر است؛ پایان ویدیو را با سوال باز ببندید.' : 'Comment engagement lags behind saves; end with open questions.'
    ],
    top3ActionableSteps: [
      lang === 'fa' ? 'قلاب‌های ویدیویی را به صورت متنی-بصری در ۲ ثانیه اول شروع کنید.' : 'Switch from verbal hooks to animated text-first hooks.',
      lang === 'fa' ? 'مجموعه ۳ قسمتی بسازید تا نرخ دنبال کردن افزایش یابد.' : 'Publish a 3-part multi-video series to drive follow-through.',
      lang === 'fa' ? 'درخواست کامنت با کلیدواژه مشخص قرار دهید.' : 'Implement keyword-triggered comment calls to action.'
    ]
  });

  const calculatedEngagement = (
    ((metrics.likes + metrics.comments + metrics.saves) / (metrics.views || 1)) * 100
  ).toFixed(2);

  const handleRunAudit = async () => {
    setLoading(true);
    try {
      const auditResult = await generateAnalyticsAuditInsight(metrics, 'All Platforms', lang);
      setAudit(auditResult);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 space-y-4 pb-8">
      <div>
        <h1 className="text-lg font-bold text-white tracking-tight flex items-center gap-1.5">
          <BarChart3 className="w-4 h-4 text-purple-400" />
          <span>{t.analytics.title}</span>
        </h1>
        <p className="text-xs text-neutral-400">{t.analytics.subtitle}</p>
      </div>

      {/* Input Metrics Grid */}
      <div className="p-3.5 rounded-2xl bg-[#131622] border border-neutral-800 space-y-3">
        <div className="flex items-center justify-between text-xs font-bold text-neutral-300">
          <span>{lang === 'fa' ? 'آمار ورودی پیج / کانال' : 'Input Creator Metrics'}</span>
          <span className="text-purple-400 font-mono text-[10px]">Room Local State</span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-[11px] text-neutral-400 block mb-1">{t.analytics.views}</label>
            <input
              type="number"
              value={metrics.views}
              onChange={(e) => setMetrics({ ...metrics, views: Number(e.target.value) })}
              className="w-full px-2.5 py-1.5 rounded-xl bg-[#090A0F] border border-neutral-700 text-white text-xs"
            />
          </div>
          <div>
            <label className="text-[11px] text-neutral-400 block mb-1">{t.analytics.followers}</label>
            <input
              type="number"
              value={metrics.followers}
              onChange={(e) => setMetrics({ ...metrics, followers: Number(e.target.value) })}
              className="w-full px-2.5 py-1.5 rounded-xl bg-[#090A0F] border border-neutral-700 text-white text-xs"
            />
          </div>
          <div>
            <label className="text-[11px] text-neutral-400 block mb-1">{t.analytics.likes}</label>
            <input
              type="number"
              value={metrics.likes}
              onChange={(e) => setMetrics({ ...metrics, likes: Number(e.target.value) })}
              className="w-full px-2.5 py-1.5 rounded-xl bg-[#090A0F] border border-neutral-700 text-white text-xs"
            />
          </div>
          <div>
            <label className="text-[11px] text-neutral-400 block mb-1">{t.analytics.saves}</label>
            <input
              type="number"
              value={metrics.saves}
              onChange={(e) => setMetrics({ ...metrics, saves: Number(e.target.value) })}
              className="w-full px-2.5 py-1.5 rounded-xl bg-[#090A0F] border border-neutral-700 text-white text-xs"
            />
          </div>
        </div>

        {/* Calculated Engagement Meter */}
        <div className="p-2.5 rounded-xl bg-[#090A0F] border border-neutral-800 flex items-center justify-between">
          <div>
            <span className="text-[11px] text-neutral-400 block">{t.analytics.calcRate}</span>
            <span className="text-sm font-bold text-amber-400">{calculatedEngagement}%</span>
          </div>
          <button
            id="btn-run-analytics-audit"
            onClick={handleRunAudit}
            disabled={loading}
            className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-purple-900/30 transition disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            )}
            <span>{t.analytics.runAuditBtn}</span>
          </button>
        </div>
      </div>

      {/* AI Diagnostic Output */}
      {audit && (
        <div className="p-3.5 rounded-2xl bg-[#131622] border border-purple-500/30 space-y-3">
          <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
            <div className="flex items-center gap-1.5 text-purple-300 text-xs font-bold">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span>{t.analytics.auditTitle}</span>
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-950/80 text-purple-300 border border-purple-800/40">
              Gemini 3.8
            </span>
          </div>

          <div>
            <span className="text-[11px] text-neutral-400 uppercase font-semibold block">{t.analytics.verdict}</span>
            <span className="text-xs font-bold text-amber-300">{audit.performanceVerdict}</span>
          </div>

          <div className="space-y-1.5">
            <span className="text-[11px] text-emerald-400 font-semibold block">{t.analytics.strengths}</span>
            {audit.coreStrengths.map((str, idx) => (
              <div key={idx} className="flex items-start gap-1.5 text-xs text-neutral-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span>{str}</span>
              </div>
            ))}
          </div>

          <div className="space-y-1.5">
            <span className="text-[11px] text-rose-400 font-semibold block">{t.analytics.bottlenecks}</span>
            {audit.criticalBottlenecks.map((bot, idx) => (
              <div key={idx} className="flex items-start gap-1.5 text-xs text-neutral-300">
                <AlertCircle className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
                <span>{bot}</span>
              </div>
            ))}
          </div>

          <div className="p-2.5 rounded-xl bg-[#090A0F] border border-neutral-800 space-y-1.5">
            <span className="text-[11px] text-amber-400 font-bold block">{t.analytics.actionSteps}</span>
            {audit.top3ActionableSteps.map((step, idx) => (
              <div key={idx} className="flex items-start gap-1.5 text-xs text-neutral-200">
                <span className="w-4 h-4 rounded-full bg-purple-900/60 text-purple-300 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <span>{step}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
