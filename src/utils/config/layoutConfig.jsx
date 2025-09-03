// config/layoutConfig.js

import { 
  RiQrCodeLine, 
  RiLayoutGridFill,
  RiFundsFill,
  RiTimeFill,
  RiUserFill
} from '@remixicon/react'

// Routes where dashboard layout (header + sidebar) should be shown
export const dashboardRoutes = [
  '/dashboard',
  '/qr-codes',
  '/funds',
  '/history',
  '/users',
  '/account'
]

// Auth routes where mainScreen class should be applied
export const authRoutes = [
  '/',
  '/signup',
  '/verification',
  '/get-started',
  '/success',
  '/qr-setup',
  '/onboarding',
  '/home',
  '/customer-login',
  '/customer-signup',
]

// Routes where NO layout should be shown (clean layout)
export const cleanRoutes = [
  '/', // landing page
  ...authRoutes // Include all auth routes in clean routes
]

// Sidebar navigation items
export const sidebarItems = [
  { 
    name: 'Dashboard', 
    icon: RiLayoutGridFill, 
    href: '/dashboard',
    active: true 
  },
  { 
    name: 'QR Codes', 
    icon: RiQrCodeLine, 
    href: '/qr-codes' 
  },
  { 
    name: 'Funds', 
    icon: RiFundsFill, 
    href: '/funds',
  },
  { 
    name: 'History', 
    icon: RiTimeFill, 
    href: '/history' 
  },
  { 
    name: 'Account', 
    icon: RiUserFill, 
    href: '/account',
  },
]

// Helper function to check if current path should show dashboard layout
export const shouldShowDashboardLayout = (pathname) => {
  return dashboardRoutes.some(route => pathname.startsWith(route))
}

// FIXED: Helper function to check if current path is auth route (should have mainScreen class)
export const isAuthRoute = (pathname) => {
  return authRoutes?.some(route => {
    if (route === '/') {
      return pathname === '/' // Exact match for root route
    }
    return pathname.startsWith(route)
  })
}

// Helper function to check if current path should show clean layout
export const shouldShowCleanLayout = (pathname) => {
  return cleanRoutes.some(route => {
    if (route === '/') {
      return pathname === '/' // Exact match for root route
    }
    return pathname === route || pathname.startsWith(route + '/')
  })
}

// Helper function to get layout type
export const getLayoutType = (pathname) => {
  if (shouldShowDashboardLayout(pathname)) {
    return 'dashboard' // Shows header + sidebar
  } else if (shouldShowCleanLayout(pathname)) {
    return 'clean'     // Shows nothing
  } else {
    return 'clean'     // Default fallback
  }
}

// Default user data structure
export const defaultUser = {
  name: 'Guest User',
  email: 'guest@itip.com',
  avatar: 'https://flowbite.com/docs/images/people/profile-picture-5.jpg'
}