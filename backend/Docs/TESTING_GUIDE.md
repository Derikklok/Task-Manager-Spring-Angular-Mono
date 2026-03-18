# Task Management API - Step-by-Step Testing Guide

## Prerequisites

- Spring Boot application running on http://localhost:8080
- A user account (register via /api/auth/register or login with existing credentials)
- Postman installed (optional, but recommended)
- cURL installed (on most systems)

---

## Testing Workflow

### Step 1: Start the Application

```bash
cd "C:\Users\User\Desktop\Task Manager\backend"
.\mvnw spring-boot:run
```

Wait for startup message: "Application started on port 8080"

---

### Step 2: Register/Login to Get JWT Token

#### Option A: Using cURL

**Register a new user:**
```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "testuser@example.com",
    "password": "password123",
    "role": "DEVELOPER"
  }'
```

**Expected Response (201 Created):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "email": "testuser@example.com",
  "id": 1,
  "role": "DEVELOPER",
  "message": "User registered successfully"
}
```

**Save the token:**
```bash
# Linux/Mac
TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

# Windows PowerShell
$token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

#### Option B: Using Postman

1. Open Postman
2. Create new POST request
3. URL: `http://localhost:8080/api/auth/register`
4. Headers: `Content-Type: application/json`
5. Body (raw JSON):
```json
{
  "email": "testuser@example.com",
  "password": "password123",
  "role": "DEVELOPER"
}
```
6. Click Send
7. Copy token from response
8. Create environment variable: `token` = (paste token)

---

### Step 3: Get All Tasks (Should be empty)

#### Using cURL:
```bash
curl -X GET http://localhost:8080/api/tasks \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json"
```

**Expected Response (200 OK):**
```json
[]
```
(Empty array since no tasks created yet)

#### Using Postman:
1. Create new GET request
2. URL: `{{base_url}}/api/tasks`
3. Authorization tab: 
   - Type: Bearer Token
   - Token: `{{token}}`
4. Send

---

### Step 4: Create First Task

#### Using cURL:
```bash
curl -X POST http://localhost:8080/api/tasks \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Write documentation",
    "description": "Create comprehensive API documentation",
    "status": "TODO"
  }'
```

**Expected Response (201 Created):**
```json
{
  "id": 1,
  "title": "Write documentation",
  "description": "Create comprehensive API documentation",
  "status": "TODO",
  "userId": 1,
  "userEmail": "testuser@example.com",
  "createdAt": "2026-03-18T15:30:00",
  "updatedAt": "2026-03-18T15:30:00"
}
```

**Save the task ID:**
```bash
TASK_ID="1"
```

#### Using Postman:
1. Create new POST request
2. URL: `{{base_url}}/api/tasks`
3. Authorization: Bearer Token `{{token}}`
4. Body (raw JSON):
```json
{
  "title": "Write documentation",
  "description": "Create comprehensive API documentation",
  "status": "TODO"
}
```
5. Send
6. Copy task ID from response, set `task_id` environment variable

---

### Step 5: Create More Tasks

Create at least 2 more tasks to test listing:

#### Task 2:
```bash
curl -X POST http://localhost:8080/api/tasks \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Code review",
    "description": null,
    "status": "TODO"
  }'
```

#### Task 3:
```bash
curl -X POST http://localhost:8080/api/tasks \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Deploy to production",
    "status": "TODO"
  }'
```

---

### Step 6: Get All Tasks

#### Using cURL:
```bash
curl -X GET http://localhost:8080/api/tasks \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json"
```

**Expected Response (200 OK):**
```json
[
  {
    "id": 3,
    "title": "Deploy to production",
    "description": null,
    "status": "TODO",
    "userId": 1,
    "userEmail": "testuser@example.com",
    "createdAt": "2026-03-18T15:35:00",
    "updatedAt": "2026-03-18T15:35:00"
  },
  {
    "id": 2,
    "title": "Code review",
    "description": null,
    "status": "TODO",
    "userId": 1,
    "userEmail": "testuser@example.com",
    "createdAt": "2026-03-18T15:33:00",
    "updatedAt": "2026-03-18T15:33:00"
  },
  {
    "id": 1,
    "title": "Write documentation",
    "description": "Create comprehensive API documentation",
    "status": "TODO",
    "userId": 1,
    "userEmail": "testuser@example.com",
    "createdAt": "2026-03-18T15:30:00",
    "updatedAt": "2026-03-18T15:30:00"
  }
]
```

Note: Sorted by creation date (newest first)

---

### Step 7: Get Specific Task by ID

#### Using cURL:
```bash
curl -X GET http://localhost:8080/api/tasks/1 \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json"
```

**Expected Response (200 OK):**
```json
{
  "id": 1,
  "title": "Write documentation",
  "description": "Create comprehensive API documentation",
  "status": "TODO",
  "userId": 1,
  "userEmail": "testuser@example.com",
  "createdAt": "2026-03-18T15:30:00",
  "updatedAt": "2026-03-18T15:30:00"
}
```

---

### Step 8: Update Task (Full Update with PUT)

#### Using cURL:
```bash
curl -X PUT http://localhost:8080/api/tasks/1 \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Documentation - Updated",
    "description": "Write comprehensive API documentation with examples",
    "status": "IN_PROGRESS"
  }'
```

**Expected Response (200 OK):**
```json
{
  "id": 1,
  "title": "Documentation - Updated",
  "description": "Write comprehensive API documentation with examples",
  "status": "IN_PROGRESS",
  "userId": 1,
  "userEmail": "testuser@example.com",
  "createdAt": "2026-03-18T15:30:00",
  "updatedAt": "2026-03-18T15:45:00"
}
```

