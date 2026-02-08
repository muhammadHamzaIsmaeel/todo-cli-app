---
id: 2
title: "AI Chatbot Planning"
stage: "plan"
date: "2026-01-15"
surface: "agent"
model: "claude-sonnet-4-5-20250929"
feature: "003-ai-chatbot-todo"
branch: "003-ai-chatbot-todo"
user: "hamza"
command: "/sp.plan Create: Updated specs: features/conversational-interface.md, api/mcp-tools.md, api/chat-endpoint.md, database/conversation-schema.md Frontend: Integrate OpenAI ChatKit for chat UI (config with domain key) Backend: FastAPI chat endpoint (/api/{user_id}/chat); OpenAI Agents SDK runner; MCP server with tools DB Models: Conversation & Message tables (SQLModel); migrations MCP Tools: Stateless functions for add/list/update/delete/complete_task (use DB for state) README: Update with ChatKit setup, domain allowlist instructions, run commands CLAUDE.md: Update root/frontend/backend with Phase III guidelines Architecture sketch: - Frontend: ChatKit UI → POST to /api/{user_id}/chat with message - Backend: Stateless endpoint → Load history from DB → Build messages array → Run OpenAI Agent (Agents SDK) → Agent invokes MCP tools (SDK) → Tools query/update DB → Store agent response in DB → Return to frontend - MCP Tools: Exposed via Official MCP SDK – e.g., add_task(tool_input: dict) → DB insert - Flow: As per specs (receive msg → build history → store in DB → run agent → invoke tools → store response → return) Research approach: Use skills: - For Agents/MCP: @skills/OpenAIAgentsMCPIntegration.md - For Stateless Chat: @skills/StatelessChatSetup.md - For ChatKit: @skills/ChatKitConfig.md Decisions needing documentation: - Conversation ID: Per user or per session? → Per user (single ongoing convo for simplicity) - Agent Prompt: System prompt for natural lang handling + tool usage - Tool Params: As per specs (e.g., add_task: user_id, title, description optional) - Expiry: JWT expiry 7 days (from Phase II) - Domain Key: Env var for ChatKit security Testing strategy: - Unit: Pytest for MCP tools, endpoint - Integration: Simulate convos (add → list → update → delete) - Stateless: Restart server mid-convo, resume works - Natural Lang: Test all example commands in specs Technical details & phases: 1. Extend DB schema/models for Conversation/Message per specs 2. Setup MCP server with SDK; define stateless tools (add_task, etc.) 3. Implement stateless chat endpoint in FastAPI (load history, run agent, store response) 4. Configure OpenAI Agents SDK runner with tools + system prompt 5. Integrate ChatKit in frontend (domain allowlist, env key) 6. Test end-to-end convos with natural lang examples 7. Handle errors/confirmations in agent responses 8. Update README/CLAUDE.md with Phase III setup 9. Polish: Resume after restart, friendly outputs Follow Constitution – all code via Claude Code; reference skills in prompts (@specs/path.md too)."
labels: ["planning", "architecture", "ai-chatbot", "mcp-tools", "openai-agents"]
links:
  spec: "specs/003-phase-III-ai-chatbot/spec.md"
  ticket: null
  adr: null
  pr: null
files:
  - "specs/003-phase-III-ai-chatbot/plan.md"
  - "specs/003-phase-III-ai-chatbot/research.md"
  - "specs/003-phase-III-ai-chatbot/data-model.md"
  - "specs/003-phase-III-ai-chatbot/quickstart.md"
  - "specs/003-phase-III-ai-chatbot/contracts/chat-api.yaml"
tests: []
outcome: "Complete implementation plan created with research, data model, quickstart guide, and API contracts for AI-powered todo chatbot"
evaluation: "Complete"
---

# Prompt History Record: AI Chatbot Planning

## Original Prompt

```
/sp.plan
Create:
- Updated specs: features/conversational-interface.md, api/mcp-tools.md, api/chat-endpoint.md, database/conversation-schema.md
- Frontend: Integrate OpenAI ChatKit for chat UI (config with domain key)
- Backend: FastAPI chat endpoint (/api/{user_id}/chat); OpenAI Agents SDK runner; MCP server with tools
- DB Models: Conversation & Message tables (SQLModel); migrations
- MCP Tools: Stateless functions for add/list/update/delete/complete_task (use DB for state)
- README: Update with ChatKit setup, domain allowlist instructions, run commands
- CLAUDE.md: Update root/frontend/backend with Phase III guidelines

Architecture sketch:
- Frontend: ChatKit UI → POST to /api/{user_id}/chat with message
- Backend: Stateless endpoint → Load history from DB → Build messages array → Run OpenAI Agent (Agents SDK) → Agent invokes MCP tools (SDK) → Tools query/update DB → Store agent response in DB → Return to frontend
- MCP Tools: Exposed via Official MCP SDK – e.g., add_task(tool_input: dict) → DB insert
- Flow: As per specs (receive msg → build history → store in DB → run agent → invoke tools → store response → return)

Research approach: Use skills:
- For Agents/MCP: @skills/OpenAIAgentsMCPIntegration.md
- For Stateless Chat: @skills/StatelessChatSetup.md
- For ChatKit: @skills/ChatKitConfig.md

Decisions needing documentation:
- Conversation ID: Per user or per session? → Per user (single ongoing convo for simplicity)
- Agent Prompt: System prompt for natural lang handling + tool usage
- Tool Params: As per specs (e.g., add_task: user_id, title, description optional)
- Expiry: JWT expiry 7 days (from Phase II)
- Domain Key: Env var for ChatKit security

Testing strategy:
- Unit: Pytest for MCP tools, endpoint
- Integration: Simulate convos (add → list → update → delete)
- Stateless: Restart server mid-convo, resume works
- Natural Lang: Test all example commands in specs

Technical details & phases:
1. Extend DB schema/models for Conversation/Message per specs
2. Setup MCP server with SDK; define stateless tools (add_task, etc.)
3. Implement stateless chat endpoint in FastAPI (load history, run agent, store response)
4. Configure OpenAI Agents SDK runner with tools + system prompt
5. Integrate ChatKit in frontend (domain allowlist, env key)
6. Test end-to-end convos with natural lang examples
7. Handle errors/confirmations in agent responses
8. Update README/CLAUDE.md with Phase III setup
9. Polish: Resume after restart, friendly outputs

Follow Constitution – all code via Claude Code; reference skills in prompts (@specs/path.md too).
```

## Response Summary

Created a comprehensive implementation plan for the AI-powered todo chatbot feature, including:

- Detailed implementation plan document with architecture overview
- Research summary covering technology decisions and integration approaches
- Data model specification for Conversation and Message entities
- Quickstart guide for setting up and running the feature
- OpenAPI contract for the chat endpoint
- Updated agent context with new technologies

The plan covers all required aspects including the MCP tools, OpenAI Agents SDK integration, ChatKit frontend, stateless architecture, and database extensions. All constitution requirements were verified and the plan is ready for the task generation phase.