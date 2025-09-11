import React, { useEffect, useState, useCallback } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { Advertisement as AdType } from '@/integrations/supabase/types'

interface AdvertisementProps {
  position: 'header' | 'between_sections' | 'footer'
}

const Advertisement = ({ position }: AdvertisementProps) => {
  const [ads, setAds] = useState<AdType[]>([])

  const fetchAdvertisements = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('advertisements')
        .select('*')
        .eq('position', position)
        .eq('is_active', true)
        .lte('start_date', new Date().toISOString())
        .or(`end_date.is.null,end_date.gte.${new Date().toISOString()}`)
        .order('display_order')
      
      if (error) throw error
      
      if (data) {
        setAds(data)
      }
    } catch (error) {
      console.error('Error fetching advertisements:', error)
    }
  }, [position])

  useEffect(() => {
    fetchAdvertisements()
  }, [fetchAdvertisements])

  if (ads.length === 0) return null

  const handleAdClick = async (ad: AdType) => {
    // Increment click count
    await supabase
      .from('advertisements')
      .update({ click_count: (ad.click_count || 0) + 1 })
      .eq('id', ad.id)
  }

  return (
    <div className="w-full bg-gray-800 py-4 flex justify-center">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {ads.map((ad) => (
            <div key={ad.id} className="bg-gray-700 rounded-lg overflow-hidden shadow-lg">
              <a 
                href={ad.link_url || '#'} 
                target="_blank" 
                rel="noopener noreferrer"
                className="block"
                onClick={() => handleAdClick(ad)}
              >
                {ad.ad_type === 'video' ? (
                  <div className="relative">
                    {ad.thumbnail_url ? (
                      <img 
                        src={ad.thumbnail_url} 
                        alt={ad.title} 
                        className="w-full h-32 object-cover"
                      />
                    ) : (
                      <div className="w-full h-32 bg-gray-600 flex items-center justify-center">
                        <div className="text-white text-xl">▶</div>
                      </div>
                    )}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="bg-black bg-opacity-50 rounded-full w-12 h-12 flex items-center justify-center">
                        <div className="text-white text-xl">▶</div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <img 
                    src={ad.image_url} 
                    alt={ad.title} 
                    className="w-full h-32 object-cover"
                  />
                )}
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-orange-500">{ad.title}</h3>
                  {ad.description && (
                    <p className="text-gray-300 text-sm mt-2">{ad.description}</p>
                  )}
                </div>
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Advertisement