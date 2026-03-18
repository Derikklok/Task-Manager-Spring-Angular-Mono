# Task Management API - Complete Documentation

## Overview

The Task Management API provides comprehensive CRUD (Create, Read, Update, Delete) operations for managing tasks. All endpoints require authentication and users can only access their own tasks.

---

## 🔐 Authentication

All task endpoints require a valid JWT token in the Authorization header:

```
Authorization: Bearer <jwt_token>
```

Users will automatically have access to only their own tasks. The user information is extracted from the JWT token.

---

## 📋 Task Status Values

Tasks can have one of three statuses:
- **TODO** - Task is not yet started
- **IN_PROGRESS** - Task is currently being worked on
- **COMPLETED** - Task is finished

---

## 🔗 API Endpoints

### 1. Get All Tasks
**Endpoint:** `GET /api/tasks`

**Description:** Retrieve all tasks for the authenticated user, sorted by creation date (newest first).

**Authentication:** Required ✅

**Request Headers:**
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Request Body:** None

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "title": "Complete project documentation",
    "description": "Write comprehensive API documentation",
    "status": "IN_PROGRESS",
    "userId": 5,
    "userEmail": "user@example.com",
    "createdAt": "2026-03-18T10:30:00",
    "updatedAt": "2026-03-18T14:45:00"
  },
  {
    "id": 2,
    "title": "Code review",
    "description": null,
    "status": "TODO",
    "userId": 5,
    "userEmail": "user@example.com",
    "createdAt": "2026-03-18T09:15:00",
    "updatedAt": "2026-03-18T09:15:00"
  }
]
```

**Error Responses:**
- `401 Unauthorized` - Missing or invalid token
- `500 Internal Server Error` - Server error

**Example with cURL:**
```bash
curl -X GET http://localhost:8080/api/tasks \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json"
```

---

### 2. Get Task by ID
**Endpoint:** `GET /api/tasks/{id}`

**Description:** Retrieve a specific task by its ID. Users can only access their own tasks.

**Authentication:** Required ✅

**Path Parameters:**
- `id` (Long) - Task ID

**Request Headers:**
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Response (200 OK):**
```json
{
  "id": 1,
  "title": "Complete project documentation",
  "description": "Write comprehensive API documentation",
  "status": "IN_PROGRESS",
  "userId": 5,
  "userEmail": "user@example.com",
  "createdAt": "2026-03-18T10:30:00",
  "updatedAt": "2026-03-18T14:45:00"
}
```

**Error Responses:**
- `401 Unauthorized` - Missing or invalid token
- `404 Not Found` - Task not found or belongs to another user
- `500 Internal Server Error` - Server error

**Example with cURL:**
```bash
curl -X GET http://localhost:8080/api/tasks/1 \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json"
```

---

### 3. Create Task
**Endpoint:** `POST /api/tasks`

**Description:** Create a new task for the authenticated user.

**Authentication:** Required ✅

**Request Headers:**
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "title": "Complete project documentation",
  "description": "Write comprehensive API documentation",
  "status": "TODO"
}
```

**Request Field Validation:**
- `title` (String, Required) - Task title, 1-255 characters
- `description` (String, Optional) - Task description, max 2000 characters
- `status` (String, Optional) - Task status (TODO, IN_PROGRESS, COMPLETED). Defaults to TODO if not provided

**Response (201 Created):**
```json
{
  "id": 3,
  "title": "Complete project documentation",
  "description": "Write comprehensive API documentation",
  "status": "TODO",
  "userId": 5,
  "userEmail": "user@example.com",
  "createdAt": "2026-03-18T15:20:00",
  "updatedAt": "2026-03-18T15:20:00"
}
```

**Error Responses:**
- `400 Bad Request` - Invalid input:
  ```json
  {
    "status": 400,
    "errors": {
      "title": "Title is required",
      "description": "Description must not exceed 2000 characters"
    },
    "timestamp": "2026-03-18T15:20:00"
  }
  ```
- `401 Unauthorized` - Missing or invalid token
- `500 Internal Server Error` - Server error

**Example with cURL:**
```bash
curl -X POST http://localhost:8080/api/tasks \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Complete project documentation",
    "description": "Write comprehensive API documentation",
    "status": "TODO"
  }'
```

