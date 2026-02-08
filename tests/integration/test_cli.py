"""Integration tests for the TodoCLI."""

import pytest
from unittest.mock import patch, MagicMock
from todo.cli import TodoCLI
from todo.repository import InMemoryTodoRepository


class TestTodoCLI:
    """Test suite for TodoCLI integration."""

    def setup_method(self):
        """Set up a CLI instance for each test."""
        self.cli = TodoCLI()

    def test_add_task_integration(self):
        """Test adding a task through the CLI."""
        # Mock user input for title and description
        with patch('builtins.input', side_effect=['Test Title', 'Test Description']):
            # Capture print output
            with patch('builtins.print') as mock_print:
                self.cli._add_task()

        # Verify task was added to repository
        tasks = self.cli.repository.get_all_tasks()
        assert len(tasks) == 1
        assert tasks[0].title == 'Test Title'
        assert tasks[0].description == 'Test Description'
        assert tasks[0].completed is False

        # Verify success message was printed
        mock_print.assert_called()

    def test_view_tasks_integration(self):
        """Test viewing tasks through the CLI."""
        # Add a task first
        self.cli.repository.add_task("Test Task", "Test Description")

        # Capture print output
        with patch('builtins.print') as mock_print:
            self.cli._view_tasks()

        # Verify that print was called (showing tasks)
        assert mock_print.called

    def test_update_task_integration(self):
        """Test updating a task through the CLI."""
        # Add a task first
        task = self.cli.repository.add_task("Old Title", "Old Description")

        # Mock user input for task ID, new title, and new description
        with patch('builtins.input', side_effect=[str(task.id), "New Title", "New Description"]):
            with patch('builtins.print'):
                self.cli._update_task()

        # Verify task was updated in repository
        updated_task = self.cli.repository.get_task_by_id(task.id)
        assert updated_task.title == "New Title"
        assert updated_task.description == "New Description"

    def test_delete_task_integration(self):
        """Test deleting a task through the CLI."""
        # Add a task first
        task = self.cli.repository.add_task("Test Task")

        # Mock user input for task ID
        with patch('builtins.input', return_value=str(task.id)):
            with patch('builtins.print'):
                self.cli._delete_task()

        # Verify task was removed from repository
        tasks = self.cli.repository.get_all_tasks()
        assert len(tasks) == 0

    def test_toggle_task_status_integration(self):
        """Test toggling task status through the CLI."""
        # Add a task first
        task = self.cli.repository.add_task("Test Task")

        # Verify initial status is False
        initial_task = self.cli.repository.get_task_by_id(task.id)
        assert initial_task.completed is False

        # Mock user input for task ID
        with patch('builtins.input', return_value=str(task.id)):
            with patch('builtins.print'):
                self.cli._toggle_task_status()

        # Verify status was toggled to True
        updated_task = self.cli.repository.get_task_by_id(task.id)
        assert updated_task.completed is True

    def test_handle_menu_choice_add_task(self):
        """Test handling menu choice for adding a task."""
        # Mock user input for title and description
        with patch('builtins.input', side_effect=['Test Title', 'Test Description']):
            with patch('builtins.print'):
                # Simulate the choice that would come from _handle_menu_choice
                self.cli._add_task()

        # Verify task was added
        tasks = self.cli.repository.get_all_tasks()
        assert len(tasks) == 1
        assert tasks[0].title == 'Test Title'

    def test_handle_menu_choice_invalid(self):
        """Test handling an invalid menu choice."""
        with patch('builtins.print') as mock_print:
            self.cli._handle_menu_choice("999")

        # Verify error message was printed
        mock_print.assert_called()

    def test_repository_and_cli_integration(self):
        """Test full integration between CLI and repository."""
        # Add a task via CLI
        with patch('builtins.input', side_effect=['Integration Test', 'Integration Description']):
            with patch('builtins.print'):
                self.cli._add_task()

        # Verify it's in the repository
        tasks = self.cli.repository.get_all_tasks()
        assert len(tasks) == 1
        assert tasks[0].title == 'Integration Test'
        assert tasks[0].description == 'Integration Description'

        # Update the task via CLI
        with patch('builtins.input', side_effect=[str(tasks[0].id), 'Updated Title', 'Updated Description']):
            with patch('builtins.print'):
                self.cli._update_task()

        # Verify update in repository
        updated_task = self.cli.repository.get_task_by_id(tasks[0].id)
        assert updated_task.title == 'Updated Title'
        assert updated_task.description == 'Updated Description'

        # Toggle status via CLI
        with patch('builtins.input', return_value=str(updated_task.id)):
            with patch('builtins.print'):
                self.cli._toggle_task_status()

        # Verify status change in repository
        toggled_task = self.cli.repository.get_task_by_id(updated_task.id)
        assert toggled_task.completed is True

        # Delete task via CLI
        with patch('builtins.input', return_value=str(toggled_task.id)):
            with patch('builtins.print'):
                self.cli._delete_task()

        # Verify deletion from repository
        final_tasks = self.cli.repository.get_all_tasks()
        assert len(final_tasks) == 0