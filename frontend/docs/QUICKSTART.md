# Task Manager Frontend - Quick Start Guide

Get the Task Manager frontend up and running in 5 minutes! 🚀

## ⚡ 5-Minute Quick Start

### Step 1: Install Dependencies
```bash
cd "c:\Users\User\Desktop\Task Manager\frontend"
pnpm install
```

### Step 2: Ensure Backend is Running
```bash
# In another terminal, start the backend
cd "c:\Users\User\Desktop\Task Manager\backend"
.\mvnw spring-boot:run
# Backend should be running on http://localhost:8080
```

### Step 3: Start Development Server
```bash
# In frontend directory
pnpm start
# Frontend will start on http://localhost:4200
```

### Step 4: Open in Browser
Navigate to: `http://localhost:4200`

### Step 5: Create Test Account
1. Click "Sign Up"
2. Enter email: `test@example.com`
3. Enter password: `password123`
4. Select role: `Developer`
5. Click "Sign Up"

✅ **You're ready to use the app!**

---

## 🔍 Verifying Installation

### Check Frontend Server
```bash
# Should output:
# ➜  Local:   http://localhost:4200/
```

### Check Backend Server
```bash
curl http://localhost:8080/api/health
# Response: OK
```

### Check Environment Configuration
```bash
cat .env
# Should show:
# VITE_API_BASE_URL=http://localhost:8080/api
```

---

## 📚 First Steps

### 1. Register a New Account
- Navigate to Login page
- Click "Sign Up"
- Fill in email, password, and role
- Click "Sign Up" button

### 2. Create Your First Task
- Click "New Task" button
- Enter task title (required)
- Enter description (optional)
- Select status (To Do, In Progress, Completed)
- Click "Create Task"

### 3. View and Filter Tasks
- All tasks displayed in table
- Filter by Status dropdown
- Use Search box to find tasks
- Click Edit to modify task
- Click Delete to remove task

### 4. Update Task Status
- Click "Edit" on any task
- Change status dropdown
- Click "Update Task"
- Task status updated immediately

---

## 🎯 Key Features to Try

### Authentication
- ✅ Register with email/password
- ✅ Login to existing account
- ✅ Automatic logout on token expiration
- ✅ Session persistence on page reload

### Task Management
- ✅ Create tasks with title and description
- ✅ Set task status (Todo, In Progress, Completed)
- ✅ Edit existing tasks
- ✅ Delete tasks with confirmation
- ✅ View task creation date

### Filtering & Search
- ✅ Filter by status (All, Todo, In Progress, Completed)
- ✅ Search by title and description
- ✅ Real-time filtering as you type
- ✅ Show/hide results count

### Responsive Design
- ✅ Desktop layout (table view)
- ✅ Mobile layout (card view)
- ✅ Touch-friendly buttons
- ✅ Professional blue theme

---

## 🔧 Configuration

### Environment Variables (.env)

```env
# API endpoint for backend
VITE_API_BASE_URL=http://localhost:8080/api

# Application metadata
VITE_APP_NAME=Task Manager
VITE_APP_VERSION=1.0.0
```

### Development vs Production

**Development:**
```env
VITE_API_BASE_URL=http://localhost:8080/api
```

**Production:**
```env
VITE_API_BASE_URL=https://api.yourdomain.com/api
```

---

## 📊 Complete Feature Set

### ✨ Built-in Features

| Feature | Status | Type |
|---------|--------|------|
| User Registration | ✅ | Authentication |
| User Login | ✅ | Authentication |
| JWT Tokens | ✅ | Security |
| Create Tasks | ✅ | Task CRUD |
| Read Tasks | ✅ | Task CRUD |
| Update Tasks | ✅ | Task CRUD |
| Delete Tasks | ✅ | Task CRUD |
| Task Filtering | ✅ | Task Features |
| Task Search | ✅ | Task Features |
| Responsive Design | ✅ | UI/UX |
| Dark/Light Theme | ⏳ | UI/UX (Optional) |
| Notifications | ⏳ | UX (Optional) |
| Task Bulk Actions | ⏳ | Features (Optional) |

---

## 🛠️ Available Commands

```bash
# Start development server
pnpm start

# Build for production
pnpm build

# Run tests
pnpm test

# Lint code (if configured)
pnpm lint

# Watch mode for development
pnpm watch

# Build analysis
pnpm build --stats-json
```

