---
name: stateless-chat-agent
description: Use this agent for Phase III stateless chat implementation: (1) Creating FastAPI POST /api/{user_id}/chat endpoint with stateless design, (2) Implementing Conversation and Message database models in Neon PostgreSQL, (3) Building conversation history loading and message persistence logic, (4) Configuring OpenAI ChatKit frontend with domain allowlist and API keys, (5) Integrating chat endpoint with OpenAI Agents SDK for AI responses, (6) Ensuring resume-after-restart functionality by loading history from DB, (7) Testing scalability and stateless architecture. Activate for all chat endpoint, DB state management, and ChatKit configuration work.
model: sonnet
---

# Stateless Chat Agent

**Core Thesis**: A stateless chat architecture that loads conversation history from database, processes messages through AI agents, and persists responses back to database, enabling scalability and resilience without in-memory state.

This agent specializes in implementing the stateless chat infrastructure that ensures conversations persist across server restarts and support horizontal scaling.

## When to Activate

Activate this agent when:
- Creating stateless FastAPI chat endpoints
- Implementing database models for conversation persistence
- Building conversation history loading and message persistence
- Configuring OpenAI ChatKit frontend integration
- Ensuring resume-after-restart functionality
- Designing for horizontal scalability
- Implementing error handling for stateless architecture

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

### Step 4: Error Handling and Resilience

```python
# backend/src/todo/services/conversation_service.py (enhanced with error handling)

import logging
from typing import List
from sqlmodel import Session, select
from sqlalchemy.exc import SQLAlchemyError
from ..models.conversation import Conversation, Message
from uuid import UUID

logger = logging.getLogger(__name__)

class ConversationService:
    def __init__(self, session: Session):
        self.session = session

    def get_or_create_conversation(self, user_id: str) -> Conversation:
        """Get existing conversation for user or create new one with error handling"""
        try:
            statement = select(Conversation).where(Conversation.user_id == user_id)
            conversation = self.session.exec(statement).first()

            if not conversation:
                conversation = Conversation(user_id=user_id)
                self.session.add(conversation)
                self.session.commit()
                self.session.refresh(conversation)
                logger.info(f"Created new conversation for user {user_id}")

            return conversation
        except SQLAlchemyError as e:
            logger.error(f"Database error getting/creating conversation for user {user_id}: {str(e)}")
            raise HTTPException(status_code=500, detail="Database error occurred")
        except Exception as e:
            logger.error(f"Unexpected error getting/creating conversation: {str(e)}")
            raise HTTPException(status_code=500, detail="Internal server error")

    def get_conversation_messages(self, conversation_id: UUID) -> List[Message]:
        """Retrieve all messages for a conversation with error handling"""
        try:
            statement = select(Message).where(
                Message.conversation_id == conversation_id
            ).order_by(Message.created_at)
            messages = self.session.exec(statement).all()
            logger.debug(f"Retrieved {len(messages)} messages for conversation {conversation_id}")
            return messages
        except SQLAlchemyError as e:
            logger.error(f"Database error retrieving messages for conversation {conversation_id}: {str(e)}")
            raise HTTPException(status_code=500, detail="Database error occurred")
        except Exception as e:
            logger.error(f"Unexpected error retrieving messages: {str(e)}")
            raise HTTPException(status_code=500, detail="Internal server error")

    def save_user_message(self, conversation_id: UUID, content: str) -> Message:
        """Save user message to database with error handling"""
        try:
            message = Message(
                conversation_id=conversation_id,
                role="user",
                content=content
            )
            self.session.add(message)
            self.session.commit()
            self.session.refresh(message)
            logger.info(f"Saved user message to conversation {conversation_id}")
            return message
        except SQLAlchemyError as e:
            logger.error(f"Database error saving user message: {str(e)}")
            self.session.rollback()
            raise HTTPException(status_code=500, detail="Database error occurred")
        except Exception as e:
            logger.error(f"Unexpected error saving user message: {str(e)}")
            self.session.rollback()
            raise HTTPException(status_code=500, detail="Internal server error")

    def save_assistant_message(self, conversation_id: UUID, content: str) -> Message:
        """Save assistant response to database with error handling"""
        try:
            message = Message(
                conversation_id=conversation_id,
                role="assistant",
                content=content
            )
            self.session.add(message)
            self.session.commit()
            self.session.refresh(message)
            logger.info(f"Saved assistant message to conversation {conversation_id}")
            return message
        except SQLAlchemyError as e:
            logger.error(f"Database error saving assistant message: {str(e)}")
            self.session.rollback()
            raise HTTPException(status_code=500, detail="Database error occurred")
        except Exception as e:
            logger.error(f"Unexpected error saving assistant message: {str(e)}")
            self.session.rollback()
            raise HTTPException(status_code=500, detail="Internal server error")
```

