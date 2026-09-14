import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  INDIAN_LANGUAGES,
  DEFAULT_LANGUAGE,
  getLanguageByCode,
  getLanguageByName,
  LanguageDefinition,
} from '@/constants/languages';
import { getTranslations, TranslationStrings } from '@/constants/translations';
import { speakText, stopSpeech } from '@/services/tts';

const STORAGE_KEY = '@karigar_selected_language';

interface LanguageContextType {
  currentLanguage: LanguageDefinition;
  setLanguage: (lang: LanguageDefinition) => Promise<void>;
  setLanguageByCode: (code: string) => Promise<void>;
  setLanguageByName: (name: string) => Promise<void>;
  t: TranslationStrings;
  availableLanguages: LanguageDefinition[];
  speakHelp: (textOrKey: string) => Promise<void>;
  stopAudio: () => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentLanguage, setCurrentLanguageState] = useState<LanguageDefinition>(DEFAULT_LANGUAGE);

  // Load saved preference on mount
  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((savedCode) => {
        if (savedCode) {
          const matched = getLanguageByCode(savedCode);
          setCurrentLanguageState(matched);
        }
      })
      .catch((err) => {
        console.log('[LanguageContext] Failed to load language preference', err);
      });
  }, []);

  const setLanguage = async (lang: LanguageDefinition) => {
    setCurrentLanguageState(lang);
    try {
      await AsyncStorage.setItem(STORAGE_KEY, lang.code);
    } catch (err) {
      console.log('[LanguageContext] Failed to save language preference', err);
    }
  };

  const setLanguageByCode = async (code: string) => {
    const lang = getLanguageByCode(code);
    await setLanguage(lang);
  };

  const setLanguageByName = async (name: string) => {
    const lang = getLanguageByName(name);
    await setLanguage(lang);
  };

  const t = useMemo(() => {
    return getTranslations(currentLanguage.code);
  }, [currentLanguage.code]);

  const speakHelp = async (textOrKey: string) => {
    // If textOrKey matches a key in t, speak that string, otherwise speak the raw text
    const message = (t as unknown as Record<string, string>)[textOrKey] ?? textOrKey;
    await speakText(message, currentLanguage.nativeName);
  };

  const stopAudio = () => {
    stopSpeech();
  };

  return (
    <LanguageContext.Provider
      value={{
        currentLanguage,
        setLanguage,
        setLanguageByCode,
        setLanguageByName,
        t,
        availableLanguages: INDIAN_LANGUAGES,
        speakHelp,
        stopAudio,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export function useLanguage(): LanguageContextType {
  const context = useContext(LanguageContext);
  if (!context) {
    // Fallback if accessed outside provider
    return {
      currentLanguage: DEFAULT_LANGUAGE,
      setLanguage: async () => {},
      setLanguageByCode: async () => {},
      setLanguageByName: async () => {},
      t: getTranslations('hi'),
      availableLanguages: INDIAN_LANGUAGES,
      speakHelp: async () => {},
      stopAudio: () => {},
    };
  }
  return context;
}
