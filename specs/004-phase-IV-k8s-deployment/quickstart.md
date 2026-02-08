# Quickstart Guide: Local Kubernetes Deployment

## Overview

This guide provides step-by-step instructions for deploying the Todo Chatbot application to a local Minikube cluster using AI-assisted DevOps tools. The deployment includes containerized Next.js frontend and FastAPI backend services with PostgreSQL database.

## Prerequisites

Before starting, ensure you have the following tools installed:

### Required Tools
- **Docker Desktop** with Docker AI Agent (Gordon) enabled
- **Minikube** (latest version)
- **Helm** (version 3.x)
- **kubectl** (matching your Kubernetes version)
- **kubectl-ai** (AI-assisted kubectl commands)
- **kagent** (Kubernetes AI assistant)

### System Requirements
- At least 4GB RAM available for Minikube
- 20GB free disk space
- Internet connection for pulling images and charts

## Setup Instructions

### 1. Enable Gordon in Docker Desktop
1. Open Docker Desktop
2. Navigate to Settings > Features in development
3. Enable "Docker AI Agent (Gordon)"
4. Restart Docker Desktop if prompted

### 2. Start Minikube Cluster
```bash
# Start Minikube with sufficient resources
minikube start --memory=4096 --cpus=2

# Verify cluster is running
kubectl cluster-info
minikube status
```

### 3. Containerize Applications with Gordon
Use Gordon to generate Dockerfiles for both frontend and backend:

```bash
# For the frontend (Next.js application)
# Use Gordon with a prompt like: "Generate Dockerfile for Next.js app with ChatKit"
# Example Gordon command:
# gordon generate -t Dockerfile -c "Next.js frontend for Todo Chatbot with ChatKit integration"

# For the backend (FastAPI application)
# Use Gordon with a prompt like: "Generate multi-stage Dockerfile for FastAPI app with OpenAI Agents and MCP"
# Example Gordon command:
# gordon generate -t Dockerfile -c "FastAPI backend for Todo Chatbot with OpenAI Agents and MCP integration"
```

### 4. Build Docker Images
```bash
# Build frontend image
docker build -f Dockerfile.frontend -t nexa-frontend:latest .

# Build backend image
docker build -f Dockerfile.backend -t nexa-backend:latest .

# Verify images were built
docker images | grep nexa
```

### 5. Generate Helm Charts with AI Tools
Use kubectl-ai to generate Helm charts:

```bash
# Generate backend Helm chart
kubectl-ai "Create Helm chart for FastAPI backend deployment with PostgreSQL connection"

# Generate frontend Helm chart
kubectl-ai "Create Helm chart for Next.js frontend deployment with backend service connection"
```

Alternatively, use kagent:
```bash
# Use kagent to analyze requirements and generate charts
kagent analyze "Todo Chatbot deployment requirements" --generate-helm
```

### 6. Deploy PostgreSQL Database
```bash
# Add bitnami repository
helm repo add bitnami https://charts.bitnami.com/bitnami
helm repo update

# Install PostgreSQL
helm install postgres-db bitnami/postgresql \
  --set auth.postgresPassword=postgres \
  --set auth.database=nexa_db \
  --set persistence.enabled=true \
  --set persistence.size=1Gi
```

### 7. Deploy Application Components
```bash
# Deploy backend first (since frontend depends on it)
helm install nexa-backend ./helm/nexa-backend/

# Wait for backend to be ready
kubectl wait --for=condition=ready pod -l app=nexa-backend --timeout=300s

# Deploy frontend
helm install nexa-frontend ./helm/nexa-frontend/
```

### 8. Verify Deployment
```bash
# Check all pods are running
kubectl get pods

# Check services are available
kubectl get services

# Check Helm releases
helm list
```

## Access the Application

### Option 1: Port Forwarding
```bash
# Forward frontend port to local machine
kubectl port-forward svc/nexa-frontend 3000:80
```

Then access the application at `http://localhost:3000`

### Option 2: Minikube Tunnel
```bash
# Create tunnel to access LoadBalancer services
minikube tunnel
```

Get the frontend service IP:
```bash
kubectl get service nexa-frontend
```

## Testing the Application

Once deployed, verify the application functionality:

1. **Health Checks**:
   ```bash
   # Check backend health
   kubectl exec -it $(kubectl get pods -l app=nexa-backend -o jsonpath='{.items[0].metadata.name}') -- curl localhost:8000/health
   ```

2. **Application Flow**:
   - Access the frontend in your browser
   - Test natural language task management (e.g., "Add a task to buy groceries")
   - Verify tasks are persisted in the database

3. **Service Connectivity**:
   - Ensure frontend can communicate with backend
   - Verify database connections are working properly

## Troubleshooting

### Common Issues and Solutions

**Issue**: Pods stuck in Pending state
- **Solution**: Check resource availability with `kubectl describe nodes`
- Increase Minikube resources if needed

**Issue**: Database connection failures
- **Solution**: Verify PostgreSQL is running and credentials are correct
- Check environment variables in deployment configs

**Issue**: Frontend cannot connect to backend
- **Solution**: Verify service names and ports in frontend configuration
- Use `kubectl exec` to test connectivity between services

### AI-Assisted Debugging
Use kubectl-ai or kagent for troubleshooting:
```bash
# Analyze pod issues
kubectl-ai "analyze why pods in nexa-backend are not starting"

# Get optimization suggestions
kagent "analyze cluster health and suggest improvements"
```

## Cleanup

To remove the deployment:
```bash
# Uninstall Helm releases
helm uninstall nexa-frontend
helm uninstall nexa-backend
helm uninstall postgres-db

# Verify cleanup
helm list
kubectl get pods
```

## Next Steps

- Monitor application performance with kubectl-ai
- Scale deployments based on load requirements
- Set up monitoring and logging for production readiness
- Prepare for cloud deployment (Phase V)