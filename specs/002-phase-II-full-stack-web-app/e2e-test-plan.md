# End-to-End Testing Plan

## Test Cases for Todo Full-Stack Web Application

### User Story 1: User Authentication and Task Creation

**Test 1.1: New user registration and task creation**
1. Navigate to `/signup` page
2. Fill in registration form with valid credentials
3. Submit registration form
4. Verify user is redirected to dashboard
5. Verify success message is displayed
6. Create a new task with valid title and description
7. Verify task appears in task list
8. Verify task data is correctly stored in database

**Test 1.2: Existing user login and task creation**
1. Navigate to `/login` page
2. Fill in login form with existing credentials
3. Submit login form
4. Verify user is redirected to dashboard
5. Verify session is established
6. Create a new task
7. Verify task appears in task list

### User Story 2: Task Management

**Test 2.1: View and filter tasks**
1. Login as existing user
2. Navigate to dashboard
3. Verify existing tasks are displayed
4. Apply status filters (all/pending/completed)
5. Verify correct tasks are shown for each filter

**Test 2.2: Update task details**
1. Login as existing user
2. Find an existing task in the list
3. Click edit button
4. Update task title and/or description
5. Save changes
6. Verify changes are reflected in the task list
7. Verify changes are persisted in database

**Test 2.3: Toggle task completion status**
1. Login as existing user
2. Find a pending task
3. Click completion toggle
4. Verify task is marked as completed (with visual feedback)
5. Find a completed task
6. Click completion toggle
7. Verify task is marked as pending

### User Story 3: Task Deletion and User Isolation

**Test 3.1: Delete task with confirmation**
1. Login as existing user
2. Find an existing task
3. Click delete button
4. Verify confirmation modal appears
5. Confirm deletion
6. Verify task is removed from task list
7. Verify task is removed from database

**Test 3.2: User data isolation**
1. Login as User A
2. Create several tasks
3. Logout
4. Login as User B
5. Verify User B cannot see User A's tasks
6. Create tasks for User B
7. Logout
8. Login as User A again
9. Verify User A only sees their own tasks
10. Verify User A cannot access User B's tasks

### Cross-Cutting Concerns

**Test 4.1: Dark/Light Mode**
1. Navigate to any page
2. Click theme toggle
3. Verify UI updates to new theme
4. Verify theme preference is saved
5. Refresh page
6. Verify theme preference persists

**Test 4.2: Responsive Design**
1. Open application on desktop
2. Verify layout is appropriate
3. Resize window to mobile size
4. Verify mobile menu appears
5. Verify all functionality remains accessible
6. Test all interactions on mobile view

## Testing Tools and Frameworks

- **Frontend**: Jest + React Testing Library for unit tests, Cypress for E2E tests
- **Backend**: Pytest for unit and integration tests
- **API**: Postman/Newman for API contract testing

## Test Execution

```bash
# Backend tests
cd backend
source .venv/bin/activate
python -m pytest tests/

# Frontend tests
cd frontend
npm test

# E2E tests (when implemented)
npx cypress run
```

## Success Criteria

- All tests pass consistently
- User stories are fully implemented and functional
- Security requirements are met (user isolation, authentication)
- Performance requirements are satisfied (response times < 1 second)
- UI/UX requirements are met (responsive, accessible, well-designed)