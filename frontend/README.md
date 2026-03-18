# Task Manager Frontend

A production-grade Angular 21 task management application with a clean blue UI, Bootstrap components, JWT authentication, and comprehensive task management features.

## 🎯 Features

- **User Authentication**: Secure login and registration with JWT tokens
- **Task Management**: Create, read, update, and delete tasks
- **Task Filtering**: Filter tasks by status (To Do, In Progress, Completed)
- **Search Functionality**: Search tasks by title and description
- **Responsive Design**: Mobile-friendly interface with Bootstrap 5.3+
- **Professional Typography**: Poppins font family throughout
- **Dark Blue Theme**: Cohesive design with gradient backgrounds
- **Real-time UI Updates**: Instant feedback on all interactions
- **Performance Optimized**: Intelligent caching and request deduplication

## 📋 Tech Stack

- **Framework**: Angular 21.2.0
- **UI Framework**: Bootstrap 5.3.8
- **Forms**: Reactive Forms with validation
- **HTTP Client**: @angular/common/http with JWT interceptor
- **Package Manager**: pnpm 9.15.0
- **Node**: 18+
- **Testing**: Vitest
- **TypeScript**: 5.9.2
- **Language**: TypeScript with strict mode

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and pnpm 9.15+
- Task Manager Backend running on `http://localhost:8080`

### Installation

1. **Navigate to frontend directory**:
   ```bash
   cd "c:\Users\User\Desktop\Task Manager\frontend"
   ```

2. **Install dependencies**:
   ```bash
   pnpm install
   ```

3. **Verify environment configuration**:
   ```bash
   cat .env
   ```
   Should show: `VITE_API_BASE_URL=http://localhost:8080/api`

### Development Server

Start the development server:

```bash
pnpm start
```

Navigate to `http://localhost:4200/`. The application automatically reloads when you modify source files.

### Build for Production

```bash
pnpm build
```

Build artifacts are stored in the `dist/` directory with default production optimizations.

### Run Tests

```bash
pnpm test
```

Execute unit tests with the Vitest test runner.

## 📁 Project Structure

```
src/
├── app/
│   ├── components/
│   │   ├── login/                 # Login & Registration
│   │   ├── task-list/             # Task list with filtering
│   │   └── task-form/             # Create/Edit task form
│   ├── services/
│   │   ├── auth.service.ts        # Authentication logic
│   │   ├── auth.guard.ts          # Route protection
│   │   ├── task.service.ts        # Task API integration
│   │   └── jwt.interceptor.ts     # JWT token injection
│   ├── models/
│   │   └── index.ts               # TypeScript interfaces
│   ├── app.routes.ts              # Route configuration
│   └── app.config.ts              # Application config
├── styles.css                      # Global styles
├── index.html                      # HTML entry point
└── main.ts                         # Angular bootstrap
```

## 🔐 Authentication

### Login Flow

1. User submits email and password
2. Backend validates credentials and returns JWT token
3. Token stored in `localStorage['auth_token']`
4. User automatically redirected to tasks page
5. Token included in all API requests

### Token Management

- **Storage**: Browser localStorage (persistent across sessions)
- **Expiration**: 24 hours (configured on backend)
- **Auto-cleanup**: Cleared on logout or token expiration
- **Injection**: Automatic via JWT interceptor

### Protected Routes

- `/tasks` - Task list (requires authentication)
- `/task/:id` - Task form (requires authentication)
- `/login` - Public access

## 📝 Task Management

### Creating Tasks

1. Click "New Task" button
2. Enter task title (required, 3-200 characters)
3. Enter description (optional, max 1000 characters)
4. Select status: To Do, In Progress, or Completed
5. Click "Create Task"

### Editing Tasks

1. Click edit button on task row
2. Modify task details
3. Click "Save Changes"

### Filtering & Search

- **Status Filter**: Dropdown with All Tasks, To Do, In Progress, Completed
- **Search**: Real-time search by title or description
- **Combined**: Filters work together for precise results

