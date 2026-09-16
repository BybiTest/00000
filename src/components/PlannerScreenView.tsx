import React, { useState } from 'react';
import { Calendar as CalendarIcon, Plus, Trash2 } from 'lucide-react';
import { Language, CalendarPost } from '../types';
import { translations } from '../locales';

interface PlannerScreenViewProps {
  lang: Language;
  posts: CalendarPost[];
  onAddPost: (title: string, platform: any, date: string) => void;
  onUpdateStatus: (id: string, status: any) => void;
  onDeletePost: (id: string) => void;
}

export const PlannerScreenView: React.FC<PlannerScreenViewProps> = ({
  lang,
  posts,
  onAddPost,
  onUpdateStatus,
  onDeletePost
}) => {
  const t = translations[lang];
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newPlatform, setNewPlatform] = useState<'Instagram' | 'YouTube' | 'TikTok' | 'YouTube Shorts'>('Instagram');
  const [newDate, setNewDate] = useState(new Date().toISOString().split('T')[0]);

  const handleSave = () => {
    if (!newTitle.trim()) return;
    onAddPost(newTitle, newPlatform, newDate);
    setNewTitle('');
    setShowAddModal(false);
  };

  const statusColors = {
    PLANNED: 'text-neutral-400 border-neutral-700 bg-neutral-900',
    RECORDED: 'text-amber-400 border-amber-500/30 bg-amber-950/20',
    EDITED: 'text-purple-400 border-purple-500/30 bg-purple-950/20',
    PUBLISHED: 'text-emerald-400 border-emerald-500/30 bg-emerald-950/20'
  };

  return (
    <div className="p-4 space-y-4 pb-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-white tracking-tight flex items-center gap-1.5">
            <CalendarIcon className="w-4 h-4 text-purple-400" />
            <span>{t.planner.title}</span>
          </h1>
          <p className="text-xs text-neutral-400">{t.planner.subtitle}</p>
        </div>
        <button
          id="btn-add-planner-post"
          onClick={() => setShowAddModal(true)}
          className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold flex items-center gap-1 shadow-md shadow-purple-900/30 transition"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>{t.planner.addPost}</span>
        </button>
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="p-3.5 rounded-2xl bg-[#131622] border border-purple-500/40 space-y-3">
          <span className="text-xs font-bold text-white block">
            {lang === 'fa' ? 'افزودن محتوا به تقویم انتشار' : 'Add Content to Schedule'}
          </span>
          <input
            type="text"
            placeholder={lang === 'fa' ? 'عنوان ویدیو...' : 'Video title / concept...'}
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-[#090A0F] border border-neutral-700 text-white text-xs focus:outline-none focus:border-purple-500"
          />
          <div className="grid grid-cols-2 gap-2">
            <select
              value={newPlatform}
              onChange={(e) => setNewPlatform(e.target.value as any)}
              className="px-2.5 py-1.5 rounded-xl bg-[#090A0F] border border-neutral-700 text-white text-xs"
            >
              <option value="Instagram">Instagram Reels</option>
              <option value="YouTube Shorts">YouTube Shorts</option>
              <option value="TikTok">TikTok</option>
              <option value="YouTube">YouTube</option>
            </select>
            <input
              type="date"
              value={newDate}
              onChange={(e) => setNewDate(e.target.value)}
              className="px-2.5 py-1.5 rounded-xl bg-[#090A0F] border border-neutral-700 text-white text-xs"
            />
          </div>
          <div className="flex justify-end gap-2 pt-1">
            <button
              onClick={() => setShowAddModal(false)}
              className="px-3 py-1 text-xs text-neutral-400 hover:text-white"
            >
              {lang === 'fa' ? 'انصراف' : 'Cancel'}
            </button>
            <button
              onClick={handleSave}
              className="px-3.5 py-1 rounded-lg bg-purple-600 text-white text-xs font-bold"
            >
              {lang === 'fa' ? 'ثبت پست' : 'Save Post'}
            </button>
          </div>
        </div>
      )}

      {/* Posts List */}
      <div className="space-y-2.5">
        {posts.length === 0 ? (
          <div className="p-6 rounded-xl bg-[#131622]/60 border border-neutral-800 text-center text-xs text-neutral-400">
            {t.planner.noPosts}
          </div>
        ) : (
          posts.map((post) => (
            <div
              key={post.id}
              className="p-3.5 rounded-xl bg-[#131622] border border-neutral-800 hover:border-neutral-700 transition space-y-2"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-xs font-bold text-white block">{post.title}</span>
                  <div className="flex items-center gap-2 mt-1 text-[11px] text-neutral-400">
                    <span className="px-1.5 py-0.5 rounded bg-neutral-800 text-neutral-300 font-mono text-[10px]">
                      {post.platform}
                    </span>
                    <span>{post.date}</span>
                  </div>
                </div>
                <button
                  onClick={() => onDeletePost(post.id)}
                  className="p-1 text-neutral-500 hover:text-red-400 transition"
                  title="Delete"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Status Selector */}
              <div className="flex items-center justify-between pt-1 border-t border-neutral-800 text-xs">
                <span className="text-[11px] text-neutral-500">{lang === 'fa' ? 'وضعیت: ' : 'Status: '}</span>
                <div className="flex items-center gap-1">
                  {(['PLANNED', 'RECORDED', 'EDITED', 'PUBLISHED'] as const).map((st) => (
                    <button
                      key={st}
                      onClick={() => onUpdateStatus(post.id, st)}
                      className={`px-2 py-0.5 rounded text-[10px] font-semibold border transition ${
                        post.status === st
                          ? statusColors[st]
                          : 'text-neutral-500 border-transparent hover:text-neutral-300'
                      }`}
                    >
                      {t.planner.status[st]}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
