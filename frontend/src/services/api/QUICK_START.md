# API Client - Quick Start

## What Was Created

A centralized API client with interceptor support has been implemented:

### Core Files

1. **[types.ts](types.ts)** - Type definitions for API responses, errors, and interceptors
2. **[apiClient.ts](apiClient.ts)** - Main API client with interceptor support
3. **[interceptors.ts](interceptors.ts)** - Pre-configured authentication and error interceptors
4. **[index.ts](index.ts)** - Public API exports
5. **[README.md](README.md)** - Comprehensive documentation

### Updated Files

- **[vendorService.ts](../../features/vendors/services/vendorService.ts)** - Migrated to use the new API client
- **[main.tsx](../../main.tsx)** - Added interceptor initialization

## Quick Usage

### 1. Making API Calls (in Services)

```typescript
import { apiClient, type ApiResponse } from '@/services/api';

// GET request
const response = await apiClient.get<ApiResponse<User[]>>('/users');
const users = response.data;

// POST request
const response = await apiClient.post<ApiResponse<User>>('/users', {
  name: 'John Doe',
  email: 'john@example.com'
});

// PUT request
await apiClient.put<ApiResponse<User>>(`/users/${id}`, updateData);

// DELETE request
await apiClient.delete(`/users/${id}`);
```

### 2. Authentication

```typescript
import { authHelpers } from '@/services/api';

// After successful login
authHelpers.setToken('your-jwt-token');

// Check if authenticated
if (authHelpers.isAuthenticated()) {
  // User is logged in
}

// Logout
authHelpers.removeToken();
```

### 3. Error Handling

```typescript
import { ApiError } from '@/services/api';

try {
  await apiClient.post('/vendors', data);
} catch (error) {
  const apiError = error as ApiError;
  
  // Display error message
  console.error(apiError.message);
  
  // Handle validation errors
  if (apiError.errors) {
    apiError.errors.forEach(({ path, message }) => {
      console.log(`${path}: ${message}`);
    });
  }
}
```

## Features Included

✅ **Request Interceptors**
  - Automatic authentication token injection
  - Request ID tracking
  - Custom header support
  - Logging (development mode)

✅ **Response Interceptors**
  - Response transformation
  - Logging (development mode)

✅ **Error Interceptors**
  - Automatic 401 handling (redirect to login)
  - 403 forbidden access warnings
  - 500 server error logging
  - Centralized error handling

✅ **Type Safety**
  - Full TypeScript support
  - Generic response types
  - Typed error objects

✅ **Developer Experience**
  - Clean, simple API
  - Automatic error handling
  - Request/response logging in dev mode

## Default Interceptors Active

The following interceptors are automatically active (configured in `main.tsx`):

1. **Auth Token Injection** - Adds JWT token from localStorage to all requests
2. **Request ID Tracking** - Adds unique ID to each request
3. **401 Redirect** - Automatically redirects to `/login` on authentication errors
4. **Error Logging** - Logs API errors to console
5. **Development Logging** - Logs requests/responses in dev mode

## Next Steps

1. ✅ API client is ready to use
2. ✅ Vendor service already migrated
3. Create services for other resources (items, etc.) using the same pattern
4. Customize interceptors if needed (see [README.md](README.md))
5. Add authentication flow if not already present

## Example: Creating a New Service

```typescript
import { apiClient, type ApiResponse } from '@/services/api';

export interface Item {
  id: number;
  name: string;
  price: number;
}

class ItemService {
  private readonly endpoint = '/items';

  async getAll(): Promise<Item[]> {
    const response = await apiClient.get<ApiResponse<Item[]>>(this.endpoint);
    return response.data;
  }

  async create(item: Omit<Item, 'id'>): Promise<Item> {
    const response = await apiClient.post<ApiResponse<Item>>(this.endpoint, item);
    return response.data;
  }
}

export const itemService = new ItemService();
```

## Configuration

API base URL is configured via environment variable:

```env
VITE_API_BASE_URL=http://localhost:5174/api/v1
```

## Need Help?

- See [README.md](README.md) for detailed documentation
- Check [interceptors.ts](interceptors.ts) for authentication examples
- Review [vendorService.ts](../../features/vendors/services/vendorService.ts) for implementation patterns
