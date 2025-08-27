import axios from "axios"

export const baseURL = 'http://localhost/tip/api.php'
export const ImageURL = 'http://localhost/tip/api.php'

// export const baseURL = 'https://cdn.utecho.com:5999/'
// export const ImageURL = 'https://cdn.utecho.com:5999'

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