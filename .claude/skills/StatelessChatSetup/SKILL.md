---
name: stateless-chat-setup
description: Setup stateless FastAPI chat endpoint for AI chatbot. Covers loading conversation history from DB, building messages array, running agent, storing responses. DB models for Conversation (id, user_id, created_at) and Message (id, conversation_id, role, content, created_at). Emphasize scalability and resume after restart. Use for Phase III endpoint implementation.
---

# Stateless Chat Setup

**Core Thesis**: Implement a stateless chat endpoint that loads conversation history from database, runs AI agent, and stores responses back to database, enabling scalability and resilience with no in-memory state.

The stateless design ensures the chatbot can resume conversations after server restarts and scales horizontally without losing conversation context.

## When to Activate

Activate this skill when:
- Building stateless chat endpoint for AI chatbot
- Implementing conversation history loading from database
- Setting up message storage and retrieval for continuity
- Creating scalable chat infrastructure without in-memory state
- Enabling conversation resumption after server restarts
- Implementing database models for Conversation and Message entities

## Core Concepts

### 1. Architecture Flow

```
Frontend Request (ChatKit)
│
├── POST /api/{user_id}/chat with message
│
Backend (FastAPI Stateless Endpoint)
│
├── Verify user authentication (JWT)
├── Load conversation history from DB (SELECT * FROM messages WHERE conversation_id = ...)
├── Build messages array for agent context
├── Run OpenAI Agent with conversation history
├── Agent processes message and may invoke MCP tools
├── Store user message in DB (INSERT INTO messages)
├── Store agent response in DB (INSERT INTO messages)
├── Return response to frontend
│
Database (PostgreSQL)
│
├── Conversation table: id, user_id, created_at, updated_at
├── Message table: id, conversation_id, role, content, created_at
└── Persist all conversation state
```

### 2. Database Schema

| Table | Fields | Purpose |
|-------|--------|---------|
| Conversation | id, user_id, created_at, updated_at | Track conversation threads per user |
| Message | id, conversation_id, role, content, created_at | Store individual messages in conversation |

### 3. Key Benefits

| Benefit | Description |
|---------|-------------|
| **Scalability** | Multiple server instances can share same conversation state |
| **Resilience** | Server restarts don't lose conversation history |
| **Persistence** | Conversations survive beyond browser/app sessions |
| **Multi-instance** | Horizontal scaling without sticky sessions |
| **Audit Trail** | Complete conversation history for analysis |

## Quick Start

### Step 1: Database Models Setup

```python
# backend/src/todo/models/conversation.py
from sqlmodel import SQLModel, Field, Relationship
from datetime import datetime
from typing import TYPE_CHECKING, Optional
from uuid import UUID, uuid4

if TYPE_CHECKING:
    from .user import User

class ConversationBase(SQLModel):
    user_id: str = Field(index=True)

class Conversation(ConversationBase, table=True):
    __tablename__ = "conversations"

    id: UUID = Field(default_factory=uuid4, primary_key=True)
    user_id: str = Field(foreign_key="users.id", index=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    # Relationship to messages
    messages: list["Message"] = Relationship(back_populates="conversation")

class MessageBase(SQLModel):
    conversation_id: UUID = Field(foreign_key="conversations.id", index=True)
    role: str = Field(regex="^(user|assistant)$")  # user or assistant
    content: str

class Message(MessageBase, table=True):
    __tablename__ = "messages"

    id: UUID = Field(default_factory=uuid4, primary_key=True)
    conversation_id: UUID = Field(foreign_key="conversations.id", index=True)
    role: str = Field(regex="^(user|assistant)$")  # user or assistant
    content: str
    created_at: datetime = Field(default_factory=datetime.utcnow)

    # Relationship to conversation
    conversation: Conversation = Relationship(back_populates="messages")
```

### Step 2: Database Service for Conversations

```python
# backend/src/todo/services/conversation_service.py
from sqlmodel import Session, select
from ..models.conversation import Conversation, Message
from uuid import UUID
from typing import List, Optional
import logging

logger = logging.getLogger(__name__)

class ConversationService:
    def __init__(self, session: Session):
        self.session = session

    def get_or_create_conversation(self, user_id: str) -> Conversation:
        """Get existing conversation for user or create new one"""
        statement = select(Conversation).where(Conversation.user_id == user_id)
        conversation = self.session.exec(statement).first()

        if not conversation:
            conversation = Conversation(user_id=user_id)
            self.session.add(conversation)
            self.session.commit()
            self.session.refresh(conversation)

        return conversation

    def get_conversation_messages(self, conversation_id: UUID) -> List[Message]:
        """Retrieve all messages for a conversation, ordered by creation time"""
        statement = select(Message).where(
            Message.conversation_id == conversation_id
        ).order_by(Message.created_at)
        messages = self.session.exec(statement).all()
        return messages

    def save_user_message(self, conversation_id: UUID, content: str) -> Message:
        """Save user message to database"""
        message = Message(
            conversation_id=conversation_id,
            role="user",
            content=content
        )
        self.session.add(message)
        self.session.commit()
        self.session.refresh(message)
        return message

    def save_assistant_message(self, conversation_id: UUID, content: str) -> Message:
        """Save assistant response to database"""
        message = Message(
            conversation_id=conversation_id,
            role="assistant",
            content=content
        )
        self.session.add(message)
        self.session.commit()
        self.session.refresh(message)
        return message
```

