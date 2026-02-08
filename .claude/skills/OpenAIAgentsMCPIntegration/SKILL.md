---
name: openai-agents-mcp-integration
description: Integrate OpenAI Agents SDK with MCP SDK for stateless tool calls in AI chatbot. Covers agent runner setup, system prompt for natural language parsing, tool chaining (e.g., list before delete), and MCP tool definitions for task operations like add_task, list_tasks. Use for Phase III AI logic.
---

# OpenAI Agents MCP Integration

**Core Thesis**: Connect OpenAI Agents SDK with MCP SDK to enable natural language processing with stateless tool calls for AI-powered task management.

The integration allows users to interact with the todo system through natural language commands, with the AI agent intelligently selecting and invoking appropriate MCP tools to perform operations.

## When to Activate

Activate this skill when:
- Building AI-powered chatbot for task management
- Implementing natural language processing for CRUD operations
- Integrating OpenAI Agents with custom MCP tools
- Setting up stateless tool execution for multi-user systems
- Enabling intelligent tool chaining (e.g., list before delete)

## Core Concepts

### 1. Architecture Flow

```
Frontend (ChatKit UI)
│
├── User sends message → "Add a task to buy groceries"
├── POST /api/{user_id}/chat
│
Backend (FastAPI + OpenAI Agent)
│
├── Load conversation history from DB
├── Build messages array with history
├── Initialize OpenAI Agent with tools
├── Run agent with user message
├── Agent selects appropriate MCP tool (e.g., add_task)
├── Execute MCP tool (stateless) → DB
├── Store agent response in DB
└── Return response to frontend
```

### 2. Technology Stack

| Component | Purpose | Integration |
|-----------|---------|-------------|
| OpenAI Agents SDK | Natural language processing and tool selection | Processes user input, selects tools |
| MCP SDK | Stateless tool execution | Executes DB operations |
| PostgreSQL | Persistent storage | Stores tasks, conversations, messages |
| FastAPI | API layer | Orchestrates the flow |

### 3. Key Decisions

| Decision | Options | Recommended |
|----------|---------|-------------|
| **Tool Parameters** | user_id, title, description pattern | ✅ Consistent naming across all tools |
| **Chaining Logic** | List before delete for ambiguous requests | ✅ Improves user experience |
| **System Prompt** | Clear role definition with tool usage | ✅ Ensures consistent behavior |
| **Response Format** | JSON with action_taken field | ✅ Enables structured frontend handling |
| **Error Handling** | Specific, actionable feedback | ✅ Maintains good UX |

## Quick Start

### Step 1: MCP Tools Setup

```python
# backend/src/todo/mcp_tools/task_tools.py
from typing import Dict, Any, List
from mcp import server, stdio
from mcp.types import TextContent, Tool
import json

async def add_task(user_id: str, title: str, description: str = "") -> Dict[str, Any]:
    """Add a new task for the user"""
    # Implementation connects to DB and adds task
    # Returns confirmation of successful operation
    return {
        "success": True,
        "task_id": "new_task_id",
        "message": f"Task '{title}' has been added successfully!"
    }

async def list_tasks(user_id: str, status: str = "all") -> List[Dict[str, Any]]:
    """List tasks for the user"""
    # Implementation retrieves tasks from DB
    # Returns list of tasks with ID, title, description, status
    return [
        {"id": "task1", "title": "Buy groceries", "status": "pending"},
        {"id": "task2", "title": "Call mom", "status": "pending"}
    ]

async def update_task(user_id: str, task_id: str, title: str = "", description: str = "") -> Dict[str, Any]:
    """Update an existing task"""
    # Implementation updates task in DB
    return {
        "success": True,
        "message": f"Task {task_id} has been updated successfully!"
    }

async def delete_task(user_id: str, task_id: str) -> Dict[str, Any]:
    """Delete a task"""
    # Implementation deletes task from DB
    return {
        "success": True,
        "message": f"Task {task_id} has been deleted successfully!"
    }

async def complete_task(user_id: str, task_id: str) -> Dict[str, Any]:
    """Mark a task as complete"""
    # Implementation updates task status in DB
    return {
        "success": True,
        "message": f"Task {task_id} has been marked as complete!"
    }
```

### Step 2: OpenAI Agent Configuration

```python
# backend/src/todo/agents/chat_agent.py
from openai import AsyncOpenAI
from typing import Dict, Any, List
import os

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
            # Add other tools: update_task, delete_task, complete_task
        ]

    async def run_conversation(self, messages: List[Dict], user_id: str) -> Any:
        # Add user_id to all tool calls automatically
        response = await self.client.chat.completions.create(
            model="gpt-4",
            messages=messages,
            tools=self.tools,
            tool_choice="auto"
        )
        return response
```

### Step 3: System Prompt Design

