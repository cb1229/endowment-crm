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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2 } from 'lucide-react';

interface DealSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  deal?: {
    id: string;
    name: string;
    entityType: 'firm' | 'fund' | 'company';
    entityId: string;
    stage: 'triage' | 'diligence' | 'ic_vote' | 'committed' | 'pass';
    priority: 'low' | 'medium' | 'high';
    description?: string | null;
    proposedAmount?: string | null;
    expectedCloseDate?: Date | null;
    ownerName: string;
  };
  onSuccess?: () => void;
}

interface Entity {
  id: string;
  name: string;
  type: 'firm' | 'fund' | 'company';
}

export function DealSheet({ open, onOpenChange, deal, onSuccess }: DealSheetProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [entities, setEntities] = useState<Entity[]>([]);
  const [formData, setFormData] = useState({
    name: deal?.name || '',
    entityType: deal?.entityType || 'firm',
    entityId: deal?.entityId || '',
    stage: deal?.stage || 'triage',
    priority: deal?.priority || 'medium',
    description: deal?.description || '',
    proposedAmount: deal?.proposedAmount || '',
    expectedCloseDate: deal?.expectedCloseDate ? new Date(deal.expectedCloseDate).toISOString().split('T')[0] : '',
    ownerName: deal?.ownerName || 'Team Member',
  });

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

  const filteredEntities = entities.filter((e) => e.type === formData.entityType);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const url = deal ? `/api/deals/${deal.id}` : '/api/deals';
      const method = deal ? 'PATCH' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          expectedCloseDate: formData.expectedCloseDate || null,
        }),
      });

      if (response.ok) {
        onOpenChange(false);
        onSuccess?.();
        // Reset form if creating new
        if (!deal) {
          setFormData({
            name: '',
            entityType: 'firm',
            entityId: '',
            stage: 'triage',
            priority: 'medium',
            description: '',
            proposedAmount: '',
            expectedCloseDate: '',
            ownerName: 'Team Member',
          });
        }
      }
    } catch (error) {
      console.error('Error saving deal:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="overflow-y-auto sm:max-w-xl">
        <SheetHeader>
          <SheetTitle>{deal ? 'Edit Deal' : 'Create New Deal'}</SheetTitle>
          <SheetDescription>
            {deal ? 'Update deal information' : 'Add a new investment opportunity to your pipeline'}
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-6">
          <div className="space-y-2">
            <Label htmlFor="name">Deal Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              placeholder="Series A Investment"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="entityType">Entity Type *</Label>
              <Select
                value={formData.entityType}
                onValueChange={(value: any) => setFormData({ ...formData, entityType: value, entityId: '' })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="firm">Firm</SelectItem>
                  <SelectItem value="fund">Fund</SelectItem>
                  <SelectItem value="company">Company</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="entityId">Related Entity *</Label>
              <Select
                value={formData.entityId}
                onValueChange={(value) => setFormData({ ...formData, entityId: value })}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select entity" />
                </SelectTrigger>
                <SelectContent>
                  {filteredEntities.map((entity) => (
                    <SelectItem key={entity.id} value={entity.id}>
                      {entity.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="stage">Stage *</Label>
              <Select
                value={formData.stage}
                onValueChange={(value: any) => setFormData({ ...formData, stage: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="triage">Triage</SelectItem>
                  <SelectItem value="diligence">Diligence</SelectItem>
                  <SelectItem value="ic_vote">IC Vote</SelectItem>
                  <SelectItem value="committed">Committed</SelectItem>
                  <SelectItem value="pass">Pass</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="priority">Priority *</Label>
              <Select
                value={formData.priority}
                onValueChange={(value: any) => setFormData({ ...formData, priority: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="proposedAmount">Proposed Amount</Label>
            <Input
              id="proposedAmount"
              value={formData.proposedAmount}
              onChange={(e) => setFormData({ ...formData, proposedAmount: e.target.value })}
              placeholder="$5M"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="expectedCloseDate">Expected Close Date</Label>
            <Input
              id="expectedCloseDate"
              type="date"
              value={formData.expectedCloseDate}
              onChange={(e) => setFormData({ ...formData, expectedCloseDate: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="ownerName">Deal Owner *</Label>
            <Input
              id="ownerName"
              value={formData.ownerName}
              onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Deal summary, key terms, notes..."
              rows={4}
            />
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
              {deal ? 'Update' : 'Create'} Deal
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}
