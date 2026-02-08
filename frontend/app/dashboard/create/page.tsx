'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/contexts/user-context';
import { todoApi } from '@/lib/api';
import TaskForm from '@/components/TaskForm';

const CreateTaskPage = () => {
  const router = useRouter();
  const { user, isLoading: userIsLoading } = useUser();

  // Redirect to login if not authenticated
  React.useEffect(() => {
    if (!userIsLoading && !user) {
      router.push('/login');
    }
  }, [user, userIsLoading, router]);

  const handleCreateTask = async (taskData: {
    title: string;
    description?: string;
    priority?: 'high' | 'medium' | 'low';
    category?: string;
    due_date?: string;
    reminder_date?: string
  }) => {
    try {
      await todoApi.createTask(taskData);
      // Navigate back to dashboard after successful creation and reload to ensure fresh data
      window.location.href = '/dashboard';
    } catch (err) {
      console.error('Error creating task:', err);
      alert('Failed to create task. Please try again.');
    }
  };

  const handleCancel = () => {
    router.push('/dashboard');
  };

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
          <h1 className="text-4xl font-bold text-gray-100 mb-2">
            Create New Task
          </h1>
          <p className="text-xl text-gray-400">
            Add a new task to your todo list
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="
          bg-white/5
          backdrop-blur-xl
          border border-white/10
          rounded-2xl
          p-6
          transition-all duration-300
          hover:bg-white/10
          hover:border-white/20
          hover:shadow-xl hover:shadow-indigo-500/10
        ">
          <TaskForm
            onSubmit={handleCreateTask}
            onCancel={handleCancel}
          />
        </div>
      </div>
    </div>
  );
};

export default CreateTaskPage;