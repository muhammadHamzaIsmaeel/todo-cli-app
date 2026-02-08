// frontend/app/signup/page.tsx
// Signup page for the Todo Full-Stack Web Application
// Following ModernUIDesign skill with glassmorphism, dark mode, soft edges, and micro-interactions

'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useUser } from '@/contexts/user-context';
import apiClient from '@/lib/api'; // Use the centralized API client

// Define the user type
interface User {
  id: number;
  email: string;
  name?: string;
}

const SignupPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const { setUser } = useUser();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await apiClient.post('/api/auth/use-register', {
        email,
        password,
        name,
      });

      if (response.data) {
        // Store the token in localStorage (Better Auth compatible format)
        if (response.data.session?.access_token) {
          localStorage.setItem('better-auth-token', response.data.session.access_token);
          // Trigger storage event to notify other tabs/components
          window.dispatchEvent(new StorageEvent('storage', {
            key: 'better-auth-token',
            newValue: response.data.session.access_token
          }));
        }

        // Update user context with user data
        if (response.data.session?.user) {
          const userData: User = {
            id: response.data.session.user.id,
            email: response.data.session.user.email,
            name: response.data.session.user.name,
          };
          setUser(userData);
        }

        // Registration successful, redirect to dashboard
        router.push('/dashboard');
      }
    } catch (err: any) {
      console.error('Registration error:', err);
      if (err.response?.data?.detail) {
        setError(err.response.data.detail);
      } else {
        setError('Registration failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0F0F0F] flex items-center justify-center p-4">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 via-purple-500/10 to-transparent" />

      <div className="
        relative
        w-full max-w-md
        bg-white/5
        backdrop-blur-xl
        border border-white/10
        rounded-2xl
        p-8
        transition-all duration-300
        hover:bg-white/10
        hover:border-white/20
        hover:shadow-xl hover:shadow-indigo-500/10
      ">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-100 mb-2">Create Your Nexa Account</h1>
          <p className="text-gray-400">Join our productivity platform today</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/20 text-red-400 rounded-xl border border-red-500/30 backdrop-blur-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
              Full Name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="
                w-full px-4 py-3
                bg-white/5
                backdrop-blur-xl
                border border-white/10
                rounded-xl
                text-gray-100
                placeholder:text-gray-500
                focus:outline-none
                focus:ring-2
                focus:ring-indigo-500
                focus:border-transparent
                transition-all duration-200
              "
              placeholder="John Doe"
              required
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="
                w-full px-4 py-3
                bg-white/5
                backdrop-blur-xl
                border border-white/10
                rounded-xl
                text-gray-100
                placeholder:text-gray-500
                focus:outline-none
                focus:ring-2
                focus:ring-indigo-500
                focus:border-transparent
                transition-all duration-200
              "
              placeholder="you@example.com"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="
                w-full px-4 py-3
                bg-white/5
                backdrop-blur-xl
                border border-white/10
                rounded-xl
                text-gray-100
                placeholder:text-gray-500
                focus:outline-none
                focus:ring-2
                focus:ring-indigo-500
                focus:border-transparent
                transition-all duration-200
              "
              placeholder="••••••••"
              required
              minLength={6}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="
              w-full
              bg-gradient-to-r from-indigo-500 to-purple-500
              hover:from-indigo-600 hover:to-purple-600
              text-white
              py-3
              rounded-xl
              font-medium
              shadow-lg shadow-indigo-500/25
              hover:shadow-xl hover:shadow-indigo-500/40
              hover:scale-105
              transition-all duration-200
              disabled:opacity-50
              focus:outline-none focus:ring-2 focus:ring-indigo-500/50
            "
          >
            {isLoading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-400">
            Already have an account?{' '}
            <Link
              href="/login"
              className="
                text-indigo-400
                hover:text-indigo-300
                font-medium
                transition-colors duration-200
              "
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;