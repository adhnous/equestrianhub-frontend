import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

export default function LanguageSwitcher() {
  const { i18n } = useTranslation()
  const [open, setOpen] = useState(false)

  const languages = [
    { code: 'en', label: 'English', flag: '🇺🇸' },
    { code: 'ar', label: 'العربية', flag: '🇸🇦' }
  ]

  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang)
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr'
    localStorage.setItem('lang', lang)
    setOpen(false)
  }

  useEffect(() => {
    const savedLang = localStorage.getItem('lang') || 'en'
    i18n.changeLanguage(savedLang)
    document.documentElement.dir = savedLang === 'ar' ? 'rtl' : 'ltr'
  }, [])

  return (
    <div className="relative inline-block text-left z-50">
      <button
        onClick={() => setOpen(!open)}
        className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition flex items-center gap-2"
      >
        🌐 {i18n.language === 'en' ? 'English' : 'العربية'}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-40 rounded-lg shadow-lg bg-white ring-1 ring-black/5">
          <div className="py-1">
            {languages.map(lang => (
              <button
                key={lang.code}
                onClick={() => changeLanguage(lang.code)}
                className="w-full flex items-center justify-between px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                <span>{lang.flag}</span> <span>{lang.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
