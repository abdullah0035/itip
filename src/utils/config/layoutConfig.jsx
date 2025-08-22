// config/layoutConfig.js

import { 
  RiDashboardLine, 
  RiQrCodeLine, 
  RiMoneyDollarCircleLine, 
  RiBarChartLine, 
  RiWalletLine, 
  RiSettingsLine,
  RiGroupLine,
  RiShoppingBagLine 
} from '@remixicon/react'

// Routes where dashboard layout (header + sidebar) should be shown
export const dashboardRoutes = [
  '/dashboard',
  '/qr-codes',
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
    icon: RiDashboardLine, 
    href: '/dashboard',
    active: true 
  },
  { 
    name: 'QR Codes', 
    icon: RiQrCodeLine, 
    href: '/qr-codes' 
  },
  { 
    name: 'Tips', 
    icon: RiMoneyDollarCircleLine, 
    href: '/tips',
    badge: '5',
    badgeColor: 'blue'
  },
  { 
    name: 'Analytics', 
    icon: RiBarChartLine, 
    href: '/analytics' 
  },
  { 
    name: 'Earnings', 
    icon: RiWalletLine, 
    href: '/earnings' 
  },
  { 
    name: 'Users', 
    icon: RiGroupLine, 
    href: '/users',
    badge: 'Pro'
  },
  { 
    name: 'Products', 
    icon: RiShoppingBagLine, 
    href: '/products' 
  },
  { 
    name: 'Settings', 
    icon: RiSettingsLine, 
    href: '/settings' 
  }
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