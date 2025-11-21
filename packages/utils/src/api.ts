/**
 * API Utilities
 */

export interface ApiRequestOptions extends RequestInit {
  token?: string;
  params?: Record<string, string | number | boolean>;
}

export const buildUrl = (
  baseUrl: string,
  path: string,
  params?: Record<string, string | number | boolean>
): string => {
  const url = new URL(path, baseUrl);

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, String(value));
    });
  }

  return url.toString();
};

export const buildHeaders = (token?: string, customHeaders?: Record<string, string>): Headers => {
  const headers = new Headers(customHeaders);

  headers.set('Content-Type', 'application/json');

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  return headers;
};

export const handleApiError = (error: any): string => {
  if (error.response) {
    // Server responded with error
    return error.response.data?.message || error.response.statusText;
  } else if (error.request) {
    // Request made but no response
    return 'No response from server. Please check your connection.';
  } else {
    // Error in request setup
    return error.message || 'An unexpected error occurred';
  }
};

export const retryRequest = async <T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<T> => {
  let lastError: any;

  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      if (i < maxRetries - 1) {
        await new Promise((resolve) => setTimeout(resolve, delay * (i + 1)));
      }
    }
  }

  throw lastError;
};

export const parseApiResponse = <T>(response: any): T => {
  if (response.success && response.data) {
    return response.data as T;
  }
  throw new Error(response.error || response.message || 'API request failed');
};
