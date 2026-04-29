/**
 * API Client Setup with Authentication
 * 
 * This file shows how to configure the API client with authentication
 * interceptors. Import this in your main app entry point.
 */

import { apiClient } from './apiClient';

/**
 * Setup authentication interceptors
 * Call this function in your app initialization (e.g., main.tsx)
 */
export function setupApiInterceptors() {
  // Request interceptor: Add auth token to all requests
  apiClient.addRequestInterceptor((url, config) => {
    const token = localStorage.getItem('authToken');
    
    if (token) {
      config.headers = {
        ...config.headers,
        'Authorization': `Bearer ${token}`,
      };
    }
    
    return { url, config };
  });

  // Request interceptor: Add request tracking
  apiClient.addRequestInterceptor((url, config) => {
    // Add request ID for tracking
    const requestId = crypto.randomUUID();
    config.headers = {
      ...config.headers,
      'X-Request-ID': requestId,
    };
    
    return { url, config };
  });

  // Error interceptor: Handle authentication errors
  apiClient.addErrorInterceptor((error) => {
    if (error.statusCode === 401) {
      // Clear authentication state
      localStorage.removeItem('authToken');
      
      // Redirect to login page
      // You might want to use your router's navigation instead
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    
    throw error;
  });

  // Error interceptor: Handle forbidden errors
  apiClient.addErrorInterceptor((error) => {
    if (error.statusCode === 403) {
      console.warn('Access denied to resource');
      // You could show a toast notification here
    }
    
    throw error;
  });

  // Error interceptor: Handle server errors
  apiClient.addErrorInterceptor((error) => {
    if (error.statusCode && error.statusCode >= 500) {
      console.error('Server error:', error.message);
      // You could show a global error notification here
    }
    
    throw error;
  });
}

/**
 * Authentication helper functions
 */
export const authHelpers = {
  /**
   * Set authentication token
   */
  setToken(token: string) {
    localStorage.setItem('authToken', token);
    apiClient.setAuthToken(token);
  },

  /**
   * Get current authentication token
   */
  getToken(): string | null {
    return localStorage.getItem('authToken');
  },

  /**
   * Remove authentication token
   */
  removeToken() {
    localStorage.removeItem('authToken');
    apiClient.removeAuthToken();
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return !!this.getToken();
  },
};

/**
 * Example: Token refresh interceptor (if you have refresh tokens)
 */
export function setupTokenRefresh() {
  let isRefreshing = false;
  let failedQueue: Array<{ resolve: (token: string) => void; reject: (error: any) => void }> = [];

  const processQueue = (error: any, token: string | null = null) => {
    failedQueue.forEach((promise) => {
      if (error) {
        promise.reject(error);
      } else if (token) {
        promise.resolve(token);
      }
    });

    failedQueue = [];
  };

  apiClient.addRequestInterceptor(async (url, config) => {
    const token = authHelpers.getToken();

    if (!token) {
      return { url, config };
    }

    // Check if token is expired (you'd implement this based on your token structure)
    const isTokenExpired = false; // checkIfTokenExpired(token);

    if (isTokenExpired && !isRefreshing) {
      isRefreshing = true;

      try {
        // Call your refresh token endpoint
        const response = await fetch('/api/auth/refresh', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            refreshToken: localStorage.getItem('refreshToken'),
          }),
        });

        const { token: newToken } = await response.json();
        authHelpers.setToken(newToken);
        processQueue(null, newToken);

        config.headers = {
          ...config.headers,
          'Authorization': `Bearer ${newToken}`,
        };
      } catch (error) {
        processQueue(error, null);
        authHelpers.removeToken();
      } finally {
        isRefreshing = false;
      }
    }

    return { url, config };
  });
}
