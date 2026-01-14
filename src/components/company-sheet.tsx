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
import { Loader2 } from 'lucide-react';

interface CompanySheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  company?: {
    id: string;
    name: string;
    description?: string | null;
    website?: string | null;
    industry?: string | null;
    headquarters?: string | null;
    foundedYear?: number | null;
  };
  onSuccess?: () => void;
}

export function CompanySheet({ open, onOpenChange, company, onSuccess }: CompanySheetProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: company?.name || '',
    industry: company?.industry || '',
    description: company?.description || '',
    website: company?.website || '',
    headquarters: company?.headquarters || '',
    foundedYear: company?.foundedYear?.toString() || '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const url = company ? `/api/companies/${company.id}` : '/api/companies';
      const method = company ? 'PATCH' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        onOpenChange(false);
        onSuccess?.();
        // Reset form if creating new
        if (!company) {
          setFormData({
            name: '',
            industry: '',
            description: '',
            website: '',
            headquarters: '',
            foundedYear: '',
          });
        }
      }
    } catch (error) {
      console.error('Error saving company:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{company ? 'Edit Company' : 'Create New Company'}</SheetTitle>
          <SheetDescription>
            {company ? 'Update company information' : 'Add a new portfolio company'}
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
            <Label htmlFor="industry">Industry</Label>
            <Input
              id="industry"
              value={formData.industry}
              onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
              placeholder="Technology, Healthcare, etc."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="headquarters">Headquarters</Label>
            <Input
              id="headquarters"
              value={formData.headquarters}
              onChange={(e) => setFormData({ ...formData, headquarters: e.target.value })}
              placeholder="San Francisco, CA"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="foundedYear">Founded Year</Label>
            <Input
              id="foundedYear"
              type="number"
              value={formData.foundedYear}
              onChange={(e) => setFormData({ ...formData, foundedYear: e.target.value })}
              placeholder="2015"
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
              placeholder="Brief description of the company..."
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
              {company ? 'Update' : 'Create'} Company
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}
