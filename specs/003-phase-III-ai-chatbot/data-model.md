# Data Model: AI-Powered Todo Chatbot

## Overview
This document defines the data models required for the AI-powered todo chatbot feature, extending the existing Phase II models with conversation and message entities.

## Entity Definitions

### 1. Conversation
**Description**: Represents a user's conversation session with the AI chatbot
**Fields**:
- id (UUID/Integer): Unique identifier for the conversation
- user_id (UUID/Integer): Foreign key linking to the user who owns this conversation
- created_at (DateTime): Timestamp when the conversation was initiated
- updated_at (DateTime): Timestamp of the last activity in the conversation

**Relationships**:
- Belongs to: User (many-to-one)
- Has many: Messages (one-to-many)

**Validation Rules**:
- user_id must reference an existing user
- created_at must be in the past or present
- Each user can have multiple conversations (though implementation may limit to one active)

### 2. Message
**Description**: Represents individual messages within a conversation
**Fields**:
- id (UUID/Integer): Unique identifier for the message
- conversation_id (UUID/Integer): Foreign key linking to the conversation
- role (String): Role of the message sender ('user' or 'assistant')
- content (Text): The actual content of the message
- created_at (DateTime): Timestamp when the message was created

**Relationships**:
- Belongs to: Conversation (many-to-one)
- Messages are ordered by created_at within a conversation

**Validation Rules**:
- conversation_id must reference an existing conversation
- role must be either 'user' or 'assistant'
- content must not be empty
- created_at must be in the past or present

### 3. Task (Extended from Phase II)
**Description**: Existing task model with potential extensions for AI integration
**Fields** (existing):
- id (UUID/Integer): Unique identifier for the task
- user_id (UUID/Integer): Foreign key linking to the user who owns this task
- title (String): Title of the task
- description (Text): Optional description of the task
- status (String): Status of the task ('pending', 'completed')
- created_at (DateTime): Timestamp when the task was created
- updated_at (DateTime): Timestamp of the last update

**Relationships** (existing):
- Belongs to: User (many-to-one)

**Validation Rules** (existing):
- user_id must reference an existing user
- title must not be empty
- status must be one of the allowed values

### 4. User (From Phase II)
**Description**: Existing user model from Phase II (authentication)
**Fields** (existing):
- id (UUID/Integer): Unique identifier for the user
- name (String): User's name
- email (String): User's email address (unique)
- created_at (DateTime): Timestamp when the user was created
- updated_at (DateTime): Timestamp of the last update

## State Transitions

### Task State Transitions
- **Pending → Completed**: When user marks task as complete
- **Completed → Pending**: When user reopens a completed task (if feature supported)

### Message Flow
- **User Message**: Role = 'user', created when user sends message
- **Assistant Message**: Role = 'assistant', created when AI responds

## Relationships and Constraints

### Primary Relationships
1. **User ↔ Conversation**: One-to-many relationship
   - One user can have multiple conversations
   - Each conversation belongs to one user

2. **Conversation ↔ Message**: One-to-many relationship
   - One conversation can have multiple messages
   - Each message belongs to one conversation

3. **User ↔ Task**: One-to-many relationship (from Phase II)
   - One user can have multiple tasks
   - Each task belongs to one user

### Database Constraints
- Foreign key constraints to ensure referential integrity
- Indexes on user_id for efficient querying
- Indexes on conversation_id and created_at for message ordering
- Unique constraint on email in User table (from Phase II)

## Data Access Patterns

### Conversation Queries
- Get user's current conversation (for ongoing chats)
- Get conversation by ID (for loading specific conversations)
- Get conversation with all messages (for history loading)

### Message Queries
- Get messages for a conversation ordered by timestamp
- Add new message to conversation
- Count messages in conversation

### Task Queries (Extended from Phase II)
- Get user's tasks filtered by status
- Update task status
- Create new task for user
- Delete user's task

## Extension Points
- Future phases may add message metadata (tokens used, AI model used, etc.)
- Conversation may include metadata about the AI session
- Task model may be extended with AI-generated tags or categorization