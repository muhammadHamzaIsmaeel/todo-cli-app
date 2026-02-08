"""
User Isolation Tests for the Todo Full-Stack Web Application

Tests to verify that users can only access their own tasks and cannot access other users' tasks.
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
    from src.todo.models.user import User
    from src.todo.models.task import Task
    from src.todo.database.config import DATABASE_URL

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


def test_user_isolation_task_access(client, session):
    """Test that users can only access their own tasks."""

    # Create two users
    user1 = User(email="user1@example.com", name="User 1")
    user2 = User(email="user2@example.com", name="User 2")
    session.add(user1)
    session.add(user2)
    session.commit()
    session.refresh(user1)
    session.refresh(user2)

    # Create tasks for user1
    task1_user1 = Task(title="User 1 Task 1", user_id=user1.id)
    task2_user1 = Task(title="User 1 Task 2", user_id=user1.id)
    session.add(task1_user1)
    session.add(task2_user1)
    session.commit()

    # Create tasks for user2
    task1_user2 = Task(title="User 2 Task 1", user_id=user2.id)
    task2_user2 = Task(title="User 2 Task 2", user_id=user2.id)
    session.add(task1_user2)
    session.add(task2_user2)
    session.commit()

    # Mock JWT token verification for user1
    with patch('src.todo.auth.jwt.verify_jwt_token') as mock_verify:
        mock_verify.return_value = TokenData(user_id=user1.id, email="user1@example.com")

        # User1 should only see their own tasks
        response = client.get("/api/tasks")
        assert response.status_code == 200
        user1_tasks = response.json()

        # Should only have 2 tasks (user1's tasks)
        assert len(user1_tasks) == 2

        # Verify the tasks belong to user1
        for task in user1_tasks:
            assert task["user_id"] == user1.id
            assert task["title"] in ["User 1 Task 1", "User 1 Task 2"]


def test_user_cannot_access_other_users_task(client, session):
    """Test that users cannot access other users' tasks directly."""

    # Create two users
    user1 = User(email="user1@example.com", name="User 1")
    user2 = User(email="user2@example.com", name="User 2")
    session.add(user1)
    session.add(user2)
    session.commit()
    session.refresh(user1)
    session.refresh(user2)

    # Create a task for user2
    task_user2 = Task(title="User 2's Private Task", user_id=user2.id)
    session.add(task_user2)
    session.commit()
    session.refresh(task_user2)

    # Mock JWT token verification for user1
    with patch('src.todo.auth.jwt.verify_jwt_token') as mock_verify:
        mock_verify.return_value = TokenData(user_id=user1.id, email="user1@example.com")

        # User1 should not be able to access user2's task
        response = client.get(f"/api/tasks/{task_user2.id}")
        # This should return 404 or 403 since the task belongs to another user
        assert response.status_code in [404, 403]


def test_user_cannot_update_other_users_task(client, session):
    """Test that users cannot update other users' tasks."""

    # Create two users
    user1 = User(email="user1@example.com", name="User 1")
    user2 = User(email="user2@example.com", name="User 2")
    session.add(user1)
    session.add(user2)
    session.commit()
    session.refresh(user1)
    session.refresh(user2)

    # Create a task for user2
    task_user2 = Task(title="User 2's Private Task", user_id=user2.id)
    session.add(task_user2)
    session.commit()
    session.refresh(task_user2)

    # Mock JWT token verification for user1
    with patch('src.todo.auth.jwt.verify_jwt_token') as mock_verify:
        mock_verify.return_value = TokenData(user_id=user1.id, email="user1@example.com")

        # User1 should not be able to update user2's task
        response = client.put(f"/api/tasks/{task_user2.id}", json={
            "title": "User 1 trying to update User 2's task"
        })
        # This should return 404 or 403 since the task belongs to another user
        assert response.status_code in [404, 403]


def test_user_cannot_delete_other_users_task(client, session):
    """Test that users cannot delete other users' tasks."""

    # Create two users
    user1 = User(email="user1@example.com", name="User 1")
    user2 = User(email="user2@example.com", name="User 2")
    session.add(user1)
    session.add(user2)
    session.commit()
    session.refresh(user1)
    session.refresh(user2)

    # Create a task for user2
    task_user2 = Task(title="User 2's Private Task", user_id=user2.id)
    session.add(task_user2)
    session.commit()
    session.refresh(task_user2)

    # Mock JWT token verification for user1
    with patch('src.todo.auth.jwt.verify_jwt_token') as mock_verify:
        mock_verify.return_value = TokenData(user_id=user1.id, email="user1@example.com")

        # User1 should not be able to delete user2's task
        response = client.delete(f"/api/tasks/{task_user2.id}")
        # This should return 404 or 403 since the task belongs to another user
        assert response.status_code in [404, 403]


def test_multi_user_task_separation(client, session):
    """Test that multiple users have separate task lists."""

    # Create multiple users
    users = []
    for i in range(3):
        user = User(email=f"user{i}@example.com", name=f"User {i}")
        session.add(user)
        users.append(user)

    session.commit()

    # Create different number of tasks for each user
    tasks_created = []
    for i, user in enumerate(users):
        for j in range(i + 1):  # User 0 gets 1 task, user 1 gets 2 tasks, user 2 gets 3 tasks
            task = Task(title=f"User {i} Task {j}", user_id=user.id)
            session.add(task)
            tasks_created.append(task)

    session.commit()

    # Test each user can only see their own tasks
    for i, user in enumerate(users):
        with patch('src.todo.auth.jwt.verify_jwt_token') as mock_verify:
            mock_verify.return_value = TokenData(user_id=user.id, email=user.email)

            response = client.get("/api/tasks")
            assert response.status_code == 200
            user_tasks = response.json()

            # Each user should only see their own tasks
            assert len(user_tasks) == i + 1  # User i should have i+1 tasks

            # Verify all returned tasks belong to the current user
            for task in user_tasks:
                assert task["user_id"] == user.id