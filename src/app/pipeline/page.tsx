'use client';

import { useState, useEffect } from 'react';
import { Briefcase } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';

interface Deal {
  id: string;
  name: string;
  entityType: 'firm' | 'fund' | 'company';
  entityId: string;
  stage: 'triage' | 'diligence' | 'ic_vote' | 'committed' | 'pass';
  priority: 'low' | 'medium' | 'high';
  description: string | null;
  proposedAmount: string | null;
  expectedCloseDate: Date | null;
  ownerId: string;
  ownerName: string;
}

const STAGES = [
  { id: 'triage', label: 'Triage' },
  { id: 'diligence', label: 'Diligence' },
  { id: 'ic_vote', label: 'IC Vote' },
  { id: 'committed', label: 'Committed' },
  { id: 'pass', label: 'Pass' },
];

export default function PipelinePage() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchDeals() {
      setIsLoading(true);
      try {
        const response = await fetch('/api/deals');
        if (response.ok) {
          const data = await response.json();
          setDeals(data);
        }
      } catch (error) {
        console.error('Error fetching deals:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchDeals();
  }, []);

  const dealsByStage = STAGES.reduce((acc, stage) => {
    acc[stage.id] = deals.filter((deal) => deal.stage === stage.id);
    return acc;
  }, {} as Record<string, Deal[]>);

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
                <Link href="/pipeline" className="font-medium text-foreground">
                  Pipeline
                </Link>
                <Link href="/firms" className="text-muted-foreground hover:text-foreground transition-colors">
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
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <Briefcase className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-medium tracking-tight">Deal Pipeline</h1>
          </div>
          <p className="text-sm text-muted-foreground">
            Track investment opportunities through your deal flow
          </p>
        </div>

        {/* Kanban Board */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-sm text-muted-foreground">Loading pipeline...</div>
          </div>
        ) : (
          <div className="grid grid-cols-5 gap-4">
            {STAGES.map((stage) => (
              <div key={stage.id} className="flex flex-col">
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="text-sm font-medium tracking-tight">{stage.label}</h3>
                  <Badge variant="outline" className="text-xs rounded-full badge-gray">
                    {dealsByStage[stage.id]?.length || 0}
                  </Badge>
                </div>
                <div className="space-y-3 min-h-[200px]">
                  {dealsByStage[stage.id]?.map((deal) => (
                    <Card key={deal.id} className="card-hover">
                      <CardHeader className="pb-2">
                        <div className="flex items-start justify-between mb-2">
                          <CardTitle className="text-sm tracking-tight">{deal.name}</CardTitle>
                          <Badge variant="outline" className={`text-xs rounded-full ${
                            deal.priority === 'high' ? 'badge-red' :
                            deal.priority === 'medium' ? 'badge-yellow' : 'badge-gray'
                          }`}>
                            {deal.priority}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          {deal.proposedAmount && (
                            <p className="text-sm font-medium">{deal.proposedAmount}</p>
                          )}
                          <p className="text-xs text-muted-foreground">{deal.ownerName}</p>
                          <Badge variant="outline" className="text-xs badge-accent">
                            {deal.entityType}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
