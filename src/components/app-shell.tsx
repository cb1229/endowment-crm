'use client';

import { ReactNode, useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { AppSidebar } from '@/components/app-sidebar';
import { CommandPalette } from '@/components/command-palette';

interface AppShellProps {
  children: ReactNode;
}

const PUBLIC_ROUTES = ['/login', '/signup'];

export function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const isPublicRoute = PUBLIC_ROUTES.includes(pathname);

  useEffect(() => {
    // Check authentication status
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsAuthenticated(!!session);

      // Redirect to login if not authenticated and trying to access protected route
      if (!session && !isPublicRoute) {
        router.push('/login');
      }
      // Redirect to home if authenticated and on public route
      else if (session && isPublicRoute) {
        router.push('/');
      }
    };

    checkAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session);

      if (!session && !isPublicRoute) {
        router.push('/login');
      } else if (session && isPublicRoute) {
        router.push('/');
      }
    });

    return () => subscription.unsubscribe();
  }, [pathname, isPublicRoute, router, supabase.auth]);

  // Show loading state while checking auth
  if (isAuthenticated === null) {
    return (
      <div className="flex h-screen items-center justify-center bg-hhmi-cultured">
        <div className="text-sm text-hhmi-granite">Loading...</div>
      </div>
    );
  }

  // Public routes (login/signup) don't show sidebar
  if (isPublicRoute) {
    return <>{children}</>;
  }

  // Authenticated routes show full app shell with HHMI theme
  return (
    <div className="flex h-screen overflow-hidden bg-hhmi-cultured">
      <AppSidebar />
      <main className="ml-64 flex-1 overflow-y-auto">
        {children}
      </main>
      <CommandPalette />
    </div>
  );
}
