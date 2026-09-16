import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Send, User, Bot, Trash2, Loader2 } from 'lucide-react';
import { Language, ChatMessage } from '../types';
import { translations } from '../locales';

interface ChatAssistantViewProps {
  lang: Language;
  onBack: () => void;
  onConsumeCredit: () => boolean;
}

export const ChatAssistantView: React.FC<ChatAssistantViewProps> = ({
  lang,
  onBack,
  onConsumeCredit
}) => {
  const t = translations[lang];
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'assistant',
      text: lang === 'fa'
        ? 'سلام! من مشاور هوشمند تولید محتوای CreatorFlow AI توسعه‌یافته توسط سیدحمیدموسوی زاده هستم. چطور می‌توانم در نوشتن سناریو، ارتقای هوک، تعامل مخاطب یا بهبود ریتنشن کانال و پیج کمکتان کنم؟'
        : 'Hello! I am your CreatorFlow AI Strategist developed by سیدحمیدموسوی زاده. How can I help you optimize retention, craft hooks, or beat the algorithm today?',
      timestamp: 'Now'
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (textToSend?: string) => {
    const text = textToSend || input;
    if (!text.trim() || loading) return;

    if (!onConsumeCredit()) {
      alert(lang === 'fa' ? 'اعتبار شما به پایان رسیده است.' : 'No credits remaining. Watch a rewarded ad or upgrade to VIP.');
      return;
    }

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: text.trim(),
      timestamp: 'Now'
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const history = messages.map((m) => ({
        role: m.sender === 'user' ? 'user' : 'model',
        text: m.text
      }));

      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text.trim(),
          history,
          language: lang
        })
      });

      const data = await res.json();
      if (data.reply) {
        const aiMsg: ChatMessage = {
          id: (Date.now() + 1).toString(),
          sender: 'assistant',
          text: data.reply,
          timestamp: 'Now'
        };
        setMessages((prev) => [...prev, aiMsg]);
      } else {
        throw new Error(data.error || 'No response from assistant');
      }
    } catch (err: any) {
      console.error(err);
      const errorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'assistant',
        text: lang === 'fa'
          ? 'خطا در ارتباط با سرویس هوش مصنوعی. لطفاً دوباره تلاش کنید.'
          : 'Could not connect to Gemini service. Please check your connection and retry.',
        timestamp: 'Now'
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const quickPrompts = lang === 'fa' ? [
    'چطور افت بازدید بعد از ۵ ثانیه اول ویدیو را متوقف کنم؟',
    '۳ ایده چالش‌برانگیز و جذاب برای ریلز اینستاگرام بده',
    'الگوریتم جدید یوتیوب شورتس در سال ۲۰۲۶ چطور کار می‌کند؟'
  ] : [
    'How do I fix retention drop-off after 5 seconds?',
    'Give me 3 controversial tech reel ideas',
    'How does the 2026 YouTube Shorts algorithm work?'
  ];

  return (
    <div className="flex flex-col h-full bg-[#090A0F]">
      {/* Header */}
      <div className="p-3.5 bg-[#131622] border-b border-neutral-800 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <button
            onClick={onBack}
            className="p-1.5 rounded-lg bg-neutral-800 text-neutral-300 hover:text-white"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="text-xs font-bold text-white flex items-center gap-1">
              <span>{t.chat.title}</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            </div>
            <span className="text-[10px] text-purple-400">{t.publisher}</span>
          </div>
        </div>
        <button
          onClick={() => setMessages([messages[0]])}
          className="p-1.5 rounded-lg text-neutral-500 hover:text-neutral-300"
          title={t.chat.clear}
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Messages Feed */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';
          return (
            <div
              key={msg.id}
              className={`flex items-start gap-2 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
            >
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-xs ${
                  isUser ? 'bg-purple-600 text-white' : 'bg-[#1E2235] text-purple-300 border border-purple-800/40'
                }`}
              >
                {isUser ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
              </div>
              <div
                className={`max-w-[82%] p-3 rounded-2xl text-xs leading-relaxed ${
                  isUser
                    ? 'bg-purple-600 text-white rounded-tr-none'
                    : 'bg-[#131622] text-neutral-200 border border-neutral-800 rounded-tl-none whitespace-pre-wrap'
                }`}
              >
                {msg.text}
              </div>
            </div>
          );
        })}
        {loading && (
          <div className="flex items-center gap-2 text-xs text-purple-400 p-2">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>{lang === 'fa' ? 'در حال تحلیل استراتژی...' : 'Strategist is analyzing...'}</span>
          </div>
        )}
        <div ref={scrollRef} />
      </div>

      {/* Quick Prompts */}
      <div className="px-3 py-1.5 flex items-center gap-1.5 overflow-x-auto scrollbar-none shrink-0 bg-[#0D0F17]">
        {quickPrompts.map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(prompt)}
            className="px-2.5 py-1 rounded-full text-[11px] bg-[#161926] text-neutral-300 hover:text-white border border-neutral-800 hover:border-purple-600/40 whitespace-nowrap transition"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Input Bar */}
      <div className="p-3 bg-[#131622] border-t border-neutral-800 shrink-0">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={t.chat.placeholder}
            className="flex-1 px-3.5 py-2 rounded-full bg-[#090A0F] border border-neutral-700/80 text-white text-xs placeholder:text-neutral-500 focus:outline-none focus:border-purple-500"
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="p-2 rounded-full bg-purple-600 hover:bg-purple-500 text-white disabled:opacity-40 transition"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
