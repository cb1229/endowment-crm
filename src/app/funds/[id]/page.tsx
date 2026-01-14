'use client';

import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { NoteCard } from '@/components/note-card';
import { PageHeader } from '@/components/page-header';
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
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-sm text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (!fund) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-sm text-muted-foreground">Fund not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <PageHeader
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Funds', href: '/funds' },
          { label: fund.name }
        ]}
      />

      <div className="p-6 space-y-6">
        {/* Fund Header Card */}
        <div className="paper-container p-6">
          <div className="flex items-start gap-4 mb-4">
            <div className="avatar avatar-lg">
              {fund.name.substring(0, 2).toUpperCase()}
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-semibold tracking-tight mb-2">{fund.name}</h1>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                {fund.firm && (
                  <Link href={`/firms/${fund.firm.id}`} className="text-muted-foreground hover:text-foreground">
                    {fund.firm.name}
                  </Link>
                )}
                {fund.firm && (
                  <>
                    <span>•</span>
                  </>
                )}
                <Badge variant="outline" className={`text-xs rounded-full ${
                  fund.marketType === 'public_markets' ? 'badge-blue' : 'badge-purple'
                }`}>
                  {fund.marketType === 'public_markets' ? 'Public Markets' : 'Private Markets'}
                </Badge>
                {fund.vintageYear && (
                  <>
                    <span>•</span>
                    <span>Vintage {fund.vintageYear}</span>
                  </>
                )}
                {fund.fundSize && (
                  <>
                    <span>•</span>
                    <span>{fund.fundSize}</span>
                  </>
                )}
              </div>
            </div>
          </div>

          {fund.description && (
            <p className="text-sm text-muted-foreground mb-2">
              {fund.description}
            </p>
          )}
          {fund.strategy && (
            <p className="text-sm text-muted-foreground">
              <span className="font-medium">Strategy:</span> {fund.strategy}
            </p>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold tracking-tight">{fund.stats.noteCount}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Active Deals</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold tracking-tight">{fund.stats.dealCount}</div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <div className="paper-container p-6">
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
                          <span className={`status-pill ${
                            deal.priority === 'high' ? 'status-high' :
                            deal.priority === 'medium' ? 'status-medium' : 'status-low'
                          }`}>
                            {deal.priority}
                          </span>
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
        </div>
      </div>
    </div>
  );
}
