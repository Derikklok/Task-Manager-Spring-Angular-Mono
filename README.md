# 🚀 Task Manager - Full Stack Application

A modern, production-ready task management application built with **Angular 21** (Frontend), **Spring Boot 4.0.3** (Backend), and **MySQL 8.0** (Database). Fully containerized with Docker Compose for seamless development and deployment.

## 🚀 Quick Start (3 Steps)

### Prerequisites
- Docker Desktop installed and running
- PowerShell or Command Prompt
- ~40-50 seconds startup time

### Step 1: Navigate to Project Root
```bash
cd "C:\Users\User\Desktop\Task Manager"
```

### Step 2: Start with Docker Compose
```bash
docker-compose up --build
```
Wait 40-50 seconds for all services to start and become healthy.

### Step 3: Access the Application
- **Frontend**: http://localhost:4200
- **Backend API**: http://localhost:8080/api
- **Database**: localhost:3307 (user: root, pass: root)

That's it! 🎉


---

## 📋 Overview

**Task Manager** is a full-stack web application that helps teams organize and manage their work efficiently. It features user authentication, task management with filtering, responsive design, and complete Docker containerization for seamless deployment.

**Status:** ✅ Production Ready | **Version:** 0.0.1-SNAPSHOT | **Date:** March 2026

---

## ✨ Key Features

### 🔐 Authentication & Authorization
- User registration with email validation
- Secure login with BCrypt password hashing
- JWT token generation (24-hour expiration)
- Role-based access control (MANAGER, DEVELOPER)
- Automatic user association from JWT token

### 📝 Task Management
- Create, Read, Update, Delete (CRUD) tasks
- User isolation (each user sees only their tasks)
- Automatic timestamps (createdAt, updatedAt)
- Task status workflow (TO DO, IN PROGRESS, COMPLETED)
- Task filtering and search functionality
- Comprehensive input validation

### 🎨 User Interface
- **Professional Design** - Dark blue theme with gradients
- **Responsive Layout** - Mobile-friendly Bootstrap 5.3+
- **Real-time Updates** - Instant feedback on all operations
- **Accessible Forms** - Reactive forms with validation
- **Smooth Navigation** - Angular routing with guards

---

## 🛠 Technology Stack

### Frontend
| Component | Version |
|-----------|---------|
| Angular | 21.2.0 |
| TypeScript | 5.9.2 |
| Bootstrap | 5.3.8 |
| Node.js | 18+ |
| Package Manager | pnpm 9.15.0 |

### Backend
| Component | Version |
|-----------|---------|
| Java | 21 LTS |
| Spring Boot | 4.0.3 |
| Hibernate | 7.2.4 |
| JWT (jjwt) | Latest |
| Maven | 3.9.6+ |

### Infrastructure
| Component | Version |
|-----------|---------|
| MySQL | 8.0.36 |
| Docker | Latest |
| Docker Compose | 3.8+ |
| Nginx | Alpine |

---

## 🐳 Docker Compose Setup

### Available Methods

#### Method 1: PowerShell (Interactive - Recommended)
```bash
.\start-docker.ps1
```

#### Method 2: Direct Command
```bash
docker-compose up --build
```

#### Method 3: Using Make
```bash
make up
```

#### Method 4: Batch Script
```bash
start-docker.bat
```

### Essential Commands

```bash
# Start everything with fresh builds
docker-compose up --build

# Stop all services (data persists)
docker-compose down

# View all logs
docker-compose logs -f

# Check service status
docker-compose ps

# View specific service logs
docker-compose logs -f frontend
docker-compose logs -f backend
docker-compose logs -f mysql

# Restart all services
docker-compose restart

# Complete reset (delete all data)
docker-compose down -v
docker system prune -a
```

---

## 🏗 Project Architecture

