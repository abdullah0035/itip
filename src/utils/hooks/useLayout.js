// hooks/useLayout.js - Merged with enhanced functionality
import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { 
  defaultUser, 
  getLayoutType, 
  isAuthRoute, 
  shouldShowCleanLayout, 
  shouldShowDashboardLayout,
  getSidebarItems
} from '../config/layoutConfig'
import { decryptData } from '../api/encrypted'
import { useAuthDetails } from '../../components/redux/auth/useAuth'
import { setCustomerLogin, setLogin, setLogout, setToken, setUserData } from '../../components/redux/loginForm'

export const useLayout = () => {
  const location = useLocation()
  const dispatch = useDispatch()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [user, setUser] = useState(defaultUser)

  // Get authentication details from Redux
  const { 
    isAuthenticated, 
    isServiceProvider, 
    isCustomer, 
    userType, 
    token, 
    userData 
  } = useAuthDetails()

  // Check layout type and auth route status
  const showLayout = shouldShowDashboardLayout(location.pathname) && isAuthenticated
  const isAuth = isAuthRoute(location.pathname)
  const isClean = shouldShowCleanLayout(location.pathname)
  const layoutType = getLayoutType(location.pathname)

  // Get appropriate sidebar items based on user type
  const sidebarItems = getSidebarItems(userType)

  // Close sidebar when route changes (mobile UX)
  useEffect(() => {
    setSidebarOpen(false)
  }, [location.pathname])

  // Load user data from Redux when authentication changes
  useEffect(() => {
    loadUserDataFromRedux()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, userData, token, userType])

  // Load user data from Redux (encrypted) or fallback to localStorage
  const loadUserDataFromRedux = () => {
    if (isAuthenticated && userData && token) {
      try {
        const decryptedUserData = decryptData(userData)
        if (decryptedUserData) {
          const parsedUserData = typeof decryptedUserData === 'string' 
            ? JSON.parse(decryptedUserData) 
            : decryptedUserData
          
          const newUser = {
            name: `${parsedUserData.first_name || ''} ${parsedUserData.last_name || ''}`.trim() || 'User',
            email: parsedUserData.email || 'user@email.com',
            avatar: parsedUserData.profile_picture || parsedUserData.avatar || defaultUser.avatar,
            userType: userType,
            // Keep any additional fields from your existing structure
            ...parsedUserData
          }
          
          setUser(newUser)
          // Optionally sync with localStorage for consistency
          localStorage.setItem('user', JSON.stringify(newUser))
        }
      } catch (error) {
        console.error('Error decrypting user data from Redux:', error)
        // Fallback to localStorage if Redux decryption fails
        loadUserDataFromLocalStorage()
      }
    } else {
      // If not authenticated, try localStorage (for backwards compatibility)
      loadUserDataFromLocalStorage()
    }
  }

  // Fallback method for localStorage (keeps your existing functionality)
  const loadUserDataFromLocalStorage = () => {
    try {
      const savedUser = localStorage.getItem('user')
      if (savedUser) {
        const parsedUser = JSON.parse(savedUser)
        setUser({ ...defaultUser, ...parsedUser, userType: userType || null })
      } else {
        setUser({ ...defaultUser, userType: userType || null })
      }
    } catch (error) {
      console.error('Error loading user data from localStorage:', error)
      setUser({ ...defaultUser, userType: userType || null })
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

  // Enhanced updateUser method that works with Redux
  const updateUser = (userData) => {
    setUser({ ...user, ...userData, userType: userType || user.userType })
    localStorage.setItem('user', JSON.stringify({ ...user, ...userData }))
    
    // If you want to sync back to Redux (optional)
    // You might want to create an action for updating user data in Redux
  }

  // Enhanced logout that handles both user types and Redux
  const logout = () => {
    // Clear Redux state based on user type
    if (isServiceProvider) {
      dispatch(setLogin(false))
    }
    if (isCustomer) {
      dispatch(setCustomerLogin(false))
    }
    
    // Clear common auth data
    dispatch(setToken(''))
    dispatch(setUserData(null))
    dispatch(setLogout())
    
    // Clear localStorage
    localStorage.removeItem('user')
    localStorage.removeItem('authToken')
    localStorage.removeItem('react_template_token')
    
    // Reset user state
    setUser(defaultUser)
    setSidebarOpen(false)
    
    // Redirect based on user type
    const redirectPath = userType === 'customer' ? '/customer-login' : '/'
    window.location.href = redirectPath
  }

  // Keep your existing loadUserData method for manual calls
  const loadUserData = () => {
    if (isAuthenticated) {
      loadUserDataFromRedux()
    } else {
      loadUserDataFromLocalStorage()
    }
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
    sidebarItems, // New: dynamic sidebar items
    
    // Authentication state (new)
    userType,
    isAuthenticated,
    isServiceProvider,
    isCustomer,

    // Actions
    toggleSidebar,
    closeSidebar,
    openSidebar,
    updateUser,
    logout,
    loadUserData,
    loadUserDataFromRedux, // New method
    loadUserDataFromLocalStorage // Renamed existing method
  }
}

// Alternative hook for components that only need to know if layout should show
export const useLayoutVisibility = () => {
  const location = useLocation()
  const { isAuthenticated } = useAuthDetails()
  return shouldShowDashboardLayout(location.pathname) && isAuthenticated
}

// Hook specifically for auth route detection
export const useAuthRoute = () => {
  const location = useLocation()
  return isAuthRoute(location.pathname)
}

// New hook for getting user-specific navigation items
export const useSidebarItems = () => {
  const { userType } = useAuthDetails()
  return getSidebarItems(userType)
}