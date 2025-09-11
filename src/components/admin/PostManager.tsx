import React, { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { toast } from '@/components/ui/use-toast'
import { useAdminLanguage } from '@/components/admin/AdminLanguageProvider'
import { Loader2, Plus, Edit3, Trash2, Save } from 'lucide-react'

interface Post {
  id: string
  section_key: string
  content_key: string
  language_code: string
  content_value: string
  is_published: boolean
  image_url: string | null
  display_order: number
  created_at: string
  updated_at: string
}

const PostManager = () => {
  const { t } = useAdminLanguage()
  const [posts, setPosts] = useState<Post[]>([])
  const [languages, setLanguages] = useState<any[]>([])
  const [selectedLanguage, setSelectedLanguage] = useState('sr')
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [isPublished, setIsPublished] = useState(false)
  const [displayOrder, setDisplayOrder] = useState(0)
  const [editingPost, setEditingPost] = useState<Post | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isDeleting, setIsDeleting] = useState<string | null>(null)

  const fetchLanguages = useCallback(async () => {
    try {
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
        title: t.error,
        description: t.failedToLoadLanguages,
        variant: "destructive",
      })
    }
  }, [selectedLanguage, t])

  const fetchPosts = useCallback(async () => {
    try {
      setIsLoading(true)
      const { data, error } = await supabase
        .from('content')
        .select('*')
        .eq('section_key', 'posts')
        .order('display_order')
        .order('created_at', { ascending: false })
      
      if (error) throw error
      
      if (data) {
        // Group posts by content_key (title) to get full post data
        const groupedPosts: Post[] = []
        const postMap: Record<string, Post> = {}
        
        data.forEach((item: any) => {
          if (!postMap[item.content_key]) {
            postMap[item.content_key] = {
              id: item.id,
              section_key: item.section_key,
              content_key: item.content_key,
              language_code: item.language_code,
              content_value: item.content_key === 'title' ? item.content_value : '',
              is_published: item.is_published || false,
              image_url: item.image_url || null,
              display_order: item.display_order || 0,
              created_at: item.created_at,
              updated_at: item.updated_at
            }
          }
          
          if (item.content_key === 'title') {
            postMap[item.content_key].content_value = item.content_value
          } else if (item.content_key === 'content') {
            postMap[item.content_key].content = item.content_value
          }
        })
        
        setPosts(Object.values(postMap))
      }
    } catch (error) {
      console.error('Error fetching posts:', error)
      toast({
        title: t.error,
        description: t.failedToLoadPosts,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }, [t])

  useEffect(() => {
    fetchLanguages()
    fetchPosts()
  }, [fetchLanguages, fetchPosts])

  const resetForm = () => {
    setTitle('')
    setContent('')
    setImageUrl('')
    setIsPublished(false)
    setDisplayOrder(0)
    setEditingPost(null)
  }

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!title.trim()) {
      toast({
        title: t.error,
        description: t.titleIsRequired,
        variant: "destructive",
      })
      return
    }

    try {
      setIsSaving(true)
      
      // Generate a unique content_key for this post
      const contentKey = editingPost ? editingPost.content_key : `post_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      
      if (editingPost) {
        // Update existing post
        const updates = [
          {
            id: editingPost.id,
            section_key: 'posts',
            content_key: contentKey,
            language_code: selectedLanguage,
            content_value: title,
            is_published: isPublished,
            image_url: imageUrl || null,
            display_order: displayOrder
          }
        ]
        
        const { error } = await supabase
          .from('content')
          .upsert(updates)
        
        if (error) throw error
        
        toast({
          title: t.postUpdatedSuccessfully,
          description: t.postUpdatedDescription,
        })
      } else {
        // Insert new post
        const newPost = [
          {
            section_key: 'posts',
            content_key: contentKey,
            language_code: selectedLanguage,
            content_value: title
          },
          {
            section_key: 'posts',
            content_key: contentKey + '_content',
            language_code: selectedLanguage,
            content_value: content
          }
        ]
        
        const { error } = await supabase
          .from('content')
          .insert(newPost)
        
        if (error) throw error
        
        toast({
          title: t.postCreatedSuccessfully,
          description: t.postCreatedDescription,
        })
      }
      
      resetForm()
      fetchPosts()
    } catch (error) {
      console.error('Error saving post:', error)
      toast({
        title: t.error,
        description: t.failedToSavePost,
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }, [title, content, imageUrl, isPublished, displayOrder, editingPost, selectedLanguage, fetchPosts, t])

  const handleEdit = (post: Post) => {
    setTitle(post.content_value)
    setContent(post.content || '')
    setImageUrl(post.image_url || '')
    setIsPublished(post.is_published)
    setDisplayOrder(post.display_order)
    setEditingPost(post)
  }

  const handleDelete = useCallback(async (id: string) => {
    if (!window.confirm(t.confirmDeletePost)) return

    try {
      setIsDeleting(id)
      const { error } = await supabase
        .from('content')
        .delete()
        .eq('id', id)
      
      if (error) throw error
      
      toast({
        title: t.postDeletedSuccessfully,
        description: t.postDeletedDescription,
      })
      
      fetchPosts()
    } catch (error) {
      console.error('Error deleting post:', error)
      toast({
        title: t.error,
        description: t.failedToDeletePost,
        variant: "destructive",
      })
    } finally {
      setIsDeleting(null)
    }
  }, [fetchPosts, t])

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
        <h2 className="text-2xl font-bold text-white">{t.postManager}</h2>
      </div>

      <div className="bg-gray-800 rounded-lg p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-300 mb-2">{t.language}</label>
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
              <label className="block text-gray-300 mb-2">{t.displayOrder}</label>
              <input
                type="number"
                value={displayOrder}
                onChange={(e) => setDisplayOrder(parseInt(e.target.value) || 0)}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-white"
                min="0"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-gray-300 mb-2">{t.title}</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-white"
                placeholder={t.enterPostTitle}
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-gray-300 mb-2">{t.content}</label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={6}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-white"
                placeholder={t.enterPostContent}
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-gray-300 mb-2">{t.imageUrl} ({t.optional})</label>
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-white"
                placeholder="https://example.com/image.jpg"
              />
            </div>

            <div>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={isPublished}
                  onChange={(e) => setIsPublished(e.target.checked)}
                  className="rounded bg-gray-700 border-gray-600 text-orange-600 focus:ring-orange-500"
                />
                <span className="text-gray-300">{t.isPublished}</span>
              </label>
            </div>
          </div>

          <div className="flex space-x-3">
            <button
              type="submit"
              disabled={isSaving}
              className="flex items-center space-x-2 px-4 py-2 bg-orange-600 hover:bg-orange-700 disabled:opacity-50 text-white rounded-lg transition duration-300"
            >
              {isSaving ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Save className="w-5 h-5" />
              )}
              <span>{editingPost ? t.updatePost : t.createPost}</span>
            </button>
            
            {editingPost && (
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
        <h3 className="text-xl font-semibold mb-4 text-white">{t.existingPosts}</h3>
        
        {posts.length === 0 ? (
          <p className="text-gray-400 text-center py-8">{t.noPostsFound}</p>
        ) : (
          <div className="space-y-4">
            {posts.map((post) => (
              <div key={post.id} className="bg-gray-700 rounded-lg p-4 border border-gray-600">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-white">{post.content_value}</h4>
                      {!post.is_published && (
                        <span className="text-xs bg-gray-600 text-gray-300 px-2 py-1 rounded">
                          {t.draft}
                        </span>
                      )}
                    </div>
                    <p className="text-gray-400 text-sm mt-1">
                      {new Date(post.created_at).toLocaleDateString()}
                    </p>
                    {post.image_url && (
                      <p className="text-gray-400 text-sm mt-2 truncate">
                        {t.image}: {post.image_url}
                      </p>
                    )}
                  </div>
                  
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(post)}
                      className="p-2 text-gray-400 hover:text-white hover:bg-gray-600 rounded-full transition duration-300"
                    >
                      <Edit3 className="w-5 h-5" />
                    </button>
                    
                    <button
                      onClick={() => handleDelete(post.id)}
                      disabled={isDeleting === post.id}
                      className="p-2 text-gray-400 hover:text-red-400 hover:bg-gray-600 rounded-full transition duration-300 disabled:opacity-50"
                    >
                      {isDeleting === post.id ? (
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
  )
}

export default PostManager