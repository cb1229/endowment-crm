'use client';

import { useState, useEffect } from 'react';
import { X, Building2, TrendingUp, Building, Pencil, Save, Plus } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import Link from 'next/link';

interface NoteEntity {
  id: string;
  entityType: 'firm' | 'fund' | 'company';
  entityId: string;
  entityName: string;
  marketType?: string;
}

interface Note {
  id: string;
  title: string;
  content: string;
  authorName: string;
  createdAt: string;
  entities?: NoteEntity[];
}

interface NoteDetailSheetProps {
  noteId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function NoteDetailSheet({ noteId, open, onOpenChange, onSuccess }: NoteDetailSheetProps) {
  const [note, setNote] = useState<Note | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [editedTitle, setEditedTitle] = useState('');
  const [editedContent, setEditedContent] = useState('');

  // Relationship management
  const [isAddingRelationship, setIsAddingRelationship] = useState(false);
  const [newRelationType, setNewRelationType] = useState<'firm' | 'fund' | 'company'>('firm');
  const [availableEntities, setAvailableEntities] = useState<any[]>([]);
  const [selectedEntityId, setSelectedEntityId] = useState('');

  useEffect(() => {
    if (noteId && open) {
      fetchNote();
    }
  }, [noteId, open]);

  const fetchNote = async () => {
    if (!noteId) return;

    setIsLoading(true);
    try {
      // Fetch note with entities
      const response = await fetch(`/api/notes/${noteId}`);
      if (response.ok) {
        const data = await response.json();
        setNote(data);
        setEditedTitle(data.title);
        setEditedContent(data.content);

        // Fetch entities related to this note
        const entitiesResponse = await fetch(`/api/notes/${noteId}/entities`);
        if (entitiesResponse.ok) {
          const entitiesData = await entitiesResponse.json();
          setNote(prev => prev ? { ...prev, entities: entitiesData } : null);
        }
      }
    } catch (error) {
      console.error('Error fetching note:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAvailableEntities = async (type: 'firm' | 'fund' | 'company') => {
    try {
      const response = await fetch(`/api/${type}s`);
      if (response.ok) {
        const data = await response.json();
        setAvailableEntities(data);
      }
    } catch (error) {
      console.error('Error fetching entities:', error);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    if (!noteId) return;

    setIsSaving(true);
    try {
      const response = await fetch(`/api/notes/${noteId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: editedTitle,
          content: editedContent,
        }),
      });

      if (response.ok) {
        const updatedNote = await response.json();
        setNote(updatedNote);
        setIsEditing(false);
        onSuccess?.();
      }
    } catch (error) {
      console.error('Error updating note:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setEditedTitle(note?.title || '');
    setEditedContent(note?.content || '');
    setIsEditing(false);
  };

  const handleAddRelationship = async () => {
    if (!noteId || !selectedEntityId) return;

    try {
      const response = await fetch(`/api/notes/${noteId}/entities`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          entityType: newRelationType,
          entityId: selectedEntityId,
        }),
      });

      if (response.ok) {
        await fetchNote(); // Refresh to show new relationship
        setIsAddingRelationship(false);
        setSelectedEntityId('');
        onSuccess?.();
      }
    } catch (error) {
      console.error('Error adding relationship:', error);
    }
  };

  const handleRemoveRelationship = async (entityId: string, entityType: string) => {
    if (!noteId) return;

    try {
      const response = await fetch(`/api/notes/${noteId}/entities`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          entityType,
          entityId,
        }),
      });

      if (response.ok) {
        await fetchNote(); // Refresh to remove relationship
        onSuccess?.();
      }
    } catch (error) {
      console.error('Error removing relationship:', error);
    }
  };

  const startAddingRelationship = (type: 'firm' | 'fund' | 'company') => {
    setNewRelationType(type);
    setIsAddingRelationship(true);
    fetchAvailableEntities(type);
  };

  const getEntityIcon = (type: string) => {
    switch (type) {
      case 'firm': return Building2;
      case 'fund': return TrendingUp;
      case 'company': return Building;
      default: return Building2;
    }
  };

  const getEntityLink = (entity: NoteEntity) => {
    return `/${entity.entityType}s/${entity.entityId}`;
  };

  if (isLoading || !note) {
    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent className="sm:max-w-2xl overflow-y-auto">
          <div className="flex items-center justify-center h-full">
            <div className="text-sm text-muted-foreground">Loading...</div>
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-2xl overflow-y-auto">
        <SheetHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1 pr-8">
              {isEditing ? (
                <Input
                  value={editedTitle}
                  onChange={(e) => setEditedTitle(e.target.value)}
                  className="text-lg font-semibold mb-2"
                  placeholder="Note title"
                />
              ) : (
                <SheetTitle className="text-xl">{note.title}</SheetTitle>
              )}
              <p className="text-sm text-muted-foreground mt-2">
                {note.authorName} • {new Date(note.createdAt).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
            {!isEditing ? (
              <Button variant="outline" size="sm" onClick={handleEdit}>
                <Pencil className="h-4 w-4 mr-2" />
                Edit
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handleCancelEdit}>
                  Cancel
                </Button>
                <Button size="sm" onClick={handleSave} disabled={isSaving}>
                  <Save className="h-4 w-4 mr-2" />
                  Save
                </Button>
              </div>
            )}
          </div>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Note Content */}
          <div>
            <Label className="text-sm font-medium mb-2">Content</Label>
            {isEditing ? (
              <Textarea
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
                rows={12}
                className="mt-2"
                placeholder="Note content..."
              />
            ) : (
              <div className="mt-2 text-sm text-foreground whitespace-pre-wrap bg-muted/30 rounded-lg p-4">
                {note.content}
              </div>
            )}
          </div>

          {/* Related Entities */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <Label className="text-sm font-medium">Related Entities</Label>
              {!isAddingRelationship && !isEditing && (
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => startAddingRelationship('firm')}
                  >
                    <Plus className="h-3 w-3 mr-1" />
                    Firm
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => startAddingRelationship('fund')}
                  >
                    <Plus className="h-3 w-3 mr-1" />
                    Fund
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => startAddingRelationship('company')}
                  >
                    <Plus className="h-3 w-3 mr-1" />
                    Company
                  </Button>
                </div>
              )}
            </div>

            {/* Add Relationship Form */}
            {isAddingRelationship && (
              <div className="mb-4 p-4 border rounded-lg bg-muted/30">
                <Label className="text-sm mb-2">
                  Add {newRelationType.charAt(0).toUpperCase() + newRelationType.slice(1)}
                </Label>
                <div className="flex gap-2 mt-2">
                  <Select value={selectedEntityId} onValueChange={setSelectedEntityId}>
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder={`Select ${newRelationType}...`} />
                    </SelectTrigger>
                    <SelectContent>
                      {availableEntities.map((entity) => (
                        <SelectItem key={entity.id} value={entity.id}>
                          {entity.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button size="sm" onClick={handleAddRelationship} disabled={!selectedEntityId}>
                    Add
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setIsAddingRelationship(false);
                      setSelectedEntityId('');
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}

            {/* Entity List */}
            {note.entities && note.entities.length > 0 ? (
              <div className="space-y-2">
                {note.entities.map((entity) => {
                  const Icon = getEntityIcon(entity.entityType);
                  return (
                    <div
                      key={`${entity.entityType}-${entity.entityId}`}
                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/30 transition-colors"
                    >
                      <Link
                        href={getEntityLink(entity)}
                        className="flex items-center gap-3 flex-1"
                        onClick={() => onOpenChange(false)}
                      >
                        <Icon className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">{entity.entityName}</p>
                          <p className="text-xs text-muted-foreground capitalize">
                            {entity.entityType}
                            {entity.marketType && ` • ${entity.marketType.replace('_', ' ')}`}
                          </p>
                        </div>
                      </Link>
                      {!isEditing && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveRelationship(entity.entityId, entity.entityType)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-8">
                No related entities. Add firms, funds, or companies to organize this note.
              </p>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