### Step 3: Chat Endpoint Implementation

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
    agent = ChatAgent()  # Initialize OpenAI agent

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

### Step 4: Agent Integration with History

```python
# backend/src/todo/agents/chat_agent.py
from openai import AsyncOpenAI
from typing import Dict, Any, List
import os

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
        # Include tools definition here (as defined in MCP integration skill)

    async def run_conversation(self, messages: List[Dict], user_id: str) -> Any:
        # Prepend system message to conversation
        full_messages = [{"role": "system", "content": SYSTEM_PROMPT}] + messages

        response = await self.client.chat.completions.create(
            model="gpt-4",
            messages=full_messages,
            tools=self.tools,  # Defined separately
            tool_choice="auto"
        )
        return response
```

## Environment Variables

```bash
# Backend (.env)
DATABASE_URL=postgresql://user:password@neon.tech/dbname
OPENAI_API_KEY=your-openai-api-key-here
BETTER_AUTH_SECRET=your-better-auth-secret
```

## Key Benefits

| Benefit | Explanation |
|---------|-------------|
| **Scalability** | Multiple server instances can serve requests without shared memory |
| **Resilience** | Server restarts don't interrupt ongoing conversations |
| **Persistence** | Conversation history remains available across sessions |
| **Horizontal Scaling** | Load balancer can distribute requests to any instance |
| **Debugging** | Complete conversation history available for analysis |

## Anti-Patterns to Avoid

| ❌ Don't | ✅ Do Instead |
|---------|--------------|
| Store conversation state in memory | Store conversation state in database |
| Skip saving messages to DB | Persist all messages to database |
| Hardcode conversation lookup | Use proper user_id validation |
| Ignore conversation continuity | Always load history before agent processing |
| Direct DB queries in endpoint | Use service layer for database operations |
| No error handling for DB operations | Wrap DB operations with proper error handling |

## Testing Your Setup

```bash
# Test chat endpoint
curl -X POST http://localhost:8000/api/user123/chat \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIs..." \
  -H "Content-Type: application/json" \
  -d '{"message": "Add a task to buy groceries"}'

# Expected: 200 OK with response and conversation_id
# Response: {"response": "Task 'buy groceries' has been added successfully!", "conversation_id": "uuid", "timestamp": "2023-01-01T00:00:00Z"}

# Test conversation continuity after restart
# 1. Send message: "Add task A"
# 2. Restart server
# 3. Send message: "What did I just add?"
# 4. Should see context from previous conversation
```

## Troubleshooting

| Issue | Possible Cause | Solution |
|-------|---------------|----------|
| Conversation not found | User ID mismatch | Verify authentication and user_id validation |
| Message not saved | DB transaction failed | Check database connection and permissions |
| Slow response | Large conversation history | Implement conversation history limits |
| Memory issues | Too many concurrent conversations | Add pagination for message loading |
| Duplicate conversations | Race condition | Add unique constraints on user_id |

## Dependencies

```bash
# Backend
uv add fastapi sqlmodel psycopg2-binary python-jose[cryptography] openai
```

## Integration with Other Skills

This skill connects to:
- **openai-agents-mcp-integration**: For AI agent and MCP tools integration
- **chatkit-config**: For frontend ChatKit integration with the backend endpoint
- **better-auth-integration**: For securing chat endpoints with user authentication
- **neon-postgresql-setup**: For database models and connections

## Framework-Agnostic Concepts

While this skill uses FastAPI + SQLModel, the concepts apply to any stack:

| Concept | Universal Principle |
|---------|-------------------|
| Stateless Design | No session state in memory, all in database |
| Conversation Persistence | Store conversation history for continuity |
| Message Ordering | Maintain chronological order of messages |
| User Isolation | Separate conversations per authenticated user |
| Scalability | Design supports horizontal scaling |

---

**Skill Metadata**

**Created**: 2026-01-15
**Phase**: Phase III - AI Chatbot Integration
**Stack**: FastAPI + SQLModel + PostgreSQL
**Version**: 1.0.0