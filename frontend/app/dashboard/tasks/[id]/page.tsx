'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useUser } from '@/contexts/user-context';
import { todoApi, Task } from '@/lib/api';
import TaskForm from '@/components/TaskForm';

const TaskDetailPage = () => {
  const router = useRouter();
  const params = useParams();
  const taskId = parseInt(params.id as string);
  const { user, isLoading: userIsLoading } = useUser();

  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!userIsLoading && !user) {
      router.push('/login');
    }
  }, [user, userIsLoading, router]);

  // Fetch task when component mounts
  useEffect(() => {
    if (user && taskId) {
      fetchTask();
    }
  }, [user, taskId]);

  const fetchTask = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await todoApi.getTaskById(taskId);
      setTask(response.data);
    } catch (err) {
      setError('Failed to load task. Please try again.');
      console.error('Error fetching task:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateTask = async (taskData: {
    title?: string;
    description?: string;
    priority?: 'high' | 'medium' | 'low';
    category?: string;
    due_date?: string;
    reminder_date?: string;
    completed?: boolean
  }) => {
    try {
      const response = await todoApi.updateTask(taskId, taskData);
      setTask(response.data);
      setSuccessMessage('Task updated successfully!');

      // Exit edit mode after successful update
      setIsEditing(false);

      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setError('Failed to update task. Please try again.');
      console.error('Error updating task:', err);
    }
  };

  const handleToggleTaskStatus = async () => {
    try {
      const response = await todoApi.toggleTaskStatus(taskId);
      setTask(prev => prev ? { ...prev, completed: !prev.completed } : null);
      setSuccessMessage('Task status updated!');

      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setError('Failed to update task status. Please try again.');
      console.error('Error updating task status:', err);
    }
  };

  const handleDeleteTask = async () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await todoApi.deleteTask(taskId);
        setSuccessMessage('Task deleted successfully!');

        // Redirect back to dashboard after deletion
        setTimeout(() => router.push('/dashboard'), 1500);
      } catch (err) {
        setError('Failed to delete task. Please try again.');
        console.error('Error deleting task:', err);
      }
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (userIsLoading) {
    return (
      <div className="flex justify-center items-center h-64 bg-[#0F0F0F]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-400"></div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0F0F0F]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-400"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!task) {
    return (
      <div className="min-h-screen bg-[#0F0F0F]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-100 mb-4">Task Not Found</h2>
            <p className="text-gray-400 mb-6">The task you're looking for doesn't exist or may have been deleted.</p>
            <button
              onClick={() => router.push('/dashboard')}
              className="
                bg-gradient-to-r from-indigo-500 to-purple-500
                hover:from-indigo-600 hover:to-purple-600
                text-white
                py-2.5 px-6
                rounded-xl
                font-medium
                shadow-lg shadow-indigo-500/25
                hover:shadow-xl hover:shadow-indigo-500/40
                hover:scale-105
                transition-all duration-200
              "
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0F0F0F]">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 via-purple-500/10 to-transparent" />

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center justify-between">
            <h1 className="text-4xl font-bold text-gray-100">Task Details</h1>
            <button
              onClick={() => router.push('/dashboard')}
              className="
                bg-white/10
                backdrop-blur-xl
                border border-white/20
                rounded-xl
                px-4 py-2
                text-gray-300
                hover:bg-white/20
                transition-colors duration-200
              "
            >
              ← Back to Dashboard
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6 p-4 bg-red-500/20 text-red-400 rounded-xl border border-red-500/30 backdrop-blur-sm">
            {error}
          </div>
        )}

        {successMessage && (
          <div className="mb-6 p-4 bg-green-500/20 text-green-400 rounded-xl border border-green-500/30 backdrop-blur-sm">
            {successMessage}
          </div>
        )}

        <div className="space-y-8">
          {isEditing ? (
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 transition-all duration-300">
              <h2 className="text-2xl font-semibold text-gray-100 mb-6">Edit Task</h2>
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
                onSubmit={async (taskData) => {
                  await handleUpdateTask(taskData);
                  setIsEditing(false);
                }}
                onCancel={() => setIsEditing(false)}
              />
            </div>
          ) : (
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 transition-all duration-300">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div>
                  <h2 className={`text-3xl font-bold ${task.completed ? 'line-through text-gray-500' : 'text-gray-100'}`}>
                    {task.title}
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">
                    Created: {new Date(task.created_at).toLocaleDateString()}
                  </p>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={handleToggleTaskStatus}
                    className={`
                      px-4 py-2 rounded-xl font-medium transition-all duration-200
                      ${task.completed
                        ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 hover:bg-yellow-500/30'
                        : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/30'
                      }
                    `}
                  >
                    {task.completed ? 'Mark as Incomplete' : 'Mark as Complete'}
                  </button>

                  <button
                    onClick={() => setIsEditing(true)}
                    className="
                      bg-white/10
                      backdrop-blur-xl
                      border border-white/20
                      rounded-xl
                      px-4 py-2
                      text-gray-300
                      hover:bg-white/20
                      transition-colors duration-200
                    "
                  >
                    Edit
                  </button>

                  <button
                    onClick={handleDeleteTask}
                    className="
                      bg-red-500/20
                      text-red-400
                      border border-red-500/30
                      rounded-xl
                      px-4 py-2
                      hover:bg-red-500/30
                      transition-colors duration-200
                    "
                  >
                    Delete
                  </button>
                </div>
              </div>

              <div className="space-y-6">
                {task.description && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-300 mb-2">Description</h3>
                    <p className="text-gray-400 bg-white/5 rounded-lg p-4 border border-white/5">
                      {task.description}
                    </p>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-300 mb-2">Priority</h3>
                    <span className={`
                      inline-flex items-center px-3 py-1 rounded-full text-sm font-medium
                      ${task.priority === 'high'
                        ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                        : task.priority === 'medium'
                          ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                          : 'bg-green-500/20 text-green-400 border border-green-500/30'}
                    `}>
                      {task.priority ? task.priority.charAt(0).toUpperCase() + task.priority.slice(1) : 'Medium'}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-300 mb-2">Category</h3>
                    {task.category ? (
                      <span className="
                        inline-flex items-center px-3 py-1 rounded-full text-sm font-medium
                        bg-indigo-500/20 text-indigo-400 border border-indigo-500/30
                      ">
                        {task.category}
                      </span>
                    ) : (
                      <span className="text-gray-500 italic">No category assigned</span>
                    )}
                  </div>

                  {task.due_date && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-300 mb-2">Due Date</h3>
                      <span className={`
                        inline-flex items-center px-3 py-1 rounded-full text-sm font-medium
                        ${new Date(task.due_date) < new Date() && !task.completed
                          ? 'bg-red-500/20 text-red-400 border border-red-500/30' // Overdue
                          : 'bg-blue-500/20 text-blue-400 border border-blue-500/30' // Upcoming
                        }
                      `}>
                        {new Date(task.due_date) < new Date() && !task.completed ? 'Overdue: ' : 'Due: '}
                        {formatDate(task.due_date)}
                      </span>
                    </div>
                  )}

                  {task.reminder_date && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-300 mb-2">Reminder Date</h3>
                      <span className="
                        inline-flex items-center px-3 py-1 rounded-full text-sm font-medium
                        bg-purple-500/20 text-purple-400 border border-purple-500/30
                      ">
                        {formatDate(task.reminder_date)}
                      </span>
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-white/10">
                  <h3 className="text-lg font-semibold text-gray-300 mb-3">Status</h3>
                  <div className="flex items-center gap-2">
                    <div className={`
                      w-3 h-3 rounded-full
                      ${task.completed ? 'bg-emerald-500' : 'bg-yellow-500'}
                    `}></div>
                    <span className="text-gray-400">
                      {task.completed ? 'Completed' : 'Pending'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskDetailPage;