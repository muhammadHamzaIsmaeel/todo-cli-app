// frontend/src/components/tasks/TaskList.tsx
// Task list component for the Todo Full-Stack Web Application
// Following ModernUIDesign skill with glassmorphism, dark mode, soft edges, and micro-interactions

import React from 'react';
import TaskCard from './TaskCard';
import { Task } from '../lib/api';

interface TaskListProps {
  tasks: Task[];
  loading?: boolean;
  onToggleComplete: (id: number) => void;
  onUpdateTask: (id: number, taskData: { title: string; description?: string; priority?: 'high' | 'medium' | 'low'; category?: string; due_date?: string; reminder_date?: string }) => void;
  onDeleteTask: (id: number) => void;
  statusFilter?: 'all' | 'pending' | 'completed';
  onStatusFilterChange?: (filter: 'all' | 'pending' | 'completed') => void;
}

const TaskList: React.FC<TaskListProps> = ({
  tasks,
  loading = false,
  onToggleComplete,
  onUpdateTask,
  onDeleteTask,
  statusFilter = 'all',
  onStatusFilterChange
}) => {
  // Filter tasks based on status
  const filteredTasks = tasks.filter(task => {
    if (statusFilter === 'pending') return !task.completed;
    if (statusFilter === 'completed') return task.completed;
    return true; // 'all'
  });

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex gap-2 mb-4">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded-lg w-20 animate-pulse"></div>
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded-lg w-20 animate-pulse"></div>
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded-lg w-20 animate-pulse"></div>
        </div>
        {[...Array(3)].map((_, index) => (
          <div
            key={index}
            className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700 animate-pulse"
          >
            <div className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full border-2 border-gray-300 dark:border-gray-600 mt-0.5 flex-shrink-0"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Status Filter Controls */}
      <div className="flex gap-2">
        {(['all', 'pending', 'completed'] as const).map((filter) => (
          <button
            key={filter}
            onClick={() => onStatusFilterChange?.(filter)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
              statusFilter === filter
                ? 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 border border-indigo-300 dark:border-indigo-700'
                : 'bg-gray-100 dark:bg-gray-700/50 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            {filter.charAt(0).toUpperCase() + filter.slice(1)}
            <span className="ml-1.5 text-xs bg-gray-200 dark:bg-gray-600 rounded-full px-1.5 py-0.5">
              {
                filter === 'pending'
                  ? tasks.filter(t => !t.completed).length
                  : filter === 'completed'
                    ? tasks.filter(t => t.completed).length
                    : tasks.length
              }
            </span>
          </button>
        ))}
      </div>

      {/* Task Count Summary */}
      <div className="text-sm text-gray-600 dark:text-gray-400">
        Showing {filteredTasks.length} of {tasks.length} task{tasks.length !== 1 ? 's' : ''}
      </div>

      {filteredTasks.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-8 text-center backdrop-blur-sm bg-opacity-90 border border-gray-200 dark:border-gray-700">
          <p className="text-gray-600 dark:text-gray-400">
            {statusFilter === 'completed'
              ? 'No completed tasks yet.'
              : statusFilter === 'pending'
                ? 'No pending tasks yet.'
                : 'No tasks yet.'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onToggleComplete={onToggleComplete}
              onUpdateTask={onUpdateTask}
              onDeleteTask={onDeleteTask}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default TaskList;