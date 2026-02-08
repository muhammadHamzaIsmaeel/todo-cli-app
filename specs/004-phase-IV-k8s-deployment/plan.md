# Implementation Plan: Local Kubernetes Deployment

**Branch**: `004-phase-IV-k8s-deployment` | **Date**: 2026-02-08 | **Spec**: [specs/004-phase-IV-k8s-deployment/spec.md](specs/004-phase-IV-k8s-deployment/spec.md)
**Input**: Feature specification from `/specs/004-phase-IV-k8s-deployment/spec.md`

**Note**: This template is filled in by the `/sp.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Containerize the Next.js frontend and FastAPI backend of the Todo Chatbot application using Docker AI Agent (Gordon) or standard Docker commands, then deploy to a local Minikube cluster using AI-assisted Helm charts generated via kubectl-ai/kagent tools. The solution will ensure the natural language task management functionality works properly in the Kubernetes environment with clean install/uninstall capabilities.

## Technical Context

**Language/Version**: Python 3.13+ (backend), Node.js 20+ (frontend)
**Primary Dependencies**: Docker, Kubernetes, Helm, Minikube, Gordon (Docker AI Agent), kubectl-ai, kagent
**Storage**: PostgreSQL database (Neon local equivalent or bitnami/postgresql Helm chart)
**Testing**: Docker image validation, Kubernetes pod status checks, application functionality tests
**Target Platform**: Local Kubernetes cluster (Minikube)
**Project Type**: Web application (containerized frontend/backend)
**Performance Goals**: Reasonable resource allocation (CPU/Memory limits appropriate for application)
**Constraints**: Local only - Minikube + Docker Desktop; Use monorepo from previous phases; Prefer AI tools (Gordon, kubectl-ai, kagent) for operations
**Scale/Scope**: Single instance deployment for local testing (1 replica for simplicity)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- Spec-Driven Development: Ensure detailed Markdown Spec exists before implementation ✓ (spec exists at specs/004-phase-IV-k8s-deployment/spec.md)
- Zero Manual Coding: Verify all production code will be generated through Claude Code ✓ (will use AI tools like Gordon, kubectl-ai, kagent for Dockerfiles and Helm charts)
- Clean, Maintainable & Professional Code: Confirm adherence to PEP8, type annotations, and modular structure ✓ (following established patterns from previous phases)
- Progressive Complexity: Verify reuse of previous phase's codebase where applicable ✓ (using monorepo from Phase III with Next.js frontend and FastAPI backend)
- Documentation First: Ensure README, CLAUDE.md, and specs history will be maintained ✓ (will update documentation with deployment instructions)
- Reproducibility: Confirm reviewers will be able to regenerate code from specs and prompts ✓ (using AI tools with documented prompts)

## Project Structure

### Documentation (this feature)

```text
specs/004-phase-IV-k8s-deployment/
├── plan.md              # This file (/sp.plan command output)
├── research.md          # Phase 0 output (/sp.plan command)
├── data-model.md        # Phase 1 output (/sp.plan command)
├── quickstart.md        # Phase 1 output (/sp.plan command)
├── contracts/           # Phase 1 output (/sp.plan command)
└── tasks.md             # Phase 2 output (/sp.tasks command - NOT created by /sp.plan)
```

### Source Code (repository root)

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

**Structure Decision**: Selected web application structure with separate frontend and backend components, containerized using Docker and deployed via Helm charts to a local Minikube cluster. This follows the existing architecture from Phase III while adding containerization and orchestration layers.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| Additional deployment layer | Kubernetes orchestration required for Phase IV | Direct Docker deployment insufficient for learning Kubernetes concepts |
| Multiple toolchain (Gordon, kubectl-ai, kagent) | AI-assisted DevOps tools required per spec | Manual Docker/Helm creation would not fulfill AI tool usage requirement |