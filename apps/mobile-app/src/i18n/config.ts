import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';
import AsyncStorage from '@react-native-async-storage/async-storage';

import en from './locales/en.json';
import hi from './locales/hi.json';
import ta from './locales/ta.json';

const LANGUAGE_KEY = 'user_language';

const resources = {
  en: { translation: en },
  hi: { translation: hi },
  ta: { translation: ta },
};

// Get stored language or fall back to device language
const initI18n = async () => {
  let savedLanguage = await AsyncStorage.getItem(LANGUAGE_KEY);
  
  if (!savedLanguage) {
    const deviceLanguage = Localization.getLocales()[0].languageCode ?? 'en';
    savedLanguage = ['en', 'hi', 'ta'].includes(deviceLanguage) ? deviceLanguage : 'en';
  }

  i18n
    .use(initReactI18next)
    .init({
      resources,
      lng: savedLanguage ?? 'en',
      fallbackLng: 'en',
      interpolation: {
        escapeValue: false,
      },
    });
};

initI18n();

export default i18n;

export const changeLanguage = async (lang: string) => {
  await AsyncStorage.setItem(LANGUAGE_KEY, lang);
  i18n.changeLanguage(lang);
};