```python
SYSTEM_PROMPT = """
You are an AI assistant that helps users manage their todo list through natural language commands.
You can add, list, update, delete, and mark tasks as complete.
Use the provided tools to interact with the user's task list.
Always confirm successful operations to the user.
If a user wants to delete a task but doesn't specify which one, list their tasks first to help them choose.
Be helpful, friendly, and provide clear confirmation messages.
"""
```

### Step 4: Chat Endpoint Integration

```python
# backend/src/todo/api/chat.py
from fastapi import APIRouter, Depends, HTTPException
from typing import Dict, Any
from ..services.chat_service import ChatService
from ..auth import get_current_user
from pydantic import BaseModel

router = APIRouter()

class ChatRequest(BaseModel):
    message: str

@router.post("/{user_id}/chat")
async def chat_endpoint(
    user_id: str,
    request: ChatRequest,
    auth_user_id: str = Depends(get_current_user)
):
    # Verify user_id matches authenticated user
    if user_id != auth_user_id:
        raise HTTPException(status_code=403, detail="Access denied")

    # Initialize chat service
    chat_service = ChatService()

    # Process message through agent
    response = await chat_service.process_message(
        user_id=user_id,
        message=request.message
    )

    return response
```

## Environment Variables

```bash
# Backend (.env)
OPENAI_API_KEY=your-openai-api-key-here
DATABASE_URL=postgresql://user:password@neon.tech/dbname
BETTER_AUTH_SECRET=your-better-auth-secret
```

## Security Benefits

| Benefit | Description |
|---------|-------------|
| **Stateless Tools** | MCP tools don't store session data, improving scalability |
| **User Isolation** | Each user only operates on their own data |
| **Input Validation** | All parameters validated before database operations |
| **Rate Limiting** | Prevents abuse of AI and tool endpoints |
| **Authentication** | Verified user identity before operations |

## API Behavior After Integration

| Before Integration | After Integration |
|-------------------|-------------------|
| Direct API calls only | Natural language processing |
| Fixed command structure | Flexible conversation flow |
| Manual operation chaining | Intelligent tool chaining |
| Error-prone user input | Validated and processed input |
| No contextual awareness | Full conversation history context |

## Anti-Patterns to Avoid

| ❌ Don't | ✅ Do Instead |
|---------|--------------|
| Store session state in tools | Keep MCP tools stateless |
| Skip input validation | Validate all parameters before DB operations |
| Hardcode tool lists | Define tools dynamically with proper schemas |
| Ignore conversation history | Always include relevant context |
| Return generic errors | Provide specific, actionable feedback |
| Make synchronous tool calls blocking | Use async/await for better performance |

## Testing Your Integration

```bash
# Test natural language command
curl -X POST http://localhost:8000/api/user123/chat \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIs..." \
  -H "Content-Type: application/json" \
  -d '{"message": "Add a task to buy groceries"}'

# Expected: 200 OK with confirmation message
# Response: {"response": "Task 'buy groceries' has been added successfully!", "action_taken": "add_task"}

# Test ambiguous delete (should list tasks first)
curl -X POST http://localhost:8000/api/user123/chat \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIs..." \
  -H "Content-Type: application/json" \
  -d '{"message": "Delete the meeting task"}'

# Expected: Lists tasks first to disambiguate
```

## Troubleshooting

| Issue | Possible Cause | Solution |
|-------|---------------|----------|
| Tool not found | Incorrect tool schema | Verify function name and parameters match |
| Authentication error | Invalid JWT token | Check BETTER_AUTH_SECRET and token validity |
| Database connection | Connection string issue | Verify DATABASE_URL format |
| Agent not responding | OpenAI API error | Check OPENAI_API_KEY validity |
| Tool chaining not working | System prompt too generic | Enhance prompt with specific chaining instructions |

## Dependencies

```bash
# Backend
uv add openai mcp python-jose[cryptography] python-dotenv
```

## Integration with Other Skills

This skill connects to:
- **stateless-chat-setup**: For the chat endpoint that loads history from DB
- **chatkit-config**: For frontend ChatKit integration with the backend agent
- **better-auth-integration**: For securing agent endpoints with user authentication
- **neon-postgresql-setup**: For database models used by MCP tools

## Framework-Agnostic Concepts

While this skill uses OpenAI Agents + MCP SDK, the concepts apply to any AI integration:

| Concept | Universal Principle |
|---------|-------------------|
| Natural Language Processing | Translate user intent to system operations |
| Tool Selection | Choose appropriate functions based on user request |
| State Management | Maintain context across conversation turns |
| Error Handling | Provide graceful responses to invalid inputs |
| Security | Validate user identity and data access |

---

**Skill Metadata**

**Created**: 2026-01-15
**Phase**: Phase III - AI Chatbot Integration
**Stack**: OpenAI Agents SDK + MCP SDK + FastAPI + PostgreSQL
**Version**: 1.0.0