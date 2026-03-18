# Task Manager - Spring Boot Backend

Complete Spring Boot Task Manager application with JWT authentication, MySQL database, and role-based access control.

## 🎯 Current Status: ✅ AUTHENTICATION COMPLETE

Build Status: **✓ SUCCESS** - Ready for development and testing

---

## 🚀 Quick Start

### Prerequisites
- Java 21+
- MySQL 8.0+
- Maven 3.6+

### Setup Steps

1. **Clone/Navigate to project:**
   ```bash
   cd "C:\Users\User\Desktop\Task Manager\backend"
   ```

2. **Create `.env.properties` file:**
   ```properties
   PORT=8080
   DB_URL=jdbc:mysql://localhost:3306/task_manager
   DB_USERNAME=root
   DB_PASSWORD=your_mysql_password
   JWT_SECRET=your_32_character_minimum_secret_key_here_make_it_random_and_long
   JWT_EXP=86400000
   ```
   
   Or copy from template:
   ```bash
   copy .env.properties.example .env.properties
   ```

3. **Create MySQL Database:**
   ```bash
   mysql -u root -p
   CREATE DATABASE task_manager;
   ```

4. **Build the project:**
   ```bash
   .\mvnw clean package
   ```

5. **Run the application:**
   ```bash
   .\mvnw spring-boot:run
   # Or run the JAR directly
   java -jar target/backend-0.0.1-SNAPSHOT.jar
   ```

6. **Application will be available at:**
   ```
   http://localhost:8080
   ```

---

## 📚 Documentation

- **[AUTHENTICATION_GUIDE.md](AUTHENTICATION_GUIDE.md)** - Complete auth system documentation
- **[API_DOCUMENTATION.txt](API_DOCUMENTATION.txt)** - API endpoint reference
- **[IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md)** - What was implemented and modified

---

## 🔐 Authentication Features

### Endpoints Implemented

#### 1. Register User
```bash
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "role": "DEVELOPER"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "email": "user@example.com",
  "id": 1,
  "role": "DEVELOPER",
  "message": "User registered successfully"
}
```

#### 2. Login User
```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "email": "user@example.com",
  "id": 1,
  "role": "DEVELOPER",
  "message": "Login successful"
}
```

### Use JWT Token

Include the token in Authorization header for authenticated requests:

```bash
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## 📁 Project Structure

```
backend/
├── src/main/java/com/master/backend/
│   ├── Application.java
│   ├── Controller/
│   │   └── AuthController.java          ✅ Register & Login endpoints
│   ├── Service/
│   │   └── AuthService.java             ✅ Authentication logic
│   ├── Model/
│   │   ├── User.java                    ✅ User entity with role
│   │   ├── Role.java                    (MANAGER, DEVELOPER)
│   │   └── Task.java
│   ├── DTO/
│   │   ├── LoginRequest.java            ✅ Login request payload
│   │   ├── RegisterRequest.java         ✅ Register request payload
│   │   ├── AuthResponse.java            ✅ Auth response with token
│   │   └── ErrorResponse.java           ✅ Error response format
│   ├── Repository/
│   │   └── UserRepository.java          (findByEmail method)
│   ├── Security/
│   │   ├── CustomUserDetailsService.java ✅ Load user from DB
│   │   ├── CustomUserDetails.java       ✅ Spring Security UserDetails
│   │   ├── JwtAuthFilter.java           (Validate JWT tokens)
│   │   └── ...
│   ├── Config/
│   │   ├── SecurityConfig.java          (Security configuration)
│   │   ├── WebConfig.java               (CORS configuration)
│   │   └── JwtAuthFilter.java
│   ├── Util/
│   │   └── JwtUtil.java                 (JWT token generation)
│   ├── Exception/
│   │   ├── ApiException.java
│   │   └── GlobalExceptionHandler.java  ✅ Centralized error handling
│   └── resources/
│       └── application.properties       (Configuration)
│
├── pom.xml                              ✅ Updated Lombok dependency
├── mvnw & mvnw.cmd                      (Maven wrapper)
│
├── AUTHENTICATION_GUIDE.md              📖 Complete auth guide
├── API_DOCUMENTATION.txt                📖 API reference
├── IMPLEMENTATION_SUMMARY.md            📖 What was implemented
├── .env.properties.example              📋 Configuration template
└── README.md                            📖 This file
```

---

## 🔑 Roles & Authorization

### Supported Roles
- **MANAGER** - Full admin access
- **DEVELOPER** - Regular user access

### Using @PreAuthorize

```java
@RestController
@RequestMapping("/api/tasks")
public class TaskController {
    
