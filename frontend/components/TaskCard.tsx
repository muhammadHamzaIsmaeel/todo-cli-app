/**
 * TaskCard Component
 *
 * A reusable component that displays a single task with options to:
 * - Mark as complete/incomplete
 * - Edit task details
 * - Delete the task with confirmation
 * - View task metadata (creation/update dates)
 *
 * Features:
 * - Responsive design that works on mobile and desktop
 * - Dark/light mode support with glassmorphism effects
 * - Interactive elements with hover/focus states
 * - Confirmation modal for task deletion
 * - Edit-in-place functionality
 * - Micro-interactions and smooth transitions
 *
 * @component
 * @example
 * return (
 *   <TaskCard
 *     task={task}
 *     onToggleComplete={handleToggleComplete}
 *     onUpdateTask={handleUpdateTask}
 *     onDeleteTask={handleDeleteTask}
 *   />
 * )
 */
import React, { useState } from 'react';
import TaskForm from './TaskForm';
import DeleteConfirmModal from './DeleteConfirmModal';

interface Task {
  id: number;
  title: string;
  description?: string;
  completed: boolean;
  created_at: string;
  updated_at: string;
  priority?: 'high' | 'medium' | 'low';
  category?: string;
  due_date?: string; // ISO string format
  reminder_date?: string; // ISO string format
}

interface TaskCardProps {
  task: Task;
  onToggleComplete: (id: number) => void;
  onUpdateTask: (id: number, taskData: { title: string; description?: string; priority?: 'high' | 'medium' | 'low'; category?: string; due_date?: string; reminder_date?: string }) => void;
  onDeleteTask: (id: number) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onToggleComplete, onUpdateTask, onDeleteTask }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleUpdate = async (taskData: { title: string; description?: string; priority?: 'high' | 'medium' | 'low'; category?: string; due_date?: string; reminder_date?: string }) => {
    try {
      await onUpdateTask(task.id, taskData);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  const handleDelete = () => {
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = () => {
    onDeleteTask(task.id);
    setShowDeleteModal(false);
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
  };

  return (
    <div className="group relative">
      {/* Glassmorphism Container */}
      <div className={`
        bg-white/5 dark:bg-white/5
        backdrop-blur-xl
        border border-white/10
        rounded-2xl
        p-6
        transition-all duration-300
        hover:bg-white/10
        hover:border-white/20
        hover:shadow-xl hover:shadow-indigo-500/10
        ${task.completed ? 'opacity-60' : ''}
      `}>
        {isEditing ? (
          <TaskForm
            initialData={{
              title: task.title,
              description: task.description || '',
              priority: task.priority || 'medium',
              category: task.category || '',
              due_date: task.due_date || '',
              reminder_date: task.reminder_date || ''
            }}
            isEditing={true}
            onSubmit={handleUpdate}
            onCancel={handleCancelEdit}
          />
        ) : (
          <div className="flex items-start gap-4">
            <button
              onClick={() => onToggleComplete(task.id)}
              className={`
                relative flex-shrink-0
                w-6 h-6
                rounded-lg
                border-2
                transition-all duration-200
                ${task.completed
                  ? 'bg-emerald-500 border-emerald-500'
                  : 'border-white/30 hover:border-indigo-400'
                }
              `}
              aria-label={task.completed ? 'Mark as incomplete' : 'Mark as complete'}
            >
              {task.completed && (
                <svg className="w-full h-full text-white p-0.5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              )}
            </button>

            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <h3 className={`
                  text-lg font-semibold
                  ${task.completed
                    ? 'line-through text-gray-500'
                    : 'text-gray-100'
                  }
                `}>
                  {task.title}
                </h3>

                {/* Priority badge */}
                {task.priority && (
                  <span className={`
                    inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium
                    ${task.priority === 'high'
                      ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                      : task.priority === 'medium'
                        ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                        : 'bg-green-500/20 text-green-400 border border-green-500/30'}
                  `}>
                    {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                  </span>
                )}
              </div>

              {task.description && (
                <p className="mt-1 text-sm text-gray-400">
                  {task.description}
                </p>
              )}

              <div className="mt-2 flex flex-wrap gap-2">
                {/* Category tag */}
                {task.category && (
                  <span className="
                    inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium
                    bg-indigo-500/20 text-indigo-400 border border-indigo-500/30
                  ">
                    {task.category}
                  </span>
                )}

                {/* Due date indicator */}
                {task.due_date && (
                  <span className={`
                    inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium
                    ${new Date(task.due_date) < new Date() && !task.completed
                      ? 'bg-red-500/20 text-red-400 border border-red-500/30' // Overdue
                      : 'bg-blue-500/20 text-blue-400 border border-blue-500/30' // Upcoming
                    }
                  `}>
                    {new Date(task.due_date) < new Date() && !task.completed ? 'Overdue: ' : 'Due: '}
                    {new Date(task.due_date).toLocaleDateString()}
                  </span>
                )}
              </div>

              <p className="mt-2 text-xs text-gray-500">
                {new Date(task.created_at).toLocaleDateString()}
              </p>
            </div>

            {/* Action Buttons (Show on Hover) */}
            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => setIsEditing(true)}
                className="p-2 rounded-lg hover:bg-white/10 text-gray-400 hover:text-indigo-400 transition-colors"
                aria-label="Edit task"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>

              <button
                onClick={handleDelete}
                className="p-2 rounded-lg hover:bg-white/10 text-gray-400 hover:text-red-400 transition-colors"
                aria-label="Delete task"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>
      <DeleteConfirmModal
        isOpen={showDeleteModal}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        taskTitle={task.title}
      />
    </div>
  );
};

export default TaskCard;