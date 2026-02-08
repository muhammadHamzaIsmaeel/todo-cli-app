---
id: 1
title: "Update constitution for Phase 3"
stage: "constitution"
date: "2026-01-15"
surface: "agent"
model: "claude-sonnet-4-5-20250929"
feature: "none"
branch: "phase-2"
user: "hamza"
command: "sp.constitution"
labels: ["constitution", "phase-3", "standards", "architecture"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
  - ".specify/memory/constitution.md"
tests: []
outcome: "Successfully updated the constitution file to reflect Phase 3 requirements including new tools (OpenAI Agents SDK, MCP SDK), architecture (stateless chat endpoint), project structure (monorepo with ChatKit UI), database extensions, and updated constraints for stateless design and OpenAI integration."
evaluation: "The constitution was updated from version 1.0.0 to 1.1.0, incorporating requirements for Phase 3 such as stateless architecture, OpenAI integration, MCP server implementation, and ChatKit UI integration while maintaining backward compatibility with existing authentication system (Better Auth + JWT)."
---

# Prompt History Record

## Command
```
sp.constitution ab hum phase 3 par chaltha hai sab sa phala constitution wali file k thora update kartha hai. Key standards:
- Tools: Claude Code + Spec-Kit Plus mandatory; OpenAI Agents SDK for AI logic, Official MCP SDK for tool exposure
- Architecture: Stateless chat endpoint + MCP server; conversation state in DB
- Project Structure: Monorepo with /frontend (ChatKit UI), /backend (FastAPI + Agents + MCP), /specs (agent/tools specs)
- Database: Extend Neon PostgreSQL with Conversation/Message models
- Authentication: Retain Better Auth + JWT from Phase II

Constraints:
- Stateless design: No session state on server; all in DB
- Domain Allowlist for OpenAI ChatKit (configure before deploy)
- Environment vars: NEXT_PUBLIC_OPENAI_DOMAIN_KEY, etc.
- Agents use MCP tools only for task ops
```

## Response
I've updated the constitution file to reflect the new requirements for Phase 3. The key changes include:

1. Updated Key Standards section to include:
   - OpenAI Agents SDK for AI logic
   - Official MCP SDK for tool exposure
   - Stateless chat endpoint + MCP server architecture
   - Monorepo structure with specific directories
   - Database extension requirements

2. Updated Constraints section to include:
   - Stateless design requirements
   - Domain Allowlist for OpenAI ChatKit
   - Environment variables specifications
   - MCP tools usage constraints

3. Updated Success Criteria to include:
   - Stateless architecture implementation
   - OpenAI integration
   - MCP server for tool exposure
   - ChatKit UI integration

The constitution version was incremented from 1.0.0 to 1.1.0 to reflect these material additions and expansions of guidance.
