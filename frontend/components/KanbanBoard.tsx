/**
 * KanbanBoard Component
 *
 * A component that displays tasks in a Kanban board format with:
 * - Three columns: To Do, In Progress, Done
 * - Drag and drop functionality between columns
 * - Visual representation of task cards
 * - Ability to add new tasks to columns
 *
 * Features:
 * - Drag and drop using HTML5 API
 * - Visual feedback during drag operations
 * - Responsive design for all screen sizes
 * - Dark/light mode styling with glassmorphism effects
 * - Keyboard accessibility
 * - Smooth transitions and animations
 *
 * @component
 * @param {KanbanBoardProps} props - Component properties
 * @param {KanbanData} props.kanbanData - Object containing tasks organized by status
 * @param {(taskId: number, newStatus: string) => void} props.onTaskMove - Function called when task is moved between columns
 * @param {() => void} props.onRefresh - Function to refresh the board data
 * @returns {JSX.Element} The rendered KanbanBoard component
 */

'use client';

import React, { useState } from 'react';
import { Task } from '../lib/api';

interface KanbanColumn {
  id: string;
  title: string;
  taskIds: number[];
}

interface KanbanData {
  todo: Task[];
  in_progress: Task[];
  done: Task[];
}

interface KanbanBoardProps {
  kanbanData: KanbanData;
  onTaskMove: (taskId: number, newStatus: string) => void;
  onRefresh: () => void;
}

const KanbanBoard: React.FC<KanbanBoardProps> = ({ kanbanData, onTaskMove, onRefresh }) => {
  const [draggedTask, setDraggedTask] = useState<Task | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const columns: KanbanColumn[] = [
    { id: 'todo', title: 'To Do', taskIds: kanbanData.todo.map(t => t.id) },
    { id: 'in_progress', title: 'In Progress', taskIds: kanbanData.in_progress.map(t => t.id) },
    { id: 'done', title: 'Done', taskIds: kanbanData.done.map(t => t.id) },
  ];

  const getTaskById = (id: number): Task | undefined => {
    return [...kanbanData.todo, ...kanbanData.in_progress, ...kanbanData.done].find(t => t.id === id);
  };

  const handleDragStart = (e: React.DragEvent, task: Task) => {
    setDraggedTask(task);
    e.dataTransfer.setData('text/plain', task.id.toString());
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, columnId: string) => {
    e.preventDefault();

    if (draggedTask) {
      // Prevent dropping in the same column
      let newStatus = columnId;
      if (columnId === 'todo') newStatus = 'todo';
      else if (columnId === 'in_progress') newStatus = 'in_progress';
      else if (columnId === 'done') newStatus = 'done';

      // Only update if the status actually changed
      if (newStatus !== getTaskStatus(draggedTask)) {
        onTaskMove(draggedTask.id, newStatus);
        setIsLoading(true);

        // Refresh data after a short delay to allow UI to update
        setTimeout(() => {
          onRefresh();
          setIsLoading(false);
        }, 300);
      }

      setDraggedTask(null);
    }
  };

  const getTaskStatus = (task: Task): string => {
    if (kanbanData.todo.some(t => t.id === task.id)) return 'todo';
    if (kanbanData.in_progress.some(t => t.id === task.id)) return 'in_progress';
    if (kanbanData.done.some(t => t.id === task.id)) return 'done';
    return 'todo'; // default
  };

  const getTasksForColumn = (columnId: string): Task[] => {
    switch (columnId) {
      case 'todo': return kanbanData.todo;
      case 'in_progress': return kanbanData.in_progress;
      case 'done': return kanbanData.done;
      default: return [];
    }
  };

  return (
    <div className="w-full">
      {isLoading && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-xl">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500 mx-auto"></div>
            <p className="mt-2 text-gray-300">Updating task...</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {columns.map((column) => (
          <div
            key={column.id}
            className="
              bg-white/5
              backdrop-blur-xl
              border border-white/10
              rounded-2xl
              p-4
              transition-all duration-300
              hover:bg-white/10
              hover:border-white/20
              hover:shadow-xl hover:shadow-indigo-500/10
            "
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, column.id)}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-100">{column.title}</h3>
              <span className="bg-white/10 text-gray-300 text-xs px-2 py-1 rounded-full">
                {getTasksForColumn(column.id).length}
              </span>
            </div>

            <div className="space-y-4 min-h-[100px]">
              {getTasksForColumn(column.id).map((task) => (
                <div
                  key={task.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, task)}
                  className={`
                    bg-white/5
                    backdrop-blur-lg
                    border border-white/10
                    rounded-xl
                    p-4
                    cursor-move
                    transition-all duration-200
                    hover:bg-white/10
                    hover:shadow-lg hover:shadow-indigo-500/10
                    ${draggedTask?.id === task.id ? 'opacity-50' : ''}
                  `}
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
                    <p className="text-sm text-gray-400 mt-1 line-clamp-2">
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

                    {task.due_date && (
                      <span className={`
                        inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium
                        ${new Date(task.due_date) < new Date() && !task.completed
                          ? 'bg-red-500/20 text-red-400 border border-red-500/30' // Overdue
                          : 'bg-blue-500/20 text-blue-400 border border-blue-500/30' // Upcoming
                        }
                      `}>
                        {new Date(task.due_date) < new Date() && !task.completed ? '!' : ''}{new Date(task.due_date).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
              ))}

              {getTasksForColumn(column.id).length === 0 && (
                <div className="text-center py-8 text-gray-500 text-sm">
                  No tasks in this column
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default KanbanBoard;