import React, { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { useAdminLanguage } from '@/components/admin/AdminLanguageProvider'
import { toast } from '@/components/ui/use-toast'

interface ContactMessage {
  id: number
  name: string
  email: string
  message: string
  language_code: string
  created_at: string
}

interface ContactInfo {
  contactEmail: string
  contactPhone: string
  siteName: string
}

const ContactManager = () => {
  const { t, currentLanguage } = useAdminLanguage()
  const [contactMessages, setContactMessages] = useState<ContactMessage[]>([])
  const [contactInfo, setContactInfo] = useState<ContactInfo>({
    contactEmail: '',
    contactPhone: '',
    siteName: ''
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const fetchContactMessages = useCallback(async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('contact_messages')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error

      setContactMessages(data || [])
    } catch (error) {
      console.error('Error fetching contact messages:', error)
      toast({
        title: "Error",
        description: "Failed to fetch contact messages",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchContactInfo = useCallback(async () => {
    try {
      // Fetch contact email and phone
      const { data: contactData, error: contactError } = await supabase
        .from('content')
        .select('content_key, content_value')
        .eq('section_key', 'contact')
        .eq('language_code', currentLanguage)
        .in('content_key', ['contactEmail', 'contactPhone'])

      if (contactError) throw contactError

      // Fetch site name
      const { data: siteData, error: siteError } = await supabase
        .from('content')
        .select('content_value')
        .eq('section_key', 'hero')
        .eq('language_code', currentLanguage)
        .eq('content_key', 'title')
        .single()

      if (siteError && siteError.code !== 'PGRST116') throw siteError

      // Process contact data
      const contactInfoData: Record<string, string> = {}
      contactData?.forEach(item => {
        contactInfoData[item.content_key] = item.content_value
      })

      setContactInfo({
        contactEmail: contactInfoData.contactEmail || '',
        contactPhone: contactInfoData.contactPhone || '',
        siteName: siteData?.content_value || ''
      })
    } catch (error) {
      console.error('Error fetching contact info:', error)
      toast({
        title: "Error",
        description: "Failed to fetch contact information",
        variant: "destructive"
      })
    }
  }, [currentLanguage])

  useEffect(() => {
    fetchContactMessages()
    fetchContactInfo()
  }, [fetchContactMessages, fetchContactInfo])

  const handleContactInfoChange = (field: keyof ContactInfo, value: string) => {
    setContactInfo(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const saveContactInfo = async () => {
    try {
      setSaving(true)
      
      // Save contact email
      if (contactInfo.contactEmail) {
        // First check if record exists
        const { data: existingEmail, error: fetchEmailError } = await supabase
          .from('content')
          .select('id')
          .eq('section_key', 'contact')
          .eq('language_code', currentLanguage)
          .eq('content_key', 'contactEmail')
          .maybeSingle()

        if (fetchEmailError) throw fetchEmailError

        if (existingEmail) {
          // Update existing record
          const { error: updateError } = await supabase
            .from('content')
            .update({
              content_value: contactInfo.contactEmail,
              is_active: true,
              updated_at: new Date().toISOString()
            })
            .eq('id', existingEmail.id)

          if (updateError) throw updateError
        } else {
          // Insert new record
          const { error: insertError } = await supabase
            .from('content')
            .insert({
              section_key: 'contact',
              language_code: currentLanguage,
              content_key: 'contactEmail',
              content_value: contactInfo.contactEmail,
              is_active: true,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            })

          if (insertError) throw insertError
        }
      }

      // Save contact phone
      if (contactInfo.contactPhone) {
        // First check if record exists
        const { data: existingPhone, error: fetchPhoneError } = await supabase
          .from('content')
          .select('id')
          .eq('section_key', 'contact')
          .eq('language_code', currentLanguage)
          .eq('content_key', 'contactPhone')
          .maybeSingle()

        if (fetchPhoneError) throw fetchPhoneError

        if (existingPhone) {
          // Update existing record
          const { error: updateError } = await supabase
            .from('content')
            .update({
              content_value: contactInfo.contactPhone,
              is_active: true,
              updated_at: new Date().toISOString()
            })
            .eq('id', existingPhone.id)

          if (updateError) throw updateError
        } else {
          // Insert new record
          const { error: insertError } = await supabase
            .from('content')
            .insert({
              section_key: 'contact',
              language_code: currentLanguage,
              content_key: 'contactPhone',
              content_value: contactInfo.contactPhone,
              is_active: true,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            })

          if (insertError) throw insertError
        }
      }

      // Save site name
      if (contactInfo.siteName) {
        // First check if record exists
        const { data: existingSite, error: fetchSiteError } = await supabase
          .from('content')
          .select('id')
          .eq('section_key', 'hero')
          .eq('language_code', currentLanguage)
          .eq('content_key', 'title')
          .maybeSingle()

        if (fetchSiteError && fetchSiteError.code !== 'PGRST116') throw fetchSiteError

        if (existingSite) {
          // Update existing record
          const { error: updateError } = await supabase
            .from('content')
            .update({
              content_value: contactInfo.siteName,
              is_active: true,
              updated_at: new Date().toISOString()
            })
            .eq('id', existingSite.id)

          if (updateError) throw updateError
        } else {
          // Insert new record
          const { error: insertError } = await supabase
            .from('content')
            .insert({
              section_key: 'hero',
              language_code: currentLanguage,
              content_key: 'title',
              content_value: contactInfo.siteName,
              is_active: true,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            })

          if (insertError) throw insertError
        }
      }

      toast({
        title: "Success",
        description: "Contact information saved successfully"
      })

      // Refresh the data
      fetchContactInfo()
    } catch (error) {
      console.error('Error saving contact info:', error)
      toast({
        title: "Error",
        description: "Failed to save contact information",
        variant: "destructive"
      })
    } finally {
      setSaving(false)
    }
  }

  const deleteContactMessage = async (id: number) => {
    try {
      const { error } = await supabase
        .from('contact_messages')
        .delete()
        .eq('id', id)

      if (error) throw error

      // Remove from state
      setContactMessages(prev => prev.filter(msg => msg.id !== id))

      toast({
        title: "Success",
        description: "Contact message deleted successfully"
      })
    } catch (error) {
      console.error('Error deleting contact message:', error)
      toast({
        title: "Error",
        description: "Failed to delete contact message",
        variant: "destructive"
      })
    }
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-700 rounded w-1/4"></div>
          <div className="h-4 bg-gray-700 rounded w-3/4"></div>
          <div className="h-4 bg-gray-700 rounded w-1/2"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">{t.contactInfo}</h2>
      
      {/* Contact Information Form */}
      <div className="bg-gray-800 rounded-lg p-6 mb-8">
        <h3 className="text-xl font-semibold mb-4">Site Contact Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">{t.email}</label>
            <input
              type="email"
              value={contactInfo.contactEmail}
              onChange={(e) => handleContactInfoChange('contactEmail', e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="info@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">{t.phoneLabel}</label>
            <input
              type="text"
              value={contactInfo.contactPhone}
              onChange={(e) => handleContactInfoChange('contactPhone', e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="+1234567890"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-2">Site Name</label>
            <input
              type="text"
              value={contactInfo.siteName}
              onChange={(e) => handleContactInfoChange('siteName', e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="Site Name"
            />
          </div>
        </div>
        <div className="mt-6">
          <button
            onClick={saveContactInfo}
            disabled={saving}
            className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white font-medium rounded-md transition duration-300 disabled:opacity-50"
          >
            {saving ? t.saving : t.save}
          </button>
        </div>
      </div>

      {/* Contact Messages */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-xl font-semibold mb-4">Contact Messages</h3>
        {contactMessages.length === 0 ? (
          <p className="text-gray-400">No contact messages found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left py-3 px-4">Name</th>
                  <th className="text-left py-3 px-4">Email</th>
                  <th className="text-left py-3 px-4">Message</th>
                  <th className="text-left py-3 px-4">Date</th>
                  <th className="text-left py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {contactMessages.map((message) => (
                  <tr key={message.id} className="border-b border-gray-700 hover:bg-gray-750">
                    <td className="py-3 px-4">{message.name}</td>
                    <td className="py-3 px-4">{message.email}</td>
                    <td className="py-3 px-4 max-w-md break-words">{message.message}</td>
                    <td className="py-3 px-4">
                      {new Date(message.created_at).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => deleteContactMessage(message.id)}
                        className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-sm rounded-md transition duration-300"
                      >
                        {t.delete}
                      </button>
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

export default ContactManager