---

### 4. Update Task (Full Update)
**Endpoint:** `PUT /api/tasks/{id}`

**Description:** Completely update a task. All fields must be provided. Use PATCH for partial updates.

**Authentication:** Required ✅

**Path Parameters:**
- `id` (Long) - Task ID

**Request Headers:**
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "title": "Updated task title",
  "description": "Updated description",
  "status": "IN_PROGRESS"
}
```

**Request Field Validation:**
- `title` (String, Required) - Task title, 1-255 characters
- `description` (String, Required) - Task description, max 2000 characters
- `status` (String, Required) - Task status (TODO, IN_PROGRESS, COMPLETED)

**Response (200 OK):**
```json
{
  "id": 1,
  "title": "Updated task title",
  "description": "Updated description",
  "status": "IN_PROGRESS",
  "userId": 5,
  "userEmail": "user@example.com",
  "createdAt": "2026-03-18T10:30:00",
  "updatedAt": "2026-03-18T15:25:00"
}
```

**Error Responses:**
- `400 Bad Request` - Invalid input or missing required fields
- `401 Unauthorized` - Missing or invalid token
- `404 Not Found` - Task not found or belongs to another user
- `500 Internal Server Error` - Server error

**Example with cURL:**
```bash
curl -X PUT http://localhost:8080/api/tasks/1 \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Updated task title",
    "description": "Updated description",
    "status": "IN_PROGRESS"
  }'
```

---

### 5. Partial Update Task (PATCH)
**Endpoint:** `PATCH /api/tasks/{id}`

**Description:** Partially update a task. Only provided fields are updated, others remain unchanged. Ideal for updating single properties without affecting the rest.

**Authentication:** Required ✅

**Path Parameters:**
- `id` (Long) - Task ID

**Request Headers:**
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Request Body Examples:**

**Example 1 - Update only status:**
```json
{
  "status": "COMPLETED"
}
```

**Example 2 - Update title and description:**
```json
{
  "title": "New title",
  "description": "New description"
}
```

**Example 3 - Update all fields:**
```json
{
  "title": "Updated title",
  "description": "Updated description",
  "status": "IN_PROGRESS"
}
```

**Request Field Validation:**
- `title` (String, Optional) - Task title, 1-255 characters
- `description` (String, Optional) - Task description, max 2000 characters
- `status` (String, Optional) - Task status (TODO, IN_PROGRESS, COMPLETED)

**Response (200 OK):**
```json
{
  "id": 1,
  "title": "Complete project documentation",
  "description": "Write comprehensive API documentation",
  "status": "COMPLETED",
  "userId": 5,
  "userEmail": "user@example.com",
  "createdAt": "2026-03-18T10:30:00",
  "updatedAt": "2026-03-18T15:30:00"
}
```

**Error Responses:**
- `400 Bad Request` - Invalid input (e.g., invalid status value)
- `401 Unauthorized` - Missing or invalid token
- `404 Not Found` - Task not found or belongs to another user
- `500 Internal Server Error` - Server error

**Example with cURL:**
```bash
# Update only status
curl -X PATCH http://localhost:8080/api/tasks/1 \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{"status": "COMPLETED"}'

