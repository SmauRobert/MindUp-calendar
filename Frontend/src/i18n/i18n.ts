import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import en from './en.json'
import ro from './ro.json'

const resources = {
    en: { translation: en },
    ro: { translation: ro },
}

const storedLang = localStorage.getItem('appLanguage') || 'en'

i18n.use(initReactI18next).init({
    resources,
    lng: storedLang,
    fallbackLng: 'en',
    interpolation: {
        escapeValue: false,
    },
})

export default i18n
