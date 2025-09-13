# JWT Authentication Utils

This utility provides functions to handle JWT tokens and extract user data in the frontend application.

## Features

The JWT utilities extract the following data from JWT tokens:
- **UUID id**: User's unique identifier
- **String username**: User's login username  
- **String email**: User's email address
- **Collection authorities**: User's roles/permissions (equivalent to GrantedAuthority from backend)

## Usage Examples

### 1. Extract User Data from JWT Token

```typescript
import { extractUserDataFromJWT } from '@/utils/jwt';

const token = 'your-jwt-token-here';
const userData = extractUserDataFromJWT(token);

if (userData) {
  console.log('User ID:', userData.id);
  console.log('Username:', userData.username);
  console.log('Email:', userData.email);
  console.log('Authorities:', userData.authorities);
}
```

### 2. Using the UserContext Hook

```typescript
import { useUser } from '@/contexts/UserContext';

function MyComponent() {
  const { isLoggedIn, userData, hasAuthority } = useUser();
  
  if (!isLoggedIn) {
    return <div>Please log in</div>;
  }

  return (
    <div>
      <h1>Welcome, {userData?.username}!</h1>
      <p>Email: {userData?.email}</p>
      <p>User ID: {userData?.id}</p>
      
      {/* Conditional rendering based on authorities */}
      {hasAuthority('ADMIN') && (
        <AdminPanel />
      )}
      
      {hasAuthority('MODERATOR') && (
        <ModeratorTools />
      )}
    </div>
  );
}
```

### 3. Check User Authorities

```typescript
import { useUser } from '@/contexts/UserContext';

function ProtectedComponent() {
  const { userData, hasAuthority } = useUser();
  
  // Check single authority
  const isAdmin = hasAuthority('ADMIN');
  
  // Check multiple authorities (from utils)
  import { hasAnyAuthority } from '@/utils/jwt';
  const canModerate = hasAnyAuthority(userData, ['ADMIN', 'MODERATOR']);
  
  return (
    <div>
      {isAdmin && <button>Admin Actions</button>}
      {canModerate && <button>Moderate Content</button>}
    </div>
  );
}
```

### 4. Making Authenticated API Calls

```typescript
import { getStoredToken } from '@/utils/jwt';

async function makeAuthenticatedRequest() {
  const token = getStoredToken();
  
  if (!token) {
    throw new Error('No authentication token found');
  }
  
  const response = await fetch('/api/protected-endpoint', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  
  return response.json();
}
```

### 5. Token Management

```typescript
import { 
  storeToken, 
  removeToken, 
  isTokenExpired,
  getStoredUserData 
} from '@/utils/jwt';

// Store token after login
storeToken('your-jwt-token');

// Check if token is expired
const expired = isTokenExpired(token);
if (expired) {
  removeToken();
  // Redirect to login
}

// Get user data from stored token
const userData = getStoredUserData();
```

## Available Functions

### Token Management
- `storeToken(token: string)` - Store JWT token in localStorage
- `getStoredToken()` - Get JWT token from localStorage
- `removeToken()` - Remove JWT token from localStorage
- `isTokenExpired(token: string)` - Check if token is expired

### Data Extraction
- `decodeJWT(token: string)` - Decode JWT payload (client-side only)
- `extractUserDataFromJWT(token: string)` - Extract user data from JWT
- `getStoredUserData()` - Get user data from stored token

### Authority Checking
- `hasAuthority(userData, authority: string)` - Check single authority
- `hasAnyAuthority(userData, authorities: string[])` - Check multiple authorities

## UserContext API

The UserContext provides:
- `isLoggedIn: boolean` - Whether user is authenticated
- `userData: UserData | null` - Complete user data from JWT
- `username: string` - Username for backward compatibility
- `login(userData: UserData)` - Log in with user data
- `logout()` - Log out and clear token
- `hasAuthority(authority: string)` - Check if user has specific authority

## Security Notes

⚠️ **Important**: These utilities only decode JWT tokens client-side for UI purposes. They do NOT verify token signatures. Always validate tokens server-side for security-critical operations.

## Backend Integration

This frontend implementation expects JWT tokens with the following payload structure:

```json
{
  "sub": "username",
  "id": "user-uuid",
  "username": "username", 
  "email": "user@example.com",
  "authorities": ["USER", "ADMIN"],
  "iat": 1234567890,
  "exp": 1234567890
}
```

**Note**: The utilities also support authorities as objects (Spring Security format):
```json
{
  "authorities": [
    {"authority": "USER"},
    {"authority": "ADMIN"}
  ]
}
```

The token should be returned in login/register responses as:
```json
{
  "success": true,
  "data": {
    "token": "jwt-token-here"
  }
}
```