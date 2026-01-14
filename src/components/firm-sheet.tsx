'use client';

import { useState } from 'react';
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

interface FirmSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  firm?: {
    id: string;
    name: string;
    marketType: string;
    description?: string | null;
    website?: string | null;
    headquarters?: string | null;
    foundedYear?: number | null;
  };
  onSuccess?: () => void;
}

export function FirmSheet({ open, onOpenChange, firm, onSuccess }: FirmSheetProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: firm?.name || '',
    marketType: firm?.marketType || '',
    description: firm?.description || '',
    website: firm?.website || '',
    headquarters: firm?.headquarters || '',
    foundedYear: firm?.foundedYear?.toString() || '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const url = firm ? `/api/firms/${firm.id}` : '/api/firms';
      const method = firm ? 'PATCH' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        onOpenChange(false);
        onSuccess?.();
        // Reset form if creating new
        if (!firm) {
          setFormData({
            name: '',
            marketType: '',
            description: '',
            website: '',
            headquarters: '',
            foundedYear: '',
          });
        }
      }
    } catch (error) {
      console.error('Error saving firm:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{firm ? 'Edit Firm' : 'Create New Firm'}</SheetTitle>
          <SheetDescription>
            {firm ? 'Update firm information' : 'Add a new investment management firm'}
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-6">
          <div className="space-y-2">
            <Label htmlFor="name">Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="marketType">Market Type *</Label>
            <Select
              value={formData.marketType}
              onValueChange={(value) => setFormData({ ...formData, marketType: value })}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select market type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="public_markets">Public Markets</SelectItem>
                <SelectItem value="private_markets">Private Markets</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="headquarters">Headquarters</Label>
            <Input
              id="headquarters"
              value={formData.headquarters}
              onChange={(e) => setFormData({ ...formData, headquarters: e.target.value })}
              placeholder="New York, NY"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="foundedYear">Founded Year</Label>
            <Input
              id="foundedYear"
              type="number"
              value={formData.foundedYear}
              onChange={(e) => setFormData({ ...formData, foundedYear: e.target.value })}
              placeholder="2010"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="website">Website</Label>
            <Input
              id="website"
              type="url"
              value={formData.website}
              onChange={(e) => setFormData({ ...formData, website: e.target.value })}
              placeholder="https://example.com"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Brief description of the firm..."
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
              {firm ? 'Update' : 'Create'} Firm
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}
