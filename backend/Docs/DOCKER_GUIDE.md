# Docker & Docker Compose Setup Guide

## Overview

This guide explains how to run the Task Manager backend using Docker and Docker Compose. The configuration supports future frontend integration.

---

## 📦 Prerequisites

- **Docker Desktop** installed (Windows/Mac) or Docker Engine (Linux)
- **Docker Compose** (included with Docker Desktop)
- Port 8080 available (backend)
- Port 3306 available (MySQL)
- Port 3000 available (for future frontend)

**Installation:**
- [Docker Desktop for Windows](https://docs.docker.com/desktop/install/windows-install/)
- [Docker Desktop for Mac](https://docs.docker.com/desktop/install/mac-install/)
- [Docker Engine for Linux](https://docs.docker.com/engine/install/)

---

## 🚀 Quick Start

### 1. Clone/Navigate to Project
```bash
cd "C:\Users\User\Desktop\Task Manager\backend"
```

### 2. Create .env File (Optional - for custom configuration)
```bash
# Copy the environment template
cp .env.properties.example .env

# Edit .env with your values
DB_PASSWORD=your_mysql_password
JWT_SECRET=your_32_character_secure_secret_key
JWT_EXP=86400000
```

### 3. Build and Run with Docker Compose
```bash
# Build images
docker-compose build

# Start services (backend + MySQL)
docker-compose up -d

# View logs
docker-compose logs -f backend
```

### 4. Verify Services
```bash
# Check running containers
docker-compose ps

# Test backend health
curl http://localhost:8080/api/health

# Check database connection
docker-compose exec mysql mysql -u root -p task_manager -e "SELECT 1"
```

### 5. Stop Services
```bash
docker-compose down

# Also remove volumes (WARNING: deletes database data)
docker-compose down -v
```

---

## 🐳 Docker Architecture

### Multi-Stage Build

The Dockerfile uses a **multi-stage build** for efficiency:

**Stage 1: Builder**
- Uses Maven image with Java 21
- Downloads dependencies
- Compiles source code
- Creates JAR file

**Stage 2: Runtime**
- Uses lightweight Alpine JRE image
- Copies JAR from builder stage
- Runs as non-root user (security)
- Includes health checks

**Benefits:**
- Smaller final image (~300MB vs 1GB+)
- Faster builds (dependencies cached)
- Better security (non-root user)
- Easier to maintain

### Services Architecture

```
┌─────────────────────────────────────────┐
│     Docker Compose Network              │
├─────────────────────────────────────────┤
│                                          │
│  ┌──────────────────┐                   │
│  │    Backend       │                   │
│  │  (Port 8080)     │                   │
│  │  Spring Boot 4.0 │                   │
│  └────────┬─────────┘                   │
│           │                              │
│           │ (JDBC)                       │
│           │                              │
│  ┌────────▼─────────┐                   │
│  │     MySQL        │                   │
│  │  (Port 3306)     │                   │
│  │  task_manager DB │                   │
│  │  (Persistent)    │                   │
│  └──────────────────┘                   │
│                                          │
│  Frontend Service (To be added)          │
│  (Port 3000)                             │
│                                          │
└─────────────────────────────────────────┘
```

---

## 📝 Configuration

### Environment Variables

**In docker-compose.yml or .env file:**

```bash
# Server
PORT=8080

# Database
DB_URL=jdbc:mysql://mysql:3306/task_manager
DB_USERNAME=root
DB_PASSWORD=root_password

# JWT
JWT_SECRET=your_32_character_minimum_secure_secret_key
JWT_EXP=86400000  # 24 hours in milliseconds
```

### Volume Management

**MySQL Data Persistence:**
```yaml
volumes:
  mysql_data:
    driver: local
```

Data is stored in Docker volume `task_manager_mysql_data`, persisted even after container stops.

### Health Checks

**Backend:**
- Checks `GET /api/tasks` endpoint
- Interval: 30 seconds
- Timeout: 10 seconds
- Retries: 3

**MySQL:**
- Runs `mysqladmin ping`
- Interval: 10 seconds
- Timeout: 5 seconds
- Retries: 5

---

## 🛠️ Docker Commands

### Build Only
```bash
docker-compose build
```

### Start in Background
```bash
docker-compose up -d
```

### Start with Logs
```bash
docker-compose up
```

### View Logs
```bash
# Backend logs
docker-compose logs backend

# MySQL logs
docker-compose logs mysql

# Follow logs (live)
docker-compose logs -f

# Last 100 lines
docker-compose logs --tail 100
```

### Execute Commands in Container
```bash
# Run curl in backend container
docker-compose exec backend curl http://localhost:8080/api/health

# MySQL in MySQL container
docker-compose exec mysql mysql -u root -p task_manager

# Bash shell in backend
docker-compose exec backend /bin/sh
```

### Stop Services
```bash
# Stop (keep data)
docker-compose stop

# Stop and remove containers
docker-compose down

# Stop and remove everything including volumes
docker-compose down -v
```

### View Service Status
```bash
docker-compose ps
```

---

## 🧪 Testing with Docker

### 1. Test Backend Health
```bash
curl http://localhost:8080/api/health
```

### 2. Test Detailed Health
```bash
curl http://localhost:8080/api/health/detailed
```

### 3. Register User
```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123","role":"DEVELOPER"}'
```

---

## 🔄 Adding Frontend Later

When you create the frontend, uncomment the frontend service in docker-compose.yml:

```yaml
frontend:
  build:
    context: ../frontend  # Path to frontend project
    dockerfile: Dockerfile
  container_name: task-manager-frontend
  ports:
    - "3000:3000"
  environment:
    REACT_APP_API_URL: http://backend:8080  # Backend service URL
  depends_on:
    - backend
  networks:
    - task-manager-network
  restart: unless-stopped
```

Then run:
```bash
docker-compose up -d
```

Both services will communicate via the shared network (`task-manager-network`).

---

## 🚨 Troubleshooting

### Container Won't Start

**Check logs:**
```bash
docker-compose logs backend
```

**Common issues:**
- Port already in use: `lsof -i :8080`
- Database not ready: MySQL container takes time to start
- Dependency issues: Ensure MySQL is healthy before backend

### Database Connection Failed

**Solution:**
```bash
# Wait for MySQL to be fully ready
docker-compose exec mysql mysqladmin ping -h localhost

# Restart backend
docker-compose restart backend
```

### Volume Issues

**View volumes:**
```bash
docker volume ls
docker volume inspect task_manager_mysql_data
```

**Remove volume (WARNING: deletes data):**
```bash
docker volume rm task_manager_mysql_data
```

### Network Issues

**Check network:**
```bash
docker network ls
docker network inspect backend_task-manager-network
```

---

## 📊 Performance Tips

1. **Build Cache:**
   - Maven dependencies are cached
   - Use `.dockerignore` to exclude unnecessary files

2. **Image Size:**
   - Uses Alpine Linux (minimal image)
   - Multi-stage build keeps final size small

3. **Resource Limits:**
   - Set memory limits in docker-compose.yml if needed:
   ```yaml
   services:
     backend:
       mem_limit: 1g
       memswap_limit: 2g
   ```

4. **Database:**
   - Use volumes for persistence
   - Consider MySQL backup strategy

---

## 🔒 Security Considerations

### Current Security Measures

✅ **Non-root User:** Application runs as `appuser` (UID 1001)
✅ **Alpine Base:** Minimal base image reduces attack surface
✅ **Health Checks:** Ensures service is responsive
✅ **Network Isolation:** Services communicate via internal network
✅ **Environment Variables:** Secrets in .env, not hardcoded

### Production Recommendations

1. **Change MySQL root password:** Update `DB_PASSWORD` in .env
2. **Use secure JWT secret:** Generate 32+ character random string
3. **Enable MySQL authentication:** Don't use default credentials
4. **Bind to specific IP:** Use `127.0.0.1:8080` instead of `0.0.0.0:8080`
5. **Use secrets management:** Docker Secrets for sensitive data
6. **Enable SSL/TLS:** Use reverse proxy (Nginx)
7. **Regular backups:** Backup MySQL volumes
8. **Monitoring:** Set up logging and monitoring

---

## 📋 File Locations

```
backend/
├── Dockerfile                 # Multi-stage build
├── docker-compose.yml         # Compose configuration
├── .dockerignore              # Build context exclusions
├── pom.xml                    # Maven build file
├── src/
│   ├── main/
│   │   ├── java/
│   │   └── resources/
│   │       └── application.properties
│   └── test/
├── .env                       # Environment variables (create from template)
└── .env.properties.example    # Template for environment variables
```

---

## 🎯 Next Steps

1. **Setup Docker:** Install Docker Desktop
2. **Create .env file:** Copy and customize .env.properties.example
3. **Build image:** `docker-compose build`
4. **Start services:** `docker-compose up -d`
5. **Test API:** Use provided curl examples
6. **View logs:** `docker-compose logs -f backend`
7. **Add frontend:** Follow "Adding Frontend Later" section when ready

---

## 📚 Additional Resources

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Spring Boot Docker Guide](https://spring.io/guides/gs/spring-boot-docker/)
- [Docker Best Practices](https://docs.docker.com/develop/dev-best-practices/)
- [Docker Security Best Practices](https://docs.docker.com/engine/security/)

---

## 📝 Quick Command Reference

```bash
# Build
docker-compose build

# Start
docker-compose up -d

# View status
docker-compose ps

# View logs
docker-compose logs -f backend

# Stop
docker-compose down

# Test
curl http://localhost:8080/api/health

# Execute in container
docker-compose exec backend bash

# Remove volumes (WARNING: deletes data)
docker-compose down -v
```

---

**Date:** March 18, 2026  
**Status:** ✓ COMPLETE



