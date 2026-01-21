'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { User, Bell, Shield, CreditCard } from 'lucide-react';
import { cn } from '@/lib/utils';

const settingsNavItems = [
  {
    title: 'Profile',
    href: '/settings/profile',
    icon: User,
    description: 'Manage your personal information',
  },
  {
    title: 'Notifications',
    href: '/settings/notifications',
    icon: Bell,
    description: 'Configure notification preferences',
    disabled: true,
  },
  {
    title: 'Security',
    href: '/settings/security',
    icon: Shield,
    description: 'Manage password and authentication',
    disabled: true,
  },
  {
    title: 'Billing',
    href: '/settings/billing',
    icon: CreditCard,
    description: 'Subscription and billing information',
    disabled: true,
  },
];

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen">
      {/* Settings Sidebar */}
      <aside className="w-64 border-r bg-muted/10 p-6">
        <div className="mb-6">
          <h2 className="text-lg font-semibold tracking-tight">Settings</h2>
          <p className="text-sm text-muted-foreground">
            Manage your account settings
          </p>
        </div>

        <nav className="space-y-1">
          {settingsNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.disabled ? '#' : item.href}
                className={cn(
                  'flex items-start gap-3 rounded-lg px-3 py-2 text-sm transition-colors',
                  isActive
                    ? 'bg-primary/10 text-primary font-medium'
                    : item.disabled
                    ? 'text-muted-foreground/50 cursor-not-allowed'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                )}
                onClick={(e) => item.disabled && e.preventDefault()}
              >
                <Icon className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="font-medium">{item.title}</div>
                  <div className="text-xs text-muted-foreground line-clamp-1">
                    {item.description}
                  </div>
                </div>
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
