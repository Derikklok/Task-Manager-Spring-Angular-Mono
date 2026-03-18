# Task Management Implementation Guide

## Overview

Complete implementation of task management CRUD operations with the following features:
- Full CRUD operations (Create, Read, Update, Delete)
- PATCH endpoint for partial updates
- User-isolated tasks (users can only manage their own tasks)
- Automatic timestamps (createdAt, updatedAt)
- Task status workflow (TODO, IN_PROGRESS, COMPLETED)
- Comprehensive validation
- JWT authentication required

---

## 📁 Files Created

### DTOs (Data Transfer Objects)

1. **CreateTaskRequest.DTO**
   - Used for POST requests (creating new tasks)
   - Fields: title (required), description (optional), status (optional)
   - Validation: title required (1-255 chars), description max 2000 chars

2. **UpdateTaskRequest.DTO**
   - Used for PUT requests (full updates)
   - Fields: title (required), description (required), status (required)
   - All fields must be provided for PUT

3. **PatchTaskRequest.DTO**
   - Used for PATCH requests (partial updates)
   - Fields: title (optional), description (optional), status (optional)
   - All fields are optional - only provided fields are updated

4. **TaskResponse.DTO**
   - Used in all responses
   - Contains: id, title, description, status, userId, userEmail, createdAt, updatedAt
   - Automatically converts from Task entity

### Models

**Task.java** (Enhanced)
- Added ManyToOne relationship with User
- Added `updatedAt` field for tracking last modification
- Added `@PrePersist` and `@PreUpdate` callbacks for auto-timestamps
- Changed table name to lowercase "tasks"
- Added validation constraints on fields
- Status defaults to "TODO"

### Repository

**TaskRepository.java**
- `findByUserOrderByCreatedAtDesc(User user)` - Get all user's tasks
- `findByIdAndUser(Long id, User user)` - Get specific task (ensures ownership)
- `existsByIdAndUser(Long id, User user)` - Check task ownership

### Service

**TaskService.java**
- `getAllTasks(String userEmail)` - Get all tasks for user
- `getTaskById(Long id, String userEmail)` - Get specific task
- `createTask(CreateTaskRequest, String userEmail)` - Create new task
- `updateTask(Long id, UpdateTaskRequest, String userEmail)` - Full update
- `patchTask(Long id, PatchTaskRequest, String userEmail)` - Partial update
- `deleteTask(Long id, String userEmail)` - Delete task

Features:
- Automatic user lookup from email
- Validation of status values
- User isolation (enforced at query level)
- Transactional operations

### Controller

**TaskController.java**
- All endpoints protected with `@PreAuthorize("isAuthenticated()")`
- GET /api/tasks - Get all tasks
- GET /api/tasks/{id} - Get task by ID
- POST /api/tasks - Create task
- PUT /api/tasks/{id} - Full update
- PATCH /api/tasks/{id} - Partial update
- DELETE /api/tasks/{id} - Delete task

Features:
- Automatic authentication extraction
- Proper HTTP status codes (200, 201, 204, 400, 401, 404)
- Validation using `@Valid` annotation
- Returns appropriate response entities

---

## 🔄 Request/Response Examples

### Create Task
```
POST /api/tasks
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Complete documentation",
  "description": "Write API documentation",
  "status": "TODO"
}

Response: 201 Created
{
  "id": 1,
  "title": "Complete documentation",
  "description": "Write API documentation",
  "status": "TODO",
  "userId": 5,
  "userEmail": "user@example.com",
  "createdAt": "2026-03-18T15:20:00",
  "updatedAt": "2026-03-18T15:20:00"
}
```

### Update Task (PUT)
```
PUT /api/tasks/1
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Updated title",
  "description": "Updated description",
  "status": "IN_PROGRESS"
}

Response: 200 OK
{
  "id": 1,
  "title": "Updated title",
  "description": "Updated description",
  "status": "IN_PROGRESS",
  "userId": 5,
  "userEmail": "user@example.com",
  "createdAt": "2026-03-18T15:20:00",
  "updatedAt": "2026-03-18T15:25:00"
}
```