### System Architecture
```
┌─────────────────────────────────────────────────────────────┐
│                  Your Browser (Host)                        │
│               http://localhost:4200                         │
└─────────────┬───────────────────────────────────────────────┘
              │ HTTP Requests
              ▼
┌─────────────────────────────────────────────────────────────┐
│           Docker Container Network                          │
│        (task-manager-network - bridge)                      │
│                                                             │
│  ┌──────────────────┐    ┌──────────────────┐              │
│  │  Frontend        │    │  Backend         │              │
│  │  (Nginx)         │    │  (Spring Boot)   │              │
│  │  Port: 4200      │    │  Port: 8080      │              │
│  │  • Angular app   │    │  • REST API      │              │
│  │  • Static files  │    │  • JWT Auth      │              │
│  │  • Reverse proxy │    │  • Task CRUD     │              │
│  └──────────────────┘    └────────┬─────────┘              │
│                                    │ JDBC                   │
│                                    ▼                        │
│                         ┌──────────────────┐               │
│                         │  MySQL           │               │
│                         │  Port: 3306      │               │
│                         │  • Users table   │               │
│                         │  • Tasks table   │               │
│                         │  • Persistent    │               │
│                         │    Volume        │               │
│                         └──────────────────┘               │
└─────────────────────────────────────────────────────────────┘
```

---

## 📱 Frontend

A production-grade Angular 21 application with clean UI, Bootstrap components, JWT authentication, and task management features.

### Features
- **User Authentication**: Secure login and registration
- **Task Management**: Create, edit, delete tasks
- **Task Filtering**: Filter by status and search
- **Responsive Design**: Works on desktop and mobile
- **Real-time Updates**: Instant feedback

### Folder Structure
```
frontend/
├── src/app/
│   ├── components/
│   │   ├── login/              # Authentication UI
│   │   ├── task-form/          # Create/Edit form
│   │   └── task-list/          # Task list & filters
│   ├── services/
│   │   ├── auth.service.ts     # Authentication
│   │   ├── task.service.ts     # Task API
│   │   └── jwt.interceptor.ts  # Token injection
│   ├── models/                 # TypeScript interfaces
│   └── app.routes.ts           # Route configuration
├── Dockerfile                  # Multi-stage build
├── nginx.conf                  # Nginx configuration
└── package.json                # Dependencies
```

### Local Development (Without Docker)
```bash
cd frontend
pnpm install
pnpm start        # Opens http://localhost:4200
pnpm build        # Production build
pnpm test         # Run tests
```

---

## 🔧 Backend

A complete Spring Boot REST API with JWT authentication, user management, and task CRUD operations.

### Features
- **User Registration & Login** - Secure with JWT
- **Task CRUD** - Full create, read, update, delete
- **User Isolation** - Each user sees only their tasks
- **Validation** - Comprehensive input validation
- **Health Checks** - Docker and Kubernetes ready
- **Security** - JWT tokens, BCrypt, role-based access

### API Endpoints

#### Authentication
```
POST   /api/auth/register          # Register new user
POST   /api/auth/login             # Login user
GET    /api/auth/validate-token    # Validate JWT
```

#### Tasks
```
GET    /api/tasks                  # Get all user tasks
GET    /api/tasks/{id}             # Get specific task
POST   /api/tasks                  # Create new task
PUT    /api/tasks/{id}             # Full update
PATCH  /api/tasks/{id}             # Partial update
DELETE /api/tasks/{id}             # Delete task
```

#### Health
```
GET    /api/health                 # Simple health check
GET    /api/health/live            # Liveness probe
GET    /api/health/ready           # Readiness probe
```

### Folder Structure
```
backend/src/main/java/com/master/backend/
├── controller/                 # REST endpoints
├── service/                    # Business logic
├── repository/                 # Database access
├── model/                      # Entity models
├── security/                   # Security config
├── config/                     # Configuration
└── Application.java            # Entry point
```

### Local Development (Without Docker)
```bash
cd backend
.\mvnw clean package
.\mvnw spring-boot:run         # Starts on http://localhost:8080
.\mvnw test                    # Run tests
```

---

## 💾 Database

MySQL 8.0.36 with persistent volume for data durability.

### Connection Details
- **Docker Internal**: `mysql:3306`
- **From Host**: `localhost:3307`
- **Database**: `task_manager`
- **User**: `root`
- **Password**: `root`
- **Volume**: `mysql_data` (persistent)

### Data Persistence
✅ Data **persists** after: `docker-compose down`
✅ Data **persists** after: Container restarts
✅ Data **persists** after: System reboots
❌ Data **deleted** only with: `docker-compose down -v`

---

## 🧪 Testing

### Frontend Tests
```bash
cd frontend
pnpm test
```

### Backend Tests
```bash
cd backend
.\mvnw test
```

### Integration Test
```bash
# Start all services
docker-compose up --build

# Test registration
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","role":"DEVELOPER"}'
```

---

