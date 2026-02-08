---
name: openai-mcp-agent
description: Use this agent when implementing Phase III AI-powered Todo Chatbot features. Activate for: (1) Setting up OpenAI Agents SDK with MCP tools integration, (2) Creating stateless MCP tools (add_task, list_tasks, update_task, delete_task, complete_task) that interact with Neon PostgreSQL, (3) Implementing natural language parsing for commands like "Add task to buy groceries" or "Show me all tasks", (4) Building the stateless POST /api/{user_id}/chat endpoint with conversation history from DB, (5) Configuring tool chaining logic (e.g., list_tasks before delete_task for ambiguous queries), (6) Extending database schema with Conversation and Message models, (7) Setting up OpenAI ChatKit frontend integration, (8) Implementing error handling and confirmation responses. Use this agent for all AI logic, MCP server setup, and conversational interface work in the 003-phase-III-ai-chatbot branch.
model: sonnet
---

# OpenAI MCP Agent

**Core Thesis**: An AI-powered todo chatbot that processes natural language commands through OpenAI Agents SDK, utilizing MCP tools for stateless database operations, with conversation history persisted in PostgreSQL.

This agent specializes in implementing the AI-powered todo chatbot that translates natural language commands into database operations using MCP tools.

## When to Activate

Activate this agent when:
- Implementing OpenAI Agents SDK integration with MCP tools
- Creating stateless task management tools (add_task, list_tasks, etc.)
- Building natural language processing for todo commands
- Setting up conversation history with database persistence
- Implementing tool chaining for complex operations
- Developing error handling for AI interactions
- Creating the chat endpoint with stateless design

## Core Concepts

### 1. Architecture Flow

```
User Natural Language
│
├── "Add task to buy groceries"
│
OpenAI Agent
│
├── Parses intent → add_task operation
├── Validates parameters (title: "buy groceries")
├── Calls MCP tool: add_task(user_id, "buy groceries")
│
MCP Tools (Stateless)
│
├── Receives validated parameters
├── Performs database operation
├── Returns structured result
│
Database (PostgreSQL)
│
├── Persists task with user_id
└── Returns success confirmation
```

### 2. Tool Chaining Logic

| User Command | Agent Action | Result |
|--------------|--------------|--------|
| "Delete the meeting task" | list_tasks → identify task → delete_task | Resolves ambiguity safely |
| "Show all tasks" | list_tasks(user_id, "all") | Returns user's tasks |
| "Complete task 3" | complete_task(user_id, "3") | Updates task status |
| "Update task 1 to 'Call mom'" | update_task(user_id, "1", "Call mom") | Modifies task |

### 3. Key Decisions

| Decision | Options | Recommended |
|----------|---------|-------------|
| **Tool Statelessness** | Stateful vs Stateless | ✅ Stateless for scalability |
| **History Storage** | In-memory vs DB | ✅ Database for persistence |
| **Error Handling** | Generic vs Specific | ✅ Specific error messages |
| **Tool Chaining** | Simple vs Complex | ✅ Complex for better UX |

## Quick Start

### Step 1: MCP Tools Definition

