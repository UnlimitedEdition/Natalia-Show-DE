import React, { useState } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { useNavigate } from 'react-router-dom'
import { useAdminLanguage } from '@/components/admin/AdminLanguageProvider'

const AdminAuth = () => {
  const { t } = useAdminLanguage()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [isSignUp, setIsSignUp] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      if (isSignUp) {
        // Sign up using Supabase auth
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email,
          password,
        })

        if (authError) throw authError

        // If signup is successful, also add user to admin_users table
        if (authData.user) {
          const { error: insertError } = await supabase
            .from('admin_users')
            .insert({
              id: authData.user.id,
              email: email,
              password_hash: password, // In production, this should be properly hashed
              full_name: fullName,
              is_active: true
            })

          if (insertError) {
            // If we fail to insert into admin_users, delete the auth user to keep consistency
            await supabase.auth.admin.deleteUser(authData.user.id)
            throw insertError
          }
        }

        alert(t.registrationSuccessful + ' You can now sign in with your credentials.')
        // Switch to sign in mode after successful registration
        setIsSignUp(false)
        setFullName('')
      } else {
        // Sign in
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })

        if (error) throw error

        // Redirect to admin panel
        navigate('/admin/')
      }
    } catch (error) {
      console.error('Authentication error:', error)
      setError((error as Error).message || 'An error occurred during authentication')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="bg-gray-800 rounded-xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">{t.adminPanel}</h1>
          <p className="text-gray-400">
            {isSignUp ? t.createAnAccount : t.signInToYourAccount}
          </p>
          {!isSignUp && (
            <div className="mt-4 p-3 bg-blue-900/50 border border-blue-700 text-blue-200 rounded-lg text-sm">
              <p className="font-medium">Default Admin Credentials:</p>
              <p>Email: admin@example.com</p>
              <p>Password: admin123</p>
              <p className="mt-2">If these don't work, use "Don't have an account?" to create a new admin user.</p>
            </div>
          )}
        </div>

        {error && (
          <div className="bg-red-900/50 border border-red-700 text-red-200 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleAuth} className="space-y-6">
          {isSignUp && (
            <div>
              <label htmlFor="fullName" className="block text-gray-300 mb-2">{t.nameLabel}</label>
              <input
                id="fullName"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-white"
                required={isSignUp}
              />
            </div>
          )}
          
          <div>
            <label htmlFor="email" className="block text-gray-300 mb-2">{t.email}</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-white"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-gray-300 mb-2">{t.password}</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-white"
              required
              autoComplete="current-password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-3 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-lg transition duration-300 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-gray-800"
          >
            {loading ? t.processing : (isSignUp ? t.signUp : t.signIn)}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-orange-400 hover:text-orange-300 transition duration-300 focus:outline-none focus:underline"
          >
            {isSignUp
              ? t.alreadyHaveAnAccount
              : t.dontHaveAnAccount}
          </button>
        </div>
      </div>
    </div>
  )
}

export default AdminAuth