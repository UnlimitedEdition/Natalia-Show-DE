import React from 'react'
import { useLanguage } from '@/components/LanguageProvider'

const LanguageSelector = () => {
  const { currentLanguage, setCurrentLanguage } = useLanguage()

  // Define translations for the "Language" label
  const languageLabelTranslations = {
    sr: 'Jezik:',
    en: 'Language:',
    de: 'Sprache:'
  }

  // Get the appropriate translation based on current language
  const languageLabel = languageLabelTranslations[currentLanguage as keyof typeof languageLabelTranslations] || languageLabelTranslations.sr

  return (
    <div className="flex items-center space-x-2">
      <span className="text-white text-sm">{languageLabel}</span>
      <select
        value={currentLanguage}
        onChange={(e) => setCurrentLanguage(e.target.value)}
        className="bg-white/20 text-gray-800 px-2 py-1 rounded text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
        aria-label={languageLabel}
      >
        <option value="sr">Srpski</option>
        <option value="en">English</option>
        <option value="de">Deutsch</option>
      </select>
    </div>
  )
}

export default LanguageSelector