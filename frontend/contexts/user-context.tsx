// frontend/contexts/user-context.tsx
// User context for managing user state across the application

'use client';

import React, { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';
import apiClient from '@/lib/api'; // Use the centralized API client

// Define the user type
interface User {
  id: number;
  email: string;
  name?: string;
}

// Define the context state type
interface UserContextType {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  setUser: (user: User | null) => void;
  clearUser: () => void;
}

// Define action types
type UserAction =
  | { type: 'SET_USER'; payload: User | null }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null };

// Initial state
const initialState: UserContextType = {
  user: null,
  isLoading: true,
  error: null,
  setUser: () => {},
  clearUser: () => {},
};

// Reducer function
const userReducer = (state: UserContextType, action: UserAction): UserContextType => {
  switch (action.type) {
    case 'SET_USER':
      return {
        ...state,
        user: action.payload,
        isLoading: false,
        error: null,
      };
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      };
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
        isLoading: false,
      };
    default:
      return state;
  }
};

// Create context
const UserContext = createContext<UserContextType | undefined>(undefined);

// Provider component
interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(userReducer, initialState);

  // Check session on mount and when localStorage changes
  useEffect(() => {
    const checkSession = async () => {
      try {
        dispatch({ type: 'SET_LOADING', payload: true });

        const token = localStorage.getItem('better-auth-token');
        if (token) {
          const response = await apiClient.get('/api/auth/get-session', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });

          if (response.data && response.data.user) {
            const user: User = {
              id: response.data.user.id,
              email: response.data.user.email,
              name: response.data.user.name,
            };
            dispatch({ type: 'SET_USER', payload: user });
          } else {
            dispatch({ type: 'SET_USER', payload: null });
          }
        } else {
          dispatch({ type: 'SET_USER', payload: null });
        }
      } catch (error) {
        console.error('Session check failed:', error);
        dispatch({ type: 'SET_USER', payload: null });
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };

    checkSession();

    // Listen for storage changes (in case login happens in another tab)
    const handleStorageChange = () => {
      checkSession();
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const setUser = (user: User | null) => {
    dispatch({ type: 'SET_USER', payload: user });
  };

  const clearUser = () => {
    // Remove token from localStorage
    localStorage.removeItem('better-auth-token');
    dispatch({ type: 'SET_USER', payload: null });
  };

  return (
    <UserContext.Provider
      value={{
        user: state.user,
        isLoading: state.isLoading,
        error: state.error,
        setUser,
        clearUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

// Custom hook to use the user context
export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};