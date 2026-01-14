'use client';

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface FilterTabsProps {
  value: string;
  onValueChange: (value: string) => void;
  options: Array<{ value: string; label: string; count?: number }>;
}

export function FilterTabs({ value, onValueChange, options }: FilterTabsProps) {
  return (
    <Tabs value={value} onValueChange={onValueChange}>
      <TabsList>
        {options.map((option) => (
          <TabsTrigger key={option.value} value={option.value}>
            {option.label}
            {option.count !== undefined && (
              <span className="ml-2 text-xs text-muted-foreground">
                ({option.count})
              </span>
            )}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}
