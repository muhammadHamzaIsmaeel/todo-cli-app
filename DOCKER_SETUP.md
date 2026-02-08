# Docker Setup for Nexa (Todo App)

This project uses Docker to containerize the backend (FastAPI) and frontend (Next.js) services.

## Prerequisites

1. Install Docker Desktop on your system (Windows, Mac, or Linux)
2. If using WSL2 (Windows), make sure to enable WSL integration in Docker Desktop settings:
   - Open Docker Desktop
   - Go to Settings > General
   - Check "Use the WSL 2 based engine"
   - Go to Settings > Resources > WSL Integration
   - Enable integration for your WSL distribution

## Docker Setup

The project includes:
- `backend/Dockerfile` - Builds the FastAPI backend
- `frontend/Dockerfile` - Builds the Next.js frontend
- `docker-compose.yml` - Composes all services (backend, frontend, and PostgreSQL)

## Running the Application

1. Navigate to the project root directory
2. Build and start the services:
   ```bash
   docker-compose up --build
   ```

3. The services will be available at:
   - Frontend: http://localhost:3000
   - Backend: http://localhost:8000
   - PostgreSQL: localhost:5432 (for external connections)

## Service Details

- **Frontend (Next.js)**: Runs on port 3000
  - Environment variables:
    - `NEXT_PUBLIC_API_URL`: Points to backend API
    - `NEXT_PUBLIC_BETTER_AUTH_URL`: Points to auth service

- **Backend (FastAPI)**: Runs on port 8000
  - Environment variables:
    - `DATABASE_URL`: PostgreSQL connection string
    - `BETTER_AUTH_SECRET`: JWT secret for authentication

- **PostgreSQL**: Runs on port 5432
  - Database: nexa_db
  - User: postgres
  - Password: postgres

## Development Notes

- The backend service includes volume mounting for hot-reloading during development
- The frontend service includes volume mounting and node_modules optimization
- PostgreSQL includes a health check to ensure it's ready before starting other services

## Troubleshooting

If you encounter issues:
1. Make sure Docker Desktop is running
2. Verify WSL integration is enabled (for WSL users)
3. Check that no other services are using ports 3000, 8000, or 5432
4. Run `docker-compose down` to stop all services before starting again