'use client';

import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
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
import { FundSheet } from '@/components/fund-sheet';
import { PageHeader } from '@/components/page-header';
import Link from 'next/link';

interface Fund {
  id: string;
  name: string;
  firmId: string | null;
  marketType: 'public_markets' | 'private_markets';
  description: string | null;
  vintageYear: number | null;
  fundSize: string | null;
  strategy: string | null;
  firm: {
    id: string;
    name: string;
  } | null;
}

export default function FundsPage() {
  const [funds, setFunds] = useState<Fund[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sheetOpen, setSheetOpen] = useState(false);

  const fetchFunds = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/funds');
      if (response.ok) {
        const data = await response.json();
        setFunds(data);
      }
    } catch (error) {
      console.error('Error fetching funds:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFunds();
  }, []);

  return (
    <div className="min-h-screen">
      <PageHeader
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Funds' }
        ]}
        title="Investment Funds"
        description="Track and manage fund commitments and performance"
        actions={
          <Button onClick={() => setSheetOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Fund
          </Button>
        }
      />

      <div className="p-6 space-y-6">
        <div className="paper-container p-6">
          {/* Table */}
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-sm text-muted-foreground">Loading funds...</div>
            </div>
          ) : funds.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 border-2 border-dashed rounded-lg">
              <p className="text-sm text-muted-foreground">No funds found</p>
            </div>
          ) : (
            <div className="rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="font-medium">Name</TableHead>
                    <TableHead className="font-medium">Firm</TableHead>
                    <TableHead className="font-medium">Market Type</TableHead>
                    <TableHead className="font-medium">Vintage</TableHead>
                    <TableHead className="font-medium">Size</TableHead>
                    <TableHead className="font-medium">Strategy</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {funds.map((fund) => (
                    <TableRow key={fund.id} className="cursor-pointer hover:bg-muted/50">
                      <TableCell>
                        <Link href={`/funds/${fund.id}`} className="flex items-center gap-3 font-medium">
                          <div className="avatar avatar-sm">
                            {fund.name.substring(0, 2).toUpperCase()}
                          </div>
                          {fund.name}
                        </Link>
                      </TableCell>
                      <TableCell>
                        {fund.firm ? (
                          <Link href={`/firms/${fund.firm.id}`} className="text-sm text-muted-foreground hover:text-foreground">
                            {fund.firm.name}
                          </Link>
                        ) : (
                          <span className="text-sm text-muted-foreground">—</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={`text-xs rounded-full ${
                          fund.marketType === 'public_markets' ? 'badge-blue' : 'badge-purple'
                        }`}>
                          {fund.marketType === 'public_markets' ? 'Public Markets' : 'Private Markets'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {fund.vintageYear || '—'}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {fund.fundSize || '—'}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {fund.strategy || '—'}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </div>

      <FundSheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        onSuccess={fetchFunds}
      />
    </div>
  );
}
