# Task Manager Frontend - Architecture & Project Structure

## 📁 Complete Project Structure

```
task-manager-frontend/
├── .env                              # Environment variables (local development)
├── .env.example                      # Environment template
├── .gitignore                        # Git ignore rules
├── angular.json                      # Angular CLI configuration
├── package.json                      # NPM dependencies
├── pnpm-lock.yaml                    # Package lock file
├── tsconfig.json                     # TypeScript config
├── tsconfig.app.json                 # App-specific TypeScript config
├── tsconfig.spec.json                # Test TypeScript config
│
├── README.md                         # Original README
├── SETUP.md                          # Setup and getting started
├── API_INTEGRATION.md                # API integration guide
├── ARCHITECTURE.md                   # This file
│
├── public/                           # Static assets
│   └── favicon.ico
│
├── src/
│   ├── index.html                    # HTML entry point
│   ├── main.ts                       # Angular bootstrap
│   ├── styles.css                    # Global styles
│   ├── env.ts                        # Environment configuration
│   │
│   └── app/
│       ├── app.ts                    # Root component
│       ├── app.routes.ts             # Route configuration
│       ├── app.config.ts             # Application config
│       ├── app.html                  # Legacy template (not used)
│       ├── app.css                   # Legacy styles (not used)
│       ├── app.spec.ts               # Root component tests
│       │
│       ├── models/
│       │   └── index.ts              # TypeScript interfaces
│       │                             # ├─ User, Task, Auth models
│       │
│       ├── services/
│       │   ├── auth.service.ts       # Authentication service
│       │   ├── task.service.ts       # Task CRUD service
│       │   ├── jwt.interceptor.ts    # JWT token interceptor
│       │   └── auth.guard.ts         # Route protection guard
│       │
│       └── components/
│           ├── login/
│           │   ├── login.component.ts
│           │   ├── login.component.html
│           │   └── login.component.css
│           │
│           ├── task-list/
│           │   ├── task-list.component.ts
│           │   ├── task-list.component.html
│           │   └── task-list.component.css
│           │
│           └── task-form/
│               ├── task-form.component.ts
│               ├── task-form.component.html
│               └── task-form.component.css
│
├── docs/
│   └── features.txt                  # Backend & frontend requirements
│
└── dist/                             # Build output (generated)
```

## 🏗️ Architecture Overview

### Layer Architecture

```
┌────────────────────────────────────┐
│   Presentation Layer               │
│  ┌──────────┐  ┌──────────┐        │
│  │  Login   │  │Task List │  ...   │
│  │Component │  │Component │        │
│  └──────────┘  └──────────┘        │
└──────────────┬─────────────────────┘
               │
┌──────────────▼──────────────────────┐
│   Business Logic Layer              │
│  ┌──────────┐  ┌──────────┐         │
│  │Auth Svc  │  │Task Svc  │  ...    │
│  └──────────┘  └──────────┘         │
└──────────────┬─────────────────────┘
               │
┌──────────────▼──────────────────────┐
│   Infrastructure Layer              │
│  ┌──────────┐  ┌──────────┐         │
│  │JWT Inter-│  │Auth Guard│  ...    │
│  │ceptor   │  │          │         │
│  └──────────┘  └──────────┘         │
└──────────────┬─────────────────────┘
               │
┌──────────────▼──────────────────────┐
│   HTTP Client / API Layer           │
│  Angular HttpClient                 │
└──────────────┬─────────────────────┘
               │
               ▼
        Backend API (port 8080)
```

## 🔌 Component Architecture

### Component Tree

```
App (Root)
│
├── LoginComponent
│   ├── Form Group (Reactive)
│   │   ├── email field
│   │   ├── password field
│   │   └── role field
│   └── Auth Service
│
├── TaskListComponent
│   ├── Task List Table
│   │   └── Task Rows
│   ├── Filters
│   │   ├── Status Filter
│   │   └── Search Bar
│   └── Task Service
│
└── TaskFormComponent
    ├── Form Group (Reactive)
    │   ├── title field
    │   ├── description textarea
    │   └── status select
    └── Task Service
```

## 📊 Data Flow

### Authentication Flow

