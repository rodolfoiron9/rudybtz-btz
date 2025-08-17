
'use client';

import { useState, useEffect, Dispatch, SetStateAction, createContext, useContext } from 'react';
import { getThemeSettings } from '@/lib/theme-firestore';
import type { ThemeSettings } from '@/lib/types';

// A bit of a workaround to get a reactive theme context
// This avoids needing to pass theme down as props everywhere

interface ThemeContextType {
    themeSettings: ThemeSettings | null;
    setThemeSettings: Dispatch<SetStateAction<ThemeSettings | null>>;
    isLoading: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeStorageProvider({ children }: { children: React.ReactNode }) {
    const [themeSettings, setThemeSettings] = useState<ThemeSettings | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchTheme = async () => {
            try {
                const settings = await getThemeSettings();
                setThemeSettings(settings);
            } catch (error) {
                console.error("Failed to fetch theme settings:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchTheme();
    }, []);

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
