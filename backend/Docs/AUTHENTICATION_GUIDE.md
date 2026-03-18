# Task Manager - Spring Boot Authentication Implementation Guide

## ✅ Implementation Complete

Your Spring Boot Task Manager application now has complete JWT-based authentication with user registration and login functionality. Below is a comprehensive guide to understand and use the system.

---

## 📋 Project Structure

### New Files Created:
1. **DTOs (Data Transfer Objects)**
   - `LoginRequest.DTO` - Request payload for login
   - `RegisterRequest.DTO` - Request payload for registration
   - `AuthResponse.DTO` - Response payload containing JWT token and user info
   
2. **Services**
   - `AuthService.java` - Core business logic for authentication
   
3. **Controllers**
   - `AuthController.java` - REST API endpoints
   
4. **Exception Handling**
   - `GlobalExceptionHandler.java` - Centralized exception handling
   
5. **Security**
   - `CustomUserDetailsService.java` - Loads user details from database
   - `CustomUserDetails.java` - Implements Spring's UserDetails interface

---

## 🔐 API Endpoints

### 1. Register Endpoint
**POST** `/api/auth/register`

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "role": "DEVELOPER"
}
```

**Response (201 Created):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "email": "user@example.com",
  "id": 1,
  "role": "DEVELOPER",
  "message": "User registered successfully"
}
```

**Validation Rules:**
- Email must be valid and unique
- Password must be at least 6 characters
- Role must be either "MANAGER" or "DEVELOPER" (case-insensitive)

**Error Responses:**
- `409 Conflict` - Email already registered
- `400 Bad Request` - Invalid input data

---

### 2. Login Endpoint
**POST** `/api/auth/login`

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response (200 OK):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "email": "user@example.com",
  "id": 1,
  "role": "DEVELOPER",
  "message": "Login successful"
}
```

**Error Responses:**
- `401 Unauthorized` - Invalid email or password
- `400 Bad Request` - Missing or invalid input

---

## 🔑 JWT Token Details

**Token Structure:**
The JWT token contains:
- **Subject (sub):** User's email
- **Issued At (iat):** Token creation time
- **Expiration (exp):** Token expiration time

**Token Usage:**
Include the token in the `Authorization` header for authenticated requests:
```
Authorization: Bearer <your_jwt_token>
```

**Example:**
```bash
curl -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
     http://localhost:8080/api/tasks
```

---

## 👤 User Model

```java
@Entity
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(unique = true, nullable = false)
    private String email;
    
    @Column(nullable = false)
    private String password;  // Stored as BCrypt hash
    
    @Enumerated(EnumType.STRING)
    private Role role;  // MANAGER or DEVELOPER
}
```

---

## 🛡️ Security Features

### Password Encryption
- Uses **BCrypt** with default strength (10 rounds)
- Passwords are never stored in plain text
- Password validation uses Spring's `PasswordEncoder`

### JWT Configuration
- Algorithm: HS256 (HMAC with SHA-256)
- Secret Key: Set via `JWT_SECRET` environment variable
- Expiration: Configurable via `JWT_EXP` environment variable (in milliseconds)

### Security Filter Chain
- CSRF protection disabled (stateless API)
- CORS enabled with default settings
- Session management: STATELESS (no server-side sessions)
- Auth endpoints are public
- All other endpoints require valid JWT token

### Method-Level Security
The application has `@EnableMethodSecurity` enabled, allowing:
```java
@PreAuthorize("hasRole('MANAGER')")
public void managerOnlyMethod() { }

@PreAuthorize("hasRole('DEVELOPER')")
public void developerMethod() { }
```

---

## ⚙️ Environment Configuration

Create a `.env.properties` file in the project root with:

```properties
# Server Configuration
PORT=8080

# Database Configuration
DB_URL=jdbc:mysql://localhost:3306/task_manager
DB_USERNAME=root
DB_PASSWORD=your_mysql_password