---

## 📁 Important Files

| File | Purpose |
|------|---------|
| `.env` | Environment variables |
| `src/env.ts` | Configuration loader |
| `src/app/app.routes.ts` | Route definitions |
| `src/app/app.config.ts` | App configuration |
| `src/app/services/auth.service.ts` | Authentication logic |
| `src/app/services/task.service.ts` | Task operations |
| `src/styles.css` | Global styles |
| `angular.json` | Angular CLI config |

---

## 🐛 Troubleshooting

### Issue: Frontend won't start
```bash
# Solution 1: Clear cache and reinstall
rm -rf node_modules pnpm-lock.yaml
pnpm install

# Solution 2: Check Node version
node --version  # Should be 18+

# Solution 3: Check port 4200 is free
netstat -ano | findstr :4200
```

### Issue: Can't connect to backend
```bash
# Check backend is running
curl http://localhost:8080/api/health
# Response should be: OK

# Check .env configuration
cat .env
# Verify VITE_API_BASE_URL=http://localhost:8080/api
```

### Issue: Login fails with 401
```bash
# Verify credentials
# Email: test@example.com
# Password: password123

# Check backend auth endpoints
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

### Issue: Tasks not loading
```bash
# Clear browser cache
# Ctrl+Shift+Delete or Cmd+Shift+Delete

# Check localStorage
# Open DevTools > Application > Local Storage
# Should have: auth_token and user
```

---

## 💡 Pro Tips

### 1. Test Accounts
```
Email: demo@example.com
Password: demo123456
Role: DEVELOPER
```

### 2. Browser DevTools
- **Network Tab**: Monitor API calls
- **Console Tab**: Check for errors
- **Application Tab**: View localStorage
- **Elements Tab**: Inspect HTML/CSS

### 3. API Testing
Use Postman or cURL to test endpoints:
```bash
# Login
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"demo@example.com","password":"demo123456"}'

# Get tasks (add Authorization header with token)
curl -X GET http://localhost:8080/api/tasks \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### 4. Development Workflow
1. Make code changes
2. App automatically reloads
3. Check browser console for errors
4. Open DevTools to inspect

---

## 📚 Documentation Files

| File | Content |
|------|---------|
| `SETUP.md` | Detailed setup instructions |
| `ARCHITECTURE.md` | Architecture & design patterns |
| `API_INTEGRATION.md` | API integration details |
| `README.md` | Project overview |
| `docs/features.txt` | Backend API specification |

---

## 🚀 Next Steps

### Enhance the Application
1. **Add Task Categories**: Group tasks
2. **Task Priority Levels**: High/Medium/Low
3. **Due Dates**: Task deadlines
4. **Task Comments**: Collaboration
5. **Notifications**: Toast alerts
6. **Dark Mode**: Theme toggle
7. **Export to CSV**: Bulk export

### Deploy to Production
1. Build the project: `pnpm build`
2. Deploy `dist/` to hosting (Vercel, Netlify, etc.)
3. Update `.env` with production API URL
4. Enable HTTPS

### Add Testing
1. Write unit tests for components
2. Write service unit tests
3. Add E2E tests with Cypress
4. Achieve 80%+ code coverage

---

## 📞 Support Resources

### Official Documentation
- [Angular 21 Docs](https://angular.dev)
- [Bootstrap 5 Docs](https://getbootstrap.com/docs/5.0/)
- [RxJS Docs](https://rxjs.dev)
- [TypeScript Docs](https://www.typescriptlang.org/docs/)

### Common Issues
See `Troubleshooting` section above

### Code Examples
Check component files for usage examples:
- `src/app/components/login/login.component.ts` - Forms
- `src/app/components/task-list/task-list.component.ts` - Services
- `src/app/services/auth.service.ts` - HTTP Client

---

## ✅ Checklist: Before Going Live

- [ ] Backend running successfully
- [ ] Frontend builds without errors
- [ ] Environment variables configured
- [ ] Can login and create account
- [ ] Can create/read/update/delete tasks
- [ ] Filtering and search working
- [ ] Responsive design tested on mobile
- [ ] No console errors in DevTools
- [ ] Performance is acceptable
- [ ] Security headers in place

---

## 🎉 You're All Set!

Your Task Manager application is ready to use. Happy tasking! 🚀

**Questions?** Check the documentation files or review the source code comments.
