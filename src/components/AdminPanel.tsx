import React, { useState, useEffect } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { useNavigate, useLocation } from 'react-router-dom'
import { AdminLanguageProvider, useAdminLanguage } from '@/components/admin/AdminLanguageProvider'
import ContentManager from '@/components/admin/ContentManager'
import SectionManager from '@/components/admin/SectionManager'
import MediaManager from '@/components/admin/MediaManager'
import AnnouncementManager from '@/components/admin/AnnouncementManager'
import AdvertisementManager from '@/components/admin/AdvertisementManager'
import PostManager from '@/components/admin/PostManager'
import ContactManager from '@/components/admin/ContactManager'

const AdminPanelContent = () => {
  const { t, currentLanguage, setLanguage, languages } = useAdminLanguage()
  const [activeTab, setActiveTab] = useState('content')
  const [user, setUser] = useState<User | null>(null)
  const navigate = useNavigate()
  const location = useLocation()

  const renderTabContent = () => {
    switch (activeTab) {
      case 'content':
        return <ContentManager />
      case 'media':
        return <MediaManager />
      case 'advertisements':
        return <AdvertisementManager />
      case 'announcements':
        return <AnnouncementManager />
      case 'pageSections':
        return <SectionManager />
      case 'posts':
        return <PostManager />
      case 'contact':
        return <ContactManager />
      default:
        return <ContentManager />
    }
  }

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        // Redirect to auth page if user is not logged in
        window.location.href = '/admin/auth'
      } else {
        setUser(user)
      }
    }

    checkUser()

    // Set active tab based on exact URL path
    switch (location.pathname) {
      case '/admin/content':
        setActiveTab('content')
        break
      case '/admin/media':
        setActiveTab('media')
        break
      case '/admin/advertisements':
        setActiveTab('advertisements')
        break
      case '/admin/announcements':
        setActiveTab('announcements')
        break
      case '/admin/page-sections':
        setActiveTab('pageSections')
        break
      case '/admin/posts':
        setActiveTab('posts')
        break
      case '/admin/contact':
        setActiveTab('contact')
        break
    }
  }, [navigate, location.pathname])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    // Force a page refresh to ensure clean state
    window.location.href = '/admin/auth'
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-gray-800 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold">{t.adminPanel}</h1>
            </div>
            <div className="flex items-center space-x-4">
              {/* Language Selector */}
              <select
                value={currentLanguage}
                onChange={(e) => setLanguage(e.target.value)}
                className="bg-gray-700 text-white px-2 py-1 rounded"
                aria-label="Select language"
              >
                {languages.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.name}
                  </option>
                ))}
              </select>
              <span>{t.welcome}, {user.email}</span>
              <button
                onClick={handleSignOut}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition duration-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-800"
              >
                {t.signOut}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-gray-800 border-t border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            <div className="text-center py-3">
              <button
                onClick={() => navigate('/admin/content')}
                className={`px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'content'
                    ? 'border-orange-500 text-orange-500'
                    : 'border-transparent text-gray-300 hover:text-white hover:border-gray-300'
                }`}
              >
                {t.content}
              </button>
              <div className="text-xs text-gray-400 mt-1">{t.contentDescription}</div>
            </div>
            <div className="text-center py-3">
              <button
                onClick={() => navigate('/admin/media')}
                className={`px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'media'
                    ? 'border-orange-500 text-orange-500'
                    : 'border-transparent text-gray-300 hover:text-white hover:border-gray-300'
                }`}
              >
                {t.media}
              </button>
              <div className="text-xs text-gray-400 mt-1">{t.mediaDescription}</div>
            </div>
            <div className="text-center py-3">
              <button
                onClick={() => navigate('/admin/advertisements')}
                className={`px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'advertisements'
                    ? 'border-orange-500 text-orange-500'
                    : 'border-transparent text-gray-300 hover:text-white hover:border-gray-300'
                }`}
              >
                {t.advertisements}
              </button>
              <div className="text-xs text-gray-400 mt-1">{t.advertisementsDescription}</div>
            </div>
            <div className="text-center py-3">
              <button
                onClick={() => navigate('/admin/announcements')}
                className={`px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'announcements'
                    ? 'border-orange-500 text-orange-500'
                    : 'border-transparent text-gray-300 hover:text-white hover:border-gray-300'
                }`}
              >
                {t.announcements}
              </button>
              <div className="text-xs text-gray-400 mt-1">{t.announcementsDescription}</div>
            </div>
            <div className="text-center py-3">
              <button
                onClick={() => navigate('/admin/page-sections')}
                className={`px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'pageSections'
                    ? 'border-orange-500 text-orange-500'
                    : 'border-transparent text-gray-300 hover:text-white hover:border-gray-300'
                }`}
              >
                {t.pageSections}
              </button>
              <div className="text-xs text-gray-400 mt-1">{t.pageSectionsDescription}</div>
            </div>
            <div className="text-center py-3">
              <button
                onClick={() => navigate('/admin/posts')}
                className={`px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'posts'
                    ? 'border-orange-500 text-orange-500'
                    : 'border-transparent text-gray-300 hover:text-white hover:border-gray-300'
                }`}
              >
                {t.posts}
              </button>
              <div className="text-xs text-gray-400 mt-1">{t.postsDescription}</div>
            </div>
            <div className="text-center py-3">
              <button
                onClick={() => navigate('/admin/contact')}
                className={`px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'contact'
                    ? 'border-orange-500 text-orange-500'
                    : 'border-transparent text-gray-300 hover:text-white hover:border-gray-300'
                }`}
              >
                {t.contactLinks}
              </button>
              <div className="text-xs text-gray-400 mt-1">{t.contactLinksDescription}</div>
            </div>
          </div>
        </div>
      </nav>
      
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderTabContent()}
      </main>
    </div>
  )
}

const AdminPanel = () => {
  return (
    <AdminLanguageProvider>
      <AdminPanelContent />
    </AdminLanguageProvider>
  )
}

export default AdminPanel