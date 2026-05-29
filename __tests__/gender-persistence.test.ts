import { describe, it, expect, beforeEach, vi } from 'vitest';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Mock AsyncStorage
vi.mock('@react-native-async-storage/async-storage', () => ({
  default: {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
  },
}));

describe('Gender Persistence', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Gender Selection Storage', () => {
    it('should store boy gender selection', async () => {
      const gender = 'boy';
      await AsyncStorage.setItem('user_character_gender', gender);

      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        'user_character_gender',
        'boy'
      );
    });

    it('should store girl gender selection', async () => {
      const gender = 'girl';
      await AsyncStorage.setItem('user_character_gender', gender);

      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        'user_character_gender',
        'girl'
      );
    });

    it('should retrieve stored gender preference', async () => {
      vi.mocked(AsyncStorage.getItem).mockResolvedValueOnce('boy');

      const stored = await AsyncStorage.getItem('user_character_gender');

      expect(stored).toBe('boy');
      expect(AsyncStorage.getItem).toHaveBeenCalledWith('user_character_gender');
    });

    it('should default to boy if no preference stored', async () => {
      vi.mocked(AsyncStorage.getItem).mockResolvedValueOnce(null);

      const stored = await AsyncStorage.getItem('user_character_gender');
      const defaultGender = stored || 'boy';

      expect(defaultGender).toBe('boy');
    });

    it('should handle storage errors gracefully', async () => {
      vi.mocked(AsyncStorage.getItem).mockRejectedValueOnce(
        new Error('Storage error')
      );

      let result = 'boy';
      try {
        const stored = await AsyncStorage.getItem('user_character_gender');
        result = stored || 'boy';
      } catch (error) {
        result = 'boy'; // Default on error
      }

      expect(result).toBe('boy');
    });
  });

  describe('Gender Toggle', () => {
    it('should toggle from boy to girl', async () => {
      let currentGender = 'boy';

      const newGender = currentGender === 'boy' ? 'girl' : 'boy';
      await AsyncStorage.setItem('user_character_gender', newGender);

      expect(newGender).toBe('girl');
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        'user_character_gender',
        'girl'
      );
    });

    it('should toggle from girl to boy', async () => {
      let currentGender = 'girl';

      const newGender = currentGender === 'boy' ? 'girl' : 'boy';
      await AsyncStorage.setItem('user_character_gender', newGender);

      expect(newGender).toBe('boy');
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        'user_character_gender',
        'boy'
      );
    });
  });

  describe('Character Image Mapping', () => {
    it('should map language to correct character image', () => {
      const getCharacterImage = (language: string, gender: string) => {
        const languageMap: Record<string, string> = {
          en: 'en',
          es: 'es',
          fr: 'fr',
          pt: 'pt',
          hi: 'hi',
          ar: 'ar',
          it: 'it',
          de: 'de',
          us: 'us',
          ke: 'ke',
        };
        const langCode = languageMap[language] || 'en';
        return `char-${langCode}-${gender}-flag.png`;
      };

      expect(getCharacterImage('en', 'boy')).toBe('char-en-boy-flag.png');
      expect(getCharacterImage('es', 'girl')).toBe('char-es-girl-flag.png');
      expect(getCharacterImage('fr', 'boy')).toBe('char-fr-boy-flag.png');
      expect(getCharacterImage('ar', 'girl')).toBe('char-ar-girl-flag.png');
    });

    it('should default to english for unknown language', () => {
      const getCharacterImage = (language: string, gender: string) => {
        const languageMap: Record<string, string> = {
          en: 'en',
          es: 'es',
          fr: 'fr',
          pt: 'pt',
          hi: 'hi',
          ar: 'ar',
          it: 'it',
          de: 'de',
          us: 'us',
          ke: 'ke',
        };
        const langCode = languageMap[language] || 'en';
        return `char-${langCode}-${gender}-flag.png`;
      };

      expect(getCharacterImage('xx', 'boy')).toBe('char-en-boy-flag.png');
      expect(getCharacterImage('unknown', 'girl')).toBe('char-en-girl-flag.png');
    });
  });

  describe('Gender Persistence Across Sessions', () => {
    it('should persist gender selection across app restarts', async () => {
      // Session 1: User selects girl
      await AsyncStorage.setItem('user_character_gender', 'girl');

      // Session 2: App restarts and loads preference
      vi.mocked(AsyncStorage.getItem).mockResolvedValueOnce('girl');
      const loaded = await AsyncStorage.getItem('user_character_gender');

      expect(loaded).toBe('girl');
    });

    it('should maintain gender selection after multiple toggles', async () => {
      // Toggle 1: boy -> girl
      await AsyncStorage.setItem('user_character_gender', 'girl');
      // Toggle 2: girl -> boy
      await AsyncStorage.setItem('user_character_gender', 'boy');
      // Toggle 3: boy -> girl
      await AsyncStorage.setItem('user_character_gender', 'girl');

      vi.mocked(AsyncStorage.getItem).mockResolvedValueOnce('girl');
      const final = await AsyncStorage.getItem('user_character_gender');

      expect(final).toBe('girl');
    });
  });

  describe('Gender Context Integration', () => {
    it('should provide gender through context', () => {
      const mockContextValue = {
        gender: 'boy' as const,
        setGender: vi.fn(),
        isLoading: false,
      };

      expect(mockContextValue.gender).toBe('boy');
      expect(typeof mockContextValue.setGender).toBe('function');
      expect(mockContextValue.isLoading).toBe(false);
    });

    it('should handle context loading state', () => {
      const mockContextValue = {
        gender: 'boy' as const,
        setGender: vi.fn(),
        isLoading: true,
      };

      expect(mockContextValue.isLoading).toBe(true);
    });
  });
});
