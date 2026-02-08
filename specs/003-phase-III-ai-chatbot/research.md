# Research Summary: AI-Powered Todo Chatbot

## Overview
This document summarizes the research conducted for implementing the AI-powered todo chatbot feature, focusing on the key technologies and architectural decisions required for the implementation.

## Technology Stack Decisions

### 1. OpenAI Agents SDK Integration
**Decision**: Use OpenAI Agents SDK for natural language processing and tool orchestration
**Rationale**: The Agents SDK provides a robust framework for parsing natural language commands and intelligently invoking appropriate tools based on user input. It's well-suited for our use case of translating conversational commands into specific task operations.
**Alternatives considered**:
- Custom NLP parsers: Would require significant development time and maintenance
- Rule-based systems: Less flexible and harder to scale with complex user intents
- Third-party AI services: Less control over the integration with our MCP tools

### 2. MCP SDK for Stateless Tools
**Decision**: Implement stateless tools using the Official MCP SDK
**Rationale**: MCP SDK provides a standardized way to expose our task management functions as tools that can be invoked by the AI agent. The stateless design ensures scalability and resilience by storing all state in the database rather than in memory.
**Alternatives considered**:
- Direct API calls from agent: Would tightly couple the AI system to our API
- Custom tool protocols: Would require more development effort and maintenance

### 3. OpenAI ChatKit for Frontend UI
**Decision**: Integrate OpenAI ChatKit for the conversational interface
**Rationale**: ChatKit provides a ready-made, well-designed chat interface that handles the complexities of chat UX, making it easier to implement the conversational interface quickly and reliably.
**Alternatives considered**:
- Custom-built chat UI: Would require significant frontend development time
- Other chat libraries: Less integration with OpenAI's ecosystem

### 4. Stateless Architecture with DB Storage
**Decision**: Implement stateless chat endpoint with conversation history stored in database
**Rationale**: This approach provides scalability and resilience. The system can be restarted without losing conversation context, and multiple instances can share the same conversation state.
**Alternatives considered**:
- In-memory sessions: Would be lost on server restarts and harder to scale
- Client-side storage: Less secure and harder to maintain across devices

## Key Architecture Components

### 1. Conversation Management
**Decision**: Single ongoing conversation per user for simplicity
**Rationale**: Simplifies the UI and user experience by maintaining a single ongoing conversation thread per user rather than session-based conversations
**Alternatives considered**:
- Session-based conversations: Would require more complex session management
- Multiple concurrent conversations: Would add complexity without clear benefits for this use case

### 2. Database Schema Extensions
**Decision**: Extend existing Neon PostgreSQL schema with Conversation and Message models
**Rationale**: Building on the existing database infrastructure leverages the established connection pool and ORM setup from Phase II
**Schema details**:
- Conversation: id, user_id, created_at
- Message: id, conversation_id, role (user/assistant), content, created_at

### 3. Agent System Prompt Design
**Decision**: Create a comprehensive system prompt that guides the AI agent on natural language handling and tool usage
**Rationale**: A well-crafted system prompt ensures the agent understands the available tools and how to use them appropriately for task management
**Key elements**:
- Role definition for the assistant
- Guidelines for tool selection based on user intent
- Error handling instructions
- Confirmation message requirements

## Integration Points

### 1. Phase II Integration
**Decision**: Extend Phase II's existing codebase rather than starting fresh
**Rationale**: Leverages existing authentication (Better Auth + JWT), task models, and database schema
**Integration points**:
- Reuse existing User and Task models
- Extend existing FastAPI application with chat endpoints
- Maintain existing authentication middleware

### 2. MCP Tools Parameters
**Decision**: Align tool parameters with existing task service interfaces
**Rationale**: Consistency with existing codebase and easier maintenance
**Parameter designs**:
- add_task: user_id, title, description (optional)
- list_tasks: user_id, status (all/pending/completed)
- update_task: user_id, task_id, title, description (optional)
- delete_task: user_id, task_id
- complete_task: user_id, task_id

## Security Considerations

### 1. Domain Allowlisting for ChatKit
**Decision**: Implement domain allowlisting as required by OpenAI ChatKit
**Rationale**: Ensures that the ChatKit component can only be used from authorized domains
**Implementation**: Environment variable configuration with domain validation

### 2. JWT Token Handling
**Decision**: Extend Phase II's JWT implementation for API authentication
**Rationale**: Maintains consistency with existing authentication system
**Details**: 7-day expiry as specified in requirements

## Testing Strategy

### 1. Unit Testing Approach
**Decision**: Use pytest for backend unit and integration tests
**Rationale**: Consistent with Python ecosystem and existing test setup
**Test categories**:
- MCP tools functionality
- Chat endpoint behavior
- Agent response handling

### 2. Integration Testing
**Decision**: Simulate end-to-end conversations for integration testing
**Rationale**: Validates the complete flow from user input to task operations
**Test scenarios**:
- Add → list → update → delete task sequences
- Error handling for invalid commands
- Conversation history loading and persistence

## Environmental Requirements

### 1. Environment Variables
**Decision**: Define required environment variables for the new functionality
**Variables needed**:
- OPENAI_API_KEY: For OpenAI Agents SDK
- NEXT_PUBLIC_OPENAI_DOMAIN_KEY: For ChatKit domain allowlisting
- DATABASE_URL: Extended Neon PostgreSQL connection
- BETTER_AUTH_SECRET: From Phase II authentication
- JWT_EXPIRY: 7 days as specified

### 2. Dependency Management
**Decision**: Use UV for Python dependency management (consistent with project standards)
**Dependencies to add**:
- openai: For Agents SDK
- mcp: For MCP SDK
- Additional dependencies as needed for chat functionality