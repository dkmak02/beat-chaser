/**
 * JWT Utility functions for handling JWT tokens in the frontend
 * Provides functions to decode tokens and extract user information
 */

export interface UserData {
  id: string;
  username: string;
  email: string;
  authorities: string[];
}

export interface JWTPayload {
  sub: string; // subject (username)
  userId?: string;
  id?: string;
  username?: string;
  email?: string;
  authorities?: Array<string | { authority: string }>;
  roles?: Array<string | { authority: string }>;
  iat?: number; // issued at
  exp?: number; // expiration
}

/**
 * Decode a JWT token without verification (for client-side use only)
 * Note: This only decodes the payload, it doesn't verify the signature
 */
export function decodeJWT(token: string): JWTPayload | null {
  try {
    // JWT tokens have 3 parts separated by dots: header.payload.signature
    const parts = token.split('.');
    if (parts.length !== 3) {
      console.error('Invalid JWT token format');
      return null;
    }

    // Decode the payload (second part)
    const payload = parts[1];
    
    // Add padding if needed for base64 decoding
    const paddedPayload = payload + '='.repeat((4 - payload.length % 4) % 4);
    
    // Decode from base64url
    const decodedPayload = atob(paddedPayload.replace(/-/g, '+').replace(/_/g, '/'));
    
    return JSON.parse(decodedPayload) as JWTPayload;
  } catch (error) {
    console.error('Error decoding JWT token:', error);
    return null;
  }
}

/**
 * Extract user data from JWT token
 */
export function extractUserDataFromJWT(token: string): UserData | null {
  const payload = decodeJWT(token);
  if (!payload) {
    return null;
  }

  try {
    // Helper function to normalize authorities - handles both string arrays and object arrays
    const normalizeAuthorities = (authorities?: Array<string | { authority: string }>): string[] => {
      if (!authorities || !Array.isArray(authorities)) {
        return [];
      }
      
      return authorities.map(auth => {
        if (typeof auth === 'string') {
          return auth;
        } else if (auth && typeof auth === 'object' && 'authority' in auth) {
          return auth.authority;
        }
        return '';
      }).filter(auth => auth !== '');
    };

    // Extract user data from the JWT payload
    // The exact field names might vary depending on your backend implementation
    const userData: UserData = {
      id: payload.id || payload.userId || payload.sub || '',
      username: payload.username || payload.sub || '',
      email: payload.email || '',
      authorities: normalizeAuthorities(payload.authorities) || normalizeAuthorities(payload.roles) || []
    };

    return userData;
  } catch (error) {
    console.error('Error extracting user data from JWT:', error);
    return null;
  }
}

/**
 * Check if a JWT token is expired
 */
export function isTokenExpired(token: string): boolean {
  const payload = decodeJWT(token);
  if (!payload || !payload.exp) {
    return true;
  }

  // Check if current time is past expiration time
  const currentTime = Math.floor(Date.now() / 1000);
  return currentTime >= payload.exp;
}

/**
 * Get JWT token from localStorage
 */
export function getStoredToken(): string | null {
  if (typeof window === 'undefined') {
    return null; // Server-side rendering
  }
  
  return localStorage.getItem('token');
}

/**
 * Store JWT token in localStorage
 */
export function storeToken(token: string): void {
  if (typeof window === 'undefined') {
    return; // Server-side rendering
  }
  
  localStorage.setItem('token', token);
}

/**
 * Remove JWT token from localStorage
 */
export function removeToken(): void {
  if (typeof window === 'undefined') {
    return; // Server-side rendering
  }
  
  localStorage.removeItem('token');
}

/**
 * Get user data from stored token
 */
export function getStoredUserData(): UserData | null {
  const token = getStoredToken();
  if (!token) {
    return null;
  }

  if (isTokenExpired(token)) {
    removeToken();
    return null;
  }

  return extractUserDataFromJWT(token);
}

/**
 * Check if user has specific authority/role
 */
export function hasAuthority(userData: UserData | null, authority: string): boolean {
  if (!userData || !userData.authorities) {
    return false;
  }
  
  return userData.authorities.includes(authority);
}

/**
 * Check if user has any of the specified authorities/roles
 */
export function hasAnyAuthority(userData: UserData | null, authorities: string[]): boolean {
  if (!userData || !userData.authorities) {
    return false;
  }
  
  return authorities.some(auth => userData.authorities.includes(auth));
}