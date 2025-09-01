import axios from "axios"

export const baseURL = 'https://btctrades.live/itip/api.php'
export const ImageURL = 'http://localhost/tip/api.php'

// Flag to prevent multiple simultaneous logout actions
let isLoggingOut = false;

// Store reference to dispatch function
let reduxDispatch = null;

// Function to set the dispatch reference
export const setReduxDispatch = (dispatch) => {
  reduxDispatch = dispatch;
};

export const axiosInstance = axios.create({
  baseURL: baseURL
})

axiosInstance.interceptors.request.use(
  config => {
    const token = localStorage.getItem('titanium-token');
    if (token) {
      config.headers['x-auth-token'] = token;
    }
    return config;
  },
  error => Promise.reject(error)
);

// Response interceptor to handle session expiry globally
axiosInstance.interceptors.response.use(
  response => response,
  error => {
    // Handle 403 errors (session expired)
    if (error?.response?.status === 403) {
      if (!isLoggingOut) {
        isLoggingOut = true;
        
        // Clear token and user data
        localStorage.removeItem('isLogin_admin');
        localStorage.removeItem('titanium-token');
        
        // Dispatch logout action if available
        if (reduxDispatch) {
          const { setLogout } = require('../../components/redux/loginForm');
          reduxDispatch(setLogout());
        }
        
        // Show toast message only once
        // toast.error('Session Expired! Please log in again.');
        
        // Reset the flag after a short delay to allow for navigation
        setTimeout(() => {
          isLoggingOut = false;
        }, 1000);
      }
    }
    
    // Handle 401 errors (unauthorized)
    if (error?.response?.status === 401) {
      if (!isLoggingOut) {
        isLoggingOut = true;
        localStorage.removeItem('isLogin_admin');
        localStorage.removeItem('titanium-token');
        
        setTimeout(() => {
          isLoggingOut = false;
        }, 1000);
      }
    }
    
    return Promise.reject(error);
  }
);