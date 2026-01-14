'use client';

import { useState, useEffect } from 'react';
import { TrendingUp, ExternalLink, ArrowLeft } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { NoteCard } from '@/components/note-card';
import Link from 'next/link';

interface Fund {
  id: string;
  name: string;
  marketType: 'public_markets' | 'private_markets';
  description: string | null;
  vintageYear: number | null;
  fundSize: string | null;
  strategy: string | null;
  firm: {
    id: string;
    name: string;
    marketType: string;
  } | null;
  notes: any[];
  deals: any[];
  stats: {
    noteCount: number;
    dealCount: number;
  };
}

export default function FundDetailPage({ params }: { params: { id: string } }) {
  const [fund, setFund] = useState<Fund | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchFund() {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/funds/${params.id}`);
        if (response.ok) {
          const data = await response.json();
          setFund(data);
        }
      } catch (error) {
        console.error('Error fetching fund:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchFund();
  }, [params.id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background bg-dot-pattern flex items-center justify-center">
        <div className="text-sm text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (!fund) {
    return (
      <div className="min-h-screen bg-background bg-dot-pattern flex items-center justify-center">
        <div className="text-sm text-muted-foreground">Fund not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background bg-dot-pattern">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
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
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Link href="/funds" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-4 w-4" />
            Back to Funds
          </Link>
        </div>

        {/* Fund Header */}
        <div className="mb-8">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-4">
              <TrendingUp className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-3xl font-medium tracking-tight mb-2">{fund.name}</h1>
                <div className="flex items-center gap-3">
                  {fund.firm && (
                    <Link href={`/firms/${fund.firm.id}`} className="text-sm text-muted-foreground hover:text-foreground">
                      {fund.firm.name}
                    </Link>
                  )}
                  <span className="text-muted-foreground">•</span>
                  <Badge variant="outline" className={`text-xs rounded-full ${
                    fund.marketType === 'public_markets' ? 'badge-blue' : 'badge-purple'
                  }`}>
                    {fund.marketType === 'public_markets' ? 'Public Markets' : 'Private Markets'}
                  </Badge>
                  {fund.vintageYear && (
                    <>
                      <span className="text-muted-foreground">•</span>
                      <span className="text-sm text-muted-foreground">Vintage {fund.vintageYear}</span>
                    </>
                  )}
                  {fund.fundSize && (
                    <>
                      <span className="text-muted-foreground">•</span>
                      <span className="text-sm text-muted-foreground">{fund.fundSize}</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {fund.description && (
            <p className="text-sm text-muted-foreground max-w-3xl mb-2">
              {fund.description}
            </p>
          )}
          {fund.strategy && (
            <p className="text-sm text-muted-foreground">
              <span className="font-medium">Strategy:</span> {fund.strategy}
            </p>
          )}
        </div>

        <Separator className="mb-8" />

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-medium tracking-tight">{fund.stats.noteCount}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Active Deals</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-medium tracking-tight">{fund.stats.dealCount}</div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="notes" className="w-full">
          <TabsList>
            <TabsTrigger value="notes">Notes ({fund.notes.length})</TabsTrigger>
            <TabsTrigger value="deals">Deals ({fund.deals.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="notes" className="mt-6">
            {fund.notes.length === 0 ? (
              <div className="text-center py-12 text-sm text-muted-foreground">
                No notes found
              </div>
            ) : (
              <div className="space-y-3">
                {fund.notes.map((note) => (
                  <NoteCard key={note.id} note={note} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="deals" className="mt-6">
            {fund.deals.length === 0 ? (
              <div className="text-center py-12 text-sm text-muted-foreground">
                No deals found
              </div>
            ) : (
              <div className="space-y-3">
                {fund.deals.map((deal) => (
                  <Card key={deal.id} className="card-hover">
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between">
                        <CardTitle className="tracking-tight">{deal.name}</CardTitle>
                        <Badge variant="outline" className={`text-xs rounded-full ${
                          deal.priority === 'high' ? 'badge-red' :
                          deal.priority === 'medium' ? 'badge-yellow' : 'badge-gray'
                        }`}>
                          {deal.priority}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <Badge variant="outline" className="text-xs badge-accent">
                          {deal.stage.replace('_', ' ')}
                        </Badge>
                        {deal.proposedAmount && <span>{deal.proposedAmount}</span>}
                        {deal.ownerName && (
                          <>
                            <span>•</span>
                            <span>{deal.ownerName}</span>
                          </>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