### Partial Update (PATCH)
```
PATCH /api/tasks/1
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "COMPLETED"
}

Response: 200 OK
{
  "id": 1,
  "title": "Updated title",
  "description": "Updated description",
  "status": "COMPLETED",
  "userId": 5,
  "userEmail": "user@example.com",
  "createdAt": "2026-03-18T15:20:00",
  "updatedAt": "2026-03-18T15:30:00"
}
```

### Delete Task
```
DELETE /api/tasks/1
Authorization: Bearer <token>

Response: 204 No Content
(Empty body)
```

---

## 🔐 Security Features

### User Isolation
- Users can only access their own tasks
- Enforced at repository query level
- Service layer validates ownership
- `findByIdAndUser()` returns Optional (empty if not found)

### Authentication
- All endpoints require `@PreAuthorize("isAuthenticated()")`
- JWT token extracted from Authorization header
- User email extracted from token subject

### Input Validation
- Title: Required, 1-255 characters
- Description: Optional, max 2000 characters
- Status: Optional on create/patch, required on update
- Status values: TODO, IN_PROGRESS, COMPLETED only

### Data Integrity
- Transactional operations via `@Transactional`
- Automatic timestamps (createdAt never updated)
- Foreign key constraint with User

---

## 🧪 Testing Checklist

### Create Endpoint
- [ ] Create with all fields
- [ ] Create with minimal fields (title only)
- [ ] Create with invalid status
- [ ] Create with long title (>255 chars) - should fail
- [ ] Create with long description (>2000 chars) - should fail
- [ ] Create without authentication - should fail

### Read Endpoints
- [ ] Get all tasks (should only return user's tasks)
- [ ] Get specific task that user owns
- [ ] Get specific task that user doesn't own - should fail
- [ ] Get non-existent task - should fail

### Update (PUT) Endpoint
- [ ] Update all fields
- [ ] Update with invalid status
- [ ] Update task owned by another user - should fail
- [ ] Update non-existent task - should fail

### Patch Endpoint
- [ ] Update only title
- [ ] Update only status
- [ ] Update only description
- [ ] Update multiple fields
- [ ] Patch with invalid status
- [ ] Patch task owned by another user - should fail
- [ ] Patch non-existent task - should fail

### Delete Endpoint
- [ ] Delete existing task
- [ ] Delete already deleted task - should fail
- [ ] Delete task owned by another user - should fail

---

## 📊 Database Schema

### Tasks Table
```sql
CREATE TABLE tasks (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(50) NOT NULL DEFAULT 'TODO',
    user_id BIGINT NOT NULL,
    created_at DATETIME NOT NULL,
    updated_at DATETIME NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

---

## 🔄 Workflow Diagram

```
User Login
    ↓
Get JWT Token
    ↓
Create Task (POST)
    ↓
View All Tasks (GET /api/tasks)
    ↓
View Specific Task (GET /api/tasks/{id})
    ↓
Update Task (PUT /api/tasks/{id})
    ↓
Partial Update (PATCH /api/tasks/{id})
    ↓
Delete Task (DELETE /api/tasks/{id})
```

---

## 🚀 Next Steps

### Current Implementation
- ✅ Full CRUD operations
- ✅ User isolation
- ✅ Partial updates (PATCH)
- ✅ Automatic timestamps
- ✅ Status workflow

### Future Enhancements
- [ ] Task filtering by status
- [ ] Task search by title/description
- [ ] Pagination for large task lists
- [ ] Task priorities (Low, Medium, High)
- [ ] Task due dates with reminders
- [ ] Task categories/tags
- [ ] Task assignment to other users
- [ ] Task comments and activity log
- [ ] Bulk operations (update/delete multiple)
- [ ] Export tasks to CSV/PDF

---

## 📝 Important Notes

1. **Timestamps**: Always in UTC, format: YYYY-MM-DDTHH:mm:ss
2. **Status**: Case-sensitive, use exact values: TODO, IN_PROGRESS, COMPLETED
3. **User Isolation**: Happens at query level, not just controller validation
4. **Transactional**: All service operations are transactional
5. **Cascade Delete**: Tasks are deleted if user is deleted
6. **No Soft Deletes**: Tasks are permanently deleted


