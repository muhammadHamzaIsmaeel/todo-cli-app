"""
Integration Tests for API Endpoints in the Todo Full-Stack Web Application

Tests for API endpoints working together with database and authentication.
"""

import pytest
from sqlmodel import Session, create_engine
from sqlmodel.pool import StaticPool
from fastapi.testclient import TestClient
from unittest.mock import patch
from datetime import datetime

from src.todo.main import app
from src.todo.models.user import User
from src.todo.models.task import Task
from src.todo.database.session import get_session
from src.todo.auth.jwt import TokenData


# Create an in-memory SQLite database for testing
@pytest.fixture(name="engine")
def fixture_engine():
    engine = create_engine(
        "sqlite:///:memory:",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
    yield engine


@pytest.fixture(name="session")
def fixture_session(engine):
    # Create tables
    User.metadata.create_all(bind=engine)
    Task.metadata.create_all(bind=engine)

    with Session(engine) as session:
        yield session


@pytest.fixture(name="client")
def fixture_client(session):
    def get_session_override():
        return session

    app.dependency_overrides[get_session] = get_session_override
    client = TestClient(app)
    yield client
    app.dependency_overrides.clear()


def test_task_crud_operations(client, session):
    """Test full CRUD operations for tasks."""
    # Create a user
    user = User(email="test@example.com", name="Test User")
    session.add(user)
    session.commit()
    session.refresh(user)

    # Mock JWT token verification
    with patch('src.todo.auth.jwt.verify_jwt_token') as mock_verify:
        mock_verify.return_value = TokenData(user_id=user.id, email="test@example.com")

        # Create a task
        create_response = client.post("/api/tasks", json={
            "title": "Test Task",
            "description": "Test Description"
        })
        assert create_response.status_code == 200
        created_task = create_response.json()
        assert created_task["title"] == "Test Task"
        assert created_task["description"] == "Test Description"
        assert created_task["user_id"] == user.id
        assert created_task["completed"] is False

        # Get all tasks
        get_response = client.get("/api/tasks")
        assert get_response.status_code == 200
        tasks = get_response.json()
        assert len(tasks) == 1
        assert tasks[0]["title"] == "Test Task"

        # Update the task
        update_response = client.put(f"/api/tasks/{created_task['id']}", json={
            "title": "Updated Task",
            "description": "Updated Description"
        })
        assert update_response.status_code == 200
        updated_task = update_response.json()
        assert updated_task["title"] == "Updated Task"
        assert updated_task["description"] == "Updated Description"

        # Toggle task status
        toggle_response = client.patch(f"/api/tasks/{created_task['id']}/toggle-status")
        assert toggle_response.status_code == 200
        toggled_task = toggle_response.json()
        assert toggled_task["completed"] is True

        # Delete the task
        delete_response = client.delete(f"/api/tasks/{created_task['id']}")
        assert delete_response.status_code == 200
        assert delete_response.json()["message"] == "Task deleted successfully"

        # Verify task is deleted
        get_response = client.get("/api/tasks")
        assert get_response.status_code == 200
        tasks = get_response.json()
        assert len(tasks) == 0


def test_task_validation(client, session):
    """Test validation for task creation and updates."""
    # Create a user
    user = User(email="test@example.com", name="Test User")
    session.add(user)
    session.commit()
    session.refresh(user)

    # Mock JWT token verification
    with patch('src.todo.auth.jwt.verify_jwt_token') as mock_verify:
        mock_verify.return_value = TokenData(user_id=user.id, email="test@example.com")

        # Test creating task with invalid title (too long)
        response = client.post("/api/tasks", json={
            "title": "a" * 201,  # More than 200 characters
            "description": "Valid description"
        })
        assert response.status_code == 422  # Validation error

        # Test creating task with invalid description (too long)
        response = client.post("/api/tasks", json={
            "title": "Valid Title",
            "description": "a" * 1001  # More than 1000 characters
        })
        assert response.status_code == 422  # Validation error

        # Test creating task with empty title
        response = client.post("/api/tasks", json={
            "title": "",
            "description": "Valid description"
        })
        assert response.status_code == 422  # Validation error


def test_task_filtering(client, session):
    """Test filtering tasks by status."""
    # Create a user
    user = User(email="test@example.com", name="Test User")
    session.add(user)
    session.commit()
    session.refresh(user)

    # Create tasks with different statuses
    task1 = Task(title="Pending Task", user_id=user.id, completed=False)
    task2 = Task(title="Completed Task", user_id=user.id, completed=True)
    session.add(task1)
    session.add(task2)
    session.commit()

    # Mock JWT token verification
    with patch('src.todo.auth.jwt.verify_jwt_token') as mock_verify:
        mock_verify.return_value = TokenData(user_id=user.id, email="test@example.com")

        # Get all tasks
        response = client.get("/api/tasks")
        assert response.status_code == 200
        all_tasks = response.json()
        assert len(all_tasks) == 2

        # Get only pending tasks
        response = client.get("/api/tasks?status_filter=pending")
        assert response.status_code == 200
        pending_tasks = response.json()
        assert len(pending_tasks) == 1
        assert pending_tasks[0]["title"] == "Pending Task"
        assert pending_tasks[0]["completed"] is False

        # Get only completed tasks
        response = client.get("/api/tasks?status_filter=completed")
        assert response.status_code == 200
        completed_tasks = response.json()
        assert len(completed_tasks) == 1
        assert completed_tasks[0]["title"] == "Completed Task"
        assert completed_tasks[0]["completed"] is True


def test_authentication_required(client, session):
    """Test that authentication is required for task operations."""
    # Create a user and a task
    user = User(email="test@example.com", name="Test User")
    session.add(user)
    session.commit()
    session.refresh(user)

    task = Task(title="Test Task", user_id=user.id)
    session.add(task)
    session.commit()
    session.refresh(task)

    # Try to access task endpoints without authentication
    # This should fail because we don't have a valid JWT token

    # Create task without authentication
    create_response = client.post("/api/tasks", json={
        "title": "Unauthorized Task",
        "description": "Should fail"
    })
    # This might return 401/403 depending on how authentication is handled
    # For our test, we'll expect it to fail
    assert create_response.status_code in [401, 403]

    # Get tasks without authentication
    get_response = client.get("/api/tasks")
    assert get_response.status_code in [401, 403]

    # Update task without authentication
    update_response = client.put(f"/api/tasks/{task.id}", json={
        "title": "Updated without auth"
    })
    assert update_response.status_code in [401, 403]

    # Delete task without authentication
    delete_response = client.delete(f"/api/tasks/{task.id}")
    assert delete_response.status_code in [401, 403]


def test_api_health_check(client):
    """Test the root API endpoint."""
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "Todo API is running!"}


