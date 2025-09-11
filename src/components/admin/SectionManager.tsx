import React, { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { toast } from '@/components/ui/use-toast'
import { useAdminLanguage } from '@/components/admin/AdminLanguageProvider'
import { Loader2, Plus, Edit3, Trash2, Upload } from 'lucide-react'

interface PageSection {
  id: string
  section_key: string
  section_name: string
  background_image_url: string | null
  is_active: boolean
  created_at: string
  updated_at: string
}

interface PageSectionFormData {
  id?: string
  section_key: string
  section_name: string
  background_image_url: string
  is_active: boolean
}

const SectionManager = () => {
  const { t } = useAdminLanguage()
  const [sections, setSections] = useState<PageSection[]>([])
  const [formData, setFormData] = useState<PageSectionFormData>({
    section_key: '',
    section_name: '',
    background_image_url: '',
    is_active: true
  })
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [selectedSection, setSelectedSection] = useState<string | null>(null)
  // Novo stanje za prikaz sekcije korisnicima
  const [sectionPreview, setSectionPreview] = useState<{
    selectedSectionId: string | null
    displayName: string
    imageUrl: string
  }>({
    selectedSectionId: null,
    displayName: '',
    imageUrl: ''
  })

  const fetchSections = useCallback(async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('page_sections')
        .select('*')
        .order('section_name')
      
      if (error) throw error
      setSections(data || [])
    } catch (error) {
      console.error('Error fetching sections:', error)
      toast({
        title: t.error,
        description: t.failedToLoadSections,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }, [t])

  useEffect(() => {
    fetchSections()
  }, [fetchSections])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleSelectSection = (sectionId: string) => {
    setSelectedSection(sectionId === selectedSection ? null : sectionId)
  }

  const handleEdit = (section: PageSection) => {
    setFormData({
      id: section.id,
      section_key: section.section_key,
      section_name: section.section_name,
      background_image_url: section.background_image_url || '',
      is_active: section.is_active !== undefined ? section.is_active : true
    })
    setIsEditing(true)
    setSelectedSection(null)
  }

  const resetForm = () => {
    setFormData({
      section_key: '',
      section_name: '',
      background_image_url: '',
      is_active: true
    })
    setIsEditing(false)
  }

  // Funkcija za rukovanje promenom u padajućem meniju sekcija
  const handleSectionPreviewChange = (sectionId: string) => {
    const section = sections.find(s => s.id === sectionId)
    if (section) {
      setSectionPreview({
        selectedSectionId: sectionId,
        displayName: section.section_name,
        imageUrl: section.background_image_url || ''
      })
    }
  }

  // Funkcija za ažuriranje prikazanog imena sekcije
  const handleDisplayNameChange = (name: string) => {
    setSectionPreview(prev => ({
      ...prev,
      displayName: name
    }))
  }

  // Funkcija za ažuriranje URL-a slike
  const handleImageUrlChange = (url: string) => {
    setSectionPreview(prev => ({
      ...prev,
      imageUrl: url
    }))
  }

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      setSaving(true)
      
      // Prepare section data
      const sectionData = {
        section_key: formData.section_key,
        section_name: formData.section_name,
        background_image_url: formData.background_image_url || null,
        is_active: formData.is_active
      }
      
      if (isEditing && formData.id) {
        // Update existing section
        const { error } = await supabase
          .from('page_sections')
          .update(sectionData)
          .eq('id', formData.id)
        
        if (error) throw error
        
        toast({
          title: t.sectionUpdatedSuccessfully,
          description: t.sectionUpdatedDescription,
        })
      } else {
        // Insert new section
        const { error } = await supabase
          .from('page_sections')
          .insert(sectionData)
        
        if (error) throw error
        
        toast({
          title: t.sectionCreatedSuccessfully,
          description: t.sectionCreatedDescription,
        })
      }
      
      resetForm()
      fetchSections()
    } catch (error) {
      console.error('Error saving section:', error)
      toast({
        title: t.error,
        description: t.failedToSaveSection,
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }, [formData, isEditing, fetchSections, t])

  const handleDelete = useCallback(async (id: string) => {
    if (!window.confirm(t.confirmDeleteSection)) return

    try {
      setLoading(true)
      const { error } = await supabase
        .from('page_sections')
        .delete()
        .eq('id', id)
      
      if (error) throw error
      
      toast({
        title: t.sectionDeletedSuccessfully,
        description: t.sectionDeletedDescription,
      })
      
      fetchSections()
    } catch (error) {
      console.error('Error deleting section:', error)
      toast({
        title: t.error,
        description: t.failedToDeleteSection,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }, [fetchSections, t])

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
        <h2 className="text-2xl font-bold text-white">{t.pageSections}</h2>
      </div>

      {/* Sekcija za prikaz sekcije korisnicima */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-xl font-semibold mb-4 text-white">{t.previewSectionForUsers}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-gray-300 mb-2">{t.selectSection}</label>
            <select
              value={sectionPreview.selectedSectionId || ''}
              onChange={(e) => handleSectionPreviewChange(e.target.value)}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-white"
              aria-label={t.selectSection}
            >
              <option value="">{t.selectSectionPlaceholder}</option>
              {sections
                .filter(section => section.is_active)
                .map((section) => (
                  <option key={section.id} value={section.id}>
                    {section.section_name}
                  </option>
                ))}
            </select>
          </div>

          {sectionPreview.selectedSectionId && (
            <>
              <div>
                <label className="block text-gray-300 mb-2">{t.sectionDisplayName}</label>
                <input
                  type="text"
                  value={sectionPreview.displayName}
                  onChange={(e) => handleDisplayNameChange(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-white"
                  aria-label={t.sectionDisplayName}
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-gray-300 mb-2">{t.sectionImageUrl}</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={sectionPreview.imageUrl}
                    onChange={(e) => handleImageUrlChange(e.target.value)}
                    className="flex-1 px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-white"
                    placeholder={t.imageUrlPlaceholder}
                    aria-label={t.sectionImageUrl}
                  />
                  <button
                    type="button"
                    className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg flex items-center gap-2"
                  >
                    <Upload className="w-5 h-5" />
                    {t.upload}
                  </button>
                </div>
              </div>
              
              {/* Prikaz izgleda sekcije */}
              <div className="md:col-span-2 mt-4">
                <h4 className="text-lg font-medium text-white mb-2">{t.preview}:</h4>
                <div className="border border-gray-600 rounded-lg p-4 bg-gray-700">
                  <div className="flex items-center gap-4">
                    {sectionPreview.imageUrl && (
                      <div className="w-16 h-16 bg-gray-600 rounded-md overflow-hidden">
                        <img 
                          src={sectionPreview.imageUrl} 
                          alt={sectionPreview.displayName}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                          }}
                        />
                      </div>
                    )}
                    <div>
                      <h5 className="text-white font-medium">{sectionPreview.displayName}</h5>
                      <p className="text-gray-400 text-sm">
                        {sectionPreview.imageUrl ? t.imageLoaded : t.noImage}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="bg-gray-800 rounded-lg p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-300 mb-2">{t.sectionKey}</label>
              <input
                type="text"
                name="section_key"
                value={formData.section_key}
                onChange={handleInputChange}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-white"
                required
                disabled={isEditing}
                aria-label={t.sectionKey}
              />
            </div>

            <div>
              <label className="block text-gray-300 mb-2">{t.sectionName}</label>
              <input
                type="text"
                name="section_name"
                value={formData.section_name}
                onChange={handleInputChange}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-white"
                required
                aria-label={t.sectionName}
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-gray-300 mb-2">{t.backgroundImageUrl} ({t.optional})</label>
              <div className="flex gap-2">
                <input
                  type="url"
                  name="background_image_url"
                  value={formData.background_image_url}
                  onChange={handleInputChange}
                  className="flex-1 px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-white"
                  placeholder="https://example.com/background-image.jpg"
                  aria-label={t.backgroundImageUrl}
                />
                <button
                  type="button"
                  className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg flex items-center gap-2"
                >
                  <Upload className="w-5 h-5" />
                  {t.upload}
                </button>
              </div>
            </div>

            <div>
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
          </div>

          <div className="flex space-x-3">
            <button
              type="submit"
              disabled={saving}
              className="flex items-center space-x-2 px-4 py-2 bg-orange-600 hover:bg-orange-700 disabled:opacity-50 text-white rounded-lg transition duration-300"
            >
              {saving ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Plus className="w-5 h-5" />
              )}
              <span>{isEditing ? t.updateSection : t.addSection}</span>
            </button>
            
            {isEditing && (
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition duration-300"
              >
                {t.cancel}
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-xl font-semibold mb-4 text-white">{t.existingSections}</h3>
        
        {sections.length === 0 ? (
          <p className="text-gray-400 text-center py-8">{t.noPageSectionsFound}</p>
        ) : (
          <div className="space-y-4">
            {sections.map((section) => (
              <div 
                key={section.id} 
                className="bg-gray-700 rounded-lg p-4 border border-gray-600"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-white">{section.section_name}</h4>
                      {!section.is_active && (
                        <span className="text-xs bg-gray-600 text-gray-300 px-2 py-1 rounded">
                          {t.inactive}
                        </span>
                      )}
                    </div>
                    <p className="text-gray-400 text-sm mt-1">{section.section_key}</p>
                    {section.background_image_url && (
                      <p className="text-gray-400 text-sm mt-2 break-all">
                        <span className="font-medium">{t.backgroundImage}:</span>{" "}
                        <span className="text-gray-300">{section.background_image_url}</span>
                      </p>
                    )}
                  </div>
                  
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleSelectSection(section.id)}
                      className="p-2 text-gray-400 hover:text-white hover:bg-gray-600 rounded-full transition duration-300"
                      aria-label={t.edit}
                    >
                      <Edit3 className="w-5 h-5" />
                    </button>
                    
                    <button
                      onClick={() => handleEdit(section)}
                      className="p-2 text-gray-400 hover:text-white hover:bg-gray-600 rounded-full transition duration-300"
                      aria-label={t.edit}
                    >
                      <Edit3 className="w-5 h-5" />
                    </button>
                    
                    <button
                      onClick={() => handleDelete(section.id)}
                      className="p-2 text-gray-400 hover:text-red-400 hover:bg-gray-600 rounded-full transition duration-300"
                      aria-label={t.delete}
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                
                {selectedSection === section.id && (
                  <div className="mt-4 pt-4 border-t border-gray-600">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-gray-300 mb-2 text-sm">{t.sectionName}</label>
                        <input
                          type="text"
                          value={section.section_name}
                          onChange={(e) => {
                            const updatedSections = sections.map(s => 
                              s.id === section.id 
                                ? { ...s, section_name: e.target.value } 
                                : s
                            )
                            setSections(updatedSections)
                          }}
                          className="w-full px-3 py-1 bg-gray-600 border border-gray-500 rounded focus:outline-none focus:ring-1 focus:ring-orange-500 text-white text-sm"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-gray-300 mb-2 text-sm">{t.backgroundImageUrl}</label>
                        <input
                          type="text"
                          value={section.background_image_url || ''}
                          onChange={(e) => {
                            const updatedSections = sections.map(s => 
                              s.id === section.id 
                                ? { ...s, background_image_url: e.target.value || null } 
                                : s
                            )
                            setSections(updatedSections)
                          }}
                          className="w-full px-3 py-1 bg-gray-600 border border-gray-500 rounded focus:outline-none focus:ring-1 focus:ring-orange-500 text-white text-sm break-all"
                          placeholder="https://example.com/image.jpg"
                        />
                      </div>
                      
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id={`active-${section.id}`}
                          checked={section.is_active}
                          onChange={(e) => {
                            const updatedSections = sections.map(s => 
                              s.id === section.id 
                                ? { ...s, is_active: e.target.checked } 
                                : s
                            )
                            setSections(updatedSections)
                          }}
                          className="rounded bg-gray-600 border-gray-500 text-orange-600 focus:ring-orange-500"
                        />
                        <label htmlFor={`active-${section.id}`} className="ml-2 text-gray-300 text-sm">
                          {t.isActive}
                        </label>
                      </div>
                      
                      <div className="flex space-x-2">
                        <button
                          onClick={async () => {
                            try {
                              const sectionToUpdate = sections.find(s => s.id === section.id)
                              if (sectionToUpdate) {
                                const { error } = await supabase
                                  .from('page_sections')
                                  .update({
                                    section_name: sectionToUpdate.section_name,
                                    background_image_url: sectionToUpdate.background_image_url,
                                    is_active: sectionToUpdate.is_active
                                  })
                                  .eq('id', section.id)
                                
                                if (error) throw error
                                
                                toast({
                                  title: t.sectionUpdatedSuccessfully,
                                  description: t.sectionUpdatedDescription,
                                })
                                
                                setSelectedSection(null)
                                fetchSections()
                              }
                            } catch (error) {
                              console.error('Error updating section:', error)
                              toast({
                                title: t.error,
                                description: t.failedToSaveSection,
                                variant: "destructive",
                              })
                            }
                          }}
                          className="px-3 py-1 bg-orange-600 hover:bg-orange-700 text-white rounded text-sm"
                        >
                          {t.save}
                        </button>
                        
                        <button
                          onClick={() => setSelectedSection(null)}
                          className="px-3 py-1 bg-gray-600 hover:bg-gray-700 text-white rounded text-sm"
                        >
                          {t.cancel}
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default SectionManager