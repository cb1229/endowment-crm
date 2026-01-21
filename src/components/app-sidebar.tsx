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
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-white/5 bg-[#050507]">
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="flex h-16 items-center border-b border-white/5 px-6">
          <Link href="/" className="text-base font-semibold tracking-tight text-white">
            Endowment CRM
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-6">
          {navigation.map((section) => (
            <div key={section.title}>
              <h3 className="mb-2 px-3 text-[11px] font-semibold tracking-wider text-zinc-500 uppercase">
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
                            ? 'bg-indigo-500/10 text-indigo-400'
                            : 'text-zinc-400 hover:bg-white/5 hover:text-white'
                        )}
                      >
                        <item.icon className={cn(
                          'h-4 w-4 flex-shrink-0',
                          isActive ? 'text-indigo-400' : 'text-zinc-500 group-hover:text-zinc-400'
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
        <div className="border-t border-white/5 p-3">
          <Link
            href="/settings"
            className="group flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-zinc-400 transition-colors hover:bg-white/5 hover:text-white"
          >
            <Settings className="h-4 w-4 flex-shrink-0 text-zinc-500 group-hover:text-zinc-400" />
            <span>Settings</span>
          </Link>
        </div>
      </div>
    </aside>
  );
}
