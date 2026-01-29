import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './locales/en.json';
import id from './locales/id.json';
import ar from './locales/ar.json';
import zh from './locales/zh.json';

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    id: { translation: id },
    ar: { translation: ar },
    zh: { translation: zh }
  },
  lng: 'id',
  fallbackLng: 'en',
  interpolation: { escapeValue: false }
});

export default i18n;