## 🐛 Troubleshooting

### Ports Already in Use
```bash
netstat -ano | findstr :4200
taskkill /PID <PID> /F
```

### Containers Won't Start
```bash
docker-compose logs -f
docker-compose logs backend
```

### Database Connection Error
```bash
# Wait 30-40 seconds (MySQL needs startup time)
docker-compose logs mysql
docker-compose restart mysql
```

### Complete Reset
```bash
docker-compose down -v
docker system prune -a
docker-compose up --build
```

---

## 📚 Documentation



### Main Documents
- **DOCKER_START_HERE.txt** - Quick visual start guide (5 min read)
- **README_DOCKER.md** - Complete Docker setup guide (200+ lines)
- **DOCKER_QUICK_REF.md** - Command reference cheat sheet
- **DOCKER_SETUP_GUIDE.md** - Configuration details
- **DOCUMENTATION_INDEX.md** - Navigate all docs
- **FILE_MANIFEST.md** - File descriptions
- **SETUP_CHECKLIST.md** - Progress tracking

### Component Documentation
- **frontend/README.md** - Detailed frontend guide
- **backend/README.md** - Complete backend documentation

---

## ⚙️ Configuration

### Environment Variables
```yaml
MySQL:
  MYSQL_ROOT_PASSWORD: root
  MYSQL_DATABASE: task_manager
  MYSQL_USER: app_user

Backend:
  DB_URL: jdbc:mysql://mysql:3306/task_manager
  JWT_SECRET: MySuperSecretKeyForJWTGeneration1234567890
  JWT_EXP: 86400000

Frontend:
  API_BASE_URL: /api (relative path proxied by Nginx)
```

### ⚠️ Security Notes

**DEVELOPMENT ONLY** - These are default credentials:
- MySQL Root Password: `root`
- JWT Secret: `MySuperSecretKeyForJWTGeneration1234567890`

**Before Production:**
✓ Change all passwords
✓ Generate new JWT secret (32+ random characters)
✓ Use Docker secrets or environment files
✓ Enable SSL/TLS
✓ Configure CORS properly
✓ Set up logging

---

## ✅ Verification Checklist

After running `docker-compose up --build`:

- [ ] All 3 containers show "healthy" or "running": `docker-compose ps`
- [ ] Frontend loads: http://localhost:4200
- [ ] Backend health check: http://localhost:8080/api/health
- [ ] Can register a new user
- [ ] Can login with registered email
- [ ] Can create, update, delete tasks
- [ ] Data persists after: `docker-compose down` then `docker-compose up`

---

## 🎯 Available Commands

| Command | Purpose |
|---------|---------|
| `docker-compose up --build` | Start everything with fresh build |
| `docker-compose down` | Stop all services (keep data) |
| `docker-compose down -v` | Stop and delete all data |
| `docker-compose ps` | Check service status |
| `docker-compose logs -f` | View all logs |
| `docker-compose logs -f backend` | View backend logs |
| `docker-compose restart` | Restart all services |
| `make up` | Start (requires Makefile) |
| `make down` | Stop (requires Makefile) |
| `.\start-docker.ps1` | Interactive PowerShell menu |
| `start-docker.bat` | Interactive batch menu |

---

## 📊 Service Status & Ports

| Service | Port (Host) | Port (Internal) | Status | URL |
|---------|------------|-----------------|--------|-----|
| Frontend | 4200 | 80 | RUNNING | http://localhost:4200 |
| Backend | 8080 | 8080 | HEALTHY | http://localhost:8080/api |
| MySQL | 3307 | 3306 | HEALTHY | localhost:3307 |

Check with: `docker-compose ps`

---

## 🎯 Next Steps

1. **First Time?** → Read `DOCKER_START_HERE.txt` (5 min)
2. **Ready to Start?** → Run `docker-compose up --build`
3. **Wait** → 40-50 seconds for services
4. **Open** → http://localhost:4200
5. **Test** → Create an account and manage tasks!

---

## 💬 Need Help?

Check comprehensive documentation:
- Quick start: `DOCKER_START_HERE.txt`
- Complete guide: `README_DOCKER.md`
- Commands: `DOCKER_QUICK_REF.md`
- Find anything: `DOCUMENTATION_INDEX.md`

---

**Version:** 0.0.1-SNAPSHOT | **Date:** March 2026 | **Status:** ✅ Production Ready
