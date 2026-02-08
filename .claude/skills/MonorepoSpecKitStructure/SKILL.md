---
name: monorepo-spec-kit-structure
description: Organize monorepo for Spec-Kit Plus + Claude Code with Next.js frontend and FastAPI backend. Follow hackathon guide for folder structure, specs organization, CLAUDE.md files, and @specs referencing. Essential for spec-driven development across stack.
---

# Monorepo Spec-Kit Structure

**Core Thesis**: Structured specifications in a monorepo enable Claude Code to navigate and edit both frontend and backend in a single context, following spec-driven development principles.

Spec-Kit Plus provides organized, structured specs that Claude Code can reference. The CLAUDE.md files tell Claude Code how to use those specs and project-specific conventions.

## When to Activate

Activate this skill when:
- Setting up full-stack project with Next.js and FastAPI
- Organizing specs for spec-driven development workflow
- Configuring Claude Code for monorepo navigation
- Creating CLAUDE.md files for context-specific guidance
- Implementing @specs referencing in Claude Code prompts
- Transitioning from Phase I (console) to Phase II (web)

## Core Concepts

### 1. Monorepo Benefits

| Benefit | Description |
|---------|-------------|
| **Single Context** | Claude Code sees entire project, can make cross-cutting changes |
| **Layered CLAUDE.md** | Root file for overview, subfolder files for specific guidelines |
| **Specs Folder** | Reference specifications directly with @specs/filename.md |
| **Clear Separation** | Frontend and backend code in separate folders, easy to navigate |
| **Shared Configuration** | Single docker-compose, shared environment variables |

### 2. Spec-Kit vs Basic Monorepo

| Aspect | Without Spec-Kit | With Spec-Kit |
|--------|-----------------|---------------|
| **Specs Location** | /specs (flat) | /specs (organized by type) |
| **Config File** | None | /.spec-kit/config.yaml |
| **Spec Format** | Freeform markdown | Spec-Kit conventions |
| **Referencing** | @specs/file.md | @specs/features/file.md |
| **Phase Management** | Manual | Defined in config.yaml |

### 3. Spec Organization

```
specs/
├── overview.md           # What: Project purpose and goals
├── architecture.md       # How: System design and tech stack
├── features/            # What to build
│   ├── task-crud.md
│   └── authentication.md
├── api/                 # External interfaces
│   ├── rest-endpoints.md
│   └── mcp-tools.md
├── database/           # Data layer
│   └── schema.md
└── ui/                 # Presentation layer
    ├── components.md
    └── pages.md
```

## Quick Start

### Step 1: Folder Structure

```
hackathon-todo/
├── .spec-kit/                    # Spec-Kit configuration
│   └── config.yaml
├── specs/                        # Spec-Kit managed specifications
│   ├── overview.md               # Project overview
│   ├── architecture.md           # System architecture
│   ├── features/                 # Feature specifications
│   │   ├── task-crud.md
│   │   └── authentication.md
│   ├── api/                      # API specifications
│   │   └── rest-endpoints.md
│   ├── database/                 # Database specifications
│   │   └── schema.md
│   └── ui/                       # UI specifications
│       ├── components.md
│       └── pages.md
├── CLAUDE.md                     # Root Claude Code instructions
├── frontend/
│   ├── CLAUDE.md                # Frontend-specific guidelines
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── login/
│   │   └── tasks/
│   ├── components/
│   │   ├── TaskList.tsx
│   │   ├── TaskForm.tsx
│   │   └── ui/
│   ├── lib/
│   │   ├── api.ts
│   │   └── auth.ts
│   ├── package.json
│   └── next.config.js
├── backend/
│   ├── CLAUDE.md                # Backend-specific guidelines
│   ├── main.py
│   ├── models.py
│   ├── auth.py
│   ├── db.py
│   ├── routes/
│   │   ├── tasks.py
│   │   └── auth.py
│   ├── pyproject.toml
│   └── .env
├── docker-compose.yml
├── .gitignore
└── README.md
```

### Step 2: Spec-Kit Config

```yaml
# .spec-kit/config.yaml
name: hackathon-todo
version: "1.0"

structure:
  specs_dir: specs
  features_dir: specs/features
  api_dir: specs/api
  database_dir: specs/database
  ui_dir: specs/ui

phases:
  - name: phase1-console
    features: [task-crud]
  - name: phase2-web
    features: [task-crud, authentication]
  - name: phase3-chatbot
    features: [task-crud, authentication, chatbot]

metadata:
  author: Your Name
  created: 2025-01-04
  tech_stack:
    frontend: Next.js 16
    backend: FastAPI
    database: Neon PostgreSQL
    auth: Better Auth
```

