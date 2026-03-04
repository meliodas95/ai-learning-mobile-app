import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { createMMKV } from 'react-native-mmkv';
import en from './locales/en';
import vi from './locales/vi';

const storage = createMMKV({ id: 'settings' });
const savedLocale = storage.getString('locale') ?? 'vi';

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    vi: { translation: vi },
  },
  lng: savedLocale,
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
});

export default i18n;
