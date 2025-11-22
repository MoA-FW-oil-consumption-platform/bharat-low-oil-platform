import { createSettingsStore } from '@bharat-low-oil/store';
import { createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Language } from '@bharat-low-oil/shared-types';

const onLanguageChange = (language: Language) => {
  AsyncStorage.setItem('language', language);
};

export const useSettingsStore = createSettingsStore(
  createJSONStorage(() => AsyncStorage),
  undefined,
  onLanguageChange
);

