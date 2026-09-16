export type Language = 'en' | 'fa';
export type MonetizationPlan = 'FREE' | 'VIP';
export type NavTab = 'home' | 'studio' | 'planner' | 'analytics' | 'profile';
export type StudioSubTool = 'ideas' | 'hooks' | 'scripts' | 'captions' | 'thumbnails' | 'chat';

export interface ContentIdea {
  id: string;
  title: string;
  angle: string;
  hookSnippet: string;
  whyViral: string;
  estimatedRetention: string;
  platform?: string;
  saved?: boolean;
}

export interface HookItem {
  type: 'Curiosity' | 'Emotional' | 'Problem-Solving' | 'Storytelling' | 'Sales';
  hookText: string;
  visualAction: string;
  psychologicalTrigger: string;
}

export interface ScriptData {
  title: string;
  estimatedWordCount: number;
  hook: string;
  intro: string;
  mainContent: string[];
  emotionalTrigger: string;
  callToAction: string;
  visualDirectives: string[];
}

export interface CaptionData {
  style: string;
  headline: string;
  captionBody: string;
  callToAction: string;
  hashtags: string[];
}

export interface ThumbnailData {
  conceptName: string;
  visualDescription: string;
  textSuggestions: string[];
  colorPalette: string[];
  layoutGuidance: string;
}

export interface CalendarPost {
  id: string;
  title: string;
  platform: 'YouTube' | 'Instagram' | 'TikTok' | 'YouTube Shorts';
  date: string;
  status: 'PLANNED' | 'RECORDED' | 'EDITED' | 'PUBLISHED';
  notes?: string;
}

export interface AnalyticsData {
  views: number;
  likes: number;
  followers: number;
  comments: number;
  saves: number;
}

export interface AnalyticsAudit {
  engagementRatePercentage: number;
  performanceVerdict: string;
  coreStrengths: string[];
  criticalBottlenecks: string[];
  top3ActionableSteps: string[];
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}
