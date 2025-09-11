import React, { useState, useCallback, useEffect } from 'react'
import { useLanguage } from '@/components/LanguageProvider'
import { supabase } from '@/integrations/supabase/client'

const ContactSection = () => {
  const { currentLanguage } = useLanguage()
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [submitError, setSubmitError] = useState('')
  
  const [content, setContent] = useState<Record<string, string>>({})
  const [contactInfo, setContactInfo] = useState({
    email: 'info@nasemisije.com',
    phone: '+381 11 123 4567'
  })

  const fetchContactContent = useCallback(async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('content')
        .select('content_key, content_value')
        .eq('section_key', 'contact')
        .eq('language_code', currentLanguage)
      
      if (error) {
        console.error('Error fetching contact content:', error)
        setLoading(false)
        return
      }
      
      // Group content by content_key for easier access
      const contentMap: Record<string, string> = {}
      data?.forEach(item => {
        contentMap[item.content_key] = item.content_value
      })
      
      setContent(contentMap)
      
      // Also fetch contact info specifically
      const contactData: Record<string, string> = {}
      data?.forEach(item => {
        if (item.content_key === 'contactEmail' || item.content_key === 'contactPhone') {
          contactData[item.content_key] = item.content_value
        }
      })
      
      setContactInfo({
        email: contactData.contactEmail || 'info@nasemisije.com',
        phone: contactData.contactPhone || '+381 11 123 4567'
      })
      
      setLoading(false)
    } catch (error) {
      console.error('Error fetching contact content:', error)
      setLoading(false)
    }
  }, [currentLanguage])

  useEffect(() => {
    fetchContactContent()
  }, [fetchContactContent, currentLanguage])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitError('')
    
    try {
      const { error } = await supabase
        .from('contact_messages')
        .insert([{
          name: formData.name,
          email: formData.email,
          message: formData.message,
          language_code: currentLanguage
        }])
        
      if (error) throw error
      
      setSubmitSuccess(true)
      setFormData({ name: '', email: '', message: '' })
      // Hide success message after 5 seconds
      setTimeout(() => setSubmitSuccess(false), 5000)
    } catch (error) {
      console.error('Error submitting contact form:', error)
      setSubmitError(content.errorMessage || 'Došlo je do greške prilikom slanja poruke. Molimo pokušajte ponovo.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const t = {
    // Serbian translations
    sr: {
      title: 'Kontakt',
      description: 'Stupite u kontakt sa nama za saradnju, predloge ili jednostavno da podelite svoju priču',
      formTitle: 'Pošaljite Poruku',
      namePlaceholder: 'Vaše ime',
      emailPlaceholder: 'Email adresa',
      messagePlaceholder: 'Vaša poruka...',
      sendButton: 'Pošaljite Poruku',
      directContact: 'Direktan Kontakt',
      followUs: 'Pratite Nas',
      youtube: 'YouTube',
      youtubeHandle: '@PodcastStudio',
      instagram: 'Instagram',
      instagramHandle: '@podcast_studio',
      instagramFollow: 'Budite prvi koji će saznati za nove epizode i ekskluzivni sadržaj!',
      sending: 'Slanje...',
      successMessage: 'Hvala vam na poruci! Javićemo vam se uskoro.',
      errorMessage: 'Došlo je do greške prilikom slanja poruke. Molimo pokušajte ponovo.'
    },
    // English translations
    en: {
      title: 'Contact',
      description: 'Get in touch with us for collaborations, suggestions or simply to share your story',
      formTitle: 'Send a Message',
      namePlaceholder: 'Your name',
      emailPlaceholder: 'Email address',
      messagePlaceholder: 'Your message...',
      sendButton: 'Send Message',
      directContact: 'Direct Contact',
      followUs: 'Follow Us',
      youtube: 'YouTube',
      youtubeHandle: '@PodcastStudio',
      instagram: 'Instagram',
      instagramHandle: '@podcast_studio',
      instagramFollow: 'Be the first to know about new episodes and exclusive content!',
      sending: 'Sending...',
      successMessage: 'Thank you for your message! We will get back to you soon.',
      errorMessage: 'An error occurred while sending the message. Please try again.'
    },
    // German translations
    de: {
      title: 'Kontakt',
      description: 'Kontaktieren Sie uns für Zusammenarbeit, Vorschläge oder einfach, um Ihre Geschichte zu teilen',
      formTitle: 'Nachricht senden',
      namePlaceholder: 'Ihr Name',
      emailPlaceholder: 'E-Mail-Adresse',
      messagePlaceholder: 'Ihre Nachricht...',
      sendButton: 'Nachricht senden',
      directContact: 'Direkter Kontakt',
      followUs: 'Folgen Sie uns',
      youtube: 'YouTube',
      youtubeHandle: '@PodcastStudio',
      instagram: 'Instagram',
      instagramHandle: '@podcast_studio',
      instagramFollow: 'Seien Sie der Erste, der von neuen Episoden und exklusiven Inhalten erfährt!',
      sending: 'Senden...',
      successMessage: 'Vielen Dank für Ihre Nachricht! Wir werden uns bald bei Ihnen melden.',
      errorMessage: 'Beim Senden der Nachricht ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut.'
    }
  }

  const translations = t[currentLanguage as keyof typeof t] || t.sr

  if (loading) {
    return (
      <section id="contact" className="py-20 bg-gradient-to-r from-orange-500 to-red-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <div className="animate-pulse">
            <div className="h-8 bg-white/20 rounded w-1/4 mx-auto mb-4"></div>
            <div className="h-6 bg-white/20 rounded w-1/2 mx-auto"></div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="contact" className="py-20 bg-gradient-to-r from-orange-500 to-red-600 text-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-6">
            {content.title || translations.title}
          </h2>
          <p className="text-xl max-w-2xl mx-auto">
            {content.description || translations.description}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="bg-black/20 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
            <h3 className="text-2xl font-bold mb-6">{translations.formTitle}</h3>
            
            {submitSuccess && (
              <div className="mb-6 p-4 bg-green-500/20 border border-green-500 rounded-lg text-green-100">
                {translations.successMessage}
              </div>
            )}
            
            {submitError && (
              <div className="mb-6 p-4 bg-red-500/20 border border-red-500 rounded-lg text-red-100">
                {submitError}
              </div>
            )}
            
            <form onSubmit={handleSubmit}>
              <div className="mb-6">
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder={translations.namePlaceholder}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-white placeholder-white/70"
                  required
                />
              </div>
              
              <div className="mb-6">
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder={translations.emailPlaceholder}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-white placeholder-white/70"
                  required
                />
              </div>
              
              <div className="mb-6">
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder={translations.messagePlaceholder}
                  rows={5}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-white placeholder-white/70"
                  required
                ></textarea>
              </div>
              
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-white text-orange-600 px-6 py-3 rounded-lg font-bold text-lg hover:bg-gray-100 transition duration-300 disabled:opacity-50 flex items-center justify-center"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-orange-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {translations.sending}
                  </>
                ) : (
                  translations.sendButton
                )}
              </button>
            </form>
          </div>
          
          {/* Contact Information and Social Media */}
          <div>
            <div className="bg-black/20 backdrop-blur-sm rounded-2xl p-8 border border-white/10 mb-8">
              <h3 className="text-2xl font-bold mb-6">{translations.directContact}</h3>
              
              <div className="space-y-4">
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-4 text-orange-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span className="text-lg">{contactInfo.email}</span>
                </div>
                
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-4 text-orange-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span className="text-lg">{contactInfo.phone}</span>
                </div>
              </div>
            </div>
            
            <div className="bg-black/20 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
              <h3 className="text-2xl font-bold mb-6">{translations.followUs}</h3>
              
              <div className="space-y-6">
                <div className="flex items-center">
                  <div className="bg-red-600 rounded-full p-3 mr-4">
                    <svg className="h-6 w-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/>
                    </svg>
                  </div>
                  <div>
                    <div className="font-bold text-lg">{translations.youtube}</div>
                    <div className="text-orange-200">{translations.youtubeHandle}</div>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-full p-3 mr-4">
                    <svg className="h-6 w-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.059-1.28.073-1.689.073-4.948 0-3.259.014-3.668.072-4.948-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                  </div>
                  <div>
                    <div className="font-bold text-lg">{translations.instagram}</div>
                    <div className="text-orange-200">{translations.instagramHandle}</div>
                  </div>
                </div>
                
                <p className="text-orange-200 italic">
                  {translations.instagramFollow}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ContactSection