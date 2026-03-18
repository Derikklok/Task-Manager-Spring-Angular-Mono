# JWT Token Storage & Session Management

## Overview

The Task Manager application uses **JWT (JSON Web Tokens)** for authentication. The token is stored in the browser's **localStorage** to persist the user session across page refreshes and browser sessions.

---

## 🔑 Token Storage Details

### Storage Key
```
localStorage key: 'auth_token'
```

### Where It's Stored
- **Browser localStorage** - Client-side persistent storage
- **Not stored in cookies** - Token is managed entirely via localStorage and HTTP headers

### Token Lifespan
- **Expiration**: 24 hours (configured on backend)
- **Auto-cleanup**: Token is automatically cleared on logout or when it expires

---

## 📍 Token Storage Implementation

### How Token is Stored (on Login/Register)

1. **User submits credentials** → Backend validates and returns JWT token
2. **AuthService receives response** → `storeToken(token)` called
3. **Token saved to localStorage**:
   ```typescript
   private storeToken(token: string): void {
     console.log('Storing token in localStorage');
     localStorage.setItem('auth_token', token);
   }
   ```

### How Token is Retrieved

The JWT token is retrieved in two places:

**1. During page initialization** (`authGuard`):
```typescript
getToken(): string | null {
  const token = localStorage.getItem('auth_token');
  return token;
}
```

**2. Before every API request** (`jwtInterceptor`):
```typescript
const token = authService.getToken();
if (token) {
  req = req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`
    }
  });
}
```

### How Token is Cleared (on Logout)

```typescript
logout(): void {
  console.log('Logging out, clearing token and user');
  localStorage.removeItem('auth_token');    // ← Token cleared
  localStorage.removeItem('user');          // ← User data cleared
  this.currentUserSubject.next(null);
}
```

---

## 🌍 Session Restoration on Page Refresh

### The Flow

1. **Page refreshes** → Angular app boots
2. **AuthService constructor runs** → Calls `initializeSession()`
3. **`initializeSession()` checks localStorage** for `auth_token`
4. **If token exists** → User data is restored from `user` key
5. **If token valid** → User stays logged in
6. **If token missing/invalid** → User redirected to login

### Implementation

```typescript
constructor(private http: HttpClient) {
  // Restore session immediately on service creation
  this.initializeSession();
}

private initializeSession(): void {
  // Check for stored token
  const token = localStorage.getItem('auth_token');
  console.log('Initializing session - Token exists:', !!token);
  
  if (token) {
    const user = this.getUserFromStorage();
    if (user) {
      console.log('Session initialized with user:', user.email);
      this.currentUserSubject.next(user);  // ← Restore user
    } else {
      // Token exists but user data is corrupted, clear everything
      this.logout();
    }
  }
}
```

---

## 💾 localStorage Keys Reference

| Key | Type | Purpose | Cleared On |
|-----|------|---------|-----------|
| `auth_token` | String (JWT) | Authentication token for API requests | Logout, Token Expired (401), Page Close (optional) |
| `user` | JSON String | Current user data (email, ID, role) | Logout, Corrupted Data |

### Example localStorage Contents

```json
{
  "auth_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c",
  "user": "{\"id\":1,\"email\":\"user@example.com\",\"name\":\"John Doe\",\"role\":\"DEVELOPER\"}"
}
```

---

## 🔐 Security Considerations

### Storage Security
- ✅ **Token stored locally** - Survives page refresh
- ✅ **User data stored** - Quick access without API call
- ⚠️ **XSS Risk** - localStorage is accessible to JavaScript (be cautious with script injection)
- ⚠️ **Not sent to other sites** - localStorage is domain-specific (prevents CSRF in this context)

### Token Injection into Requests
- All HTTP requests include `Authorization: Bearer {token}` header
- Handled automatically by `jwtInterceptor`
- No manual header configuration needed in service calls

### Token Expiration
- Backend returns 401 status when token expires
- `jwtInterceptor` catches 401 → Logs user out → Redirects to login
- User must log in again to get a new token

---

## 🧪 Testing Token Storage

### Check localStorage in Browser

1. **Open Developer Tools** → Press `F12`
2. **Go to Application tab** → Local Storage → http://localhost:4200
3. **Look for keys**:
   - `auth_token` - Should contain a long JWT string
   - `user` - Should contain JSON with user info

### Clear localStorage (if needed)

```javascript
// In browser console (F12)
localStorage.removeItem('auth_token');
localStorage.removeItem('user');
```

Or clear all:
```javascript
localStorage.clear();
```

### Manual Test Flow

1. **Login** → Check localStorage has both keys
2. **Navigate** → Tokens persist
3. **Refresh Page** (Ctrl+R) → Should stay logged in
4. **Logout** → Both keys removed from localStorage
5. **Try to access /tasks** → Redirected to /login

---

## 🐛 Troubleshooting

### Issue: "Redirect to login on every refresh"

**Causes:**
1. ❌ Token not being stored on login
2. ❌ Token is invalid/corrupted in localStorage
3. ❌ Backend token validation failing
4. ❌ 24-hour token expiration

**Solutions:**
1. Check browser console for errors during login
2. Clear localStorage and login again: `localStorage.clear()`
3. Verify backend is running on `http://localhost:8080`
4. Check API response includes `token` field
5. Verify `auth_token` key exists after login

### Issue: "Getting 401 on every API request"

**Causes:**
1. ❌ Token not injected in request headers
2. ❌ Token format incorrect in `Authorization` header
3. ❌ Backend token validation issue

**Solutions:**
1. Check `jwtInterceptor` is registered in `app.config.ts`
2. Verify header format: `Authorization: Bearer {token}`
3. Check API payload includes correct token in response

### Issue: "Corrupted localStorage data"

**Symptoms:**
- Error: `"undefined" is not valid JSON`
- App crashes on page load

**Solution:**
- Automatic! The app detects corrupted JSON and auto-clears it
- If not working, manually clear: `localStorage.clear()`

---

## 📋 Summary

| Aspect | Details |
|--------|---------|
| **Storage Method** | Browser localStorage |
| **Token Key** | `auth_token` |
| **User Key** | `user` |
| **Expiration** | 24 hours (backend-enforced) |
| **Injection** | Automatic via `jwtInterceptor` |
| **Persistence** | Survives page refresh ✅ |
| **Cleanup** | On logout or 401 error |
| **Restoration** | On AuthService initialization |

---

## 🔗 Related Files

- `src/app/services/auth.service.ts` - Token storage/retrieval logic
- `src/app/services/jwt.interceptor.ts` - Token injection into requests
- `src/app/services/auth.guard.ts` - Route protection logic
- `src/app/app.config.ts` - Interceptor registration

