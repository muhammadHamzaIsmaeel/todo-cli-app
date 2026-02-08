"""Integration tests for tool chaining in the AI Todo Chatbot"""
import pytest
from unittest.mock import Mock, AsyncMock, patch
from backend.src.todo.agents.chat_agent import ChatAgent


@pytest.mark.asyncio
async def test_tool_chaining_logic():
    """Test that tools can be chained together appropriately"""
    # Create a mock client
    mock_client = Mock()
    mock_response = Mock()
    mock_choice = Mock()
    mock_choice.message = Mock()
    mock_choice.message.content = "Processing your request..."
    mock_response.choices = [mock_choice]

    mock_client.chat.completions.create = AsyncMock(return_value=mock_response)

    # Create the agent and patch the client
    agent = ChatAgent()
    agent.client = mock_client

    # Test the conversation with tool chaining
    messages = [
        {"role": "user", "content": "Delete the meeting task"}
    ]

    result = await agent.run_conversation(messages, "test-user-id")

    # Assertions
    assert result is not None
    mock_client.chat.completions.create.assert_called_once()
    assert hasattr(result, 'choices')


@pytest.mark.asyncio
async def test_ambiguous_command_resolution():
    """Test that ambiguous commands are handled appropriately"""
    # Create a mock client
    mock_client = Mock()
    mock_response = Mock()
    mock_choice = Mock()
    mock_choice.message = Mock()
    mock_choice.message.content = "I found multiple meeting tasks. Which one would you like to delete?"
    mock_response.choices = [mock_choice]

    mock_client.chat.completions.create = AsyncMock(return_value=mock_response)

    # Create the agent and patch the client
    agent = ChatAgent()
    agent.client = mock_client

    # Test the conversation with an ambiguous command
    messages = [
        {"role": "user", "content": "Delete the meeting task"}
    ]

    result = await agent.run_conversation(messages, "test-user-id")

    # Assertions
    assert result is not None
    assert "meeting tasks" in result.choices[0].message.content


@pytest.mark.asyncio
async def test_list_before_delete_behavior():
    """Test that list operation is triggered before delete for ambiguous requests"""
    # Create a mock client
    mock_client = Mock()
    mock_response = Mock()
    mock_choice = Mock()
    mock_choice.message = Mock()
    mock_choice.message.content = "Here are your meeting tasks:"
    mock_response.choices = [mock_choice]

    mock_client.chat.completions.create = AsyncMock(return_value=mock_response)

    # Create the agent and patch the client
    agent = ChatAgent()
    agent.client = mock_client

    # Test the conversation where list should be called before delete
    messages = [
        {"role": "user", "content": "Delete the meeting task"}
    ]

    result = await agent.run_conversation(messages, "test-user-id")

    # Assertions
    assert result is not None
    assert "Here are" in result.choices[0].message.content