// frontend/components/Navigation.tsx
// Navigation component for the Todo Full-Stack Web Application
// Following ModernUIDesign skill with glassmorphism, dark mode, soft edges, and micro-interactions

'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useUser } from '@/contexts/user-context';

const Navigation: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const { user, isLoading, setUser } = useUser();

  // Helper function to get user initials
  const getUserInitials = (name: string) => {
    if (!name) return '';
    const nameParts = name.trim().split(/\s+/);
    if (nameParts.length === 1) {
      return nameParts[0].charAt(0).toUpperCase();
    } else {
      return (nameParts[0].charAt(0) + nameParts[1].charAt(0)).toUpperCase();
    }
  };

  const isActive = (path: string) => pathname === path;

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleUserMenu = () => setIsUserMenuOpen(!isUserMenuOpen);

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    // Clear authentication data
    localStorage.removeItem('better-auth-token');
    setUser(null);
    setIsUserMenuOpen(false);
  };

  if (isLoading) {
    return (
      <nav className="
        bg-white/5
        backdrop-blur-xl
        border-b border-white/10
        sticky top-0 z-50
      ">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex items-center">
                <div className="h-8 w-8 mr-2 rounded-md bg-gray-700"></div>
                <span className="text-xl font-bold text-indigo-400 hidden sm:block">
                  Nexa
                </span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="animate-pulse flex space-x-4">
                <div className="rounded-md bg-gray-700 h-10 w-20"></div>
                <div className="rounded-md bg-gray-700 h-10 w-20"></div>
              </div>
            </div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="
      bg-white/5
      backdrop-blur-xl
      border-b border-white/10
      sticky top-0 z-50
    ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link
              href="/"
              className="
                flex items-center
                hover:opacity-80
                transition-opacity duration-200
              "
            >
              <img
                src="/logo.png"
                alt="Nexa Logo"
                className="h-8 w-8 mr-2"
                width={32}
                height={32}
              />
              <span className="
                text-xl font-bold text-indigo-400
                hidden sm:block
              ">
                Nexa
              </span>
            </Link>
          </div>

          <div className="flex items-center gap-4">

            {user ? (
              <div className="hidden md:flex items-center gap-4">
                <Link
                  href="/dashboard"
                  className={`
                    px-4 py-2
                    rounded-xl
                    font-medium
                    transition-all duration-200
                    ${isActive('/dashboard')
                      ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg shadow-indigo-500/25'
                      : 'bg-white/10 backdrop-blur-xl border border-white/20 text-gray-300 hover:bg-white/20 hover:text-white'
                    }
                  `}
                >
                  Dashboard
                </Link>

                <Link
                  href="/chat"
                  className={`
                    px-4 py-2
                    rounded-xl
                    font-medium
                    transition-all duration-200
                    ${isActive('/chat')
                      ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg shadow-indigo-500/25'
                      : 'bg-white/10 backdrop-blur-xl border border-white/20 text-gray-300 hover:bg-white/20 hover:text-white'
                    }
                  `}
                >
                  Chat
                </Link>

                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={toggleUserMenu}
                    className="
                      flex items-center gap-2
                      px-3 py-2
                      rounded-xl
                      bg-white/10 backdrop-blur-xl border border-white/20
                      text-gray-300 hover:bg-white/20 hover:text-white
                      transition-all duration-200
                    "
                  >
                    <span className="text-sm hidden sm:block">
                      {user.name || user.email.split('@')[0]}
                    </span>
                    <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center text-sm">
                      {user.name ? getUserInitials(user.name) : user.email.charAt(0).toUpperCase()}
                    </div>
                  </button>

                  {isUserMenuOpen && (
                    <div className="
                      absolute right-0 sm:right-0 left-0 sm:left-auto mt-2 w-full sm:w-48
                      bg-white/10 backdrop-blur-xl
                      border border-white/20
                      rounded-xl
                      shadow-lg
                      z-50
                      overflow-hidden
                    ">
                      <div className="py-2">
                        <div className="px-4 py-2 border-b border-white/10">
                          <p className="text-sm font-medium text-gray-200">{user.name || user.email}</p>
                          <p className="text-xs text-gray-400">{user.email}</p>
                        </div>
                        <button
                          onClick={handleLogout}
                          className="
                            w-full text-left px-4 py-2
                            text-gray-300 hover:bg-white/10 hover:text-white
                            transition-colors duration-200
                            text-sm
                          "
                        >
                          Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="hidden md:flex gap-3">
                <Link
                  href="/login"
                  className={`
                    px-4 py-2
                    rounded-xl
                    font-medium
                    transition-all duration-200
                    ${isActive('/login')
                      ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg shadow-indigo-500/25'
                      : 'bg-white/10 backdrop-blur-xl border border-white/20 text-gray-300 hover:bg-white/20 hover:text-white'
                    }
                  `}
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  className={`
                    px-4 py-2
                    rounded-xl
                    font-medium
                    transition-all duration-200
                    ${isActive('/signup')
                      ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg shadow-indigo-500/25'
                      : 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:from-indigo-600 hover:to-purple-600 shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:shadow-indigo-500/40 hover:scale-105'
                    }
                  `}
                >
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <button
                type="button"
                className="
                  inline-flex items-center justify-center p-2 rounded-lg
                  text-gray-300 hover:text-indigo-400 hover:bg-white/10
                  transition-colors duration-200
                "
                onClick={toggleMenu}
              >
                <span className="sr-only">Open main menu</span>
                <svg
                  className={`${isMenuOpen ? 'hidden' : 'block'} h-6 w-6`}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
                <svg
                  className={`${isMenuOpen ? 'block' : 'hidden'} h-6 w-6`}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`${isMenuOpen ? 'block' : 'hidden'} md:hidden`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          {user ? (
            <>
              <Link
                href="/dashboard"
                className={`
                  block px-3 py-2 rounded-xl text-base font-medium
                  transition-all duration-200
                  ${isActive('/dashboard')
                    ? 'text-indigo-400 bg-white/10'
                    : 'text-gray-300 hover:text-indigo-400 hover:bg-white/10'
                  }
                `}
                onClick={() => setIsMenuOpen(false)}
              >
                Dashboard
              </Link>
              <Link
                href="/chat"
                className={`
                  block px-3 py-2 rounded-xl text-base font-medium
                  transition-all duration-200
                  ${isActive('/chat')
                    ? 'text-indigo-400 bg-white/10'
                    : 'text-gray-300 hover:text-indigo-400 hover:bg-white/10'
                  }
                `}
                onClick={() => setIsMenuOpen(false)}
              >
                Chat
              </Link>
              <div className="block px-3 py-2 text-sm text-gray-300 border-b border-white/10">
                <p className="font-medium">{user.name || user.email.split('@')[0]}</p>
                <p className="text-xs text-gray-400">{user.email}</p>
              </div>
              <button
                onClick={() => {
                  handleLogout();
                  setIsMenuOpen(false);
                }}
                className="
                  block w-full text-left px-3 py-2 rounded-xl text-base font-medium
                  text-gray-300 hover:text-red-400 hover:bg-red-500/10
                  transition-all duration-200
                "
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className={`
                  block px-3 py-2 rounded-xl text-base font-medium
                  transition-all duration-200
                  ${isActive('/login')
                    ? 'text-indigo-400 bg-white/10'
                    : 'text-gray-300 hover:text-indigo-400 hover:bg-white/10'
                  }
                `}
                onClick={() => setIsMenuOpen(false)}
              >
                Login
              </Link>
              <Link
                href="/signup"
                className={`
                  block px-3 py-2 rounded-xl text-base font-medium
                  transition-all duration-200
                  ${isActive('/signup')
                    ? 'text-indigo-400 bg-white/10'
                    : 'text-gray-300 hover:text-indigo-400 hover:bg-white/10'
                  }
                `}
                onClick={() => setIsMenuOpen(false)}
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;