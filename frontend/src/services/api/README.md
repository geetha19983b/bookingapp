# API Client - Usage Guide

## Overview

The centralized API client provides a robust, type-safe way to make HTTP requests with built-in interceptor support for cross-cutting concerns like authentication, logging, and error handling.

## Basic Usage

### Importing the API Client

```typescript
import apiClient from '@/services/api';
// or
import { apiClient } from '@/services/api';
```

### Making Requests

#### GET Request
```typescript
// Simple GET
const response = await apiClient.get<ApiResponse<User[]>>('/users');
const users = response.data;

// GET with query parameters
const response = await apiClient.get<ApiResponse<User[]>>('/users', {
  params: {
    page: 1,
    limit: 10,
    active: true
  }
});
```

#### POST Request
```typescript
const response = await apiClient.post<ApiResponse<User>>('/users', {
  name: 'John Doe',
  email: 'john@example.com'
});
const newUser = response.data;
```

#### PUT Request
```typescript
const response = await apiClient.put<ApiResponse<User>>('/users/123', {
  name: 'Jane Doe',
  email: 'jane@example.com'
});
```

#### PATCH Request
```typescript
const response = await apiClient.patch<ApiResponse<User>>('/users/123', {
  email: 'newemail@example.com'
});
```

#### DELETE Request
```typescript
await apiClient.delete('/users/123');
```

## Advanced Features

### 1. Request Interceptors

Request interceptors allow you to modify requests before they are sent.

```typescript
// Add authentication token
apiClient.addRequestInterceptor((url, config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers = {
      ...config.headers,
      'Authorization': `Bearer ${token}`
    };
  }
  return { url, config };
});

// Add custom headers
apiClient.addRequestInterceptor((url, config) => {
  config.headers = {
    ...config.headers,
    'X-Client-Version': '1.0.0',
    'X-Request-ID': crypto.randomUUID()
  };
  return { url, config };
});

// Async interceptor example
apiClient.addRequestInterceptor(async (url, config) => {
  // Refresh token if needed
  const token = await refreshTokenIfNeeded();
  config.headers = {
    ...config.headers,
    'Authorization': `Bearer ${token}`
  };
  return { url, config };
});
```

### 2. Response Interceptors

Response interceptors allow you to process responses before they reach your code.

```typescript
// Transform response data
apiClient.addResponseInterceptor(async (response) => {
  // You can transform the response here
  // Note: response is a clone, so you can read it safely
  return response;
});

// Add response time tracking
apiClient.addResponseInterceptor((response) => {
  const responseTime = response.headers.get('X-Response-Time');
  if (responseTime) {
    console.log(`Response took ${responseTime}ms`);
  }
  return response;
});
```

### 3. Error Interceptors

Error interceptors handle error scenarios globally.

```typescript
// Handle authentication errors
apiClient.addErrorInterceptor((error) => {
  if (error.statusCode === 401) {
    // Clear auth state and redirect to login
    localStorage.removeItem('authToken');
    window.location.href = '/login';
  }
  throw error;
});

// Show global error notifications
apiClient.addErrorInterceptor((error) => {
  if (error.statusCode >= 500) {
    showToast('Server error occurred. Please try again later.', 'error');
  }
  throw error;
});

// Track errors in analytics
apiClient.addErrorInterceptor((error) => {
  analytics.track('API Error', {
    statusCode: error.statusCode,
    message: error.message,
    endpoint: error.detail
  });
  throw error;
});
```

### 4. Setting Default Headers

```typescript
// Set default headers for all requests
apiClient.setDefaultHeaders({
  'X-Custom-Header': 'value',
  'Accept-Language': 'en-US'
});
```

### 5. Authentication Token Management

```typescript
// Set auth token (typically after login)
apiClient.setAuthToken('your-jwt-token-here');

// Remove auth token (typically after logout)
apiClient.removeAuthToken();
```

### 6. Custom Request Configuration

```typescript
// Skip interceptors for a specific request
const response = await apiClient.get('/public-data', {
  skipInterceptors: true
});

// Custom headers for a specific request
const response = await apiClient.post('/upload', data, {
  headers: {
    'Content-Type': 'multipart/form-data'
  }
});
```

## Integration with Redux

### Using with Redux Toolkit (Async Thunks)

```typescript
import { createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '@/services/api';

export const fetchUsers = createAsyncThunk(
  'users/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get<ApiResponse<User[]>>('/users');
      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);
```

## Error Handling

### Handling Errors in Components

```typescript
import { ApiError } from '@/services/api';

const handleSubmit = async (data: FormData) => {
  try {
    await apiClient.post('/vendors', data);
    // Success handling
  } catch (error) {
    const apiError = error as ApiError;
    
    // Display error message
    setError(apiError.message);
    
    // Handle validation errors
    if (apiError.errors) {
      apiError.errors.forEach(({ path, message }) => {
        setFieldError(path, message);
      });
    }
  }
};
```

## Best Practices

1. **Type Safety**: Always specify response types when making API calls
   ```typescript
   const response = await apiClient.get<ApiResponse<User[]>>('/users');
   ```

2. **Error Handling**: Use try-catch blocks for proper error handling
   ```typescript
   try {
     const data = await apiClient.get('/data');
   } catch (error) {
     // Handle error
   }
   ```

3. **Interceptors**: Use interceptors for cross-cutting concerns
   - Authentication
   - Logging
   - Error tracking
   - Request/Response transformation

4. **Service Layer**: Create service classes/functions for each resource
   ```typescript
   class UserService {
     async getAll() {
       const response = await apiClient.get<ApiResponse<User[]>>('/users');
       return response.data;
     }
   }
   ```

5. **Avoid Inline Requests**: Always use service layer instead of calling apiClient directly in components

## Example: Complete Service Implementation

```typescript
import apiClient, { type ApiResponse } from '@/services/api';

export interface User {
  id: number;
  name: string;
  email: string;
}

export interface CreateUserPayload {
  name: string;
  email: string;
}

class UserService {
  private readonly endpoint = '/users';

  async getAll(): Promise<User[]> {
    const response = await apiClient.get<ApiResponse<User[]>>(this.endpoint);
    return response.data;
  }

  async getById(id: number): Promise<User> {
    const response = await apiClient.get<ApiResponse<User>>(
      `${this.endpoint}/${id}`
    );
    return response.data;
  }

  async create(payload: CreateUserPayload): Promise<User> {
    const response = await apiClient.post<ApiResponse<User>>(
      this.endpoint,
      payload
    );
    return response.data;
  }

  async update(id: number, payload: Partial<CreateUserPayload>): Promise<User> {
    const response = await apiClient.put<ApiResponse<User>>(
      `${this.endpoint}/${id}`,
      payload
    );
    return response.data;
  }

  async delete(id: number): Promise<void> {
    await apiClient.delete(`${this.endpoint}/${id}`);
  }
}

export const userService = new UserService();
```

## Configuration

### Environment Variables

Set your API base URL in `.env`:

```env
VITE_API_BASE_URL=http://localhost:5174/api/v1
```

## Troubleshooting

### CORS Issues
If you encounter CORS errors, ensure your backend is configured to accept requests from your frontend origin.

### Network Errors
Network errors (statusCode: 0) indicate the request couldn't reach the server. Check:
- Is the backend running?
- Is the API URL correct?
- Are there network connectivity issues?

### 401 Unauthorized
Check if:
- Token is being sent correctly
- Token hasn't expired
- Token is valid

## Future Enhancements

Consider implementing:
- Request retry logic
- Request caching
- Request deduplication
- Upload/download progress tracking
- Request cancellation (using AbortController)
