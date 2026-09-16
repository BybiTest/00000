import React from 'react';
import { Home, Sparkles, Calendar, BarChart3, User } from 'lucide-react';
import { NavTab, Language } from '../types';
import { translations } from '../locales';

interface BottomNavBarProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  lang: Language;
}

export const BottomNavBar: React.FC<BottomNavBarProps> = ({
  activeTab,
  onTabChange,
  lang
}) => {
  const t = translations[lang].nav;

  const tabs: { id: NavTab; label: string; icon: React.ReactNode }[] = [
    { id: 'home', label: t.home, icon: <Home className="w-5 h-5" /> },
    { id: 'studio', label: t.studio, icon: <Sparkles className="w-5 h-5" /> },
    { id: 'planner', label: t.planner, icon: <Calendar className="w-5 h-5" /> },
    { id: 'analytics', label: t.analytics, icon: <BarChart3 className="w-5 h-5" /> },
    { id: 'profile', label: t.profile, icon: <User className="w-5 h-5" /> }
  ];

  return (
    <nav className="h-16 px-2 bg-[#131622] border-t border-purple-900/30 flex items-center justify-around shrink-0 z-30">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            id={`nav-item-${tab.id}`}
            onClick={() => onTabChange(tab.id)}
            className={`flex flex-col items-center justify-center py-1 px-3 rounded-2xl transition-all duration-200 ${
              isActive
                ? 'text-purple-400 font-semibold'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <div
              className={`p-1 rounded-xl transition-all ${
                isActive
                  ? 'bg-purple-600/20 text-purple-400 scale-110 shadow-sm shadow-purple-500/20'
                  : 'text-neutral-400'
              }`}
            >
              {tab.icon}
            </div>
            <span className="text-[11px] mt-0.5 tracking-tight leading-none whitespace-nowrap">
              {tab.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};
