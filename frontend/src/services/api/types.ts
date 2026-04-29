/**
 * Common API types and interfaces
 */

export interface ApiResponse<T = any> {
  data: T;
  message?: string;
  success?: boolean;
}

export interface ApiError {
  message: string;
  errors?: Array<{ path: string; message: string }>;
  detail?: string;
  statusCode?: number;
}

export interface RequestConfig extends RequestInit {
  params?: Record<string, string | number | boolean>;
  skipInterceptors?: boolean;
}

export type RequestInterceptor = (
  url: string,
  config: RequestConfig
) => Promise<{ url: string; config: RequestConfig }> | { url: string; config: RequestConfig };

export type ResponseInterceptor = (response: Response) => Promise<Response> | Response;

export type ErrorInterceptor = (error: ApiError) => Promise<never> | never;
