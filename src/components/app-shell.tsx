'use client';

import { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { AppSidebar } from '@/components/app-sidebar';
import { CommandPalette } from '@/components/command-palette';

interface AppShellProps {
  children: ReactNode;
}

const PUBLIC_ROUTES = ['/login', '/signup'];

export function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();
  const isPublicRoute = PUBLIC_ROUTES.includes(pathname);

  // Public routes (login/signup) don't show sidebar
  if (isPublicRoute) {
    return <>{children}</>;
  }

  // Authenticated routes show full app shell
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
