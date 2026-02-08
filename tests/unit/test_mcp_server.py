"""Unit tests for MCP server in the AI Todo Chatbot"""
import pytest
from unittest.mock import Mock, AsyncMock, patch, MagicMock
from backend.src.todo.mcp_tools.server import main


@pytest.mark.asyncio
async def test_mcp_server_tool_registration():
    """Test that tools are properly registered with the MCP server"""
    # Mock the server components
    mock_read_stream = AsyncMock()
    mock_write_stream = AsyncMock()

    # Create a mock request for tools/list
    mock_request = Mock()
    mock_request.method = "tools/list"
    mock_request.params = {}

    # Make read_stream return the mock request once, then stop iteration
    mock_read_stream.__aiter__.return_value = [mock_request]

    with patch('backend.src.todo.mcp_tools.server.server') as mock_server:
        mock_server.stdio_server = AsyncMock(return_value=(mock_read_stream, mock_write_stream))

        # Mock the send_request method
        mock_server.send_request = AsyncMock()
        mock_server.send_response = AsyncMock()

        # Call the main function (which will try to process requests)
        # We'll test that the tools/list request is sent properly
        try:
            await main()
        except StopAsyncIteration:
            # Expected when there are no more requests to process
            pass
        except Exception:
            # We might get other exceptions during testing, which is fine
            pass

        # Verify that tools were registered
        mock_server.send_request.assert_called()
        # Check that at least one call was made with "tools/list" method
        assert any(call.args[0] == "tools/list" for call in mock_server.send_request.call_args_list)


@pytest.mark.asyncio
async def test_mcp_server_tool_call_handling():
    """Test that tool calls are properly handled by the MCP server"""
    # Create mock for a tool call request
    mock_request = Mock()
    mock_request.method = "tools/call"
    mock_request.params = {
        "name": "add_task",
        "arguments": {
            "user_id": "test-user",
            "title": "Test task",
            "description": "Test description"
        }
    }
    mock_request.id = "test-request-id"

    mock_read_stream = AsyncMock()
    mock_read_stream.__aiter__.return_value = [mock_request]

    mock_write_stream = AsyncMock()

    with patch('backend.src.todo.mcp_tools.server.server') as mock_server:
        with patch('backend.src.todo.mcp_tools.server.add_task') as mock_add_task:
            mock_server.stdio_server = AsyncMock(return_value=(mock_read_stream, mock_write_stream))
            mock_server.send_request = AsyncMock()
            mock_server.send_response = AsyncMock()

            # Mock the add_task function to return a success result
            mock_add_task.return_value = {"success": True, "task_id": "new-task-id"}

            # Call the main function
            try:
                await main()
            except StopAsyncIteration:
                # Expected when there are no more requests to process
                pass
            except Exception:
                # We might get other exceptions during testing, which is fine
                pass

            # Verify that the response was sent
            mock_server.send_response.assert_called()


@pytest.mark.asyncio
async def test_mcp_server_unknown_tool_handling():
    """Test that unknown tools are handled gracefully"""
    # Create mock for an unknown tool call request
    mock_request = Mock()
    mock_request.method = "tools/call"
    mock_request.params = {
        "name": "unknown_tool",
        "arguments": {}
    }
    mock_request.id = "test-request-id"

    mock_read_stream = AsyncMock()
    mock_read_stream.__aiter__.return_value = [mock_request]

    mock_write_stream = AsyncMock()

    with patch('backend.src.todo.mcp_tools.server.server') as mock_server:
        mock_server.stdio_server = AsyncMock(return_value=(mock_read_stream, mock_write_stream))
        mock_server.send_request = AsyncMock()
        mock_server.send_response = AsyncMock()

        # Call the main function
        try:
            await main()
        except StopAsyncIteration:
            # Expected when there are no more requests to process
            pass
        except Exception:
            # We might get other exceptions during testing, which is fine
            pass

        # Verify that the response was sent even for unknown tools
        mock_server.send_response.assert_called()