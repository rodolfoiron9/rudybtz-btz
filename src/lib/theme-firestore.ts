import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from './firebase';
import type { ThemeSettings } from './types';
import { initialThemeSettings } from './data';

const themeDocRef = doc(db, 'settings', 'theme');

export const getThemeSettings = async (): Promise<ThemeSettings> => {
    const docSnap = await getDoc(themeDocRef);

    if (docSnap.exists()) {
        return docSnap.data() as ThemeSettings;
    } else {
        // If no theme is in the database, create it from initial settings
        await setDoc(themeDocRef, initialThemeSettings);
        return initialThemeSettings;
    }
};

export const updateThemeSettings = async (settings: ThemeSettings): Promise<void> => {
    return await setDoc(themeDocRef, settings);
};

    