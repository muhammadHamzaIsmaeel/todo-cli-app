"""Quick test to validate the application works as expected."""

from src.todo.repository import InMemoryTodoRepository
from src.todo.models import Task

def test_basic_functionality():
    """Test basic functionality of the todo app."""
    print("Testing basic functionality...")

    # Create a repository
    repo = InMemoryTodoRepository()

    # Test adding a task
    task1 = repo.add_task("Buy groceries", "Milk, bread, eggs")
    print(f"Added task: ID={task1.id}, Title='{task1.title}', Description='{task1.description}'")

    # Verify task was added
    all_tasks = repo.get_all_tasks()
    assert len(all_tasks) == 1
    assert all_tasks[0].title == "Buy groceries"
    print("✓ Add task functionality works")

    # Test updating a task
    updated_task = repo.update_task(task1.id, title="Buy groceries updated", description="Updated description")
    print(f"Updated task: ID={updated_task.id}, Title='{updated_task.title}', Description='{updated_task.description}'")

    # Verify task was updated
    retrieved_task = repo.get_task_by_id(task1.id)
    assert retrieved_task.title == "Buy groceries updated"
    assert retrieved_task.description == "Updated description"
    print("✓ Update task functionality works")

    # Test toggling completion status
    toggled_task = repo.toggle_task_status(task1.id)
    print(f"Toggled task status: ID={toggled_task.id}, Completed={toggled_task.completed}")

    # Verify status was toggled
    assert toggled_task.completed is True
    print("✓ Toggle task status functionality works")

    # Test getting all tasks
    all_tasks = repo.get_all_tasks()
    print(f"Total tasks: {len(all_tasks)}")
    assert len(all_tasks) == 1
    print("✓ Get all tasks functionality works")

    # Test deleting a task
    delete_success = repo.delete_task(task1.id)
    print(f"Delete task result: {delete_success}")

    # Verify task was deleted
    assert delete_success is True
    all_tasks = repo.get_all_tasks()
    assert len(all_tasks) == 0
    print("✓ Delete task functionality works")

    print("\n🎉 All basic functionality tests passed!")
    return True

if __name__ == "__main__":
    test_basic_functionality()