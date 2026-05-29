import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

type Gender = 'boy' | 'girl';

interface GenderContextType {
  gender: Gender;
  setGender: (gender: Gender) => Promise<void>;
  isLoading: boolean;
}

const GenderContext = createContext<GenderContextType | undefined>(undefined);

/**
 * GenderProvider - Manages user's selected character gender
 * Persists to AsyncStorage and provides throughout app
 */
export function GenderProvider({ children }: { children: React.ReactNode }) {
  const [gender, setGenderState] = useState<Gender>('boy');
  const [isLoading, setIsLoading] = useState(true);

  // Load gender preference on mount
  useEffect(() => {
    loadGender();
  }, []);

  const loadGender = async () => {
    try {
      const stored = await AsyncStorage.getItem('user_character_gender');
      if (stored === 'boy' || stored === 'girl') {
        setGenderState(stored);
      } else {
        // Default to boy if not set
        setGenderState('boy');
      }
    } catch (error) {
      console.error('Failed to load gender preference:', error);
      setGenderState('boy');
    } finally {
      setIsLoading(false);
    }
  };

  const setGender = async (newGender: Gender) => {
    try {
      setGenderState(newGender);
      await AsyncStorage.setItem('user_character_gender', newGender);
    } catch (error) {
      console.error('Failed to save gender preference:', error);
      // Revert on error
      const stored = await AsyncStorage.getItem('user_character_gender');
      if (stored === 'boy' || stored === 'girl') {
        setGenderState(stored);
      }
    }
  };

  return (
    <GenderContext.Provider value={{ gender, setGender, isLoading }}>
      {children}
    </GenderContext.Provider>
  );
}

/**
 * Hook to access gender context
 */
export function useGender() {
  const context = useContext(GenderContext);
  if (!context) {
    throw new Error('useGender must be used within GenderProvider');
  }
  return context;
}

/**
 * Get character image URL based on language and gender
 */
export function getCharacterImage(language: string, gender: Gender): string {
  // Map language codes to character image names
  const languageMap: Record<string, string> = {
    en: 'en',
    es: 'es',
    fr: 'fr',
    pt: 'pt',
    hi: 'hi',
    ar: 'ar',
    it: 'it',
    de: 'de',
    ja: 'ja',
    ko: 'ko',
    us: 'us',
    ke: 'ke',
  };

  const langCode = languageMap[language] || 'en';
  return `char-${langCode}-${gender}-flag.png`;
}

/**
 * Get all available character pairs for language selector
 */
export function getCharacterPairs() {
  return [
    { language: 'en', name: 'English (UK)', code: 'en' },
    { language: 'es', name: 'Español', code: 'es' },
    { language: 'fr', name: 'Français', code: 'fr' },
    { language: 'pt', name: 'Português', code: 'pt' },
    { language: 'hi', name: 'हिन्दी', code: 'hi' },
    { language: 'ar', name: 'العربية', code: 'ar' },
    { language: 'it', name: 'Italiano', code: 'it' },
    { language: 'de', name: 'Deutsch', code: 'de' },
    { language: 'us', name: 'English (USA)', code: 'us' },
    { language: 'ke', name: 'Kiswahili', code: 'ke' },
  ];
}
