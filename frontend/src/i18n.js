import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import enTranslations from './locales/en/translation.json';
import ruTranslations from './locales/ru/translation.json';

const getDefaultLanguage = () => {
    const savedLanguage = localStorage.getItem('language');
    if (savedLanguage) {
        return savedLanguage;
    }

    const systemLanguage = navigator.language || navigator.userLanguage;
    return systemLanguage.startsWith('ru') ? 'ru' : 'en';
};

const language = getDefaultLanguage();

i18n.use(initReactI18next).init({
    resources: {
        en: {
            translation: enTranslations,
        },
        ru: {
            translation: ruTranslations,
        },
    },
    lng: language,
    fallbackLng: 'en',
    interpolation: {
        escapeValue: false,
    },
});

export default i18n;