    @PostMapping
    @PreAuthorize("hasAnyRole('MANAGER', 'DEVELOPER')")
    public ResponseEntity<Task> createTask(@RequestBody Task task) {
        // All authenticated users can create tasks
    }
    
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('MANAGER')")
    public ResponseEntity<Void> deleteTask(@PathVariable Long id) {
        // Only managers can delete tasks
    }
}
```

---

## 🛡️ Security Implementation

✅ **Password Security**
- BCrypt hashing (10 rounds)
- Passwords never returned in API responses
- Password validation on login

✅ **JWT Security**
- HS256 signing algorithm
- Configurable token expiration
- Token validation on each request

✅ **Request Validation**
- Email format validation
- Password length validation (min 6 chars)
- Role validation
- @Valid annotations on request bodies

✅ **Error Handling**
- Consistent error response format
- Proper HTTP status codes
- Validation error details
- No sensitive information exposure

✅ **Stateless API**
- No server-side sessions
- No cookies
- Token-based authentication only

---

## 🧪 Testing the API

### Using cURL

**Register:**
```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"pass123","role":"DEVELOPER"}'
```

**Login:**
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"pass123"}'
```

**Authenticated Request:**
```bash
curl -H "Authorization: Bearer <token>" http://localhost:8080/api/tasks
```

### Using Postman

1. Import Postman collection or create requests manually
2. Register endpoint: POST `/api/auth/register`
3. Copy token from response
4. Create new request with Authorization header
5. Paste token as: `Bearer <token>`

---

## 📋 Database Schema

**Automatic Creation:**
- Tables are created automatically on first run
- Controlled by `spring.jpa.hibernate.ddl-auto=update`

**Users Table:**
```sql
CREATE TABLE users (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50)
);
```

---

## 🔄 API Response Codes

| Code | Scenario |
|------|----------|
| 200 | Login successful, token requested |
| 201 | User registered successfully |
| 400 | Missing/invalid fields, validation error |
| 401 | Invalid credentials, invalid/missing token |
| 409 | Email already registered |
| 500 | Server error |

---

## 📝 Configuration

### Environment Variables (.env.properties)

```properties
# Server
PORT=8080

# Database
DB_URL=jdbc:mysql://localhost:3306/task_manager
DB_USERNAME=root
DB_PASSWORD=your_password

# JWT
JWT_SECRET=your_32_character_minimum_secret_key_here
JWT_EXP=86400000  # 24 hours in milliseconds
```

### application.properties

Already configured to load from `.env.properties`:
```properties
spring.config.import=optional:file:.env.properties
```

---

## ✅ Completed Tasks

- ✅ User model with id, email, password, role fields
- ✅ Registration endpoint with email/password validation
- ✅ Login endpoint with password verification
- ✅ JWT token generation on successful authentication
- ✅ Role information included in responses
- ✅ Ready for @PreAuthorize decorators on endpoints
- ✅ BCrypt password encryption
- ✅ Global exception handling
- ✅ Input validation with error messages
- ✅ Stateless authentication
- ✅ Complete build success

---

## 📦 Dependencies

- Spring Boot 4.0.3 (Java 21)
- Spring Security
- Spring Data JPA
- MySQL Connector
- JWT (jjwt) 0.11.5
- Lombok 1.18.30
- Jakarta Persistence API
- Validation API

---

## 🎓 Next Steps

### Implement Task Management
```java
@RestController
@RequestMapping("/api/tasks")
public class TaskController {
    
    @PostMapping
    @PreAuthorize("hasAnyRole('MANAGER', 'DEVELOPER')")
    public ResponseEntity<Task> createTask(@RequestBody Task task) { }
    
    @GetMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<Task>> getTasks() { }
    
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('MANAGER')")
    public ResponseEntity<Void> deleteTask(@PathVariable Long id) { }
}
```

### Add Additional Features
- Refresh tokens
- Logout functionality
- Password reset
- User profile management
- Audit logging
- Rate limiting

---

## 📞 Support

For issues or questions:
1. Check **AUTHENTICATION_GUIDE.md** for detailed documentation
2. Review **API_DOCUMENTATION.txt** for endpoint details
3. See **IMPLEMENTATION_SUMMARY.md** for technical overview

---

## ⚠️ Security Checklist (Before Production)

- [ ] Change JWT_SECRET to a strong random value
- [ ] Set appropriate JWT_EXP based on security requirements
- [ ] Use environment variables for sensitive data
- [ ] Enable HTTPS/TLS for all API calls
- [ ] Implement rate limiting on auth endpoints
- [ ] Set up monitoring and logging
- [ ] Regular security updates
- [ ] Implement refresh token mechanism
- [ ] Add audit trails for auth events
- [ ] Use secrets vault (AWS/Azure/Vault)

---

## 📄 License

This project is part of the Task Manager application.

---

**Build Status:** ✅ SUCCESS
**Last Updated:** March 18, 2026
**Java Version:** 21
**Spring Boot:** 4.0.3


