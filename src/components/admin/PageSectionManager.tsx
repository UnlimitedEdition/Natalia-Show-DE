import React, { useEffect, useState } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { PageSection } from '@/integrations/supabase/types'
import { useAdminLanguage } from '@/components/admin/AdminLanguageProvider'
import { toast } from '@/components/ui/use-toast'
import { Loader2, Trash2, Pencil, Save, RotateCw } from 'lucide-react'

const PageSectionManager = () => {
  const { t } = useAdminLanguage()
  const [sections, setSections] = useState<PageSection[]>([])
  const [sectionKey, setSectionKey] = useState('')
  const [sectionName, setSectionName] = useState('')
  const [backgroundImageUrl, setBackgroundImageUrl] = useState('')
  const [backgroundVideoUrl, setBackgroundVideoUrl] = useState('')
  const [isActive, setIsActive] = useState(true)
  const [editingSection, setEditingSection] = useState<PageSection | null>(null)
  
  // Content states for each language
  const [serbianContent, setSerbianContent] = useState({ title: '', description: '' })
  const [englishContent, setEnglishContent] = useState({ title: '', description: '' })
  const [germanContent, setGermanContent] = useState({ title: '', description: '' })
  // Additional content states for podcast section
  const [serbianPodcastContent, setSerbianPodcastContent] = useState({ 
    title: '', 
    description: '',
    podcastTitle: '',
    loadMore: '',
    loading: ''
  })
  const [englishPodcastContent, setEnglishPodcastContent] = useState({ 
    title: '', 
    description: '',
    podcastTitle: '',
    loadMore: '',
    loading: ''
  })
  const [germanPodcastContent, setGermanPodcastContent] = useState({ 
    title: '', 
    description: '',
    podcastTitle: '',
    loadMore: '',
    loading: ''
  })
  const [translating, setTranslating] = useState<boolean>(false)
  const [saving, setSaving] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    fetchSections()
  }, [])

  const fetchSections = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('page_sections')
        .select('*')
        .order('section_key')
      
      if (error) throw error
      
      if (data) {
        setSections(data)
      }
    } catch (error: unknown) {
      console.error('Error loading sections:', error)
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'An unknown error occurred';
      toast({
        title: "Грешка",
        description: `Неуспешно учитавање секција: ${errorMessage}`,
        variant: "destructive",
      });
    } finally {
      setLoading(false)
    }
  }

  const createSectionContent = async (sectionKey: string): Promise<void> => {
    try {
      // Create content for each language
      const languages: Array<{code: string, title: string, description: string}> = [
        { code: 'sr', title: serbianContent.title, description: serbianContent.description },
        { code: 'en', title: englishContent.title, description: englishContent.description },
        { code: 'de', title: germanContent.title, description: germanContent.description }
      ]
      
      for (const lang of languages) {
        // Handle title content
        if (lang.title) {
          const { error: titleError } = await supabase.from('content').insert({
            section_key: sectionKey,
            content_key: 'title',
            content_value: lang.title,
            language_code: lang.code,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          
          if (titleError) throw titleError
        }
        
        // Handle description content
        if (lang.description) {
          const { error: descriptionError } = await supabase.from('content').insert({
            section_key: sectionKey,
            content_key: 'description',
            content_value: lang.description,
            language_code: lang.code,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          
          if (descriptionError) throw descriptionError
        }
      }
    } catch (error: unknown) {
      console.error('Error creating section content:', error)
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'An unknown error occurred';
        
      toast({
        title: "Грешка",
        description: errorMessage || "Дошло је до грешке приликом креирања садржаја секције. Молимо покушајте поново.",
        variant: "destructive",
      })
      throw error
    }
  }

  const updateSectionContent = async (sectionKey: string): Promise<void> => {
    try {
      // Check if this is a podcast section to determine which content to use
      const isPodcastSection = sectionKey === 'podcast';
      
      if (isPodcastSection) {
        // Handle podcast-specific content
        const podcastContent = [
          { code: 'sr', content: serbianPodcastContent },
          { code: 'en', content: englishPodcastContent },
          { code: 'de', content: germanPodcastContent }
        ];
        
        for (const { code, content } of podcastContent) {
          // Handle all content keys for podcast
          const contentKeys = [
            { key: 'title', value: content.title },
            { key: 'description', value: content.description },
            { key: 'podcastTitle', value: content.podcastTitle },
            { key: 'loadMore', value: content.loadMore },
            { key: 'loading', value: content.loading }
          ];
          
          for (const { key, value } of contentKeys) {
            if (value) {
              await updateOrCreateContent(sectionKey, code, key, value);
            }
          }
        }
      } else {
        // Update content for each language
        const languages: Array<{code: string, title: string, description: string}> = [
          { code: 'sr', title: serbianContent.title, description: serbianContent.description },
          { code: 'en', title: englishContent.title, description: englishContent.description },
          { code: 'de', title: germanContent.title, description: germanContent.description }
        ]
        
        for (const lang of languages) {
          // Handle title content
          if (lang.title) {
            // Check if title content exists
            const { data: titleData, error: titleFetchError } = await supabase
              .from('content')
              .select('id')
              .eq('section_key', sectionKey)
              .eq('language_code', lang.code)
              .eq('content_key', 'title')
            
            if (titleFetchError) throw titleFetchError
            
            if (titleData && titleData.length > 0) {
              // Update existing title content
              const { error: updateError } = await supabase
                .from('content')
                .update({
                  content_value: lang.title,
                  updated_at: new Date().toISOString()
                })
                .eq('id', titleData[0].id)
              
              if (updateError) throw updateError
            } else {
              // Create new title content
              const { error: insertError } = await supabase
                .from('content')
                .insert({
                  section_key: sectionKey,
                  content_key: 'title',
                  content_value: lang.title,
                  language_code: lang.code,
                  created_at: new Date().toISOString(),
                  updated_at: new Date().toISOString()
                })
              
              if (insertError) throw insertError
            }
          }
          
          // Handle description content
          if (lang.description) {
            // Check if description content exists
            const { data: descriptionData, error: descriptionFetchError } = await supabase
              .from('content')
              .select('id')
              .eq('section_key', sectionKey)
              .eq('language_code', lang.code)
              .eq('content_key', 'description')
            
            if (descriptionFetchError) throw descriptionFetchError
            
            if (descriptionData && descriptionData.length > 0) {
              // Update existing description content
              const { error: updateError } = await supabase
                .from('content')
                .update({
                  content_value: lang.description,
                  updated_at: new Date().toISOString()
                })
                .eq('id', descriptionData[0].id)
              
              if (updateError) throw updateError
            } else {
              // Create new description content
              const { error: insertError } = await supabase
                .from('content')
                .insert({
                  section_key: sectionKey,
                  content_key: 'description',
                  content_value: lang.description,
                  language_code: lang.code,
                  created_at: new Date().toISOString(),
                  updated_at: new Date().toISOString()
                })
              
              if (insertError) throw insertError
            }
          }
        }
      }
    } catch (error: unknown) {
      console.error('Error updating section content:', error)
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'An unknown error occurred';
        
      toast({
        title: "Грешка",
        description: errorMessage || "Дошло је до грешке приликом ажурирања садржаја секције. Молимо покушајте поново.",
        variant: "destructive",
      })
      throw error
    }
  }

  // Helper function to update or create content
  const updateOrCreateContent = async (
    sectionKey: string, 
    languageCode: string, 
    contentKey: string, 
    contentValue: string
  ): Promise<void> => {
    if (!contentValue) return;
    
    // Check if content exists
    const { data: existingContent, error: fetchError } = await supabase
      .from('content')
      .select('id')
      .eq('section_key', sectionKey)
      .eq('language_code', languageCode)
      .eq('content_key', contentKey)
      .maybeSingle();

    if (fetchError) throw fetchError;

    if (existingContent) {
      // Update existing content
      const { error: updateError } = await supabase
        .from('content')
        .update({
          content_value: contentValue,
          updated_at: new Date().toISOString()
        })
        .eq('id', existingContent.id);

      if (updateError) throw updateError;
    } else {
      // Create new content
      const { error: insertError } = await supabase
        .from('content')
        .insert({
          section_key: sectionKey,
          content_key: contentKey,
          content_value: contentValue,
          language_code: languageCode,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });

      if (insertError) throw insertError;
    }
  }

  const handleSaveSection = async (): Promise<void> => {
    if (!sectionKey || !sectionName) {
      toast({
        title: "Грешка",
        description: "Кључ и име секције су обavezни",
        variant: "destructive",
      })
      return
    }

    // Check if section key is being changed when editing
    if (editingSection && editingSection.section_key !== sectionKey) {
      toast({
        title: "Грешка",
        description: "Кључ секције се не може мењати јер би то нарушило повезивање са садржајем. Ако желите други кључ, обришите ову секцију и креирајте нову.",
        variant: "destructive",
      })
      return
    }

    try {
      setSaving(true)
      if (editingSection) {
        // Update existing section
        const { error: sectionError } = await supabase
          .from('page_sections')
          .update({
            section_key: sectionKey,
            section_name: sectionName,
            background_image_url: backgroundImageUrl || null,
            background_video_url: backgroundVideoUrl || null,
            is_active: isActive,
            updated_at: new Date().toISOString()
          })
          .eq('id', editingSection.id)
        
        if (sectionError) throw sectionError
        
        // Update content for each language
        await updateSectionContent(sectionKey)
        
        toast({
          title: "Секција ажурирана",
          description: "Секција је успешно ажурирана.",
        })
      } else {
        // Check if section key already exists
        const { data: existingSections, error: checkError } = await supabase
          .from('page_sections')
          .select('id')
          .eq('section_key', sectionKey)
        
        if (checkError) throw checkError
        
        if (existingSections && existingSections.length > 0) {
          toast({
            title: "Грешка",
            description: "Секција са овим кључем већ постоји.",
            variant: "destructive",
          })
          return
        }
        
        // Create new section
        const { error: sectionError } = await supabase
          .from('page_sections')
          .insert({
            section_key: sectionKey,
            section_name: sectionName,
            background_image_url: backgroundImageUrl || null,
            background_video_url: backgroundVideoUrl || null,
            is_active: isActive
          })
        
        if (sectionError) throw sectionError
        
        // Create content for each language
        await createSectionContent(sectionKey)
        
        toast({
          title: "Секција додата",
          description: "Секција је успешно додата.",
        })
      }
      
      // Reset form and refresh data
      resetForm()
      fetchSections()
      
      // Dodajemo notifikaciju о uspešnom čuvanju
      toast({
        title: "Uspešno sačuvano",
        description: "Podaci su uspešno ažurirani.",
      })
    } catch (error: unknown) {
      console.error('Error adding section:', error)
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'An unknown error occurred';
      toast({
        title: "Грешка",
        description: `Неуспешно додавање секције: ${errorMessage}`,
        variant: "destructive",
      });
    } finally {
      setSaving(false)
    }
  }

  const fetchSectionContent = async (sectionKey: string): Promise<void> => {
    try {
      const { data, error } = await supabase
        .from('content')
        .select('*')
        .eq('section_key', sectionKey)
      
      if (error) throw error
      
      // Reset all content states
      setSerbianContent({ title: '', description: '' })
      setEnglishContent({ title: '', description: '' })
      setGermanContent({ title: '', description: '' })
      setSerbianPodcastContent({ title: '', description: '', podcastTitle: '', loadMore: '', loading: '' })
      setEnglishPodcastContent({ title: '', description: '', podcastTitle: '', loadMore: '', loading: '' })
      setGermanPodcastContent({ title: '', description: '', podcastTitle: '', loadMore: '', loading: '' })
      
      // Process content by language and content key
      if (data) {
        // Group content by language
        const contentByLanguage: Record<string, Record<string, string>> = {}
        data.forEach(item => {
          if (!contentByLanguage[item.language_code]) {
            contentByLanguage[item.language_code] = {}
          }
          contentByLanguage[item.language_code][item.content_key] = item.content_value
        })
        
        // Set content for each language based on section type
        if (sectionKey === 'podcast') {
          // Handle podcast-specific content
          setSerbianPodcastContent({
            title: contentByLanguage['sr']?.title || '',
            description: contentByLanguage['sr']?.description || '',
            podcastTitle: contentByLanguage['sr']?.podcastTitle || '',
            loadMore: contentByLanguage['sr']?.loadMore || '',
            loading: contentByLanguage['sr']?.loading || ''
          })
          
          setEnglishPodcastContent({
            title: contentByLanguage['en']?.title || '',
            description: contentByLanguage['en']?.description || '',
            podcastTitle: contentByLanguage['en']?.podcastTitle || '',
            loadMore: contentByLanguage['en']?.loadMore || '',
            loading: contentByLanguage['en']?.loading || ''
          })
          
          setGermanPodcastContent({
            title: contentByLanguage['de']?.title || '',
            description: contentByLanguage['de']?.description || '',
            podcastTitle: contentByLanguage['de']?.podcastTitle || '',
            loadMore: contentByLanguage['de']?.loadMore || '',
            loading: contentByLanguage['de']?.loading || ''
          })
        } else {
          // Handle regular section content
          setSerbianContent({
            title: contentByLanguage['sr']?.title || '',
            description: contentByLanguage['sr']?.description || ''
          })
          
          setEnglishContent({
            title: contentByLanguage['en']?.title || '',
            description: contentByLanguage['en']?.description || ''
          })
          
          setGermanContent({
            title: contentByLanguage['de']?.title || '',
            description: contentByLanguage['de']?.description || ''
          })
        }
      }
    } catch (error: unknown) {
      console.error('Error fetching section content:', error)
      toast({
        title: "Грешка",
        description: (error as Error).message || "Дошло је до грешке приликом учитавања садржаја секције. Молимо покушајте поново.",
        variant: "destructive",
      })
    }
  }

  const handleEdit = async (section: PageSection): Promise<void> => {
    setEditingSection(section)
    setSectionKey(section.section_key)
    setSectionName(section.section_name)
    setBackgroundImageUrl(section.background_image_url || '')
    setBackgroundVideoUrl(section.background_video_url || '')
    setIsActive(section.is_active)
    
    // Fetch content for this section or initialize with empty content if undefined
    await fetchSectionContent(section.section_key)
  }

  const handleAutoTranslate = async () => {
    if (!serbianContent.title && !serbianContent.description && 
        !englishContent.title && !englishContent.description && 
        !germanContent.title && !germanContent.description) {
      toast({
        title: "Нема садржаја за превођење",
        description: "Молимо унесите садржај бар на једном језику пре него што покренете аутоматско превођење.",
        variant: "destructive",
      })
      return
    }

    setTranslating(true)
    
    try {
      // Determine source language based on which content is filled
      let sourceLang = 'sr'
      let sourceTitle = serbianContent.title
      let sourceDescription = serbianContent.description
      
      if (englishContent.title || englishContent.description) {
        sourceLang = 'en'
        sourceTitle = englishContent.title
        sourceDescription = englishContent.description
      } else if (germanContent.title || germanContent.description) {
        sourceLang = 'de'
        sourceTitle = germanContent.title
        sourceDescription = germanContent.description
      }
      
      // Translate to other languages
      const targetLanguages = ['sr', 'en', 'de'].filter(lang => lang !== sourceLang)
      
      for (const targetLang of targetLanguages) {
        if (sourceTitle) {
          const translatedTitle = await translateText(sourceTitle, sourceLang, targetLang)
          if (targetLang === 'sr') {
            setSerbianContent(prev => ({ ...prev, title: translatedTitle }))
          } else if (targetLang === 'en') {
            setEnglishContent(prev => ({ ...prev, title: translatedTitle }))
          } else if (targetLang === 'de') {
            setGermanContent(prev => ({ ...prev, title: translatedTitle }))
          }
        }
        
        if (sourceDescription) {
          const translatedDescription = await translateText(sourceDescription, sourceLang, targetLang)
          if (targetLang === 'sr') {
            setSerbianContent(prev => ({ ...prev, description: translatedDescription }))
          } else if (targetLang === 'en') {
            setEnglishContent(prev => ({ ...prev, description: translatedDescription }))
          } else if (targetLang === 'de') {
            setGermanContent(prev => ({ ...prev, description: translatedDescription }))
          }
        }
      }
      
      toast({
        title: "Превод завршен",
        description: "Садржај је аутоматски преведен на све језике.",
      })
    } catch (error: unknown) {
      console.error('Error during auto translation:', error)
      toast({
        title: "Грешка при превођењу",
        description: "Неуспело превођење садржаја: " + (error instanceof Error ? error.message : 'Unknown error'),
        variant: "destructive",
      })
    } finally {
      setTranslating(false)
    }
  }

  // Function to translate text using LibreTranslate API
  const translateText = async (text: string, sourceLang: string, targetLang: string): Promise<string> => {
    try {
      // Don't attempt translation if text is empty
      if (!text.trim()) {
        return text;
      }
      
      const response = await fetch('https://libretranslate.com/translate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          q: text,
          source: sourceLang,
          target: targetLang,
          format: 'text'
        })
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`Translation failed with status ${response.status}: ${errorData.message || 'Unknown error'}`);
      }

      const data = await response.json();
      return data.translatedText || text;
    } catch (error: unknown) {
      console.error(`Error translating from ${sourceLang} to ${targetLang}:`, error);
      toast({
        title: "Грешка при превођењу",
        description: `Неуспело превођење са ${sourceLang} на ${targetLang}: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive",
      });
      // Return original text if translation fails
      return text;
    }
  }

  const handleDelete = async (id: string): Promise<void> => {
    try {
      // First delete all content associated with this section
      const { data: sectionData, error: fetchError } = await supabase
        .from('page_sections')
        .select('section_key')
        .eq('id', id)
      
      if (fetchError) throw fetchError
      
      if (sectionData && sectionData.length > 0) {
        const sectionKey = sectionData[0].section_key
        
        // Delete all content for this section
        const { error: deleteContentError } = await supabase
          .from('content')
          .delete()
          .eq('section_key', sectionKey)
        
        if (deleteContentError) throw deleteContentError
      }
      
      // Then delete the section itself
      const { error: deleteSectionError } = await supabase
        .from('page_sections')
        .delete()
        .eq('id', id)
      
      if (deleteSectionError) throw deleteSectionError
      
      toast({
        title: "Секција обрисана",
        description: "Секција је успешно обрисана заједно са свим повезаним садржајем.",
      })
      
      fetchSections()
    } catch (error: unknown) {
      console.error('Error deleting section:', error)
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'An unknown error occurred';
      toast({
        title: "Грешка",
        description: `Неуспешно брисање секције: ${errorMessage}`,
        variant: "destructive",
      });
    }
  }

  const resetForm = (): void => {
    setEditingSection(null)
    setSectionKey('')
    setSectionName('')
    setBackgroundImageUrl('')
    setBackgroundVideoUrl('')
    setIsActive(true)
    setSerbianContent({ title: '', description: '' })
    setEnglishContent({ title: '', description: '' })
    setGermanContent({ title: '', description: '' })
    // Reset podcast content states
    setSerbianPodcastContent({ 
      title: '', 
      description: '', 
      podcastTitle: '', 
      loadMore: '', 
      loading: '' 
    })
    setEnglishPodcastContent({ 
      title: '', 
      description: '', 
      podcastTitle: '', 
      loadMore: '', 
      loading: '' 
    })
    setGermanPodcastContent({ 
      title: '', 
      description: '', 
      podcastTitle: '', 
      loadMore: '', 
      loading: '' 
    })
  }

  return (
    <div className="bg-gray-800 rounded-xl p-6">
      <h2 className="text-2xl font-bold mb-6 text-orange-500">{t.pageSectionManager}</h2>
      
      <div className="bg-gray-700 rounded-lg p-6 mb-8">
        <h3 className="text-xl font-bold mb-4 text-white">
          {editingSection ? t.updateSection : t.addSection}
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {editingSection ? (
            // When editing, show the section key as non-editable text
            <div>
              <label className="block text-gray-300 mb-2">{t.sectionKey}</label>
              <div className="w-full px-4 py-2 bg-gray-600 border border-gray-500 rounded-lg text-white">
                {sectionKey}
              </div>
              <p className="text-gray-400 text-sm mt-1">Ово поље се не може мењати јер се користи за повезивање садржаја са страницом.</p>
            </div>
          ) : (
            // When creating new section, show dropdown with predefined options
            <div>
              <label className="block text-gray-300 mb-2">{t.sectionKey}</label>
              <select
                value={sectionKey}
                onChange={(e) => setSectionKey(e.target.value)}
                className="w-full px-4 py-2 bg-gray-600 border border-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-white"
                disabled={saving}
              >
                <option value="">Изаберите кључ секције</option>
                <option value="hero">hero (Hero секција)</option>
                <option value="podcast">podcast (Подкаст секција)</option>
                <option value="cultural">cultural (Ромска vesеља секција)</option>
                <option value="kitchen">kitchen (Кухиња са гостима секција)</option>
                <option value="diaspora">diaspora (Дијаспора и Балкан секција)</option>
                <option value="contact">contact (Контакт секција)</option>
              </select>
              <p className="text-gray-400 text-sm mt-1">Изаберите кључ секције коју желите да креирате.</p>
            </div>
          )}
          
          <div>
            <label className="block text-gray-300 mb-2">{t.sectionName}</label>
            <input
              type="text"
              value={sectionName}
              onChange={(e) => setSectionName(e.target.value)}
              className="w-full px-4 py-2 bg-gray-600 border border-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-white"
              placeholder={t.enterContentValue}
              disabled={saving}
            />
          </div>
          
          <div>
            <label className="block text-gray-300 mb-2">{t.backgroundImageUrl}</label>
            <input
              type="text"
              value={backgroundImageUrl}
              onChange={(e) => setBackgroundImageUrl(e.target.value)}
              className="w-full px-4 py-2 bg-gray-600 border border-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-white"
              placeholder="https://example.com/background.jpg"
              disabled={saving}
            />
          </div>
          
          <div>
            <label className="block text-gray-300 mb-2">{t.backgroundVideoUrl}</label>
            <input
              type="text"
              value={backgroundVideoUrl}
              onChange={(e) => setBackgroundVideoUrl(e.target.value)}
              className="w-full px-4 py-2 bg-gray-600 border border-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-white"
              placeholder="https://example.com/background.mp4"
              disabled={saving}
            />
          </div>
          
          <div className="md:col-span-2">
            <div className="border-t border-gray-700 pt-4 mt-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold mb-4 text-white">Управљање садржајем</h3>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleAutoTranslate}
                    disabled={translating || saving}
                    className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition duration-300 disabled:opacity-50 flex items-center"
                  >
                    {translating ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                        Преводимо...
                      </>
                    ) : (
                      <>
                        <RotateCw className="w-4 h-4 mr-1" />
                        {t.automaticallyTranslate}
                      </>
                    )}
                  </button>
                </div>
              </div>
              
              {/* Serbian Content */}
              <div className="mb-6 p-4 bg-gray-700 rounded-lg">
                <h4 className="text-md font-semibold mb-3 text-white">Српски садржај</h4>
                {sectionKey === 'podcast' ? (
                  <>
                    {/* Podcast-specific fields for Serbian */}
                    <div className="mb-3">
                      <label className="block text-gray-300 mb-2">Наслов секције</label>
                      <input
                        type="text"
                        value={serbianPodcastContent.title}
                        onChange={(e) => setSerbianPodcastContent({...serbianPodcastContent, title: e.target.value})}
                        className="w-full px-4 py-2 bg-gray-600 border border-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-white"
                        placeholder="Унесите наслов секције на српском језику"
                        disabled={saving}
                      />
                    </div>
                    <div className="mb-3">
                      <label className="block text-gray-300 mb-2">Опис секције</label>
                      <textarea
                        value={serbianPodcastContent.description}
                        onChange={(e) => setSerbianPodcastContent({...serbianPodcastContent, description: e.target.value})}
                        className="w-full px-4 py-2 bg-gray-600 border border-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-white"
                        rows={4}
                        placeholder="Унесите опис секције на српском језику"
                        disabled={saving}
                      />
                    </div>
                    <div className="mb-3">
                      <label className="block text-gray-300 mb-2">Наслов подкаста</label>
                      <input
                        type="text"
                        value={serbianPodcastContent.podcastTitle}
                        onChange={(e) => setSerbianPodcastContent({...serbianPodcastContent, podcastTitle: e.target.value})}
                        className="w-full px-4 py-2 bg-gray-600 border border-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-white"
                        placeholder="Унесите наслов подкаста на српском језику"
                        disabled={saving}
                      />
                    </div>
                    <div className="mb-3">
                      <label className="block text-gray-300 mb-2">Текст дугмета 'Учитај још'</label>
                      <input
                        type="text"
                        value={serbianPodcastContent.loadMore}
                        onChange={(e) => setSerbianPodcastContent({...serbianPodcastContent, loadMore: e.target.value})}
                        className="w-full px-4 py-2 bg-gray-600 border border-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-white"
                        placeholder="Унесите текст дугмета 'Учитај још' на српском језику"
                        disabled={saving}
                      />
                    </div>
                    <div className="mb-3">
                      <label className="block text-gray-300 mb-2">Текст током учитавања</label>
                      <input
                        type="text"
                        value={serbianPodcastContent.loading}
                        onChange={(e) => setSerbianPodcastContent({...serbianPodcastContent, loading: e.target.value})}
                        className="w-full px-4 py-2 bg-gray-600 border border-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-white"
                        placeholder="Унесите текст током учитавања на српском језику"
                        disabled={saving}
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="mb-3">
                      <label className="block text-gray-300 mb-2">Наслов</label>
                      <input
                        type="text"
                        value={serbianContent.title}
                        onChange={(e) => setSerbianContent({...serbianContent, title: e.target.value})}
                        className="w-full px-4 py-2 bg-gray-600 border border-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-white"
                        placeholder="Унесите наслов на српском језику"
                        disabled={saving}
                      />
                    </div>
                    <div>
                      <label className="block text-gray-300 mb-2">Опис</label>
                      <textarea
                        value={serbianContent.description}
                        onChange={(e) => setSerbianContent({...serbianContent, description: e.target.value})}
                        className="w-full px-4 py-2 bg-gray-600 border border-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-white"
                        rows={4}
                        placeholder="Унесите опис на српском језику"
                        disabled={saving}
                      />
                    </div>
                  </>
                )}
              </div>
              
              {/* English Content */}
              <div className="mb-6 p-4 bg-gray-700 rounded-lg">
                <h4 className="text-md font-semibold mb-3 text-white">Енглески садржај</h4>
                {sectionKey === 'podcast' ? (
                  <>
                    {/* Podcast-specific fields for English */}
                    <div className="mb-3">
                      <label className="block text-gray-300 mb-2">Section Title</label>
                      <input
                        type="text"
                        value={englishPodcastContent.title}
                        onChange={(e) => setEnglishPodcastContent({...englishPodcastContent, title: e.target.value})}
                        className="w-full px-4 py-2 bg-gray-600 border border-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-white"
                        placeholder="Enter section title in English"
                        disabled={saving}
                      />
                    </div>
                    <div className="mb-3">
                      <label className="block text-gray-300 mb-2">Section Description</label>
                      <textarea
                        value={englishPodcastContent.description}
                        onChange={(e) => setEnglishPodcastContent({...englishPodcastContent, description: e.target.value})}
                        className="w-full px-4 py-2 bg-gray-600 border border-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-white"
                        rows={4}
                        placeholder="Enter section description in English"
                        disabled={saving}
                      />
                    </div>
                    <div className="mb-3">
                      <label className="block text-gray-300 mb-2">Podcast Title</label>
                      <input
                        type="text"
                        value={englishPodcastContent.podcastTitle}
                        onChange={(e) => setEnglishPodcastContent({...englishPodcastContent, podcastTitle: e.target.value})}
                        className="w-full px-4 py-2 bg-gray-600 border border-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-white"
                        placeholder="Enter podcast title in English"
                        disabled={saving}
                      />
                    </div>
                    <div className="mb-3">
                      <label className="block text-gray-300 mb-2">Load More Button Text</label>
                      <input
                        type="text"
                        value={englishPodcastContent.loadMore}
                        onChange={(e) => setEnglishPodcastContent({...englishPodcastContent, loadMore: e.target.value})}
                        className="w-full px-4 py-2 bg-gray-600 border border-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-white"
                        placeholder="Enter 'Load More' button text in English"
                        disabled={saving}
                      />
                    </div>
                    <div className="mb-3">
                      <label className="block text-gray-300 mb-2">Loading Text</label>
                      <input
                        type="text"
                        value={englishPodcastContent.loading}
                        onChange={(e) => setEnglishPodcastContent({...englishPodcastContent, loading: e.target.value})}
                        className="w-full px-4 py-2 bg-gray-600 border border-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-white"
                        placeholder="Enter loading text in English"
                        disabled={saving}
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="mb-3">
                      <label className="block text-gray-300 mb-2">Наслов</label>
                      <input
                        type="text"
                        value={englishContent.title}
                        onChange={(e) => setEnglishContent({...englishContent, title: e.target.value})}
                        className="w-full px-4 py-2 bg-gray-600 border border-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-white"
                        placeholder="Enter title in English"
                        disabled={saving}
                      />
                    </div>
                    <div>
                      <label className="block text-gray-300 mb-2">Опис</label>
                      <textarea
                        value={englishContent.description}
                        onChange={(e) => setEnglishContent({...englishContent, description: e.target.value})}
                        className="w-full px-4 py-2 bg-gray-600 border border-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-white"
                        rows={4}
                        placeholder="Enter description in English"
                        disabled={saving}
                      />
                    </div>
                  </>
                )}
              </div>
              
              {/* German Content */}
              <div className="mb-6 p-4 bg-gray-700 rounded-lg">
                <h4 className="text-md font-semibold mb-3 text-white">Немачки садржај</h4>
                {sectionKey === 'podcast' ? (
                  <>
                    {/* Podcast-specific fields for German */}
                    <div className="mb-3">
                      <label className="block text-gray-300 mb-2">Abschnittstitel</label>
                      <input
                        type="text"
                        value={germanPodcastContent.title}
                        onChange={(e) => setGermanPodcastContent({...germanPodcastContent, title: e.target.value})}
                        className="w-full px-4 py-2 bg-gray-600 border border-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-white"
                        placeholder="Geben Sie den Abschnittstitel auf Deutsch ein"
                        disabled={saving}
                      />
                    </div>
                    <div className="mb-3">
                      <label className="block text-gray-300 mb-2">Abschnittsbeschreibung</label>
                      <textarea
                        value={germanPodcastContent.description}
                        onChange={(e) => setGermanPodcastContent({...germanPodcastContent, description: e.target.value})}
                        className="w-full px-4 py-2 bg-gray-600 border border-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-white"
                        rows={4}
                        placeholder="Geben Sie die Abschnittsbeschreibung auf Deutsch ein"
                        disabled={saving}
                      />
                    </div>
                    <div className="mb-3">
                      <label className="block text-gray-300 mb-2">Podcast-Titel</label>
                      <input
                        type="text"
                        value={germanPodcastContent.podcastTitle}
                        onChange={(e) => setGermanPodcastContent({...germanPodcastContent, podcastTitle: e.target.value})}
                        className="w-full px-4 py-2 bg-gray-600 border border-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-white"
                        placeholder="Geben Sie den Podcast-Titel auf Deutsch ein"
                        disabled={saving}
                      />
                    </div>
                    <div className="mb-3">
                      <label className="block text-gray-300 mb-2">Text der Schaltfläche 'Mehr laden'</label>
                      <input
                        type="text"
                        value={germanPodcastContent.loadMore}
                        onChange={(e) => setGermanPodcastContent({...germanPodcastContent, loadMore: e.target.value})}
                        className="w-full px-4 py-2 bg-gray-600 border border-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-white"
                        placeholder="Geben Sie den Text der Schaltfläche 'Mehr laden' auf Deutsch ein"
                        disabled={saving}
                      />
                    </div>
                    <div className="mb-3">
                      <label className="block text-gray-300 mb-2">Ladetext</label>
                      <input
                        type="text"
                        value={germanPodcastContent.loading}
                        onChange={(e) => setGermanPodcastContent({...germanPodcastContent, loading: e.target.value})}
                        className="w-full px-4 py-2 bg-gray-600 border border-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-white"
                        placeholder="Geben Sie den Ladetext auf Deutsch ein"
                        disabled={saving}
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="mb-3">
                      <label className="block text-gray-300 mb-2">Наслов</label>
                      <input
                        type="text"
                        value={germanContent.title}
                        onChange={(e) => setGermanContent({...germanContent, title: e.target.value})}
                        className="w-full px-4 py-2 bg-gray-600 border border-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-white"
                        placeholder="Titel auf Deutsch eingeben"
                        disabled={saving}
                      />
                    </div>
                    <div>
                      <label className="block text-gray-300 mb-2">Опис</label>
                      <textarea
                        value={germanContent.description}
                        onChange={(e) => setGermanContent({...germanContent, description: e.target.value})}
                        className="w-full px-4 py-2 bg-gray-600 border border-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-white"
                        rows={4}
                        placeholder="Beschreibung auf Deutsch eingeben"
                        disabled={saving}
                      />
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              id="isActive"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="mr-2 h-5 w-5 text-orange-600 rounded focus:ring-orange-500"
              disabled={saving}
            />
            <label htmlFor="isActive" className="text-gray-300">{t.isActive}</label>
          </div>
        </div>
        
        <div className="flex space-x-4 mt-6">
          <button
            onClick={handleSaveSection}
            className="px-6 py-2 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-lg transition duration-300 flex items-center disabled:opacity-50"
            disabled={saving}
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Сачувавам...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                {editingSection ? t.updateSection : t.addSection}
              </>
            )}
          </button>
          
          {editingSection && (
            <button
              onClick={resetForm}
              className="px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-lg transition duration-300"
              disabled={saving}
            >
              {t.cancel}
            </button>
          )}
        </div>
      </div>
      
      <div className="bg-gray-800 rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4 text-white">{t.sectionList}</h2>
        
        {loading ? (
          <div className="flex justify-center items-center h-32">
            <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
          </div>
        ) : sections.length === 0 ? (
          <p className="text-gray-400">{t.noSectionsFound}</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="py-3 px-4 text-gray-300 font-semibold">{t.sectionKey}</th>
                  <th className="py-3 px-4 text-gray-300 font-semibold">{t.sectionName}</th>
                  <th className="py-3 px-4 text-gray-300 font-semibold">{t.isActive}</th>
                  <th className="py-3 px-4 text-gray-300 font-semibold">{t.actions}</th>
                </tr>
              </thead>
              <tbody>
                {sections.map((section) => (
                  <tr key={section.id} className="border-b border-gray-700 hover:bg-gray-750">
                    <td className="py-3 px-4 text-white">{section.section_key}</td>
                    <td className="py-3 px-4 text-gray-300">{section.section_name}</td>
                    <td className="py-3 px-4 text-gray-300">{section.is_active ? 'Да' : 'Не'}</td>
                    <td className="py-3 px-4">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(section)}
                          className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition duration-300 flex items-center disabled:opacity-50"
                          disabled={saving}
                        >
                          <Pencil className="w-4 h-4 mr-1" />
                          {t.edit}
                        </button>
                        <button
                          onClick={() => handleDelete(section.id)}
                          className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded-lg transition duration-300 flex items-center disabled:opacity-50"
                          disabled={saving}
                        >
                          <Trash2 className="w-4 h-4 mr-1" />
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

export default PageSectionManager