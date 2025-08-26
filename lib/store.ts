import { create } from 'zustand';
import { Track, ThemeConfig } from './types';

interface AudioPlayerState {
  currentTrack: Track | null;
  isPlaying: boolean;
  isPlayerVisible: boolean;
  volume: number;
  playTrack: (track: Track) => void;
  pauseTrack: () => void;
  closePlayer: () => void;
  setVolume: (volume: number) => void;
}

interface ThemeState {
  theme: ThemeConfig | null;
  setTheme: (theme: ThemeConfig) => void;
  updateTheme: (updates: Partial<ThemeConfig>) => void;
}

interface AuthState {
  user: any | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUser: (user: any) => void;
  logout: () => void;
}

export const useAudioPlayer = create<AudioPlayerState>((set) => ({
  currentTrack: null,
  isPlaying: false,
  isPlayerVisible: false,
  volume: 0.8,
  playTrack: (track) => set({ 
    currentTrack: track, 
    isPlaying: true, 
    isPlayerVisible: true 
  }),
  pauseTrack: () => set({ isPlaying: false }),
  closePlayer: () => set({ 
    isPlayerVisible: false, 
    isPlaying: false,
    currentTrack: null 
  }),
  setVolume: (volume) => set({ volume }),
}));

export const useTheme = create<ThemeState>((set) => ({
  theme: null,
  setTheme: (theme) => set({ theme }),
  updateTheme: (updates) => set((state) => ({
    theme: state.theme ? { ...state.theme, ...updates } : null
  })),
}));

export const useAuth = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  setUser: (user) => set({ 
    user, 
    isAuthenticated: !!user, 
    isLoading: false 
  }),
  logout: () => set({ 
    user: null, 
    isAuthenticated: false, 
    isLoading: false 
  }),
}));