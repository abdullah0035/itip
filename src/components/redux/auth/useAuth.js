// useAuth.js - Enhanced to handle both service providers and customers
import { useSelector } from 'react-redux'

export const useAuth = () => {
  const serviceProviderAuth = useSelector(state => state.auth.isLogin)
  const customerAuth = useSelector(state => state.auth.customerLogin)
  
  // Return true if either service provider or customer is logged in
  return serviceProviderAuth || customerAuth
}

// Enhanced hook to get user type and authentication status
export const useAuthDetails = () => {
  const serviceProviderAuth = useSelector(state => state.auth.isLogin)
  const customerAuth = useSelector(state => state.auth.customerLogin)
  const token = useSelector(state => state.auth.token)
  const userData = useSelector(state => state.auth.userData)
  
  return {
    isAuthenticated: serviceProviderAuth || customerAuth,
    isServiceProvider: serviceProviderAuth,
    isCustomer: customerAuth,
    userType: serviceProviderAuth ? 'service_provider' : customerAuth ? 'customer' : null,
    token,
    userData
  }
}

// Hook to get appropriate redirect paths based on user type
export const useAuthRedirects = () => {
  const { userType } = useAuthDetails()
  
  const getLoginPath = () => {
    return userType === 'customer' ? '/customer-login' : '/'
  }
  
  const getDashboardPath = () => {
    return userType === 'customer' ? '/customer-dashboard' : '/dashboard'
  }
  
  const getSignupPath = () => {
    return userType === 'customer' ? '/customer-signup' : '/signup'
  }
  
  return {
    loginPath: getLoginPath(),
    dashboardPath: getDashboardPath(),
    signupPath: getSignupPath()
  }
}