'use client';

import { ReactNode } from 'react';
import { Breadcrumb, BreadcrumbItem } from '@/components/breadcrumb';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';

interface PageHeaderProps {
  breadcrumbs?: BreadcrumbItem[];
  title?: string;
  description?: string;
  actions?: ReactNode;
  onSearchClick?: () => void;
}

export function PageHeader({
  breadcrumbs,
  title,
  description,
  actions,
  onSearchClick,
}: PageHeaderProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-border bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="flex h-16 items-center justify-between px-6">
        <div className="flex items-center gap-4">
          {onSearchClick && (
            <Button
              variant="outline"
              size="icon"
              onClick={onSearchClick}
              className="h-9 w-9"
            >
              <Search className="h-4 w-4" />
            </Button>
          )}
          {breadcrumbs && <Breadcrumb items={breadcrumbs} />}
        </div>
        {actions && <div className="flex items-center gap-3">{actions}</div>}
      </div>
      {(title || description) && (
        <div className="border-t border-border px-6 py-4">
          {title && (
            <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
          )}
          {description && (
            <p className="mt-1 text-sm text-muted-foreground">{description}</p>
          )}
        </div>
      )}
    </header>
  );
}
