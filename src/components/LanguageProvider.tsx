import React, { createContext, useState, useEffect, useContext } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { Language } from '@/integrations/supabase/types'
import { translationService } from '@/services/translationService'

interface LanguageContextType {
  currentLanguage: string
  setCurrentLanguage: (code: string) => void
  languages: Language[]
  isLoading: boolean
  // Add translation functions to the context
  loadSectionTranslations: (sectionKey: string, languageCode: string) => Promise<Record<string, string>>
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export { LanguageContext }

export const useLanguage = () => {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}

const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState('sr')
  const [languages, setLanguages] = useState<Language[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Function to get user's country using a geolocation service with timeout
  const getUserCountry = async (): Promise<string | null> => {
    try {
      // Create a promise that rejects after a timeout
      const timeout = (ms: number) => new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Timeout')), ms)
      );
      
      // Try to get country from a free geolocation service with 3 second timeout
      const responsePromise = fetch('https://ipapi.co/json/')
      const response = await Promise.race([
        responsePromise,
        timeout(3000)
      ]) as Response;
      
      const data = await response.json();
      return data.country_code || null;
    } catch (error) {
      console.warn('Could not determine user country from IP:', error);
      return null;
    }
  }

  // Function to map country codes to preferred languages
  const getLanguageForCountry = (countryCode: string): string | undefined => {
    // Map regions to preferred languages
    const regionLanguageMap: Record<string, string> = {
      'RS': 'sr', // Serbia
      'BA': 'sr', // Bosnia and Herzegovina
      'ME': 'sr', // Montenegro
      'HR': 'sr', // Croatia (some regions)
      'MK': 'sr', // North Macedonia
      'SI': 'sr', // Slovenia (some regions)
      'DE': 'de', // Germany
      'AT': 'de', // Austria
      'CH': 'de', // Switzerland (German-speaking)
      'US': 'en', // United States
      'GB': 'en', // United Kingdom
      'CA': 'en', // Canada (English-speaking)
      'AU': 'en', // Australia
      'NZ': 'en', // New Zealand
    }
    
    return regionLanguageMap[countryCode]
  }

  useEffect(() => {
    const fetchLanguages = async () => {
      try {
        const { data, error } = await supabase
          .from('languages')
          .select('*')
          .eq('is_active', true)
        
        if (error) throw error
        
        if (data) {
          setLanguages(data)
          
          // Determine language based on priority:
          // 1. URL parameter (?lang=)
          // 2. localStorage preference
          // 3. Geolocation/region detection
          // 4. Browser language
          // 5. Default language from database
          // 6. Fallback to Serbian
          
          const urlParams = new URLSearchParams(window.location.search)
          const urlLanguage = urlParams.get('lang')
          
          if (urlLanguage && data.some((lang: Language) => lang.code === urlLanguage)) {
            setCurrentLanguage(urlLanguage)
            localStorage.setItem('preferredLanguage', urlLanguage)
            return
          }
          
          const storedLanguage = localStorage.getItem('preferredLanguage')
          if (storedLanguage && data.some((lang: Language) => lang.code === storedLanguage)) {
            setCurrentLanguage(storedLanguage)
            return
          }
          
          // Detect language based on region
          const regionLanguage = detectLanguageByRegion()
          if (regionLanguage && data.some((lang: Language) => lang.code === regionLanguage)) {
            setCurrentLanguage(regionLanguage)
            localStorage.setItem('preferredLanguage', regionLanguage)
            return
          }
          
          const browserLanguage = navigator.language.split('-')[0]
          if (browserLanguage && data.some((lang: Language) => lang.code === browserLanguage)) {
            setCurrentLanguage(browserLanguage)
            localStorage.setItem('preferredLanguage', browserLanguage)
            return
          }
          
          const defaultLanguage = data.find((lang: Language) => lang.is_default)
          if (defaultLanguage) {
            setCurrentLanguage(defaultLanguage.code)
            localStorage.setItem('preferredLanguage', defaultLanguage.code)
            return
          }
          
          // Fallback to Serbian
          setCurrentLanguage('sr')
          localStorage.setItem('preferredLanguage', 'sr')
        }
      } catch (error) {
        console.error('Error fetching languages:', error)
        // Fallback to Serbian in case of error
        setCurrentLanguage('sr')
        localStorage.setItem('preferredLanguage', 'sr')
      } finally {
        setIsLoading(false)
      }
    }

    fetchLanguages()
  }, [])

  // Function to load translations for a specific section
  const loadSectionTranslations = async (sectionKey: string, languageCode: string): Promise<Record<string, string>> => {
    return await translationService.getSectionContent(sectionKey, languageCode)
  }

  // Update language and store preference
  const handleSetCurrentLanguage = (code: string) => {
    setCurrentLanguage(code)
    localStorage.setItem('preferredLanguage', code)
  }

  return (
    <LanguageContext.Provider value={{ 
      currentLanguage, 
      setCurrentLanguage: handleSetCurrentLanguage,
      languages, 
      isLoading,
      loadSectionTranslations
    }}>
      {children}
    </LanguageContext.Provider>
  )
}

export default LanguageProvider