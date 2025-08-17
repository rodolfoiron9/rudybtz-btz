'use client';

import { useEffect } from 'react';
import { useThemeStorage } from '@/hooks/use-theme-storage.tsx';
import { Loader2 } from 'lucide-react';

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { themeSettings, isLoading } = useThemeStorage();

  useEffect(() => {
    if (themeSettings && typeof window !== 'undefined') {
      const root = document.documentElement;

      // Apply background
      if (themeSettings.background.type === 'particles') {
        root.classList.add('particle-background');
        root.style.backgroundColor = '';
      } else {
        root.classList.remove('particle-background');
        root.style.backgroundColor = themeSettings.background.value;
      }
      
      // Apply colors
      root.style.setProperty('--primary-hsl', themeSettings.primary);
      root.style.setProperty('--accent-hsl', themeSettings.accent);
    }
  }, [themeSettings]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
      </div>
    );
  }

  return <>{children}</>;
}
