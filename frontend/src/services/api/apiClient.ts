/**
 * Centralized API Client with Interceptors
 * 
 * This client provides:
 * - Request/Response interceptors
 * - Automatic error handling
 * - Common headers management
 * - Query parameter handling
 * - Type-safe responses
 */

import type {
  ApiError,
  RequestConfig,
  RequestInterceptor,
  ResponseInterceptor,
  ErrorInterceptor,
} from './types';

class ApiClient {
  private baseURL: string;
  private defaultHeaders: Record<string, string>;
  private requestInterceptors: RequestInterceptor[] = [];
  private responseInterceptors: ResponseInterceptor[] = [];
  private errorInterceptors: ErrorInterceptor[] = [];

  constructor(baseURL: string) {
    this.baseURL = baseURL;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
    };
  }

  /**
   * Add a request interceptor
   */
  addRequestInterceptor(interceptor: RequestInterceptor): void {
    this.requestInterceptors.push(interceptor);
  }

  /**
   * Add a response interceptor
   */
  addResponseInterceptor(interceptor: ResponseInterceptor): void {
    this.responseInterceptors.push(interceptor);
  }

  /**
   * Add an error interceptor
   */
  addErrorInterceptor(interceptor: ErrorInterceptor): void {
    this.errorInterceptors.push(interceptor);
  }

  /**
   * Set default headers
   */
  setDefaultHeaders(headers: Record<string, string>): void {
    this.defaultHeaders = { ...this.defaultHeaders, ...headers };
  }

  /**
   * Set authorization token
   */
  setAuthToken(token: string): void {
    this.defaultHeaders['Authorization'] = `Bearer ${token}`;
  }

  /**
   * Remove authorization token
   */
  removeAuthToken(): void {
    delete this.defaultHeaders['Authorization'];
  }

  /**
   * Build URL with query parameters
   */
  private buildURL(endpoint: string, params?: Record<string, string | number | boolean>): string {
    // Remove leading slash from endpoint to ensure proper concatenation
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
    
    // Ensure baseURL ends with / for proper concatenation
    const baseURL = this.baseURL.endsWith('/') ? this.baseURL : `${this.baseURL}/`;
    
    // Construct the full URL
    const fullURL = `${baseURL}${cleanEndpoint}`;
    const url = new URL(fullURL);
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, String(value));
      });
    }

    return url.toString();
  }

  /**
   * Apply request interceptors
   */
  private async applyRequestInterceptors(
    url: string,
    config: RequestConfig
  ): Promise<{ url: string; config: RequestConfig }> {
    let modifiedUrl = url;
    let modifiedConfig = config;

    for (const interceptor of this.requestInterceptors) {
      const result = await interceptor(modifiedUrl, modifiedConfig);
      modifiedUrl = result.url;
      modifiedConfig = result.config;
    }

    return { url: modifiedUrl, config: modifiedConfig };
  }

  /**
   * Apply response interceptors
   */
  private async applyResponseInterceptors(response: Response): Promise<Response> {
    let modifiedResponse = response;

    for (const interceptor of this.responseInterceptors) {
      modifiedResponse = await interceptor(modifiedResponse);
    }

    return modifiedResponse;
  }

  /**
   * Apply error interceptors
   */
  private async applyErrorInterceptors(error: ApiError): Promise<never> {
    let modifiedError = error;

    for (const interceptor of this.errorInterceptors) {
      try {
        await interceptor(modifiedError);
      } catch (err) {
        modifiedError = err as ApiError;
      }
    }

    throw modifiedError;
  }

  /**
   * Handle API errors
   */
  private async handleError(response: Response): Promise<never> {
    let error: ApiError;

    try {
      const errorData = await response.json();
      error = {
        message: errorData.message || `HTTP Error ${response.status}`,
        errors: errorData.errors,
        detail: errorData.detail,
        statusCode: response.status,
      };
    } catch {
      error = {
        message: `HTTP Error ${response.status}: ${response.statusText}`,
        statusCode: response.status,
      };
    }

    return this.applyErrorInterceptors(error);
  }

  /**
   * Make a request
   */
  private async request<T>(
    endpoint: string,
    config: RequestConfig = {}
  ): Promise<T> {
    const { params, skipInterceptors, ...fetchConfig } = config;

    // Build URL
    let url = this.buildURL(endpoint, params);

    // Merge headers
    const headers = {
      ...this.defaultHeaders,
      ...fetchConfig.headers,
    };

    let requestConfig: RequestConfig = {
      ...fetchConfig,
      headers,
    };

    // Apply request interceptors
    if (!skipInterceptors) {
      const intercepted = await this.applyRequestInterceptors(url, requestConfig);
      url = intercepted.url;
      requestConfig = intercepted.config;
    }

    try {
      // Make the request
      const response = await fetch(url, requestConfig);

      // Apply response interceptors
      const interceptedResponse = skipInterceptors 
        ? response 
        : await this.applyResponseInterceptors(response.clone());

      // Handle errors
      if (!interceptedResponse.ok) {
        await this.handleError(interceptedResponse);
      }

      // Parse response
      const data = await response.json();
      return data as T;
    } catch (error) {
      // If it's already an ApiError, throw it
      if ((error as ApiError).statusCode !== undefined) {
        throw error;
      }

      // Handle network errors
      const apiError: ApiError = {
        message: error instanceof Error ? error.message : 'Network error occurred',
        statusCode: 0,
      };

      return this.applyErrorInterceptors(apiError);
    }
  }

  /**
   * GET request
   */
  async get<T = any>(endpoint: string, config?: RequestConfig): Promise<T> {
    return this.request<T>(endpoint, {
      ...config,
      method: 'GET',
    });
  }

  /**
   * POST request
   */
  async post<T = any>(
    endpoint: string,
    data?: any,
    config?: RequestConfig
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...config,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  /**
   * PUT request
   */
  async put<T = any>(
    endpoint: string,
    data?: any,
    config?: RequestConfig
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...config,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  /**
   * PATCH request
   */
  async patch<T = any>(
    endpoint: string,
    data?: any,
    config?: RequestConfig
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...config,
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  /**
   * DELETE request
   */
  async delete<T = any>(endpoint: string, config?: RequestConfig): Promise<T> {
    return this.request<T>(endpoint, {
      ...config,
      method: 'DELETE',
    });
  }
}

// Create and configure the default API client
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5174/api/v1';
export const apiClient = new ApiClient(API_BASE_URL);

// Add default request interceptor for logging (development only)
if (import.meta.env.DEV) {
  apiClient.addRequestInterceptor((url, config) => {
    console.log(`[API Request] ${config.method || 'GET'} ${url}`);
    return { url, config };
  });

  apiClient.addResponseInterceptor((response) => {
    console.log(`[API Response] ${response.status} ${response.url}`);
    return response;
  });
}

// Add default error interceptor for common error handling
apiClient.addErrorInterceptor((error) => {
  // Handle common error scenarios
  if (error.statusCode === 401) {
    // Unauthorized - could trigger logout or token refresh
    console.error('[API Error] Unauthorized access');
    // You can dispatch a Redux action here to handle logout
  } else if (error.statusCode === 403) {
    console.error('[API Error] Forbidden access');
  } else if (error.statusCode === 404) {
    console.error('[API Error] Resource not found');
  } else if (error.statusCode === 500) {
    console.error('[API Error] Server error');
  }

  throw error;
});

export default apiClient;
