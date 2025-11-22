import { create } from 'zustand';
import { persist, PersistStorage } from 'zustand/middleware';
import { SettingsState, Theme, Language } from '@bharat-low-oil/shared-types';

export interface SettingsActions {
  setTheme: (theme: Theme) => void;
  setLanguage: (language: Language) => void;
  setNotificationsEnabled: (enabled: boolean) => void;
  setEmailNotificationsEnabled: (enabled: boolean) => void;
  setDailyRemindersEnabled: (enabled: boolean) => void;
  setWeeklyReportsEnabled: (enabled: boolean) => void;
}

export type SettingsStore = SettingsState & SettingsActions;

export const createSettingsStore = (
  persistStorage?: PersistStorage<SettingsStore>,
  onThemeChange?: (theme: Theme) => void,
  onLanguageChange?: (language: Language) => void
) => {
  return create<SettingsStore>()(
    persist(
      (set) => ({
        theme: 'auto',
        language: 'en',
        notificationsEnabled: true,
        emailNotificationsEnabled: true,
        dailyRemindersEnabled: true,
        weeklyReportsEnabled: true,

        setTheme: (theme) => {
          set({ theme });
          if (onThemeChange) onThemeChange(theme);
        },

        setLanguage: (language) => {
          set({ language });
          if (onLanguageChange) onLanguageChange(language);
        },

        setNotificationsEnabled: (enabled) => set({ notificationsEnabled: enabled }),
        setEmailNotificationsEnabled: (enabled) => set({ emailNotificationsEnabled: enabled }),
        setDailyRemindersEnabled: (enabled) => set({ dailyRemindersEnabled: enabled }),
        setWeeklyReportsEnabled: (enabled) => set({ weeklyReportsEnabled: enabled }),
      }),
      {
        name: 'settings-storage',
        storage: persistStorage,
      }
    )
  );
};
