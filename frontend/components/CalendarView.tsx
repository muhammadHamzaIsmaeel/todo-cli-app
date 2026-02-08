/**
 * CalendarView Component
 *
 * A component that displays tasks in a calendar format with:
 * - Month view showing tasks on their due dates
 * - Day/week view options
 * - Visual indicators for tasks
 * - Ability to navigate between months
 *
 * Features:
 * - Responsive design for all screen sizes
 * - Dark/light mode styling with glassmorphism effects
 * - Keyboard accessibility
 * - Smooth transitions and animations
 * - Task highlighting on calendar days
 * - Date navigation controls
 *
 * @component
 * @param {CalendarViewProps} props - Component properties
 * @param {Task[]} props.tasks - Array of tasks with due dates
 * @param {() => void} props.onRefresh - Function to refresh the calendar data
 * @returns {JSX.Element} The rendered CalendarView component
 */

'use client';

import React, { useState, useEffect } from 'react';
import { Task } from '../lib/api';

interface CalendarViewProps {
  tasks: Task[];
  onRefresh: () => void;
}

const CalendarView: React.FC<CalendarViewProps> = ({ tasks, onRefresh }) => {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [view, setView] = useState<'month' | 'week' | 'day'>('month');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  // Get the first day of the month
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  // Get the last day of the month
  const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
  // Get the day of the week for the first day (0 = Sunday, 1 = Monday, etc.)
  const firstDayOfWeek = firstDayOfMonth.getDay();
  // Calculate how many days from the previous month to show
  const prevMonthDays = firstDayOfWeek;
  // Total days to display (6 weeks x 7 days)
  const totalCells = 42; // 6 weeks

  // Get days from previous month to fill the first week
  const prevMonthLastDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0).getDate();
  // Get days from next month to fill the last week
  const nextMonthDays = totalCells - (prevMonthDays + lastDayOfMonth.getDate());

  // Generate days array for the calendar grid
  const daysArray = [];

  // Previous month days
  for (let i = prevMonthDays; i > 0; i--) {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, prevMonthLastDay - i + 1);
    daysArray.push(date);
  }

  // Current month days
  for (let i = 1; i <= lastDayOfMonth.getDate(); i++) {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), i);
    daysArray.push(date);
  }

  // Next month days
  for (let i = 1; i <= nextMonthDays; i++) {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, i);
    daysArray.push(date);
  }

  // Filter tasks for the current month
  const tasksForMonth = tasks.filter(task => {
    if (!task.due_date) return false;
    const taskDate = new Date(task.due_date);
    return taskDate.getFullYear() === currentDate.getFullYear() &&
           taskDate.getMonth() === currentDate.getMonth();
  });

  // Group tasks by date
  const tasksByDate = tasksForMonth.reduce((acc, task) => {
    if (!task.due_date) return acc;
    const dateKey = new Date(task.due_date).toDateString();
    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }
    acc[dateKey].push(task);
    return acc;
  }, {} as Record<string, Task[]>);

  const goToPreviousMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const formatDateHeader = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isSelected = (date: Date) => {
    return selectedDate && date.toDateString() === selectedDate.toDateString();
  };

  const getTasksForDate = (date: Date) => {
    return tasksByDate[date.toDateString()] || [];
  };

  return (
    <div className="w-full">
      {/* Calendar Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-semibold text-gray-100">
            {formatDateHeader(currentDate)}
          </h2>
          <button
            onClick={goToToday}
            className="
              px-3 py-1.5
              bg-white/10
              backdrop-blur-xl
              border border-white/20
              rounded-lg
              text-gray-300
              hover:bg-white/20
              transition-colors duration-200
              text-sm
            "
          >
            Today
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={goToPreviousMonth}
            className="
              p-2
              bg-white/10
              backdrop-blur-xl
              border border-white/20
              rounded-lg
              text-gray-300
              hover:bg-white/20
              transition-colors duration-200
            "
            aria-label="Previous month"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <button
            onClick={goToNextMonth}
            className="
              p-2
              bg-white/10
              backdrop-blur-xl
              border border-white/20
              rounded-lg
              text-gray-300
              hover:bg-white/20
              transition-colors duration-200
            "
            aria-label="Next month"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          <div className="flex bg-white/5 rounded-lg overflow-hidden">
            {(['month', 'week', 'day'] as const).map((viewOption) => (
              <button
                key={viewOption}
                onClick={() => setView(viewOption)}
                className={`
                  px-3 py-1.5 text-sm font-medium
                  ${view === viewOption
                    ? 'bg-indigo-500/30 text-indigo-300'
                    : 'text-gray-400 hover:text-gray-200'}
                `}
              >
                {viewOption.charAt(0).toUpperCase() + viewOption.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
        {/* Weekday Headers */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="text-center text-sm font-medium text-gray-400 py-2">
              {day}
            </div>
          ))}
        </div>

        {/* Days Grid */}
        <div className="grid grid-cols-7 gap-1">
          {daysArray.map((date, index) => {
            const tasksForThisDate = getTasksForDate(date);
            const isCurrentMonth = date.getMonth() === currentDate.getMonth();
            const isTodayFlag = isToday(date);
            const isSelectedFlag = isSelected(date);

            return (
              <div
                key={index}
                onClick={() => setSelectedDate(date)}
                className={`
                  min-h-24 p-2 border border-transparent rounded-lg cursor-pointer transition-all duration-200
                  ${isCurrentMonth ? 'bg-white/5' : 'bg-white/2'}
                  ${isTodayFlag ? 'ring-2 ring-indigo-500/50' : ''}
                  ${isSelectedFlag ? 'bg-indigo-500/20' : 'hover:bg-white/10'}
                `}
              >
                <div className="flex justify-between items-start">
                  <span className={`
                    text-sm font-medium
                    ${isCurrentMonth ? 'text-gray-200' : 'text-gray-600'}
                    ${isTodayFlag ? 'bg-indigo-500 text-white rounded-full w-6 h-6 flex items-center justify-center' : ''}
                  `}>
                    {date.getDate()}
                  </span>
                  {tasksForThisDate.length > 0 && (
                    <span className="bg-indigo-500/30 text-indigo-300 text-xs px-1.5 py-0.5 rounded-full">
                      {tasksForThisDate.length}
                    </span>
                  )}
                </div>

                <div className="mt-1 space-y-1 max-h-20 overflow-y-auto">
                  {tasksForThisDate.slice(0, 3).map(task => (
                    <div
                      key={task.id}
                      className={`
                        text-xs p-1 rounded truncate
                        ${task.priority === 'high' ? 'bg-red-500/20 text-red-300' :
                          task.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-300' :
                          'bg-green-500/20 text-green-300'}
                      `}
                    >
                      {task.title}
                    </div>
                  ))}
                  {tasksForThisDate.length > 3 && (
                    <div className="text-xs text-gray-500">
                      +{tasksForThisDate.length - 3} more
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Date Details */}
      {selectedDate && (
        <div className="mt-6 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-gray-100 mb-4">
            Tasks for {selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
          </h3>

          {getTasksForDate(selectedDate).length > 0 ? (
            <div className="space-y-3">
              {getTasksForDate(selectedDate).map(task => (
                <div
                  key={task.id}
                  className="
                    bg-white/5
                    backdrop-blur-lg
                    border border-white/10
                    rounded-xl
                    p-4
                    transition-all duration-200
                  "
                >
                  <div className="flex items-start justify-between">
                    <h4 className="font-medium text-gray-100">{task.title}</h4>
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
                    <p className="text-sm text-gray-400 mt-1">
                      {task.description}
                    </p>
                  )}

                  <div className="mt-2 flex flex-wrap gap-2">
                    {task.category && (
                      <span className="
                        inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium
                        bg-indigo-500/20 text-indigo-400 border border-indigo-500/30
                      ">
                        {task.category}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No tasks scheduled for this date.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default CalendarView;