# JWT Configuration
JWT_SECRET=your_very_secure_jwt_secret_key_at_least_32_characters_long_for_hs256
JWT_EXP=86400000
```

**Note:** 
- `JWT_EXP` is in milliseconds (86400000 = 24 hours)
- `JWT_SECRET` must be at least 32 characters for HS256
- Keep `JWT_SECRET` secure in production

---

## 🗄️ Database Setup

The application uses MySQL with JPA/Hibernate. 

**Automatic Schema Creation:**
- Set `spring.jpa.hibernate.ddl-auto=update` in `application.properties`
- Tables are created automatically on first run

**Database Table (users):**
```sql
CREATE TABLE users (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50)
);
```

---

## 🚀 Running the Application

### Prerequisites
- Java 21+
- MySQL 8.0+
- Maven 3.6+

### Steps

1. **Start MySQL Server**
   ```bash
   mysql -u root -p
   # Create database
   CREATE DATABASE task_manager;
   ```

2. **Configure Environment Variables**
   - Create `.env.properties` with your configuration (see above)

3. **Build the Project**
   ```bash
   cd "C:\Users\User\Desktop\Task Manager\backend"
   .\mvnw clean package
   ```

4. **Run the Application**
   ```bash
   .\mvnw spring-boot:run
   # Or run the JAR directly
   java -jar target/backend-0.0.1-SNAPSHOT.jar
   ```

5. **Application will start on** `http://localhost:8080`

---

## 🧪 Testing the API

### Using cURL

**Register a new user:**
```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123",
    "role": "DEVELOPER"
  }'
```

**Login:**
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

**Use token for authenticated requests:**
```bash
curl -H "Authorization: Bearer <token>" \
     http://localhost:8080/api/tasks
```

### Using Postman

1. **Register Request:**
   - Method: POST
   - URL: `http://localhost:8080/api/auth/register`
   - Body (JSON):
     ```json
     {
       "email": "user@example.com",
       "password": "password123",
       "role": "DEVELOPER"
     }
     ```

2. **Copy token from response**

3. **Authenticated Request:**
   - Method: GET/POST/etc.
   - URL: `http://localhost:8080/api/tasks` (or any protected endpoint)
   - Headers → Add new header:
     - Key: `Authorization`
     - Value: `Bearer <paste_token_here>`

---

## 🔄 Authentication Flow

```
1. User Registration
   ├─ POST /api/auth/register
   ├─ Validate input
   ├─ Check if email exists
   ├─ Encrypt password with BCrypt
   ├─ Save user to database
   ├─ Generate JWT token
   └─ Return token + user info

2. User Login
   ├─ POST /api/auth/login
   ├─ Find user by email
   ├─ Verify password with BCrypt
   ├─ Generate JWT token
   └─ Return token + user info

3. Authenticated Request
   ├─ Client sends request with Authorization header
   ├─ JwtAuthFilter extracts token
   ├─ Token is validated
   ├─ Username is extracted
   ├─ User details are loaded
   ├─ User is authenticated in SecurityContext
   └─ Request proceeds to controller
```

---

## 🐛 Error Handling

All errors are handled globally via `GlobalExceptionHandler`:

**Error Response Format:**
```json
{
  "status": 400,
  "message": "Error description",
  "timestamp": "2026-03-18T13:00:00"
}
```

**Common Errors:**

| Status | Scenario |
|--------|----------|
| 400 | Missing required fields, invalid email format, password < 6 chars |
| 401 | Invalid email/password, missing/invalid JWT token |
| 409 | Email already registered |
| 500 | Server error |

---

## 📝 Next Steps

To extend this authentication system:

1. **Task Endpoints** - Create endpoints with `@PreAuthorize` for role-based access
2. **Refresh Tokens** - Implement refresh token mechanism
3. **User Profile** - Add endpoint to update user info
4. **Password Reset** - Implement email-based password reset
5. **Audit Logging** - Log authentication attempts
6. **Rate Limiting** - Add request rate limiting for auth endpoints

---

## 📚 Code Examples

### Creating a Protected Endpoint

```java
@RestController
@RequestMapping("/api/tasks")
public class TaskController {
    
    @PostMapping
    @PreAuthorize("hasAnyRole('MANAGER', 'DEVELOPER')")
    public ResponseEntity<Task> createTask(@RequestBody CreateTaskRequest request) {
        // Implementation
    }
    
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('MANAGER')")
    public ResponseEntity<Void> deleteTask(@PathVariable Long id) {
        // Only managers can delete
    }
}
```

### Getting Current User Info

```java
@GetMapping("/profile")
public ResponseEntity<UserDTO> getCurrentUser(Authentication authentication) {
    String email = authentication.getName();
    // Get user details
}
```

---

## ✨ Summary

✅ **Complete JWT Authentication**
- Registration with validation
- Secure login with password encryption
- JWT token generation and validation
- Role-based access control (MANAGER/DEVELOPER)
- Centralized exception handling
- Automatic database schema creation

✅ **Ready for Production**
- BCrypt password hashing
- Stateless security configuration
- CORS enabled
- CSRF disabled (stateless API)
- Proper error handling and validation

All files are compiled and the project builds successfully! 🎉


