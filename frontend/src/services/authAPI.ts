import { apiClient } from './apiClient';

// Types for auth requests and responses
export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface AuthResponse {
  message: string;
  token: string;
}

// Helper function to set token in httpOnly cookie (this would typically be done by backend)
const setTokenCookie = (token: string): void => {
  if (typeof document === 'undefined') return; // SSR check
  
  // Set cookie with secure flags
  const expires = new Date();
  expires.setTime(expires.getTime() + (7 * 24 * 60 * 60 * 1000)); // 7 days
  
  document.cookie = `authToken=${token}; expires=${expires.toUTCString()}; path=/; SameSite=Strict; Secure`;
};

// Auth API functions
export const authAPI = {
  // Register new user
  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    const endpoint = process.env.NEXT_PUBLIC_AUTH_REGISTER_ENDPOINT;
    const response = await apiClient.post<AuthResponse>(endpoint!, data);
    
    // Store token in cookie after successful registration
    if (response.data.token) {
      setTokenCookie(response.data.token);
    }
    
    return response.data;
  },

  // Login user
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const endpoint = process.env.NEXT_PUBLIC_AUTH_LOGIN_ENDPOINT;
    const response = await apiClient.post<AuthResponse>(endpoint!, data);
    
    // Store token in cookie after successful login
    if (response.data.token) {
      setTokenCookie(response.data.token);
    }
    
    return response.data;
  },

  // Logout user
  logout: (): void => {
    // Remove token cookie
    if (typeof document !== 'undefined') {
      document.cookie = 'authToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=Strict; Secure';
    }
  },
};

export default authAPI;
