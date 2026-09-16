import { useState } from 'react';
import { AndroidFrame } from './components/AndroidFrame';
import { BottomNavBar } from './components/BottomNavBar';
import { HomeScreenView } from './components/HomeScreenView';
import { StudioScreenView } from './components/StudioScreenView';
import { PlannerScreenView } from './components/PlannerScreenView';
import { AnalyticsScreenView } from './components/AnalyticsScreenView';
import { ProfileScreenView } from './components/ProfileScreenView';
import { ChatAssistantView } from './components/ChatAssistantView';
import { AndroidProjectHub } from './components/AndroidProjectHub';
import { SplashScreen } from './components/SplashScreen';
import { Language, MonetizationPlan, NavTab, StudioSubTool, CalendarPost } from './types';

export default function App() {
  const [lang, setLang] = useState<Language>('fa'); // Start with Persian / RTL as requested by user prompt, toggleable
  const [showSplash, setShowSplash] = useState(true);
  const [activeTab, setActiveTab] = useState<NavTab>('home');
  const [selectedStudioTool, setSelectedStudioTool] = useState<StudioSubTool>('ideas');
  const [inChatMode, setInChatMode] = useState(false);
  const [showAndroidHub, setShowAndroidHub] = useState(false);

  // Monetization State
  const [plan, setPlan] = useState<MonetizationPlan>('FREE');
  const [remainingCredits, setRemainingCredits] = useState(5);

  // Calendar State (Room DB mirror)
  const [posts, setPosts] = useState<CalendarPost[]>([
    {
      id: '1',
      title: 'Top 5 AI Video Prompts That Blew Up',
      platform: 'Instagram',
      date: '2026-09-18',
      status: 'RECORDED'
    },
    {
      id: '2',
      title: '3-Second Retention Fix for Shorts',
      platform: 'YouTube Shorts',
      date: '2026-09-20',
      status: 'PLANNED'
    },
    {
      id: '3',
      title: 'How CreatorFlow AI Automates Production',
      platform: 'YouTube',
      date: '2026-09-22',
      status: 'PLANNED'
    }
  ]);

  const handleConsumeCredit = (): boolean => {
    if (plan === 'VIP') return true;
    if (remainingCredits > 0) {
      setRemainingCredits((c) => c - 1);
      return true;
    }
    return false;
  };

  const handleWatchAd = () => {
    setRemainingCredits((c) => c + 3);
  };

  const handleUpgradeVip = () => {
    setPlan('VIP');
    setRemainingCredits(9999);
  };

  const handleSaveToCalendar = (title: string, platform: any) => {
    const newPost: CalendarPost = {
      id: Date.now().toString(),
      title,
      platform: platform.includes('Shorts') ? 'YouTube Shorts' : platform.includes('YouTube') ? 'YouTube' : 'Instagram',
      date: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
      status: 'PLANNED'
    };
    setPosts((prev) => [newPost, ...prev]);
    setActiveTab('planner');
  };

  const handleAddPost = (title: string, platform: any, date: string) => {
    const post: CalendarPost = {
      id: Date.now().toString(),
      title,
      platform,
      date,
      status: 'PLANNED'
    };
    setPosts((prev) => [post, ...prev]);
  };

  const handleUpdateStatus = (id: string, status: any) => {
    setPosts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status } : p))
    );
  };

  const handleDeletePost = (id: string) => {
    setPosts((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <div className="min-h-screen bg-neutral-950 font-sans">
      {showSplash && (
        <SplashScreen
          lang={lang}
          onFinish={() => setShowSplash(false)}
        />
      )}
      <AndroidFrame
        isRtl={lang === 'fa'}
        language={lang}
        onToggleLanguage={() => setLang(lang === 'en' ? 'fa' : 'en')}
        isVip={plan === 'VIP'}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        showDevPanel={showAndroidHub}
        onToggleDevPanel={() => setShowAndroidHub(!showAndroidHub)}
      >
        <div className="flex flex-col h-full">
          <div className="flex-1 overflow-y-auto">
            {inChatMode ? (
              <ChatAssistantView
                lang={lang}
                onBack={() => setInChatMode(false)}
                onConsumeCredit={handleConsumeCredit}
              />
            ) : (
              <>
                {activeTab === 'home' && (
                  <HomeScreenView
                    lang={lang}
                    onNavigate={(tab) => {
                      setActiveTab(tab);
                      setInChatMode(false);
                    }}
                    onOpenTool={(tool) => {
                      if (tool === 'chat') {
                        setInChatMode(true);
                      } else {
                        setSelectedStudioTool(tool as StudioSubTool);
                        setActiveTab('studio');
                      }
                    }}
                    plan={plan}
                    remainingCredits={remainingCredits}
                  />
                )}

                {activeTab === 'studio' && (
                  <StudioScreenView
                    lang={lang}
                    initialTool={selectedStudioTool}
                    onSaveToCalendar={handleSaveToCalendar}
                    onOpenChat={() => setInChatMode(true)}
                    onConsumeCredit={handleConsumeCredit}
                  />
                )}

                {activeTab === 'planner' && (
                  <PlannerScreenView
                    lang={lang}
                    posts={posts}
                    onAddPost={handleAddPost}
                    onUpdateStatus={handleUpdateStatus}
                    onDeletePost={handleDeletePost}
                  />
                )}

                {activeTab === 'analytics' && (
                  <AnalyticsScreenView lang={lang} />
                )}

                {activeTab === 'profile' && (
                  <ProfileScreenView
                    lang={lang}
                    onToggleLanguage={() => setLang(lang === 'en' ? 'fa' : 'en')}
                    plan={plan}
                    remainingCredits={remainingCredits}
                    onUpgradeVip={handleUpgradeVip}
                    onWatchAd={handleWatchAd}
                    onOpenAndroidHub={() => setShowAndroidHub(true)}
                  />
                )}
              </>
            )}
          </div>

          {!inChatMode && (
            <BottomNavBar
              activeTab={activeTab}
              onTabChange={(tab) => {
                setActiveTab(tab);
                setInChatMode(false);
              }}
              lang={lang}
            />
          )}
        </div>
      </AndroidFrame>

      {/* Android Project & Code Hub Modal */}
      {showAndroidHub && (
        <AndroidProjectHub onClose={() => setShowAndroidHub(false)} />
      )}
    </div>
  );
}
