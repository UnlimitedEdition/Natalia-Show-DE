import React, { useState, useEffect, useCallback, useRef } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { toast } from "@/hooks/use-toast"
import { useAdminLanguage } from '@/components/admin/AdminLanguageProvider'
import { Announcement, Language } from '@/integrations/supabase/types'

const AnnouncementManager = () => {
  const { t } = useAdminLanguage()
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [languages, setLanguages] = useState<Language[]>([])
  const [selectedLanguage, setSelectedLanguage] = useState('')
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [isPublished, setIsPublished] = useState(false)
  const [publishDate, setPublishDate] = useState('')
  const [expireDate, setExpireDate] = useState('')
  const [displayOrder, setDisplayOrder] = useState(0)
  const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const fetchLanguages = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('languages')
        .select('*')
        .order('id')
      
      if (error) throw error
      
      if (data) {
        setLanguages(data)
        // Set default language if none is selected
        if (data.length > 0 && !selectedLanguage) {
          setSelectedLanguage(data[0].code)
        }
      }
    } catch (error: unknown) {
      console.error('Error fetching languages:', error)
      toast({
        title: "Error",
        description: (error as Error).message || "Failed to fetch languages. Please try again.",
        variant: "destructive",
      })
    }
  }, [selectedLanguage])

  const fetchAnnouncements = useCallback(async () => {
    try {
      setIsLoading(true)
      const { data, error } = await supabase
        .from('announcements')
        .select('*')
        .order('language_code')
        .order('display_order')
      
      if (error) throw error
      
      if (data) {
        setAnnouncements(data)
      }
    } catch (error: unknown) {
      console.error('Error fetching announcements:', error)
      toast({
        title: "Error",
        description: (error as Error).message || "Failed to fetch announcements. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }, [])

  const resetForm = useCallback(() => {
    setEditingAnnouncement(null)
    // Bezbedno pristupanje languages promenljivoj
    if (languages && languages.length > 0) {
      setSelectedLanguage(languages[0].code || '')
    } else {
      setSelectedLanguage('')
    }
    setTitle('')
    setContent('')
    setImageUrl('')
    setIsPublished(false)
    setPublishDate('')
    setExpireDate('')
    setDisplayOrder(0)
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }, [languages])

  const createMediaBucket = useCallback(async () => {
    try {
      const { error } = await supabase
        .storage
        .createBucket('media', {
          public: true,
          allowedMimeTypes: ['image/*'],
          fileSizeLimit: 1024 * 1024 * 50 // 50MB limit
        })
      
      if (error) {
        // Check if bucket already exists
        if (error.message.includes('already exists')) {
          // Bucket already exists, which is fine
          return true
        }
        throw error
      }
      
      return true
    } catch (error: unknown) {
      console.error('Error creating media bucket:', error)
      toast({
        title: "Storage Error",
        description: `Failed to create media bucket: ${(error as Error).message || 'Please check your storage settings.'}`,
        variant: "destructive",
      })
      return false
    }
  }, [])

  const uploadFile = useCallback(async (file: File) => {
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
        .upload(fileName, file)

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
        title: "Upload Error",
        description: (error as Error).message || "Failed to upload file. Please try again.",
        variant: "destructive",
      })
      return null

    } finally {
      setUploading(false)
    }
  }, [createMediaBucket])

  const handleFileUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return
    
    const file = e.target.files[0]
    const publicUrl = await uploadFile(file)
    
    if (publicUrl) {
      setImageUrl(publicUrl)
      toast({
        title: "Upload Successful",
        description: "Image uploaded successfully.",
      })
    }
  }, [uploadFile])

  const triggerFileInput = useCallback(() => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }, [])

  const handleSaveAnnouncement = useCallback(async () => {
    if (!selectedLanguage || !title) {
      toast({
        title: "Validation Error",
        description: "Language and title are required",
        variant: "destructive",
      })
      return
    }

    try {
      setIsLoading(true)
      
      // Prepare announcement data
      const announcementData = {
        language_code: selectedLanguage,
        title,
        content,
        image_url: imageUrl || null,
        is_published: isPublished,
        publish_date: publishDate || null,
        expire_date: expireDate || null,
        display_order: displayOrder
      }
      
      if (editingAnnouncement) {
        // Update existing announcement
        const { error } = await supabase
          .from('announcements')
          .update(announcementData)
          .eq('id', editingAnnouncement.id)
        
        if (error) throw error
        
        toast({
          title: "Announcement Updated",
          description: "Announcement updated successfully.",
        })
      } else {
        // Create new announcement
        const { error } = await supabase
          .from('announcements')
          .insert(announcementData)
        
        if (error) throw error
        
        toast({
          title: "Announcement Added",
          description: "Announcement added successfully.",
        })
      }
      
      // Reset form and refresh data
      resetForm()
      fetchAnnouncements()
    } catch (error: unknown) {
      console.error('Error saving announcement:', error)
      toast({
        title: "Error",
        description: (error as Error).message || "Failed to save announcement. Please try again.",
        variant: "destructive",
      })

    } finally {
      setIsLoading(false)
    }
  }, [
    selectedLanguage, 
    title, 
    content, 
    imageUrl, 
    isPublished, 
    publishDate, 
    expireDate, 
    displayOrder, 
    editingAnnouncement,
    fetchAnnouncements
  ])

  const handleEdit = useCallback((announcement: Announcement) => {
    setEditingAnnouncement(announcement)
    setSelectedLanguage(announcement.language_code)
    setTitle(announcement.title)
    setContent(announcement.content || '')
    setImageUrl(announcement.image_url || '')
    setIsPublished(announcement.is_published)
    setPublishDate(announcement.publish_date || '')
    setExpireDate(announcement.expire_date || '')
    setDisplayOrder(announcement.display_order || 0)
  }, [])

  const handleDelete = useCallback(async (id: string) => {
    try {
      setIsLoading(true)
      const { error } = await supabase
        .from('announcements')
        .delete()
        .eq('id', id)
      
      if (error) throw error
      
      toast({
        title: "Announcement Deleted",
        description: "Announcement deleted successfully.",
      })
      
      fetchAnnouncements()
    } catch (error: unknown) {
      console.error('Error deleting announcement:', error)
      toast({
        title: "Error",
        description: (error as Error).message || "Failed to delete announcement. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }, [fetchAnnouncements])

  useEffect(() => {
    fetchLanguages()
    fetchAnnouncements()
  }, []) // Uklanjamo zavisnosti da izbegnemo cirkularne zavisnosti

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-orange-500">{t.announcementManager}</h1>
      
      <div className="bg-gray-800 rounded-lg p-6 mb-8">
        <h2 className="text-2xl font-bold mb-4 text-white">
          {editingAnnouncement ? t.editAnnouncement : t.addAnnouncement}
        </h2>
        <p className="text-gray-400 mb-6">{t.selectLanguageAndEnterDetails}</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-gray-300 mb-2">{t.language}</label>
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="w-full px-4 py-2 bg-gray-600 border border-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-white"
              disabled={isLoading}
            >
              {languages.map((language) => (
                <option key={language.code} value={language.code}>
                  {language.name}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-gray-300 mb-2">{t.title}</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 bg-gray-600 border border-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-white"
              placeholder={t.title}
              disabled={isLoading}
              aria-label={t.title}
            />
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-gray-300 mb-2">{t.content}</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full px-4 py-2 bg-gray-600 border border-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-white"
              rows={4}
              placeholder={t.content}
              disabled={isLoading}
              aria-label={t.content}
            />
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-gray-300 mb-2">Image</label>
            <div className="flex flex-col space-y-4">
              <div className="flex items-center space-x-4">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept="image/*"
                  className="hidden"
                  id="file-upload"
                  disabled={uploading}
                />
                <label htmlFor="file-upload">
                  <button
                    type="button"
                    onClick={triggerFileInput}
                    disabled={uploading}
                    className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-lg transition duration-300 disabled:opacity-50 flex items-center space-x-2"
                  >
                    {uploading ? (
                      <>
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span>Uploading...</span>
                      </>
                    ) : (
                      <>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span>Choose Image</span>
                      </>
                    )}
                  </button>
                </label>
                {imageUrl && (
                  <div className="flex items-center text-sm text-gray-300 truncate max-w-md">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="truncate">{imageUrl.split('/').pop()}</span>
                  </div>
                )}
              </div>
              
              {/* Image preview */}
              {imageUrl && (
                <div className="mt-4">
                  <img 
                    src={imageUrl} 
                    alt="Preview" 
                    className="max-h-60 rounded-lg border border-gray-700 shadow-lg"
                  />
                </div>
              )}
              
              <div className="mt-4">
                <label className="block text-gray-300 mb-2">Or enter Image URL</label>
                <input
                  type="text"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-600 border border-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-white"
                  placeholder="Enter image URL"
                  disabled={isLoading || uploading}
                />
              </div>
            </div>
            
            {uploading && (
              <div className="mt-4 p-3 bg-blue-600/20 border border-blue-600 rounded-lg">
                <p className="text-blue-400">Uploading image... Please wait</p>
              </div>
            )}
          </div>
          
          <div>
            <label className="block text-gray-300 mb-2">{t.publishDate}</label>
            <input
              type="date"
              value={publishDate}
              onChange={(e) => setPublishDate(e.target.value)}
              className="w-full px-4 py-2 bg-gray-600 border border-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-white"
              disabled={isLoading}
              aria-label={t.publishDate}
            />
          </div>
          
          <div>
            <label className="block text-gray-300 mb-2">{t.expireDate}</label>
            <input
              type="date"
              value={expireDate}
              onChange={(e) => setExpireDate(e.target.value)}
              className="w-full px-4 py-2 bg-gray-600 border border-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-white"
              disabled={isLoading}
              aria-label={t.expireDate}
            />
          </div>
          
          <div>
            <label className="block text-gray-300 mb-2">Display Order</label>
            <input
              type="number"
              min="0"
              value={displayOrder}
              onChange={(e) => setDisplayOrder(parseInt(e.target.value))}
              className="w-full px-4 py-2 bg-gray-600 border border-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-white"
              placeholder="Enter display order"
              disabled={isLoading}
            />
          </div>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              id="isPublished"
              checked={isPublished}
              onChange={(e) => setIsPublished(e.target.checked)}
              className="mr-2 h-5 w-5 text-orange-600 rounded focus:ring-orange-500"
              disabled={isLoading}
            />
            <label htmlFor="isPublished" className="text-gray-300">{t.isPublished}</label>
          </div>
        </div>
        
        <div className="flex space-x-4 mt-6">
          <button
            onClick={handleSaveAnnouncement}
            disabled={isLoading}
            className="px-6 py-2 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-lg transition duration-300 disabled:opacity-50"
          >
            {editingAnnouncement ? t.update : t.add}
          </button>
          
          {editingAnnouncement && (
            <button
              onClick={resetForm}
              disabled={isLoading}
              className="px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-lg transition duration-300 disabled:opacity-50"
            >
              {t.cancel}
            </button>
          )}
        </div>
      </div>
      
      <div className="bg-gray-800 rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4 text-white">{t.announcements}</h2>
        
        {announcements.length === 0 ? (
          <p className="text-gray-400">{t.noAnnouncementsFound}</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-gray-700 rounded-lg overflow-hidden">
              <thead className="bg-gray-600">
                <tr>
                  <th className="py-3 px-4 text-left text-gray-300">Language</th>
                  <th className="py-3 px-4 text-left text-gray-300">{t.title}</th>
                  <th className="py-3 px-4 text-left text-gray-300">Publish Status</th>
                  <th className="py-3 px-4 text-left text-gray-300">Display Order</th>
                  <th className="py-3 px-4 text-left text-gray-300">{t.actions}</th>
                </tr>
              </thead>
              <tbody>
                {announcements.map((announcement) => (
                  <tr key={announcement.id} className="border-b border-gray-600 hover:bg-gray-600">
                    <td className="py-3 px-4 text-gray-300">{announcement.language_code}</td>
                    <td className="py-3 px-4 text-gray-300">{announcement.title}</td>
                    <td className="py-3 px-4 text-gray-300">
                      {announcement.is_published ? (
                        <span className="px-2 py-1 bg-green-600 rounded text-xs">Published</span>
                      ) : (
                        <span className="px-2 py-1 bg-yellow-600 rounded text-xs">Draft</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-gray-300">{announcement.display_order}</td>
                    <td className="py-3 px-4">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(announcement)}
                          disabled={isLoading}
                          className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition duration-300 disabled:opacity-50"
                        >
                          {t.edit}
                        </button>
                        <button
                          onClick={() => handleDelete(announcement.id)}
                          disabled={isLoading}
                          className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded-lg transition duration-300 disabled:opacity-50"
                        >
                          {t.delete}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default AnnouncementManager