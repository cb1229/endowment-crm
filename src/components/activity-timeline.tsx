'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileText, Briefcase } from 'lucide-react';

interface TimelineItem {
  id: string;
  type: 'note' | 'deal';
  title: string;
  date: string;
  author?: string;
}

interface ActivityTimelineProps {
  items: TimelineItem[];
}

export function ActivityTimeline({ items }: ActivityTimelineProps) {
  const sortedItems = [...items].sort((a, b) =>
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div className="space-y-4">
      {sortedItems.map((item, index) => (
        <div key={item.id} className="flex gap-4">
          <div className="flex flex-col items-center">
            <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 bg-background">
              {item.type === 'note' ? (
                <FileText className="h-4 w-4 text-primary" />
              ) : (
                <Briefcase className="h-4 w-4 text-primary" />
              )}
            </div>
            {index < sortedItems.length - 1 && (
              <div className="w-px flex-1 bg-border mt-2" style={{ minHeight: '40px' }} />
            )}
          </div>
          <Card className="flex-1 card-hover">
            <CardContent className="pt-4">
              <div className="flex items-start justify-between mb-2">
                <h4 className="text-sm font-medium tracking-tight">{item.title}</h4>
                <Badge variant="outline" className="text-xs badge-accent">
                  {item.type}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                {item.author && `${item.author} • `}
                {new Date(item.date).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric'
                })}
              </p>
            </CardContent>
          </Card>
        </div>
      ))}
      {sortedItems.length === 0 && (
        <p className="text-sm text-muted-foreground text-center py-8">
          No activity yet
        </p>
      )}
    </div>
  );
}
