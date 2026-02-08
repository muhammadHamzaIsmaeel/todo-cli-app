# Data Model: Todo Full-Stack Web Application

**Feature**: Todo Full-Stack Web Application (Phase II)
**Date**: 2026-01-05
**Branch**: 002-phase-II-full-stack-web-app

## Overview

This document defines the data models for the Todo Full-Stack Web Application, following the requirements from the feature specification and using SQLModel ORM for Neon PostgreSQL database integration.

## Entity Models

### 1. User

**Purpose**: Represents an authenticated user of the system managed by Better Auth

**Fields**:
- `id` (int, primary_key, autoincrement): Unique identifier for the user
- `email` (str, unique, max_length=255): User's email address for authentication
- `name` (str, max_length=255, optional): User's display name
- `created_at` (datetime): Timestamp when the user account was created
- `updated_at` (datetime): Timestamp when the user account was last updated

**Relationships**:
- One-to-many with Task (user.tasks)

**Validation Rules**:
- Email must be a valid email format (1-255 chars)
- Name must be 0-255 characters if provided
- Email must be unique across all users

### 2. Task

**Purpose**: Represents a todo item with title, description, status, and user ownership

**Fields**:
- `id` (int, primary_key, autoincrement): Unique identifier for the task
- `title` (str, max_length=200): Task title (required, 1-200 characters)
- `description` (str, max_length=1000, optional): Task description (0-1000 characters)
- `completed` (bool, default=False): Completion status of the task
- `user_id` (int, foreign_key): Reference to the user who owns this task
- `created_at` (datetime): Timestamp when the task was created
- `updated_at` (datetime): Timestamp when the task was last updated

**Relationships**:
- Many-to-one with User (task.user)

**Validation Rules**:
- Title must be 1-200 characters
- Description must be 0-1000 characters if provided
- Task must belong to a valid user
- Only the task owner can modify/delete the task

## State Transitions

### Task State Transitions

```
[Pending] <---> [Completed]
    ↑              ↑
  Create        Toggle
    ↓              ↓
[Non-existent] ← Delete
```

**Transitions**:
1. **Create**: New task starts in "Pending" state (completed=False)
2. **Toggle Completion**: User can toggle between "Pending" and "Completed" states
3. **Delete**: Task is removed from the system
4. **Update**: Task details can be modified while maintaining current completion state

## Database Schema

### SQLModel Implementation

```python
from sqlmodel import SQLModel, Field, Relationship
from datetime import datetime
from typing import Optional

class User(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    email: str = Field(sa_column_kwargs={"unique": True}, max_length=255)
    name: Optional[str] = Field(default=None, max_length=255)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    # Relationship to tasks
    tasks: list["Task"] = Relationship(back_populates="user")

class Task(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    title: str = Field(min_length=1, max_length=200)
    description: Optional[str] = Field(default=None, max_length=1000)
    completed: bool = Field(default=False)
    user_id: int = Field(foreign_key="user.id")
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    # Relationship to user
    user: User = Relationship(back_populates="tasks")
```

## API Data Transfer Objects (DTOs)

### 1. TaskCreate

**Purpose**: Data structure for creating new tasks

**Fields**:
- `title` (str, required): Task title (1-200 characters)
- `description` (str, optional): Task description (0-1000 characters)

### 2. TaskUpdate

**Purpose**: Data structure for updating existing tasks

**Fields**:
- `title` (str, optional): New task title (1-200 characters if provided)
- `description` (str, optional): New task description (0-1000 characters if provided)

### 3. TaskResponse

**Purpose**: Data structure for returning task information to clients

**Fields**:
- `id` (int): Task unique identifier
- `title` (str): Task title
- `description` (str, optional): Task description
- `completed` (bool): Completion status
- `user_id` (int): ID of the user who owns this task
- `created_at` (datetime): Creation timestamp
- `updated_at` (datetime): Last update timestamp

### 4. TaskToggleStatus

**Purpose**: Data structure for toggling task completion status

**Fields**:
- `completed` (bool): New completion status for the task

## Validation Constraints

### 1. Task Title Validation
- Minimum length: 1 character
- Maximum length: 200 characters
- Required field

### 2. Task Description Validation
- Maximum length: 1000 characters
- Optional field (can be null)
- If provided, must be 1-1000 characters

### 3. User Isolation
- Each task is associated with exactly one user via user_id
- API endpoints must validate that the authenticated user owns the task being accessed
- Queries must filter by user_id to prevent cross-user data access

### 4. Data Integrity
- Foreign key constraints ensure task.user_id references a valid user
- Created/updated timestamps are automatically managed
- No direct manipulation of ID fields

## Indexes

### 1. User Table
- Primary key: id
- Unique index: email
- Index on: created_at (for sorting/filtering)

### 2. Task Table
- Primary key: id
- Index: user_id (for efficient user-specific queries)
- Index: completed (for status-based filtering)
- Index: created_at (for chronological ordering)
- Composite index: (user_id, completed) for efficient user and status queries

## API Endpoints Data Flow

### 1. POST /api/tasks
- Input: TaskCreate DTO
- Process: Validates title/description, assigns to authenticated user
- Output: TaskResponse DTO with new task ID

### 2. GET /api/tasks
- Input: None (user identified by JWT)
- Process: Filters tasks by user_id, applies status filters if specified
- Output: Array of TaskResponse DTOs

### 3. PUT /api/tasks/{task_id}
- Input: TaskUpdate DTO
- Process: Validates ownership, updates specified fields
- Output: Updated TaskResponse DTO

### 4. PATCH /api/tasks/{task_id}/toggle-status
- Input: TaskToggleStatus DTO
- Process: Validates ownership, toggles completion status
- Output: Updated TaskResponse DTO

### 5. DELETE /api/tasks/{task_id}
- Input: task_id path parameter
- Process: Validates ownership, deletes task
- Output: Success confirmation or error

This data model ensures proper user isolation, validates all required constraints, and supports all the functionality specified in the feature requirements.