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

interface FundSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  fund?: {
    id: string;
    name: string;
    firmId?: string | null;
    marketType: string;
    description?: string | null;
    vintageYear?: number | null;
    fundSize?: string | null;
    strategy?: string | null;
  };
  onSuccess?: () => void;
}

export function FundSheet({ open, onOpenChange, fund, onSuccess }: FundSheetProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [firms, setFirms] = useState<Array<{ id: string; name: string }>>([]);
  const [formData, setFormData] = useState({
    name: fund?.name || '',
    firmId: fund?.firmId || '',
    marketType: fund?.marketType || '',
    description: fund?.description || '',
    vintageYear: fund?.vintageYear?.toString() || '',
    fundSize: fund?.fundSize || '',
    strategy: fund?.strategy || '',
  });

  useEffect(() => {
    async function fetchFirms() {
      try {
        const response = await fetch('/api/firms');
        if (response.ok) {
          const data = await response.json();
          setFirms(data);
        }
      } catch (error) {
        console.error('Error fetching firms:', error);
      }
    }

    if (open) {
      fetchFirms();
    }
  }, [open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const url = fund ? `/api/funds/${fund.id}` : '/api/funds';
      const method = fund ? 'PATCH' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        onOpenChange(false);
        onSuccess?.();
        // Reset form if creating new
        if (!fund) {
          setFormData({
            name: '',
            firmId: '',
            marketType: '',
            description: '',
            vintageYear: '',
            fundSize: '',
            strategy: '',
          });
        }
      }
    } catch (error) {
      console.error('Error saving fund:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{fund ? 'Edit Fund' : 'Create New Fund'}</SheetTitle>
          <SheetDescription>
            {fund ? 'Update fund information' : 'Add a new investment fund'}
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
            <Label htmlFor="firmId">Parent Firm</Label>
            <Select
              value={formData.firmId}
              onValueChange={(value) => setFormData({ ...formData, firmId: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a firm (optional)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">None</SelectItem>
                {firms.map((firm) => (
                  <SelectItem key={firm.id} value={firm.id}>
                    {firm.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
            <Label htmlFor="vintageYear">Vintage Year</Label>
            <Input
              id="vintageYear"
              type="number"
              value={formData.vintageYear}
              onChange={(e) => setFormData({ ...formData, vintageYear: e.target.value })}
              placeholder="2020"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="fundSize">Fund Size</Label>
            <Input
              id="fundSize"
              value={formData.fundSize}
              onChange={(e) => setFormData({ ...formData, fundSize: e.target.value })}
              placeholder="$500M"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="strategy">Strategy</Label>
            <Input
              id="strategy"
              value={formData.strategy}
              onChange={(e) => setFormData({ ...formData, strategy: e.target.value })}
              placeholder="Growth Equity, Venture, etc."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Brief description of the fund..."
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
              {fund ? 'Update' : 'Create'} Fund
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}
