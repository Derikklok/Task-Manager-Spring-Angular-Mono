# Task Manager Frontend

A production-grade Angular 21 task management application with a clean blue UI, Bootstrap components, JWT authentication, and comprehensive task management features.

## 🎯 Features

- **User Authentication**: Secure login and registration with JWT tokens
- **Task Management**: Create, read, update, and delete tasks
- **Task Filtering**: Filter tasks by status (Todo, In Progress, Completed)
- **Search Functionality**: Search tasks by title and description
- **Reactive Forms**: Advanced form validation with real-time feedback
- **Responsive Design**: Mobile-friendly interface with Bootstrap
- **Blue Color Palette**: Professional blue-themed UI design
- **Environment Configuration**: Secure .env-based API configuration

## 📋 Tech Stack

- **Framework**: Angular 21
- **UI Framework**: Bootstrap 5.3+
- **Forms**: Reactive Forms
- **HTTP Client**: @angular/common/http
- **Package Manager**: pnpm 9.15+
- **Node**: 18+
- **Testing**: Vitest

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and pnpm 9.15+
- Task Manager Backend running on `http://localhost:8080`

### Installation

1. **Install dependencies**:
   ```bash
   pnpm install
   ```

2. **Create environment file**:
   ```bash
   cp .env.example .env
   ```

3. **Configure API endpoints** in `.env`:
   ```
   VITE_API_BASE_URL=http://localhost:8080/api
   VITE_APP_NAME=Task Manager
   VITE_APP_VERSION=1.0.0
   ```

### Development Server

Run the development server:
```bash
pnpm start
```

Navigate to `http://localhost:4200/`. The application will automatically reload when you modify source files.

## 📚 Project Structure

```
src/
├── app/
│   ├── components/
│   │   ├── login/              # Login & Registration component
│   │   ├── task-list/          # Task list with filtering
│   │   └── task-form/          # Create/Edit task form
│   ├── services/
│   │   ├── auth.service.ts     # Authentication service
│   │   ├── task.service.ts     # Task CRUD service
│   │   ├── jwt.interceptor.ts  # JWT token interceptor
│   │   └── auth.guard.ts       # Route protection guard
│   ├── models/
│   │   └── index.ts            # TypeScript interfaces
│   ├── app.routes.ts           # Route configuration
│   ├── app.config.ts           # Application configuration
│   └── app.ts                  # Root component
├── env.ts                       # Environment configuration
├── main.ts                      # Application entry point
├── styles.css                   # Global styles with blue palette
└── index.html                   # HTML template
```

## 🔑 Key Features

### Authentication

- **Login/Register**: Users can create accounts or log in with email and password
- **JWT Tokens**: Secure token-based authentication with 24-hour expiration
- **Auto-logout**: Automatic logout on 401 responses
- **Session Persistence**: Session restored on page reload

### Task Management

- **List View**: Display all tasks in a responsive table
- **Create**: Add new tasks with title, description, and status
- **Update**: Edit existing tasks with full or partial updates
- **Delete**: Remove tasks with confirmation
- **Filter**: Filter by status (Todo, In Progress, Completed)
- **Search**: Real-time search by title and description

### Form Validation

- **Reactive Forms**: Advanced validation with custom error messages
- **Real-time Feedback**: Inline error messages as user types
- **Character Counters**: Display character count for title and description
- **Status Validation**: Ensure proper task status

## 🎨 Color Palette

The application uses a professional blue color scheme:

- **Primary Dark**: `#0f3460` - Main UI elements
- **Primary Medium**: `#1a4d7a` - Hover states
- **Primary Light**: `#2a5fa0` - Secondary elements
- **Accent**: `#0099ff` - Highlights
- **Neutral**: `#f8f9fa` - Backgrounds

## 🔐 Security

- **JWT Tokens**: Secure token-based authentication
- **HTTP Interceptor**: Automatic token injection in requests
- **Route Guards**: Protected routes for authenticated users
- **CORS Support**: Backend configured for cross-origin requests
- **Environment Variables**: Sensitive data stored in .env files

## 🛠️ Available Scripts

```bash
# Start development server
pnpm start

# Build for production
pnpm build

# Run tests
pnpm test

# Run linting (if configured)
pnpm lint

# Watch mode
pnpm watch
```

## 📝 API Endpoints

The application communicates with the following backend endpoints:

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration

### Tasks
- `GET /api/tasks` - Get all tasks
- `GET /api/tasks/{id}` - Get specific task
- `POST /api/tasks` - Create new task
- `PUT /api/tasks/{id}` - Update task (full)
- `PATCH /api/tasks/{id}` - Update task (partial)
- `DELETE /api/tasks/{id}` - Delete task

All endpoints require JWT authentication header:
```
Authorization: Bearer <token>
```

## 🧪 Testing

Run unit tests:
```bash
pnpm test
```

## 📦 Production Build

Build for production:
```bash
pnpm build
```

The build artifacts will be stored in the `dist/` directory.

## 🌐 Deployment

1. Build the application:
   ```bash
   pnpm build
   ```

2. Deploy the `dist/` folder to your hosting service

3. Set environment variables on your hosting platform:
   ```
   VITE_API_BASE_URL=https://your-api-domain.com/api
   ```

## 🔗 Environment Configuration

### Development
```
VITE_API_BASE_URL=http://localhost:8080/api
```

### Production
```
VITE_API_BASE_URL=https://api.yourdomain.com/api
```

## 📱 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Test your code
4. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Troubleshooting

### CORS Issues
Ensure the backend is running on `http://localhost:8080` and has CORS enabled.

### Authentication Failed
- Check credentials are correct
- Verify backend is running
- Check API endpoint in `.env`

### Tasks Not Loading
- Ensure you're logged in
- Check network requests in browser DevTools
- Verify JWT token in localStorage

## ✨ Best Practices Used

- **Standalone Components**: Modern Angular with standalone components
- **Reactive Forms**: Type-safe form handling
- **Service Pattern**: Separation of concerns
- **Route Guards**: Protected routes
- **HTTP Interceptors**: Centralized request/response handling
- **Error Handling**: Comprehensive error messages
- **Responsive Design**: Mobile-friendly interface
- **Accessibility**: WCAG compliance

## 📞 Support

For issues and questions, please refer to the backend documentation or contact the development team.
