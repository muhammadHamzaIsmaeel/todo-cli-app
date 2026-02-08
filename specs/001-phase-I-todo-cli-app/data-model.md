# Data Model: Todo CLI App

## Entity: Task

### Attributes
- **id** (integer): Sequential, auto-incrementing identifier; required; unique; never reused after deletion
- **title** (string): Required text description of the task; maximum 100 characters; cannot be empty
- **description** (string, nullable): Optional additional details about the task; maximum 500 characters
- **completed** (boolean): Completion state indicating whether the task is done or pending; defaults to False

### Validation Rules
- Title must be provided and not empty
- Title must not exceed 100 characters
- Description, if provided, must not exceed 500 characters
- ID must be positive integer
- ID sequence must be maintained without gaps (except after deletion)

### State Transitions
- **Initial State**: completed = False (when task is created)
- **Transition 1**: completed = False → completed = True (when task is marked complete)
- **Transition 2**: completed = True → completed = False (when task is marked incomplete)

### Relationships
- No relationships with other entities (standalone entity)

## Repository Interface: TodoRepository

### Methods
- **add_task(title: str, description: str = None) -> Task**: Creates a new task with auto-incremented ID
- **get_all_tasks() -> List[Task]**: Returns all tasks in the repository
- **get_task_by_id(task_id: int) -> Task**: Returns a specific task or raises exception if not found
- **update_task(task_id: int, title: str = None, description: str = None) -> Task**: Updates task fields
- **delete_task(task_id: int) -> bool**: Removes task from repository; returns True if successful
- **toggle_task_status(task_id: int) -> Task**: Toggles the completed status of a task

### Constraints
- All operations must be thread-safe (for future extensibility)
- After deletion, the next task ID must continue the sequence (no reuse of deleted IDs)
- Repository maintains in-memory storage only (no persistence)