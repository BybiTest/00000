import React, { useState } from 'react';
import { Sparkles, Lightbulb, Zap, FileText, MessageSquare, Image, Copy, Check, CalendarPlus, Loader2 } from 'lucide-react';
import { Language, StudioSubTool, ContentIdea, HookItem, ScriptData, CaptionData, ThumbnailData } from '../types';
import { translations } from '../locales';

interface StudioScreenViewProps {
  lang: Language;
  initialTool?: StudioSubTool;
  onSaveToCalendar: (title: string, platform: any) => void;
  onOpenChat: () => void;
  onConsumeCredit: () => boolean;
}

export const StudioScreenView: React.FC<StudioScreenViewProps> = ({
  lang,
  initialTool = 'ideas',
  onSaveToCalendar,
  onOpenChat,
  onConsumeCredit
}) => {
  const t = translations[lang];
  const [activeTool, setActiveTool] = useState<StudioSubTool>(initialTool);
  const [topic, setTopic] = useState('');
  const [niche, setNiche] = useState('Tech & AI');
  const [platform, setPlatform] = useState('Instagram Reels');
  const [audience, setAudience] = useState('Aspiring Creators');

  // Loading & Outputs
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<string | null>(null);

  const [ideas, setIdeas] = useState<ContentIdea[]>([]);
  const [hooks, setHooks] = useState<HookItem[]>([]);
  const [script, setScript] = useState<ScriptData | null>(null);
  const [captions, setCaptions] = useState<CaptionData[]>([]);
  const [thumbnails, setThumbnails] = useState<ThumbnailData[]>([]);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(id);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleGenerate = async () => {
    if (!topic.trim()) {
      setError(lang === 'fa' ? 'لطفاً موضوع محتوا را وارد کنید.' : 'Please enter a topic to generate.');
      return;
    }

    if (!onConsumeCredit()) {
      setError(lang === 'fa' ? 'اعتبار شما تمام شده است! تبلیغ تماشا کنید یا به VIP ارتقا دهید.' : 'No credits left! Watch a rewarded ad or upgrade to VIP.');
      return;
    }

    setError(null);
    setLoading(true);

    try {
      if (activeTool === 'ideas') {
        const res = await fetch('/api/ai/ideas', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ topic, niche, platform, audience, language: lang })
        });
        const data = await res.json();
        if (data.ideas) setIdeas(data.ideas);
        else throw new Error(data.error || 'Failed to fetch ideas');
      } else if (activeTool === 'hooks') {
        const res = await fetch('/api/ai/hooks', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ topic, platform, language: lang })
        });
        const data = await res.json();
        if (data.hooks) setHooks(data.hooks);
        else throw new Error(data.error || 'Failed to fetch hooks');
      } else if (activeTool === 'scripts') {
        const res = await fetch('/api/ai/scripts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ topic, platform, targetLength: '45s', tone: 'High Energy', language: lang })
        });
        const data = await res.json();
        if (data.script) setScript(data.script);
        else throw new Error(data.error || 'Failed to fetch script');
      } else if (activeTool === 'captions') {
        const res = await fetch('/api/ai/captions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ videoTopic: topic, platform, ctaGoal: 'Saves & Shares', language: lang })
        });
        const data = await res.json();
        if (data.captions) setCaptions(data.captions);
        else throw new Error(data.error || 'Failed to fetch captions');
      } else if (activeTool === 'thumbnails') {
        const res = await fetch('/api/ai/thumbnails', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title: topic, niche, language: lang })
        });
        const data = await res.json();
        if (data.concepts) setThumbnails(data.concepts);
        else throw new Error(data.error || 'Failed to fetch thumbnails');
      }
    } catch (err: any) {
      console.error(err);
      setError(err?.message || 'Gemini API call encountered an error');
    } finally {
      setLoading(false);
    }
  };

  const toolTabs: { id: StudioSubTool; label: string; icon: React.ReactNode }[] = [
    { id: 'ideas', label: t.studio.tools.ideas, icon: <Lightbulb className="w-3.5 h-3.5" /> },
    { id: 'hooks', label: t.studio.tools.hooks, icon: <Zap className="w-3.5 h-3.5" /> },
    { id: 'scripts', label: t.studio.tools.scripts, icon: <FileText className="w-3.5 h-3.5" /> },
    { id: 'captions', label: t.studio.tools.captions, icon: <MessageSquare className="w-3.5 h-3.5" /> },
    { id: 'thumbnails', label: t.studio.tools.thumbnails, icon: <Image className="w-3.5 h-3.5" /> }
  ];

  return (
    <div className="p-4 space-y-4 pb-8">
      {/* Title */}
      <div>
        <h1 className="text-lg font-bold text-white tracking-tight flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-purple-400" />
          <span>{t.studio.title}</span>
        </h1>
        <p className="text-xs text-neutral-400">{t.studio.subtitle}</p>
      </div>

      {/* Tool Selector Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {toolTabs.map((tool) => (
          <button
            key={tool.id}
            id={`tab-studio-${tool.id}`}
            onClick={() => {
              setActiveTool(tool.id);
              setError(null);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 whitespace-nowrap transition ${
              activeTool === tool.id
                ? 'bg-purple-600 text-white shadow-md shadow-purple-900/40'
                : 'bg-[#131622] text-neutral-400 hover:text-neutral-200 border border-neutral-800'
            }`}
          >
            {tool.icon}
            <span>{tool.label}</span>
          </button>
        ))}

        {/* Shortcut to Chat Strategist */}
        <button
          id="btn-open-chat-from-studio"
          onClick={onOpenChat}
          className="px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 whitespace-nowrap bg-emerald-950/40 text-emerald-300 border border-emerald-800/40 hover:bg-emerald-900/40 transition"
        >
          <MessageSquare className="w-3.5 h-3.5" />
          <span>{t.studio.tools.chat}</span>
        </button>
      </div>

      {/* Input Form Card */}
      <div className="p-3.5 rounded-2xl bg-[#131622] border border-neutral-800 space-y-3">
        <div>
          <label className="block text-xs font-semibold text-neutral-300 mb-1">
            {t.studio.topicLabel}
          </label>
          <input
            id="input-studio-topic"
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder={t.studio.topicPlaceholder}
            className="w-full px-3 py-2 rounded-xl bg-[#090A0F] border border-neutral-700/80 text-white text-xs placeholder:text-neutral-500 focus:outline-none focus:border-purple-500 transition"
          />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-[11px] font-medium text-neutral-400 mb-1">
              {t.studio.platformLabel}
            </label>
            <select
              value={platform}
              onChange={(e) => setPlatform(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-xl bg-[#090A0F] border border-neutral-700/80 text-white text-xs focus:outline-none focus:border-purple-500"
            >
              <option value="Instagram Reels">Instagram Reels</option>
              <option value="YouTube Shorts">YouTube Shorts</option>
              <option value="TikTok">TikTok</option>
              <option value="YouTube Long-Form">YouTube Long-Form</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-medium text-neutral-400 mb-1">
              {t.studio.audienceLabel}
            </label>
            <input
              type="text"
              value={audience}
              onChange={(e) => setAudience(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-xl bg-[#090A0F] border border-neutral-700/80 text-white text-xs focus:outline-none focus:border-purple-500"
            />
          </div>
        </div>

        {error && (
          <div className="p-2 rounded-lg bg-red-950/50 border border-red-800/60 text-red-300 text-xs">
            {error}
          </div>
        )}

        <button
          id="btn-generate-ai"
          onClick={handleGenerate}
          disabled={loading}
          className="w-full py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-purple-900/30 transition disabled:opacity-50"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-white" />
              <span>{t.studio.generating}</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>{t.studio.generateBtn}</span>
            </>
          )}
        </button>
      </div>

      {/* Results Rendering Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold text-neutral-300 uppercase tracking-wider">
            {t.studio.resultsTitle}
          </h2>
        </div>

        {/* 1. Ideas Output */}
        {activeTool === 'ideas' && (
          <div className="space-y-2.5">
            {ideas.length === 0 && !loading && (
              <div className="p-4 rounded-xl bg-[#131622]/60 border border-neutral-800 text-center text-xs text-neutral-400">
                {lang === 'fa' ? 'موضوع مورد نظر خود را وارد کنید و دکمه تولید را بزنید.' : 'Enter your topic and generate viral content concepts.'}
              </div>
            )}
            {ideas.map((idea, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl bg-[#131622] border border-purple-900/30 hover:border-purple-600/50 transition space-y-2"
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="text-xs font-bold text-white leading-snug">
                    {idea.title}
                  </span>
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => handleCopy(`${idea.title}\n${idea.hookSnippet}`, `idea-${idx}`)}
                      className="p-1 rounded bg-neutral-800 text-neutral-300 hover:text-white"
                      title="Copy"
                    >
                      {copiedIndex === `idea-${idx}` ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                    <button
                      onClick={() => onSaveToCalendar(idea.title, platform)}
                      className="p-1 rounded bg-purple-950/60 text-purple-300 hover:text-white border border-purple-800/40"
                      title="Add to Calendar"
                    >
                      <CalendarPlus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="p-2 rounded-lg bg-[#090A0F] text-xs text-purple-200 border border-purple-950">
                  <span className="text-amber-400 font-semibold">{lang === 'fa' ? 'قلاب شروع: ' : 'Hook: '}</span>
                  "{idea.hookSnippet}"
                </div>

                <div className="flex items-center justify-between text-[11px] text-neutral-400 pt-1">
                  <span>{lang === 'fa' ? 'زاویه: ' : 'Angle: '}{idea.angle}</span>
                  <span className="text-emerald-400 font-medium">{idea.estimatedRetention}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 2. Hooks Output */}
        {activeTool === 'hooks' && (
          <div className="space-y-2.5">
            {hooks.length === 0 && !loading && (
              <div className="p-4 rounded-xl bg-[#131622]/60 border border-neutral-800 text-center text-xs text-neutral-400">
                {lang === 'fa' ? 'تولید ۵ سبک قلاب روانشناسی برای جذب کاربر در ۳ ثانیه اول.' : 'Generate 5 distinct psychological 3-second hooks.'}
              </div>
            )}
            {hooks.map((hook, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl bg-[#131622] border border-amber-900/30 hover:border-amber-600/50 transition space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-amber-500/10 text-amber-400 border border-amber-500/20">
                    {hook.type}
                  </span>
                  <button
                    onClick={() => handleCopy(hook.hookText, `hook-${idx}`)}
                    className="p-1 rounded bg-neutral-800 text-neutral-300 hover:text-white"
                  >
                    {copiedIndex === `hook-${idx}` ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>

                <p className="text-xs font-semibold text-white leading-snug">
                  "{hook.hookText}"
                </p>

                <div className="text-[11px] text-neutral-400 space-y-0.5 pt-1 border-t border-neutral-800">
                  <div>
                    <span className="text-neutral-500">{t.hooks.visualCue}: </span>
                    <span className="text-neutral-300">{hook.visualAction}</span>
                  </div>
                  <div>
                    <span className="text-neutral-500">{t.hooks.psychology}: </span>
                    <span className="text-purple-300">{hook.psychologicalTrigger}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 3. Scripts Output */}
        {activeTool === 'scripts' && script && (
          <div className="p-3.5 rounded-xl bg-[#131622] border border-blue-900/40 space-y-3">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
              <div>
                <span className="text-xs font-bold text-white">{script.title}</span>
                <span className="text-[10px] text-neutral-400 block">~{script.estimatedWordCount} words</span>
              </div>
              <button
                onClick={() => handleCopy(
                  `TITLE: ${script.title}\nHOOK: ${script.hook}\nINTRO: ${script.intro}\nMAIN: ${script.mainContent.join('\n')}\nTRIGGER: ${script.emotionalTrigger}\nCTA: ${script.callToAction}`,
                  'full-script'
                )}
                className="px-2 py-1 rounded bg-neutral-800 text-neutral-200 text-xs flex items-center gap-1"
              >
                {copiedIndex === 'full-script' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{t.studio.copyText}</span>
              </button>
            </div>

            {/* Script Breakdown */}
            <div className="space-y-2 text-xs">
              <div className="p-2 rounded-lg bg-[#090A0F] border border-amber-500/20">
                <span className="text-[10px] text-amber-400 font-bold block uppercase">{t.scripts.hookSec}</span>
                <p className="text-white font-medium mt-0.5">"{script.hook}"</p>
              </div>

              <div className="p-2 rounded-lg bg-[#090A0F] border border-neutral-800">
                <span className="text-[10px] text-purple-400 font-bold block uppercase">{t.scripts.introSec}</span>
                <p className="text-neutral-200 mt-0.5">{script.intro}</p>
              </div>

              <div className="p-2 rounded-lg bg-[#090A0F] border border-neutral-800">
                <span className="text-[10px] text-blue-400 font-bold block uppercase">{t.scripts.mainSec}</span>
                <ul className="list-disc list-inside space-y-1 mt-1 text-neutral-300">
                  {script.mainContent.map((pt, i) => (
                    <li key={i}>{pt}</li>
                  ))}
                </ul>
              </div>

              <div className="p-2 rounded-lg bg-[#090A0F] border border-neutral-800">
                <span className="text-[10px] text-pink-400 font-bold block uppercase">{t.scripts.triggerSec}</span>
                <p className="text-neutral-200 mt-0.5">{script.emotionalTrigger}</p>
              </div>

              <div className="p-2 rounded-lg bg-[#090A0F] border border-emerald-500/20">
                <span className="text-[10px] text-emerald-400 font-bold block uppercase">{t.scripts.ctaSec}</span>
                <p className="text-emerald-200 font-medium mt-0.5">"{script.callToAction}"</p>
              </div>
            </div>
          </div>
        )}

        {/* 4. Captions Output */}
        {activeTool === 'captions' && (
          <div className="space-y-2.5">
            {captions.map((cap, idx) => (
              <div key={idx} className="p-3.5 rounded-xl bg-[#131622] border border-neutral-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase text-purple-400 bg-purple-950/60 px-2 py-0.5 rounded">
                    {cap.style}
                  </span>
                  <button
                    onClick={() => handleCopy(`${cap.headline}\n\n${cap.captionBody}\n\n${cap.callToAction}\n\n${cap.hashtags.join(' ')}`, `cap-${idx}`)}
                    className="p-1 rounded bg-neutral-800 text-neutral-300 hover:text-white"
                  >
                    {copiedIndex === `cap-${idx}` ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
                <div className="text-xs text-white font-bold">{cap.headline}</div>
                <div className="text-xs text-neutral-300 whitespace-pre-line leading-relaxed">{cap.captionBody}</div>
                <div className="text-xs text-amber-300 font-medium">{cap.callToAction}</div>
                <div className="flex flex-wrap gap-1 pt-1">
                  {cap.hashtags.map((tag, tIdx) => (
                    <span key={tIdx} className="text-[10px] text-purple-300 bg-purple-950/40 px-1.5 py-0.5 rounded">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 5. Thumbnails Output */}
        {activeTool === 'thumbnails' && (
          <div className="space-y-2.5">
            {thumbnails.map((thumb, idx) => (
              <div key={idx} className="p-3.5 rounded-xl bg-[#131622] border border-neutral-800 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-400">{thumb.conceptName}</span>
                  <div className="flex items-center gap-1.5">
                    {thumb.colorPalette.map((hex, cIdx) => (
                      <div
                        key={cIdx}
                        className="w-4 h-4 rounded-full border border-neutral-700"
                        style={{ backgroundColor: hex }}
                        title={hex}
                      ></div>
                    ))}
                  </div>
                </div>
                <p className="text-xs text-neutral-300 leading-relaxed">{thumb.visualDescription}</p>
                <div className="p-2 rounded-lg bg-[#090A0F] border border-neutral-800 text-xs">
                  <span className="text-[10px] text-neutral-400 uppercase font-semibold block">{t.thumbnails.textOverlay}:</span>
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {thumb.textSuggestions.map((txt, sIdx) => (
                      <span key={sIdx} className="px-2 py-0.5 rounded bg-neutral-800 text-white font-bold">
                        "{txt}"
                      </span>
                    ))}
                  </div>
                </div>
                <div className="text-[11px] text-neutral-400">
                  <span className="font-semibold text-neutral-500">{t.thumbnails.layoutGuide}: </span>
                  {thumb.layoutGuidance}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
