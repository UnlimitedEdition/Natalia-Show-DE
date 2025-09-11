import { useState, useEffect } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { useLanguage } from '@/components/LanguageProvider'
import { translationService } from '@/services/translationService'

const Hero = () => {
  const { currentLanguage, loadSectionTranslations } = useLanguage()
  const [heroContent, setHeroContent] = useState<any>(null)
  const [content, setContent] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchHeroContent = async () => {
      console.log('Fetching hero content...')
      
      try {
        const { data, error } = await supabase
          .from('page_sections')
          .select('id, section_key, background_image_url')
          .eq('section_key', 'hero')
          .single()
          
        if (error) throw error
        
        console.log('Hero section data:', data)
        setHeroContent(data)
      } catch (error) {
        console.error('Error fetching hero content:', error)
      }
    }
    
    fetchHeroContent()
    
    // Real-time subscription
    const channel = supabase
      .channel('hero-channel')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'page_sections',
          filter: 'section_key=eq.hero'
        },
        (payload) => {
          console.log('Hero data changed:', payload)
          if (payload.new) {
            setHeroContent(payload.new)
          }
        }
      )
      .subscribe((status) => {
        console.log('Hero realtime subscription status:', status)
      })
      
    return () => {
      console.log('Removing hero channel')
      supabase.removeChannel(channel)
    }
  }, [])
  
  // Load translations when language or hero content changes
  useEffect(() => {
    const loadContent = async () => {
      if (heroContent) {
        setIsLoading(true)
        try {
          const translations = await loadSectionTranslations('hero', currentLanguage)
          setContent(translations)
        } catch (error) {
          console.error('Error loading translations:', error)
        } finally {
          setIsLoading(false)
        }
      }
    }
    
    loadContent()
  }, [heroContent, currentLanguage, loadSectionTranslations])

  if (isLoading) {
    return (
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gray-200 animate-pulse"></div>
        <div className="relative z-10 text-center px-4">
          <div className="h-16 bg-gray-300 animate-pulse mb-4 rounded"></div>
          <div className="h-8 bg-gray-300 animate-pulse mb-6 rounded"></div>
          <div className="h-6 bg-gray-300 animate-pulse w-2/3 mx-auto rounded"></div>
        </div>
      </section>
    )
  }

  // Safe access to content properties
  const title = (content && content.title) || 'Добродошли у Наш Емисије'
  const subtitle = (content && content.subtitle) || 'Откријте свет нашег емисија и прича'
  const description = (content && content.description) || 'Причамо приче које би требало да се чују, са људима који би требало да их чују'

  return (
    <section 
      id="hero"
      className="relative h-screen flex items-center justify-center overflow-hidden"
      style={{
        backgroundImage: heroContent?.background_image_url 
          ? `url(${heroContent.background_image_url})` 
          : 'url(https://images.unsplash.com/photo-1556761175-12941836ea3d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80)',
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>
      <div className="relative z-10 text-center px-4 text-white">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">
          {title}
        </h1>
        <h2 className="text-xl md:text-2xl font-light mb-6">
          {subtitle}
        </h2>
        <p className="text-lg md:text-xl max-w-2xl mx-auto">
          {description}
        </p>
      </div>
    </section>
  )
}

export default Hero