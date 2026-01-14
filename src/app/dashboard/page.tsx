'use client';

import { useState, useEffect } from 'react';
import { StatsCard } from '@/components/stats-card';
import { Building2, TrendingUp, Building, Briefcase, Users, DollarSign } from 'lucide-react';
import Link from 'next/link';

interface DashboardStats {
  firms: { total: number; publicMarkets: number; privateMarkets: number };
  funds: { total: number; publicMarkets: number; privateMarkets: number };
  companies: { total: number };
  deals: { total: number; byStage: Record<string, number>; byPriority: Record<string, number> };
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const [firmsRes, fundsRes, companiesRes, dealsRes] = await Promise.all([
          fetch('/api/firms'),
          fetch('/api/funds'),
          fetch('/api/companies'),
          fetch('/api/deals'),
        ]);

        const [firms, funds, companies, deals] = await Promise.all([
          firmsRes.json(),
          fundsRes.json(),
          companiesRes.json(),
          dealsRes.json(),
        ]);

        const dealsByStage = deals.reduce((acc: any, deal: any) => {
          acc[deal.stage] = (acc[deal.stage] || 0) + 1;
          return acc;
        }, {});

        const dealsByPriority = deals.reduce((acc: any, deal: any) => {
          acc[deal.priority] = (acc[deal.priority] || 0) + 1;
          return acc;
        }, {});

        setStats({
          firms: {
            total: firms.length,
            publicMarkets: firms.filter((f: any) => f.marketType === 'public_markets').length,
            privateMarkets: firms.filter((f: any) => f.marketType === 'private_markets').length,
          },
          funds: {
            total: funds.length,
            publicMarkets: funds.filter((f: any) => f.marketType === 'public_markets').length,
            privateMarkets: funds.filter((f: any) => f.marketType === 'private_markets').length,
          },
          companies: {
            total: companies.length,
          },
          deals: {
            total: deals.length,
            byStage: dealsByStage,
            byPriority: dealsByPriority,
          },
        });
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchStats();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background bg-dot-pattern flex items-center justify-center">
        <div className="text-sm text-muted-foreground">Loading dashboard...</div>
      </div>
    );
  }

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
                <Link href="/dashboard" className="font-medium text-foreground">
                  Dashboard
                </Link>
              </nav>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-medium tracking-tight mb-1">Analytics Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Portfolio overview and key metrics
          </p>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatsCard
            title="Total Firms"
            value={stats?.firms.total || 0}
            icon={Building2}
            description={`${stats?.firms.publicMarkets || 0} public, ${stats?.firms.privateMarkets || 0} private`}
          />
          <StatsCard
            title="Total Funds"
            value={stats?.funds.total || 0}
            icon={TrendingUp}
            description={`${stats?.funds.publicMarkets || 0} public, ${stats?.funds.privateMarkets || 0} private`}
          />
          <StatsCard
            title="Companies"
            value={stats?.companies.total || 0}
            icon={Building}
            description="Portfolio companies"
          />
          <StatsCard
            title="Active Deals"
            value={stats?.deals.total || 0}
            icon={Briefcase}
            description="In pipeline"
          />
        </div>

        {/* Deal Pipeline Breakdown */}
        <div className="mb-8">
          <h2 className="text-xl font-medium tracking-tight mb-4">Deal Pipeline</h2>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <StatsCard
              title="Triage"
              value={stats?.deals.byStage.triage || 0}
              icon={Briefcase}
            />
            <StatsCard
              title="Diligence"
              value={stats?.deals.byStage.diligence || 0}
              icon={Briefcase}
            />
            <StatsCard
              title="IC Vote"
              value={stats?.deals.byStage.ic_vote || 0}
              icon={Briefcase}
            />
            <StatsCard
              title="Committed"
              value={stats?.deals.byStage.committed || 0}
              icon={Briefcase}
            />
            <StatsCard
              title="Pass"
              value={stats?.deals.byStage.pass || 0}
              icon={Briefcase}
            />
          </div>
        </div>

        {/* Deal Priority Breakdown */}
        <div>
          <h2 className="text-xl font-medium tracking-tight mb-4">Deal Priority</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <StatsCard
              title="High Priority"
              value={stats?.deals.byPriority.high || 0}
              icon={Briefcase}
              description="Urgent attention required"
            />
            <StatsCard
              title="Medium Priority"
              value={stats?.deals.byPriority.medium || 0}
              icon={Briefcase}
              description="Standard timeline"
            />
            <StatsCard
              title="Low Priority"
              value={stats?.deals.byPriority.low || 0}
              icon={Briefcase}
              description="Long-term opportunities"
            />
          </div>
        </div>
      </main>
    </div>
  );
}
