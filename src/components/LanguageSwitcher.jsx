// components/LanguageSwitcher.jsx
import { useTranslation } from 'react-i18next'

export default function LanguageSwitcher() {
  const { i18n } = useTranslation()

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'ar' : 'en'
    i18n.changeLanguage(newLang)
    document.documentElement.dir = newLang === 'ar' ? 'rtl' : 'ltr'
  }

  return (
    <button
      onClick={toggleLanguage}
      className="fixed top-4 right-4 z-50 bg-indigo-600 hover:bg-indigo-700 text-white text-sm px-3 py-1 rounded shadow transition"
    >
      {i18n.language === 'ar' ? 'EN' : 'ع'}
    </button>
  )
}
