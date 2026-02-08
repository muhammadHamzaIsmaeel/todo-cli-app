/**
 * ViewSwitcher Component
 *
 * A component that allows users to switch between different task views:
 * - List view (default)
 * - Kanban board view
 * - Calendar view
 *
 * Features:
 * - Visual indication of current view
 * - Responsive design for all screen sizes
 * - Dark/light mode styling with glassmorphism effects
 * - Keyboard accessibility
 * - Smooth transitions between views
 *
 * @component
 * @param {ViewSwitcherProps} props - Component properties
 * @param {string} props.currentView - The currently selected view ('list', 'kanban', 'calendar')
 * @param {(view: string) => void} props.onViewChange - Function called when view is changed
 * @returns {JSX.Element} The rendered ViewSwitcher component
 */

'use client';

import React from 'react';

interface ViewSwitcherProps {
  currentView: 'list' | 'kanban' | 'calendar';
  onViewChange: (view: 'list' | 'kanban' | 'calendar') => void;
}

const ViewSwitcher: React.FC<ViewSwitcherProps> = ({ currentView, onViewChange }) => {
  const views = [
    { id: 'list', label: 'List', icon: '📋' },
    { id: 'kanban', label: 'Kanban', icon: '📊' },
    { id: 'calendar', label: 'Calendar', icon: '📅' },
  ];

  return (
    <div className="
      bg-white/5
      backdrop-blur-xl
      border border-white/10
      rounded-2xl
      p-2
      flex
      items-center
      transition-all duration-300
      hover:bg-white/10
      hover:border-white/20
      hover:shadow-xl hover:shadow-indigo-500/10
    ">
      {views.map((view) => (
        <button
          key={view.id}
          onClick={() => onViewChange(view.id as 'list' | 'kanban' | 'calendar')}
          className={`
            flex-1
            flex
            items-center
            justify-center
            gap-2
            px-4 py-3
            rounded-xl
            text-sm
            font-medium
            transition-all duration-200
            ${
              currentView === view.id
                ? 'bg-indigo-500/30 text-indigo-300 shadow-inner'
                : 'text-gray-400 hover:text-gray-200 hover:bg-white/10'
            }
          `}
          aria-label={`Switch to ${view.label} view`}
        >
          <span>{view.icon}</span>
          <span>{view.label}</span>
        </button>
      ))}
    </div>
  );
};

export default ViewSwitcher;