### Step 3: Root CLAUDE.md

```markdown
# Nexa - Hackathon Phase II

## Project Overview
Full-stack task management application with multi-user authentication.
Monorepo using GitHub Spec-Kit for spec-driven development.

## Spec-Kit Structure
Specifications organized in `/specs`:
- `/specs/overview.md` - Project overview and goals
- `/specs/features/` - Feature specs (what to build)
- `/specs/api/` - API endpoint specifications
- `/specs/database/` - Schema and model specs
- `/specs/ui/` - Component and page specs

## How to Use Specs
1. Always read relevant spec before implementing
2. Reference specs with: `@specs/features/task-crud.md`
3. Update specs if requirements change
4. Follow spec conventions defined in Spec-Kit

## Project Structure
- `/frontend` - Next.js 16 app (App Router)
- `/backend` - Python FastAPI server
- `/specs` - Specification files
- `/.spec-kit` - Spec-Kit configuration

## Tech Stack
- **Frontend**: Next.js 16 (App Router), TypeScript, Tailwind CSS, Better Auth
- **Backend**: FastAPI, SQLModel, Python 3.13+
- **Database**: Neon Serverless PostgreSQL
- **Tools**: Claude Code, Spec-Kit Plus, UV

## Development Workflow
1. Read spec: `@specs/features/[feature].md`
2. Implement backend: See `@backend/CLAUDE.md`
3. Implement frontend: See `@frontend/CLAUDE.md`
4. Test both services together
5. Update specs if needed

## Commands
```bash
# Frontend (development)
cd frontend && npm run dev

# Backend (development)
cd backend && uvicorn main:app --reload

# Both services (Docker)
docker-compose up

# Database migrations
cd backend && alembic upgrade head
```

## Environment Variables
Both services need `.env` files:
- `BETTER_AUTH_SECRET` - Shared secret for JWT (MUST be same in both)
- `DATABASE_URL` - Neon PostgreSQL connection string

## Phase II Goals
- [x] Phase I: Console app with in-memory storage
- [ ] Phase II: Web app with persistent storage
  - [ ] Better Auth integration
  - [ ] RESTful API endpoints
  - [ ] Multi-user data isolation
  - [ ] Responsive frontend UI

## Getting Help
- Frontend issues: Check `frontend/CLAUDE.md`
- Backend issues: Check `backend/CLAUDE.md`
- Spec questions: Read relevant spec file
- Architecture questions: See `specs/architecture.md`
```

### Step 4: Frontend CLAUDE.md

```markdown
# Frontend Guidelines

## Stack
- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Auth**: Better Auth
- **State**: React hooks (useState, useEffect)

## Project Structure
```
frontend/
├── app/               # App Router pages and layouts
│   ├── layout.tsx     # Root layout
│   ├── page.tsx       # Home page
│   ├── login/         # Login page
│   └── tasks/         # Tasks pages
├── components/        # Reusable UI components
│   ├── TaskList.tsx
│   ├── TaskForm.tsx
│   └── ui/            # shadcn/ui components
├── lib/               # Utilities and helpers
│   ├── api.ts         # API client
│   └── auth.ts        # Better Auth config
└── public/            # Static assets
```

## Patterns

### Server vs Client Components
- **Default**: Use Server Components
- **Client Components**: Only when needed for:
  - Interactivity (onClick, onChange)
  - Hooks (useState, useEffect)
  - Browser APIs (localStorage, window)

```tsx
// Server Component (default)
export default async function TasksPage() {
  const tasks = await getTasks();
  return <TaskList tasks={tasks} />;
}

// Client Component (with 'use client')
'use client'
export function TaskForm() {
  const [title, setTitle] = useState('');
  // ...
}
```

### API Calls
All backend calls should use the API client:

```tsx
// lib/api.ts
import { api } from '@/lib/api'

// In component
const tasks = await api.getTasks(userId);
const newTask = await api.createTask(userId, { title, description });
```

### Error Handling
Always handle errors in API calls:

```tsx
try {
  const tasks = await api.getTasks(userId);
  setTasks(tasks);
} catch (error) {
  console.error('Failed to fetch tasks:', error);
  toast.error('Failed to load tasks');
}
```

## Styling
- Use Tailwind CSS utility classes
- No inline styles
- Follow existing component patterns
- Use shadcn/ui components for common UI elements

## Authentication
- Better Auth handles login/signup
- JWT tokens stored in session
- API client automatically attaches tokens
- Protected routes use middleware

## Component Guidelines
1. One component per file
2. Named exports for utilities, default for components
3. Props interface defined above component
4. TypeScript strict mode enabled

## Example Component

```tsx
// components/TaskList.tsx
interface TaskListProps {
  tasks: Task[];
  onTaskClick: (taskId: number) => void;
}

