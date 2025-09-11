import React, { useEffect, useState, useCallback } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { Media } from '@/integrations/supabase/types'
import { useAdminLanguage } from '@/components/admin/AdminLanguageProvider'
import { toast } from '@/components/ui/use-toast'
import { Loader2, Trash2, Plus, Edit3 } from 'lucide-react'
import { PageSection } from '@/integrations/supabase/types'

interface MediaContent {
  title: string
  description: string
}

interface MediaFormData {
  id?: string
  section_key: string
  media_type: 'image' | 'video' | 'social_video'
  file_url: string
  social_url: string
  thumbnail_url: string
  display_order: number
  is_active: boolean
  content: {
    sr: MediaContent
    en: MediaContent
    de: MediaContent
  }
}

const MediaManager = () => {
  const { t } = useAdminLanguage()
  const [mediaItems, setMediaItems] = useState<Media[]>([])
  const [sections, setSections] = useState<PageSection[]>([])
  const [formData, setFormData] = useState<MediaFormData>({
    section_key: '',
    media_type: 'image',
    file_url: '',
    social_url: '',
    thumbnail_url: '',
    display_order: 0,
    is_active: true,
    content: {
      sr: { title: '', description: '' },
      en: { title: '', description: '' },
      de: { title: '', description: '' }
    }
  })
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [file, setFile] = useState<File | null>(null)

  const fetchSections = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('page_sections')
        .select('section_key, section_name, id, is_active, created_at, updated_at')
        .order('section_name')
      
      if (error) throw error
      
      if (data) {
        setSections(data as PageSection[])
      }
    } catch (error) {
      console.error('Error fetching sections:', error)
    }
  }, [])

  const resetForm = () => {
    setFormData({
      section_key: '',
      media_type: 'image',
      file_url: '',
      social_url: '',
      thumbnail_url: '',
      display_order: 0,
      is_active: true,
      content: {
        sr: { title: '', description: '' },
        en: { title: '', description: '' },
        de: { title: '', description: '' }
      }
    })
    setFile(null)
    setIsEditing(false)
    setEditingMediaId(null)
  }

  const fetchMedia = useCallback(async () => {
    try {
      setLoading(true)
      
      // Fetch media items
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
          updated_at
        `)
        .order('section_key')
        .order('display_order')
      
      if (mediaError) throw mediaError
      
      if (mediaData) {
        // Fetch all content for media items
        const mediaIds = mediaData.map(media => media.id);
        const { data: contentData, error: contentError } = await supabase
          .from('content')
          .select('media_id, language_code, content_key, content_value')
          .in('media_id', mediaIds);
        
        if (contentError) throw contentError;
        
        // Process the data to organize content by language
        const processedData = mediaData.map((mediaItem: any) => {
          // Initialize content structure
          const contentByLanguage = {
            sr: { title: '', description: '' },
            en: { title: '', description: '' },
            de: { title: '', description: '' }
          };
          
          // Populate content by language
          if (contentData) {
            contentData
              .filter(contentItem => contentItem.media_id === mediaItem.id)
              .forEach((contentItem: any) => {
                if (contentByLanguage.hasOwnProperty(contentItem.language_code)) {
                  // Map content_key to title/description
                  if (contentItem.content_key === 'title') {
                    contentByLanguage[contentItem.language_code].title = contentItem.content_value || '';
                  } else if (contentItem.content_key === 'description') {
                    contentByLanguage[contentItem.language_code].description = contentItem.content_value || '';
                  }
                }
              });
          }
          
          return {
            ...mediaItem,
            content: contentByLanguage
          };
        });
        
        setMediaItems(processedData);
      }
    } catch (error) {
      console.error('Error fetching media:', error);
      toast({
        title: t.error,
        description: t.failedToLoadMedia,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    const channel = supabase
      .channel('media-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'media'
        },
        (payload) => {
          console.log('Media change detected:', payload)
          fetchMedia()
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'content'
        },
        (payload) => {
          console.log('Content change detected:', payload)
          fetchMedia()
        }
      )
      .subscribe((status) => {
        console.log('Media manager subscription status:', status)
      })

    // Fetch initial data
    Promise.all([
      fetchSections(),
      fetchMedia()
    ]).finally(() => {
      setLoading(false)
    })

    // Cleanup function
    return () => {
      supabase.removeChannel(channel)
    }
  }, [fetchMedia, fetchSections])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
    }
  }

  const uploadFile = useCallback(async () => {
    if (!file) return ''
    
    try {
      setUploading(true)
      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
      const filePath = `media/${fileName}`
      
      const { error: uploadError } = await supabase.storage
        .from('media')
        .upload(filePath, file)
      
      if (uploadError) throw uploadError
      
      const { data: { publicUrl } } = supabase.storage
        .from('media')
        .getPublicUrl(filePath)
      
      return publicUrl
    } catch (error) {
      console.error('Error uploading file:', error)
      throw error
    } finally {
      setUploading(false)
    }
  }, [file])

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      setSaving(true)
      let mediaId = formData.id
      
      // Handle file upload if a file is selected
      let fileUrl = formData.file_url
      if (file) {
        fileUrl = await uploadFile()
      }
      
      // Prepare media data (without content fields)
      const mediaData = {
        section_key: formData.section_key,
        media_type: formData.media_type,
        file_url: fileUrl || null,
        social_url: formData.social_url || null,
        thumbnail_url: formData.thumbnail_url || null,
        display_order: formData.display_order,
        is_active: formData.is_active,
        language_code: 'sr' // Default language code
      }
      
      if (isEditing && mediaId) {
        // Update existing media
        const { error: mediaError } = await supabase
          .from('media')
          .update(mediaData)
          .eq('id', mediaId)
        
        if (mediaError) throw mediaError
      } else {
        // Insert new media
        const { data, error: mediaError } = await supabase
          .from('media')
          .insert(mediaData)
          .select()
        
        if (mediaError) throw mediaError
        mediaId = data[0].id
      }
      
      // Now handle content table for all languages
      const languages: ('sr' | 'en' | 'de')[] = ['sr', 'en', 'de']
      
      for (const lang of languages) {
        // Handle title content
        const titleContentData = {
          media_id: mediaId,
          language_code: lang,
          section_key: formData.section_key, // Add section_key to content records
          content_key: 'title',
          content_value: formData.content[lang]?.title || null
        }
        
        // Handle description content
        const descriptionContentData = {
          media_id: mediaId,
          language_code: lang,
          section_key: formData.section_key, // Add section_key to content records
          content_key: 'description',
          content_value: formData.content[lang]?.description || null
        }
        
        // Check if title content exists for this language
        const { data: existingTitleContent, error: fetchTitleError } = await supabase
          .from('content')
          .select('id')
          .eq('media_id', mediaId)
          .eq('language_code', lang)
          .eq('content_key', 'title')
          .single()
          
        if (fetchTitleError && fetchTitleError.code !== 'PGRST116') { // PGRST116 means no rows found
          throw fetchTitleError
        }
        
        if (existingTitleContent) {
          // Update existing title content
          const { error } = await supabase
            .from('content')
            .update(titleContentData)
            .eq('id', existingTitleContent.id)
            
          if (error) throw error
        } else {
          // Insert new title content
          const { error } = await supabase
            .from('content')
            .insert(titleContentData)
            
          if (error) throw error
        }
        
        // Check if description content exists for this language
        const { data: existingDescriptionContent, error: fetchDescriptionError } = await supabase
          .from('content')
          .select('id')
          .eq('media_id', mediaId)
          .eq('language_code', lang)
          .eq('content_key', 'description')
          .single()
          
        if (fetchDescriptionError && fetchDescriptionError.code !== 'PGRST116') { // PGRST116 means no rows found
          throw fetchDescriptionError
        }
        
        if (existingDescriptionContent) {
          // Update existing description content
          const { error } = await supabase
            .from('content')
            .update(descriptionContentData)
            .eq('id', existingDescriptionContent.id)
            
          if (error) throw error
        } else {
          // Insert new description content
          const { error } = await supabase
            .from('content')
            .insert(descriptionContentData)
            
          if (error) throw error
        }
      }
      
      toast({
        title: isEditing ? t.mediaUpdatedSuccessfully : t.mediaCreatedSuccessfully,
        description: isEditing ? t.mediaUpdatedDescription : t.mediaCreatedDescription,
      })
      
      resetForm()
      fetchMedia()
    } catch (error) {
      console.error('Error saving media:', error)
      toast({
        title: t.error,
        description: t.failedToSaveMedia,
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }, [formData, file, isEditing, uploadFile, fetchMedia, resetForm, t])

  const handleEdit = (media: Media) => {
    // Initialize content with empty values
    const content: Record<'sr' | 'en' | 'de', MediaContent> = {
      sr: { title: '', description: '' },
      en: { title: '', description: '' },
      de: { title: '', description: '' }
    }

    // Populate content with fetched data if available
    if (media.content && Array.isArray(media.content)) {
      media.content.forEach((item) => {
        const lang = item.language_code as 'sr' | 'en' | 'de'
        if (content[lang]) {
          // Map content_key/content_value pairs to title/description
          if (item.content_key === 'title') {
            content[lang].title = item.content_value || ''
          } else if (item.content_key === 'description') {
            content[lang].description = item.content_value || ''
          }
        }
      })
    }

    setFormData({
      id: media.id,
      section_key: media.section_key,
      media_type: media.media_type,
      file_url: media.file_url || '',
      social_url: media.social_url || '',
      thumbnail_url: media.thumbnail_url || '',
      display_order: media.display_order || 0,
      is_active: media.is_active !== undefined ? media.is_active : true,
      content
    })
    setIsEditing(true)
    setFile(null)
  }

  const handleDelete = useCallback(async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this media item?')) return
    
    try {
      const { error } = await supabase
        .from('media')
        .delete()
        .eq('id', id)
      
      if (error) throw error
      
      await fetchMedia()
    } catch (error) {
      console.error('Error deleting media:', error)
    }
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">{t.mediaManager}</h2>
        <button
          onClick={resetForm}
          className="flex items-center space-x-2 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition duration-300"
        >
          <Plus className="w-5 h-5" />
          <span>{t.addMedia}</span>
        </button>
      </div>

      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-xl font-semibold mb-4 text-white">
          {isEditing ? t.editMedia : t.addMedia}
        </h3>
        
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-gray-300 mb-2">{t.section}</label>
            <select
              name="section_key"
              value={formData.section_key}
              onChange={handleInputChange}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-white"
              required
              aria-label={t.section}
            >
              <option value="">{t.selectSection}</option>
              {sections.map(section => (
                <option key={section.section_key} value={section.section_key}>
                  {section.section_name}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-gray-300 mb-2">{t.mediaType}</label>
            <select
              name="media_type"
              value={formData.media_type}
              onChange={handleInputChange}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-white"
              required
              aria-label={t.mediaType}
            >
              <option value="image">{t.image}</option>
              <option value="video">{t.video}</option>
              <option value="social_video">{t.socialVideo}</option>
            </select>
          </div>
          
          {formData.media_type === 'social_video' ? (
            <div className="md:col-span-2">
              <label className="block text-gray-300 mb-2">{t.socialUrl}</label>
              <input
                type="url"
                name="social_url"
                value={formData.social_url}
                onChange={handleInputChange}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-white"
                placeholder="https://youtube.com/watch?v=..."
                aria-label={t.socialUrl}
              />
            </div>
          ) : (
            <div className="md:col-span-2">
              <label className="block text-gray-300 mb-2">
                {t.fileUrl}
              </label>
              <input
                type="file"
                accept={formData.media_type === 'image' ? 'image/*' : 'video/*'}
                onChange={handleFileChange}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-white"
                aria-label={t.uploadFile}
              />
              {formData.file_url && (
                <div className="mt-2">
                  <p className="text-gray-400 text-sm">{t.fileUrl}: {formData.file_url}</p>
                </div>
              )}
            </div>
          )}
          
          <div>
            <label className="block text-gray-300 mb-2">{t.displayOrder}</label>
            <input
              type="number"
              name="display_order"
              value={formData.display_order}
              onChange={handleInputChange}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-white"
              min="0"
              aria-label={t.displayOrder}
            />
          </div>
          
          <div>
            <label className="block text-gray-300 mb-2">{t.thumbnailUrl} ({t.optional})</label>
            <input
              type="url"
              name="thumbnail_url"
              value={formData.thumbnail_url}
              onChange={handleInputChange}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-white"
              placeholder="https://example.com/thumbnail.jpg"
              aria-label={`${t.thumbnailUrl} (${t.optional})`}
            />
          </div>
          
          <div className="md:col-span-2">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="is_active"
                checked={formData.is_active}
                onChange={handleInputChange}
                className="rounded bg-gray-700 border-gray-600 text-orange-600 focus:ring-orange-500"
              />
              <span className="text-gray-300">{t.isActive}</span>
            </label>
          </div>
          
          {/* Serbian Translations */}
          <div className="md:col-span-2 border-b border-gray-700 pb-2">
            <h4 className="text-lg font-semibold text-white">{t.serbian} {t.translations}</h4>
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-gray-300 mb-2">{t.title} ({t.serbian})</label>
            <input
              type="text"
              value={formData.content.sr.title}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                content: {
                  ...prev.content,
                  sr: {
                    ...prev.content.sr,
                    title: e.target.value
                  }
                }
              }))}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-white"
              aria-label={`${t.title} (${t.serbian})`}
            />
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-gray-300 mb-2">{t.description} ({t.serbian})</label>
            <textarea
              value={formData.content.sr.description}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                content: {
                  ...prev.content,
                  sr: {
                    ...prev.content.sr,
                    description: e.target.value
                  }
                }
              }))}
              rows={3}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-white"
              aria-label={`${t.description} (${t.serbian})`}
            />
          </div>
          
          {/* English Translations */}
          <div className="md:col-span-2 border-b border-gray-700 pb-2 mt-4">
            <h4 className="text-lg font-semibold text-white">{t.english} {t.translations}</h4>
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-gray-300 mb-2">{t.title} ({t.english})</label>
            <input
              type="text"
              value={formData.content.en.title}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                content: {
                  ...prev.content,
                  en: {
                    ...prev.content.en,
                    title: e.target.value
                  }
                }
              }))}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-white"
              aria-label={`${t.title} (${t.english})`}
            />
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-gray-300 mb-2">{t.description} ({t.english})</label>
            <textarea
              value={formData.content.en.description}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                content: {
                  ...prev.content,
                  en: {
                    ...prev.content.en,
                    description: e.target.value
                  }
                }
              }))}
              rows={3}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-white"
              aria-label={`${t.description} (${t.english})`}
            />
          </div>
          
          {/* German Translations */}
          <div className="md:col-span-2 border-b border-gray-700 pb-2 mt-4">
            <h4 className="text-lg font-semibold text-white">{t.german} {t.translations}</h4>
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-gray-300 mb-2">{t.title} ({t.german})</label>
            <input
              type="text"
              value={formData.content.de.title}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                content: {
                  ...prev.content,
                  de: {
                    ...prev.content.de,
                    title: e.target.value
                  }
                }
              }))}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-white"
              aria-label={`${t.title} (${t.german})`}
            />
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-gray-300 mb-2">{t.description} ({t.german})</label>
            <textarea
              value={formData.content.de.description}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                content: {
                  ...prev.content,
                  de: {
                    ...prev.content.de,
                    description: e.target.value
                  }
                }
              }))}
              rows={3}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-white"
              aria-label={`${t.description} (${t.german})`}
            />
          </div>
          
          <div className="md:col-span-2 flex space-x-4 pt-4">
            <button
              type="submit"
              disabled={saving || uploading}
              className="flex-1 px-4 py-2 bg-orange-600 hover:bg-orange-700 disabled:opacity-50 text-white font-semibold rounded-lg transition duration-300 flex items-center justify-center"
            >
              {(saving || uploading) && <Loader2 className="w-5 h-5 animate-spin mr-2" />}
              {saving ? t.saving : (isEditing ? t.update : t.add)}
              
            </button>
            
            {isEditing && (
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-lg transition duration-300"
              >
                {t.cancel}
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="bg-gray-800 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">{t.section}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">{t.mediaType}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">{t.title}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">{t.status}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">{t.actions}</th>
              </tr>
            </thead>
            <tbody className="bg-gray-800 divide-y divide-gray-700">
              {mediaItems.map((media) => (
                <tr key={media.id} className="hover:bg-gray-750">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {sections.find(s => s.section_key === media.section_key)?.section_name || media.section_key}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {media.media_type}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-300">
                    <div className="max-w-xs break-all">
                      {media.file_url ? media.file_url.split('/').pop() : 'N/A'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${media.is_active ? 'bg-green-900 text-green-200' : 'bg-red-900 text-red-200'}`}>
                      {media.is_active ? t.active : t.inactive}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(media)}
                        className="text-orange-400 hover:text-orange-300 transition duration-300"
                        aria-label={t.edit}
                      >
                        <Edit3 className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(media.id)}
                        className="text-red-400 hover:text-red-300 transition duration-300"
                        aria-label={t.delete}
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {mediaItems.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-400">{t.noMediaFound}</p>
              
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default MediaManager