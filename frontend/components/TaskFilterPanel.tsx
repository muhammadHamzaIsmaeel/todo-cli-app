/**
 * TaskFilterPanel Component
 *
 * A compact component that provides essential filtering options for tasks with:
 * - Status filter (All, Pending, Completed)
 * - Priority filter (High, Medium, Low)
 * - Category filter (dropdown)
 * - Search functionality
 *
 * Features:
 * - Compact design with essential filters only
 * - Icons for better visual recognition
 * - Controlled form inputs with React state
 * - Real-time filtering as user makes selections
 * - Responsive design for all screen sizes
 * - Dark/light mode styling with glassmorphism effects
 * - Keyboard accessibility
 *
 * @component
 * @param {TaskFilterPanelProps} props - Component properties
 * @param {(filters: TaskFilterData) => void} props.onFilterChange - Function called when filter options change
 * @param {Task[]} [props.tasks=[]] - List of tasks to extract categories from
 * @returns {JSX.Element} The rendered TaskFilterPanel component
 */

'use client';

import React, { useState, useEffect } from 'react';
import { Task, TaskFilterData } from '../lib/api';

interface TaskFilterPanelProps {
  onFilterChange: (filters: TaskFilterData) => void;
  tasks?: Task[];
}

const TaskFilterPanel: React.FC<TaskFilterPanelProps> = ({ onFilterChange, tasks = [] }) => {
  const [status, setStatus] = useState<string>('all');
  const [priority, setPriority] = useState<string>('all');
  const [category, setCategory] = useState<string>('all');
  const [search, setSearch] = useState<string>('');
  const [categoryOptions, setCategoryOptions] = useState<string[]>([]);

  // Extract unique categories from tasks
  useEffect(() => {
    if (tasks && Array.isArray(tasks)) {
      const categories = [...new Set(tasks.map(task => task.category).filter(Boolean) as string[])];
      setCategoryOptions(categories);
    }
  }, [tasks]);

  // Notify parent component when filters change
  useEffect(() => {
    const filters: TaskFilterData = {
      status: status !== 'all' ? status : undefined,
      priority: priority !== 'all' ? (priority as 'high' | 'medium' | 'low') : undefined,
      category: category !== 'all' ? category : undefined,
      search: search || undefined,
    };

    onFilterChange(filters);
  }, [status, priority, category, search]);

  const handleClearFilters = () => {
    setStatus('all');
    setPriority('all');
    setCategory('all');
    setSearch('');
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
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-100 flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
          Filters
        </h2>
        <button
          onClick={handleClearFilters}
          className="
            px-4 py-2
            bg-white/10
            backdrop-blur-xl
            border border-white/20
            rounded-xl
            text-gray-300
            hover:bg-white/20
            transition-colors duration-200
            text-sm
            flex items-center gap-1
          "
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Clear
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
        {/* Status Filter */}
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            Status
          </label>
          <select
            id="status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
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
            <option value="all" className="bg-gray-800">All</option>
            <option value="pending" className="bg-gray-800">Pending</option>
            <option value="completed" className="bg-gray-800">Completed</option>
          </select>
        </div>

        {/* Priority Filter */}
        <div>
          <label htmlFor="priority" className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Priority
          </label>
          <select
            id="priority"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
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
            <option value="all" className="bg-gray-800">All</option>
            <option value="high" className="bg-gray-800">High</option>
            <option value="medium" className="bg-gray-800">Medium</option>
            <option value="low" className="bg-gray-800">Low</option>
          </select>
        </div>

        {/* Category Filter */}
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
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
            <option value="all" className="bg-gray-800">All</option>
            {categoryOptions.map((cat, index) => (
              <option key={index} value={cat} className="bg-gray-800">{cat}</option>
            ))}
          </select>
        </div>

        {/* Search Filter */}
        <div>
          <label htmlFor="search" className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            Search
          </label>
          <input
            id="search"
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
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
            placeholder="Search tasks..."
          />
        </div>
      </div>
    </div>
  );
};

export default TaskFilterPanel;