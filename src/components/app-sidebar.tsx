'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Building2,
  TrendingUp,
  Building,
  Briefcase,
  FileText,
  Settings,
  Home
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

const navigation: NavSection[] = [
  {
    title: 'INTELLIGENCE',
    items: [
      { title: 'Home', href: '/', icon: Home },
      { title: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    ],
  },
  {
    title: 'PIPELINE',
    items: [
      { title: 'Pipeline', href: '/pipeline', icon: Briefcase },
    ],
  },
  {
    title: 'ENTITIES',
    items: [
      { title: 'Firms', href: '/firms', icon: Building2 },
      { title: 'Funds', href: '/funds', icon: TrendingUp },
      { title: 'Companies', href: '/companies', icon: Building },
    ],
  },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-zinc-200 bg-white">
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="flex h-12 items-center border-b border-zinc-200 px-4">
          <Link href="/" className="text-sm font-semibold tracking-tight text-foreground">
            Endowment CRM
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-4 overflow-y-auto px-2 py-4">
          {navigation.map((section) => (
            <div key={section.title}>
              <h3 className="mb-1.5 px-2 text-[10px] font-semibold tracking-wider text-zinc-500 uppercase">
                {section.title}
              </h3>
              <ul className="space-y-0.5">
                {section.items.map((item) => {
                  const isActive = pathname === item.href ||
                    (item.href !== '/' && pathname.startsWith(item.href));

                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className={cn(
                          'group flex items-center gap-2 rounded-md px-2 py-1.5 text-sm font-medium transition-colors relative',
                          isActive
                            ? 'bg-indigo-50 text-indigo-700 before:absolute before:left-0 before:top-0 before:bottom-0 before:w-0.5 before:bg-indigo-700'
                            : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900'
                        )}
                      >
                        <item.icon className={cn(
                          'h-4 w-4 flex-shrink-0',
                          isActive ? 'text-indigo-700' : 'text-zinc-400 group-hover:text-zinc-600'
                        )} />
                        <span>{item.title}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        {/* Settings at bottom */}
        <div className="border-t border-zinc-200 p-2">
          <Link
            href="/settings"
            className="group flex items-center gap-2 rounded-md px-2 py-1.5 text-sm font-medium text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-900"
          >
            <Settings className="h-4 w-4 flex-shrink-0 text-zinc-400 group-hover:text-zinc-600" />
            <span>Settings</span>
          </Link>
        </div>
      </div>
    </aside>
  );
}