### Deleting Tasks

1. Click delete button on task row
2. Confirm deletion in modal
3. Task removed immediately (soft or hard delete per API)

## 🎨 Design System

### Color Palette

- **Primary**: `#0f3460` (Dark Blue)
- **Secondary Gradient**: `#0f3460` → `#1a4d7a`
- **Background**: `#f8f9fa` (Light Gray)
- **Text**: `#0f3460` (Primary Blue)

### Typography

- **Font Family**: Poppins (weights: 300, 400, 500, 600, 700)
- **Headlines**: 600-700 weight, uppercase tracking
- **Body**: 400-500 weight, clear readability
- **Applied To**: All text, form elements, buttons

### Components

- **Buttons**: Rounded (10px), gradient backgrounds, hover effects
- **Forms**: Outlined inputs, validation states, help text
- **Dropdowns**: Custom Bootstrap dropdown with smooth animations
- **Tables**: Responsive, hover states, status badges
- **Modals**: Centered, professional styling

## 🔧 Configuration

### Environment Variables

Create `.env` file in root directory:

```env
VITE_API_BASE_URL=http://localhost:8080/api
VITE_APP_NAME=Task Manager
VITE_APP_VERSION=1.0.0
```

**Important**: Never commit `.env` file (included in .gitignore)

### Global Settings

- **API Timeout**: Configured in HTTP client
- **Cache Strategy**: In-memory caching with auto-clear on mutations
- **Error Handling**: User-friendly error messages
- **Request Deduplication**: Prevents duplicate simultaneous requests

## 📊 Performance

### Optimization Features

1. **Task Caching**: In-memory cache prevents redundant API calls
2. **Request Deduplication**: Multiple requests merged into one
3. **Change Detection**: OnPush strategy with manual updates
4. **Lazy Loading**: Components load on route navigation
5. **Tree Shaking**: Unused code removed in production build

### Metrics

- **Initial Load**: 1-3 seconds (with new data)
- **Cached Load**: <100ms (from memory)
- **Build Size**: ~140KB minified, ~284KB gzipped

## 🛠️ Development

### Adding New Features

1. **New Component**:
   ```bash
   ng generate component --skip-tests components/my-component
   ```

2. **New Service**:
   ```bash
   ng generate service --skip-tests services/my-service
   ```

### Code Style

- **Language**: TypeScript with strict mode
- **Format**: Run `prettier` before committing
- **Linting**: Follow Angular style guide
- **Naming**: PascalCase for classes, camelCase for variables

### Useful Commands

```bash
# Format code
pnpm prettier --write "src/**/*.{ts,html,css}"

# Watch mode
pnpm watch

# Build production
pnpm build

# Run tests
pnpm test
```

## 🐛 Troubleshooting

### Port Already in Use

If port 4200 is in use:
```bash
ng serve --port 4300
```

### CORS Issues

Ensure backend is running on `http://localhost:8080` and CORS is enabled.

### Authentication Fails

1. Clear browser localStorage: `localStorage.clear()`
2. Clear cookies and cache
3. Restart development server
4. Ensure backend is running

### Slow Task Loading

Tasks are cached after first load. To clear cache:
```javascript
// In browser console
localStorage.clear()
```

## 📚 Additional Resources

- [Angular Documentation](https://angular.dev)
- [Bootstrap 5 Docs](https://getbootstrap.com/docs/5.3/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Reactive Forms Guide](https://angular.dev/guide/reactive-forms)
- [HTTP Client Guide](https://angular.dev/guide/http)

## 🤝 Contributing

When contributing to this project:

1. Create a feature branch
2. Make changes with descriptive commits
3. Include documentation updates
4. Test thoroughly before submitting

## 📄 License

This project is private and not licensed for public use.

## 🎉 Support

For issues or questions:
1. Check TROUBLESHOOTING.md
2. Review SETUP.md for setup issues
3. Check API_INTEGRATION.md for API-related questions
