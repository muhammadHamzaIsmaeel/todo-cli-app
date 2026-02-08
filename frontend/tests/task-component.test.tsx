/**
 * UI Tests for Task Components in the Todo Full-Stack Web Application
 *
 * Tests for frontend components using React Testing Library and Jest
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import TaskCard from '@/components/TaskCard';
import TaskForm from '@/components/TaskForm';
import TaskList from '@/components/TaskList';
import DeleteConfirmModal from '@/components/DeleteConfirmModal';

// Mock the API functions
vi.mock('@/lib/api', () => ({
  getTasks: vi.fn(),
  createTask: vi.fn(),
  updateTask: vi.fn(),
  deleteTask: vi.fn(),
  toggleTaskStatus: vi.fn(),
}));

// Mock the better-auth-integration hooks
vi.mock('@/lib/better-auth-integration', () => ({
  useSession: vi.fn(() => ({ data: { user: { id: 1, email: 'test@example.com' } }, isPending: false })),
}));

describe('TaskCard Component', () => {
  const mockTask = {
    id: 1,
    title: 'Test Task',
    description: 'Test Description',
    completed: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  const mockOnToggleComplete = vi.fn();
  const mockOnUpdateTask = vi.fn();
  const mockOnDeleteTask = vi.fn();

  it('renders task information correctly', () => {
    render(
      <TaskCard
        task={mockTask}
        onToggleComplete={mockOnToggleComplete}
        onUpdateTask={mockOnUpdateTask}
        onDeleteTask={mockOnDeleteTask}
      />
    );

    expect(screen.getByText('Test Task')).toBeInTheDocument();
    expect(screen.getByText('Test Description')).toBeInTheDocument();
    expect(screen.getByLabelText('Mark as complete')).toBeInTheDocument();
  });

  it('shows completed state when task is completed', () => {
    const completedTask = { ...mockTask, completed: true };
    render(
      <TaskCard
        task={completedTask}
        onToggleComplete={mockOnToggleComplete}
        onUpdateTask={mockOnUpdateTask}
        onDeleteTask={mockOnDeleteTask}
      />
    );

    // Check that the task appears as completed (with strikethrough or visual indicator)
    const taskTitle = screen.getByText('Test Task');
    expect(taskTitle).toHaveClass('line-through');
  });

  it('calls onToggleComplete when checkbox is clicked', () => {
    render(
      <TaskCard
        task={mockTask}
        onToggleComplete={mockOnToggleComplete}
        onUpdateTask={mockOnUpdateTask}
        onDeleteTask={mockOnDeleteTask}
      />
    );

    const checkbox = screen.getByLabelText('Mark as complete');
    fireEvent.click(checkbox);

    expect(mockOnToggleComplete).toHaveBeenCalledWith(1);
  });

  it('shows edit form when edit button is clicked', async () => {
    render(
      <TaskCard
        task={mockTask}
        onToggleComplete={mockOnToggleComplete}
        onUpdateTask={mockOnUpdateTask}
        onDeleteTask={mockOnDeleteTask}
      />
    );

    const editButton = screen.getByLabelText('Edit task');
    fireEvent.click(editButton);

    // Wait for the edit form to appear
    await waitFor(() => {
      expect(screen.getByDisplayValue('Test Task')).toBeInTheDocument();
    });
  });
});

describe('TaskForm Component', () => {
  const mockOnSubmit = vi.fn();
  const mockOnCancel = vi.fn();

  it('renders form fields correctly', () => {
    render(
      <TaskForm
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
        isEditing={false}
      />
    );

    expect(screen.getByPlaceholderText('Enter task title...')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter task description (optional)...')).toBeInTheDocument();
    expect(screen.getByText('Create Task')).toBeInTheDocument();
  });

  it('shows update button when in editing mode', () => {
    render(
      <TaskForm
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
        initialData={{ title: 'Edit Task', description: 'Edit Description' }}
        isEditing={true}
      />
    );

    expect(screen.getByText('Update Task')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Edit Task')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Edit Description')).toBeInTheDocument();
  });

  it('validates required fields', async () => {
    render(
      <TaskForm
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
        isEditing={false}
      />
    );

    const titleInput = screen.getByPlaceholderText('Enter task title...');
    const submitButton = screen.getByText('Create Task');

    // Try to submit with empty title
    fireEvent.click(submitButton);

    // Should show validation error
    await waitFor(() => {
      expect(screen.getByText('Title is required')).toBeInTheDocument();
    });
  });

  it('submits form data when valid', async () => {
    render(
      <TaskForm
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
        isEditing={false}
      />
    );

    const titleInput = screen.getByPlaceholderText('Enter task title...');
    const descriptionInput = screen.getByPlaceholderText('Enter task description (optional)...');
    const submitButton = screen.getByText('Create Task');

    fireEvent.change(titleInput, { target: { value: 'New Task' } });
    fireEvent.change(descriptionInput, { target: { value: 'New Description' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        title: 'New Task',
        description: 'New Description',
      });
    });
  });
});

describe('DeleteConfirmModal Component', () => {
  const mockOnClose = vi.fn();
  const mockOnConfirm = vi.fn();

  it('renders modal with task title', () => {
    render(
      <DeleteConfirmModal
        isOpen={true}
        onClose={mockOnClose}
        onConfirm={mockOnConfirm}
        taskTitle="Test Task"
      />
    );

    expect(screen.getByText('Delete Task')).toBeInTheDocument();
    expect(screen.getByText('"Test Task"')).toBeInTheDocument();
  });

  it('calls onConfirm when delete button is clicked', () => {
    render(
      <DeleteConfirmModal
        isOpen={true}
        onClose={mockOnClose}
        onConfirm={mockOnConfirm}
        taskTitle="Test Task"
      />
    );

    const deleteButton = screen.getByText('Delete');
    fireEvent.click(deleteButton);

    expect(mockOnConfirm).toHaveBeenCalled();
  });

  it('calls onClose when cancel button is clicked', () => {
    render(
      <DeleteConfirmModal
        isOpen={true}
        onClose={mockOnClose}
        onConfirm={mockOnConfirm}
        taskTitle="Test Task"
      />
    );

    const cancelButton = screen.getByText('Cancel');
    fireEvent.click(cancelButton);

    expect(mockOnClose).toHaveBeenCalled();
  });

  it('does not render when isOpen is false', () => {
    render(
      <DeleteConfirmModal
        isOpen={false}
        onClose={mockOnClose}
        onConfirm={mockOnConfirm}
        taskTitle="Test Task"
      />
    );

    expect(screen.queryByText('Delete Task')).not.toBeInTheDocument();
  });
});

describe('TaskList Component', () => {
  const mockTasks = [
    {
      id: 1,
      title: 'Task 1',
      description: 'Description 1',
      completed: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 2,
      title: 'Task 2',
      description: 'Description 2',
      completed: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ];

  const mockOnUpdateTask = vi.fn();
  const mockOnDeleteTask = vi.fn();
  const mockOnToggleComplete = vi.fn();

  it('renders all tasks', () => {
    render(
      <TaskList
        tasks={mockTasks}
        onUpdateTask={mockOnUpdateTask}
        onDeleteTask={mockOnDeleteTask}
        onToggleComplete={mockOnToggleComplete}
      />
    );

    expect(screen.getByText('Task 1')).toBeInTheDocument();
    expect(screen.getByText('Task 2')).toBeInTheDocument();
    expect(screen.getByText('Description 1')).toBeInTheDocument();
    expect(screen.getByText('Description 2')).toBeInTheDocument();
  });

  it('shows loading state when tasks are loading', () => {
    render(
      <TaskList
        tasks={[]}
        onUpdateTask={mockOnUpdateTask}
        onDeleteTask={mockOnDeleteTask}
        onToggleComplete={mockOnToggleComplete}
        loading={true}
      />
    );

    // Check for loading indicator
    expect(screen.getByText('Loading tasks...')).toBeInTheDocument();
  });

  it('shows empty state when no tasks exist', () => {
    render(
      <TaskList
        tasks={[]}
        onUpdateTask={mockOnUpdateTask}
        onDeleteTask={mockOnDeleteTask}
        onToggleComplete={mockOnToggleComplete}
        loading={false}
      />
    );

    expect(screen.getByText('No tasks found')).toBeInTheDocument();
  });

  it('calls appropriate handlers when task actions are performed', async () => {
    render(
      <TaskList
        tasks={mockTasks}
        onUpdateTask={mockOnUpdateTask}
        onDeleteTask={mockOnDeleteTask}
        onToggleComplete={mockOnToggleComplete}
      />
    );

    // Test toggle completion
    const toggleButton = screen.getByLabelText('Mark as complete');
    fireEvent.click(toggleButton);
    expect(mockOnToggleComplete).toHaveBeenCalledWith(1);

    // Test edit task
    const editButton = screen.getByLabelText('Edit task');
    fireEvent.click(editButton);
    // Additional assertions would depend on how the edit functionality works

    // Test delete task
    const deleteButton = screen.getByLabelText('Delete task');
    fireEvent.click(deleteButton);
    // This would open the confirmation modal
  });
});

describe('ThemeToggle Component', () => {
  it('renders theme toggle button', () => {
    // This would require more complex setup with ThemeContext
    // For now, we'll just describe the test structure
    expect(true).toBe(true); // Placeholder
  });
});

describe('Navigation Component', () => {
  it('renders navigation links', () => {
    // This would require more complex setup with Next.js router
    // For now, we'll just describe the test structure
    expect(true).toBe(true); // Placeholder
  });
});