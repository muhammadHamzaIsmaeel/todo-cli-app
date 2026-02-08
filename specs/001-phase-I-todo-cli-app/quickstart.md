# Quickstart: Todo CLI App

## Setup

1. **Prerequisites**: Python 3.13+ and UV package manager
2. **Initialize the project**:
   ```bash
   uv init
   ```
3. **Install dependencies** (if any):
   ```bash
   uv sync
   ```
4. **Run the application**:
   ```bash
   uv run python -m todo
   ```

## Usage

The application provides a menu-driven interface with numbered options:

1. **Add Task**: Enter a title (required) and optional description
2. **View Tasks**: Display all tasks with ID, title, status, and description
3. **Update Task**: Modify title or description of a task by ID
4. **Delete Task**: Remove a task by ID
5. **Mark Complete/Incomplete**: Toggle completion status by ID
6. **Exit**: Quit the application

## Example Workflow

1. Start the application
2. Choose option 1 to add a task with title "Buy groceries" and description "Milk, bread, eggs"
3. Choose option 2 to view your task list
4. Choose option 5 to mark the task as complete
5. Choose option 2 again to see the updated status
6. Choose option 4 to delete the task when finished
7. Choose option 6 to exit

## Error Handling

- Invalid task IDs will display an error and return to the current operation
- Empty titles will prompt for re-entry
- Invalid menu selections will prompt again
- Maximum title length is 100 characters
- Maximum description length is 500 characters

## Development

To run tests:
```bash
uv run pytest
```

To run the application in development mode:
```bash
uv run python -m todo.main
```