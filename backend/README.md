# Todo Backend API

A modern, secure backend API for the Todo Full-Stack Web Application built with FastAPI and SQLModel.

## Features

- **FastAPI**: Modern, fast (high-performance) web framework for building APIs with Python 3.7+ based on standard Python type hints.
- **SQLModel**: SQL databases in Python, with Python objects. Designed for SQL databases with a focus on type hints.
- **JWT Authentication**: Secure user authentication with JSON Web Tokens.
- **PostgreSQL**: Production-ready database with Neon integration.
- **Better Auth**: Comprehensive authentication solution with JWT support.

## Tech Stack

- Python 3.13+
- FastAPI
- SQLModel
- PostgreSQL (via Neon)
- JWT Authentication
- Pydantic for data validation

## Setup

1. **Install Dependencies**:
   ```bash
   cd backend
   uv venv
   source .venv/bin/activate  # On Windows: .venv\Scripts\activate
   uv pip install -r requirements.txt
   ```

2. **Environment Variables**:
   Copy `.env.example` to `.env` and fill in the required values:
   ```bash
   cp .env.example .env
   ```

3. **Database Setup**:
   - Set up a Neon PostgreSQL database
   - Update the database connection string in your `.env` file

4. **Run the Application**:
   ```bash
   uvicorn src.todo.main:app --reload --host 0.0.0.0 --port 8000
   ```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login an existing user
- `POST /api/auth/logout` - Logout the current user

### Tasks
- `GET /api/tasks` - Get all tasks for the authenticated user
- `POST /api/tasks` - Create a new task
- `PUT /api/tasks/{id}` - Update an existing task
- `PATCH /api/tasks/{id}/toggle-status` - Toggle task completion status
- `DELETE /api/tasks/{id}` - Delete a task

## Project Structure

```
backend/
├── src/
│   └── todo/
│       ├── __init__.py
│       ├── models/
│       │   ├── user.py
│       │   └── task.py
│       ├── api/
│       │   ├── __init__.py
│       │   ├── auth.py
│       │   └── tasks.py
│       ├── database/
│       │   ├── __init__.py
│       │   └── session.py
│       ├── auth/
│       │   ├── __init__.py
│       │   └── jwt.py
│       └── main.py
├── tests/
├── pyproject.toml
├── .env.example
└── README.md
```

## Security

- JWT tokens for secure authentication
- User isolation - users can only access their own data
- Input validation and sanitization
- Proper error handling without information leakage