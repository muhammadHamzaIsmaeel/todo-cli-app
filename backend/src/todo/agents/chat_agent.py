"""Chat Agent for the AI Todo Chatbot"""
from openai import AsyncOpenAI
from typing import Dict, Any, List
import os
import logging
from dotenv import load_dotenv
from pathlib import Path

# Load environment variables from backend/.env
env_path = Path(__file__).parent.parent.parent.parent / '.env'
logger_init = logging.getLogger(__name__)
logger_init.info(f"Attempting to load .env from: {env_path}")
logger_init.info(f".env file exists: {env_path.exists()}")

# Load with override to ensure .env values take precedence
load_dotenv(dotenv_path=env_path, override=True)

logger = logging.getLogger(__name__)

SYSTEM_PROMPT_TEMPLATE = """
You are an AI assistant that helps users manage their todo list through natural language commands.
You can add, list, update, delete, and mark tasks as complete.
Use the provided tools to interact with the user's task list.
Always confirm successful operations to the user.
If a user wants to delete a task but doesn't specify which one, list their tasks first to help them choose.
Be helpful, friendly, and provide clear confirmation messages.
Consider the conversation history when interpreting user requests to maintain context.

IMPORTANT: The current user's ID is: {user_id}
Always use this exact user_id when calling any tool functions. Never use a different user_id.
"""


class ChatAgent:
    def __init__(self):
        # Debug: Check what API key is being loaded
        api_key = os.getenv("OPENAI_API_KEY")
        logger.info(f"Loading OpenAI API key from env... Key exists: {api_key is not None}, Length: {len(api_key) if api_key else 0}")
        if api_key:
            logger.info(f"API key from os.getenv starts with: {api_key[:10]}...")

        # If placeholder or empty, try direct file read
        if not api_key or api_key.startswith("your_api"):
            logger.warning("Detected placeholder or missing API key, reading directly from .env file")
            try:
                env_file = Path(__file__).parent.parent.parent.parent / '.env'
                with open(env_file, 'r') as f:
                    for line in f:
                        if line.startswith('OPENAI_API_KEY='):
                            api_key = line.split('=', 1)[1].strip()
                            logger.info(f"Successfully read API key from file, starts with: {api_key[:10]}...")
                            break
            except Exception as e:
                logger.error(f"Error reading .env file: {e}")

        if not api_key or api_key.startswith("your_api"):
            logger.error("OPENAI_API_KEY is still placeholder or not set!")

        self.client = AsyncOpenAI(api_key=api_key)
        self.tools = [
            {
                "type": "function",
                "function": {
                    "name": "add_task",
                    "description": "Add a new task for the user",
                    "parameters": {
                        "type": "object",
                        "properties": {
                            "user_id": {"type": "string", "description": "The ID of the user"},
                            "title": {"type": "string", "description": "The title of the task"},
                            "description": {"type": "string", "description": "Optional description of the task"}
                        },
                        "required": ["user_id", "title"]
                    }
                }
            },
            {
                "type": "function",
                "function": {
                    "name": "list_tasks",
                    "description": "List tasks for the user. Returns tasks with id, title, description, completed (boolean), priority, and created_at fields.",
                    "parameters": {
                        "type": "object",
                        "properties": {
                            "user_id": {"type": "string", "description": "The ID of the user"},
                            "status": {"type": "string", "description": "Filter by status: 'all' (default), 'pending' (incomplete tasks), or 'completed' (finished tasks)"}
                        },
                        "required": ["user_id"]
                    }
                }
            },
            {
                "type": "function",
                "function": {
                    "name": "update_task",
                    "description": "Update an existing task",
                    "parameters": {
                        "type": "object",
                        "properties": {
                            "user_id": {"type": "string", "description": "The ID of the user"},
                            "task_id": {"type": "string", "description": "The ID of the task to update"},
                            "title": {"type": "string", "description": "New title for the task (optional)"},
                            "description": {"type": "string", "description": "New description for the task (optional)"}
                        },
                        "required": ["user_id", "task_id"]
                    }
                }
            },
            {
                "type": "function",
                "function": {
                    "name": "delete_task",
                    "description": "Delete a task",
                    "parameters": {
                        "type": "object",
                        "properties": {
                            "user_id": {"type": "string", "description": "The ID of the user"},
                            "task_id": {"type": "string", "description": "The ID of the task to delete"}
                        },
                        "required": ["user_id", "task_id"]
                    }
                }
            },
            {
                "type": "function",
                "function": {
                    "name": "complete_task",
                    "description": "Mark a task as complete",
                    "parameters": {
                        "type": "object",
                        "properties": {
                            "user_id": {"type": "string", "description": "The ID of the user"},
                            "task_id": {"type": "string", "description": "The ID of the task to complete"}
                        },
                        "required": ["user_id", "task_id"]
                    }
                }
            }
        ]

    async def run_conversation(self, messages: List[Dict], user_id: str) -> Any:
        # Prepend system message to conversation with the actual user_id
        # The messages list already includes the conversation history from the API endpoint
        system_prompt = SYSTEM_PROMPT_TEMPLATE.format(user_id=user_id)
        full_messages = [{"role": "system", "content": system_prompt}] + messages

        try:
            response = await self.client.chat.completions.create(
                model="gpt-4",
                messages=full_messages,
                tools=self.tools,
                tool_choice="auto"
            )
            logger.info(f"Successfully received response from OpenAI API for user {user_id}")
            return response
        except Exception as e:
            logger.error(f"Error calling OpenAI API for user {user_id}: {str(e)}")
            # Return a structured error response that can be handled by the calling function
            error_content = f"Sorry, I encountered an error processing your request. Please try again. Error details: {str(e)}"

            # Create a mock response object that mimics the expected structure
            class MockChoice:
                def __init__(self, content):
                    self.message = MockMessage(content)

            class MockMessage:
                def __init__(self, content):
                    self.content = content

            class MockResponse:
                def __init__(self, content):
                    self.choices = [MockChoice(content)]

            return MockResponse(error_content)