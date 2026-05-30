/**
 * Character Mapping for All Languages
 * Maps language codes to character images (boy/girl) hosted on S3
 */

export type Language = 'en' | 'es' | 'fr' | 'pt' | 'hi' | 'ar' | 'it' | 'de' | 'us' | 'ke';

export interface CharacterImages {
  boy: string;
  girl: string;
}

export const CHARACTER_IMAGES: Record<Language, CharacterImages> = {
  en: {
    boy: 'https://manus-assets.s3.amazonaws.com/char-en-boy-flag.png',
    girl: 'https://manus-assets.s3.amazonaws.com/char-en-girl-flag.png',
  },
  es: {
    boy: 'https://manus-assets.s3.amazonaws.com/char-es-boy-flag.png',
    girl: 'https://manus-assets.s3.amazonaws.com/char-es-girl-flag.png',
  },
  fr: {
    boy: 'https://manus-assets.s3.amazonaws.com/char-fr-boy-flag.png',
    girl: 'https://manus-assets.s3.amazonaws.com/char-fr-girl-flag.png',
  },
  pt: {
    boy: 'https://manus-assets.s3.amazonaws.com/char-pt-boy-flag.png',
    girl: 'https://manus-assets.s3.amazonaws.com/char-pt-girl-flag.png',
  },
  hi: {
    boy: 'https://manus-assets.s3.amazonaws.com/char-hi-boy-flag.png',
    girl: 'https://manus-assets.s3.amazonaws.com/char-hi-girl-flag.png',
  },
  ar: {
    boy: 'https://manus-assets.s3.amazonaws.com/char-ar-boy-flag.png',
    girl: 'https://manus-assets.s3.amazonaws.com/char-ar-girl-flag.png',
  },
  it: {
    boy: 'https://manus-assets.s3.amazonaws.com/char-it-boy-flag.png',
    girl: 'https://manus-assets.s3.amazonaws.com/char-it-girl-flag.png',
  },
  de: {
    boy: 'https://manus-assets.s3.amazonaws.com/char-de-boy-flag.png',
    girl: 'https://manus-assets.s3.amazonaws.com/char-de-girl-flag.png',
  },
  us: {
    boy: 'https://manus-assets.s3.amazonaws.com/char-us-boy-flag.png',
    girl: 'https://manus-assets.s3.amazonaws.com/char-us-girl-flag.png',
  },
  ke: {
    boy: 'https://manus-assets.s3.amazonaws.com/char-ke-boy-flag.png',
    girl: 'https://manus-assets.s3.amazonaws.com/char-ke-girl-flag.png',
  },
};

export const LANGUAGE_NAMES: Record<Language, string> = {
  en: '🇬🇧 English (UK)',
  es: '🇪🇸 Español',
  fr: '🇫🇷 Français',
  pt: '🇧🇷 Português',
  hi: '🇮🇳 हिन्दी',
  ar: '🇸🇦 العربية',
  it: '🇮🇹 Italiano',
  de: '🇩🇪 Deutsch',
  us: '🇺🇸 English (USA)',
  ke: '🇰🇪 Kiswahili',
};

/**
 * Get character image URL for a specific language and gender
 */
export function getCharacterImage(language: Language, gender: 'boy' | 'girl'): string {
  return CHARACTER_IMAGES[language]?.[gender] || CHARACTER_IMAGES.en[gender];
}

/**
 * Get all available languages
 */
export function getAvailableLanguages(): Language[] {
  return Object.keys(CHARACTER_IMAGES) as Language[];
}
