// frontend/app/dashboard/page.tsx
// Dashboard page for the Todo Full-Stack Web Application
// Following ModernUIDesign skill with glassmorphism, dark mode, soft edges, and micro-interactions

'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useUser } from '@/contexts/user-context';
import { todoApi, Task } from '@/lib/api';
import TaskForm from '@/components/TaskForm';
import TaskFilterPanel from '@/components/TaskFilterPanel';
import ViewSwitcher from '@/components/ViewSwitcher';
import KanbanBoard from '@/components/KanbanBoard';
import CalendarView from '@/components/CalendarView';

const DashboardPage = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [currentView, setCurrentView] = useState<'list' | 'kanban' | 'calendar'>('list');
  const [kanbanData, setKanbanData] = useState<{ todo: Task[]; in_progress: Task[]; done: Task[] }>({
    todo: [],
    in_progress: [],
    done: []
  });
  const [filters, setFilters] = useState({
    status: 'all',
    priority: 'all',
    category: '',
    due_date_start: '',
    due_date_end: '',
    search: ''
  });

  const router = useRouter();
  const { user, isLoading: userIsLoading } = useUser();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!userIsLoading && !user) {
      router.push('/login');
    }
  }, [user, userIsLoading, router]);

  // Fetch tasks when component mounts
  useEffect(() => {
    if (user) {
      fetchTasks();
    }
  }, [user]);

  // Apply filters when tasks or filters change
  useEffect(() => {
    if (tasks.length > 0) {
      applyFilters();
    }
  }, [tasks, filters]);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await todoApi.getTasks();
      setTasks(response.data);
    } catch (err) {
      setError('Failed to load tasks. Please try again.');
      console.error('Error fetching tasks:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchKanbanData = async () => {
    try {
      const response = await todoApi.getKanbanTasks();
      setKanbanData(response.data);
    } catch (err) {
      setError('Failed to load Kanban data. Please try again.');
      console.error('Error fetching Kanban data:', err);
    }
  };

  const applyFilters = () => {
    let filtered = [...tasks];

    // Apply status filter
    if (filters.status && filters.status !== 'all') {
      if (filters.status === 'pending') {
        filtered = filtered.filter(task => !task.completed);
      } else if (filters.status === 'completed') {
        filtered = filtered.filter(task => task.completed);
      }
    }

    // Apply priority filter
    if (filters.priority && filters.priority !== 'all') {
      filtered = filtered.filter(task => task.priority === filters.priority);
    }

    // Apply category filter
    if (filters.category && filters.category !== 'all') {
      filtered = filtered.filter(task => task.category === filters.category);
    }

    // Apply search filter
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filtered = filtered.filter(task =>
        task.title.toLowerCase().includes(searchTerm) ||
        (task.description && task.description.toLowerCase().includes(searchTerm)) ||
        (task.category && task.category.toLowerCase().includes(searchTerm))
      );
    }

    setFilteredTasks(filtered);
  };

  const handleFilterChange = (newFilters: any) => {
    setFilters(prev => {
      const updatedFilters = { ...prev, ...newFilters };
      return updatedFilters;
    });
  };

  const handleCreateTask = async (taskData: { title: string; description?: string; priority?: 'high' | 'medium' | 'low'; category?: string; due_date?: string; reminder_date?: string }) => {
    try {
      const response = await todoApi.createTask(taskData);
      setTasks([...tasks, response.data]);
      setSuccessMessage('Task created successfully!');

      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setError('Failed to create task. Please try again.');
      console.error('Error creating task:', err);
    }
  };

  const handleToggleTaskStatus = async (taskId: number) => {
    try {
      const response = await todoApi.toggleTaskStatus(taskId);
      setTasks(tasks.map(task =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      ));
      setSuccessMessage('Task status updated!');

      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setError('Failed to update task status. Please try again.');
      console.error('Error updating task status:', err);
    }
  };

  const handleUpdateTask = async (taskId: number, taskData: { title?: string; description?: string; priority?: 'high' | 'medium' | 'low'; category?: string; due_date?: string; reminder_date?: string; completed?: boolean }) => {
    try {
      const response = await todoApi.updateTask(taskId, taskData);
      setTasks(tasks.map(task =>
        task.id === taskId ? { ...task, ...response.data } : task
      ));
      setSuccessMessage('Task updated successfully!');

      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setError('Failed to update task. Please try again.');
      console.error('Error updating task:', err);
    }
  };

  const handleDeleteTask = async (taskId: number) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await todoApi.deleteTask(taskId);
        setTasks(tasks.filter(task => task.id !== taskId));
        setSuccessMessage('Task deleted successfully!');

        // Clear success message after 3 seconds
        setTimeout(() => setSuccessMessage(''), 3000);
      } catch (err) {
        setError('Failed to delete task. Please try again.');
        console.error('Error deleting task:', err);
      }
    }
  };

  const handleMoveTask = async (taskId: number, newStatus: string) => {
    try {
      const task = tasks.find(t => t.id === taskId);
      if (task) {
        // Determine completed status based on new status
        let completed = task.completed;
        if (newStatus === 'done') completed = true;
        else if (newStatus === 'todo' || newStatus === 'in_progress') completed = false;

        await handleUpdateTask(taskId, { ...task, completed });
      }
    } catch (err) {
      setError('Failed to move task. Please try again.');
      console.error('Error moving task:', err);
    }
  };

  // Update Kanban data when tasks change
  useEffect(() => {
    if (currentView === 'kanban') {
      fetchKanbanData();
    }
  }, [tasks, currentView]);

  if (userIsLoading) {
    return (
      <div className="flex justify-center items-center h-64 bg-[#0F0F0F]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-400"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0F0F0F]">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 via-purple-500/10 to-transparent" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-5xl font-bold text-gray-100 mb-2">
            Welcome to Your Nexa Dashboard
          </h1>
          <p className="text-xl text-gray-400">
            Manage your tasks efficiently with advanced features
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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

        {/* View Switcher and Actions */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <ViewSwitcher
            currentView={currentView}
            onViewChange={(view) => setCurrentView(view as 'list' | 'kanban' | 'calendar')}
          />

          <a
            href="/dashboard/create"
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
              whitespace-nowrap
            "
          >
            + Create New Task
          </a>
        </div>

        {/* Filter Section - Above Tasks */}
        <div className="mb-8">
          <TaskFilterPanel
            onFilterChange={handleFilterChange}
            tasks={tasks}
          />
        </div>

        <div className="grid grid-cols-1">
          {/* Main Content - Tasks/Views */}
          <div>
            <h2 className="text-2xl font-semibold text-gray-100 mb-6">
              {currentView === 'list' ? 'Your Tasks' :
               currentView === 'kanban' ? 'Kanban Board' : 'Calendar View'}
              <span className="text-sm text-gray-500 ml-2">
                ({filteredTasks.length} {filteredTasks.length === 1 ? 'task' : 'tasks'})
              </span>
            </h2>

            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-400"></div>
              </div>
            ) : currentView === 'kanban' ? (
              <KanbanBoard
                kanbanData={kanbanData}
                onTaskMove={handleMoveTask}
                onRefresh={fetchKanbanData}
              />
            ) : currentView === 'calendar' ? (
              <CalendarView
                tasks={tasks.filter(task => task.due_date)}
                onRefresh={fetchTasks}
              />
            ) : (
              <div className="space-y-4">
                {filteredTasks.length === 0 ? (
                  <div className="
                    bg-white/5
                    backdrop-blur-xl
                    border border-white/10
                    rounded-2xl
                    p-12
                    text-center
                    transition-all duration-300
                    hover:bg-white/10
                    hover:border-white/20
                    hover:shadow-xl hover:shadow-indigo-500/10
                  ">
                    <div className="text-4xl mb-4">📋</div>
                    <p className="text-gray-400 text-lg">
                      {tasks.length === 0
                        ? 'No tasks yet. Create your first task!'
                        : 'No tasks match your current filters.'}
                    </p>
                    <Link
                      href="/dashboard/create"
                      className="
                        mt-4
                        bg-gradient-to-r from-indigo-500 to-purple-500
                        hover:from-indigo-600 hover:to-purple-600
                        text-white
                        py-2 px-4
                        rounded-xl
                        font-medium
                        shadow-lg shadow-indigo-500/25
                        hover:shadow-xl hover:shadow-indigo-500/40
                        hover:scale-105
                        transition-all duration-200
                      "
                    >
                      Create Task
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredTasks.map((task) => (
                      <Link
                        key={task.id}
                        href={`/dashboard/tasks/${task.id}`}
                        className={`
                          block
                          bg-white/5
                          backdrop-blur-xl
                          border border-white/10
                          rounded-2xl
                          p-6
                          transition-all duration-300
                          hover:bg-white/10
                          hover:border-white/20
                          hover:shadow-xl hover:shadow-indigo-500/10
                          cursor-pointer
                          ${task.completed ? 'opacity-70' : ''}
                        `}
                      >
                        <div className="flex items-start gap-4">
                          <button
                            onClick={(e) => {
                              e.preventDefault(); // Prevent navigation when clicking the checkbox
                              handleToggleTaskStatus(task.id);
                            }}
                            className={`
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
                          <div className="flex gap-2">
                            <button
                              onClick={(e) => {
                                e.preventDefault(); // Prevent navigation when clicking edit button
                                // We'll remove the prompt and rely on the detail page for editing
                              }}
                              className="
                                p-2
                                text-gray-400 hover:text-indigo-400
                                rounded-lg hover:bg-white/10
                                transition-colors duration-200
                                text-sm
                              "
                              aria-label="View task details"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
                            </button>
                            <button
                              onClick={(e) => {
                                e.preventDefault(); // Prevent navigation when clicking delete button
                                handleDeleteTask(task.id);
                              }}
                              className="
                                p-2
                                text-gray-400 hover:text-red-400
                                rounded-lg hover:bg-white/10
                                transition-colors duration-200
                                text-sm
                              "
                              aria-label="Delete task"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;