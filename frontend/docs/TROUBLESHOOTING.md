# Task Manager Frontend - Troubleshooting Guide

## Issue 1: JSON Parse Error on Page Refresh

### Error Message:
```
ERROR SyntaxError: "undefined" is not valid JSON
at JSON.parse (<anonymous>)
at _AuthService.getUserFromStorage (auth.service.ts:83:24)
```

### Root Cause:
- Corrupted data in `localStorage`
- localStorage.getItem('user') returns `undefined` or invalid JSON string
- Previous version didn't validate JSON before parsing

### Solution (Already Fixed):
✅ **Fixed in v2** - Enhanced error handling in `AuthService`:
- Validates JSON before parsing
- Handles null/undefined values gracefully
- Automatically clears corrupted data
- Logs detailed error messages

### What to Do:
1. **Clear Browser Cache & Storage:**
   ```
   Ctrl+Shift+Delete (Windows) or Cmd+Shift+Delete (Mac)
   Select: Cookies and cached images and files
   Clear data
   ```

2. **Clear localStorage in DevTools:**
   - Press F12 → Application → Local Storage
   - Delete: `auth_token` and `user`
   - Refresh page

3. **Restart Application:**
   - Close browser tab
   - Open fresh: `http://localhost:4200`

---

## Issue 2: Slow Task Loading (10+ Seconds)

### Root Cause:
- Multiple simultaneous API requests
- No caching mechanism
- Network latency

### Solution (Already Fixed):
✅ **Fixed in v2** - Implemented intelligent caching:

**Features:**
- In-memory task caching using `tasksCache`
- Prevents duplicate simultaneous requests
- Auto-clears cache on create/update/delete operations
- Returns cached data instantly if available

**Performance Improvements:**
```
Before: Fetch tasks → Wait for API → Display (5-15 seconds)
After:  Check cache → Return instantly (first load: <1s, subsequent: instant)
```

### Console Logs to Monitor:
```javascript
// Look for these messages in DevTools Console:

"getTasks() called - Cache exists: false Loading: false"
  → First load, making API request

"Returning cached tasks, count: 5"
  → Subsequent requests return cached data immediately

"Already loading tasks, waiting for current request..."
  → Duplicate request prevented, waiting for in-flight response

"Clearing tasks cache"
  → Cache cleared automatically after create/update/delete
```

### Verify It's Working:
1. Open DevTools (F12)
2. Go to Network tab
3. Load tasks - you'll see ONE request
4. Navigate away and back - NO new request (using cache)
5. Create/Edit/Delete task → Cache cleared automatically
6. Load tasks again - Fresh request made

---

## Issue 3: Bootstrap Icons Not Showing

### Error:
Icons don't render (see empty `<i>` tags)

### Solution:
Add Bootstrap Icons CDN to `src/index.html`:

```html
<head>
  <!-- Add this line -->
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.0/font/bootstrap-icons.css">
</head>
```

---

## Issue 4: CORS Errors from Backend

### Error:
```
Access to XMLHttpRequest at 'http://localhost:8080/api/tasks' from origin 
'http://localhost:4200' has been blocked by CORS policy
```

### Solution (Backend):
Ensure backend has CORS enabled. The backend should include:

```java
@Cross Origin(origins = "http://localhost:4200", allowCredentials = "true")
```

Or use a CORS configuration:

```java
@Configuration
public class CorsConfig implements WebMvcConfigurer {
  @Override
  public void addCorsMappings(CorsRegistry registry) {
    registry.addMapping("/api/**")
      .allowedOrigins("http://localhost:4200")
      .allowedMethods("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS")
      .allowedHeaders("*")
      .allowCredentials(true);
  }
}
```

---

## Issue 5: 403 Forbidden Error

### Error:
```
Task service error: Http failure response for http://localhost:8080/api/tasks: 403
```

### Root Causes:
1. JWT token not being sent
2. Backend rejecting token format
3. User doesn't have permission

### Debug Steps:
1. **Check Token is Stored:**
   - Open DevTools → Application → Local Storage
   - Verify `auth_token` exists and has a long string value

2. **Check Token is Sent:**
   - Open Network tab
   - Click on any API request
   - Go to Headers → Request Headers
   - Look for: `Authorization: Bearer <token>`

3. **Check Backend Logs:**
   - Backend should show token validation logs
   - Check for expired tokens or signature mismatches

### Solutions:
- **Re-login:** Logout and login again to get fresh token
- **Check Backend:** Ensure JWT secret matches frontend expectations
- **Token Expiry:** Tokens might be expired (24-hour expiration)

---

## Issue 6: Long API Response Times

### Symptoms:
- Requests take 5-15 seconds
- Backend appears slow

### Check:
1. **Backend Health:**
   ```bash
   curl http://localhost:8080/api/health
   # Should respond immediately with "OK"
   ```

2. **Backend Logs:**
   Look for slow database queries or excessive logging

3. **Network Conditions:**
   - Open DevTools → Network tab
   - Check "Time" column for slow responses
   - Might be network issue, not application

### Optimization:
- Add database indexes (backend)
- Use pagination for large datasets
- Implement lazy loading (frontend)

---

## Quick Diagnostic Checklist

- [ ] Backend running: `http://localhost:8080/api/health` returns OK
- [ ] Frontend running: `http://localhost:4200` loads
- [ ] Can login successfully
- [ ] Can see tasks listed
- [ ] Can create a new task
- [ ] Can edit a task
- [ ] Can delete a task
- [ ] Can filter tasks by status
- [ ] Can search tasks by title/description
- [ ] Page refresh doesn't cause errors
- [ ] Logout works properly

---

## Common Environment Issues

### Node/Package Manager Mismatch
```bash
# Use pnpm (required)
pnpm --version
# Should show: 9.15.0 or higher

# If using npm instead of pnpm, switch:
npm install -g pnpm@9.15.0
```

### Port Already in Use
```bash
# Frontend trying to use 4200 but it's occupied
# Kill process using port 4200:

# Windows:
netstat -ano | findstr :4200
taskkill /PID <PID> /F

# Mac/Linux:
lsof -i :4200
kill -9 <PID>
```

### Angular CLI Version Mismatch
```bash
# Use Angular CLI 21
ng version

# If mismatched:
npm uninstall -g @angular/cli
npm install -g @angular/cli@21
```

---

## Getting Help

### Check Logs First:
1. Browser DevTools Console (F12)
2. Backend terminal logs
3. Network tab for API responses

### Enable Debug Logging:
All services include `console.log()` for debugging:
```javascript
// View detailed logs showing:
- Authentication state changes
- API request/response details
- Cache operations
- Error details with stack traces
```

### Run Tests:
```bash
pnpm test
# Identifies issues in test environment
```

---

## Version Information

**Current Version:** 1.0.0
**Angular:** 21.2.0
**Bootstrap:** 5.3.8
**Fixed Issues in v2:**
- ✅ JSON parse error on corrupted localStorage
- ✅ Slow task loading (added caching)
- ✅ Duplicate simultaneous requests (prevented)
- ✅ Enhanced error handling
- ✅ Better logging for debugging
