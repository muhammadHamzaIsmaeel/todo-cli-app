"""Integration tests for conversation persistence in the AI Todo Chatbot"""
import pytest
from unittest.mock import Mock, AsyncMock, patch
from backend.src.todo.services.conversation_service import ConversationService
from backend.src.todo.models.conversation import Conversation, Message


@pytest.mark.asyncio
async def test_conversation_creation_and_retrieval():
    """Test that conversations can be created and retrieved"""
    # Create a mock session
    mock_session = Mock()
    mock_conversation = Mock()
    mock_conversation.id = "test-conversation-id"
    mock_conversation.user_id = "test-user-id"

    # Configure the session mock
    mock_session.exec.return_value.first.return_value = None  # No existing conversation
    mock_session.add = Mock()
    mock_session.commit = Mock()
    mock_session.refresh = Mock(return_value=None)

    # Create the service and test
    service = ConversationService(mock_session)
    result = service.get_or_create_conversation("test-user-id")

    # Assertions
    assert result is not None
    mock_session.add.assert_called_once()
    mock_session.commit.assert_called_once()


@pytest.mark.asyncio
async def test_message_persistence():
    """Test that messages can be saved and retrieved"""
    from uuid import UUID

    # Create a mock session
    mock_session = Mock()
    mock_message = Mock()
    mock_message.id = "test-message-id"
    mock_message.conversation_id = "test-conversation-id"
    mock_message.role = "user"
    mock_message.content = "Test message"

    # Configure the session mock
    mock_session.add = Mock()
    mock_session.commit = Mock()
    mock_session.refresh = Mock(return_value=None)

    # Create the service and test
    service = ConversationService(mock_session)
    result = service.save_user_message(UUID("12345678-1234-5678-1234-567812345678"), "Test message")

    # Assertions
    assert result is not None
    mock_session.add.assert_called_once()
    mock_session.commit.assert_called_once()


@pytest.mark.asyncio
async def test_conversation_history_loading():
    """Test that conversation history can be loaded"""
    from uuid import UUID

    # Create mock messages
    mock_message1 = Mock()
    mock_message1.id = "msg1"
    mock_message1.role = "user"
    mock_message1.content = "Hello"
    mock_message1.created_at = "2023-01-01T00:00:00"

    mock_message2 = Mock()
    mock_message2.id = "msg2"
    mock_message2.role = "assistant"
    mock_message2.content = "Hi there!"
    mock_message2.created_at = "2023-01-01T00:00:01"

    # Create a mock session
    mock_session = Mock()
    mock_exec_result = Mock()
    mock_exec_result.all.return_value = [mock_message1, mock_message2]
    mock_session.exec.return_value = mock_exec_result

    # Create the service and test
    service = ConversationService(mock_session)
    result = service.get_conversation_messages(UUID("12345678-1234-5678-1234-567812345678"))

    # Assertions
    assert len(result) == 2
    assert result[0].content == "Hello"
    assert result[1].content == "Hi there!"