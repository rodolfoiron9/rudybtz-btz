
'use client';

import { useState, useEffect, createContext, useContext } from 'react';
import type { ThemeSettings } from '@/lib/types';
import { initialThemeSettings } from '@/lib/data';
import useLocalStorage from './use-local-storage';
import { updateThemeSettings } from '@/lib/theme-firestore';


interface ThemeContextType {
    themeSettings: ThemeSettings;
    setThemeSettings: ((newSettings: ThemeSettings) => void);
    isLoading: boolean;
}

const ThemeContext = createContext<ThemeContextType>({
    themeSettings: initialThemeSettings,
    setThemeSettings: () => {},
    isLoading: true,
});

export function ThemeStorageProvider({ children }: { children: React.ReactNode }) {
    const [settings, setSettings] = useLocalStorage<ThemeSettings>('rudybtz-theme', initialThemeSettings);
    const [isLoading, setIsLoading] = useState(true);
    
    // On initial load, we use the settings from local storage.
    // The loading state is just to prevent flashes of unstyled content.
    useEffect(() => {
        setIsLoading(false);
    }, []);

    const setThemeSettings = async (newSettings: ThemeSettings) => {
        setSettings(newSettings);
        try {
            // We still want to persist to the database when changes are made.
            await updateThemeSettings(newSettings);
        } catch (error) {
            console.error("Failed to update theme settings in Firestore:", error);
        }
    };


    return (
        <ThemeContext.Provider value={{ themeSettings: settings, setThemeSettings, isLoading }}>
            {children}
        </ThemeContext.Provider>
    )
}

export function useThemeStorage() {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useThemeStorage must be used within a ThemeStorageProvider');
    }
    return context;
}