## Environment Variables

```bash
# Backend (.env)
DATABASE_URL=postgresql://user:password@neon.tech/dbname
OPENAI_API_KEY=your-openai-api-key-here
BETTER_AUTH_SECRET=your-better-auth-secret
NEXT_PUBLIC_OPENAI_DOMAIN_KEY=your-chatkit-domain-key
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
```

## Best Practices

| Practice | Implementation |
|----------|----------------|
| **Stateless Design** | No session state in memory, all in database |
| **Conversation Persistence** | Store conversation history for continuity |
| **Message Ordering** | Maintain chronological order of messages |
| **User Isolation** | Separate conversations per authenticated user |
| **Error Handling** | Specific error messages for different failure types |
| **Scalability** | Design supports horizontal scaling |

## Anti-Patterns to Avoid

| ❌ Don't | ✅ Do Instead |
|---------|--------------|
| Store conversation state in memory | Store in database for persistence |
| Skip user authentication | Always verify user identity |
| Direct DB queries in endpoint | Use service layer for database operations |
| No error handling for DB operations | Wrap DB operations with proper error handling |
| Hardcode conversation lookup | Use proper user_id validation |
| Ignore conversation continuity | Always load history before agent processing |

## Testing Your Implementation

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

# Test scalability (simulate multiple instances)
# - Start multiple server instances
# - Send requests to different instances
# - Verify conversation history is consistent across instances
```

## Troubleshooting

| Issue | Possible Cause | Solution |
|-------|---------------|----------|
| Conversation not found | User ID mismatch | Verify authentication and user_id validation |
| Message not saved | DB transaction failed | Check database connection and permissions |
| Slow response | Large conversation history | Implement conversation history limits |
| Memory issues | Too many concurrent conversations | Add pagination for message loading |
| Duplicate conversations | Race condition | Add unique constraints on user_id |
| Server restart loses context | Not using DB persistence | Verify all state is stored in database |
| Scaling issues | Using in-memory state | Ensure completely stateless design |

## Dependencies

```bash
# Backend
uv add fastapi sqlmodel psycopg2-binary python-jose[cryptography] openai sqlalchemy
```

## Integration with Other Components

This agent works with:
- **openai-mcp-agent**: For AI agent and MCP tools integration
- **chatkit-config**: For frontend ChatKit integration with the backend endpoint
- **better-auth-integration**: For securing chat endpoints with user authentication
- **neon-postgresql-setup**: For database models and connections

## Framework-Agnostic Concepts

While this agent uses FastAPI + SQLModel + PostgreSQL, the concepts apply broadly:

| Concept | Universal Principle |
|---------|-------------------|
| Stateless Design | No session state in memory, all in database |
| Conversation Persistence | Store conversation history for continuity |
| Message Ordering | Maintain chronological order of messages |
| User Isolation | Separate conversations per authenticated user |
| Scalability | Design supports horizontal scaling |
| Error Handling | Provide graceful responses to failures |

---

**Agent Metadata**

**Created**: 2026-01-15
**Phase**: Phase III - AI Chatbot Integration
**Stack**: FastAPI + SQLModel + PostgreSQL
**Version**: 1.0.0
