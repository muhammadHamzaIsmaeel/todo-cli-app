// frontend/lib/api.ts
// API client for the Todo Full-Stack Web Application
import axios from 'axios';

// Get the API URL from environment variables
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// Create an axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach JWT token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('better-auth-token'); // Better Auth stores token here

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle common errors
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token might be expired, redirect to login
      localStorage.removeItem('better-auth-token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default apiClient;

// Define TypeScript interfaces for the new task fields
export interface Task {
  id: number;
  title: string;
  description?: string;
  completed: boolean;
  user_id: number;
  created_at: string;
  updated_at: string;
  priority?: 'high' | 'medium' | 'low';
  category?: string;
  due_date?: string; // ISO string format
  reminder_date?: string; // ISO string format
}

export interface TaskCreateData {
  title: string;
  description?: string;
  priority?: 'high' | 'medium' | 'low';
  category?: string;
  due_date?: string; // ISO string format
  reminder_date?: string; // ISO string format
}

export interface TaskUpdateData {
  title?: string;
  description?: string;
  priority?: 'high' | 'medium' | 'low';
  category?: string;
  due_date?: string; // ISO string format
  reminder_date?: string; // ISO string format
  completed?: boolean;
}

export interface TaskFilterData {
  status?: string;
  priority?: 'high' | 'medium' | 'low';
  category?: string;
  due_date_start?: string; // ISO string format
  due_date_end?: string; // ISO string format
  search?: string;
}

// Specific API functions
export const todoApi = {
  // Get user's tasks - Use exact endpoint to avoid redirect issues
  getTasks: (status?: 'all' | 'pending' | 'completed', priority?: 'high' | 'medium' | 'low', category?: string) => {
    const params: any = {};
    if (status && status !== 'all') params.status = status;
    if (priority) params.priority = priority;
    if (category) params.category = category;
    return apiClient.get<Task[]>('/api/tasks/', { params }); // Note the trailing slash to avoid redirect
  },

  // Create a new task - Use exact endpoint to avoid redirect issues
  createTask: (taskData: TaskCreateData) => {
    return apiClient.post<Task>('/api/tasks/', taskData); // Note the trailing slash to avoid redirect
  },

  // Update a task - Individual resource endpoint, no trailing slash needed
  updateTask: (id: number, taskData: TaskUpdateData) => {
    return apiClient.put<Task>(`/api/tasks/${id}`, taskData);
  },

  // Toggle task completion status - Special endpoint, no trailing slash needed
  toggleTaskStatus: (id: number) => {
    return apiClient.patch<Task>(`/api/tasks/${id}/toggle-status`);
  },

  // Delete a task - Individual resource endpoint, no trailing slash needed
  deleteTask: (id: number) => {
    return apiClient.delete(`/api/tasks/${id}`);
  },

  // Filter tasks by multiple criteria - Collection endpoint, use trailing slash
  filterTasks: (filterData: TaskFilterData) => {
    return apiClient.post<Task[]>('/api/tasks/filter/', filterData); // Added trailing slash to avoid redirect
  },

  // Get user's unique categories - Collection endpoint, use trailing slash
  getCategories: () => {
    return apiClient.get<string[]>('/api/tasks/categories/');
  },

  // Get priority statistics - Collection endpoint, use trailing slash
  getPriorities: () => {
    return apiClient.get<{ high: number; medium: number; low: number; total: number }>(`/api/tasks/priorities/`);
  },

  // Get tasks for Kanban board view - Collection endpoint, use trailing slash
  getKanbanTasks: () => {
    return apiClient.get<{ todo: Task[]; in_progress: Task[]; done: Task[] }>(`/api/tasks/kanban/`);
  },

  // Get task by ID
  getTaskById: (id: number) => {
    return apiClient.get<Task>(`/api/tasks/${id}`); // Individual resource endpoint
  },

  // Get tasks for calendar view
  getCalendarTasks: (startDate?: string, endDate?: string) => {
    const params: any = {};
    if (startDate) params.start_date = startDate;
    if (endDate) params.end_date = endDate;
    return apiClient.get<Task[]>('/api/tasks/calendar/', { params }); // Added trailing slash to avoid redirect
  },
};

// Auth API functions would be handled by Better Auth directly
// but we can provide a wrapper if needed
export const authApi = {
  // These would typically be handled by Better Auth client
  // but we can add custom auth endpoints if needed
};