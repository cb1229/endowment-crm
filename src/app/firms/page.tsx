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
import { FilterTabs } from '@/components/filter-tabs';
import { PageHeader } from '@/components/page-header';
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

type MarketFilter = 'all' | 'public_markets' | 'private_markets';

export default function FirmsPage() {
  const [firms, setFirms] = useState<Firm[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [marketFilter, setMarketFilter] = useState<MarketFilter>('all');

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
    const matchesSearch =
      firm.name.toLowerCase().includes(query) ||
      firm.headquarters?.toLowerCase().includes(query) ||
      firm.description?.toLowerCase().includes(query);

    const matchesMarket = marketFilter === 'all' || firm.marketType === marketFilter;

    return matchesSearch && matchesMarket;
  });

  const marketCounts = {
    all: firms.length,
    public_markets: firms.filter(f => f.marketType === 'public_markets').length,
    private_markets: firms.filter(f => f.marketType === 'private_markets').length,
  };

  return (
    <div className="min-h-screen">
      <PageHeader
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Firms' }
        ]}
        title="Investment Firms"
        description="Manage relationships with investment management firms"
        actions={
          <Button onClick={() => setSheetOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Firm
          </Button>
        }
      />

      <div className="p-6 space-y-6">
        <div className="paper-container p-6">
          {/* Filters */}
          <div className="mb-6 flex items-center gap-4">
            <FilterTabs
              value={marketFilter}
              onValueChange={(v) => setMarketFilter(v as MarketFilter)}
              options={[
                { value: 'all', label: 'All Markets', count: marketCounts.all },
                { value: 'public_markets', label: 'Public', count: marketCounts.public_markets },
                { value: 'private_markets', label: 'Private', count: marketCounts.private_markets },
              ]}
            />
            <div className="flex-1 max-w-md">
              <SearchInput
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="Search firms by name, location..."
              />
            </div>
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
            <div className="rounded-lg border">
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
                        <Link href={`/firms/${firm.id}`} className="flex items-center gap-3 font-medium">
                          <div className="avatar avatar-sm">
                            {firm.name.substring(0, 2).toUpperCase()}
                          </div>
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
        </div>
      </div>

      <FirmSheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        onSuccess={fetchFirms}
      />
    </div>
  );
}
