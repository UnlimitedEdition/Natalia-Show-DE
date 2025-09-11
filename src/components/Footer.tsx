import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/components/LanguageProvider'
import { useFooterTranslations } from '@/hooks/useHeaderFooterTranslations'
import { supabase } from '@/integrations/supabase/client'

const Footer = () => {
  const { currentLanguage } = useLanguage()
  const { translations, isLoading, loadTranslations } = useFooterTranslations()
  const [contactInfo, setContactInfo] = useState({
    email: 'info@natalia-show.com',
    phone: '+381 11 123 4567'
  })

  // Load translations when language changes
  React.useEffect(() => {
    loadTranslations(currentLanguage)
  }, [currentLanguage, loadTranslations])

  // Load contact information from database
  useEffect(() => {
    const fetchContactInfo = async () => {
      try {
        const { data, error } = await supabase
          .from('content')
          .select('content_key, content_value')
          .eq('section_key', 'contact')
          .eq('language_code', currentLanguage)
          .in('content_key', ['contactEmail', 'contactPhone'])

        if (error) {
          console.error('Error fetching contact info:', error)
          return
        }

        const contactData: Record<string, string> = {}
        data.forEach(item => {
          contactData[item.content_key] = item.content_value
        })

        setContactInfo({
          email: contactData.contactEmail || 'info@nasemisije.com',
          phone: contactData.contactPhone || '+381 11 123 4567'
        })
      } catch (error) {
        console.error('Error:', error)
      }
    }

    fetchContactInfo()
  }, [currentLanguage])

  // Show loading state
  if (isLoading) {
    return (
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="h-6 w-48 bg-gray-700 animate-pulse rounded mb-4"></div>
              <div className="h-4 w-64 bg-gray-700 animate-pulse rounded"></div>
            </div>
            <div>
              <div className="h-5 w-24 bg-gray-700 animate-pulse rounded mb-4"></div>
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-4 w-32 bg-gray-700 animate-pulse rounded mb-2"></div>
              ))}
            </div>
            <div>
              <div className="h-5 w-24 bg-gray-700 animate-pulse rounded mb-4"></div>
              <div className="h-10 w-40 bg-gray-700 animate-pulse rounded"></div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center">
            <div className="h-4 w-64 bg-gray-700 animate-pulse rounded mx-auto"></div>
          </div>
        </div>
      </footer>
    )
  }

  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <h3 className="text-2xl font-bold mb-4">Natalia Show</h3>
            <p className="text-gray-400">
              {translations.description}
            </p>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">{translations.sectionsTitle}</h4>
            <ul className="space-y-2">
              <li>
                <a 
                  href="#"
                  onClick={(e) => {
                    e.preventDefault()
                    document.getElementById('hero')?.scrollIntoView({ behavior: 'smooth' })
                  }}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  {translations.podcastSection}
                </a>
              </li>
              <li>
                <a 
                  href="#"
                  onClick={(e) => {
                    e.preventDefault()
                    document.getElementById('cultural')?.scrollIntoView({ behavior: 'smooth' })
                  }}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  {translations.culturalSection}
                </a>
              </li>
              <li>
                <a 
                  href="#"
                  onClick={(e) => {
                    e.preventDefault()
                    document.getElementById('kitchen')?.scrollIntoView({ behavior: 'smooth' })
                  }}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  {translations.kitchenSection}
                </a>
              </li>
              <li>
                <a 
                  href="#"
                  onClick={(e) => {
                    e.preventDefault()
                    document.getElementById('diaspora')?.scrollIntoView({ behavior: 'smooth' })
                  }}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  {translations.diasporaSection}
                </a>
              </li>
              <li>
                <a 
                  href="#"
                  onClick={(e) => {
                    e.preventDefault()
                    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })
                  }}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  {translations.contactSection}
                </a>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">{translations.contactSection}</h4>
            <div className="text-gray-400">
              <p>{translations.emailLabel}: {contactInfo.email}</p>
              <p>{translations.phoneLabel}: {contactInfo.phone}</p>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>
            {translations.copyright.replace('{year}', new Date().getFullYear().toString())}
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer