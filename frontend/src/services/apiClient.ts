import axios, { InternalAxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';

// Helper function to get token from cookies
const getTokenFromCookies = (): string | null => {
  if (typeof document === 'undefined') return null; // SSR check
  
  const cookies = document.cookie.split(';');
  const tokenCookie = cookies.find(cookie => 
    cookie.trim().startsWith('authToken=')
  );
  
  return tokenCookie ? tokenCookie.split('=')[1] : null;
};

// Helper function to remove token cookie
const removeTokenCookie = (): void => {
  if (typeof document === 'undefined') return; // SSR check
  
  document.cookie = 'authToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=Strict; Secure';
};

// Create axios instance with base configuration
export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds timeout
  withCredentials: true, // Important for cookies
});

// Request interceptor to add auth token if available
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Add auth token to requests if available
    const token = getTokenFromCookies();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    // Handle common error scenarios
    if (error.response?.status === 401) {
      // Unauthorized - clear token cookie
      removeTokenCookie();
      // You can add redirect logic here
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
