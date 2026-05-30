import { v2 as translate } from '@google-cloud/translate';

const PROJECT_ID = process.env.GOOGLE_CLOUD_PROJECT_ID || 'big-starz-media';
const API_KEY = process.env.GOOGLE_TRANSLATE_API_KEY;

// Supported languages
export const SUPPORTED_LANGUAGES = {
  en: 'English',
  es: 'Spanish',
  fr: 'French',
  pt: 'Portuguese',
  hi: 'Hindi',
  ar: 'Arabic',
  it: 'Italian',
  de: 'German',
  us: 'English (US)',
  sw: 'Swahili',
} as const;

export type SupportedLanguage = keyof typeof SUPPORTED_LANGUAGES;

/**
 * Google Translate Service
 * Translates content to all 10 supported languages
 */
export class GoogleTranslateService {
  private translator: any;

  constructor() {
    if (!API_KEY) {
      console.warn('GOOGLE_TRANSLATE_API_KEY not set - translations will be disabled');
      this.translator = null;
    } else {
      this.translator = new translate.Translate({
        key: API_KEY,
        projectId: PROJECT_ID,
      });
    }
  }

  /**
   * Translate text to a specific language
   */
  async translateText(text: string, targetLanguage: SupportedLanguage): Promise<string> {
    try {
      if (!this.translator) {
        console.warn(`Translation disabled - returning original text for ${targetLanguage}`);
        return text;
      }

      if (targetLanguage === 'en' || targetLanguage === 'us') {
        return text; // Already in English
      }

      const [translation] = await this.translator.translate(text, this.getLanguageCode(targetLanguage));
      return Array.isArray(translation) ? translation[0] : translation;
    } catch (error) {
      console.error(`Translation error for ${targetLanguage}:`, error);
      return text; // Fallback to original text
    }
  }

  /**
   * Translate text to multiple languages
   */
  async translateToMultiple(
    text: string,
    languages: SupportedLanguage[]
  ): Promise<Record<SupportedLanguage, string>> {
    const results: Record<string, string> = {};

    for (const lang of languages) {
      results[lang] = await this.translateText(text, lang);
    }

    return results as Record<SupportedLanguage, string>;
  }

  /**
   * Translate an object's string values
   */
  async translateObject<T extends Record<string, any>>(
    obj: T,
    targetLanguage: SupportedLanguage
  ): Promise<T> {
    const translated: Record<string, any> = {};

    for (const [key, value] of Object.entries(obj)) {
      if (typeof value === 'string') {
        translated[key] = await this.translateText(value, targetLanguage);
      } else if (typeof value === 'object' && value !== null) {
        translated[key] = await this.translateObject(value, targetLanguage);
      } else {
        translated[key] = value;
      }
    }

    return translated as T;
  }

  /**
   * Convert language code to ISO 639-1 format
   */
  private getLanguageCode(language: SupportedLanguage): string {
    const codeMap: Record<SupportedLanguage, string> = {
      en: 'en',
      es: 'es',
      fr: 'fr',
      pt: 'pt',
      hi: 'hi',
      ar: 'ar',
      it: 'it',
      de: 'de',
      us: 'en',
      sw: 'sw',
    };
    return codeMap[language];
  }
}

// Singleton instance
export const googleTranslateService = new GoogleTranslateService();
