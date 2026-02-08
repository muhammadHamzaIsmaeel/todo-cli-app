/**
 * TaskSkeleton Component
 *
 * A skeleton loader component for tasks that provides visual feedback
 * while content is loading. Features glassmorphism design to match
 * the overall application theme.
 *
 * Features:
 * - Animated loading effect with smooth transitions
 * - Glassmorphism design that matches the application theme
 * - Responsive layout that works on all screen sizes
 * - Consistent styling with other components
 *
 * @component
 * @returns {JSX.Element} The rendered TaskSkeleton component
 *
 * @example
 * return (
 *   <TaskSkeleton />
 * )
 */
import React from 'react';

const TaskSkeleton: React.FC = () => {
  return (
    <div className="
      bg-white/5
      backdrop-blur-xl
      border border-white/10
      rounded-2xl
      p-6
      animate-pulse
    ">
      <div className="flex items-start gap-4">
        <div className="w-6 h-6 rounded-lg bg-white/10 flex-shrink-0"></div>

        <div className="flex-1 min-w-0">
          <div className="h-5 bg-white/10 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-white/10 rounded w-1/2 mb-2"></div>

          <div className="flex items-center gap-4 mt-2 text-xs">
            <div className="h-3 bg-white/10 rounded w-24"></div>
            <div className="h-3 bg-white/10 rounded w-20"></div>
          </div>
        </div>

        <div className="flex gap-2 flex-shrink-0">
          <div className="w-6 h-6 rounded-lg bg-white/10"></div>
          <div className="w-6 h-6 rounded-lg bg-white/10"></div>
        </div>
      </div>
    </div>
  );
};

export default TaskSkeleton;