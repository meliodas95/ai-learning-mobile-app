import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DEFAULT_LOCALE } from '@/src/constants';

interface SettingsState {
  locale: 'vi' | 'en';
  showTranslation: boolean;
  autoPlay: boolean;

  setLocale: (locale: 'vi' | 'en') => void;
  setShowTranslation: (show: boolean) => void;
  setAutoPlay: (auto: boolean) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      locale: DEFAULT_LOCALE,
      showTranslation: true,
      autoPlay: false,

      setLocale: (locale) => set({ locale }),
      setShowTranslation: (showTranslation) => set({ showTranslation }),
      setAutoPlay: (autoPlay) => set({ autoPlay }),
    }),
    {
      name: 'settings',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        locale: state.locale,
        showTranslation: state.showTranslation,
        autoPlay: state.autoPlay,
      }),
    },
  ),
);