```
User Input (Email/Password)
        ↓
LoginComponent
        ↓
AuthService.login()
        ↓
HTTP POST /api/auth/login
        ↓
Backend validates
        ↓
JWT Token + User
        ↓
AuthService stores in localStorage
        ↓
Route guard allows access
        ↓
Navigate to /tasks
```

### Task Fetching Flow

```
TaskListComponent ngOnInit
        ↓
TaskService.getTasks()
        ↓
JwtInterceptor adds token
        ↓
HTTP GET /api/tasks
        ↓
Backend returns tasks
        ↓
Component updates filteredTasks[]
        ↓
Template renders table
```

### Task Creation Flow

```
TaskFormComponent form submit
        ↓
Validate form (Reactive Forms)
        ↓
TaskService.createTask(formValue)
        ↓
JwtInterceptor adds token
        ↓
HTTP POST /api/tasks
        ↓
Backend creates task
        ↓
Service returns created task
        ↓
Navigate to /tasks
        ↓
TaskList reloads tasks
```

## 🔐 Security Architecture

### Authentication Flow

```
┌─────────────────┐
│  User Login     │
└────────┬────────┘
         │
    POST /api/auth/login
         │
         ▼
┌──────────────────────────────┐
│   Backend Validation         │
│ • Email verification         │
│ • Password hashing (BCrypt)  │
│ • JWT generation (HS256)     │
└────────┬─────────────────────┘
         │
    JWT Token Response
         │
         ▼
┌──────────────────────────────┐
│   Frontend Storage           │
│ localStorage['auth_token']   │
│ localStorage['user']         │
└────────┬─────────────────────┘
         │
    Every API Request
         │
         ▼
┌──────────────────────────────┐
│   JWT Interceptor            │
│ Authorization: Bearer <TOKEN>│
│ (Auto-added to all requests) │
└────────┬─────────────────────┘
         │
    Protected API Call
         │
         ▼
┌──────────────────────────────┐
│   Backend Validation         │
│ • JWT signature verification │
│ • Token expiration check     │
│ • User authorization        │
└──────────────────────────────┘
```

### Route Protection

```
Unauthenticated User
        ↓
Try to access /tasks
        ↓
authGuard checks isAuthenticated()
        ↓
❌ Not authenticated
        ↓
Redirect to /login

Authenticated User
        ↓
Try to access /tasks
        ↓
authGuard checks isAuthenticated()
        ↓
✅ Has valid token
        ↓
Allow access to route
```

## 🎨 Styling Architecture

### Global Styles

```css
src/styles.css
├── CSS Variables (Color Palette)
├── Global Typography
├── Form Elements
├── Button Styles
├── Table Styles
├── Alert Styles
├── Utility Classes
└── Responsive Breakpoints
```

### Component Styles (BEM Methodology)

```css
component.component.css
├── :host styling
├── .container
├── .header
├── .form-group
├── .card
├── .table
├── .button
├── .error-state
├── @keyframes animations
└── @media queries
```

### Color Palette Variables

```css
:root {
  --primary-dark: #0f3460;      /* Main UI color */
  --primary-medium: #1a4d7a;    /* Hover states */
  --primary-light: #2a5fa0;     /* Alternative primary */
  --accent-light: #0099ff;      /* Accent elements */
  --neutral-light: #f8f9fa;     /* Light backgrounds */
  --neutral-border: #e9ecef;    /* Borders */
  --text-primary: #333333;      /* Main text */
  --text-secondary: #6c757d;    /* Secondary text */
}
```

## 🔄 State Management

### AuthService (BehaviorSubject)

```typescript
// Current user state
private currentUserSubject = new BehaviorSubject<User | null>(...);
public currentUser$ = this.currentUserSubject.asObservable();

// Subscribed in components
this.authService.currentUser$.subscribe(user => {
  // Update component state
});
```

### Local Component State

```typescript
// TaskListComponent
tasks: Task[] = [];              // All tasks
filteredTasks: Task[] = [];      // Filtered view
selectedFilter: TaskStatus = 'ALL';
searchQuery: string = '';
loading: boolean = false;
error: string | null = null;

// Updated by service calls
this.taskService.getTasks().subscribe({
  next: (tasks) => {
    this.tasks = tasks;
    this.filterTasks();
  }
});
```

## 📋 Form Architecture

### Reactive Forms Pattern

