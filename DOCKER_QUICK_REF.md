# 🚀 Docker Quick Reference - Task Manager

## ⚡ Most Used Commands

```bash
# START EVERYTHING
docker-compose up --build

# VIEW LOGS
docker-compose logs -f

# STOP EVERYTHING
docker-compose down

# REMOVE EVERYTHING (including data)
docker-compose down -v

# CHECK STATUS
docker-compose ps

# RESTART A SERVICE
docker-compose restart backend
```

---

## 🌐 Access Points

| Service | URL | Purpose |
|---------|-----|---------|
| Frontend | http://localhost:4200 | Angular web app |
| Backend | http://localhost:8080/api | API endpoints |
| MySQL | localhost:3307 | Database (3306 inside container) |

---

## 📦 What Gets Created

| Item | Type | Details |
|------|------|---------|
| taskmanager-frontend | Container | Nginx serving Angular app |
| taskmanager-backend | Container | Spring Boot API |
| taskmanager-mysql | Container | MySQL database |
| task-manager-network | Network | Docker bridge network |
| mysql_data | Volume | Persistent database storage |

---

## 🔍 Troubleshooting Quick Fixes

```bash
# Port already in use?
netstat -ano | findstr :4200
taskkill /PID <PID> /F

# Container won't start?
docker-compose logs mysql
docker-compose logs backend

# Reset everything
docker-compose down -v
docker system prune -a
docker-compose up --build

# Check container internals
docker-compose exec backend bash
docker-compose exec mysql mysql -u root -p
```

---

## 📊 Service Dependencies

```
startup order:
1. MySQL (must be healthy first)
   ↓ (waits for health check)
2. Backend (connects to MySQL)
   ↓ (waits for health check)
3. Frontend (calls Backend API)
```

---

## 🔧 Configuration Override

Edit `docker-compose.yml` to change:
- Ports: `ports: ["4201:80"]`
- Database: `MYSQL_DATABASE: my_db`
- Passwords: `MYSQL_ROOT_PASSWORD: newpassword`
- API URL: `VITE_API_BASE_URL: http://backend:8080/api`

---

## ✅ Health Checks

All services have health checks enabled:
- MySQL: `mysqladmin ping` every 10s
- Backend: `curl http://localhost:8080/api/health` every 30s

View in `docker-compose ps` - STATUS column shows health.

---

## 💾 Data Persistence

Database data is stored in `mysql_data` volume:
- ✅ Keeps data after: `docker-compose down`
- ❌ Deletes data after: `docker-compose down -v`
- ✅ Survives: `docker-compose restart`

---

## 📱 Local Development Alternative

```bash
# Instead of Docker, run locally:
cd backend
mvn spring-boot:run
# In another terminal:
cd frontend
npm run dev
```

---

## 🎯 Common Workflows

### Fresh Start
```bash
docker-compose down -v
docker-compose up --build
```

### Quick Restart
```bash
docker-compose restart
```

### Update Backend Code
```bash
# Edit code in backend/src/...
docker-compose down
docker-compose up --build
```

### Update Frontend Code
```bash
# Edit code in frontend/src/...
docker-compose down
docker-compose up --build
```

### Quick Deploy
```bash
docker-compose up -d  # -d = detached (background)
# Services run in background
# View logs anytime: docker-compose logs -f
```

---

## 🐛 Debug Info

```bash
# See all containers
docker ps -a

# See all networks
docker network ls

# See all volumes
docker volume ls

# Inspect a service
docker-compose config

# Full service details
docker-compose ps -a

# Network connectivity test
docker-compose exec backend ping mysql
docker-compose exec frontend curl http://backend:8080/api/health
```

---

## ⚠️ Important Notes

1. **Use `docker-compose up --build`** after code changes
2. **Frontend must use `http://backend:8080/api`** (not localhost inside container)
3. **MySQL is at `mysql:3306`** inside container (3307 is external)
4. **Wait 30-40 seconds** for MySQL to be ready on first start
5. **Database persists** unless you use `docker-compose down -v`

---

## 🔐 Credentials (Development Only)

```
MySQL Root: root / root
API: No auth required for development
JWT Secret: MySuperSecretKeyForJWTGeneration1234567890
```

⚠️ Change these before production!

---

Made with ❤️ for Task Manager

