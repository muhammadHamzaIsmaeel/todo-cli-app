// frontend/app/dashboard/layout.tsx
// Dashboard layout for the Todo Full-Stack Web Application
import React from 'react';

const DashboardLayout = async ({ children }: { children: React.ReactNode }) => {
  // For server components, we need to handle authentication differently
  // In a real implementation, we would check for session on the server
  // For now, we'll handle it on the client side in a parent component or via middleware

  return (
    <div className="min-h-screen bg-[#0F0F0F]">
      <main className="container mx-auto px-4 py-8 max-w-6xl">
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;