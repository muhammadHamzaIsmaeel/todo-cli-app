"""Unit tests for MCP tools in the AI Todo Chatbot"""
import pytest
from unittest.mock import Mock, AsyncMock, patch
from backend.src.todo.mcp_tools.task_tools import (
    add_task,
    list_tasks,
    update_task,
    delete_task,
    complete_task
)


@pytest.mark.asyncio
async def test_add_task_success():
    """Test successful addition of a task"""
    with patch('backend.src.todo.mcp_tools.task_tools.get_session') as mock_get_session:
        # Create a mock session
        mock_session = Mock()
        mock_task = Mock()
        mock_task.id = "test-task-id"
        mock_task.title = "Test task"
        mock_task.description = "Test description"
        mock_task.status = "pending"

        # Configure the session mock
        mock_session.add = Mock()
        mock_session.commit = Mock()
        mock_session.refresh = Mock(return_value=None)

        # Create generator that yields the mock session
        def session_generator():
            yield mock_session

        mock_get_session.return_value = session_generator()

        # Call the function
        result = await add_task(
            user_id="test-user-id",
            title="Test task",
            description="Test description"
        )

        # Assertions
        assert result["success"] is True
        assert result["task_id"] == "test-task-id"
        assert "has been added successfully!" in result["message"]


@pytest.mark.asyncio
async def test_list_tasks_success():
    """Test successful listing of tasks"""
    with patch('backend.src.todo.mcp_tools.task_tools.get_session') as mock_get_session:
        # Create a mock session
        mock_session = Mock()
        mock_task = Mock()
        mock_task.id = "test-task-id"
        mock_task.title = "Test task"
        mock_task.description = "Test description"
        mock_task.status = "pending"
        mock_task.created_at = "2023-01-01T00:00:00"

        # Configure the session mock
        mock_exec_result = Mock()
        mock_exec_result.all.return_value = [mock_task]
        mock_session.exec.return_value = mock_exec_result

        # Create generator that yields the mock session
        def session_generator():
            yield mock_session

        mock_get_session.return_value = session_generator()

        # Call the function
        result = await list_tasks(user_id="test-user-id")

        # Assertions
        assert len(result) == 1
        assert result[0]["title"] == "Test task"


@pytest.mark.asyncio
async def test_update_task_success():
    """Test successful update of a task"""
    with patch('backend.src.todo.mcp_tools.task_tools.get_session') as mock_get_session:
        # Create a mock session
        mock_session = Mock()
        mock_task = Mock()
        mock_task.id = "test-task-id"
        mock_task.title = "Updated task"
        mock_task.description = "Updated description"
        mock_task.status = "pending"

        # Configure the session mock
        mock_exec_result = Mock()
        mock_exec_result.first.return_value = mock_task
        mock_session.exec.return_value = mock_exec_result
        mock_session.add = Mock()
        mock_session.commit = Mock()
        mock_session.refresh = Mock(return_value=None)

        # Create generator that yields the mock session
        def session_generator():
            yield mock_session

        mock_get_session.return_value = session_generator()

        # Call the function
        result = await update_task(
            user_id="test-user-id",
            task_id="test-task-id",
            title="Updated task"
        )

        # Assertions
        assert result["success"] is True
        assert "has been updated successfully!" in result["message"]


@pytest.mark.asyncio
async def test_delete_task_success():
    """Test successful deletion of a task"""
    with patch('backend.src.todo.mcp_tools.task_tools.get_session') as mock_get_session:
        # Create a mock session
        mock_session = Mock()
        mock_task = Mock()
        mock_task.id = "test-task-id"

        # Configure the session mock
        mock_exec_result = Mock()
        mock_exec_result.first.return_value = mock_task
        mock_session.exec.return_value = mock_exec_result
        mock_session.delete = Mock()
        mock_session.commit = Mock()

        # Create generator that yields the mock session
        def session_generator():
            yield mock_session

        mock_get_session.return_value = session_generator()

        # Call the function
        result = await delete_task(
            user_id="test-user-id",
            task_id="test-task-id"
        )

        # Assertions
        assert result["success"] is True
        assert "has been deleted successfully!" in result["message"]


@pytest.mark.asyncio
async def test_complete_task_success():
    """Test successful completion of a task"""
    with patch('backend.src.todo.mcp_tools.task_tools.get_session') as mock_get_session:
        # Create a mock session
        mock_session = Mock()
        mock_task = Mock()
        mock_task.id = "test-task-id"
        mock_task.title = "Test task"
        mock_task.description = "Test description"
        mock_task.status = "completed"

        # Configure the session mock
        mock_exec_result = Mock()
        mock_exec_result.first.return_value = mock_task
        mock_session.exec.return_value = mock_exec_result
        mock_session.add = Mock()
        mock_session.commit = Mock()
        mock_session.refresh = Mock(return_value=None)

        # Create generator that yields the mock session
        def session_generator():
            yield mock_session

        mock_get_session.return_value = session_generator()

        # Call the function
        result = await complete_task(
            user_id="test-user-id",
            task_id="test-task-id"
        )

        # Assertions
        assert result["success"] is True
        assert "has been marked as complete!" in result["message"]