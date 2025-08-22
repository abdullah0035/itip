// hooks/useLayout.js
import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { defaultUser, getLayoutType, isAuthRoute, shouldShowCleanLayout, shouldShowDashboardLayout } from '../config/layoutConfig'

export const useLayout = () => {
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [user, setUser] = useState(defaultUser)

  // Check layout type and auth route status
  const showLayout = shouldShowDashboardLayout(location.pathname)
  const isAuth = isAuthRoute(location.pathname)
  const isClean = shouldShowCleanLayout(location.pathname)
  const layoutType = getLayoutType(location.pathname)

  // Close sidebar when route changes (mobile UX)
  useEffect(() => {
    setSidebarOpen(false)
  }, [location.pathname])

  // Load user data on mount
  useEffect(() => {
    loadUserData()
  }, [])

  const loadUserData = () => {
    try {
      const savedUser = localStorage.getItem('user')
      if (savedUser) {
        setUser(JSON.parse(savedUser))
      }
    } catch (error) {
      console.error('Error loading user data:', error)
    }
  }

  const toggleSidebar = () => {
    setSidebarOpen(prev => !prev)
  }

  const closeSidebar = () => {
    setSidebarOpen(false)
  }

  const openSidebar = () => {
    setSidebarOpen(true)
  }

  const updateUser = (userData) => {
    setUser(userData)
    localStorage.setItem('user', JSON.stringify(userData))
  }

  const logout = () => {
    localStorage.removeItem('user')
    localStorage.removeItem('authToken')
    setUser(defaultUser)
    setSidebarOpen(false)
    // You can add more logout logic here
    window.location.href = '/login'
  }

  return {
    // State
    showLayout,
    sidebarOpen,
    user,
    currentPath: location.pathname,
    isAuthRoute: isAuth,
    isCleanLayout: isClean,
    layoutType,

    // Actions
    toggleSidebar,
    closeSidebar,
    openSidebar,
    updateUser,
    logout,
    loadUserData
  }
}

// Alternative hook for components that only need to know if layout should show
export const useLayoutVisibility = () => {
  const location = useLocation()
  return shouldShowDashboardLayout(location.pathname)
}

// Hook specifically for auth route detection
export const useAuthRoute = () => {
  const location = useLocation()
  return isAuthRoute(location.pathname)
}   