---
name: DockerGordonIntegration
description: Use Docker AI Agent (Gordon) for intelligent containerization in Phase IV. Covers enabling Gordon in Docker Desktop, generating Dockerfiles for Next.js frontend and FastAPI backend, multi-stage builds, docker-compose for local testing, and fallback to standard Docker commands if Gordon unavailable. Essential for Phase IV containerization of Nexa Todo Chatbot.
---

# Docker Gordon Integration

Use Docker AI Agent (Gordon) for intelligent containerization in Phase IV. Covers enabling Gordon in Docker Desktop, generating Dockerfiles for Next.js frontend and FastAPI backend, multi-stage builds, docker-compose for local testing, and fallback to standard Docker commands if Gordon unavailable. Essential for Phase IV containerization of Nexa Todo Chatbot.

## Quick Start

- Enable Docker AI Agent (Gordon) in Docker Desktop settings
- Generate multi-stage Dockerfiles for Next.js frontend and FastAPI backend services
- Create docker-compose.yml for local testing with proper networking and volumes
- Use Gordon for intelligent optimization of container layers and dependencies
- Fallback to standard Docker commands when Gordon is unavailable

### Example Gordon Prompts

```
"Generate a multi-stage Dockerfile for a Next.js app with ChatKit"
```

```
"Create docker-compose.yml for frontend and backend services"
```

```
"Optimize this Dockerfile for smaller image size"
```

```
"Create multi-stage Dockerfile for FastAPI backend with production and dev builds"
```

## Architecture

| Component | Role | Details |
|-----------|------|---------|
| Gordon AI Agent | Containerization Intelligence | Analyzes codebase and generates optimized Docker configurations |
| Dockerfile Generation | Build Configuration | Creates multi-stage builds with proper layer caching |
| Image Build Process | Container Creation | Builds optimized images with minimal attack surface |
| Minikube Deployment | Local Testing | Deploys containerized application locally for testing |

## Key Decisions

| Decision | Option A | Option B | Recommendation |
|----------|----------|----------|----------------|
| Build Strategy | Multi-stage | Single-stage | Multi-stage for smaller production images |
| Environment Variables | Build-time | Runtime | Runtime via docker-compose for flexibility |
| Port Configuration | Static | Dynamic | Static for consistency, configurable via env |
| Volume Mounts | Named volumes | Bind mounts | Named volumes for persistence, bind for dev |

## Implementation Steps

1. **Enable Gordon AI Agent**
   - Install Docker Desktop with AI Agent capability
   - Enable Gordon in Docker Desktop settings
   - Verify Gordon is accessible via Docker CLI

2. **Generate Frontend Dockerfile**
   - Create multi-stage build for Next.js application
   - Separate build and production stages
   - Optimize layer caching with dependency installation first

3. **Generate Backend Dockerfile**
   - Create multi-stage build for FastAPI application
   - Include proper Python dependency management
   - Add security scanning in build process

4. **Create docker-compose.yml**
   - Define services for frontend and backend
   - Configure networking between services
   - Set up volume mounts for development
   - Add environment variables and secrets management

## Anti-Patterns

❌ **No multi-stage builds** - Creates unnecessarily large images with build dependencies exposed

❌ **Hardcoded secrets in Dockerfiles** - Exposes sensitive information in image layers

❌ **Running containers as root** - Increases security risk

❌ **Large base images** - Slows down builds and increases attack surface

❌ **No .dockerignore files** - Includes unnecessary files in build context

## Best Practices

✅ **Use official base images** - Leverage trusted, optimized base images

✅ **Multi-stage builds** - Separate build and runtime environments

✅ **Layer caching optimization** - Order Dockerfile instructions for maximum cache reuse

✅ **Security scanning** - Include vulnerability scanning in build process

✅ **Environment-specific configurations** - Use docker-compose overrides for different environments

## Related Skills

- `helm-chart-generation` - For Kubernetes deployment using Helm charts
- `minikube-deployment` - For local Kubernetes testing and development
- `kubernetes-manifests` - For production Kubernetes deployments
- `container-security-scanning` - For security validation of container images

## Troubleshooting

- If Gordon is unavailable, use standard Docker commands with best practices
- Verify Docker Desktop AI Agent is properly licensed and enabled
- Check internet connectivity for Gordon's cloud-based processing
- Ensure sufficient disk space for multi-stage builds
- Monitor build context size to avoid performance issues