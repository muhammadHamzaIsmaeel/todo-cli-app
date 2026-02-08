# Quickstart Guide: Todo Full-Stack Web Application

**Feature**: Todo Full-Stack Web Application (Phase II)
**Date**: 2026-01-05
**Branch**: 002-phase-II-full-stack-web-app

## Overview

This guide provides instructions for setting up, running, and testing the Todo Full-Stack Web Application with Better Auth JWT integration and Neon PostgreSQL database.

## Prerequisites

- Node.js 18+ and npm/pnpm
- Python 3.13+
- UV package manager
- Docker and Docker Compose (for local development)
- Git

## Project Structure

```
todo-fullstack-app/
├── backend/                 # FastAPI backend with SQLModel
│   ├── src/
│   ├── pyproject.toml
│   └── .env.example
├── frontend/               # Next.js frontend with Tailwind CSS
│   ├── src/
│   ├── package.json
│   └── .env.example
├── specs/                  # Feature specifications
├── docker-compose.yml      # Local development services
├── README.md
└── CLAUDE.md
```

## Setup Instructions

### 1. Clone and Initialize Repository

```bash
git clone <repository-url>
cd todo-fullstack-app
```

### 2. Backend Setup (FastAPI)

```bash
# Navigate to backend
cd backend

# Create virtual environment with UV
uv venv

# Activate virtual environment
source .venv/bin/activate  # Linux/Mac
# or
.venv\Scripts\activate     # Windows

# Install dependencies
uv pip install -e .
```

### 3. Frontend Setup (Next.js)

```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install
# or
pnpm install
```

### 4. Environment Configuration

#### Backend Environment Variables

Create `.env` in the backend directory:

```bash
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/todo_app"

# Better Auth
BETTER_AUTH_SECRET="your-super-secret-jwt-secret-here"
BETTER_AUTH_URL="http://localhost:8000"

# JWT Configuration
JWT_SECRET="same-secret-as-BETTER_AUTH_SECRET"
```

#### Frontend Environment Variables

Create `.env.local` in the frontend directory:

```bash
# Backend API URL
NEXT_PUBLIC_API_URL="http://localhost:8000"

# Better Auth
NEXT_PUBLIC_BETTER_AUTH_URL="http://localhost:8000"
```

### 5. Database Setup

#### Option A: Local PostgreSQL with Docker

```bash
# From project root
docker-compose up -d postgres
```

#### Option B: Neon PostgreSQL

1. Create a Neon account and project
2. Update DATABASE_URL in backend `.env` with your Neon connection string
3. Run database migrations:

```bash
# From backend directory
cd backend
# Activate environment and run migrations
uv run alembic upgrade head
```

## Running the Application

### 1. Start Backend (FastAPI)

```bash
# From backend directory
cd backend
source .venv/bin/activate  # Activate virtual environment

# Run the application
uv run python -m src.todo.main
# or with auto-reload during development
uv run uvicorn src.todo.main:app --reload --host 0.0.0.0 --port 8000
```

### 2. Start Frontend (Next.js)

```bash
# From frontend directory
cd frontend

# Run in development mode
npm run dev
# or
pnpm dev
```

### 3. Complete Setup

1. Backend will be available at `http://localhost:8000`
2. Frontend will be available at `http://localhost:3000`
3. API documentation at `http://localhost:8000/docs`

## API Endpoints

### Authentication (via Better Auth)
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

### Task Management
- `GET /api/tasks` - Get user's tasks with optional status filter
- `POST /api/tasks` - Create new task
- `PUT /api/tasks/{id}` - Update task
- `PATCH /api/tasks/{id}/toggle-status` - Toggle task completion
- `DELETE /api/tasks/{id}` - Delete task

## Testing

### Backend Tests

```bash
# From backend directory
cd backend
source .venv/bin/activate

# Run all tests
uv run pytest

# Run specific test file
uv run pytest tests/unit/test_tasks.py

# Run with coverage
uv run pytest --cov=src.todo
```

### Frontend Tests

```bash
# From frontend directory
cd frontend

# Run all tests
npm test
# or
pnpm test
```

## Development Workflow

### Adding New Features

1. Update the specification in `specs/002-phase-II-full-stack-web-app/spec.md`
2. Update the implementation plan if needed
3. Create new models in `backend/src/todo/models/`
4. Create new API routes in `backend/src/todo/api/`
5. Create new components in `frontend/src/components/`
6. Add tests for new functionality
7. Update documentation

### Database Migrations

```bash
# Create a new migration
uv run alembic revision --autogenerate -m "description of changes"

# Apply migrations
uv run alembic upgrade head
```

## Skills Integration

This project follows the guidelines from the following skills:

- `@skills/BetterAuthJWTIntegration.md` - For JWT authentication setup
- `@skills/NeonPostgreSQLSetup.md` - For database configuration
- `@skills/MonorepoSpecKitStructure.md` - For project structure

## Troubleshooting

### Common Issues

1. **Database Connection Errors**:
   - Verify DATABASE_URL in backend `.env`
   - Ensure PostgreSQL/Neon service is running
   - Check firewall settings if using remote database

2. **JWT Authentication Errors**:
   - Verify BETTER_AUTH_SECRET is the same in frontend and backend
   - Check that JWT tokens are properly included in API requests

3. **Frontend-Backend Communication**:
   - Verify NEXT_PUBLIC_API_URL points to the correct backend URL
   - Check CORS settings in FastAPI app

### Resetting the Development Environment

```bash
# Backend
cd backend
rm -rf .venv
uv venv
source .venv/bin/activate
uv pip install -e .

# Frontend
cd frontend
rm -rf node_modules
npm install
```

## Production Deployment

### Environment Variables for Production

```bash
# Backend
DATABASE_URL="your-production-database-url"
BETTER_AUTH_SECRET="your-production-jwt-secret"
BETTER_AUTH_URL="your-production-backend-url"

# Frontend
NEXT_PUBLIC_API_URL="your-production-backend-url"
NEXT_PUBLIC_BETTER_AUTH_URL="your-production-backend-url"
```

This quickstart guide provides the essential information needed to set up and run the Todo Full-Stack Web Application. For more detailed information about specific components, refer to the individual README files in the backend and frontend directories.