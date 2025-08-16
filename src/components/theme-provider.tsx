'use client';

import { useEffect } from 'react';
import useLocalStorage from '@/hooks/use-local-storage';
import { initialThemeSettings } from '@/lib/data';
import type { ThemeSettings } from '@/lib/types';

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [themeSettings] = useLocalStorage<ThemeSettings>('rudybtz-theme', initialThemeSettings);

  useEffect(() => {
    if (typeof window !== 'undefined') {
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

  return <>{children}</>;
}
    