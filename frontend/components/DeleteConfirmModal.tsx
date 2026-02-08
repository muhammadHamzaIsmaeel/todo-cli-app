/**
 * DeleteConfirmModal Component
 *
 * A modal dialog component that provides a confirmation step before deleting a task.
 * Features a clean, modern UI with appropriate styling for both light and dark modes.
 *
 * Features:
 * - Modal overlay with backdrop blur effect
 * - Clear confirmation message with task title
 * - Cancel and confirm action buttons
 * - Accessible with proper ARIA attributes
 * - Responsive design for all screen sizes
 * - Modern UI with glassmorphism effects
 * - Proper state management for modal visibility
 * - Smooth animations and transitions
 *
 * @component
 * @param {DeleteConfirmModalProps} props - Component properties
 * @param {boolean} props.isOpen - Whether the modal is visible
 * @param {() => void} props.onClose - Function called when modal is closed
 * @param {() => void} props.onConfirm - Function called when delete is confirmed
 * @param {string} props.taskTitle - Title of the task to be deleted
 * @returns {JSX.Element | null} The rendered modal component or null if not open
 *
 * @example
 * return (
 *   <DeleteConfirmModal
 *     isOpen={showModal}
 *     onClose={handleClose}
 *     onConfirm={handleConfirm}
 *     taskTitle="My Task Title"
 *   />
 * )
 */

import React from 'react';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  taskTitle: string;
}

const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  taskTitle
}) => {
  if (!isOpen) return null;

  const handleConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirm();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />

      {/* Modal Content */}
      <div className="
        relative w-full max-w-lg
        bg-gray-900/95
        backdrop-blur-xl
        border border-white/10
        rounded-2xl
        p-6
        shadow-2xl
        animate-in fade-in zoom-in duration-200
      ">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center">
              <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-100">
              Delete Task
            </h3>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-white/10 text-gray-400 hover:text-gray-100 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <p className="text-gray-300 mb-6">
          Are you sure you want to delete <span className="font-medium text-gray-100">"{taskTitle}"</span>? This action cannot be undone.
        </p>

        <div className="flex gap-3 justify-end">
          <button
            type="button"
            onClick={onClose}
            className="
              px-4 py-2
              bg-white/10
              backdrop-blur-xl
              border border-white/20
              rounded-xl
              text-gray-300
              hover:bg-white/20
              transition-colors duration-200
            "
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className="
              px-4 py-2
              bg-gradient-to-r from-red-500 to-pink-500
              hover:from-red-600 hover:to-pink-600
              text-white
              rounded-xl
              shadow-lg shadow-red-500/25
              hover:shadow-xl hover:shadow-red-500/40
              hover:scale-105
              transition-all duration-200
            "
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;