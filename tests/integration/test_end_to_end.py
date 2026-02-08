"""End-to-end integration tests for the AI Todo Chatbot"""
import pytest
from unittest.mock import Mock, AsyncMock, patch
from backend.src.todo.api.chat import chat_endpoint
from backend.src.todo.agents.chat_agent import ChatAgent
from backend.src.todo.services.conversation_service import ConversationService
from pydantic import BaseModel


class MockSession:
    """Mock database session for testing"""
    def __init__(self):
        self.add_calls = []
        self.commit_calls = []
        self.refresh_calls = []

    def add(self, obj):
        self.add_calls.append(obj)

    def commit(self):
        self.commit_calls.append(True)

    def refresh(self, obj):
        self.refresh_calls.append(obj)


@pytest.mark.asyncio
async def test_end_to_end_chat_flow():
    """Test the complete chat flow from request to response"""
    # Create mocks for dependencies
    mock_session = MockSession()
    mock_auth_user_id = "test-user-id"

    # Create a mock request
    class MockChatRequest(BaseModel):
        message: str = "Add a task to buy groceries"

    request = MockChatRequest()

    # Mock the services
    with patch('backend.src.todo.api.chat.ConversationService') as mock_conv_service_class:
        with patch('backend.src.todo.api.chat.ChatAgent') as mock_agent_class:
            # Create mock service instances
            mock_conv_service = Mock()
            mock_conversation = Mock()
            mock_conversation.id = "test-conversation-id"

            mock_conv_service.get_or_create_conversation.return_value = mock_conversation
            mock_conv_service.save_user_message.return_value = Mock()
            mock_conv_service.save_user_message.return_value.created_at = "2023-01-01T00:00:00"

            mock_messages = [
                Mock(),
                Mock()
            ]
            mock_messages[0].role = "user"
            mock_messages[0].content = "Add a task to buy groceries"
            mock_messages[1].role = "assistant"
            mock_messages[1].content = "Task 'buy groceries' has been added successfully!"

            mock_conv_service.get_conversation_messages.return_value = mock_messages

            mock_conv_service_class.return_value = mock_conv_service

            # Create mock agent
            mock_agent = Mock()
            mock_response = Mock()
            mock_choice = Mock()
            mock_choice.message = Mock()
            mock_choice.message.content = "Task 'buy groceries' has been added successfully!"
            mock_response.choices = [mock_choice]

            mock_agent.run_conversation = AsyncMock(return_value=mock_response)
            mock_agent_class.return_value = mock_agent

            # Call the endpoint
            result = await chat_endpoint(
                user_id="test-user-id",
                request=request,
                session=mock_session,
                auth_user_id=mock_auth_user_id
            )

            # Assertions
            assert result is not None
            assert "response" in result
            assert "groceries" in result["response"]
            assert "conversation_id" in result
            assert "timestamp" in result


@pytest.mark.asyncio
async def test_end_to_end_list_tasks_flow():
    """Test the complete flow for listing tasks"""
    # Create mocks for dependencies
    mock_session = MockSession()
    mock_auth_user_id = "test-user-id"

    # Create a mock request
    class MockChatRequest(BaseModel):
        message: str = "Show me all my tasks"

    request = MockChatRequest()

    # Mock the services
    with patch('backend.src.todo.api.chat.ConversationService') as mock_conv_service_class:
        with patch('backend.src.todo.api.chat.ChatAgent') as mock_agent_class:
            # Create mock service instances
            mock_conv_service = Mock()
            mock_conversation = Mock()
            mock_conversation.id = "test-conversation-id"

            mock_conv_service.get_or_create_conversation.return_value = mock_conversation
            mock_conv_service.save_user_message.return_value = Mock()
            mock_conv_service.save_user_message.return_value.created_at = "2023-01-01T00:00:00"

            mock_messages = [
                Mock(),
                Mock()
            ]
            mock_messages[0].role = "user"
            mock_messages[0].content = "Show me all my tasks"
            mock_messages[1].role = "assistant"
            mock_messages[1].content = "Here are your tasks: 1. Buy groceries, 2. Call mom"

            mock_conv_service.get_conversation_messages.return_value = mock_messages

            mock_conv_service_class.return_value = mock_conv_service

            # Create mock agent
            mock_agent = Mock()
            mock_response = Mock()
            mock_choice = Mock()
            mock_choice.message = Mock()
            mock_choice.message.content = "Here are your tasks: 1. Buy groceries, 2. Call mom"
            mock_response.choices = [mock_choice]

            mock_agent.run_conversation = AsyncMock(return_value=mock_response)
            mock_agent_class.return_value = mock_agent

            # Call the endpoint
            result = await chat_endpoint(
                user_id="test-user-id",
                request=request,
                session=mock_session,
                auth_user_id=mock_auth_user_id
            )

            # Assertions
            assert result is not None
            assert "response" in result
            assert "tasks" in result["response"]
            assert "conversation_id" in result


@pytest.mark.asyncio
async def test_end_to_end_error_handling():
    """Test the complete flow with error handling"""
    # Create mocks for dependencies
    mock_session = MockSession()
    mock_auth_user_id = "test-user-id"

    # Create a mock request
    class MockChatRequest(BaseModel):
        message: str = "Invalid command"

    request = MockChatRequest()

    # Mock the services with error scenarios
    with patch('backend.src.todo.api.chat.ConversationService') as mock_conv_service_class:
        with patch('backend.src.todo.api.chat.ChatAgent') as mock_agent_class:
            # Create mock service instances
            mock_conv_service = Mock()
            mock_conversation = Mock()
            mock_conversation.id = "test-conversation-id"

            mock_conv_service.get_or_create_conversation.return_value = mock_conversation
            mock_conv_service.save_user_message.return_value = Mock()
            mock_conv_service.save_user_message.return_value.created_at = "2023-01-01T00:00:00"

            mock_messages = [
                Mock(),
                Mock()
            ]
            mock_messages[0].role = "user"
            mock_messages[0].content = "Invalid command"
            mock_messages[1].role = "assistant"
            mock_messages[1].content = "I'm sorry, I didn't understand that command."

            mock_conv_service.get_conversation_messages.return_value = mock_messages

            mock_conv_service_class.return_value = mock_conv_service

            # Create mock agent that returns an error response
            mock_agent = Mock()
            mock_response = Mock()
            mock_choice = Mock()
            mock_choice.message = Mock()
            mock_choice.message.content = "I'm sorry, I didn't understand that command."
            mock_response.choices = [mock_choice]

            mock_agent.run_conversation = AsyncMock(return_value=mock_response)
            mock_agent_class.return_value = mock_agent

            # Call the endpoint
            result = await chat_endpoint(
                user_id="test-user-id",
                request=request,
                session=mock_session,
                auth_user_id=mock_auth_user_id
            )

            # Assertions
            assert result is not None
            assert "response" in result
            assert "conversation_id" in result