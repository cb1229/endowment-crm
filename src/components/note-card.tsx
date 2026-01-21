'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Building2, TrendingUp, Building } from 'lucide-react';
import { formatDistanceToNow } from '@/lib/date-utils';

interface NoteCardProps {
  note: {
    id: string;
    title: string;
    content: string;
    authorId?: string | null;
    authorName: string;
    authorAvatarUrl?: string | null;
    originalAuthorName?: string;
    createdAt: Date | string;
  };
  entities?: {
    firms?: Array<{ id: string; name: string; marketType: string }>;
    funds?: Array<{ id: string; name: string; marketType: string }>;
    companies?: Array<{ id: string; name: string }>;
  };
  onClick?: () => void;
}

// Helper function to get initials from a name or email
function getInitials(name: string): string {
  if (!name) return '?';

  // If it's an email, use the first letter of the part before @
  if (name.includes('@')) {
    return name.charAt(0).toUpperCase();
  }

  // Otherwise, get initials from name
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) {
    return parts[0].substring(0, 2).toUpperCase();
  }
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

export function NoteCard({ note, entities, onClick }: NoteCardProps) {
  const createdAt = typeof note.createdAt === 'string'
    ? new Date(note.createdAt)
    : note.createdAt;

  return (
    <Card className="card-hover cursor-pointer" onClick={onClick}>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="mb-2 tracking-tight">
              {note.title}
            </CardTitle>
            {/* Author Info with Avatar */}
            <div className="flex items-center gap-2 mb-1">
              <Avatar className="h-6 w-6">
                {note.authorAvatarUrl && <AvatarImage src={note.authorAvatarUrl} alt={note.authorName} />}
                <AvatarFallback className="text-xs bg-primary/10 text-primary">
                  {getInitials(note.authorName)}
                </AvatarFallback>
              </Avatar>
              <div className="flex items-center gap-1.5 text-xs">
                <span className="font-medium text-foreground">
                  {note.authorName}
                </span>
                <span className="text-muted-foreground">·</span>
                <span className="text-muted-foreground">
                  {formatDistanceToNow(createdAt)}
                </span>
              </div>
            </div>
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
