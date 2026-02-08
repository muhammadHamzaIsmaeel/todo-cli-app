// frontend/app/layout.tsx
// Root layout for the Todo Full-Stack Web Application
// Following ModernUIDesign skill with glassmorphism, dark mode, soft edges, and micro-interactions

import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import UserProviderWrapper from './UserProviderWrapper';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Nexa - Manage Your Tasks',
  description: 'A modern full-stack task management application with authentication and productivity tools',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <UserProviderWrapper>
          <div className="min-h-screen bg-[#0F0F0F] flex flex-col">
            <Navigation />
            <main className="flex-grow">
              {children}
            </main>
            <Footer />
          </div>
        </UserProviderWrapper>
      </body>
    </html>
  );
}