export function TaskList({ tasks, onTaskClick }: TaskListProps) {
  if (tasks.length === 0) {
    return <p className="text-gray-500">No tasks yet.</p>;
  }

  return (
    <div className="space-y-2">
      {tasks.map((task) => (
        <TaskCard
          key={task.id}
          task={task}
          onClick={() => onTaskClick(task.id)}
        />
      ))}
    </div>
  );
}
```

## Commands
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run lint         # Run ESLint
npm run type-check   # Check TypeScript types
```
```

### Step 5: Backend CLAUDE.md

```markdown
# Backend Guidelines

## Stack
- **Framework**: FastAPI
- **ORM**: SQLModel
- **Database**: Neon PostgreSQL
- **Language**: Python 3.13+
- **Package Manager**: UV

## Project Structure
```
backend/
├── main.py           # FastAPI app entry point
├── models.py         # SQLModel database models
├── auth.py           # JWT verification
├── db.py             # Database connection
├── routes/           # API route handlers
│   ├── tasks.py
│   └── auth.py
├── pyproject.toml    # UV project config
└── .env              # Environment variables
```

## Patterns

### API Conventions
- All routes under `/api/{user_id}/`
- Return JSON responses
- Use Pydantic models for request/response
- Handle errors with HTTPException
- Validate user_id matches authenticated user

### Database Operations
Use SQLModel for all database operations:

```python
from sqlmodel import Session, select

# Query
statement = select(Task).where(Task.user_id == user_id)
tasks = session.exec(statement).all()

# Create
task = Task(**task_data, user_id=user_id)
session.add(task)
session.commit()
session.refresh(task)

# Update
task.title = new_title
session.add(task)
session.commit()

# Delete
session.delete(task)
session.commit()
```

### Dependency Injection
Use FastAPI dependencies:

```python
@app.get("/api/{user_id}/tasks")
async def get_tasks(
    user_id: str,
    session: Session = Depends(get_session),
    auth_user_id: str = Depends(get_current_user)
):
    # Verify user_id
    if user_id != auth_user_id:
        raise HTTPException(status_code=403)
    
    # Query tasks
    statement = select(Task).where(Task.user_id == auth_user_id)
    return session.exec(statement).all()
```

### Error Handling
Always handle database errors:

```python
try:
    session.add(task)
    session.commit()
    return task
except IntegrityError:
    session.rollback()
    raise HTTPException(status_code=400, detail="Invalid data")
except Exception as e:
    session.rollback()
    raise HTTPException(status_code=500, detail=str(e))
```

## Database
- Connection string from environment variable: `DATABASE_URL`
- Use session dependency: `Depends(get_session)`
- Always filter by `user_id` for multi-user isolation
- Index foreign keys for performance

## Models
Define models with SQLModel:

```python
from sqlmodel import SQLModel, Field

class Task(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: str = Field(foreign_key="user.id", index=True)
    title: str = Field(max_length=200)
    completed: bool = Field(default=False)
```

## Authentication
- JWT tokens verified in `get_current_user` dependency
- Shared secret from `BETTER_AUTH_SECRET` env var
- Always verify user_id in URL matches authenticated user

## Commands
```bash
uvicorn main:app --reload    # Start development server
uv add <package>             # Add dependency
uv run pytest                # Run tests
alembic upgrade head         # Run migrations
```

## Example Route

```python
@app.post("/api/{user_id}/tasks", response_model=Task)
async def create_task(
    user_id: str,
    task: TaskCreate,
    session: Session = Depends(get_session),
    auth_user_id: str = Depends(get_current_user)
):
    """Create a new task for the authenticated user"""
    if user_id != auth_user_id:
        raise HTTPException(status_code=403)
    
    task_db = Task(**task.dict(), user_id=auth_user_id)
    session.add(task_db)
    session.commit()
    session.refresh(task_db)
    
    return task_db
```
```

## Workflow with Spec-Kit Plus + Claude Code

### 1. Write/Update Spec

```markdown
# specs/features/task-filtering.md

## Feature: Task Filtering

### User Stories
- As a user, I can filter tasks by status (all/pending/completed)
- As a user, I can search tasks by title

