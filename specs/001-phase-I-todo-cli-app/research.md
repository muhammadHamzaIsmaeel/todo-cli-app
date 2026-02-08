# Research: Todo CLI App

## Decision: Menu vs Direct Command Input
**Rationale**: A simple numbered menu provides a beginner-friendly UX as requested in the specification. This approach is intuitive for console applications and matches the requirement for an "intuitive text-based menu interface with numbered options".
**Alternatives considered**:
- Direct command input (e.g., "add task", "view tasks") - rejected as it requires users to remember commands
- Keyboard shortcuts - rejected as it's less discoverable for new users

## Decision: Task Storage Structure
**Rationale**: Using a list of Task objects with auto-increment ID provides simple in-memory storage that meets the requirement for sequential, auto-incrementing IDs that are never reused after deletion.
**Alternatives considered**:
- Dictionary with ID as key - rejected as it would complicate sequential ID generation
- Database (even in-memory) - rejected as it violates the constraint of in-memory storage only

## Decision: Input Validation Strategy
**Rationale**: Using try-except blocks with loops until valid input provides robust error handling that matches the specification requirement to "stay in current operation and prompt again after errors".
**Alternatives considered**:
- Single attempt with return to main menu - rejected as it doesn't match the error handling requirement
- Pre-validation functions - rejected as try-except with loops is simpler and more direct

## Decision: Project Setup with UV
**Rationale**: Using `uv init` creates proper project structure and automatically creates virtual environment, following modern Python best practices and meeting the specific requirement from the spec.
**Alternatives considered**:
- Traditional `python -m venv` and `pip` - rejected as it doesn't use the specified UV tool
- Manual setup - rejected as it's less reliable and doesn't follow best practices

## Decision: Task Model Implementation
**Rationale**: Using a dataclass for the Task model provides clean, readable code with type hints that meets the specification requirements for ID, title, description, and status attributes.
**Alternatives considered**:
- Simple class with `__init__` method - rejected as dataclass is more concise and Pythonic
- Named tuple - rejected as it's immutable, making updates more complex
- Dictionary - rejected as it lacks type safety and clarity