def test_task_not_found(client, session):
    """Test responses for non-existent tasks."""
    # Create a user
    user = User(email="test@example.com", name="Test User")
    session.add(user)
    session.commit()
    session.refresh(user)

    # Mock JWT token verification
    with patch('src.todo.auth.jwt.verify_jwt_token') as mock_verify:
        mock_verify.return_value = TokenData(user_id=user.id, email="test@example.com")

        # Try to get a non-existent task
        response = client.get("/api/tasks/99999")
        # This would typically return 404
        # But our current API doesn't have a single-task GET endpoint
        # This test is just to show the concept

        # Try to update a non-existent task
        response = client.put("/api/tasks/99999", json={
            "title": "Non-existent task"
        })
        assert response.status_code == 404

        # Try to delete a non-existent task
        response = client.delete("/api/tasks/99999")
        assert response.status_code == 404

        # Try to toggle status of a non-existent task
        response = client.patch("/api/tasks/99999/toggle-status")
        assert response.status_code == 404


def test_multiple_users_isolation(client, session):
    """Test that multiple users can use the API without interfering with each other."""
    # Create two users
    user1 = User(email="user1@example.com", name="User 1")
    user2 = User(email="user2@example.com", name="User 2")
    session.add(user1)
    session.add(user2)
    session.commit()
    session.refresh(user1)
    session.refresh(user2)

    # Add tasks for user1
    task1_user1 = Task(title="User 1 Task 1", user_id=user1.id)
    task2_user1 = Task(title="User 1 Task 2", user_id=user1.id)
    session.add(task1_user1)
    session.add(task2_user1)
    session.commit()

    # Add tasks for user2
    task1_user2 = Task(title="User 2 Task 1", user_id=user2.id)
    task2_user2 = Task(title="User 2 Task 2", user_id=user2.id)
    session.add(task1_user2)
    session.add(task2_user2)
    session.commit()

    # Test user1's access
    with patch('src.todo.auth.jwt.verify_jwt_token') as mock_verify:
        mock_verify.return_value = TokenData(user_id=user1.id, email="user1@example.com")

        response = client.get("/api/tasks")
        assert response.status_code == 200
        user1_tasks = response.json()
        assert len(user1_tasks) == 2
        for task in user1_tasks:
            assert task["user_id"] == user1.id

    # Test user2's access
    with patch('src.todo.auth.jwt.verify_jwt_token') as mock_verify:
        mock_verify.return_value = TokenData(user_id=user2.id, email="user2@example.com")

        response = client.get("/api/tasks")
        assert response.status_code == 200
        user2_tasks = response.json()
        assert len(user2_tasks) == 2
        for task in user2_tasks:
            assert task["user_id"] == user2.id