**Notice:** `updatedAt` has changed, but `createdAt` remains the same

---

### Step 9: Partial Update Task (PATCH)

#### Test 1 - Update only status:
```bash
curl -X PATCH http://localhost:8080/api/tasks/2 \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"status": "COMPLETED"}'
```

**Expected Response (200 OK):**
```json
{
  "id": 2,
  "title": "Code review",
  "description": null,
  "status": "COMPLETED",
  "userId": 1,
  "userEmail": "testuser@example.com",
  "createdAt": "2026-03-18T15:33:00",
  "updatedAt": "2026-03-18T15:50:00"
}
```

#### Test 2 - Update only title:
```bash
curl -X PATCH http://localhost:8080/api/tasks/3 \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title": "Deploy to staging first"}'
```

#### Test 3 - Update multiple fields:
```bash
curl -X PATCH http://localhost:8080/api/tasks/1 \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "COMPLETED",
    "description": "Documentation completed with all examples"
  }'
```

---

### Step 10: Delete Task

#### Using cURL:
```bash
curl -X DELETE http://localhost:8080/api/tasks/3 \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json"
```

**Expected Response (204 No Content):**
```
(Empty body, just status 204)
```

#### Verify deletion:
```bash
curl -X GET http://localhost:8080/api/tasks/3 \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json"
```

**Expected Response (404 Not Found):**
```json
{
  "status": 404,
  "message": "Task not found",
  "timestamp": "2026-03-18T15:55:00"
}
```

---

## Error Testing

### Test 1: Missing Title
```bash
curl -X POST http://localhost:8080/api/tasks \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"description": "No title here"}'
```

**Expected Response (400 Bad Request):**
```json
{
  "status": 400,
  "errors": {
    "title": "Title is required"
  },
  "timestamp": "2026-03-18T15:56:00"
}
```

### Test 2: Title Too Long
```bash
curl -X POST http://localhost:8080/api/tasks \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title": "'$(printf 'a%.0s' {1..300}}'"}'
```

**Expected Response (400 Bad Request):**
```json
{
  "status": 400,
  "errors": {
    "title": "Title must be between 1 and 255 characters"
  },
  "timestamp": "2026-03-18T15:57:00"
}
```

### Test 3: Invalid Status
```bash
curl -X POST http://localhost:8080/api/tasks \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Task",
    "status": "INVALID_STATUS"
  }'
```

**Expected Response (400 Bad Request):**
```json
{
  "status": 400,
  "message": "Invalid status. Must be TODO, IN_PROGRESS, or COMPLETED",
  "timestamp": "2026-03-18T15:58:00"
}
```

### Test 4: Missing Authorization
```bash
curl -X GET http://localhost:8080/api/tasks
```

**Expected Response (401 Unauthorized):**
```json
{
  "status": 401,
  "message": "Unauthorized",
  "timestamp": "2026-03-18T15:59:00"
}
```

### Test 5: Access Other User's Task
1. Create task with User A
2. Get token for User B
3. Try to access User A's task:

```bash
curl -X GET http://localhost:8080/api/tasks/1 \
  -H "Authorization: Bearer $TOKEN_USER_B" \
  -H "Content-Type: application/json"
```

**Expected Response (404 Not Found):**
```json
{
  "status": 404,
  "message": "Task not found",
  "timestamp": "2026-03-18T16:00:00"
}
```

---

## Testing Summary Checklist

- [ ] User registration successful
- [ ] JWT token received
- [ ] Get all tasks (empty list)
- [ ] Create task (status 201)
- [ ] Get all tasks (contains created task)
- [ ] Get specific task by ID
- [ ] Update task fully (PUT)
- [ ] createdAt unchanged after update
- [ ] updatedAt changed after update
- [ ] Partial update (PATCH) - status only
- [ ] Partial update (PATCH) - title only
- [ ] Partial update (PATCH) - multiple fields
- [ ] Delete task (status 204)
- [ ] Get deleted task returns 404
- [ ] Missing title validation
- [ ] Invalid status validation
- [ ] Missing authorization header
- [ ] User isolation (can't access other's task)

---

## Performance Testing

### Bulk Create Tasks
```bash
for i in {1..10}; do
  curl -X POST http://localhost:8080/api/tasks \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" \
    -d '{"title":"Task '$i'","description":"Description '$i'","status":"TODO"}'
done
```

### Time Response
```bash
time curl -X GET http://localhost:8080/api/tasks \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json"
```

Expected: < 200ms for list with 10 items

---

## Using Postman Collection

1. **Import Collection**
   - File → Import
   - Select `TaskManagerAPI.postman_collection.json`

2. **Setup Environment**
   - Set `base_url` = http://localhost:8080
   - Run "Register User" or "Login User" to get token (auto-sets {{token}})

3. **Execute Tests in Order**
   - Get All Tasks (should be empty)
   - Create Task (auto-sets {{task_id}})
   - Get All Tasks (should show created task)
   - Get Task by ID
   - Update Task (PUT)
   - Partial Update Task (PATCH)
   - Delete Task

4. **Verify Results**
   - Response status code should match expected
   - Response body format should match documentation

---

## Tips & Tricks

1. **Save token in environment variable for reuse**
2. **Use task_id from create response for subsequent operations**
3. **Test PATCH with different field combinations**
4. **Verify timestamps change only on updates**
5. **Test error cases systematically**
6. **Use Postman Tests tab to automate assertions**
7. **Monitor response times for performance**


