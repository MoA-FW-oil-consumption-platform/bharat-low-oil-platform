# Authentication Service

A unified authentication service supporting both web and mobile platforms with email/password and Google OAuth authentication via Supabase.

## Features

- ✅ Email/Password Authentication
- ✅ Google OAuth Authentication
- ✅ Cross-platform support (Web & Mobile)
- ✅ JWT Token Generation
- ✅ Session Management
- ✅ Token Refresh
- ✅ User Profile Management

## Environment Variables

Create a `.env` file in the auth-service directory:

```env
PORT=3001
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=7d
WEB_URL=http://localhost:3000
```

## API Endpoints

### 1. Register (Email/Password)

**Endpoint:** `POST /auth/register`

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123",
  "fullName": "John Doe",
  "platform": "web" // or "mobile"
}
```

**Response:**
```json
{
  "message": "Registration successful",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "user_metadata": {
      "full_name": "John Doe",
      "platform": "web"
    }
  },
  "session": {
    "access_token": "...",
    "refresh_token": "..."
  },
  "token": "jwt_token_here",
  "platform": "web"
}
```

### 2. Login (Email/Password)

**Endpoint:** `POST /auth/login`

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123",
  "platform": "web" // or "mobile"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "user": {
    "id": "uuid",
    "email": "user@example.com"
  },
  "session": {
    "access_token": "...",
    "refresh_token": "..."
  },
  "token": "jwt_token_here",
  "platform": "web"
}
```

### 3. Google OAuth - Initiate

**Endpoint:** `POST /auth/oauth/initiate`

**Request Body:**
```json
{
  "provider": "google",
  "platform": "web", // or "mobile"
  "redirectTo": "https://yourapp.com/auth/callback" // optional
}
```

**Response:**
```json
{
  "url": "https://accounts.google.com/o/oauth2/v2/auth?...",
  "provider": "google",
  "platform": "web"
}
```

**Usage:**
- **Web:** Redirect user to the returned `url`
- **Mobile:** Open the `url` in a browser or WebView

### 4. Google OAuth - Callback

**Endpoint:** `POST /auth/oauth/callback`

**Request Body:**
```json
{
  "access_token": "token_from_oauth_redirect",
  "refresh_token": "refresh_token_from_oauth",
  "platform": "web" // or "mobile"
}
```

**Response:**
```json
{
  "message": "OAuth login successful",
  "user": {
    "id": "uuid",
    "email": "user@example.com"
  },
  "session": {
    "access_token": "...",
    "refresh_token": "..."
  },
  "token": "jwt_token_here",
  "platform": "web"
}
```

### 5. Refresh Token

**Endpoint:** `POST /auth/refresh`

**Request Body:**
```json
{
  "refresh_token": "your_refresh_token",
  "platform": "web" // or "mobile"
}
```

**Response:**
```json
{
  "session": {
    "access_token": "new_access_token",
    "refresh_token": "new_refresh_token"
  },
  "token": "new_jwt_token",
  "platform": "web"
}
```

### 6. Get Current User

**Endpoint:** `GET /auth/me`

**Headers:**
```
Authorization: Bearer your_jwt_token
```

**Response:**
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "user_metadata": {
      "full_name": "John Doe",
      "platform": "web"
    },
    "created_at": "2025-01-01T00:00:00Z"
  },
  "platform": "web"
}
```

### 7. Verify Token

**Endpoint:** `GET /auth/verify`

**Headers:**
```
Authorization: Bearer your_jwt_token
```

**Response:**
```json
{
  "valid": true,
  "user": {
    "userId": "uuid",
    "email": "user@example.com",
    "platform": "web"
  }
}
```

### 8. Logout

**Endpoint:** `POST /auth/logout`

**Response:**
```json
{
  "message": "Logout successful"
}
```

## Platform-Specific Integration

### Web Application

```typescript
// Login with Email/Password
const loginWithEmail = async (email: string, password: string) => {
  const response = await fetch('http://localhost:3001/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email,
      password,
      platform: 'web'
    })
  });
  
  const data = await response.json();
  // Store token in localStorage or secure storage
  localStorage.setItem('authToken', data.token);
  return data;
};

// Login with Google OAuth
const loginWithGoogle = async () => {
  // Step 1: Initiate OAuth
  const response = await fetch('http://localhost:3001/auth/oauth/initiate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      provider: 'google',
      platform: 'web',
      redirectTo: 'http://localhost:3000/auth/callback'
    })
  });
  
  const { url } = await response.json();
  
  // Step 2: Redirect to OAuth URL
  window.location.href = url;
};

