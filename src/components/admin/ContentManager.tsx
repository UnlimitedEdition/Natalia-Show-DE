import React, { useEffect, useState, useCallback } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { Content, Language } from '@/integrations/supabase/types'
import { toast } from '@/components/ui/use-toast'
import { useAdminLanguage } from '@/components/admin/AdminLanguageProvider'
import { Loader2, Trash2, Pencil, Save } from 'lucide-react'

const ContentManager = () => {
  const { t } = useAdminLanguage()
  const [contents, setContents] = useState<Content[]>([])
  const [languages, setLanguages] = useState<Language[]>([])
  const [sections, setSections] = useState<string[]>([])
  const [selectedLanguage, setSelectedLanguage] = useState('')
  const [selectedSection, setSelectedSection] = useState('')
  const [editingContent, setEditingContent] = useState<Content | null>(null)
  const [contentKey, setContentKey] = useState('')
  const [contentValue, setContentValue] = useState('')
  const [autoTranslate, setAutoTranslate] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isDeleting, setIsDeleting] = useState<string | null>(null)

  const fetchLanguages = useCallback(async () => {
    try {
      setIsLoading(true)
      const { data, error } = await supabase
        .from('languages')
        .select('*')
        .eq('is_active', true)
      
      if (error) throw error
      
      if (data) {
        setLanguages(data)
        if (data.length > 0 && !selectedLanguage) {
          setSelectedLanguage(data[0].code)
        }
      }
    } catch (error) {
      console.error('Error fetching languages:', error)
      toast({
        title: "Грешка",
        description: (error as Error).message || "Дошло је до грешке приликом учитавања језика. Молимо покушајте поново.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }, [selectedLanguage])

  const fetchSections = useCallback(async () => {
    try {
      setIsLoading(true)
      const { data, error } = await supabase
        .from('page_sections')
        .select('section_key')
        .eq('is_active', true)
      
      if (error) throw error
      
      if (data) {
        const sectionKeys = data.map(item => item.section_key)
        setSections(sectionKeys)
        if (sectionKeys.length > 0 && !selectedSection) {
          setSelectedSection(sectionKeys[0])
        }
      }
    } catch (error) {
      console.error('Error fetching sections:', error)
      toast({
        title: "Грешка",
        description: (error as Error).message || "Дошло је до грешке приликом учитавања секција. Молимо покушајте поново.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }, [selectedSection])

  const fetchContents = useCallback(async () => {
    try {
      setIsLoading(true)
      const { data, error } = await supabase
        .from('content')
        .select('*')
        .eq('section_key', selectedSection)
        .eq('language_code', selectedLanguage)
      
      if (error) throw error
      setContents(data || [])
    } catch (error) {
      console.error('Error loading content:', error)
      toast({
        title: "Грешка",
        description: (error as Error).message || "Дошло је до грешке приликом учитавања садржаја. Молимо покушајте поново.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }, [selectedSection, selectedLanguage])

  const handleSave = useCallback(async () => {
    if (!contentKey.trim() || !contentValue.trim()) {
      toast({
        title: "Грешка",
        description: "Кључ и вредност садржаја су обавезни.",
        variant: "destructive",
      })
      return
    }

    try {
      setIsSaving(true)
      
      if (editingContent) {
        // Update existing content
        const { error } = await supabase
          .from('content')
          .update({ 
            content_key: contentKey,
            content_value: contentValue,
            section_key: selectedSection,
            language_code: selectedLanguage,
            auto_translate: autoTranslate
          })
          .eq('id', editingContent.id)
        
        if (error) throw error
        
        toast({
          title: "Успешно",
          description: "Садржај је успешно ажуриран.",
        })
      } else {
        // Insert new content
        const { error } = await supabase
          .from('content')
          .insert({
            content_key: contentKey,
            content_value: contentValue,
            section_key: selectedSection,
            language_code: selectedLanguage,
            auto_translate: autoTranslate
          })
        
        if (error) throw error
        
        toast({
          title: "Успешно",
          description: "Садржај је успешно додат.",
        })
      }
      
      // Reset form and refresh content
      setContentKey('')
      setContentValue('')
      setAutoTranslate(false)
      setEditingContent(null)
      fetchContents()
    } catch (error) {
      console.error('Error saving content:', error)
      toast({
        title: "Грешка",
        description: (error as Error).message || "Дошло је до грешке приликом чувања садржаја. Молимо покушајте поново.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }, [contentKey, contentValue, selectedSection, selectedLanguage, autoTranslate, editingContent, fetchContents])

  const handleEdit = (content: Content) => {
    setContentKey(content.content_key)
    setContentValue(content.content_value)
    setAutoTranslate(content.auto_translate || false)
    setEditingContent(content)
  }

  const handleDelete = useCallback(async (id: string) => {
    if (!window.confirm("Да ли сте сигурни да желите да обришете овај садржај?")) return

    try {
      setIsDeleting(id)
      const { error } = await supabase
        .from('content')
        .delete()
        .eq('id', id)
      
      if (error) throw error
      
      toast({
        title: "Успешно",
        description: "Садржај је успешно обрисан.",
      })
      
      fetchContents()
    } catch (error) {
      console.error('Error deleting content:', error)
      toast({
        title: "Грешка",
        description: (error as Error).message || "Дошло је до грешке приликом брисања садржаја. Молимо покушајте поново.",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(null)
    }
  }, [fetchContents])

  const resetForm = () => {
    setContentKey('')
    setContentValue('')
    setAutoTranslate(false)
    setEditingContent(null)
  }

  useEffect(() => {
    fetchLanguages()
    fetchSections()
  }, [fetchLanguages, fetchSections])

  useEffect(() => {
    if (selectedLanguage && selectedSection) {
      fetchContents()
    }
  }, [selectedLanguage, selectedSection, fetchContents])

  // Function to translate text using LibreTranslate API
  const translateText = async (text: string, sourceLang: string, targetLang: string) => {
    try {
      const response = await fetch('https://libretranslate.de/translate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          q: text,
          source: sourceLang,
          target: targetLang,
          format: 'text',
        }),
      })

      if (!response.ok) {
        throw new Error('Превод није успео')
      }

      const data = await response.json()
      return data.translatedText
    } catch (error) {
      console.error('Translation error:', error)
      toast({
        title: "Грешка при превођењу",
        description: "Дошло је до грешке приликом аутоматског превођења. Молимо покушајте ручно.",
        variant: "destructive",
      })
      return text
    }
  }

  const handleAutoTranslate = async () => {
    if (!contentValue.trim()) return

    try {
      setIsSaving(true)
      let sourceLang = 'sr' // Default source language
      
      // Determine source language based on selected language
      if (selectedLanguage === 'en') sourceLang = 'sr'
      else if (selectedLanguage === 'de') sourceLang = 'sr'
      
      const translatedText = await translateText(contentValue, sourceLang, selectedLanguage)
      setContentValue(translatedText)
    } catch (error) {
      console.error('Auto-translate error:', error)
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Менаџер Садржаја</h2>
      </div>

      <div className="bg-gray-800 rounded-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-gray-300 mb-2">Језик</label>
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-white"
            >
              {languages.map((language) => (
                <option key={language.code} value={language.code}>
                  {language.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-gray-300 mb-2">Секција</label>
            <select
              value={selectedSection}
              onChange={(e) => setSelectedSection(e.target.value)}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-white"
            >
              {sections.map((section) => (
                <option key={section} value={section}>
                  {section}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="border-t border-gray-700 pt-6">
          <h3 className="text-xl font-semibold mb-4 text-white">
            {editingContent ? 'Измени Садржај' : 'Додај Садржај'}
          </h3>
          
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-gray-300 mb-2">Кључ Садржаја</label>
              <input
                type="text"
                value={contentKey}
                onChange={(e) => setContentKey(e.target.value)}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-white"
                placeholder="нпр. hero_title"
              />
            </div>
            
            <div>
              <label className="block text-gray-300 mb-2">Вредност Садржаја</label>
              <textarea
                value={contentValue}
                onChange={(e) => setContentValue(e.target.value)}
                rows={4}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-white"
                placeholder="Унесите вредност садржаја..."
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="autoTranslate"
                checked={autoTranslate}
                onChange={(e) => setAutoTranslate(e.target.checked)}
                className="rounded bg-gray-700 border-gray-600 text-orange-600 focus:ring-orange-500"
              />
              <label htmlFor="autoTranslate" className="text-gray-300">
                Аутоматски преведи
              </label>
              
              {autoTranslate && selectedLanguage !== 'sr' && (
                <button
                  onClick={handleAutoTranslate}
                  disabled={isSaving || !contentValue.trim()}
                  className="ml-4 px-3 py-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded text-sm"
                >
                  Преведи
                </button>
              )}
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={handleSave}
                disabled={isSaving || !contentKey.trim() || !contentValue.trim()}
                className="flex items-center space-x-2 px-4 py-2 bg-orange-600 hover:bg-orange-700 disabled:opacity-50 text-white rounded-lg transition duration-300"
              >
                <Save className="w-5 h-5" />
                <span>{editingContent ? 'Ажурирај' : 'Сачувај'}</span>
              </button>
              
              {editingContent && (
                <button
                  onClick={resetForm}
                  className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition duration-300"
                >
                  Откажи
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 pt-6 mt-6">
          <h3 className="text-xl font-semibold mb-4 text-white">Постојећи Садржај</h3>
          
          {contents.length === 0 ? (
            <p className="text-gray-400 text-center py-8">Нема пронађеног садржаја за изабрану секцију и језик.</p>
          ) : (
            <div className="space-y-4">
              {contents.map((content) => (
                <div key={content.id} className="bg-gray-700 rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="font-semibold text-white break-all">{content.content_key}</h4>
                      <p className="text-gray-300 mt-2 break-words">{content.content_value}</p>
                      <div className="flex items-center mt-2 text-sm text-gray-400">
                        <span>Аутоматски превод: {content.auto_translate ? 'Да' : 'Не'}</span>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(content)}
                        className="p-2 text-gray-400 hover:text-white hover:bg-gray-600 rounded-full transition duration-300"
                      >
                        <Pencil className="w-5 h-5" />
                      </button>
                      
                      <button
                        onClick={() => handleDelete(content.id)}
                        disabled={isDeleting === content.id}
                        className="p-2 text-gray-400 hover:text-red-400 hover:bg-gray-600 rounded-full transition duration-300 disabled:opacity-50"
                      >
                        {isDeleting === content.id ? (
                          <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                          <Trash2 className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ContentManager