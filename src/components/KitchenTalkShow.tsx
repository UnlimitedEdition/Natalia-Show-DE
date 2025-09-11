import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/hooks/useLanguage';
import { ExtendedMedia } from '@/integrations/supabase/types';

const KitchenTalkShow = () => {
  const { currentLanguage } = useLanguage()
  const [kitchenMedia, setKitchenMedia] = useState<ExtendedMedia[]>([])
  const [backgroundImage, setBackgroundImage] = useState('')
  const [backgroundVideo, setBackgroundVideo] = useState('')
  const [title, setTitle] = useState('Kitchen Talk Show')
  const [subtitle, setSubtitle] = useState('Kitchen Talk')
  const [description, setDescription] = useState('Join us for our kitchen talk shows with special guests')
  const [quote, setQuote] = useState('"Food brings people together, and stories make the meal memorable."')

  const fetchKitchenContent = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('page_sections')
        .select(`
          id,
          section_key,
          background_image_url
        `)
        .eq('section_key', 'kitchen')
        .single()
      
      if (error) {
        console.error('Error fetching kitchen content:', error)
        return
      }
      
      if (data) {
        setBackgroundImage(data.background_image_url || '')
      }

      // Fetch translated content separately
      const { data: contentData } = await supabase
        .from('content')
        .select('language_code, content_key, content_value')
        .eq('section_key', 'kitchen');
      
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
        setTitle(currentLangContent['title'] || 'Kitchen Talk Show');
        setSubtitle(currentLangContent['subtitle'] || 'Kitchen Talk');
        setDescription(currentLangContent['description'] || 'Join us for our kitchen talk shows with special guests');
        setQuote(currentLangContent['quote'] || '"Food brings people together, and stories make the meal memorable."');
      }
    } catch (error) {
      console.error('Error fetching kitchen content:', error)
    }
  }, [currentLanguage])

  const fetchKitchenMedia = useCallback(async () => {
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
          description
        `)
        .eq('section_key', 'kitchen')
        .eq('is_active', true)
        .order('display_order')
      
      if (mediaError) {
        console.error('Error fetching kitchen media:', mediaError)
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
          console.error('Error fetching kitchen media content:', contentError)
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
        
        setKitchenMedia(combinedData);
      }
    } catch (error) {
      console.error('Error fetching kitchen media:', error)
    }
  }, [])

  useEffect(() => {
    fetchKitchenContent()
    fetchKitchenMedia()
  }, [fetchKitchenContent, fetchKitchenMedia])

  // Helper function to get translated content
  const getTranslatedContent = (media: ExtendedMedia, key: string) => {
    if (!media.content) return key === 'title' ? media.title : media.description;
    
    const languageContent = media.content[currentLanguage];
    if (languageContent && languageContent[key]) {
      return languageContent[key];
    }
    
    return key === 'title' ? media.title : media.description;
  };

  const handleVideoClick = useCallback((media: ExtendedMedia) => {
    // This function can be implemented if needed for video handling
    console.log('Video clicked:', media)
  }, [])

  return (
    <section 
      id="kitchen"
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
          
          <blockquote className="mt-8 max-w-3xl mx-auto border-l-4 border-orange-500 pl-6 text-left">
            <p className="text-lg italic text-white">{quote}</p>
          </blockquote>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {kitchenMedia.map((media) => (
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
                    alt={media.title || 'Kitchen Event'} 
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

export default KitchenTalkShow;