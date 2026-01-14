'use client';

import { ReactNode } from 'react';
import { AppSidebar } from '@/components/app-sidebar';
import { CommandPalette } from '@/components/command-palette';

interface AppShellProps {
  children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <AppSidebar />
      <main className="ml-64 flex-1 overflow-y-auto">
        {children}
      </main>
      <CommandPalette />
    </div>
  );
}
