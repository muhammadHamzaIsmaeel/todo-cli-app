// frontend/app/UserProviderWrapper.tsx
// Client component wrapper for UserProvider to handle client-side functionality

'use client';

import { UserProvider } from '../contexts/user-context';
import { ReactNode } from 'react';

interface UserProviderWrapperProps {
  children: ReactNode;
}

export default function UserProviderWrapper({ children }: UserProviderWrapperProps) {
  return <UserProvider>{children}</UserProvider>;
}