import React, { useEffect, useState, useCallback } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { useLanguage } from '@/components/LanguageProvider'
import { Tables } from '@/integrations/supabase/types'

interface ContentItem {
  id?: string;
  media_id: string;
  language_code: string;
  content_key: string;
  content_value: string;
}

interface ExtendedMedia extends Tables<'media'> {
  content?: Record<string, Record<string, string>>;
}

const CulturalSection = () => {
  const { currentLanguage } = useLanguage()
  const [culturalMedia, setCulturalMedia] = useState<ExtendedMedia[]>([])
  const [backgroundImage, setBackgroundImage] = useState('')
  const [backgroundVideo, setBackgroundVideo] = useState('')
  const [title, setTitle] = useState('')
  const [subtitle, setSubtitle] = useState('')
  const [description, setDescription] = useState('')

  const fetchCulturalContent = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('page_sections')
        .select(`
          id,
          section_key,
          background_image_url
        `)
        .eq('section_key', 'cultural')
        .single()
      
      if (error) {
        console.error('Error fetching cultural content:', error)
        return
      }
      
      if (data) {
        setBackgroundImage(data.background_image_url || '')
      }

      // Fetch translated content separately
      const { data: contentData } = await supabase
        .from('content')
        .select('language_code, content_key, content_value')
        .eq('section_key', 'cultural');
      
      // Process content data
      if (contentData) {
        const contentMap: Record<string, Record<string, string>> = {};
        contentData.forEach(item => {
          if (!contentMap[item.language_code]) {
            contentMap[item.language_code] = {};
          }
          contentMap[item.language_code][item.content_key] = item.content_value;
        });
        
        // Set content for current language
        const currentLangContent = contentMap[currentLanguage] || contentMap['sr'] || {};
        setTitle(currentLangContent['title'] || '');
        setSubtitle(currentLangContent['subtitle'] || '');
        setDescription(currentLangContent['description'] || '');
      }
    } catch (error) {
      console.error('Error fetching cultural content:', error)
    }
  }, [currentLanguage])

  const fetchCulturalMedia = useCallback(async () => {
    try {
      const { data: mediaData, error: mediaError } = await supabase
        .from('media')
        .select(`
          id,
          section_key,
          media_type,
          file_url,
          social_url,
          thumbnail_url,
          display_order,
          is_active,
          created_at,
          updated_at,
          title,
          description,
          language_code
        `)
        .eq('section_key', 'cultural')
        .eq('is_active', true)
        .order('display_order')
      
      if (mediaError) {
        console.error('Error fetching cultural media:', mediaError)
        return
      }
      
      if (mediaData) {
        // Get media IDs for fetching content
        const mediaIds = mediaData.map(media => media.id);
        
        // Fetch content for these media items
        const { data: contentData, error: contentError } = await supabase
          .from('content')
          .select('media_id, language_code, content_key, content_value')
          .in('media_id', mediaIds);
        
        if (contentError) {
          console.error('Error fetching cultural media content:', contentError)
          return
        }
        
        // Combine media data with content
        const combinedData = mediaData.map(mediaItem => {
          // Filter content for this specific media item
          const itemContent = contentData?.filter(content => content.media_id === mediaItem.id) || [];
          
          // Transform content array into object structure
          const contentObj: Record<string, any> = {};
          itemContent.forEach(contentItem => {
            if (!contentObj[contentItem.language_code]) {
              contentObj[contentItem.language_code] = {};
            }
            contentObj[contentItem.language_code][contentItem.content_key] = contentItem.content_value;
          });
          
          return {
            ...mediaItem,
            content: contentObj
          };
        });
        
        setCulturalMedia(combinedData);
      }
    } catch (error) {
      console.error('Error fetching cultural media:', error)
    }
  }, [])

  const handleVideoClick = useCallback((media: ExtendedMedia) => {
    // This function can be implemented if needed for video handling
    console.log('Video clicked:', media)
  }, [])

  useEffect(() => {
    fetchCulturalContent()
    fetchCulturalMedia()
  }, [fetchCulturalContent, fetchCulturalMedia, currentLanguage])


  // Helper function to get translated content
  const getTranslatedContent = (media: ExtendedMedia, key: string) => {
    if (!media.content) return key === 'title' ? media.title : media.description;
    
    const languageContent = media.content[currentLanguage];
    if (languageContent && languageContent[key]) {
      return languageContent[key];
    }
    
    return key === 'title' ? media.title : media.description;
  };

  return (
    <section 
      id="cultural"
      className="relative py-20"
      style={{
        backgroundImage: backgroundImage ? `url(${backgroundImage})` : 'none',
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      {backgroundVideo && (
        <video 
          autoPlay 
          loop 
          muted 
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src={backgroundVideo} type="video/mp4" />
        </video>
      )}
      
      <div className="absolute inset-0 bg-black bg-opacity-70"></div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-base text-orange-500 font-semibold tracking-wide uppercase">{subtitle}</h2>
          <h1 className="mt-2 text-4xl leading-8 font-extrabold tracking-tight text-white sm:text-5xl">{title}</h1>
          <p className="mt-4 max-w-2xl text-xl text-gray-300 mx-auto">{description}</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {culturalMedia.map((media) => (
            <div 
              key={media.id} 
              className="bg-gray-800 rounded-lg overflow-hidden shadow-lg transform transition duration-300 hover:scale-105 cursor-pointer"
              onClick={() => {
                if (media.media_type === 'social_video') {
                  handleVideoClick(media)
                }
              }}
            >
              {media.file_url && (
                <div className="relative pb-[56.25%]"> {/* 16:9 aspect ratio */}
                  <img 
                    src={media.file_url} 
                    alt={getTranslatedContent(media, 'title') || 'Cultural Event'} 
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  {media.media_type === 'social_video' && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="bg-black bg-opacity-50 rounded-full w-16 h-16 flex items-center justify-center">
                        <div className="text-white text-2xl">▶</div>
                      </div>
                    </div>
                  )}
                </div>
              )}
              
              <div className="p-6">
                <h3 className="text-xl font-bold text-orange-500 mb-2">
                  {getTranslatedContent(media, 'title')}
                </h3>
                <p className="text-gray-300">
                  {getTranslatedContent(media, 'description')}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
      
    </section>
  );
};

export default CulturalSection