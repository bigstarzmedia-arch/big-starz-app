import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getLocales } from 'expo-localization';
import { Language, LANGUAGES, translations } from './i18n';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => Promise<void>;
  isRTL: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    initializeLanguage();
  }, []);

  const initializeLanguage = async () => {
    try {
      // Try to get saved language preference
      const savedLanguage = await AsyncStorage.getItem('app_language');
      if (savedLanguage && (Object.keys(LANGUAGES) as Language[]).includes(savedLanguage as Language)) {
        setLanguageState(savedLanguage as Language);
        setIsLoading(false);
        return;
      }

      // Fallback to device locale
      const locales = getLocales();
      if (locales && locales.length > 0) {
        const deviceLocale = locales[0].languageCode;
        let detectedLanguage: Language = 'en';

        if (deviceLocale === 'ar') detectedLanguage = 'ar';
        else if (deviceLocale === 'hi') detectedLanguage = 'hi';
        else if (deviceLocale === 'sw') detectedLanguage = 'sw';
        else if (deviceLocale === 'es') detectedLanguage = 'es';
        else if (deviceLocale === 'fr') detectedLanguage = 'fr';
        else if (deviceLocale === 'pt') detectedLanguage = 'pt';
        else if (deviceLocale === 'it') detectedLanguage = 'it';
        else if (deviceLocale === 'de') detectedLanguage = 'de';

        setLanguageState(detectedLanguage);
        await AsyncStorage.setItem('app_language', detectedLanguage);
      }
    } catch (error) {
      console.error('Error initializing language:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const setLanguage = async (lang: Language) => {
    setLanguageState(lang);
    try {
      await AsyncStorage.setItem('app_language', lang);
    } catch (error) {
      console.error('Error saving language preference:', error);
    }
  };

  const isRTL = language === 'ar';

  if (isLoading) {
    return null; // Or a loading screen
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, isRTL }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
}

export function useTranslation() {
  const { language } = useLanguage();

  return (key: string): string => {
    return getTranslation(language, key);
  };
}

// Helper function to get translation
function getTranslation(language: Language, key: string): string {
  const keys = key.split('.');
  let value: any = translations[language];
  
  for (const k of keys) {
    value = value?.[k];
  }
  
  // Fallback to English if translation not found
  if (!value) {
    value = translations.en;
    for (const k of keys) {
      value = value?.[k];
    }
  }
  
  return value || key;
}
