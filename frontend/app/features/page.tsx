// frontend/app/features/page.tsx
// Features page for the Todo Full-Stack Web Application
// Following ModernUIDesign skill with glassmorphism, dark mode, soft edges, and micro-interactions

"use client";

import Link from 'next/link';

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-[#0F0F0F]">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 via-purple-500/10 to-transparent" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-100 mb-6">
              Explore <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Nexa</span>'s Features
            </h1>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
              Discover the powerful features that make our productivity application the perfect task management tool
            </p>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {/* Task Management */}
          <div className="
            bg-white/5
            backdrop-blur-xl
            border border-white/10
            rounded-2xl
            p-8
            transition-all duration-300
            hover:bg-white/10
            hover:border-white/20
            hover:shadow-2xl hover:shadow-indigo-500/10
            group
          ">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <svg className="w-8 h-8 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-100 mb-4">Smart Task Management</h3>
            <p className="text-gray-400 leading-relaxed">
              Create, organize, and prioritize your tasks with advanced features like due dates,
              categories, and smart reminders that adapt to your schedule.
            </p>
          </div>

          {/* Secure & Private */}
          <div className="
            bg-white/5
            backdrop-blur-xl
            border border-white/10
            rounded-2xl
            p-8
            transition-all duration-300
            hover:bg-white/10
            hover:border-white/20
            hover:shadow-2xl hover:shadow-indigo-500/10
            group
          ">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <svg className="w-8 h-8 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-100 mb-4">Secure & Private</h3>
            <p className="text-gray-400 leading-relaxed">
              Your data is encrypted and stored securely with industry-standard security practices.
              We respect your privacy and never share your information.
            </p>
          </div>

          {/* Modern UI */}
          <div className="
            bg-white/5
            backdrop-blur-xl
            border border-white/10
            rounded-2xl
            p-8
            transition-all duration-300
            hover:bg-white/10
            hover:border-white/20
            hover:shadow-2xl hover:shadow-indigo-500/10
            group
          ">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <svg className="w-8 h-8 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"></path>
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-100 mb-4">Modern UI Experience</h3>
            <p className="text-gray-400 leading-relaxed">
              Enjoy a beautiful, responsive interface with dark mode support,
              smooth animations, and intuitive interactions designed for productivity.
            </p>
          </div>

          {/* Lightning Fast */}
          <div className="
            bg-white/5
            backdrop-blur-xl
            border border-white/10
            rounded-2xl
            p-8
            transition-all duration-300
            hover:bg-white/10
            hover:border-white/20
            hover:shadow-2xl hover:shadow-indigo-500/10
            group
          ">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <svg className="w-8 h-8 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-100 mb-4">Lightning Fast</h3>
            <p className="text-gray-400 leading-relaxed">
              Built with performance in mind, our app loads instantly and responds to your actions
              in real-time for maximum productivity.
            </p>
          </div>

          {/* Free Forever */}
          <div className="
            bg-white/5
            backdrop-blur-xl
            border border-white/10
            rounded-2xl
            p-8
            transition-all duration-300
            hover:bg-white/10
            hover:border-white/20
            hover:shadow-2xl hover:shadow-indigo-500/10
            group
          ">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <svg className="w-8 h-8 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-100 mb-4">Free Forever</h3>
            <p className="text-gray-400 leading-relaxed">
              Start for free with all essential features included. No credit card required.
              Premium features available for power users at affordable prices.
            </p>
          </div>

          {/* Cross-Platform Sync */}
          <div className="
            bg-white/5
            backdrop-blur-xl
            border border-white/10
            rounded-2xl
            p-8
            transition-all duration-300
            hover:bg-white/10
            hover:border-white/20
            hover:shadow-2xl hover:shadow-indigo-500/10
            group
          ">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <svg className="w-8 h-8 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"></path>
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-100 mb-4">Cross-Platform Sync</h3>
            <p className="text-gray-400 leading-relaxed">
              Access your tasks from anywhere - desktop, tablet, or mobile.
              All your data stays in sync across all devices automatically.
            </p>
          </div>
        </div>

        {/* Call to Action */}
        <div className="
          bg-gradient-to-r from-indigo-500/10 to-purple-500/10
          backdrop-blur-xl
          border border-white/10
          rounded-3xl
          p-12
          text-center
        ">
          <h3 className="text-3xl font-bold text-gray-100 mb-4">
            Ready to Transform Your Productivity?
          </h3>
          <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
            Join thousands of users who have already revolutionized their task management workflow
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/signup"
              className="
                px-8 py-4
                bg-gradient-to-r from-indigo-500 to-purple-500
                hover:from-indigo-600 hover:to-purple-600
                text-white
                rounded-2xl
                font-semibold
                shadow-xl shadow-indigo-500/25
                hover:shadow-2xl hover:shadow-indigo-500/40
                hover:scale-105
                transform transition-all duration-300
                text-lg
                border border-white/10
              "
            >
              Get Started - It's Free
            </Link>
            <Link
              href="/login"
              className="
                px-8 py-4
                bg-white/10
                backdrop-blur-xl
                border border-white/20
                rounded-2xl
                text-gray-300
                hover:bg-white/20 hover:text-white
                transition-all duration-300
                font-semibold
                text-lg
              "
            >
              Login to Account
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}