### Acceptance Criteria
- Filter dropdown with 3 options: All, Pending, Completed
- Search input with real-time filtering
- Results update without page reload
```

### 2. Reference in Claude Code

```bash
# Implement entire feature
You: @specs/features/task-filtering.md implement task filtering

# Implement specific layer
You: @specs/api/rest-endpoints.md implement GET /api/{user_id}/tasks with filter params

# Update database
You: @specs/database/schema.md add due_date field to tasks table
```

### 3. Claude Code Process

1. Reads Root `CLAUDE.md` for project context
2. Reads Feature spec for requirements
3. Reads API spec for endpoint details
4. Reads Database spec for schema
5. Reads relevant `CLAUDE.md` for conventions
6. Implements in both frontend and backend
7. Follows patterns from CLAUDE.md files

### 4. Test and Iterate

```bash
# Test backend
curl http://localhost:8000/api/user123/tasks?status=completed

# Test frontend
# Open http://localhost:3000/tasks
# Click filter dropdown, select "Completed"
```

## Example Spec Files

### /specs/overview.md

```markdown
# Nexa Overview

## Purpose
A task management application that evolves from console app to cloud-native AI system.

## Current Phase
Phase II: Full-Stack Web Application

## Tech Stack
- Frontend: Next.js 16, TypeScript, Tailwind CSS
- Backend: FastAPI, SQLModel, Neon PostgreSQL
- Auth: Better Auth with JWT

## Features
- ✅ Task CRUD operations (Phase I)
- [ ] User authentication (Phase II)
- [ ] Multi-user data isolation (Phase II)
- [ ] Task filtering and sorting (Phase II)
- [ ] AI chatbot (Phase III)

## Success Criteria
- Users can sign up and log in
- Each user sees only their own tasks
- All CRUD operations work correctly
- Responsive UI on mobile and desktop
```

### /specs/features/task-crud.md

```markdown
# Feature: Task CRUD Operations

## User Stories
- As a user, I can create a new task with title and description
- As a user, I can view all my tasks in a list
- As a user, I can update task title, description, and status
- As a user, I can delete a task permanently
- As a user, I can mark a task as complete or incomplete

## Acceptance Criteria

### Create Task
- Title is required (1-200 characters)
- Description is optional (max 1000 characters)
- Task is associated with logged-in user
- Created timestamp is automatically set
- Returns created task with ID

### View Tasks
- Only show tasks for current user
- Display title, status, and created date
- Support filtering by status (all/pending/completed)
- Display in reverse chronological order

### Update Task
- Can update title, description, or completion status
- Cannot change user_id
- Updated timestamp is automatically set
- Returns updated task

### Delete Task
- Permanently removes task from database
- Only task owner can delete
- Returns success confirmation

### Mark Complete
- Toggles completion status
- Updates updated_at timestamp
- Returns updated task

## UI Requirements
- Task list with checkboxes for completion
- Edit button opens modal/form
- Delete button with confirmation
- Add task button opens creation form
- Loading states for async operations
```

### /specs/api/rest-endpoints.md

```markdown
# REST API Endpoints

## Base URL
- Development: `http://localhost:8000`
- Production: `https://api.yourdomain.com`

## Authentication
All endpoints require JWT token in header:
```
Authorization: Bearer <token>
```

## Endpoints

### GET /api/{user_id}/tasks
List all tasks for authenticated user.

**Path Parameters:**
- `user_id`: User identifier (must match authenticated user)

**Query Parameters:**
- `status`: Filter by status
  - `all` (default)
  - `pending`
  - `completed`
- `sort`: Sort order
  - `created` (default, newest first)
  - `title` (alphabetical)

**Response:** `200 OK`
```json
[
  {
    "id": 1,
    "user_id": "user123",
    "title": "Buy groceries",
    "description": "Milk, eggs, bread",
    "completed": false,
    "created_at": "2025-01-04T10:00:00Z",
    "updated_at": "2025-01-04T10:00:00Z"
  }
]
```

### POST /api/{user_id}/tasks
Create a new task.

**Path Parameters:**
- `user_id`: User identifier (must match authenticated user)

**Request Body:**
```json
{
  "title": "Buy groceries",
  "description": "Milk, eggs, bread"
}
```

**Response:** `201 Created`
```json
{
  "id": 1,
  "user_id": "user123",
  "title": "Buy groceries",
  "description": "Milk, eggs, bread",
  "completed": false,
  "created_at": "2025-01-04T10:00:00Z",
  "updated_at": "2025-01-04T10:00:00Z"
}
```