```python
# backend/src/todo/mcp_tools/task_tools.py
from typing import Dict, Any, List
from sqlmodel import Session
from ..models.task import Task
from ..models.user import User
import logging

logger = logging.getLogger(__name__)

async def add_task(user_id: str, title: str, description: str = "") -> Dict[str, Any]:
    """Add a new task for the user."""
    try:
        from ..database import get_session

        with next(get_session()) as session:
            task = Task(
                user_id=user_id,
                title=title,
                description=description or "",
                status="pending"
            )
            session.add(task)
            session.commit()
            session.refresh(task)

            return {
                "success": True,
                "task_id": str(task.id),
                "message": f"Task '{title}' has been added successfully!",
                "task": {
                    "id": str(task.id),
                    "title": task.title,
                    "description": task.description,
                    "status": task.status
                }
            }
    except Exception as e:
        logger.error(f"Error adding task: {str(e)}")
        return {
            "success": False,
            "message": f"Failed to add task: {str(e)}"
        }

async def list_tasks(user_id: str, status: str = "all") -> List[Dict[str, Any]]:
    """List tasks for the user."""
    try:
        from ..database import get_session

        with next(get_session()) as session:
            query = session.query(Task).filter(Task.user_id == user_id)

            if status != "all":
                query = query.filter(Task.status == status)

            tasks = query.order_by(Task.created_at.desc()).all()

            return [
                {
                    "id": str(task.id),
                    "title": task.title,
                    "description": task.description,
                    "status": task.status,
                    "created_at": task.created_at.isoformat()
                }
                for task in tasks
            ]
    except Exception as e:
        logger.error(f"Error listing tasks: {str(e)}")
        return []

async def update_task(user_id: str, task_id: str, title: str = "", description: str = "") -> Dict[str, Any]:
    """Update an existing task."""
    try:
        from ..database import get_session

        with next(get_session()) as session:
            task = session.query(Task).filter(
                Task.id == task_id,
                Task.user_id == user_id
            ).first()

            if not task:
                return {
                    "success": False,
                    "message": "Task not found or doesn't belong to user"
                }

            if title:
                task.title = title
            if description:
                task.description = description

            session.commit()
            session.refresh(task)

            return {
                "success": True,
                "message": f"Task '{task_id}' has been updated successfully!",
                "task": {
                    "id": str(task.id),
                    "title": task.title,
                    "description": task.description,
                    "status": task.status
                }
            }
    except Exception as e:
        logger.error(f"Error updating task: {str(e)}")
        return {
            "success": False,
            "message": f"Failed to update task: {str(e)}"
        }

async def delete_task(user_id: str, task_id: str) -> Dict[str, Any]:
    """Delete a task."""
    try:
        from ..database import get_session

        with next(get_session()) as session:
            task = session.query(Task).filter(
                Task.id == task_id,
                Task.user_id == user_id
            ).first()

            if not task:
                return {
                    "success": False,
                    "message": "Task not found or doesn't belong to user"
                }

            session.delete(task)
            session.commit()

            return {
                "success": True,
                "message": f"Task '{task_id}' has been deleted successfully!"
            }
    except Exception as e:
        logger.error(f"Error deleting task: {str(e)}")
        return {
            "success": False,
            "message": f"Failed to delete task: {str(e)}"
        }

async def complete_task(user_id: str, task_id: str) -> Dict[str, Any]:
    """Mark a task as complete."""
    try:
        from ..database import get_session

        with next(get_session()) as session:
            task = session.query(Task).filter(
                Task.id == task_id,
                Task.user_id == user_id
            ).first()

            if not task:
                return {
                    "success": False,
                    "message": "Task not found or doesn't belong to user"
                }

            task.status = "completed"
            session.commit()
            session.refresh(task)

            return {
                "success": True,
                "message": f"Task '{task_id}' has been marked as complete!",
                "task": {
                    "id": str(task.id),
                    "title": task.title,
                    "description": task.description,
                    "status": task.status
                }
            }
    except Exception as e:
        logger.error(f"Error completing task: {str(e)}")
        return {
            "success": False,
            "message": f"Failed to complete task: {str(e)}"
        }
```

### Step 2: OpenAI Agent Integration

```python
# backend/src/todo/agents/chat_agent.py
from openai import AsyncOpenAI
from typing import Dict, Any, List
import os
import logging

logger = logging.getLogger(__name__)

SYSTEM_PROMPT = """
You are an AI assistant that helps users manage their todo list through natural language commands.
You can add, list, update, delete, and mark tasks as complete.
Use the provided tools to interact with the user's task list.
Always confirm successful operations to the user.
If a user wants to delete a task but doesn't specify which one, list their tasks first to help them choose.
Be helpful, friendly, and provide clear confirmation messages.
"""

class ChatAgent:
    def __init__(self):
        self.client = AsyncOpenAI(api_key=os.getenv("OPENAI_API_KEY"))
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
                    "description": "List tasks for the user",
                    "parameters": {
                        "type": "object",
                        "properties": {
                            "user_id": {"type": "string", "description": "The ID of the user"},
                            "status": {"type": "string", "description": "Filter by status: all, pending, completed"}
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
        # Prepend system message to conversation
        full_messages = [{"role": "system", "content": SYSTEM_PROMPT}] + messages

        response = await self.client.chat.completions.create(
            model="gpt-4",
            messages=full_messages,
            tools=self.tools,
            tool_choice="auto"
        )
        return response
```

### Step 3: Chat Endpoint with History

