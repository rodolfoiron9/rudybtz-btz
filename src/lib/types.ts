export interface Track {
  id: string;
  title: string;
  duration: string;
  url: string; // URL to the audio file in Firebase Storage
}

export interface Album {
  id: string;
  title: string;
  releaseYear: number;
  coverArt: string;
  tracks: Track[];
}

export interface Profile {
  bio: string;
  profileImage: string;
  socials: {
    twitter: string;
    instagram: string;
    youtube: string;
    soundcloud: string;
  };
}

export interface RoadmapItem {
  id: string;
  title: string;
  description: string;
  status: 'Completed' | 'In Progress' | 'Planned';
  dueDate: string;
}

export interface KnowledgeArticle {
    id: string;
    title: string;
    content: string; // Can be raw text or stringified JSON
    format: 'text' | 'json';
    lastUpdated: string; // ISO date string
}

export interface ApiKeys {
    gemini: string;
    huggingFace: string;
    deepseek: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
}

export interface ThemeSettings {
  background: {
    type: 'color' | 'particles';
    value: string; // Hex color code
  };
  primary: string; // HSL string
  accent: string; // HSL string
}

export interface HeroSlide {
  id: string;
  type: 'image' | 'video';
  url: string;
  hint?: string;
}
    