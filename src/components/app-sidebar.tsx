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
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-hhmi-blue/20 bg-hhmi-blue text-white">
      <div className="flex h-full flex-col">
        {/* Logo with gradient accent */}
        <div className="flex h-16 items-center border-b border-white/10 px-6 relative">
          {/* Teal-to-Green gradient top border */}
          <div className="absolute top-0 left-0 right-0 h-1 hhmi-gradient"></div>
          <Link href="/" className="text-lg font-semibold tracking-tight text-white">
            Endowment CRM
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-6">
          {navigation.map((section) => (
            <div key={section.title}>
              <h3 className="mb-2 px-3 text-xs font-bold tracking-wider text-white/50">
                {section.title}
              </h3>
              <ul className="space-y-1">
                {section.items.map((item) => {
                  const isActive = pathname === item.href ||
                    (item.href !== '/' && pathname.startsWith(item.href));

                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className={cn(
                          'group flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                          isActive
                            ? 'bg-hhmi-teal/20 text-white border-l-2 border-hhmi-teal'
                            : 'text-white/70 hover:bg-white/5 hover:text-white'
                        )}
                      >
                        <item.icon className={cn(
                          'h-4 w-4 flex-shrink-0',
                          isActive ? 'text-hhmi-teal' : 'text-white/50 group-hover:text-white'
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
        <div className="border-t border-white/10 p-3">
          <Link
            href="/settings"
            className="group flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-white/70 transition-colors hover:bg-white/5 hover:text-white"
          >
            <Settings className="h-4 w-4 flex-shrink-0 text-white/50 group-hover:text-white" />
            <span>Settings</span>
          </Link>
        </div>
      </div>
    </aside>
  );
}
