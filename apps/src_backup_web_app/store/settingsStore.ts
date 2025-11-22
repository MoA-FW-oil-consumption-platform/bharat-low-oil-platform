import { createSettingsStore } from '@bharat-low-oil/store';
import { createJSONStorage } from 'zustand/middleware';
import { Theme, Language } from '@bharat-low-oil/shared-types';

const onThemeChange = (theme: Theme) => {
  if (typeof window !== 'undefined') {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else if (theme === 'light') {
      root.classList.remove('dark');
    } else {
      // Auto mode - use system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (prefersDark) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    }
  }
};

const onLanguageChange = (language: Language) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('language', language);
  }
};

export const useSettingsStore = createSettingsStore(
  createJSONStorage(() => localStorage),
  onThemeChange,
  onLanguageChange
);

