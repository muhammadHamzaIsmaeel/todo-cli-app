// frontend/lib/better-auth-integration.ts
// Proper Better Auth integration following the actual API

import { createAuthClient } from 'better-auth/react';

// Initialize Better Auth client
// This should be done once and reused across the app
const betterAuthClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL || 'http://localhost:8000',
  fetchOptions: {
    // Add any additional fetch options here
  },
});

// Export the hooks from the client
export const useSession = betterAuthClient.useSession;

// Export the client in case it's needed elsewhere
export default betterAuthClient;