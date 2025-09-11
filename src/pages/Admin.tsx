import React from 'react'
import { useLocation } from 'react-router-dom'
import AdminPanel from '@/components/AdminPanel'
import AdminAuth from '@/components/AdminAuth'
import { AdminLanguageProvider } from '@/components/admin/AdminLanguageProvider'

const Admin = () => {
  const location = useLocation()
  // Check if we're on the auth page
  const isAuthPage = location.pathname === '/admin/auth' || location.pathname === '/admin/login'
  
  // For all other admin routes, we use the AdminPanel component which handles internal routing
  return (
    <AdminLanguageProvider>
      {isAuthPage ? <AdminAuth /> : <AdminPanel />}
    </AdminLanguageProvider>
  )
}

export default Admin