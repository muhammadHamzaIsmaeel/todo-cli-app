# CLI Commands Contract: Todo CLI App

## Overview
This document defines the contract for the command-line interface of the Todo CLI application.

## Command Structure
The application provides a menu-driven interface with numbered options:

### 1. Add Task
- **Input**: Title (required, max 100 chars), Description (optional, max 500 chars)
- **Output**: Success message with assigned task ID
- **Error cases**:
  - Empty title → Error message and prompt again
  - Title too long → Error message and prompt again

### 2. View Tasks
- **Input**: None
- **Output**: Formatted list of all tasks with ID, title, status ([✓]/[ ]), and description (if present)
- **Error cases**: None

### 3. Update Task
- **Input**: Task ID, new title (optional), new description (optional)
- **Output**: Success message confirming update
- **Error cases**:
  - Invalid task ID → Error message and prompt again
  - Title too long → Error message and prompt again

### 4. Delete Task
- **Input**: Task ID
- **Output**: Success confirmation message
- **Error cases**:
  - Invalid task ID → Error message and prompt again

### 5. Mark Complete/Incomplete
- **Input**: Task ID
- **Output**: Success message confirming status toggle
- **Error cases**:
  - Invalid task ID → Error message and prompt again

### 6. Exit
- **Input**: None
- **Output**: Application termination
- **Error cases**: None

## Error Handling Contract
- All errors display clear error messages
- After errors, system stays in current operation and prompts again
- Invalid menu selections return to main menu with error message
- All user inputs are validated before processing

## Data Validation Contract
- Title: Required, 1-100 characters
- Description: Optional, 0-500 characters
- Task ID: Positive integer that exists in the system
- ID sequence: Sequential, auto-incrementing, never reused after deletion