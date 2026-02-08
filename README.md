# Nexa - Full-Stack Todo Application

A modern full-stack Todo application with Next.js frontend, FastAPI backend, and PostgreSQL database. This project evolved from a simple CLI application to a comprehensive web application with authentication, and now includes an AI-powered chatbot for task management.

## Features

### Frontend (Next.js 16)
- Modern UI with glassmorphism design and dark mode
- Responsive layout for all devices
- Task management dashboard
- Kanban board view for project management
- Calendar view for due dates
- Authentication system (login/signup)
- Real-time task updates
- AI Chatbot interface for natural language task management

### Backend (FastAPI)
- RESTful API endpoints
- JWT-based authentication
- PostgreSQL database integration
- User management system
- Task CRUD operations with filtering
- Error handling and validation
- AI Chatbot with OpenAI integration
- MCP tools for natural language processing
- Stateless conversation management

### Infrastructure
- Docker configuration for both services
- PostgreSQL database with Neon integration
- Better Auth with JWT tokens
- TypeScript error fixes and optimizations

## Requirements

### Frontend
- Node.js 20+
- npm or yarn

### Backend
- Python 3.13+
- UV package manager

### Infrastructure
- Docker and Docker Compose
- PostgreSQL (automatically configured with Neon)

## Setup

### Option 1: Run with Docker (Recommended)
```bash
# Clone the repository
git clone https://github.com/muhammadHamzaIsmaeel/todo-cli-app.git
cd todo-cli-app

# Checkout the completed phase-2 branch
git checkout phase-2

# Start all services with Docker Compose
docker-compose up --build
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- Database: PostgreSQL on localhost:5432

### Option 2: Manual Setup
#### Backend Setup
```bash
# Navigate to backend directory
cd backend

# Install dependencies with UV
uv sync

# Run the backend
uv run python -m src.todo.main
```

#### Frontend Setup
```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Create environment file with your backend URL
cp .env.local.example .env.local
# Edit .env.local to set your backend URL (for development, use http://localhost:8000)
# For production, use your deployed backend URL

# Run the development server
npm run dev
```

### Environment Variables
When deploying the frontend, make sure to set these environment variables:

```bash
NEXT_PUBLIC_API_URL=https://your-backend-domain.up.railway.app
NEXT_PUBLIC_BETTER_AUTH_URL=https://your-backend-domain.up.railway.app
```

For local development, use:
```bash
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_BETTER_AUTH_URL=http://localhost:8000
```

## Branches

This repository contains multiple branches representing the evolution of the application:
- `phase-1` - Original CLI application (Todo CLI App)
- `phase-2` - Complete full-stack web application with authentication
- `003-ai-chatbot-todo` - AI-powered chatbot for task management (current completed version)

## Project Structure

- `frontend/` - Next.js frontend application
- `backend/` - FastAPI backend application
- `docker-compose.yml` - Docker configuration for both services
- `specs/` - Feature specifications and plans
- `history/` - Development history and prompt records

## Architecture

### Frontend
- Next.js 16 with TypeScript
- Tailwind CSS for styling
- Better Auth for authentication
- Axios for API calls

### Backend
- FastAPI with Python 3.13
- SQLModel for database modeling
- PostgreSQL with Neon
- JWT authentication

### Infrastructure
- Docker containers for each service
- Docker Compose for orchestration
- Volume mounts for development
- Health checks for service dependencies"# todo-cli-app-phase-4" 
"# nexa-todo-app" 
"# nexa-todo-app" 
