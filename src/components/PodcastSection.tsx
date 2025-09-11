import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';
import { useLanguage } from '@/components/LanguageProvider';
import { useTranslations } from '@/hooks/useTranslations';

type MediaItem = Pick<
  Database['public']['Tables']['media']['Row'],
  | 'id'
  | 'section_key'
  | 'media_type'
  | 'file_url'
  | 'social_url'
  | 'thumbnail_url'
  | 'display_order'
  | 'is_active'
  | 'created_at'
  | 'updated_at'
  | 'language_code'
>;

const PodcastSection = () => {
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const { currentLanguage } = useLanguage();
  const { t, loadTranslations } = useTranslations('podcast');
  
  // Items per page for pagination
  const ITEMS_PER_PAGE = 6;

  const fetchMedia = useCallback(async (page = 0) => {
    try {
      if (page === 0) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }
      
      const from = page * ITEMS_PER_PAGE;
      const to = from + ITEMS_PER_PAGE - 1;

      const { data, error } = await supabase
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
          language_code
        `)
        .eq('section_key', 'podcast')
        .eq('is_active', true)
        .eq('language_code', currentLanguage)
        .range(from, to)
        .order('display_order', { ascending: true })
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      if (page === 0) {
        setMedia(data || []);
        setHasMore((data || []).length === ITEMS_PER_PAGE);
      } else {
        setMedia(prev => [...prev, ...(data || [])]);
        setHasMore((data || []).length === ITEMS_PER_PAGE);
      }
    } catch (error) {
      console.error('Error fetching podcast media:', error);
    } finally {
      if (page === 0) {
        setLoading(false);
      } else {
        setLoadingMore(false);
      }
    }
  }, [currentLanguage]);

  useEffect(() => {
    loadTranslations(currentLanguage);
    fetchMedia(0);
  }, [currentLanguage, fetchMedia, loadTranslations]);

  const handleLoadMore = () => {
    const nextPage = Math.floor(media.length / ITEMS_PER_PAGE);
    fetchMedia(nextPage);
  };

  if (loading) {
    return (
      <section id="podcast" className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="h-10 w-64 bg-gray-200 animate-pulse mx-auto mb-4 rounded" />
            <div className="h-4 w-96 bg-gray-200 animate-pulse mx-auto rounded" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="overflow-hidden rounded-lg border bg-card text-card-foreground shadow">
                <div className="w-full aspect-video bg-gray-200 animate-pulse" />
                <div className="p-4">
                  <p className="text-muted-foreground line-clamp-2 bg-gray-200 h-6 w-3/4 animate-pulse rounded" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="podcast" className="py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          {t('podcastTitle', currentLanguage === 'sr' ? 'Подкаст' : 
             currentLanguage === 'de' ? 'Podcast' : 'Podcast')}
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {media.map((item) => (
            <div key={item.id} className="overflow-hidden rounded-lg border bg-card text-card-foreground shadow hover:shadow-lg transition-shadow">
              {item.media_type === 'social_video' && item.social_url ? (
                <div className="relative pt-[56.25%]">
                  <iframe
                    src={item.social_url}
                    className="absolute top-0 left-0 w-full h-full"
                    title={`Podcast video ${item.id}`}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              ) : item.media_type === 'image' && item.file_url ? (
                <img
                  src={item.file_url}
                  alt="Podcast image"
                  className="w-full aspect-video object-cover"
                />
              ) : (
                <div className="bg-gray-200 border-2 border-dashed rounded-xl w-full aspect-video" />
              )}
              
              <div className="p-4">
                <p className="text-muted-foreground line-clamp-2">
                  {item.media_type === 'social_video' ? 'Video' : item.media_type}
                </p>
              </div>
            </div>
          ))}
        </div>
        
        {hasMore && (
          <div className="text-center mt-12">
            <button
              onClick={handleLoadMore}
              disabled={loadingMore}
              className="px-6 py-3 bg-orange-600 text-white font-medium rounded-md hover:bg-orange-700 transition-colors disabled:opacity-50"
            >
              {loadingMore ? t('loading', 'Loading...') : t('loadMore', 'Load More')}
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default PodcastSection;