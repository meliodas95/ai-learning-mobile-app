import { create } from 'zustand';
import { MMKV } from 'react-native-mmkv';

const storage = new MMKV();

interface SettingsState {
  locale: 'vi' | 'en';
  showTranslation: boolean;
  autoPlay: boolean;

  setLocale: (locale: 'vi' | 'en') => void;
  setShowTranslation: (show: boolean) => void;
  setAutoPlay: (auto: boolean) => void;
}

export const useSettingsStore = create<SettingsState>((set) => ({
  locale: (storage.getString('locale') as 'vi' | 'en') ?? 'vi',
  showTranslation: storage.getBoolean('showTranslation') ?? true,
  autoPlay: storage.getBoolean('autoPlay') ?? false,

  setLocale: (locale) => {
    storage.set('locale', locale);
    set({ locale });
  },

  setShowTranslation: (showTranslation) => {
    storage.set('showTranslation', showTranslation);
    set({ showTranslation });
  },

  setAutoPlay: (autoPlay) => {
    storage.set('autoPlay', autoPlay);
    set({ autoPlay });
  },
}));
