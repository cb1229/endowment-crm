'use client';

import { useState, useEffect } from 'react';
import { Building2, ExternalLink, Plus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { FirmSheet } from '@/components/firm-sheet';
import { SearchInput } from '@/components/search-input';
import Link from 'next/link';

interface Firm {
  id: string;
  name: string;
  marketType: 'public_markets' | 'private_markets';
  description: string | null;
  website: string | null;
  headquarters: string | null;
  foundedYear: number | null;
}

export default function FirmsPage() {
  const [firms, setFirms] = useState<Firm[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchFirms = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/firms');
      if (response.ok) {
        const data = await response.json();
        setFirms(data);
      }
    } catch (error) {
      console.error('Error fetching firms:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFirms();
  }, []);

  const filteredFirms = firms.filter((firm) => {
    const query = searchQuery.toLowerCase();
    return (
      firm.name.toLowerCase().includes(query) ||
      firm.headquarters?.toLowerCase().includes(query) ||
      firm.description?.toLowerCase().includes(query)
    );
  });

  return (
    <div className="min-h-screen bg-background bg-dot-pattern">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-8">
              <Link href="/" className="text-xl font-medium tracking-tight">
                Endowment CRM
              </Link>
              <nav className="flex items-center gap-6 text-sm">
                <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">
                  Intelligence
                </Link>
                <Link href="/pipeline" className="text-muted-foreground hover:text-foreground transition-colors">
                  Pipeline
                </Link>
                <Link href="/firms" className="font-medium text-foreground">
                  Firms
                </Link>
                <Link href="/funds" className="text-muted-foreground hover:text-foreground transition-colors">
                  Funds
                </Link>
                <Link href="/companies" className="text-muted-foreground hover:text-foreground transition-colors">
                  Companies
                </Link>
              </nav>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        <div className="mb-6 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Building2 className="h-6 w-6 text-primary" />
              <h1 className="text-2xl font-medium tracking-tight">Investment Firms</h1>
            </div>
            <p className="text-sm text-muted-foreground">
              Manage relationships with investment management firms
            </p>
          </div>
          <Button onClick={() => setSheetOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Firm
          </Button>
        </div>

        {/* Search */}
        <div className="mb-4 max-w-md">
          <SearchInput
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search firms by name, location..."
          />
        </div>

        {/* Table */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-sm text-muted-foreground">Loading firms...</div>
          </div>
        ) : filteredFirms.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 border-2 border-dashed rounded-lg">
            <p className="text-sm text-muted-foreground">
              {searchQuery ? 'No firms match your search' : 'No firms found'}
            </p>
          </div>
        ) : (
          <div className="rounded-lg border bg-card">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="font-medium">Name</TableHead>
                  <TableHead className="font-medium">Market Type</TableHead>
                  <TableHead className="font-medium">Headquarters</TableHead>
                  <TableHead className="font-medium">Founded</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredFirms.map((firm) => (
                  <TableRow key={firm.id} className="cursor-pointer hover:bg-muted/50">
                    <TableCell>
                      <Link href={`/firms/${firm.id}`} className="flex items-center gap-2 font-medium">
                        {firm.name}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={`text-xs rounded-full ${
                        firm.marketType === 'public_markets' ? 'badge-blue' : 'badge-purple'
                      }`}>
                        {firm.marketType === 'public_markets' ? 'Public Markets' : 'Private Markets'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {firm.headquarters || '—'}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {firm.foundedYear || '—'}
                    </TableCell>
                    <TableCell>
                      {firm.website && (
                        <a
                          href={firm.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-muted-foreground hover:text-foreground"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </main>

      <FirmSheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        onSuccess={fetchFirms}
      />
    </div>
  );
}