```typescript
// TaskFormComponent
this.form = this.formBuilder.group({
  title: ['', [
    Validators.required,
    Validators.minLength(3),
    Validators.maxLength(200)
  ]],
  description: ['', [
    Validators.maxLength(1000)
  ]],
  status: ['TODO', Validators.required]
});

// Form control access
this.form.controls['title']
this.form.get('title')
this.form.value
this.form.touched
this.form.dirty
```

### Validation Strategy

1. **Field-level validation**: On input
2. **Form-level validation**: On submission
3. **Async validation**: Server-side (optional)
4. **Custom validators**: Business logic

## 🚀 Performance Optimizations

### Bundle Size Optimization

- **Tree-shaking**: Unused code removed
- **Code splitting**: Per-component styles
- **Lazy loading**: Routes (if added)
- **AOT compilation**: Ahead-of-time compilation
- **Minification**: Production build

### Runtime Optimization

- **OnPush detection strategy**: (optional)
- **Unsubscribe pattern**: Prevent memory leaks
- **Debouncing**: Search input
- **Change detection**: Zone.js optimization

## 🧪 Testing Architecture

### Unit Test Structure

```typescript
// component.spec.ts
describe('ComponentName', () => {
  let component: ComponentName;
  let fixture: ComponentFixture<ComponentName>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComponentName]
    }).compileComponents();

    fixture = TestBed.createComponent(ComponentName);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
```

### Mock Service Pattern

```typescript
// Mock AuthService
const mockAuthService = {
  login: jasmine.createSpy('login').and.returnValue(of(mockAuthResponse)),
  isAuthenticated: jasmine.createSpy('isAuthenticated').and.returnValue(true)
};

// Provide in TestBed
TestBed.configureTestingModule({
  providers: [
    { provide: AuthService, useValue: mockAuthService }
  ]
});
```

## 📱 Responsive Design

### Breakpoints

```css
/* Mobile: < 576px */
@media (max-width: 576px) { }

/* Tablet: 576px - 768px */
@media (max-width: 768px) { }

/* Desktop: 768px - 992px */
@media (max-width: 992px) { }

/* Large: 992px - 1200px */
@media (max-width: 1200px) { }

/* Extra Large: > 1200px */
@media (max-width: 1400px) { }
```

### Mobile-First Approach

- Base styles for mobile
- Desktop enhancements via media queries
- Touch-friendly button sizes (min 44x44px)
- Readable font sizes on small screens

## 🔗 Integration Points

### External Dependencies

```json
{
  "@angular/common": "^21.2.0",
  "@angular/core": "^21.2.0",
  "@angular/forms": "^21.2.0",
  "@angular/platform-browser": "^21.2.0",
  "@angular/router": "^21.2.0",
  "bootstrap": "^5.3.8",
  "rxjs": "~7.8.0"
}
```

### Backend Integration

- REST API on port 8080
- CORS enabled
- JWT authentication
- HTTPS (production)

## 💡 Design Patterns Used

1. **Singleton Pattern**: Services
2. **Observer Pattern**: Services with RxJS
3. **Guard Pattern**: Route protection
4. **Interceptor Pattern**: HTTP middleware
5. **Component Pattern**: Reusable UI elements
6. **Forms Pattern**: Reactive & Template-driven

## 🎯 Best Practices Followed

✅ Standalone components
✅ Reactive forms
✅ Service-based architecture
✅ Strong typing (TypeScript)
✅ Error handling
✅ Responsive design
✅ Accessibility (WCAG)
✅ Security (JWT, XSS protection)
✅ Clean code structure
✅ Documentation

## 📊 Metrics & Milestones

- **Components**: 3 (Login, TaskList, TaskForm)
- **Services**: 3 (Auth, Task, Guard)
- **Routes**: 4 (/, /login, /tasks, /task/:id)
- **Models**: 5 (User, Task, Auth, LoginReq, RegisterReq)
- **Interceptors**: 1 (JWT)
- **Guards**: 1 (authGuard)
- **Global Styles**: 200+ lines
- **Component Styles**: 600+ lines

---

This architecture ensures:
- **Scalability**: Easy to add new features
- **Maintainability**: Clear separation of concerns
- **Testability**: Services can be mocked
- **Performance**: Optimized bundle size
- **Security**: JWT authentication, Route guards
