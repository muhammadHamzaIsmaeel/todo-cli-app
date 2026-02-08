# Implementation Plan: AI-Powered Todo Chatbot

**Branch**: `003-ai-chatbot-todo` | **Date**: 2026-01-15 | **Spec**: [AI-Powered Todo Chatbot](./spec.md)
**Input**: Feature specification from `/specs/003-phase-III-ai-chatbot/spec.md`

**Note**: This template is filled in by the `/sp.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Implementation of an AI-powered conversational interface for managing todos via natural language. The system integrates OpenAI ChatKit for the frontend UI, OpenAI Agents SDK for natural language processing, and MCP SDK for exposing stateless tools. The architecture follows a stateless design where conversation history is stored in the database rather than in memory, allowing for scalable and resilient operation. The system will enable users to manage tasks through natural language commands like "Add a task to buy groceries" or "Show me all my tasks".

## Technical Context

**Language/Version**: Python 3.13+ with TypeScript/JavaScript for frontend
**Primary Dependencies**: FastAPI (backend), OpenAI Agents SDK, Official MCP SDK, SQLModel, Neon PostgreSQL, OpenAI ChatKit
**Storage**: Neon PostgreSQL database with Conversation and Message models
**Testing**: pytest for backend unit/integration tests, OpenAPI contracts for API validation
**Target Platform**: Linux server deployment with web-based frontend
**Project Type**: Web application (frontend + backend)
**Performance Goals**: <3 second response time for task operations, 99% uptime during normal operation
**Constraints**: Stateless design (no session state on server, all in DB), Domain Allowlist for OpenAI ChatKit, JWT expiry 7 days from Phase II
**Scale/Scope**: Support for multiple concurrent users with isolated conversation histories

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- Spec-Driven Development: ✓ Detailed Markdown Spec exists and is complete before implementation
- Zero Manual Coding: ✓ All production code will be generated through Claude Code
- Clean, Maintainable & Professional Code: ✓ Adherence to PEP8, type annotations, and modular structure will be confirmed
- Progressive Complexity: ✓ Building upon Phase II's codebase (Better Auth + JWT, existing task models)
- Documentation First: ✓ README, CLAUDE.md, and specs history will be maintained
- Reproducibility: ✓ Reviewers will be able to regenerate code from specs and prompts

## Post-Design Constitution Check

*Re-evaluated after Phase 1 design completion*

- Spec-Driven Development: ✓ Implementation follows detailed spec requirements
- Zero Manual Coding: ✓ All core functionality planned to be generated via Claude Code
- Clean, Maintainable & Professional Code: ✓ Architecture supports PEP8, type annotations, and modular structure
- Progressive Complexity: ✓ Building upon and extending Phase II architecture appropriately
- Documentation First: ✓ All required documentation artifacts created (spec, plan, research, data-model, quickstart, contracts)
- Reproducibility: ✓ Architecture and contracts documented for regeneration by reviewers

## Project Structure

### Documentation (this feature)

```text
specs/003-phase-III-ai-chatbot/
├── plan.md              # This file (/sp.plan command output)
├── research.md          # Phase 0 output (/sp.plan command)
├── data-model.md        # Phase 1 output (/sp.plan command)
├── quickstart.md        # Phase 1 output (/sp.plan command)
├── contracts/           # Phase 1 output (/sp.plan command)
└── tasks.md             # Phase 2 output (/sp.tasks command - NOT created by /sp.plan)
```

### Source Code (repository root)

```text
backend/
├── src/
│   ├── todo/
│   │   ├── models/
│   │   │   ├── __init__.py
│   │   │   ├── user.py
│   │   │   ├── task.py
│   │   │   ├── conversation.py          # New: Conversation model
│   │   │   └── message.py               # New: Message model
│   │   ├── api/
│   │   │   ├── __init__.py
│   │   │   ├── auth.py
│   │   │   ├── tasks.py
│   │   │   └── chat.py                  # New: Chat endpoint
│   │   ├── services/
│   │   │   ├── __init__.py
│   │   │   ├── task_service.py
│   │   │   └── chat_service.py          # New: Chat service
│   │   ├── mcp_tools/                   # New: MCP tools module
│   │   │   ├── __init__.py
│   │   │   ├── task_tools.py            # MCP tools for task operations
│   │   │   └── server.py                # MCP server
│   │   ├── agents/                      # New: Agent integration
│   │   │   ├── __init__.py
│   │   │   └── chat_agent.py            # OpenAI Agent integration
│   │   └── database.py
│   └── main.py
└── tests/
    ├── unit/
    ├── integration/
    └── contract/

frontend/
├── src/
│   ├── components/
│   │   ├── ChatInterface.jsx            # New: ChatKit integration
│   │   ├── TaskList.jsx                 # Updated: With chat integration
│   │   └── ...
│   ├── pages/
│   │   ├── ChatPage.jsx                 # New: Chat page
│   │   ├── Dashboard.jsx                # Updated: With chat access
│   │   └── ...
│   ├── services/
│   │   ├── api.js
│   │   └── auth.js
│   └── utils/
├── public/
└── package.json

.env                          # Environment variables
README.md                     # Updated with Phase III instructions
CLAUDE.md                     # Updated with Phase III guidelines
```

**Structure Decision**: Selected Option 2: Web application structure with separate backend and frontend directories. The backend extends Phase II's structure with new modules for chat functionality, MCP tools, and agent integration. The frontend integrates OpenAI ChatKit for the conversational interface while maintaining existing task management features.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| None | All constitution requirements satisfied | N/A |
