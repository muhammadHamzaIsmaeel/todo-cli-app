/**
 * ErrorBoundary Component
 *
 * A React error boundary component that catches JavaScript errors
 * anywhere in the child component tree and displays a fallback UI.
 * Features modern glassmorphism design to match the application theme.
 *
 * Features:
 * - Catches errors during rendering, in lifecycle methods, and in constructors
 * - Displays a user-friendly error message with option to refresh
 * - Shows error details in a collapsible section
 * - Glassmorphism design that matches the application theme
 * - Responsive layout that works on all screen sizes
 *
 * @component
 * @param {Props} props - Component properties
 * @param {ReactNode} props.children - Child components to be wrapped
 * @param {ReactNode} [props.fallback] - Custom fallback UI
 * @returns {JSX.Element} The rendered ErrorBoundary component
 *
 * @example
 * return (
 *   <ErrorBoundary fallback={<div>Something went wrong</div>}>
 *     <MyComponent />
 *   </ErrorBoundary>
 * )
 */
import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="
          bg-white/5
          backdrop-blur-xl
          border border-white/10
          rounded-2xl
          p-6
          transition-all duration-300
        ">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center">
              <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-100">
              Something went wrong
            </h3>
          </div>
          <p className="text-gray-300 mb-4">
            An error occurred while loading this content. Please try refreshing the page.
          </p>
          {this.state.error && (
            <details className="text-sm text-gray-500 bg-white/5 p-3 rounded-lg backdrop-blur-sm">
              <summary className="cursor-pointer">Error details</summary>
              <p className="mt-2">{this.state.error.message}</p>
            </details>
          )}
          <button
            onClick={() => window.location.reload()}
            className="
              mt-4
              px-4 py-2
              bg-gradient-to-r from-indigo-500 to-purple-500
              hover:from-indigo-600 hover:to-purple-600
              text-white
              rounded-xl
              font-medium
              shadow-lg shadow-indigo-500/25
              hover:shadow-xl hover:shadow-indigo-500/40
              hover:scale-105
              transition-all duration-200
            "
          >
            Refresh Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;