### GET /api/{user_id}/tasks/{task_id}
Get a specific task.

**Path Parameters:**
- `user_id`: User identifier
- `task_id`: Task identifier

**Response:** `200 OK` (same as POST response)

**Errors:**
- `404 Not Found`: Task doesn't exist or doesn't belong to user

### PUT /api/{user_id}/tasks/{task_id}
Update a task.

**Request Body:** (all fields optional)
```json
{
  "title": "Buy groceries and pharmacy",
  "description": "Milk, eggs, bread, aspirin",
  "completed": true
}
```

**Response:** `200 OK` (updated task)

### DELETE /api/{user_id}/tasks/{task_id}
Delete a task.

**Response:** `200 OK`
```json
{
  "message": "Task deleted successfully"
}
```

### PATCH /api/{user_id}/tasks/{task_id}/complete
Toggle task completion status.

**Response:** `200 OK` (updated task with toggled status)

## Error Responses

### 401 Unauthorized
```json
{
  "detail": "Invalid or expired token"
}
```

### 403 Forbidden
```json
{
  "detail": "Cannot access other user's tasks"
}
```

### 404 Not Found
```json
{
  "detail": "Task not found"
}
```

### 422 Validation Error
```json
{
  "detail": [
    {
      "loc": ["body", "title"],
      "msg": "field required",
      "type": "value_error.missing"
    }
  ]
}
```
```

### /specs/database/schema.md

```markdown
# Database Schema

## Tables

### users (managed by Better Auth)
```sql
CREATE TABLE users (
  id VARCHAR PRIMARY KEY,
  email VARCHAR UNIQUE NOT NULL,
  name VARCHAR,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_users_email ON users(email);
```

**Fields:**
- `id`: Unique user identifier (from Better Auth)
- `email`: User's email address (unique)
- `name`: User's display name (optional)
- `created_at`: Account creation timestamp

### tasks
```sql
CREATE TABLE tasks (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  completed BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_tasks_user_id ON tasks(user_id);
CREATE INDEX idx_tasks_completed ON tasks(completed);
```

**Fields:**
- `id`: Auto-incrementing task identifier
- `user_id`: Foreign key to users table
- `title`: Task title (max 200 characters)
- `description`: Task description (optional, max 1000 characters)
- `completed`: Task completion status (default false)
- `created_at`: Task creation timestamp
- `updated_at`: Last update timestamp

## Relationships
- One user has many tasks (one-to-many)
- Tasks are deleted when user is deleted (CASCADE)

## Indexes
- `idx_tasks_user_id`: Speed up queries filtering by user
- `idx_tasks_completed`: Speed up queries filtering by status
- `idx_users_email`: Speed up login queries

## Constraints
- `user_id` cannot be null
- `title` cannot be null and max 200 characters
- `email` must be unique across users
```

## Key Takeaways

| Component | Purpose |
|-----------|---------|
| **/.spec-kit/config.yaml** | Spec-Kit configuration and phase definitions |
| **/specs/\*\*/\*.md** | What to build (requirements) |
| **/CLAUDE.md** | How to navigate and use specs |
| **/frontend/CLAUDE.md** | Frontend-specific patterns and conventions |
| **/backend/CLAUDE.md** | Backend-specific patterns and conventions |

## Anti-Patterns to Avoid

| ❌ Don't | ✅ Do Instead |
|---------|--------------|
| Flat spec folder | Organize by type (features/, api/, database/) |
| No CLAUDE.md files | Provide context at root and subfolder levels |
| Generic instructions | Specific patterns and examples per layer |
| Skip config.yaml | Define structure and phases clearly |
| Vague spec references | Use precise @specs/path/to/file.md |

## Benefits Summary

1. **Single Context**: Claude Code sees entire project
2. **Organized Specs**: Clear hierarchy and purpose
3. **Layered Guidance**: Context-specific instructions
4. **Cross-cutting Changes**: Easier to update both frontend and backend
5. **Spec-Driven**: Requirements drive implementation
6. **Version Control**: Specs and code evolve together

## Integration with Other Skills

This skill connects to:
- **better-auth-jwt-integration**: Auth implementation across frontend and backend
- **neon-postgresql-setup**: Database setup referenced in backend specs

---

**Skill Metadata**

**Created**: 2025-01-04  
**Phase**: Phase II - Full-Stack Web Application  
**Stack**: Monorepo + Spec-Kit Plus + Claude Code  
**Version**: 1.0.0