'use client';

import { useState, useEffect } from 'react';
import { Building2, ExternalLink, ArrowLeft } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { NoteCard } from '@/components/note-card';
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
      <div className="min-h-screen bg-background bg-dot-pattern flex items-center justify-center">
        <div className="text-sm text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (!firm) {
    return (
      <div className="min-h-screen bg-background bg-dot-pattern flex items-center justify-center">
        <div className="text-sm text-muted-foreground">Firm not found</div>
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
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Link href="/firms" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-4 w-4" />
            Back to Firms
          </Link>
        </div>

        {/* Firm Header */}
        <div className="mb-8">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-4">
              <Building2 className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-3xl font-medium tracking-tight mb-2">{firm.name}</h1>
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className={`text-xs rounded-full ${
                    firm.marketType === 'public_markets' ? 'badge-blue' : 'badge-purple'
                  }`}>
                    {firm.marketType === 'public_markets' ? 'Public Markets' : 'Private Markets'}
                  </Badge>
                  {firm.headquarters && (
                    <>
                      <span className="text-muted-foreground">•</span>
                      <span className="text-sm text-muted-foreground">{firm.headquarters}</span>
                    </>
                  )}
                  {firm.foundedYear && (
                    <>
                      <span className="text-muted-foreground">•</span>
                      <span className="text-sm text-muted-foreground">Founded {firm.foundedYear}</span>
                    </>
                  )}
                  {firm.website && (
                    <>
                      <span className="text-muted-foreground">•</span>
                      <a
                        href={firm.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-primary hover:underline inline-flex items-center gap-1"
                      >
                        Website
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {firm.description && (
            <p className="text-sm text-muted-foreground max-w-3xl">
              {firm.description}
            </p>
          )}
        </div>

        <Separator className="mb-8" />

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Funds</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-medium tracking-tight">{firm.stats.fundCount}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-medium tracking-tight">{firm.stats.noteCount}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Active Deals</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-medium tracking-tight">{firm.stats.dealCount}</div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="funds" className="w-full">
          <TabsList>
            <TabsTrigger value="funds">Funds ({firm.funds.length})</TabsTrigger>
            <TabsTrigger value="notes">Notes ({firm.notes.length})</TabsTrigger>
            <TabsTrigger value="deals">Deals ({firm.deals.length})</TabsTrigger>
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
