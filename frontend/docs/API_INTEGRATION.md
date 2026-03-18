# Task Manager Frontend - API Integration Guide

This guide explains how the frontend integrates with the Task Manager backend API and how to configure API endpoints.

## 📡 API Integration Architecture

```
┌─────────────────┐
│   Components    │
│  (UI Layer)     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   Services      │
│  (Logic Layer)  │
├─────────────────┤
│ • AuthService   │
│ • TaskService   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Interceptor    │
│ (JWT Injection) │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   HTTP Client   │
│  (Network)      │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Backend API    │
│  (localhost:    │
│   8080/api)     │
└─────────────────┘
```

## 🔑 Environment Configuration

All API endpoints are configured through environment variables in `.env`:

```env
VITE_API_BASE_URL=http://localhost:8080/api
VITE_APP_NAME=Task Manager
VITE_APP_VERSION=1.0.0
```

The `src/env.ts` file loads this configuration:

```typescript
export const environment = {
  production: false,
  apiBaseUrl: 'http://localhost:8080/api'
};
```

## 🔐 Authentication Flow

### 1. Login Process

```typescript
// User credentials
POST /api/auth/login
{
  "email": "user@example.com",
  "password": "password123"
}

// Response
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user-123",
    "email": "user@example.com",
    "role": "DEVELOPER"
  }
}
```

**Flow:**
1. User submits email and password
2. Backend validates credentials
3. JWT token generated (24-hour expiration)
4. Token stored in `localStorage['auth_token']`
5. User object stored in `localStorage['user']`
6. User redirected to `/tasks`

### 2. Request Authentication

All API requests automatically include JWT token via `JwtInterceptor`:

```typescript
// Before interceptor
GET /api/tasks

// After interceptor
GET /api/tasks
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 3. Auto-logout

If any request returns 401 (Unauthorized):
- Token is removed from localStorage
- User is redirected to login page
- Session is cleared

## 📝 Task Management API

### Complete Endpoints Reference

#### Get All Tasks
```
GET /api/tasks
Authorization: Bearer <TOKEN>

Response: Task[]
```

#### Get Task by ID
```
GET /api/tasks/{id}
Authorization: Bearer <TOKEN>

Response: Task
```

#### Create Task
```
POST /api/tasks
Authorization: Bearer <TOKEN>
Content-Type: application/json

Request Body:
{
  "title": "Fix login bug",
  "description": "Users unable to reset password",
  "status": "TODO"
}

Response: Task
```

#### Full Update (PUT)
```
PUT /api/tasks/{id}
Authorization: Bearer <TOKEN>
Content-Type: application/json

Request Body:
{
  "title": "Fix login bug",
  "description": "Updated description",
  "status": "IN_PROGRESS"
}

Response: Task
```

#### Partial Update (PATCH)
```
PATCH /api/tasks/{id}
Authorization: Bearer <TOKEN>
Content-Type: application/json

Request Body:
{
  "status": "COMPLETED"
}

Response: Task
```

#### Delete Task
```
DELETE /api/tasks/{id}
Authorization: Bearer <TOKEN>

Response: 204 No Content
```

## 🔄 Service Implementation

### AuthService

Handles authentication operations:

```typescript
// Login
authService.login({ email: '', password: '' })
  .subscribe({
    next: (response) => { /* user logged in */ },
    error: (error) => { /* handle error */ }
  });

// Register
authService.register({ email: '', password: '', role: '' })
  .subscribe({ /* ... */ });

// Logout
authService.logout();

// Check authentication
if (authService.isAuthenticated()) { /* ... */ }

// Get current user
const user = authService.getCurrentUser();

// Get token
const token = authService.getToken();
```

### TaskService

Handles task CRUD operations:

```typescript
// Get all tasks
taskService.getTasks().subscribe(tasks => { /* ... */ });

// Get specific task
taskService.getTaskById(1).subscribe(task => { /* ... */ });

// Create task
taskService.createTask({ title: '', status: 'TODO' })
  .subscribe(task => { /* ... */ });

// Update task (full)
taskService.updateTask(1, { title: '', status: 'COMPLETED' })
  .subscribe(task => { /* ... */ });

// Partial update
taskService.patchTask(1, { status: 'COMPLETED' })
  .subscribe(task => { /* ... */ });

