
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
// For a real app, you might use i18next-http-backend to load translations from a server
// import Backend from 'i18next-http-backend';
// Or i18next-browser-languagedetector to detect user language
// import LanguageDetector from 'i18next-browser-languagedetector';

// CRITICAL: Ensure these paths are relative (start with './') from 'src/i18n.ts' to 'src/locales/...'
import enTranslation from './locales/en/translation.json';
import trTranslation from './locales/tr/translation.json';

const resources = {
  en: {
    translation: enTranslation,
  },
  tr: {
    translation: trTranslation,
  },
};

i18n
  // .use(Backend) // if you want to load translations from a backend
  // .use(LanguageDetector) // if you want to detect user language
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    fallbackLng: 'en', // use English if detected language is not available
    lng: typeof window !== 'undefined' ? localStorage.getItem('i18nextLng') || (navigator.language ? navigator.language.split('-')[0] : '') || 'en' : 'en', // default language
    debug: false, // Set to true for development logging, false for production
    interpolation: {
      escapeValue: false, // react already safes from xss
    },
    // react: {
    //   useSuspense: true, // Recommended for new projects, ensure Suspense component wraps App
    // }
  });

export default i18n;