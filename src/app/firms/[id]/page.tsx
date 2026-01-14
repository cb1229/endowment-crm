'use client';

import { useState, useEffect } from 'react';
import { ExternalLink } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { NoteCard } from '@/components/note-card';
import { FileUpload } from '@/components/file-upload';
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
  funds: any[];
  notes: any[];
  deals: any[];
  stats: {
    fundCount: number;
    noteCount: number;
    dealCount: number;
  };
}

export default function FirmDetailPage({ params }: { params: { id: string } }) {
  const [firm, setFirm] = useState<Firm | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchFirm() {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/firms/${params.id}`);
        if (response.ok) {
          const data = await response.json();
          setFirm(data);
        }
      } catch (error) {
        console.error('Error fetching firm:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchFirm();
  }, [params.id]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-sm text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (!firm) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-sm text-muted-foreground">Firm not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <PageHeader
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Firms', href: '/firms' },
          { label: firm.name }
        ]}
      />

      <div className="p-6 space-y-6">
        {/* Firm Header Card */}
        <div className="paper-container p-6">
          <div className="flex items-start gap-4 mb-4">
            <div className="avatar avatar-lg">
              {firm.name.substring(0, 2).toUpperCase()}
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-semibold tracking-tight mb-2">{firm.name}</h1>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <Badge variant="outline" className={`text-xs rounded-full ${
                  firm.marketType === 'public_markets' ? 'badge-blue' : 'badge-purple'
                }`}>
                  {firm.marketType === 'public_markets' ? 'Public Markets' : 'Private Markets'}
                </Badge>
                {firm.headquarters && (
                  <>
                    <span>•</span>
                    <span>{firm.headquarters}</span>
                  </>
                )}
                {firm.foundedYear && (
                  <>
                    <span>•</span>
                    <span>Founded {firm.foundedYear}</span>
                  </>
                )}
                {firm.website && (
                  <>
                    <span>•</span>
                    <a
                      href={firm.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline inline-flex items-center gap-1"
                    >
                      Website
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </>
                )}
              </div>
            </div>
          </div>

          {firm.description && (
            <p className="text-sm text-muted-foreground">
              {firm.description}
            </p>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Funds</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold tracking-tight">{firm.stats.fundCount}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold tracking-tight">{firm.stats.noteCount}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Active Deals</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold tracking-tight">{firm.stats.dealCount}</div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <div className="paper-container p-6">
          <Tabs defaultValue="funds" className="w-full">
            <TabsList>
              <TabsTrigger value="funds">Funds ({firm.funds.length})</TabsTrigger>
              <TabsTrigger value="notes">Notes ({firm.notes.length})</TabsTrigger>
              <TabsTrigger value="deals">Deals ({firm.deals.length})</TabsTrigger>
              <TabsTrigger value="files">Files</TabsTrigger>
            </TabsList>

            <TabsContent value="funds" className="mt-6">
              {firm.funds.length === 0 ? (
                <div className="text-center py-12 text-sm text-muted-foreground">
                  No funds found
                </div>
              ) : (
                <div className="space-y-3">
                  {firm.funds.map((fund) => (
                    <Link key={fund.id} href={`/funds/${fund.id}`}>
                      <Card className="card-hover">
                        <CardHeader className="pb-2">
                          <CardTitle className="tracking-tight">{fund.name}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            {fund.vintageYear && <span>Vintage {fund.vintageYear}</span>}
                            {fund.fundSize && (
                              <>
                                <span>•</span>
                                <span>{fund.fundSize}</span>
                              </>
                            )}
                            {fund.strategy && (
                              <>
                                <span>•</span>
                                <span>{fund.strategy}</span>
                              </>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="notes" className="mt-6">
              {firm.notes.length === 0 ? (
                <div className="text-center py-12 text-sm text-muted-foreground">
                  No notes found
                </div>
              ) : (
                <div className="space-y-3">
                  {firm.notes.map((note) => (
                    <NoteCard key={note.id} note={note} />
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="deals" className="mt-6">
              {firm.deals.length === 0 ? (
                <div className="text-center py-12 text-sm text-muted-foreground">
                  No deals found
                </div>
              ) : (
                <div className="space-y-3">
                  {firm.deals.map((deal) => (
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

            <TabsContent value="files" className="mt-6">
              <FileUpload
                entityType="firm"
                entityId={firm.id}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