# Update only title
curl -X PATCH http://localhost:8080/api/tasks/1 \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{"title": "New title"}'
```

---

### 6. Delete Task
**Endpoint:** `DELETE /api/tasks/{id}`

**Description:** Delete a task. This action is permanent and cannot be undone.

**Authentication:** Required ✅

**Path Parameters:**
- `id` (Long) - Task ID

**Request Headers:**
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Request Body:** None

**Response (204 No Content):** Empty response body

**Error Responses:**
- `401 Unauthorized` - Missing or invalid token
- `404 Not Found` - Task not found or belongs to another user
- `500 Internal Server Error` - Server error

**Example with cURL:**
```bash
curl -X DELETE http://localhost:8080/api/tasks/1 \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json"
```

---

## 📊 HTTP Status Codes

| Code | Meaning | Scenario |
|------|---------|----------|
| 200 | OK | Successfully retrieved or updated resource |
| 201 | Created | Task successfully created |
| 204 | No Content | Task successfully deleted |
| 400 | Bad Request | Invalid input or missing required fields |
| 401 | Unauthorized | Missing or invalid JWT token |
| 404 | Not Found | Task not found or belongs to another user |
| 500 | Internal Server Error | Server error |

---

## 🔑 Key Features

### 1. User Isolation
- Users can only view and manage their own tasks
- The system automatically associates tasks with the authenticated user
- Attempting to access another user's task returns 404 Not Found

### 2. Automatic Timestamps
- `createdAt` - Set automatically when task is created, never updated
- `updatedAt` - Updated automatically whenever task is modified

### 3. Status Management
Only three status values are allowed:
- **TODO** - Default status for new tasks
- **IN_PROGRESS** - Task is being worked on
- **COMPLETED** - Task is finished

Attempting to set an invalid status returns a 400 Bad Request error.

### 4. PUT vs PATCH

**PUT (Full Update)**
- Requires all fields
- Replaces entire resource
- Use when you want to update all properties
- Safer when you have the complete current state

**PATCH (Partial Update)**
- Optional fields
- Only updates provided fields
- Use when you want to update just one or few properties
- Reduces data transfer and complexity

---

## 💻 Postman Testing Guide

### 1. Create Collection Variables

In Postman, create these variables for easier testing:

| Variable | Value |
|----------|-------|
| base_url | http://localhost:8080 |
| auth_token | (your JWT token from login) |
| task_id | (task ID to test with) |

### 2. Setup Authorization

For each request, in the "Authorization" tab:
- Type: Bearer Token
- Token: {{auth_token}}

Or add to "Headers" tab:
```
Authorization: Bearer {{auth_token}}
```

### 3. Test Workflow

1. **Login** to get JWT token
2. **Get All Tasks** - See existing tasks
3. **Create Task** - Create a new task
4. **Get Task by ID** - Retrieve the created task
5. **Update Task (PUT)** - Fully update the task
6. **Patch Task** - Partially update the task
7. **Delete Task** - Delete the task

---

## 🚀 Quick Reference

```bash
# Login
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'

# Get all tasks
curl -X GET http://localhost:8080/api/tasks \
  -H "Authorization: Bearer $TOKEN"

# Create task
curl -X POST http://localhost:8080/api/tasks \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"My Task","description":"Description","status":"TODO"}'

# Update task (PUT)
curl -X PUT http://localhost:8080/api/tasks/1 \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"Updated","description":"Desc","status":"IN_PROGRESS"}'

# Partial update task (PATCH)
curl -X PATCH http://localhost:8080/api/tasks/1 \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"status":"COMPLETED"}'

# Delete task
curl -X DELETE http://localhost:8080/api/tasks/1 \
  -H "Authorization: Bearer $TOKEN"
```

---

## ⚠️ Common Errors and Solutions

### 401 Unauthorized
**Problem:** "Missing or invalid token"
**Solution:** 
- Ensure you have a valid JWT token from login
- Token may have expired (default: 24 hours)
- Login again to get a new token

### 404 Not Found
**Problem:** "Task not found"
**Solution:**
- Task may belong to another user
- Task ID may be incorrect
- Task may have been deleted

### 400 Bad Request
**Problem:** "Invalid input"
**Solution:**
- Check that all required fields are provided
- Validate field lengths (title: 1-255, description: 0-2000)
- Status must be one of: TODO, IN_PROGRESS, COMPLETED

### Invalid Status
**Problem:** "Invalid status. Must be TODO, IN_PROGRESS, or COMPLETED"
**Solution:**
- Use exact case: `TODO`, `IN_PROGRESS`, `COMPLETED`
- Don't use lowercase or other variations

---

## 📈 Performance Tips

1. **Use PATCH for minor updates** - Reduces data transfer
2. **Sort results client-side if needed** - Tasks are returned newest first
3. **Implement pagination** - For large task lists (future enhancement)
4. **Cache task data** - On client-side to reduce API calls

---

## 🔒 Security Considerations

1. **Authentication Required** - All endpoints require valid JWT
2. **User Isolation** - Automatic, enforced at service layer
3. **Input Validation** - All inputs validated for type and length
4. **SQL Injection Prevention** - Using parameterized queries via JPA
5. **No Sensitive Data** - Passwords never returned in responses


