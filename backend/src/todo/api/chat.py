"""Chat API for the AI Todo Chatbot"""
from fastapi import APIRouter, Depends, HTTPException, Request
from typing import Dict, Any
from sqlmodel import Session
from uuid import UUID
import logging
import json
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from ..database.session import get_session
from ..models.conversation import Conversation
from ..services.conversation_service import ConversationService
from ..agents.chat_agent import ChatAgent
from ..auth.jwt import verify_jwt_token
from pydantic import BaseModel
from ..mcp_tools.task_tools import add_task, list_tasks, update_task, delete_task, complete_task

logger = logging.getLogger(__name__)

# Initialize rate limiter
limiter = Limiter(key_func=get_remote_address)

# Create an alias to maintain the expected interface
def get_current_user(token_data=Depends(verify_jwt_token)):
    return token_data.user_id

chat_router = APIRouter(tags=["chat"])


class ChatRequest(BaseModel):
    message: str


@chat_router.post("/api/users/{user_id}/chat",
             summary="Process a chat message and return AI response",
             description="Receives a user message, processes it through the AI agent with conversation history, and returns the AI's response")
@limiter.limit("100/minute")
async def chat_endpoint(
    request: Request,
    user_id: str,
    chat_request: ChatRequest,
    session: Session = Depends(get_session),
    auth_user_id: str = Depends(get_current_user)
):
    # Verify user_id matches authenticated user
    if user_id != auth_user_id:
        raise HTTPException(status_code=403, detail="Access denied")

    # Initialize services
    conversation_service = ConversationService(session)
    agent = ChatAgent()  # Initialize OpenAI agent

    # Get or create conversation for user
    conversation = conversation_service.get_or_create_conversation(user_id)

    # Save user message to DB
    user_message = conversation_service.save_user_message(
        conversation_id=conversation.id,
        content=chat_request.message
    )

    # Load conversation history from DB
    messages = conversation_service.get_conversation_messages(conversation.id)

    # Build messages array for agent (convert to OpenAI format)
    agent_messages = []
    for msg in messages:
        agent_messages.append({
            "role": msg.role,
            "content": msg.content
        })

    # Run agent with conversation history
    response = await agent.run_conversation(
        messages=agent_messages,
        user_id=user_id
    )

    # Handle tool calls if present
    assistant_message_obj = response.choices[0].message

    # Check if AI wants to call a function/tool
    if hasattr(assistant_message_obj, 'tool_calls') and assistant_message_obj.tool_calls:
        logger.info(f"AI requested {len(assistant_message_obj.tool_calls)} tool calls")

        # Execute each tool call
        tool_results = []
        for tool_call in assistant_message_obj.tool_calls:
            function_name = tool_call.function.name
            function_args = json.loads(tool_call.function.arguments)

            # SECURITY: Always override user_id with the authenticated user's ID
            # This prevents the AI from accidentally or maliciously using a different user_id
            function_args["user_id"] = user_id

            logger.info(f"Executing tool: {function_name} with args: {function_args}")

            # Call the appropriate function
            if function_name == "add_task":
                result = await add_task(**function_args)
            elif function_name == "list_tasks":
                result = await list_tasks(**function_args)
            elif function_name == "update_task":
                result = await update_task(**function_args)
            elif function_name == "delete_task":
                result = await delete_task(**function_args)
            elif function_name == "complete_task":
                result = await complete_task(**function_args)
            else:
                result = {"error": f"Unknown function: {function_name}"}

            tool_results.append({
                "tool_call_id": tool_call.id,
                "role": "tool",
                "name": function_name,
                "content": json.dumps(result)
            })

        # Add assistant message with tool calls and tool results to messages
        agent_messages.append({
            "role": "assistant",
            "content": assistant_message_obj.content,
            "tool_calls": [
                {
                    "id": tc.id,
                    "type": "function",
                    "function": {
                        "name": tc.function.name,
                        "arguments": tc.function.arguments
                    }
                }
                for tc in assistant_message_obj.tool_calls
            ]
        })

        # Add tool results
        for tr in tool_results:
            agent_messages.append(tr)

        # Call OpenAI again with tool results to get final response
        logger.info("Calling OpenAI again with tool results")
        final_response = await agent.run_conversation(
            messages=agent_messages,
            user_id=user_id
        )

        agent_response = final_response.choices[0].message.content
    else:
        # No tool calls, extract content directly
        agent_response = assistant_message_obj.content

    # Ensure we have a valid response
    if not agent_response:
        agent_response = "I apologize, but I couldn't process your request. Please try again."

    # Save agent response to DB
    assistant_message = conversation_service.save_assistant_message(
        conversation_id=conversation.id,
        content=agent_response
    )

    # Return response
    return {
        "response": agent_response,
        "conversation_id": str(conversation.id),
        "timestamp": assistant_message.created_at.isoformat()
    }


@chat_router.get("/api/conversations/{conversation_id}",
            summary="Get conversation history",
            description="Retrieve the history of messages for a specific conversation")
@limiter.limit("50/minute")
async def get_conversation_history(
    request: Request,
    conversation_id: UUID,
    session: Session = Depends(get_session),
    auth_user_id: str = Depends(get_current_user)
):
    """Get conversation history for a specific conversation"""
    # Verify user has access to this conversation
    conversation_service = ConversationService(session)

    # Get conversation to verify it belongs to user
    conversation = session.get(Conversation, conversation_id)
    if not conversation:
        raise HTTPException(status_code=404, detail="Conversation not found")

    # Verify the conversation belongs to the authenticated user
    if conversation.user_id != auth_user_id:
        raise HTTPException(status_code=403, detail="Access denied")

    # Get all messages for this conversation
    messages = conversation_service.get_conversation_messages(conversation_id)

    return {
        "conversation": {
            "id": str(conversation.id),
            "user_id": conversation.user_id,
            "created_at": conversation.created_at.isoformat(),
            "updated_at": conversation.updated_at.isoformat()
        },
        "messages": [
            {
                "id": str(msg.id),
                "role": msg.role,
                "content": msg.content,
                "created_at": msg.created_at.isoformat()
            }
            for msg in messages
        ]
    }