// Handle OAuth callback (in your /auth/callback page)
const handleOAuthCallback = async () => {
  // Extract tokens from URL hash
  const hash = window.location.hash.substring(1);
  const params = new URLSearchParams(hash);
  const access_token = params.get('access_token');
  const refresh_token = params.get('refresh_token');
  
  if (access_token && refresh_token) {
    // Step 3: Send tokens to backend
    const response = await fetch('http://localhost:3001/auth/oauth/callback', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        access_token,
        refresh_token,
        platform: 'web'
      })
    });
    
    const data = await response.json();
    localStorage.setItem('authToken', data.token);
    return data;
  }
};
```

### Mobile Application (React Native)

```typescript
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as WebBrowser from 'expo-web-browser';
import * as Linking from 'expo-linking';

// Login with Email/Password
const loginWithEmail = async (email: string, password: string) => {
  const response = await fetch('http://your-api-url/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email,
      password,
      platform: 'mobile'
    })
  });
  
  const data = await response.json();
  await AsyncStorage.setItem('authToken', data.token);
  return data;
};

// Login with Google OAuth
const loginWithGoogle = async () => {
  // Step 1: Initiate OAuth
  const response = await fetch('http://your-api-url/auth/oauth/initiate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      provider: 'google',
      platform: 'mobile',
      redirectTo: 'bharatlowoil://auth/callback'
    })
  });
  
  const { url } = await response.json();
  
  // Step 2: Open OAuth URL in browser
  const result = await WebBrowser.openAuthSessionAsync(
    url,
    'bharatlowoil://auth/callback'
  );
  
  if (result.type === 'success') {
    const { url: redirectUrl } = result;
    const { queryParams } = Linking.parse(redirectUrl);
    
    // Step 3: Send tokens to backend
    const callbackResponse = await fetch('http://your-api-url/auth/oauth/callback', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        access_token: queryParams.access_token,
        refresh_token: queryParams.refresh_token,
        platform: 'mobile'
      })
    });
    
    const data = await callbackResponse.json();
    await AsyncStorage.setItem('authToken', data.token);
    return data;
  }
};

// Refresh Token
const refreshAuthToken = async () => {
  const refreshToken = await AsyncStorage.getItem('refreshToken');
  
  const response = await fetch('http://your-api-url/auth/refresh', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      refresh_token: refreshToken,
      platform: 'mobile'
    })
  });
  
  const data = await response.json();
  await AsyncStorage.setItem('authToken', data.token);
  return data;
};
```

## Setup Supabase

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Create a new project
3. Go to Authentication → Providers
4. Enable Email provider
5. Enable Google provider:
   - Get Google OAuth credentials from [Google Cloud Console](https://console.cloud.google.com)
   - Add redirect URLs:
     - Web: `https://your-supabase-project.supabase.co/auth/v1/callback`
     - Mobile: Add `bharatlowoil://auth/callback` to your Google OAuth authorized redirect URIs
6. Copy your Supabase URL and anon key to `.env`

## Mobile Deep Linking Setup

### iOS (React Native)

Add to `Info.plist`:
```xml
<key>CFBundleURLTypes</key>
<array>
  <dict>
    <key>CFBundleURLSchemes</key>
    <array>
      <string>bharatlowoil</string>
    </array>
  </dict>
</array>
```

### Android (React Native)

Add to `AndroidManifest.xml`:
```xml
<intent-filter>
  <action android:name="android.intent.action.VIEW" />
  <category android:name="android.intent.category.DEFAULT" />
  <category android:name="android.intent.category.BROWSABLE" />
  <data android:scheme="bharatlowoil" />
</intent-filter>
```

## Running the Service

```bash
# Install dependencies
npm install

# Development
npm run dev

# Production
npm run build
npm start
```

## Security Best Practices

1. **Store tokens securely:**
   - Web: Use httpOnly cookies or secure localStorage
   - Mobile: Use SecureStore/Keychain

2. **Implement token refresh:**
   - Refresh tokens before they expire
   - Handle refresh failures gracefully

3. **HTTPS only in production:**
   - Never send tokens over HTTP

4. **Validate all inputs:**
   - The service uses Joi for validation

5. **Rate limiting:**
   - Implement rate limiting for auth endpoints

6. **Monitor failed login attempts:**
   - Add logic to detect and prevent brute force attacks

## Error Handling

All endpoints return consistent error responses:

```json
{
  "error": "Error message description"
}
```

Common HTTP status codes:
- `200` - Success
- `201` - Created (registration)
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (invalid credentials/token)
- `500` - Internal Server Error

## Testing

```bash
npm test
```

## License

MIT
