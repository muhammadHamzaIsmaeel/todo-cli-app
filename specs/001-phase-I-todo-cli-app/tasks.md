---
description: "Task list for Todo CLI App implementation"
---

# Tasks: Todo CLI App

**Input**: Design documents from `/specs/001-todo-cli-app/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: The examples below include test tasks. Tests are OPTIONAL - only include them if explicitly requested in the feature specification.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Single project**: `src/`, `tests/` at repository root
- **Web app**: `backend/src/`, `frontend/src/`
- **Mobile**: `api/src/`, `ios/src/` or `android/src/`
- Paths shown below assume single project - adjust based on plan.md structure

## Constitution Compliance Checkpoints

### Spec-Driven Development
- [x] Verify detailed Markdown Spec exists before implementation begins (spec.md)
- [x] Confirm all tasks are derived from user stories in the specification
- [x] Ensure acceptance criteria from spec are reflected in test tasks

### Zero Manual Coding
- [x] Confirm all production code tasks will be generated via Claude Code
- [x] Verify no manual coding steps are included in implementation tasks
- [x] Ensure all code generation is done through specified tools (Claude Code)

### Clean, Maintainable & Professional Code
- [x] Verify adherence to PEP8 standards in code formatting tasks
- [x] Confirm type annotations are included in model/service implementation tasks
- [x] Include code review tasks to ensure modular structure

### Documentation First
- [x] Include documentation tasks in early phases (README, quickstart.md)
- [x] Add CLAUDE.md update tasks to track prompt history
- [x] Ensure specs history maintenance tasks are included

### Reproducibility
- [x] Include tasks to validate that specs can regenerate the same code
- [x] Add verification tasks to confirm prompt-response reproducibility
- [x] Ensure build and dependency management tasks are included

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Test User Story 1 independently
5. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (MVP!)
3. Add User Story 2 → Test independently → Deploy/Demo
4. Add User Story 3 → Test independently → Deploy/Demo
5. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1
   - Developer B: User Story 2
   - Developer C: User Story 3
3. Stories complete and integrate independently

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [x] T001 Create project structure per implementation plan using `uv init`
- [x] T002 Initialize Python project with UV dependencies in pyproject.toml
- [x] T003 [P] Configure linting and formatting tools (black, flake8, mypy)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

Examples of foundational tasks (adjust based on your project):

- [x] T004 Create the todo package structure with __init__.py file at src/todo/__init__.py
- [x] T005 [P] Implement Task dataclass model in src/todo/models.py with id, title, description, completed attributes
- [x] T006 [P] Setup InMemoryTodoRepository with basic CRUD methods in src/todo/repository.py
- [x] T007 Create main entry point file in src/todo/main.py
- [x] T008 Configure error handling and input validation utilities
- [x] T009 Setup basic CLI menu structure in src/todo/cli.py

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Add and View Tasks (Priority: P1) 🎯 MVP

**Goal**: User can add new tasks and see them displayed in an organized way with required title and optional description, then view all tasks with clear indication of completion status

**Independent Test**: User can successfully add a task with title and optional description, then view the task list showing the new task with its completion status and description

### Implementation for User Story 1

- [x] T010 [P] [US1] Implement add_task method in src/todo/repository.py with validation for title length (max 100 chars)
- [x] T011 [P] [US1] Implement get_all_tasks method in src/todo/repository.py
- [x] T012 [US1] Implement add task functionality in src/todo/cli.py with user input validation
- [x] T013 [US1] Implement view tasks functionality in src/todo/cli.py with formatted display
- [x] T014 [US1] Add menu option 1 for Add Task in src/todo/cli.py
- [x] T015 [US1] Add menu option 2 for View Tasks in src/todo/cli.py
- [x] T016 [US1] Add input validation for title (required, max 100 chars) and description (optional, max 500 chars) in src/todo/cli.py
- [x] T017 [US1] Add formatted display for tasks with ID, title, status ([✓]/[ ]), and description in src/todo/cli.py
- [x] T018 [US1] Test basic add and view functionality in main application loop

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - Update and Complete Tasks (Priority: P2)

**Goal**: User can modify existing tasks and mark them as complete when finished. They can update the title or description of a task by its ID, and toggle its completion status.

**Independent Test**: User can select a task by ID, update its information, and mark it as complete/incomplete with clear feedback.

### Implementation for User Story 2

- [x] T019 [P] [US2] Implement get_task_by_id method in src/todo/repository.py
- [x] T020 [P] [US2] Implement update_task method in src/todo/repository.py with validation
- [x] T021 [P] [US2] Implement toggle_task_status method in src/todo/repository.py
- [x] T022 [US2] Implement update task functionality in src/todo/cli.py with ID validation
- [x] T023 [US2] Implement mark complete/incomplete functionality in src/todo/cli.py
- [x] T024 [US2] Add menu option 3 for Update Task in src/todo/cli.py
- [x] T025 [US2] Add menu option 5 for Mark Complete/Incomplete in src/todo/cli.py
- [x] T026 [US2] Add validation for task ID existence and input validation in src/todo/cli.py
- [x] T027 [US2] Add clear feedback messages after each operation in src/todo/cli.py

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: User Story 3 - Delete Tasks (Priority: P3)

**Goal**: User can remove tasks they no longer need by ID and receive confirmation that it has been removed.

**Independent Test**: User can select a task by ID and delete it, with confirmation that the task is no longer in the list.

### Implementation for User Story 3

- [x] T028 [P] [US3] Implement delete_task method in src/todo/repository.py ensuring ID sequence continues without reuse
- [x] T029 [US3] Implement delete task functionality in src/todo/cli.py with ID validation
- [x] T030 [US3] Add menu option 4 for Delete Task in src/todo/cli.py
- [x] T031 [US3] Add confirmation message after successful deletion in src/todo/cli.py
- [x] T032 [US3] Add validation for task ID existence in src/todo/cli.py
- [x] T033 [US3] Test delete functionality ensuring ID sequence continues without reuse

**Checkpoint**: All user stories should now be independently functional

---

## Phase 6: Error Handling & Validation (Cross-Cutting Concerns)

**Goal**: Implement comprehensive error handling as specified in contracts

- [x] T034 [P] Add error handling for invalid task IDs across all operations in src/todo/cli.py
- [x] T035 [P] Implement stay-in-operation error handling as per spec in src/todo/cli.py
- [x] T036 Add validation for empty titles and handle appropriately in src/todo/cli.py
- [x] T037 Add handling for invalid menu selections in src/todo/cli.py
- [x] T038 Add meaningful feedback messages after each operation in src/todo/cli.py
- [x] T039 Test error scenarios to ensure application doesn't crash

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [x] T040 [P] Add README.md with setup and usage instructions
- [x] T041 [P] Add CLAUDE.md to document prompt history
- [x] T042 Code cleanup and refactoring
- [x] T043 [P] Add unit tests for repository methods in tests/unit/test_repository.py
- [x] T044 [P] Add integration tests for CLI in tests/integration/test_cli.py
- [x] T045 Run quickstart.md validation

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - User stories can then proceed in priority order (P1 → P2 → P3)
  - Or sequentially in priority order (P1 → P2 → P3)
- **Error Handling (Phase 6)**: Depends on all user stories having basic functionality
- **Polish (Final Phase)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - May integrate with US1 but should be independently testable
- **User Story 3 (P3)**: Can start after Foundational (Phase 2) - May integrate with US1/US2 but should be independently testable

### Within Each User Story

- Models before services
- Services before CLI functionality
- Core implementation before integration
- Story complete before moving to next priority

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel
- All Foundational tasks marked [P] can run in parallel (within Phase 2)
- All repository methods within each user story can be developed in parallel
- Different user stories can be worked on in parallel by different team members after foundational phase
- All tests can run in parallel

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Verify tests fail before implementing
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence