---
name: neon-postgresql-sqlmodel-setup
description: Setup Neon Serverless PostgreSQL with FastAPI using SQLModel ORM. Covers connection string, models, session dependency, basic migrations, and user/task schema for multi-user Nexa. Use for persistent storage in Phase II. NOT for in-memory or other DBs.
---

# Neon PostgreSQL + SQLModel Setup

**Core Thesis**: Serverless PostgreSQL with Neon + FastAPI integration via SQLModel provides persistent storage with clean, type-safe models and queries.

SQLModel combines Pydantic validation with SQLAlchemy ORM, giving you the best of both worlds: type safety and powerful database operations.

## When to Activate

Activate this skill when:
- Transitioning from in-memory storage to persistent database
- Setting up PostgreSQL for FastAPI backend
- Implementing multi-user data isolation with foreign keys
- Creating database models for Nexa (Users, Tasks)
- Setting up database connection and session management
- Running migrations (optional with Alembic)

## Core Concepts

### 1. Schema Architecture

| Table | Key Fields | Purpose |
|-------|-----------|---------|
| **users** | id (str PK), email (unique) | Managed/sync with Better Auth |
| **tasks** | id (int PK), user_id (FK), title, description, completed | User-owned tasks |

```
users
├── id: str (Primary Key)
├── email: str (Unique, Indexed)
├── name: str (Optional)
└── created_at: timestamp

tasks
├── id: int (Primary Key, Auto-increment)
├── user_id: str (Foreign Key → users.id, Indexed)
├── title: str (Max 200 chars)
├── description: str (Optional, Max 1000 chars)
├── completed: bool (Default false)
├── created_at: timestamp
└── updated_at: timestamp
```

### 2. SQLModel Benefits

| Feature | Benefit |
|---------|---------|
| **Type Safety** | Pydantic validation + Python type hints |
| **Auto-completion** | IDE support for model fields |
| **Validation** | Automatic input validation before DB operations |
| **ORM Power** | SQLAlchemy's querying capabilities |
| **Clean Syntax** | Less boilerplate than raw SQLAlchemy |

### 3. Database Connection Flow

```
Application Startup
│
├── Load DATABASE_URL from .env
├── Create SQLModel engine
├── Create tables (metadata.create_all)
│
Route Handler Request
│
├── Get session via Depends(get_session)
├── Perform database operations
├── Commit changes
└── Session auto-closes (context manager)
```

## Quick Start

### Step 1: Install Dependencies

```bash
uv add sqlmodel psycopg[binary] python-dotenv
```

**Dependencies Explained**:
- `sqlmodel`: ORM with Pydantic integration
- `psycopg[binary]`: PostgreSQL driver (psycopg3)
- `python-dotenv`: Load environment variables from .env

### Step 2: Database Connection

```python
# backend/db.py
from sqlmodel import SQLModel, create_engine, Session
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()
DATABASE_URL = os.getenv("DATABASE_URL")  # Neon connection string

# Create engine
engine = create_engine(
    DATABASE_URL,
    echo=False,  # Set to True for SQL query logging during development
    pool_pre_ping=True,  # Verify connections before using
)

def get_session():
    """
    Dependency for FastAPI routes to get database session.
    Automatically closes session after request.
    """
    with Session(engine) as session:
        yield session

def create_db_and_tables():
    """
    Create all tables defined in SQLModel metadata.
    Call this on application startup.
    """
    SQLModel.metadata.create_all(engine)
```

### Step 3: Define Models

```python
# backend/models.py
from sqlmodel import SQLModel, Field
from typing import Optional
from datetime import datetime

class User(SQLModel, table=True):
    """
    User model - synced with Better Auth.
    Stores basic user information.
    """
    id: str = Field(primary_key=True)
    email: str = Field(unique=True, index=True)
    name: Optional[str] = Field(default=None)
    created_at: datetime = Field(default_factory=datetime.utcnow)

class Task(SQLModel, table=True):
    """
    Task model - user-owned todos.
    Each task belongs to exactly one user.
    """
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: str = Field(foreign_key="user.id", index=True)
    title: str = Field(max_length=200)
    description: Optional[str] = Field(default=None, max_length=1000)
    completed: bool = Field(default=False)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        """SQLModel configuration"""
        arbitrary_types_allowed = True

# Optional: Pydantic models for API request/response
class TaskCreate(SQLModel):
    """Request model for creating a task"""
    title: str = Field(min_length=1, max_length=200)
    description: Optional[str] = Field(default=None, max_length=1000)

class TaskUpdate(SQLModel):
    """Request model for updating a task"""
    title: Optional[str] = Field(default=None, min_length=1, max_length=200)
    description: Optional[str] = Field(default=None, max_length=1000)
    completed: Optional[bool] = Field(default=None)
```

