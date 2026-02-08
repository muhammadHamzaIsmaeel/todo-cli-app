/**
 * TaskForm Component
 *
 * A form component for creating and updating tasks with:
 * - Title input field with validation
 * - Description textarea with character limit
 * - Submit and cancel buttons
 * - Form validation and error handling
 * - Responsive design for all screen sizes
 *
 * Features:
 * - Controlled form inputs with React state
 * - Validation for required fields and character limits
 * - Support for both creating new tasks and editing existing ones
 * - Proper accessibility attributes
 * - Dark/light mode styling with glassmorphism effects
 * - Loading states during form submission
 * - Character count indicators for inputs
 * - Smooth transitions and micro-interactions
 *
 * @component
 * @param {TaskFormProps} props - Component properties
 * @param {(taskData: { title: string; description?: string }) => void} props.onSubmit - Function called when form is submitted
 * @param {{ title: string; description?: string }} [props.initialData] - Initial form data for editing
 * @param {boolean} [props.isEditing=false] - Whether the form is for editing an existing task
 * @param {() => void} [props.onCancel] - Function called when cancel button is clicked (for editing mode)
 * @returns {JSX.Element} The rendered TaskForm component
 *
 * @example
 * return (
 *   <TaskForm
 *     initialData={{ title: '', description: '' }}
 *     isEditing={false}
 *     onSubmit={handleSubmit}
 *     onCancel={handleCancel}
 *   />
 * )
 */

'use client';

import React, { useState } from 'react';

interface TaskFormData {
  title: string;
  description?: string;
  priority?: 'high' | 'medium' | 'low';
  category?: string;
  due_date?: string; // ISO string format
  reminder_date?: string; // ISO string format
}

interface TaskFormProps {
  onSubmit: (taskData: TaskFormData) => void;
  initialData?: TaskFormData;
  isEditing?: boolean;
  onCancel?: () => void;
}

