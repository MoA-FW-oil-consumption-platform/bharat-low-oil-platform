import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';

export * from './endpoints';

export interface StorageInterface {
  getItem(key: string): Promise<string | null> | string | null;
  setItem(key: string, value: string): Promise<void> | void;
  removeItem(key: string): Promise<void> | void;
}

export interface ApiClientConfig {
  baseURL: string;
  storage: StorageInterface;
  onUnauthorized?: () => void;
  getLanguage?: () => Promise<string> | string;
}

export const TOKEN_KEY = 'bharat_low_oil_token';
export const REFRESH_TOKEN_KEY = 'bharat_low_oil_refresh_token';

export const createApiClient = (config: ApiClientConfig): AxiosInstance => {
  const apiClient = axios.create({
    baseURL: config.baseURL,
    timeout: 30000,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Request interceptor - Add auth token
  apiClient.interceptors.request.use(
    async (requestConfig: InternalAxiosRequestConfig) => {
      try {
        const token = await config.storage.getItem(TOKEN_KEY);
        if (token && requestConfig.headers) {
          requestConfig.headers.Authorization = `Bearer ${token}`;
        }

        // Add Accept-Language header for i18n
        if (config.getLanguage && requestConfig.headers) {
          const language = await config.getLanguage();
          requestConfig.headers['Accept-Language'] = language || 'en';
        }
      } catch (error) {
        console.error('Error in request interceptor:', error);
      }
      return requestConfig;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Response interceptor - Handle token refresh
  let isRefreshing = false;
  let failedQueue: Array<{
    resolve: (value?: unknown) => void;
    reject: (reason?: unknown) => void;
  }> = [];

  const processQueue = (error: AxiosError | null, token: string | null = null) => {
    failedQueue.forEach((prom) => {
      if (error) {
        prom.reject(error);
      } else {
        prom.resolve(token);
      }
    });

    failedQueue = [];
  };

  apiClient.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

      // If error is 401 and we haven't retried yet
      if (error.response?.status === 401 && !originalRequest._retry) {
        if (isRefreshing) {
          // If already refreshing, queue this request
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          })
            .then((token) => {
              if (originalRequest.headers) {
                originalRequest.headers.Authorization = `Bearer ${token}`;
              }
              return apiClient(originalRequest);
            })
            .catch((err) => {
              return Promise.reject(err);
            });
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
          const refreshToken = await config.storage.getItem(REFRESH_TOKEN_KEY);

          if (!refreshToken) {
            throw new Error('No refresh token available');
          }

          // We use axios directly to avoid interceptors loop
          const response = await axios.post(`${config.baseURL}/api/auth/refresh`, {
            refreshToken,
          });

          const { token: newToken, refreshToken: newRefreshToken } = response.data;

          await config.storage.setItem(TOKEN_KEY, newToken);
          if (newRefreshToken) {
            await config.storage.setItem(REFRESH_TOKEN_KEY, newRefreshToken);
          }

          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
          }

          processQueue(null, newToken);
          isRefreshing = false;

          return apiClient(originalRequest);
        } catch (refreshError) {
          processQueue(refreshError as AxiosError, null);
          
          await config.storage.removeItem(TOKEN_KEY);
          await config.storage.removeItem(REFRESH_TOKEN_KEY);
          
          if (config.onUnauthorized) {
            config.onUnauthorized();
          }
          
          isRefreshing = false;
          return Promise.reject(refreshError);
        }
      }

      return Promise.reject(error);
    }
  );

  return apiClient;
};

// API Error type
export interface ApiError {
  error: string;
  message?: string;
  code?: string;
  details?: unknown;
}

// Helper to extract error message
export const getErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    const apiError = error.response?.data as ApiError;
    return apiError?.error || apiError?.message || error.message || 'An error occurred';
  }
  if (error instanceof Error) {
    return error.message;
  }
  return 'An unknown error occurred';
};
