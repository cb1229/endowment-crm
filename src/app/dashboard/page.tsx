'use client';

import { useState, useEffect } from 'react';
import { StatsCard } from '@/components/stats-card';
import { PageHeader } from '@/components/page-header';
import { Building2, TrendingUp, Building, Briefcase } from 'lucide-react';

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
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-sm text-muted-foreground">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <PageHeader
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Dashboard' }
        ]}
        title="Analytics Dashboard"
        description="Portfolio overview and key metrics"
      />

      <div className="p-6 space-y-6">
        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
        <div className="paper-container p-6">
          <h2 className="text-xl font-semibold tracking-tight mb-4">Deal Pipeline</h2>
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
        <div className="paper-container p-6">
          <h2 className="text-xl font-semibold tracking-tight mb-4">Deal Priority</h2>
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
      </div>
    </div>
  );
}
