# Quickstart Guide: AI-Powered Todo Chatbot

## Overview
This guide provides the essential information to quickly set up and run the AI-powered todo chatbot feature. This extends Phase II's full-stack web app with an AI conversational interface.

## Prerequisites
- Python 3.13+ with UV package manager
- Node.js 18+ for frontend development
- PostgreSQL database (Neon recommended)
- OpenAI API key
- Better Auth account (from Phase II)

## Environment Setup

### 1. Clone and Navigate
```bash
git clone <repository-url>
cd <repository-name>
git checkout 003-ai-chatbot-todo  # Phase III branch
```

### 2. Backend Setup
```bash
cd backend
uv venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
uv pip install -r requirements.txt

# Set up environment variables
cp .env.example .env
# Edit .env with your actual values:
# OPENAI_API_KEY=your_openai_api_key
# DATABASE_URL=your_postgres_connection_string
# BETTER_AUTH_SECRET=your_auth_secret
# NEXT_PUBLIC_OPENAI_DOMAIN_KEY=your_chatkit_domain_key
```

### 3. Frontend Setup
```bash
cd frontend
npm install
# Copy environment variables
cp .env.example .env.local
# Update with your values
```

## Database Setup

### 1. Run Migrations
```bash
cd backend
source .venv/bin/activate
python -m src.todo.database migrate
```

### 2. Verify Tables
Ensure the following tables exist:
- `users` (from Phase II)
- `tasks` (from Phase II)
- `conversations` (new for Phase III)
- `messages` (new for Phase III)

## Running the Application

### 1. Start Backend
```bash
cd backend
source .venv/bin/activate
python -m src.todo.main
# Backend serves on http://localhost:8000
```

### 2. Start Frontend
```bash
cd frontend
npm run dev
# Frontend serves on http://localhost:3000
```

### 3. Start MCP Server (Separate Terminal)
```bash
cd backend
source .venv/bin/activate
python -m src.todo.mcp_tools.server
# MCP server serves on http://localhost:8080
```

## Key Endpoints

### Backend API
- `POST /api/{user_id}/chat` - Main chat endpoint
- `GET /api/tasks` - Get user's tasks
- `POST /api/tasks` - Create task
- `PUT /api/tasks/{id}` - Update task
- `DELETE /api/tasks/{id}` - Delete task
- `PATCH /api/tasks/{id}/complete` - Mark task complete

### MCP Tools
- Available tools: `add_task`, `list_tasks`, `update_task`, `delete_task`, `complete_task`

## Usage Examples

### 1. Natural Language Commands
Once the chat interface is running, you can use commands like:
- "Add a task to buy groceries"
- "Show me all my tasks"
- "What's pending?"
- "Change task 1 to 'Call mom tonight'"
- "Delete the meeting task"
- "Mark task 3 as complete"

### 2. API Testing
```bash
# Send a chat message
curl -X POST http://localhost:8000/api/{user_id}/chat \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {jwt_token}" \
  -d '{"message": "Add a task to buy groceries"}'
```

## Configuration

### OpenAI Agent Settings
- Located in `backend/src/todo/agents/chat_agent.py`
- Customize system prompt for specific behavior
- Adjust tool parameters as needed

### MCP Server Configuration
- Located in `backend/src/todo/mcp_tools/server.py`
- Defines available tools for the AI agent
- Configure tool parameters and validation

### ChatKit Frontend
- Located in `frontend/src/components/ChatInterface.jsx`
- Domain allowlisting configured via environment variables
- Customizable UI components

## Troubleshooting

### Common Issues
1. **OpenAI API errors**: Verify `OPENAI_API_KEY` is set correctly
2. **Database connection errors**: Check `DATABASE_URL` and network connectivity
3. **MCP server not connecting**: Ensure MCP server is running and accessible
4. **Authentication errors**: Verify JWT tokens and Better Auth configuration

### Logs
- Backend logs: Console output when running `python -m src.todo.main`
- MCP server logs: Console output when running MCP server
- Frontend logs: Browser console and terminal output

## Next Steps
1. Explore the API contracts in `specs/003-phase-III-ai-chatbot/contracts/`
2. Review the data model in `specs/003-phase-III-ai-chatbot/data-model.md`
3. Check out the complete task breakdown in `specs/003-phase-III-ai-chatbot/tasks.md` (after running `/sp.tasks`)
4. Customize the agent's behavior by modifying the system prompt
5. Extend the MCP tools with additional functionality