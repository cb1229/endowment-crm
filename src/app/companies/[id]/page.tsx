'use client';

import { useState, useEffect } from 'react';
import { Building, ExternalLink, ArrowLeft } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { NoteCard } from '@/components/note-card';
import Link from 'next/link';

interface Company {
  id: string;
  name: string;
  description: string | null;
  website: string | null;
  industry: string | null;
  headquarters: string | null;
  foundedYear: number | null;
  notes: any[];
  deals: any[];
  stats: {
    noteCount: number;
    dealCount: number;
  };
}

export default function CompanyDetailPage({ params }: { params: { id: string } }) {
  const [company, setCompany] = useState<Company | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchCompany() {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/companies/${params.id}`);
        if (response.ok) {
          const data = await response.json();
          setCompany(data);
        }
      } catch (error) {
        console.error('Error fetching company:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchCompany();
  }, [params.id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background bg-dot-pattern flex items-center justify-center">
        <div className="text-sm text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (!company) {
    return (
      <div className="min-h-screen bg-background bg-dot-pattern flex items-center justify-center">
        <div className="text-sm text-muted-foreground">Company not found</div>
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
              <Link href="/funds" className="text-muted-foreground hover:text-foreground transition-colors">
                Funds
              </Link>
              <Link href="/companies" className="font-medium text-foreground">
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
          <Link href="/companies" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-4 w-4" />
            Back to Companies
          </Link>
        </div>

        {/* Company Header */}
        <div className="mb-8">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-4">
              <Building className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-3xl font-medium tracking-tight mb-2">{company.name}</h1>
                <div className="flex items-center gap-3">
                  {company.industry && (
                    <Badge variant="outline" className="text-xs rounded-full badge-green">
                      {company.industry}
                    </Badge>
                  )}
                  {company.headquarters && (
                    <>
                      <span className="text-muted-foreground">•</span>
                      <span className="text-sm text-muted-foreground">{company.headquarters}</span>
                    </>
                  )}
                  {company.foundedYear && (
                    <>
                      <span className="text-muted-foreground">•</span>
                      <span className="text-sm text-muted-foreground">Founded {company.foundedYear}</span>
                    </>
                  )}
                  {company.website && (
                    <>
                      <span className="text-muted-foreground">•</span>
                      <a
                        href={company.website}
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

          {company.description && (
            <p className="text-sm text-muted-foreground max-w-3xl">
              {company.description}
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
              <div className="text-2xl font-medium tracking-tight">{company.stats.noteCount}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Active Deals</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-medium tracking-tight">{company.stats.dealCount}</div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="notes" className="w-full">
          <TabsList>
            <TabsTrigger value="notes">Notes ({company.notes.length})</TabsTrigger>
            <TabsTrigger value="deals">Deals ({company.deals.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="notes" className="mt-6">
            {company.notes.length === 0 ? (
              <div className="text-center py-12 text-sm text-muted-foreground">
                No notes found
              </div>
            ) : (
              <div className="space-y-3">
                {company.notes.map((note) => (
                  <NoteCard key={note.id} note={note} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="deals" className="mt-6">
            {company.deals.length === 0 ? (
              <div className="text-center py-12 text-sm text-muted-foreground">
                No deals found
              </div>
            ) : (
              <div className="space-y-3">
                {company.deals.map((deal) => (
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
