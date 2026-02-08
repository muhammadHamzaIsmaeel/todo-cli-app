# API Contract: Task Management Endpoints

**Feature**: Todo Full-Stack Web Application (Phase II)
**Date**: 2026-01-05
**Version**: 1.0

## Overview

This document defines the API contract for task management endpoints in the Todo Full-Stack Web Application. The API follows REST principles and requires JWT authentication for all endpoints.

## Base URL

`/api/v1` (version may change in future releases)

## Authentication

All endpoints (except authentication endpoints) require a valid JWT token in the Authorization header:

```
Authorization: Bearer <jwt-token>
```

## Common Response Format

### Success Response
```json
{
  "success": true,
  "data": { /* response data */ },
  "message": "Optional descriptive message"
}
```

### Error Response
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Descriptive error message"
  }
}
```

## Endpoints

### 1. Get User's Tasks
```
GET /tasks
```

**Description**: Retrieve all tasks for the authenticated user with optional filtering by status.

**Authentication**: Required (JWT token)

**Query Parameters**:
- `status` (optional): Filter tasks by status. Valid values: "all", "pending", "completed". Default: "all"

**Response Codes**:
- `200`: Success
- `401`: Unauthorized (invalid/missing JWT)
- `422`: Validation error (invalid query parameters)

**Response Body (200)**:
```json
{
  "success": true,
  "data": {
    "tasks": [
      {
        "id": 1,
        "title": "Task title",
        "description": "Task description (optional)",
        "completed": false,
        "user_id": 1,
        "created_at": "2023-01-01T12:00:00Z",
        "updated_at": "2023-01-01T12:00:00Z"
      }
    ]
  },
  "message": "Tasks retrieved successfully"
}
```

### 2. Create New Task
```
POST /tasks
```

**Description**: Create a new task for the authenticated user.

**Authentication**: Required (JWT token)

**Request Body**:
```json
{
  "title": "Task title (1-200 characters)",
  "description": "Task description (optional, 0-1000 characters)"
}
```

**Validation**:
- `title`: Required, 1-200 characters
- `description`: Optional, 0-1000 characters

**Response Codes**:
- `201`: Created
- `400`: Bad Request (validation errors)
- `401`: Unauthorized (invalid/missing JWT)

**Response Body (201)**:
```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "Task title",
    "description": "Task description (optional)",
    "completed": false,
    "user_id": 1,
    "created_at": "2023-01-01T12:00:00Z",
    "updated_at": "2023-01-01T12:00:00Z"
  },
  "message": "Task created successfully"
}
```

### 3. Update Task
```
PUT /tasks/{task_id}
```

**Description**: Update an existing task for the authenticated user.

**Authentication**: Required (JWT token)

**Path Parameters**:
- `task_id` (int): ID of the task to update

**Request Body**:
```json
{
  "title": "Updated task title (optional, 1-200 characters)",
  "description": "Updated task description (optional, 0-1000 characters)"
}
```

**Validation**:
- `title`: Optional, if provided must be 1-200 characters
- `description`: Optional, if provided must be 0-1000 characters

**Response Codes**:
- `200`: Success
- `400`: Bad Request (validation errors)
- `401`: Unauthorized (invalid/missing JWT)
- `403`: Forbidden (user doesn't own the task)
- `404`: Not Found (task doesn't exist)

**Response Body (200)**:
```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "Updated task title",
    "description": "Updated task description",
    "completed": false,
    "user_id": 1,
    "created_at": "2023-01-01T12:00:00Z",
    "updated_at": "2023-01-02T10:00:00Z"
  },
  "message": "Task updated successfully"
}
```

### 4. Toggle Task Status
```
PATCH /tasks/{task_id}/toggle-status
```

**Description**: Toggle the completion status of a task for the authenticated user.

**Authentication**: Required (JWT token)

**Path Parameters**:
- `task_id` (int): ID of the task to update

**Request Body**: None

**Response Codes**:
- `200`: Success
- `401`: Unauthorized (invalid/missing JWT)
- `403`: Forbidden (user doesn't own the task)
- `404`: Not Found (task doesn't exist)

**Response Body (200)**:
```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "Task title",
    "description": "Task description",
    "completed": true,
    "user_id": 1,
    "created_at": "2023-01-01T12:00:00Z",
    "updated_at": "2023-01-02T10:00:00Z"
  },
  "message": "Task status updated successfully"
}
```

### 5. Delete Task
```
DELETE /tasks/{task_id}
```

**Description**: Delete a task for the authenticated user.

**Authentication**: Required (JWT token)

**Path Parameters**:
- `task_id` (int): ID of the task to delete

**Response Codes**:
- `200`: Success
- `401`: Unauthorized (invalid/missing JWT)
- `403`: Forbidden (user doesn't own the task)
- `404`: Not Found (task doesn't exist)

**Response Body (200)**:
```json
{
  "success": true,
  "message": "Task deleted successfully"
}
```

## Error Codes

| Code | Description |
|------|-------------|
| `UNAUTHORIZED` | Invalid or missing JWT token |
| `FORBIDDEN` | User doesn't have permission to access the resource |
| `NOT_FOUND` | Requested resource doesn't exist |
| `VALIDATION_ERROR` | Request data doesn't meet validation requirements |
| `INTERNAL_ERROR` | Internal server error occurred |

## JWT Token Verification

All authenticated endpoints must:
1. Verify the JWT token signature using the shared BETTER_AUTH_SECRET
2. Extract the user_id from the token payload
3. Ensure the user_id matches the requested resource owner
4. Return 401 if token is invalid/expired
5. Return 403 if user doesn't own the requested resource

## Data Validation

### Task Title
- Required for creation
- Minimum 1 character
- Maximum 200 characters
- Cannot be empty or whitespace-only

### Task Description
- Optional
- Maximum 1000 characters if provided
- Can be null/empty

### User Isolation
- Each endpoint must verify that the authenticated user owns the requested resource
- Return 403 if a user tries to access another user's data
- Filter all queries by the authenticated user's ID