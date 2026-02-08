"""Unit tests for the InMemoryTodoRepository."""

import pytest
from todo.repository import InMemoryTodoRepository
from todo.models import Task
from todo.utils import ValidationError, TaskNotFoundError


class TestInMemoryTodoRepository:
    """Test suite for InMemoryTodoRepository."""

    def setup_method(self):
        """Set up a fresh repository for each test."""
        self.repository = InMemoryTodoRepository()

    def test_add_task_success(self):
        """Test adding a task successfully."""
        task = self.repository.add_task("Test title", "Test description")

        assert task.id == 1
        assert task.title == "Test title"
        assert task.description == "Test description"
        assert task.completed is False

    def test_add_task_without_description(self):
        """Test adding a task without description."""
        task = self.repository.add_task("Test title")

        assert task.id == 1
        assert task.title == "Test title"
        assert task.description is None
        assert task.completed is False

    def test_add_task_title_validation(self):
        """Test adding a task with invalid title."""
        with pytest.raises(ValidationError):
            self.repository.add_task("")  # Empty title

        with pytest.raises(ValidationError):
            self.repository.add_task("A" * 101)  # Title too long

    def test_add_task_description_validation(self):
        """Test adding a task with invalid description."""
        with pytest.raises(ValidationError):
            self.repository.add_task("Valid title", "A" * 501)  # Description too long

    def test_get_all_tasks_empty(self):
        """Test getting all tasks when repository is empty."""
        tasks = self.repository.get_all_tasks()

        assert tasks == []

    def test_get_all_tasks_with_tasks(self):
        """Test getting all tasks when repository has tasks."""
        self.repository.add_task("Task 1")
        self.repository.add_task("Task 2", "Description 2")

        tasks = self.repository.get_all_tasks()

        assert len(tasks) == 2
        assert tasks[0].title == "Task 1"
        assert tasks[1].title == "Task 2"
        assert tasks[1].description == "Description 2"

    def test_get_task_by_id_success(self):
        """Test getting a task by ID successfully."""
        added_task = self.repository.add_task("Test task")

        retrieved_task = self.repository.get_task_by_id(added_task.id)

        assert retrieved_task.id == added_task.id
        assert retrieved_task.title == added_task.title
        assert retrieved_task.description == added_task.description
        assert retrieved_task.completed == added_task.completed

    def test_get_task_by_id_not_found(self):
        """Test getting a task by ID that doesn't exist."""
        with pytest.raises(TaskNotFoundError):
            self.repository.get_task_by_id(999)

    def test_update_task_title_success(self):
        """Test updating a task title successfully."""
        task = self.repository.add_task("Old title")

        updated_task = self.repository.update_task(task.id, title="New title")

        assert updated_task.id == task.id
        assert updated_task.title == "New title"
        assert updated_task.description == task.description

    def test_update_task_description_success(self):
        """Test updating a task description successfully."""
        task = self.repository.add_task("Title", "Old description")

        updated_task = self.repository.update_task(task.id, description="New description")

        assert updated_task.id == task.id
        assert updated_task.title == task.title
        assert updated_task.description == "New description"

    def test_update_task_both_fields_success(self):
        """Test updating both title and description successfully."""
        task = self.repository.add_task("Old title", "Old description")

        updated_task = self.repository.update_task(task.id, title="New title", description="New description")

        assert updated_task.id == task.id
        assert updated_task.title == "New title"
        assert updated_task.description == "New description"

    def test_update_task_title_validation(self):
        """Test updating task with invalid title."""
        task = self.repository.add_task("Valid title")

        with pytest.raises(ValidationError):
            self.repository.update_task(task.id, title="")  # Empty title

        with pytest.raises(ValidationError):
            self.repository.update_task(task.id, title="A" * 101)  # Title too long

    def test_update_task_description_validation(self):
        """Test updating task with invalid description."""
        task = self.repository.add_task("Valid title")

        with pytest.raises(ValidationError):
            self.repository.update_task(task.id, description="A" * 501)  # Description too long

    def test_update_task_not_found(self):
        """Test updating a task that doesn't exist."""
        with pytest.raises(TaskNotFoundError):
            self.repository.update_task(999, title="New title")

    def test_delete_task_success(self):
        """Test deleting a task successfully."""
        task = self.repository.add_task("Test task")

        result = self.repository.delete_task(task.id)

        assert result is True

        # Verify task is gone
        with pytest.raises(TaskNotFoundError):
            self.repository.get_task_by_id(task.id)

    def test_delete_task_not_found(self):
        """Test deleting a task that doesn't exist."""
        result = self.repository.delete_task(999)

        assert result is False

    def test_toggle_task_status(self):
        """Test toggling task completion status."""
        task = self.repository.add_task("Test task")

        # Initially False
        assert task.completed is False

        # Toggle to True
        toggled_task = self.repository.toggle_task_status(task.id)
        assert toggled_task.completed is True

        # Toggle back to False
        toggled_task = self.repository.toggle_task_status(task.id)
        assert toggled_task.completed is False

    def test_toggle_task_not_found(self):
        """Test toggling status of a task that doesn't exist."""
        with pytest.raises(TaskNotFoundError):
            self.repository.toggle_task_status(999)

    def test_id_sequence_continues_after_deletion(self):
        """Test that ID sequence continues without reuse after deletion."""
        task1 = self.repository.add_task("Task 1")
        task2 = self.repository.add_task("Task 2")

        assert task1.id == 1
        assert task2.id == 2

        # Delete task 1
        self.repository.delete_task(task1.id)

        # Next task should get ID 3, not reuse ID 1
        task3 = self.repository.add_task("Task 3")

        assert task3.id == 3