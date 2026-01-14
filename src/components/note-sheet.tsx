'use client';

import { useState, useEffect } from 'react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Loader2, X, Search } from 'lucide-react';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

interface NoteSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

interface EntityTag {
  entityType: string;
  entityId: string;
  entityName: string;
}

interface Entity {
  id: string;
  name: string;
  type: 'firm' | 'fund' | 'company';
}

export function NoteSheet({ open, onOpenChange, onSuccess }: NoteSheetProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    authorName: 'Team Member',
  });
  const [entityTags, setEntityTags] = useState<EntityTag[]>([]);
  const [entities, setEntities] = useState<Entity[]>([]);
  const [popoverOpen, setPopoverOpen] = useState(false);

  useEffect(() => {
    async function fetchEntities() {
      try {
        const [firmsRes, fundsRes, companiesRes] = await Promise.all([
          fetch('/api/firms'),
          fetch('/api/funds'),
          fetch('/api/companies'),
        ]);

        const [firms, funds, companies] = await Promise.all([
          firmsRes.json(),
          fundsRes.json(),
          companiesRes.json(),
        ]);

        const allEntities: Entity[] = [
          ...firms.map((f: any) => ({ id: f.id, name: f.name, type: 'firm' as const })),
          ...funds.map((f: any) => ({ id: f.id, name: f.name, type: 'fund' as const })),
          ...companies.map((c: any) => ({ id: c.id, name: c.name, type: 'company' as const })),
        ];

        setEntities(allEntities);
      } catch (error) {
        console.error('Error fetching entities:', error);
      }
    }

    if (open) {
      fetchEntities();
    }
  }, [open]);

  const addEntityTag = (entity: Entity) => {
    if (!entityTags.find((tag) => tag.entityId === entity.id)) {
      setEntityTags([
        ...entityTags,
        {
          entityType: entity.type,
          entityId: entity.id,
          entityName: entity.name,
        },
      ]);
    }
    setPopoverOpen(false);
  };

  const removeEntityTag = (entityId: string) => {
    setEntityTags(entityTags.filter((tag) => tag.entityId !== entityId));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          entityTags: entityTags.map((tag) => ({
            entityType: tag.entityType,
            entityId: tag.entityId,
          })),
        }),
      });

      if (response.ok) {
        onOpenChange(false);
        onSuccess?.();
        // Reset form
        setFormData({
          title: '',
          content: '',
          authorName: 'Team Member',
        });
        setEntityTags([]);
      }
    } catch (error) {
      console.error('Error creating note:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="overflow-y-auto sm:max-w-xl">
        <SheetHeader>
          <SheetTitle>Create New Note</SheetTitle>
          <SheetDescription>
            Capture meeting notes, research, or insights and tag related entities
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-6">
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
              placeholder="Meeting with Sequoia Capital"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="authorName">Author *</Label>
            <Input
              id="authorName"
              value={formData.authorName}
              onChange={(e) => setFormData({ ...formData, authorName: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Notes *</Label>
            <Textarea
              id="content"
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              required
              placeholder="Detailed notes, key takeaways, action items..."
              rows={8}
            />
          </div>

          <div className="space-y-2">
            <Label>Tagged Entities</Label>
            <div className="flex flex-wrap gap-2 mb-2">
              {entityTags.map((tag) => (
                <Badge key={tag.entityId} variant="outline" className="badge-accent">
                  {tag.entityName}
                  <button
                    type="button"
                    onClick={() => removeEntityTag(tag.entityId)}
                    className="ml-2 hover:text-destructive"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
            <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
              <PopoverTrigger asChild>
                <Button type="button" variant="outline" className="w-full">
                  <Search className="h-4 w-4 mr-2" />
                  Add Firms, Funds, or Companies
                </Button>
              </PopoverTrigger>
              <PopoverContent className="p-0" align="start">
                <Command>
                  <CommandInput placeholder="Search entities..." />
                  <CommandList>
                    <CommandEmpty>No entities found.</CommandEmpty>
                    <CommandGroup heading="Firms">
                      {entities
                        .filter((e) => e.type === 'firm')
                        .map((entity) => (
                          <CommandItem
                            key={entity.id}
                            onSelect={() => addEntityTag(entity)}
                          >
                            {entity.name}
                          </CommandItem>
                        ))}
                    </CommandGroup>
                    <CommandGroup heading="Funds">
                      {entities
                        .filter((e) => e.type === 'fund')
                        .map((entity) => (
                          <CommandItem
                            key={entity.id}
                            onSelect={() => addEntityTag(entity)}
                          >
                            {entity.name}
                          </CommandItem>
                        ))}
                    </CommandGroup>
                    <CommandGroup heading="Companies">
                      {entities
                        .filter((e) => e.type === 'company')
                        .map((entity) => (
                          <CommandItem
                            key={entity.id}
                            onSelect={() => addEntityTag(entity)}
                          >
                            {entity.name}
                          </CommandItem>
                        ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Note
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}