### Step 4: FastAPI Integration

```python
# backend/main.py
from fastapi import FastAPI, Depends, HTTPException, status
from sqlmodel import Session, select
from .db import get_session, create_db_and_tables
from .models import Task, TaskCreate, TaskUpdate
from .auth import get_current_user

app = FastAPI()

@app.on_event("startup")
async def on_startup():
    """Create database tables on application startup"""
    create_db_and_tables()

@app.post("/api/{user_id}/tasks", response_model=Task)
async def create_task(
    user_id: str,
    task: TaskCreate,
    session: Session = Depends(get_session),
    auth_user_id: str = Depends(get_current_user)
):
    """Create a new task for the authenticated user"""
    # Verify user_id matches authenticated user
    if user_id != auth_user_id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN)
    
    # Create task instance
    task_db = Task(
        **task.dict(),
        user_id=auth_user_id
    )
    
    # Add to database
    session.add(task_db)
    session.commit()
    session.refresh(task_db)
    
    return task_db

@app.get("/api/{user_id}/tasks", response_model=list[Task])
async def get_tasks(
    user_id: str,
    session: Session = Depends(get_session),
    auth_user_id: str = Depends(get_current_user)
):
    """Get all tasks for the authenticated user"""
    if user_id != auth_user_id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN)
    
    # Query with filter
    statement = select(Task).where(Task.user_id == auth_user_id)
    tasks = session.exec(statement).all()
    
    return tasks

@app.get("/api/{user_id}/tasks/{task_id}", response_model=Task)
async def get_task(
    user_id: str,
    task_id: int,
    session: Session = Depends(get_session),
    auth_user_id: str = Depends(get_current_user)
):
    """Get a specific task by ID"""
    if user_id != auth_user_id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN)
    
    task = session.get(Task, task_id)
    
    if not task or task.user_id != auth_user_id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )
    
    return task

@app.put("/api/{user_id}/tasks/{task_id}", response_model=Task)
async def update_task(
    user_id: str,
    task_id: int,
    task_update: TaskUpdate,
    session: Session = Depends(get_session),
    auth_user_id: str = Depends(get_current_user)
):
    """Update a task"""
    if user_id != auth_user_id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN)
    
    task = session.get(Task, task_id)
    
    if not task or task.user_id != auth_user_id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )
    
    # Update fields
    update_data = task_update.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(task, key, value)
    
    task.updated_at = datetime.utcnow()
    
    session.add(task)
    session.commit()
    session.refresh(task)
    
    return task

@app.delete("/api/{user_id}/tasks/{task_id}")
async def delete_task(
    user_id: str,
    task_id: int,
    session: Session = Depends(get_session),
    auth_user_id: str = Depends(get_current_user)
):
    """Delete a task"""
    if user_id != auth_user_id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN)
    
    task = session.get(Task, task_id)
    
    if not task or task.user_id != auth_user_id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )
    
    session.delete(task)
    session.commit()
    
    return {"message": "Task deleted successfully"}

@app.patch("/api/{user_id}/tasks/{task_id}/complete", response_model=Task)
async def toggle_task_completion(
    user_id: str,
    task_id: int,
    session: Session = Depends(get_session),
    auth_user_id: str = Depends(get_current_user)
):
    """Toggle task completion status"""
    if user_id != auth_user_id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN)
    
    task = session.get(Task, task_id)
    
    if not task or task.user_id != auth_user_id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )
    
    task.completed = not task.completed
    task.updated_at = datetime.utcnow()
    
    session.add(task)
    session.commit()
    session.refresh(task)
    
    return task
```

## Environment Variables

```bash
# .env (Backend)
DATABASE_URL=postgresql://username:password@ep-xyz.us-east-2.aws.neon.tech/neondb?sslmode=require

# Neon connection string format:
# postgresql://[user]:[password]@[neon-hostname]/[database]?sslmode=require
```

## Neon Setup (Dashboard)

