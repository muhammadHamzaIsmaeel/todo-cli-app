# Nexa Todo Chatbot Development Guidelines

Auto-generated from all feature plans. Last updated: 2026-02-08

## Active Technologies

- Python 3.13+ + Standard library + UV for dependency management (001-todo-cli-app)
- In-memory (list/dict of task objects, no persistence) (001-todo-cli-app)
- Python 3.13+ with TypeScript/JavaScript for frontend + FastAPI (backend), OpenAI Agents SDK, Official MCP SDK, SQLModel, Neon PostgreSQL, OpenAI ChatKit (003-ai-chatbot-todo)
- Neon PostgreSQL database with Conversation and Message models (003-ai-chatbot-todo)
- Stateless chat architecture with conversation persistence in database (003-ai-chatbot-todo)
- AI-powered natural language processing for task management (003-ai-chatbot-todo)
- MCP tools for exposing stateless task operations to AI agents (003-ai-chatbot-todo)
- Docker, Kubernetes, Helm, Minikube, Gordon (Docker AI Agent), kubectl-ai, kagent (004-k8s-deployment)

## Project Structure

```text
# Web application (frontend + backend)
backend/
├── src/
│   ├── models/
│   ├── services/
│   └── api/
└── tests/

frontend/
├── src/
│   ├── components/
│   ├── pages/
│   └── services/
└── tests/

# Containerization & Deployment
Dockerfile.frontend      # Generated via Gordon or Claude Code
Dockerfile.backend       # Generated via Gordon or Claude Code
docker-compose.yml       # Optional for local testing
helm/
├── nexa-frontend/       # Helm chart for frontend (generated via kubectl-ai/kagent)
│   ├── templates/
│   │   ├── deployment.yaml
│   │   ├── service.yaml
│   │   └── ingress.yaml
│   ├── Chart.yaml
│   └── values.yaml
└── nexa-backend/        # Helm chart for backend (generated via kubectl-ai/kagent)
    ├── templates/
    │   ├── deployment.yaml
    │   ├── service.yaml
    │   └── configmap.yaml
    ├── Chart.yaml
    └── values.yaml

# Deployment Scripts
scripts/
├── minikube-start.sh    # Script to start minikube cluster
└── deploy.sh            # Script to deploy application to minikube
```

## Commands

### Docker Commands
- `docker build -f Dockerfile.frontend -t nexa-frontend:latest .` - Build frontend image
- `docker build -f Dockerfile.backend -t nexa-backend:latest .` - Build backend image
- `docker run nexa-frontend:latest` - Run frontend container locally
- `docker run nexa-backend:latest` - Run backend container locally

### Kubernetes Commands
- `minikube start --memory=4096 --cpus=2` - Start minikube cluster
- `kubectl get pods` - Check running pods
- `kubectl get services` - Check available services
- `kubectl port-forward svc/nexa-frontend 3000:80` - Forward frontend port

### Helm Commands
- `helm install nexa-backend ./helm/nexa-backend/` - Install backend Helm chart
- `helm install nexa-frontend ./helm/nexa-frontend/` - Install frontend Helm chart
- `helm list` - List installed Helm releases
- `helm uninstall nexa-frontend` - Uninstall frontend release

### AI Tool Commands
- `kubectl-ai "describe command"` - Use AI to generate kubectl commands
- `kagent analyze "requirement"` - Use AI to analyze cluster requirements

## Code Style

### Python
- Follow PEP8 standards
- Use type annotations for all function signatures
- Use f-strings for string formatting
- Use docstrings for all public functions and classes
- Use async/await for asynchronous operations

### TypeScript/JavaScript
- Use TypeScript with strict mode
- Use functional components with hooks in React
- Use proper error handling with try/catch blocks
- Use proper typing for props and state

## Recent Changes

- 004-k8s-deployment: Added containerization with Docker, Kubernetes deployment with Helm charts, local Minikube cluster setup, AI-assisted DevOps tools (Gordon, kubectl-ai, kagent)
- 003-ai-chatbot-todo: Added stateless chat endpoint with conversation persistence, OpenAI Agents SDK integration, MCP server for task operations, natural language processing for task management
- 002-full-stack-web-app: Added Next.js frontend with ChatKit integration, FastAPI backend, Better Auth authentication, Neon PostgreSQL database

<!-- MANUAL ADDITIONS START -->
<!-- MANUAL ADDITIONS END -->