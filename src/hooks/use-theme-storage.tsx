
'use client';

import { useState, useEffect, Dispatch, SetStateAction, createContext, useContext } from 'react';
import { getThemeSettings, updateThemeSettings } from '@/lib/theme-firestore';
import type { ThemeSettings } from '@/lib/types';

// A bit of a workaround to get a reactive theme context
// This avoids needing to pass theme down as props everywhere

interface ThemeContextType {
    themeSettings: ThemeSettings | null;
    setThemeSettings: ((newSettings: ThemeSettings) => void) | null;
    isLoading: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeStorageProvider({ children }: { children: React.ReactNode }) {
    const [themeSettings, internalSetThemeSettings] = useState<ThemeSettings | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchTheme = async () => {
            setIsLoading(true);
            try {
                const settings = await getThemeSettings();
                internalSetThemeSettings(settings);
            } catch (error) {
                console.error("Failed to fetch theme settings:", error);
                 // Fallback to initial settings if fetch fails
                internalSetThemeSettings(null);
            } finally {
                setIsLoading(false);
            }
        };
        fetchTheme();
    }, []);

    const setThemeSettings = async (newSettings: ThemeSettings) => {
        internalSetThemeSettings(newSettings);
        try {
            await updateThemeSettings(newSettings);
        } catch (error) {
            console.error("Failed to update theme settings in Firestore:", error);
        }
    };


    return (
        <ThemeContext.Provider value={{ themeSettings, setThemeSettings, isLoading }}>
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