const TaskForm: React.FC<TaskFormProps> = ({ onSubmit, initialData, isEditing = false, onCancel }) => {
  const [title, setTitle] = useState(initialData?.title || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [priority, setPriority] = useState<'high' | 'medium' | 'low'>(initialData?.priority || 'medium');
  const [category, setCategory] = useState(initialData?.category || '');
  const [dueDate, setDueDate] = useState(initialData?.due_date || '');
  const [reminderDate, setReminderDate] = useState(initialData?.reminder_date || '');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!title.trim()) {
      setError('Title is required');
      return;
    }

    if (title.length < 1 || title.length > 200) {
      setError('Title must be between 1 and 200 characters');
      return;
    }

    if (description && description.length > 1000) {
      setError('Description must be at most 1000 characters');
      return;
    }

    if (category && category.length > 255) {
      setError('Category must be at most 255 characters');
      return;
    }

    setIsLoading(true);

    try {
      await onSubmit({
        title: title.trim(),
        description: description.trim() || undefined,
        priority,
        category: category.trim() || undefined,
        due_date: dueDate || undefined,
        reminder_date: reminderDate || undefined
      });

      // Reset form after successful submission
      if (!isEditing) {
        setTitle('');
        setDescription('');
        setPriority('medium');
        setCategory('');
        setDueDate('');
        setReminderDate('');
      }
    } catch (err) {
      setError('Failed to save task. Please try again.');
      console.error('Task form error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
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
      <h2 className="text-xl font-semibold text-gray-100 mb-4">
        {isEditing ? 'Edit Task' : 'Create New Task'}
      </h2>

      {error && (
        <div className="mb-4 p-3 bg-red-500/20 text-red-400 rounded-lg border border-red-500/30 backdrop-blur-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title and Description in one row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-1">
              Title *
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="
                w-full
                px-4 py-3
                bg-white/5
                backdrop-blur-xl
                border
                border-white/10
                rounded-xl
                text-gray-100
                placeholder:text-gray-500
                focus:outline-none
                focus:ring-2
                focus:ring-indigo-500
                focus:border-transparent
                transition-all duration-200
              "
              placeholder="Enter task title..."
              maxLength={200}
            />
            <div className="text-xs text-gray-500 mt-1 text-right">
              {title.length}/200
            </div>
          </div>

          <div>
            <label htmlFor="priority" className="block text-sm font-medium text-gray-300 mb-1">
              Priority
            </label>
            <select
              id="priority"
              value={priority}
              onChange={(e) => setPriority(e.target.value as 'high' | 'medium' | 'low')}
              className="
                w-full
                px-4 py-3
                bg-white/5
                backdrop-blur-xl
                border
                border-white/10
                rounded-xl
                text-gray-100
                focus:outline-none
                focus:ring-2
                focus:ring-indigo-500
                focus:border-transparent
                transition-all duration-200
              "
            >
              <option value="high" className="bg-gray-800">High</option>
              <option value="medium" className="bg-gray-800">Medium</option>
              <option value="low" className="bg-gray-800">Low</option>
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-1">
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="
              w-full
              px-4 py-3
              bg-white/5
              backdrop-blur-xl
              border
              border-white/10
              rounded-xl
              text-gray-100
              placeholder:text-gray-500
              focus:outline-none
              focus:ring-2
              focus:ring-indigo-500
              focus:border-transparent
              transition-all duration-200
            "
            placeholder="Enter task description (optional)..."
            maxLength={1000}
          />
          <div className="text-xs text-gray-500 mt-1 text-right">
            {description.length}/1000
          </div>
        </div>

        {/* Category and Date Inputs in one row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-300 mb-1">
              Category
            </label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="
                w-full
                px-4 py-3
                bg-white/5
                backdrop-blur-xl
                border
                border-white/10
                rounded-xl
                text-gray-100
                focus:outline-none
                focus:ring-2
                focus:ring-indigo-500
                focus:border-transparent
                transition-all duration-200
              "
            >
              <option value="" className="bg-gray-800">Select Category</option>
              <option value="Work" className="bg-gray-800">Work</option>
              <option value="Personal" className="bg-gray-800">Personal</option>
              <option value="Shopping" className="bg-gray-800">Shopping</option>
              <option value="Health" className="bg-gray-800">Health</option>
              <option value="Finance" className="bg-gray-800">Finance</option>
              <option value="Education" className="bg-gray-800">Education</option>
              <option value="Entertainment" className="bg-gray-800">Entertainment</option>
              <option value="Travel" className="bg-gray-800">Travel</option>
              <option value="Family" className="bg-gray-800">Family</option>
              <option value="Other" className="bg-gray-800">Other</option>
            </select>
          </div>

          <div>
            <label htmlFor="dueDate" className="block text-sm font-medium text-gray-300 mb-1">
              Due Date (optional)
            </label>
            <input
              id="dueDate"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="
                w-full
                px-4 py-3
                bg-white/5
                backdrop-blur-xl
                border
                border-white/10
                rounded-xl
                text-gray-100
                focus:outline-none
                focus:ring-2
                focus:ring-indigo-500
                focus:border-transparent
                transition-all duration-200
              "
            />
          </div>
        </div>

        {/* Reminder Date Input */}
        <div>
          <label htmlFor="reminderDate" className="block text-sm font-medium text-gray-300 mb-1">
            Reminder Date (optional)
          </label>
          <input
            id="reminderDate"
            type="datetime-local"
            value={reminderDate}
            onChange={(e) => setReminderDate(e.target.value)}
            className="
              w-full
              px-4 py-3
              bg-white/5
              backdrop-blur-xl
              border
              border-white/10
              rounded-xl
              text-gray-100
              focus:outline-none
              focus:ring-2
              focus:ring-indigo-500
              focus:border-transparent
              transition-all duration-200
            "
          />
        </div>

        <div className="flex gap-3 pt-2">
          {isEditing && onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="
                px-5 py-2.5
                bg-white/10
                backdrop-blur-xl
                border border-white/20
                rounded-xl
                text-gray-300
                hover:bg-white/20
                transition-colors duration-200
                font-medium
              "
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            disabled={isLoading}
            className="
              flex-1
              bg-gradient-to-r from-indigo-500 to-purple-500
              hover:from-indigo-600 hover:to-purple-600
              text-white
              py-2.5
              rounded-xl
              font-medium
              shadow-lg shadow-indigo-500/25
              hover:shadow-xl hover:shadow-indigo-500/40
              hover:scale-105
              transition-all duration-200
              disabled:opacity-50 disabled:cursor-not-allowed
            "
          >
            {isLoading ? (isEditing ? 'Updating...' : 'Creating...') : (isEditing ? 'Update Task' : 'Create Task')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TaskForm;