```python
# backend/src/todo/api/chat.py
from fastapi import APIRouter, Depends, HTTPException
from typing import Dict, Any
from sqlmodel import Session
from ..database import get_session
from ..services.conversation_service import ConversationService
from ..agents.chat_agent import ChatAgent
from ..auth import get_current_user
from pydantic import BaseModel

router = APIRouter()

class ChatRequest(BaseModel):
    message: str

@router.post("/{user_id}/chat")
async def chat_endpoint(
    user_id: str,
    request: ChatRequest,
    session: Session = Depends(get_session),
    auth_user_id: str = Depends(get_current_user)
):
    # Verify user_id matches authenticated user
    if user_id != auth_user_id:
        raise HTTPException(status_code=403, detail="Access denied")

    # Initialize services
    conversation_service = ConversationService(session)
    agent = ChatAgent()

    # Get or create conversation for user
    conversation = conversation_service.get_or_create_conversation(user_id)

    # Save user message to DB
    user_message = conversation_service.save_user_message(
        conversation_id=conversation.id,
        content=request.message
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

    # Extract agent response
    agent_response = response.choices[0].message.content

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
```

## Environment Variables

```bash
# Backend (.env)
OPENAI_API_KEY=your-openai-api-key-here
DATABASE_URL=postgresql://user:password@neon.tech/dbname
BETTER_AUTH_SECRET=your-better-auth-secret
```

## Best Practices

| Practice | Implementation |
|----------|----------------|
| **Stateless Tools** | MCP tools don't store session state, only database operations |
| **Input Validation** | All parameters validated before database operations |
| **Error Handling** | Specific error messages for different failure types |
| **Tool Chaining** | Intelligent chaining for ambiguous requests |
| **User Isolation** | Always verify user_id matches authenticated user |

## Anti-Patterns to Avoid

| ❌ Don't | ✅ Do Instead |
|---------|--------------|
| Store conversation state in memory | Store in database for persistence |
| Skip user authentication | Always verify user identity |
| Hardcode tool parameters | Use dynamic parameters from user input |
| Generic error messages | Provide specific, actionable feedback |
| Synchronous tool calls blocking | Use async/await for better performance |

## Testing Your Implementation

```bash
# Test natural language commands
curl -X POST http://localhost:8000/api/user123/chat \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIs..." \
  -H "Content-Type: application/json" \
  -d '{"message": "Add a task to buy groceries"}'

# Expected: 200 OK with confirmation
# Response: {"response": "Task 'buy groceries' has been added successfully!", "conversation_id": "...", "timestamp": "..."}

# Test tool chaining (should list before delete)
curl -X POST http://localhost:8000/api/user123/chat \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIs..." \
  -H "Content-Type: application/json" \
  -d '{"message": "Delete the meeting task"}'

# Expected: Lists tasks first to identify correct one to delete
```

## Troubleshooting

| Issue | Possible Cause | Solution |
|-------|---------------|----------|
| Tool not found | Incorrect function name | Check tool schema matches MCP implementation |
| Authentication error | Invalid JWT | Verify BETTER_AUTH_SECRET and token |
| Database connection | Connection string issue | Check DATABASE_URL format |
| Tool chaining not working | System prompt too generic | Enhance with specific chaining instructions |
| Agent not responding | OpenAI API error | Check OPENAI_API_KEY validity |

## Dependencies

```bash
# Backend
uv add openai mcp sqlmodel psycopg2-binary python-jose[cryptography]
```

## Integration with Other Components

This agent works with:
- **stateless-chat-setup**: For the chat endpoint and conversation persistence
- **chatkit-config**: For frontend ChatKit integration
- **better-auth-integration**: For user authentication and isolation
- **neon-postgresql-setup**: For database models and connections

## Framework-Agnostic Concepts

While this agent uses OpenAI + MCP + SQLModel, the concepts apply broadly:

| Concept | Universal Principle |
|---------|-------------------|
| Natural Language Processing | Translate user intent to system operations |
| Tool Selection | Choose appropriate functions based on user request |
| State Management | Maintain context across conversation turns |
| Error Handling | Provide graceful responses to invalid inputs |
| Security | Validate user identity and data access |

---

**Agent Metadata**

**Created**: 2026-01-15
**Phase**: Phase III - AI Chatbot Integration
**Stack**: OpenAI Agents SDK + MCP SDK + FastAPI + PostgreSQL
**Version**: 1.0.0
