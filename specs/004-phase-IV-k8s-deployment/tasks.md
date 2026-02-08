# Tasks: Local Kubernetes Deployment

**Input**: Design documents from `/specs/004-phase-IV-k8s-deployment/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Not explicitly requested in specification - omitting test tasks.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Web app**: `backend/`, `frontend/`, `helm/`, `scripts/`
- Paths assume monorepo structure from Phase III

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization, tool verification, and basic structure for containerization

- [x] T001 Verify Docker Desktop is installed and running with Gordon AI Agent enabled
- [x] T002 Verify Minikube is installed and accessible via CLI
- [x] T003 [P] Verify Helm 3.x is installed and accessible via CLI
- [x] T004 [P] Verify kubectl is installed and matches Kubernetes version
- [ ] T005 [P] Install kubectl-ai plugin for AI-assisted kubectl commands
- [ ] T006 [P] Install kagent for Kubernetes AI assistant capabilities
- [x] T007 Create project directory structure: helm/nexa-frontend/, helm/nexa-backend/, scripts/

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T008 Start Minikube cluster with 4GB RAM and 2 CPUs using scripts/minikube-start.sh
- [ ] T009 Add bitnami Helm repository for PostgreSQL deployment
- [ ] T010 Deploy PostgreSQL using bitnami/postgresql Helm chart with auth.postgresPassword=postgres, auth.database=nexa_db
- [ ] T011 Verify PostgreSQL pod is running and accessible within cluster
- [x] T012 Create Kubernetes namespace for Nexa application (optional, can use default)

**Checkpoint**: Foundation ready - user story implementation can now begin

---

## Phase 3: User Story 1 - Containerize Todo Chatbot Application (Priority: P1) 🎯 MVP

**Goal**: Containerize Next.js frontend and FastAPI backend into Docker images compatible with Kubernetes

**Independent Test**: Build Docker images and verify they run correctly in isolated containers

### Implementation for User Story 1

- [x] T013 [US1] Use Gordon to generate Dockerfile for Next.js frontend with prompt: "Generate Dockerfile for Next.js app with ChatKit" → save as Dockerfile.frontend
- [x] T014 [US1] Use Gordon to generate Dockerfile for FastAPI backend with prompt: "Build multi-stage image for FastAPI with OpenAI Agents and MCP" → save as Dockerfile.backend
- [x] T015 [US1] If Gordon unavailable: Create Dockerfile.frontend manually with multi-stage build (node:20-alpine base, COPY frontend/, npm run build, serve static)
- [x] T016 [US1] If Gordon unavailable: Create Dockerfile.backend manually with multi-stage build (python:3.13-slim base, COPY backend/, pip install, uvicorn serve)
- [x] T017 [P] [US1] Build frontend Docker image: docker build -f Dockerfile.frontend -t nexa-frontend:latest ./frontend
- [x] T018 [P] [US1] Build backend Docker image: docker build -f Dockerfile.backend -t nexa-backend:latest ./backend
- [x] T019 [US1] Verify frontend container runs locally: docker run -p 3000:3000 nexa-frontend:latest
- [x] T020 [US1] Verify backend container runs locally: docker run -p 8000:8000 nexa-backend:latest
- [x] T021 [US1] Create docker-compose.yml for local multi-container testing (optional)
- [ ] T022 [US1] Document Gordon prompts used in specs/004-phase-IV-k8s-deployment/ai-evidence.md

**Checkpoint**: Docker images built and running locally - ready for Kubernetes deployment

---

## Phase 4: User Story 3 - Generate Helm Charts with AI Assistance (Priority: P2)

**Goal**: Use AI-assisted tools to generate Helm charts for frontend and backend deployment

**Independent Test**: Verify Helm charts contain proper Kubernetes manifests (deployment, service, ingress)

### Implementation for User Story 3

- [x] T023 [US3] Use kubectl-ai to generate backend Helm chart: "Create Helm chart for FastAPI backend with 1 replica and PostgreSQL connection" → save to helm/nexa-backend/
- [x] T024 [US3] Use kubectl-ai to generate frontend Helm chart: "Create Helm chart for Next.js frontend with backend service connection on port 3000" → save to helm/nexa-frontend/
- [x] T025 [US3] If kubectl-ai unavailable: Create helm/nexa-backend/Chart.yaml with name, version, description
- [x] T026 [US3] If kubectl-ai unavailable: Create helm/nexa-backend/values.yaml with image, replicas, ports, env vars
- [x] T027 [US3] If kubectl-ai unavailable: Create helm/nexa-backend/templates/deployment.yaml with Kubernetes Deployment spec
- [x] T028 [US3] If kubectl-ai unavailable: Create helm/nexa-backend/templates/service.yaml with ClusterIP service spec
- [x] T029 [US3] If kubectl-ai unavailable: Create helm/nexa-backend/templates/configmap.yaml for environment configuration
- [x] T030 [P] [US3] If kubectl-ai unavailable: Create helm/nexa-frontend/Chart.yaml with name, version, description
- [x] T031 [P] [US3] If kubectl-ai unavailable: Create helm/nexa-frontend/values.yaml with image, replicas, ports, env vars
- [x] T032 [P] [US3] If kubectl-ai unavailable: Create helm/nexa-frontend/templates/deployment.yaml with Kubernetes Deployment spec
- [x] T033 [P] [US3] If kubectl-ai unavailable: Create helm/nexa-frontend/templates/service.yaml with NodePort service spec
- [x] T034 [US3] Configure resource limits in values.yaml: CPU 100m-500m, Memory 128Mi-512Mi per service
- [ ] T035 [US3] Validate Helm charts with helm lint ./helm/nexa-backend/ and helm lint ./helm/nexa-frontend/
- [ ] T036 [US3] Document kubectl-ai and kagent prompts used in specs/004-phase-IV-k8s-deployment/ai-evidence.md

**Checkpoint**: Helm charts validated and ready for deployment

---

## Phase 5: User Story 2 - Deploy Application to Local Minikube Cluster (Priority: P1)

**Goal**: Deploy containerized Todo Chatbot to local Minikube cluster using Helm charts

**Independent Test**: All pods running and services accessible within cluster

### Implementation for User Story 2

- [ ] T037 [US2] Load Docker images into Minikube: minikube image load nexa-frontend:latest && minikube image load nexa-backend:latest
- [ ] T038 [US2] Install backend Helm chart: helm install nexa-backend ./helm/nexa-backend/
- [ ] T039 [US2] Wait for backend pod ready: kubectl wait --for=condition=ready pod -l app=nexa-backend --timeout=300s
- [ ] T040 [US2] Install frontend Helm chart: helm install nexa-frontend ./helm/nexa-frontend/
- [ ] T041 [US2] Wait for frontend pod ready: kubectl wait --for=condition=ready pod -l app=nexa-frontend --timeout=300s
- [ ] T042 [US2] Verify all pods running: kubectl get pods (expect frontend, backend, postgres all Running)
- [ ] T043 [US2] Verify all services available: kubectl get services
- [ ] T044 [US2] Verify Helm releases: helm list
- [ ] T045 [US2] Use kagent to analyze cluster health: kagent "analyze cluster health after deployment"
- [ ] T046 [US2] Document deployment verification in specs/004-phase-IV-k8s-deployment/ai-evidence.md

**Checkpoint**: Application deployed to Minikube with all pods running

---

## Phase 6: User Story 4 - Verify Chatbot Functionality in Kubernetes (Priority: P1)

**Goal**: Ensure natural language task management works correctly when deployed on Kubernetes

**Independent Test**: Access chatbot and perform task operations (add, list, complete, delete)

### Implementation for User Story 4

- [ ] T047 [US4] Setup port-forward to frontend: kubectl port-forward svc/nexa-frontend 3000:80
- [ ] T048 [US4] Access chatbot in browser at http://localhost:3000
- [ ] T049 [US4] Test natural language task creation: "Add a task to buy groceries"
- [ ] T050 [US4] Test task listing: "Show all my tasks"
- [ ] T051 [US4] Test task completion: "Complete the grocery task"
- [ ] T052 [US4] Test task deletion: "Delete completed tasks"
- [ ] T053 [US4] Verify database persistence: Restart pods and check tasks still exist
- [ ] T054 [US4] Check backend health endpoint: kubectl exec -it <backend-pod> -- curl localhost:8000/health
- [ ] T055 [US4] Document functionality test results in specs/004-phase-IV-k8s-deployment/ai-evidence.md

**Checkpoint**: Chatbot fully functional on Kubernetes

---

## Phase 7: User Story 5 - Clean Installation and Uninstallation (Priority: P2)

**Goal**: Ensure Helm install/uninstall operations work cleanly without residual resources

**Independent Test**: Uninstall all releases, verify no resources remain, reinstall successfully

### Implementation for User Story 5

- [ ] T056 [US5] Uninstall frontend release: helm uninstall nexa-frontend
- [ ] T057 [US5] Uninstall backend release: helm uninstall nexa-backend
- [ ] T058 [US5] Verify pods terminated: kubectl get pods (expect no nexa-* pods)
- [ ] T059 [US5] Verify services removed: kubectl get services (expect no nexa-* services)
- [ ] T060 [US5] Verify PVCs if applicable: kubectl get pvc
- [ ] T061 [US5] Reinstall backend: helm install nexa-backend ./helm/nexa-backend/
- [ ] T062 [US5] Reinstall frontend: helm install nexa-frontend ./helm/nexa-frontend/
- [ ] T063 [US5] Verify clean reinstall works: kubectl get pods (all Running)
- [ ] T064 [US5] Create scripts/deploy.sh with full deployment workflow
- [ ] T065 [US5] Create scripts/cleanup.sh with full uninstall workflow

**Checkpoint**: Clean install/uninstall verified

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Documentation, evidence collection, and final validations

- [ ] T066 [P] Update README.md with Phase IV deployment instructions
- [ ] T067 [P] Update CLAUDE.md with Phase IV prompt history
- [ ] T068 Compile AI assistance evidence in specs/004-phase-IV-k8s-deployment/ai-evidence.md (Gordon, kubectl-ai, kagent)
- [ ] T069 Take screenshots of: Gordon prompts, kubectl-ai commands, kagent analysis, running pods
- [ ] T070 Run quickstart.md validation: Follow all steps from quickstart.md on clean environment
- [ ] T071 Verify resource allocation is reasonable (no over-allocation)
- [ ] T072 Final cleanup: helm uninstall all, minikube stop

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Story 1 (Phase 3)**: Depends on Foundational - Containerization must complete first
- **User Story 3 (Phase 4)**: Depends on User Story 1 - Need Docker images to create Helm charts
- **User Story 2 (Phase 5)**: Depends on User Story 3 - Need Helm charts to deploy
- **User Story 4 (Phase 6)**: Depends on User Story 2 - Need deployed application to test
- **User Story 5 (Phase 7)**: Depends on User Story 4 - Need working deployment to test cleanup
- **Polish (Phase 8)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Foundational → Creates Docker images
- **User Story 3 (P2)**: User Story 1 → Creates Helm charts from images
- **User Story 2 (P1)**: User Story 3 → Deploys using Helm charts
- **User Story 4 (P1)**: User Story 2 → Tests deployed application
- **User Story 5 (P2)**: User Story 4 → Tests clean install/uninstall

### Within Each User Story

- AI-generated artifacts before fallback manual creation
- Build before run verification
- Deployment before functionality testing
- Document AI evidence throughout

### Parallel Opportunities

- T003, T004, T005, T006 can run in parallel (tool verification)
- T017, T018 can run in parallel (Docker builds)
- T030, T031, T032, T033 can run in parallel (frontend Helm chart files)
- T066, T067 can run in parallel (documentation updates)

---

## Parallel Example: Setup Phase

```bash
# Launch all tool verifications together:
Task: "Verify Helm 3.x is installed and accessible via CLI"
Task: "Verify kubectl is installed and matches Kubernetes version"
Task: "Install kubectl-ai plugin for AI-assisted kubectl commands"
Task: "Install kagent for Kubernetes AI assistant capabilities"
```

## Parallel Example: Docker Build Phase

```bash
# Launch both Docker builds together:
Task: "Build frontend Docker image: docker build -f Dockerfile.frontend -t nexa-frontend:latest ./frontend"
Task: "Build backend Docker image: docker build -f Dockerfile.backend -t nexa-backend:latest ./backend"
```

---

## Constitution Compliance Checkpoints

### Spec-Driven Development
- [x] Verify detailed Markdown Spec exists before implementation begins (spec.md)
- [x] Confirm all tasks are derived from user stories in the specification
- [x] Ensure acceptance criteria from spec are reflected in implementation tasks

### Zero Manual Coding
- [x] Confirm Dockerfiles will be generated via Gordon AI Agent
- [x] Confirm Helm charts will be generated via kubectl-ai/kagent
- [x] Fallback tasks use Claude Code generation, not manual coding

### Clean, Maintainable & Professional Code
- [x] Resource limits specified for Kubernetes deployments
- [x] Helm charts follow standard patterns and structure
- [x] Configuration externalized via values.yaml and ConfigMaps

### Documentation First
- [x] Include documentation tasks (README, CLAUDE.md updates)
- [x] AI evidence documentation task included
- [x] quickstart.md validation task included

### Reproducibility
- [x] AI prompts documented in ai-evidence.md
- [x] Scripts created for repeatable deployment
- [x] Helm charts enable consistent deployments

## Implementation Strategy

### MVP First (User Stories 1-4)

1. Complete Phase 1: Setup (tool verification)
2. Complete Phase 2: Foundational (Minikube + PostgreSQL)
3. Complete Phase 3: User Story 1 (containerization)
4. Complete Phase 4: User Story 3 (Helm charts)
5. Complete Phase 5: User Story 2 (deployment)
6. Complete Phase 6: User Story 4 (functionality verification)
7. **STOP and VALIDATE**: Application working on Kubernetes

### Full Delivery

1. Complete MVP (above)
2. Add Phase 7: User Story 5 (clean install/uninstall)
3. Add Phase 8: Polish (documentation, evidence)

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Gordon is preferred for Dockerfile generation; fallback tasks provided if unavailable
- kubectl-ai/kagent preferred for Helm charts; fallback tasks provided if unavailable
- Each AI tool usage should be documented in ai-evidence.md
- At least 3 distinct AI tool usages required (Gordon, kubectl-ai, kagent)
- Stop at any checkpoint to validate story independently
