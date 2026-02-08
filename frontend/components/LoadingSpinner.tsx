/**
 * LoadingSpinner Component
 *
 * A loading spinner component that provides visual feedback during
 * asynchronous operations. Features modern glassmorphism design
 * to match the application theme.
 *
 * Features:
 * - Smooth spinning animation with gradient effect
 * - Glassmorphism design that matches the application theme
 * - Multiple size options for different contexts
 * - Accessible label for screen readers
 * - Consistent styling with other components
 *
 * @component
 * @param {LoadingSpinnerProps} props - Component properties
 * @param {'sm' | 'md' | 'lg'} [props.size='md'] - Size of the spinner
 * @param {string} [props.label='Loading...'] - Accessible label for the spinner
 * @returns {JSX.Element} The rendered LoadingSpinner component
 *
 * @example
 * return (
 *   <LoadingSpinner size="md" label="Loading tasks..." />
 * )
 */
import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  label?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ size = 'md', label = 'Loading...' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  const borderSize = {
    sm: 'border-2',
    md: 'border-4',
    lg: 'border-4'
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <div
        className={`
          ${sizeClasses[size]}
          ${borderSize[size]}
          border-t-indigo-400
          border-r-indigo-500
          border-b-indigo-600
          border-l-indigo-300
          rounded-full
          animate-spin
        `}
      ></div>
      {label && (
        <span className="mt-2 text-sm text-gray-400">{label}</span>
      )}
    </div>
  );
};

export default LoadingSpinner;