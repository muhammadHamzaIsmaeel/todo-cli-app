---
name: helm-chart-generation
description: AI-assisted Helm chart creation for Phase IV Kubernetes deployment using kubectl-ai and kagent. Covers generating charts for Nexa frontend (Next.js) and backend (FastAPI), values.yaml customization (replicas, env vars, ports), and deploying via helm install. Use for Phase IV Helm chart implementation.
---

# Helm Chart Generation

AI-assisted Helm chart creation for Phase IV Kubernetes deployment using kubectl-ai and kagent. Covers generating charts for Nexa frontend (Next.js) and backend (FastAPI), values.yaml customization (replicas, env vars, ports), and deploying via helm install. Use for Phase IV Helm chart implementation.

## Quick Start

- Initialize a new Helm chart with AI assistance using kubectl-ai
- Generate templates for frontend and backend services
- Customize values.yaml for environment-specific configurations
- Validate chart structure and dependencies
- Deploy charts using helm install with AI-guided commands

### Example kubectl-ai Prompts

```
"Create a Helm chart for a FastAPI backend with 2 replicas and PostgreSQL dependency"
```

```
"Generate Helm values for Next.js frontend with port 3000"
```

```
"Create ingress configuration for Next.js frontend in Helm chart"
```

```
"Add resource limits and requests to FastAPI backend deployment"
```

```
"Generate service account and RBAC for Helm chart"
```

## Architecture

| Component | Role | Details |
|-----------|------|---------|
| kubectl-ai | AI Assistant | Generates Helm chart templates and configurations |
| Helm Templates | Chart Structure | Kubernetes manifest templates with AI-optimized configurations |
| Values Customization | Configuration | Environment-specific settings for replicas, env vars, ports |
| Helm Install | Deployment | Installs charts to Kubernetes cluster (Minikube) |
| Minikube Pods | Runtime | Running application instances in Kubernetes |

## Key Decisions

| Decision | Option A | Option B | Recommendation |
|----------|----------|----------|----------------|
| Chart Structure | Separate charts | Umbrella chart | Separate charts for microservices independence |
| Service Exposure | Ingress | NodePort | Ingress for flexible routing and SSL termination |
| Secrets Handling | Helm Secrets | External Secrets | External Secrets for security compliance |
| Storage | Persistent Volumes | Ephemeral | Persistent Volumes for stateful components |

## Implementation Steps

1. **Initialize Helm Chart**
   - Create new chart with AI assistance using kubectl-ai
   - Set up proper directory structure with templates
   - Configure Chart.yaml with application metadata

2. **Generate Frontend Templates**
   - Create Deployment for Next.js frontend
   - Define Service and Ingress resources
   - Add ConfigMap for environment variables

3. **Generate Backend Templates**
   - Create Deployment for FastAPI backend
   - Define Service and health check configurations
   - Add database connection settings

4. **Configure Values**
   - Set replica counts in values.yaml
   - Define environment variables and ports
   - Configure resource limits and requests

5. **Deploy with Helm**
   - Package chart using `helm package`
   - Install chart with `helm install`
   - Validate deployment in Minikube

## Anti-Patterns

❌ **No values override** - Hardcoding values directly in templates instead of using values.yaml

❌ **Manual YAML edits** - Editing generated YAML files manually instead of using AI assistance

❌ **Missing health checks** - Not including readiness and liveness probes in deployments

❌ **No resource constraints** - Not setting CPU/memory limits causing resource contention

❌ **Insecure default configurations** - Setting default passwords or keys in charts

## Best Practices

✅ **Parameterized templates** - Use values for all configurable parameters

✅ **Standard labels** - Apply consistent labeling for identification and monitoring

✅ **Health checks** - Include readiness and liveness probes in deployments

✅ **Resource management** - Define appropriate resource limits and requests

✅ **Secure configurations** - Handle secrets securely using External Secrets or similar

## Template Structure

```
nexa-todo/
├── Chart.yaml
├── values.yaml
├── charts/
├── templates/
│   ├── NOTES.txt
│   ├── _helpers.tpl
│   ├── frontend/
│   │   ├── deployment.yaml
│   │   ├── service.yaml
│   │   └── ingress.yaml
│   ├── backend/
│   │   ├── deployment.yaml
│   │   ├── service.yaml
│   │   └── configmap.yaml
│   ├── tests/
│   └── _partials/
└── .helmignore
```

## Values Configuration

Key value groups to define:

- `frontend.replicaCount` - Number of frontend pod replicas
- `frontend.image.repository` - Frontend container image repository
- `frontend.service.port` - Frontend service port (default 3000)
- `backend.replicaCount` - Number of backend pod replicas
- `backend.image.repository` - Backend container image repository
- `backend.service.port` - Backend service port (default 8000)
- `ingress.enabled` - Enable/disable ingress resource
- `resources.*` - Resource limits and requests for all components

## AI-Assisted Generation

Use kubectl-ai to accelerate chart creation:

1. **Describe requirements** in natural language
2. **Generate templates** based on application architecture
3. **Optimize configurations** for performance and security
4. **Validate structures** against Kubernetes best practices
5. **Customize for environment** with AI-suggested values

## Related Skills

- `docker-gordon-integration` - For containerization before Helm deployment
- `minikube-deployment` - For local testing of Helm charts
- `kubernetes-manifests` - For alternative non-Helm Kubernetes deployments
- `container-security-scanning` - For validating container images in charts

## Troubleshooting

- Use `helm template` to preview generated manifests before deployment
- Validate chart dependencies with `helm dependency update`
- Check Kubernetes API version compatibility
- Verify RBAC permissions for chart installation
- Monitor release status with `helm status <release-name>`