// Delete task
taskService.deleteTask(1).subscribe(() => { /* ... */ });
```

## 🛡️ Error Handling

### Error Types

1. **Network Errors**: Connection issues
2. **Authentication Errors**: 401 Unauthorized
3. **Validation Errors**: 400 Bad Request
4. **Server Errors**: 500, 502, etc.

### Error Handling Pattern

```typescript
taskService.getTasks().subscribe({
  next: (tasks) => {
    // Success - update UI
  },
  error: (error) => {
    // HttpErrorResponse object
    if (error.status === 401) {
      // Auto-handled by interceptor
    } else if (error.status === 400) {
      // Display validation errors
      console.error(error.error.message);
    } else {
      // Generic error
      console.error('Failed to load tasks');
    }
  }
});
```

## 🔗 HTTP Interceptor Implementation

The `JwtInterceptor` automatically:

1. **Adds JWT Token**: Injects `Authorization` header with token
2. **Handles 401 Responses**: Auto-logout on token expiration
3. **Preserves Headers**: Doesn't interfere with other headers

```typescript
@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const token = this.authService.getToken();

    if (token) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }

    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          this.authService.logout();
          window.location.href = '/login';
        }
        return throwError(() => error);
      })
    );
  }
}
```

## 📊 Data Models

### Task Model
```typescript
interface Task {
  id?: number;
  title: string;           // Required, max 200 chars
  description?: string;    // Optional, max 1000 chars
  status: TaskStatus;      // TODO | IN_PROGRESS | COMPLETED
  createdAt?: string;      // ISO 8601 timestamp
  updatedAt?: string;      // ISO 8601 timestamp
  userId?: string;         // Set by backend
}
```

### User Model
```typescript
interface User {
  id?: string;
  email: string;
  role: string;            // ROLE_DEVELOPER | ROLE_MANAGER
}
```

### Auth Response
```typescript
interface AuthResponse {
  token: string;           // JWT token
  user: User;
}
```

## 🚀 Development vs Production

### Development Configuration
```env
VITE_API_BASE_URL=http://localhost:8080/api
```

### Production Configuration
```env
VITE_API_BASE_URL=https://api.yourdomain.com/api
```

**Update in deployment pipeline or environment variables on hosting provider.**

## 🐛 Debugging API Calls

### Browser DevTools
1. Open DevTools (F12)
2. Go to Network tab
3. Perform action that triggers API call
4. Click request to inspect:
   - **Headers**: Check Authorization header
   - **Request Body**: Check payload
   - **Response**: Check API response
   - **Status**: Check HTTP status code

### Console Logging
Each service logs errors to console:
```
Auth error: {error object}
Task service error: {error object}
```

## 🔄 Request/Response Flow Examples

### Login Example
```javascript
// 1. User submits form
POST http://localhost:8080/api/auth/login
{
  "email": "demo@example.com",
  "password": "demo123456"
}

// 2. Response
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "1",
    "email": "demo@example.com",
    "role": "DEVELOPER"
  }
}

// 3. Token stored
localStorage.setItem('auth_token', token);
localStorage.setItem('user', JSON.stringify(user));

// 4. User redirected to /tasks
```

### Create Task Example
```javascript
// 1. User submits task form
POST http://localhost:8080/api/tasks
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
{
  "title": "Fix login bug",
  "description": "Users unable to reset password",
  "status": "TODO"
}

// 2. Response
{
  "id": 1,
  "title": "Fix login bug",
  "description": "Users unable to reset password",
  "status": "TODO",
  "userId": "1",
  "createdAt": "2026-03-18T10:00:00Z",
  "updatedAt": "2026-03-18T10:00:00Z"
}

// 3. UI updated with new task
```

## ⚠️ Common Issues & Solutions

| Issue | Cause | Solution |
|-------|-------|----------|
| 401 Unauthorized | Token expired | Clear localStorage, login again |
| CORS Error | Backend not configured | Check backend CORS settings |
| 404 Not Found | Wrong API URL | Verify VITE_API_BASE_URL in .env |
| Network Error | Backend offline | Start backend server |
| Form submission fails | Validation error | Check browser console for details |

## 📞 Backend Requirements

The backend must provide:

✅ Authentication endpoints
✅ Task CRUD endpoints
✅ CORS support
✅ JWT token generation
✅ Input validation
✅ Error messages in response

See `features.txt` in docs folder for complete backend specification.
