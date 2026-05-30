import axios from 'axios';

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

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
 * OpenRouter & OpenAI Translation Service
 * Translates content to all 10 supported languages using LLMs
 */
export class OpenRouterTranslator {
  private openrouterKey: string | undefined;
  private openaiKey: string | undefined;

  constructor() {
    this.openrouterKey = OPENROUTER_API_KEY;
    this.openaiKey = OPENAI_API_KEY;

    if (!this.openrouterKey && !this.openaiKey) {
      console.warn('No translation API keys configured - translations will be disabled');
    }
  }

  /**
   * Translate text using OpenRouter (supports multiple models)
   */
  async translateTextOpenRouter(text: string, targetLanguage: SupportedLanguage): Promise<string> {
    try {
      if (!this.openrouterKey) {
        console.warn(`OpenRouter not configured - returning original text for ${targetLanguage}`);
        return text;
      }

      if (targetLanguage === 'en' || targetLanguage === 'us') {
        return text; // Already in English
      }

      const response = await axios.post(
        'https://openrouter.ai/api/v1/chat/completions',
        {
          model: 'openai/gpt-3.5-turbo', // Free model via OpenRouter
          messages: [
            {
              role: 'system',
              content: `You are a professional translator. Translate the following text to ${SUPPORTED_LANGUAGES[targetLanguage]}. Return ONLY the translated text, nothing else.`,
            },
            {
              role: 'user',
              content: text,
            },
          ],
          temperature: 0.3,
          max_tokens: 1000,
        },
        {
          headers: {
            Authorization: `Bearer ${this.openrouterKey}`,
            'HTTP-Referer': 'https://bigstarzapp.com',
            'X-Title': 'Big Starz App',
          },
        }
      );

      const translation = response.data.choices[0]?.message?.content || text;
      return translation.trim();
    } catch (error) {
      console.error(`OpenRouter translation error for ${targetLanguage}:`, error);
      return text; // Fallback to original text
    }
  }

  /**
   * Translate text using OpenAI directly
   */
  async translateTextOpenAI(text: string, targetLanguage: SupportedLanguage): Promise<string> {
    try {
      if (!this.openaiKey) {
        console.warn(`OpenAI not configured - returning original text for ${targetLanguage}`);
        return text;
      }

      if (targetLanguage === 'en' || targetLanguage === 'us') {
        return text; // Already in English
      }

      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: `You are a professional translator. Translate the following text to ${SUPPORTED_LANGUAGES[targetLanguage]}. Return ONLY the translated text, nothing else.`,
            },
            {
              role: 'user',
              content: text,
            },
          ],
          temperature: 0.3,
          max_tokens: 1000,
        },
        {
          headers: {
            Authorization: `Bearer ${this.openaiKey}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const translation = response.data.choices[0]?.message?.content || text;
      return translation.trim();
    } catch (error) {
      console.error(`OpenAI translation error for ${targetLanguage}:`, error);
      return text; // Fallback to original text
    }
  }

  /**
   * Translate text (tries OpenRouter first, falls back to OpenAI)
   */
  async translateText(text: string, targetLanguage: SupportedLanguage): Promise<string> {
    if (this.openrouterKey) {
      return this.translateTextOpenRouter(text, targetLanguage);
    } else if (this.openaiKey) {
      return this.translateTextOpenAI(text, targetLanguage);
    } else {
      console.warn(`No translation API configured - returning original text for ${targetLanguage}`);
      return text;
    }
  }

  /**
   * Translate text to multiple languages in parallel
   */
  async translateToMultiple(
    text: string,
    languages: SupportedLanguage[]
  ): Promise<Record<SupportedLanguage, string>> {
    const promises = languages.map((lang) =>
      this.translateText(text, lang).then((translation) => ({ lang, translation }))
    );

    const results = await Promise.all(promises);
    const translations: Record<string, string> = {};

    results.forEach(({ lang, translation }) => {
      translations[lang] = translation;
    });

    return translations as Record<SupportedLanguage, string>;
  }

  /**
   * Translate an object's string values recursively
   */
  async translateObject<T extends Record<string, any>>(
    obj: T,
    targetLanguage: SupportedLanguage
  ): Promise<T> {
    const translated: Record<string, any> = {};

    for (const [key, value] of Object.entries(obj)) {
      if (typeof value === 'string') {
        translated[key] = await this.translateText(value, targetLanguage);
      } else if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        translated[key] = await this.translateObject(value, targetLanguage);
      } else if (Array.isArray(value)) {
        translated[key] = await Promise.all(
          value.map((item) =>
            typeof item === 'string'
              ? this.translateText(item, targetLanguage)
              : typeof item === 'object' && item !== null
                ? this.translateObject(item, targetLanguage)
                : item
          )
        );
      } else {
        translated[key] = value;
      }
    }

    return translated as T;
  }

  /**
   * Batch translate multiple texts
   */
  async batchTranslate(
    texts: string[],
    targetLanguage: SupportedLanguage
  ): Promise<string[]> {
    const promises = texts.map((text) => this.translateText(text, targetLanguage));
    return Promise.all(promises);
  }
}

// Singleton instance
export const openRouterTranslator = new OpenRouterTranslator();
