import React, { useState, useEffect, useRef } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { useAdminLanguage } from '@/components/admin/AdminLanguageProvider'
import { toast } from '@/components/ui/use-toast'

interface Advertisement {
  id: string
  title: string
  description: string | null
  image_url: string | null
  video_url: string | null
  thumbnail_url: string | null
  link_url: string | null
  position: 'header' | 'between_sections' | 'footer'
  ad_type: 'image' | 'video'
  display_order: number | null
  is_active: boolean
  start_date: string | null
  end_date: string | null
  click_count: number | null
  created_at: string
  updated_at: string | null
}

const AdvertisementManager = () => {
  const { t } = useAdminLanguage()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const thumbnailFileInputRef = useRef<HTMLInputElement>(null)
  const [advertisements, setAdvertisements] = useState<Advertisement[]>([])
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [videoUrl, setVideoUrl] = useState('')
  const [thumbnailUrl, setThumbnailUrl] = useState('')
  const [linkUrl, setLinkUrl] = useState('')
  const [position, setPosition] = useState('header')
  const [adType, setAdType] = useState<'image' | 'video'>('image')
  const [displayOrder, setDisplayOrder] = useState(0)
  const [isActive, setIsActive] = useState(true)
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [editingAd, setEditingAd] = useState<Advertisement | null>(null)
  const [uploading, setUploading] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    fetchAdvertisements()
  }, [])

  const createMediaBucket = async (): Promise<boolean> => {
    try {
      // Check if bucket already exists
      const { data: buckets, error: listError } = await supabase
        .storage
        .listBuckets()
      
      if (listError) {
        console.error('Error listing buckets:', listError)
        throw new Error(`Failed to list buckets: ${listError.message || 'Unknown error'}`);
      }
      
      const mediaBucketExists = buckets?.some(bucket => bucket.name === 'media')
      
      if (!mediaBucketExists) {
        // Create bucket if it doesn't exist
        const { error: createError } = await supabase
          .storage
          .createBucket('media', {
            public: true,
            allowedMimeTypes: ['image/*', 'video/*'],
            fileSizeLimit: 1024 * 1024 * 100 // 100MB limit
          })
        
        if (createError && createError.message !== 'Bucket already exists') {
          throw new Error(`Failed to create media bucket: ${createError.message || 'Unknown error'}`);
        }
      } else {
        // Bucket already exists, no need to create
        console.log('Media bucket already exists');
      }
      
      return true
    } catch (error) {
      console.error('Error creating media bucket:', error)
      toast({
        title: "Error",
        description: "Failed to create media bucket. Please try again.",
        variant: "destructive",
      })
      return false
    }
  }

  const uploadFile = async (file: File) => {
    try {
      setUploading(true)
      
      // Check if bucket exists or create it
      const bucketExists = await createMediaBucket()
      if (!bucketExists) return null

      // Generate unique file name
      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`

      // Upload file
      const { error: uploadError } = await supabase
        .storage
        .from('media')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        })

      if (uploadError) {
        console.error('Upload error:', uploadError)
        throw new Error(`Upload failed: ${uploadError.message || 'Unknown error'}`);
      }

      // Get public URL
      const { data: { publicUrl } } = supabase
        .storage
        .from('media')
        .getPublicUrl(fileName)

      return publicUrl
    } catch (error: unknown) {
      console.error('Error uploading file:', error)
      toast({
        title: "Error",
        description: "Failed to upload file. Please try again.",
        variant: "destructive",
      })
    } finally {
      setUploading(false)
    }
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return
    
    const file = e.target.files[0]
    const publicUrl = await uploadFile(file)
    
    if (publicUrl) {
      if (file.type.startsWith('image/')) {
        setImageUrl(publicUrl)
      } else if (file.type.startsWith('video/')) {
        setVideoUrl(publicUrl)
      }
      toast({
        title: "Upload Successful",
        description: "File uploaded successfully.",
      })
    }
  }

  const handleThumbnailUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return
    
    const file = e.target.files[0]
    const publicUrl = await uploadFile(file)
    
    if (publicUrl) {
      setThumbnailUrl(publicUrl)
      toast({
        title: "Upload Successful",
        description: "Thumbnail uploaded successfully.",
      })
    }
  }

  const triggerFileInput = (type: 'image' | 'video' | 'thumbnail') => {
    if (type === 'image' || type === 'video') {
      if (fileInputRef.current) {
        fileInputRef.current.click()
      }
    } else if (type === 'thumbnail') {
      if (thumbnailFileInputRef.current) {
        thumbnailFileInputRef.current.click()
      }
    }
  }

  const handleSaveAdvertisement = async () => {
    if (!title) {
      toast({
        title: "Validation Error",
        description: "Title is required",
        variant: "destructive",
      })
      return
    }

    if (adType === 'image' && !imageUrl) {
      toast({
        title: "Validation Error",
        description: "Image URL is required for image ads",
        variant: "destructive",
      })
      return
    }

    if (adType === 'video' && !videoUrl) {
      toast({
        title: "Validation Error",
        description: "Video URL is required for video ads",
        variant: "destructive",
      })
      return
    }

    try {
      setIsLoading(true)
      if (editingAd) {
        // Update existing advertisement
        const { error } = await supabase
          .from('advertisements')
          .update({
            title,
            description: description || null,
            image_url: adType === 'image' ? imageUrl : null,
            video_url: adType === 'video' ? videoUrl : null,
            thumbnail_url: thumbnailUrl || null,
            link_url: linkUrl || null,
            position,
            ad_type: adType,
            display_order: displayOrder,
            is_active: isActive,
            start_date: startDate || null,
            end_date: endDate || null,
            updated_at: new Date().toISOString()
          })
          .eq('id', editingAd.id)
        
        if (error) throw error
        
        toast({
          title: "Advertisement Updated",
          description: "Advertisement updated successfully.",
        })
      } else {
        // Create new advertisement
        const { error } = await supabase
          .from('advertisements')
          .insert({
            title,
            description: description || null,
            image_url: adType === 'image' ? imageUrl : null,
            video_url: adType === 'video' ? videoUrl : null,
            thumbnail_url: thumbnailUrl || null,
            link_url: linkUrl || null,
            position,
            ad_type: adType,
            display_order: displayOrder,
            is_active: isActive,
            start_date: startDate || null,
            end_date: endDate || null
          })
        
        if (error) throw error
        
        toast({
          title: "Advertisement Added",
          description: "Advertisement added successfully.",
        })
      }
      
      // Reset form and refresh data
      resetForm()
      fetchAdvertisements()
    } catch (error) {
      console.error('Error saving advertisement:', error)
      toast({
        title: "Error",
        description: "Failed to save advertisement. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const fetchAdvertisements = async () => {
    try {
      setIsLoading(true)
      const { data, error } = await supabase
        .from('advertisements')
        .select('*')
        .order('position')
        .order('display_order')
      
      if (error) throw error
      
      if (data) {
        setAdvertisements(data)
      }
    } catch (error) {
      console.error('Error fetching advertisements:', error)
      toast({
        title: "Error",
        description: "Failed to fetch advertisements. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const resetForm = () => {
    setTitle('')
    setDescription('')
    setImageUrl('')
    setVideoUrl('')
    setThumbnailUrl('')
    setLinkUrl('')
    setPosition('header')
    setAdType('image')
    setDisplayOrder(0)
    setIsActive(true)
    setStartDate('')
    setEndDate('')
    setEditingAd(null)
  }

  const handleEdit = (advertisement: Advertisement) => {
    setTitle(advertisement.title)
    setDescription(advertisement.description || '')
    setImageUrl(advertisement.image_url || '')
    setVideoUrl(advertisement.video_url || '')
    setThumbnailUrl(advertisement.thumbnail_url || '')
    setLinkUrl(advertisement.link_url || '')
    setPosition(advertisement.position)
    setAdType((advertisement.ad_type as 'image' | 'video') || 'image')
    setDisplayOrder(advertisement.display_order || 0)
    setIsActive(advertisement.is_active || false)
    setStartDate(advertisement.start_date || '')
    setEndDate(advertisement.end_date || '')
    setEditingAd(advertisement)
  }

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('advertisements')
        .delete()
        .eq('id', id)
      
      if (error) throw error
      
      toast({
        title: "Advertisement Deleted",
        description: "Advertisement deleted successfully.",
      })
      
      fetchAdvertisements()
    } catch (error) {
      console.error('Error deleting advertisement:', error)
      toast({
        title: "Error",
        description: "Failed to delete advertisement. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">{t.advertisementManager}</h1>
      
      {/* Add/Edit Form */}
      <div className="bg-gray-800 rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">
          {editingAd ? t.editAdvertisement : t.addAdvertisement}
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">{t.title} *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder={t.title}
              aria-label={t.title}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">{t.position}</label>
            <select
              value={position}
              onChange={(e) => setPosition(e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              aria-label={t.position}
            >
              <option value="header">{t.header}</option>
              <option value="between_sections">{t.betweenSections}</option>
              <option value="footer">{t.footer}</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">{t.adType}</label>
            <select
              value={adType}
              onChange={(e) => setAdType(e.target.value as 'image' | 'video')}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              aria-label={t.adType}
            >
              <option value="image">{t.imageAd}</option>
              <option value="video">{t.videoAd}</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">{t.displayOrder}</label>
            <input
              type="number"
              value={displayOrder}
              onChange={(e) => setDisplayOrder(parseInt(e.target.value))}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder={t.displayOrder}
              aria-label={t.displayOrder}
            />
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-2">{t.description}</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder={t.description}
              aria-label={t.description}
            />
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-2">{t.linkUrl}</label>
            <input
              type="url"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder={t.linkUrl}
              aria-label={t.linkUrl}
            />
          </div>
          
          {adType === 'image' ? (
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2">{t.imageUrl} *</label>
              <div className="flex gap-2">
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder={t.imageUrl}
                  aria-label={t.imageUrl}
                />
                <button
                  onClick={() => triggerFileInput('image')}
                  className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors"
                  disabled={uploading}
                >
                  {uploading ? t.uploading : t.upload}
                </button>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                  ref={fileInputRef}
                  aria-label={t.uploadFile}
                />
              </div>
            </div>
          ) : (
            <>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-2">{t.videoUrl} *</label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                    className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder={t.videoUrl}
                    aria-label={t.videoUrl}
                  />
                  <button
                    onClick={() => triggerFileInput('video')}
                    className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors"
                    disabled={uploading}
                  >
                    {uploading ? t.uploading : t.upload}
                  </button>
                  <input
                    type="file"
                    accept="video/*"
                    onChange={handleFileUpload}
                    className="hidden"
                    ref={fileInputRef}
                    aria-label={t.uploadFile}
                  />
                </div>
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-2">{t.thumbnailUrl}</label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={thumbnailUrl}
                    onChange={(e) => setThumbnailUrl(e.target.value)}
                    className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder={t.thumbnailUrl}
                    aria-label={t.thumbnailUrl}
                  />
                  <button
                    onClick={() => triggerFileInput('thumbnail')}
                    className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors"
                    disabled={uploading}
                  >
                    {uploading ? t.uploading : t.upload}
                  </button>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleThumbnailUpload}
                    className="hidden"
                    ref={thumbnailFileInputRef}
                    aria-label={t.uploadFile}
                  />
                </div>
              </div>
            </>
          )}
          
          <div className="md:col-span-2">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="isActive"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="mr-2"
              />
              <label htmlFor="isActive" className="text-sm font-medium">
                {t.isActive}
              </label>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">{t.startDate}</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              aria-label={t.startDate}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">{t.endDate}</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              aria-label={t.endDate}
            />
          </div>
        </div>
        
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={resetForm}
            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
          >
            {t.cancel}
          </button>
          <button
            onClick={handleSaveAdvertisement}
            disabled={isLoading}
            className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors disabled:opacity-50"
          >
            {isLoading ? t.saving : (editingAd ? t.update : t.add)}
          </button>
        </div>
      </div>
      
      {/* Advertisements List */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">{t.advertisements}</h2>
        
        {isLoading ? (
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left py-3 px-4">{t.title}</th>
                  <th className="text-left py-3 px-4">{t.position}</th>
                  <th className="text-left py-3 px-4">{t.adType}</th>
                  <th className="text-left py-3 px-4">{t.displayOrder}</th>
                  <th className="text-left py-3 px-4">{t.clickCount}</th>
                  <th className="text-left py-3 px-4">{t.status}</th>
                  <th className="text-left py-3 px-4">{t.actions}</th>
                </tr>
              </thead>
              <tbody>
                {advertisements.map((ad) => (
                  <tr key={ad.id} className="border-b border-gray-700 hover:bg-gray-750">
                    <td className="py-3 px-4">{ad.title}</td>
                    <td className="py-3 px-4 capitalize">{ad.position.replace('_', ' ')}</td>
                    <td className="py-3 px-4 capitalize">{ad.ad_type}</td>
                    <td className="py-3 px-4">{ad.display_order}</td>
                    <td className="py-3 px-4">{ad.click_count || 0}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        ad.is_active ? 'bg-green-500' : 'bg-red-500'
                      }`}>
                        {ad.is_active ? t.active : t.inactive}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(ad)}
                          className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
                        >
                          {t.edit}
                        </button>
                        <button
                          onClick={() => handleDelete(ad.id)}
                          className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors text-sm"
                        >
                          {t.delete}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {advertisements.length === 0 && (
              <div className="text-center py-8 text-gray-400">
                {t.noAdvertisementsFound}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default AdvertisementManager