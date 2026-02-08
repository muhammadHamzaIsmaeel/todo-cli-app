# Deployment Guide: AI-Powered Todo Chatbot

## Overview

This guide covers the deployment of the AI-powered todo chatbot feature, which includes the MCP server, OpenAI agent integration, and stateless conversation persistence.

## Prerequisites

### Environment Variables

The following environment variables are required for Phase III:

```bash
# Backend
OPENAI_API_KEY=your-openai-api-key-here
DATABASE_URL=postgresql://user:password@neon.tech/dbname
BETTER_AUTH_SECRET=your-better-auth-secret
NEXT_PUBLIC_OPENAI_DOMAIN_KEY=your-chatkit-domain-key

# Frontend
NEXT_PUBLIC_API_URL=https://your-backend-domain.up.railway.app
NEXT_PUBLIC_BETTER_AUTH_URL=https://your-backend-domain.up.railway.app
NEXT_PUBLIC_OPENAI_DOMAIN_KEY=your-chatkit-domain-key
```

### Infrastructure Requirements

- PostgreSQL database (Neon recommended)
- OpenAI API access
- Domain registration for ChatKit allowlist

## Backend Deployment

### 1. MCP Server Setup

The MCP server exposes task tools to the OpenAI agent:

```bash
# Install dependencies
uv sync

# Run the backend with the chat endpoint
uv run python -m src.todo.main
```

### 2. Database Migrations

Ensure the conversation and message tables are created:

```sql
CREATE TABLE conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
    role VARCHAR(20) NOT NULL CHECK (role IN ('user', 'assistant')),
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 3. API Endpoints

- `POST /api/{user_id}/chat` - Main chat endpoint
- `GET /api/conversations/{conversation_id}` - Get conversation history

## Frontend Deployment

### 1. Chat Page

The chat interface is available at `/chat` route and integrates with OpenAI ChatKit.

### 2. Domain Allowlist

Register your domain in the OpenAI Dashboard under Settings → Domain Allowlist for ChatKit to function properly.

## OpenAI Integration

### 1. Agent Configuration

The chat agent is configured with the following tools:
- `add_task`: Add new tasks
- `list_tasks`: List existing tasks
- `update_task`: Update task details
- `delete_task`: Delete tasks
- `complete_task`: Mark tasks as complete

### 2. System Prompt

The agent uses a system prompt that guides it to:
- Use appropriate tools based on user intent
- Confirm actions with users
- Handle ambiguous requests by asking for clarification
- Maintain helpful and friendly tone

## MCP Tools Configuration

The MCP server exposes stateless tools that interact with the database:

```python
# Example tool configuration
{
    "name": "add_task",
    "description": "Add a new task for the user",
    "input_schema": {
        "type": "object",
        "properties": {
            "user_id": {"type": "string"},
            "title": {"type": "string"},
            "description": {"type": "string"}
        }
    }
}
```

## Security Considerations

### 1. Authentication

- JWT tokens from Better Auth are validated for all chat endpoints
- User ID validation ensures users can only access their own conversations

### 2. Rate Limiting

Implement rate limiting to prevent abuse of the AI services and API endpoints.

### 3. Domain Allowlist

OpenAI ChatKit requires domain registration for security.

## Scaling Considerations

### 1. Stateless Design

- No session state stored in memory
- All conversation history stored in database
- Multiple instances can share the same database

### 2. Database Optimization

- Indexes on user_id and conversation_id for fast lookups
- Efficient message ordering by timestamp

## Monitoring and Logging

### 1. Application Logs

Monitor the following for operational health:
- Database connection errors
- OpenAI API errors
- Authentication failures
- MCP server connectivity

### 2. Performance Metrics

Track:
- Response times for chat requests
- Database query performance
- OpenAI API call latencies

## Troubleshooting

### Common Issues

1. **ChatKit Not Loading**: Verify domain is registered in OpenAI Dashboard
2. **Database Connection Errors**: Check DATABASE_URL format
3. **Authentication Failures**: Verify BETTER_AUTH_SECRET matches frontend/backend
4. **MCP Server Not Responding**: Check server connectivity and tool registration

### Debugging Tips

- Enable detailed logging during development
- Monitor database connections and query performance
- Check OpenAI API quota and rate limits
- Verify all environment variables are set correctly

## Rollback Plan

To rollback to Phase II functionality:
1. Remove chat endpoint from main.py
2. Remove MCP tools and server components
3. Revert frontend to pre-chat state
4. Remove conversation/message tables from database