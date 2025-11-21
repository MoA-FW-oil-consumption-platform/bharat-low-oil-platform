export type Platform = 'web' | 'mobile';

export interface RegisterRequest {
  email: string;
  password: string;
  fullName: string;
  platform?: Platform;
}

export interface LoginRequest {
  email: string;
  password: string;
  platform?: Platform;
}

export interface OAuthInitiateRequest {
  provider: 'google';
  platform: Platform;
  redirectTo?: string;
}

export interface OAuthCallbackRequest {
  access_token: string;
  refresh_token: string;
  platform?: Platform;
}

export interface RefreshTokenRequest {
  refresh_token: string;
  platform?: Platform;
}

export interface AuthResponse {
  message: string;
  user: {
    id: string;
    email: string;
    user_metadata?: {
      full_name?: string;
      platform?: Platform;
    };
  };
  session?: {
    access_token: string;
    refresh_token: string;
    expires_in: number;
  };
  token: string;
  platform: Platform;
}

export interface OAuthInitiateResponse {
  url: string;
  provider: string;
  platform: Platform;
}

export interface UserResponse {
  user: {
    id: string;
    email: string;
    user_metadata: any;
    created_at: string;
  };
  platform: Platform;
}

export interface VerifyTokenResponse {
  valid: boolean;
  user?: {
    userId: string;
    email: string;
    platform: Platform;
  };
  error?: string;
}

export interface ErrorResponse {
  error: string;
}
