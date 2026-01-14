'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Building2, TrendingUp, Building } from 'lucide-react';
import { formatDistanceToNow } from '@/lib/date-utils';

interface NoteCardProps {
  note: {
    id: string;
    title: string;
    content: string;
    authorName: string;
    createdAt: Date | string;
  };
  entities?: {
    firms?: Array<{ id: string; name: string; marketType: string }>;
    funds?: Array<{ id: string; name: string; marketType: string }>;
    companies?: Array<{ id: string; name: string }>;
  };
}

export function NoteCard({ note, entities }: NoteCardProps) {
  const createdAt = typeof note.createdAt === 'string'
    ? new Date(note.createdAt)
    : note.createdAt;

  return (
    <Card className="hover:bg-muted/50 transition-colors cursor-pointer">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="mb-1">
              {note.title}
            </CardTitle>
            <CardDescription className="text-xs font-normal text-muted-foreground">
              {note.authorName} · {formatDistanceToNow(createdAt)}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
          {note.content}
        </p>

        {entities && (
          <div className="flex flex-wrap gap-1.5">
            {entities.firms?.map((firm) => (
              <Badge key={firm.id} variant="outline" className="text-xs rounded-full badge-blue">
                <Building2 className="w-3 h-3 mr-1" />
                {firm.name}
              </Badge>
            ))}
            {entities.funds?.map((fund) => (
              <Badge key={fund.id} variant="outline" className="text-xs rounded-full badge-purple">
                <TrendingUp className="w-3 h-3 mr-1" />
                {fund.name}
              </Badge>
            ))}
            {entities.companies?.map((company) => (
              <Badge key={company.id} variant="outline" className="text-xs rounded-full badge-green">
                <Building className="w-3 h-3 mr-1" />
                {company.name}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
