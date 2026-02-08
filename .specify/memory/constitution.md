<!-- SYNC IMPACT REPORT:
Version change: 1.0.0 → 1.1.0
Added sections: New Key Standards, Architecture, Project Structure, Database, Authentication sections with updated requirements
Removed sections: None
Modified principles: Updated constraints to include stateless design, OpenAI integration, and MCP requirements
Templates requiring updates:
- .specify/templates/plan-template.md ✅ updated
- .specify/templates/spec-template.md ✅ updated
- .specify/templates/tasks-template.md ✅ updated
- .specify/templates/commands/*.md ⚠ pending review
Follow-up TODOs: None
-->
# Evolution of Todo – From CLI to Distributed Cloud-Native AI Systems Constitution

## Core Principles

### Spec-Driven Development
Every feature starts with a detailed Markdown Spec before implementation; All production code must be generated through Claude Code, not written manually; Each phase builds upon the previous phase's codebase with clear documentation and reproducible results.

### Zero Manual Coding
No production code shall be written manually - only generated through Claude Code; All core functionality must be generated and refined via Claude Code; Exceptions only for configuration files, documentation, and build scripts as explicitly required.

### Clean, Maintainable & Professional Code
All code must be PEP8 compliant, well-structured, type-annotated, and modular Python code; Code quality standards include proper documentation, testing, and architectural patterns; Professional standards apply to all deliverables with clear maintainability focus.

### Progressive Complexity
Each phase must reuse and extend the previous phase's codebase; Evolution from CLI to distributed cloud-native AI systems follows incremental complexity; Build upon existing foundations rather than starting from scratch in each phase.

### Documentation First
Every phase must maintain clear README, CLAUDE.md (prompt history), and specs history; Documentation is prioritized alongside code development; Clear evidence of spec-driven iterations in specs_history and CLAUDE.md is mandatory.

### Reproducibility
Any reviewer must be able to regenerate exact same code from specs and Claude Code prompts; Clear reproduction paths must be maintained for all deliverables; Verification that specs and prompts produce identical outputs is required.

## Key Standards

Language: Python 3.13+ with UV for dependency management; Tools: Claude Code + Spec-Kit Plus mandatory, OpenAI Agents SDK for AI logic, Official MCP SDK for tool exposure; Architecture: Stateless chat endpoint + MCP server; conversation state in DB; Project Structure: Monorepo with /frontend (ChatKit UI), /backend (FastAPI + Agents + MCP), /specs (agent/tools specs); Database: Extend Neon PostgreSQL with Conversation/Message models; Testing: Basic unit tests included in each phase (pytest); Version Control: Clean Git history with meaningful commits; Authentication: Retain Better Auth + JWT from Phase II.

## Constraints

No manual code writing for core functionality; All dependencies explicitly declared via UV; Code must be runnable on standard developer machines without proprietary setup; Follow official library guidelines (e.g., OpenAI SDK, MCP SDK when used); Stateless design: No session state on server; all in DB; Domain Allowlist for OpenAI ChatKit (configure before deploy); Environment vars: NEXT_PUBLIC_OPENAI_DOMAIN_KEY, etc.; Agents use MCP tools only for task ops.

## Success Criteria

All 5 phases successfully completed with working deliverables; Judges can run the final system end-to-end; Clear evidence of spec-driven iterations in specs_history and CLAUDE.md; Progressive feature completion as per phase requirements; Final Phase V deployed and accessible on DigitalOcean Kubernetes; Stateless architecture implemented with proper DB-backed conversation state; OpenAI integration with MCP server for tool exposure; ChatKit UI integrated with authentication system.

## Governance

This constitution supersedes all other development practices and guidelines; Amendments require explicit documentation, approval, and migration plan; All development must comply with these principles; Code reviews must verify constitution compliance; All major decisions must align with these core principles; Version updates follow semantic versioning based on changes to principles or governance procedures.

**Version**: 1.1.0 | **Ratified**: 2026-01-01 | **Last Amended**: 2026-01-15