export interface Track {
  id: string;
  title: string;
  duration: number; // seconds
  audioUrl: string;
  albumId: string;
  trackNumber: number;
  waveformData?: number[];
  lyrics?: LyricsData;
  visualizationSettings: {
    presetId: string;
    lyricsDisplay: 'cube' | 'below' | 'none' | 'floating';
    customColors?: string[];
    effects?: string[];
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface Album {
  id: string;
  title: string;
  releaseDate: Date;
  coverArtUrl: string;
  genre: string;
  mood?: string;
  trackIds: string[];
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface VisualizerPreset {
  id: string;
  name: string;
  description?: string;
  settings: {
    backgroundColor: string;
    primaryColor: string;
    secondaryColor: string;
    particleCount: number;
    sensitivity: number;
    speed: number;
    geometry: string;
    animation: string;
    reactive: boolean;
    bloomEffect: boolean;
    postProcessing: boolean;
  };
  isDefault?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface LyricsData {
  lines: Array<{
    text: string;
    startTime: number; // milliseconds
    endTime: number;
  }>;
  sync: boolean;
}

export interface HeroSlide {
  id: string;
  mediaUrl: string;
  type: 'image' | 'video';
  title: string;
  description?: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string; // HTML or Markdown
  featuredImageUrl?: string;
  tags: string[];
  published: boolean;
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface ArtistBioEntry {
  id: string;
  year: number;
  title: string;
  description: string;
  imageUrl?: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ThemeConfig {
  id: 'live'; // Single document
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  textColor: string;
  headlineFont: string;
  bodyFont: string;
  fontSize: {
    small: string;
    medium: string;
    large: string;
    xlarge: string;
  };
  spacing: {
    small: string;
    medium: string;
    large: string;
  };
  borderRadius: string;
  updatedAt: Date;
}

export interface SiteConfig {
  id: 'live'; // Single document
  homepageType: 'album' | 'blog' | 'landingPage';
  homepageRef?: string; // Reference to specific album or landing page
  siteTitle: string;
  siteDescription: string;
  socialLinks: {
    spotify?: string;
    soundcloud?: string;
    youtube?: string;
    instagram?: string;
    twitter?: string;
  };
  updatedAt: Date;
}

export interface KnowledgeEntry {
  id: string;
  type: 'preset' | 'research' | 'inspiration' | 'technical' | 'blog_snippet';
  content: {
    title: string;
    data: any; // Flexible structure
    metadata: Record<string, any>;
  };
  relationships: string[]; // Links to related entries
  tags: string[];
  confidence: number; // AI confidence in this data (0-1)
  source: 'ai_generated' | 'user_input' | 'web_research';
  createdAt: Date;
  updatedAt: Date;
}

export interface KnowledgeBaseEntry {
  id: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  priority: 'low' | 'medium' | 'high';
  createdAt: Date;
  updatedAt: Date;
}

export interface User {
  id: string;
  email: string;
  role: 'admin' | 'viewer';
  createdAt: Date;
  lastLogin: Date;
}