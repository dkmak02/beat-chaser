'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authAPI } from '../services/authAPI';
import { extractUserDataFromJWT, UserData } from '../utils/jwt';

// Types
export interface User {
  id: string;
  username: string;
  email: string;
  authorities?: string[];
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Helper function to get token from cookies
const getTokenFromCookies = (): string | null => {
  if (typeof document === 'undefined') return null; // SSR check
  
  const cookies = document.cookie.split(';');
  const tokenCookie = cookies.find(cookie => 
    cookie.trim().startsWith('authToken=')
  );
  
  return tokenCookie ? tokenCookie.split('=')[1] : null;
};

// Helper function to decode JWT token (basic decode, not verification)
const decodeToken = (token: string): User | null => {
  try {
    const userData = extractUserDataFromJWT(token);
    
    if (userData) {
      // Convert UserData to User type (they're compatible)
      return {
        id: userData.id,
        username: userData.username,
        email: userData.email,
        authorities: userData.authorities,
      };
    }
    
    return null;
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};

// Provider component
interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing auth on mount
  useEffect(() => {
    const initAuth = async () => {
      try {
        const token = getTokenFromCookies();
        
        if (token) {
          // Try to decode user from token
          const userData = decodeToken(token);
          
          if (userData) {
            setUser(userData);
          } else {
            // If token is invalid, clear it
            authAPI.logout();
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        // Clear invalid token
        authAPI.logout();
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  // Login function
  const login = (userData: User, token: string) => {
    setUser(userData);
  };

  // Logout function
  const logout = () => {
    setUser(null);
    authAPI.logout(); // This clears the cookie
  };

  // Update user data
  const updateUser = (updates: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...updates });
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    updateUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to use auth context
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
}

// HOC for protected routes
export function withAuth<T extends {}>(Component: React.ComponentType<T>) {
  return function AuthenticatedComponent(props: T) {
    const { isAuthenticated, isLoading } = useAuth();
    
    if (isLoading) {
      return <div>Loading...</div>; // Or your loading component
    }
    
    if (!isAuthenticated) {
      // Redirect to login or show login modal
      return <div>Please log in to access this page</div>;
    }
    
    return <Component {...props} />;
  };
}