1. **Create Neon Account**: https://neon.tech
2. **Create New Project**: Select region closest to users
3. **Get Connection String**: Copy from dashboard
4. **Database Settings**:
   - Auto-suspend: 5 minutes (free tier)
   - Compute size: 0.25 vCPU (free tier)
   - Storage: 512 MB (free tier)

## Migrations (Optional with Alembic)

For production apps, use Alembic for schema migrations:

```bash
# Install Alembic
uv add alembic

# Initialize Alembic
alembic init migrations

# Configure alembic.ini
# Set: sqlalchemy.url = postgresql://...

# Configure env.py
# Import your SQLModel metadata

# Create migration
alembic revision --autogenerate -m "Add tasks table"

# Apply migration
alembic upgrade head

# Rollback migration
alembic downgrade -1
```

**Example `migrations/env.py`**:
```python
from sqlmodel import SQLModel
from backend.models import User, Task  # Import all models

target_metadata = SQLModel.metadata
```

## Advanced Queries

```python
from sqlmodel import select, and_, or_

# Filter completed tasks
statement = select(Task).where(
    and_(
        Task.user_id == user_id,
        Task.completed == True
    )
)

# Search by title
statement = select(Task).where(
    and_(
        Task.user_id == user_id,
        Task.title.contains("important")
    )
)

# Order by created_at
statement = select(Task).where(
    Task.user_id == user_id
).order_by(Task.created_at.desc())

# Pagination
statement = select(Task).where(
    Task.user_id == user_id
).offset(0).limit(10)
```

## Anti-Patterns to Avoid

| ❌ Don't | ✅ Do Instead |
|---------|--------------|
| Hardcode connection string | Use `.env` + `DATABASE_URL` |
| No indexes on `user_id` | Always index foreign keys for filtering |
| Manual session management | Use `Depends(get_session)` dependency |
| Skip error handling | Wrap database ops in try-except |
| Missing foreign key constraints | Define relationships with `foreign_key` |
| No connection pooling | Use `create_engine` with pool settings |
| Commit inside loop | Batch operations, commit once |

## Error Handling

```python
from sqlalchemy.exc import IntegrityError

@app.post("/api/{user_id}/tasks")
async def create_task(
    user_id: str,
    task: TaskCreate,
    session: Session = Depends(get_session),
    auth_user_id: str = Depends(get_current_user)
):
    try:
        task_db = Task(**task.dict(), user_id=auth_user_id)
        session.add(task_db)
        session.commit()
        session.refresh(task_db)
        return task_db
    
    except IntegrityError as e:
        session.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Database integrity error"
        )
    
    except Exception as e:
        session.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Database error: {str(e)}"
        )
```

## Testing Your Database Setup

```python
# Test connection
python -c "from backend.db import engine; engine.connect(); print('Connected!')"

# Test table creation
python -c "from backend.db import create_db_and_tables; create_db_and_tables(); print('Tables created!')"

# Test query
python -c "
from backend.db import engine
from sqlmodel import Session, select
from backend.models import Task

with Session(engine) as session:
    tasks = session.exec(select(Task)).all()
    print(f'Found {len(tasks)} tasks')
"
```

## Troubleshooting

| Issue | Possible Cause | Solution |
|-------|---------------|----------|
| Connection refused | Wrong DATABASE_URL | Verify Neon connection string |
| SSL error | Missing sslmode | Add `?sslmode=require` to URL |
| Table not found | Tables not created | Call `create_db_and_tables()` on startup |
| Foreign key error | User doesn't exist | Ensure user created before tasks |
| Slow queries | Missing indexes | Add indexes on frequently queried fields |

## Dependencies

```bash
# Install all required packages
uv add sqlmodel psycopg[binary] python-dotenv

# Optional: For migrations
uv add alembic
```

## Integration with Other Skills

This skill connects to:
- **better-auth-jwt-integration**: JWT verification for user_id in queries
- **monorepo-spec-kit-structure**: Organizing backend code with specs

## Framework-Agnostic Concepts

| Concept | Universal Principle |
|---------|-------------------|
| ORM | Any framework needs models and query builders |
| Connection Pooling | Reuse database connections for performance |
| Foreign Keys | Enforce referential integrity at database level |
| Indexes | Speed up queries on frequently filtered columns |
| Migrations | Version control for database schema changes |

---

**Skill Metadata**

**Created**: 2025-01-04  
**Phase**: Phase II - Full-Stack Web Application  
**Stack**: FastAPI + SQLModel + Neon PostgreSQL  
**Version**: 1.0.0