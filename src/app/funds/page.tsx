'use client';

import { useState, useEffect } from 'react';
import { TrendingUp, ExternalLink } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
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

  useEffect(() => {
    async function fetchFunds() {
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
    }

    fetchFunds();
  }, []);

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
                <Link href="/firms" className="text-muted-foreground hover:text-foreground transition-colors">
                  Firms
                </Link>
                <Link href="/funds" className="font-medium text-foreground">
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
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-medium tracking-tight">Investment Funds</h1>
          </div>
          <p className="text-sm text-muted-foreground">
            Track and manage fund commitments and performance
          </p>
        </div>

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
          <div className="rounded-lg border bg-card">
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
                      <Link href={`/funds/${fund.id}`} className="font-medium">
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
      </main>
    </div>
  );
}
