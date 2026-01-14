'use client';

import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { NoteCard } from '@/components/note-card';
import { NoteSheet } from '@/components/note-sheet';
import { StatsCard } from '@/components/stats-card';
import { PageHeader } from '@/components/page-header';
import { Plus, Building2, TrendingUp, Building, Briefcase } from 'lucide-react';

type MarketFilter = 'all' | 'public_markets' | 'private_markets';

interface Note {
  id: string;
  title: string;
  content: string;
  authorName: string;
  createdAt: string;
}

interface Stats {
  firmCount: number;
  fundCount: number;
  companyCount: number;
  dealCount: number;
}

export default function HomePage() {
  const [marketFilter, setMarketFilter] = useState<MarketFilter>('all');
  const [notes, setNotes] = useState<Note[]>([]);
  const [stats, setStats] = useState<Stats>({ firmCount: 0, fundCount: 0, companyCount: 0, dealCount: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [noteSheetOpen, setNoteSheetOpen] = useState(false);
  const [commandOpen, setCommandOpen] = useState(false);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [notesRes, firmsRes, fundsRes, companiesRes, dealsRes] = await Promise.all([
        fetch(`/api/notes?market=${marketFilter}&limit=20`),
        fetch('/api/firms'),
        fetch('/api/funds'),
        fetch('/api/companies'),
        fetch('/api/deals'),
      ]);

      const [notesData, firmsData, fundsData, companiesData, dealsData] = await Promise.all([
        notesRes.json(),
        firmsRes.json(),
        fundsRes.json(),
        companiesRes.json(),
        dealsRes.json(),
      ]);

      setNotes(notesData);
      setStats({
        firmCount: firmsData.length,
        fundCount: fundsData.length,
        companyCount: companiesData.length,
        dealCount: dealsData.length,
      });
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [marketFilter]);

  return (
    <div className="min-h-screen">
      <PageHeader
        breadcrumbs={[{ label: 'Home' }]}
        onSearchClick={() => setCommandOpen(true)}
        actions={
          <Button size="sm" onClick={() => setNoteSheetOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            New Note
          </Button>
        }
      />

      <div className="p-6 space-y-6">
        {/* Stats Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="Investment Firms"
            value={stats.firmCount}
            icon={Building2}
            description="Active relationships"
          />
          <StatsCard
            title="Funds"
            value={stats.fundCount}
            icon={TrendingUp}
            description="Under management"
          />
          <StatsCard
            title="Portfolio Companies"
            value={stats.companyCount}
            icon={Building}
            description="Across all funds"
          />
          <StatsCard
            title="Active Deals"
            value={stats.dealCount}
            icon={Briefcase}
            description="In pipeline"
          />
        </div>

        {/* Recent Intelligence Section */}
        <div className="paper-container p-6">
          <div className="mb-6">
            <h2 className="text-xl font-semibold tracking-tight mb-1">Recent Intelligence</h2>
            <p className="text-sm text-muted-foreground">
              Latest notes, meetings, and research across your portfolio
            </p>
          </div>

          {/* Market Type Filter */}
          <Tabs value={marketFilter} onValueChange={(value) => setMarketFilter(value as MarketFilter)} className="mb-6">
            <TabsList>
              <TabsTrigger value="all">All Markets</TabsTrigger>
              <TabsTrigger value="public_markets">Public Markets</TabsTrigger>
              <TabsTrigger value="private_markets">Private Markets</TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Notes List */}
          <div className="space-y-3">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-sm text-muted-foreground">Loading notes...</div>
              </div>
            ) : notes.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 border-2 border-dashed rounded-lg">
                <p className="text-sm text-muted-foreground mb-4">No notes found</p>
                <Button size="sm" onClick={() => setNoteSheetOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create your first note
                </Button>
              </div>
            ) : (
              notes.map((note) => (
                <NoteCard key={note.id} note={note} />
              ))
            )}
          </div>
        </div>
      </div>

      <NoteSheet
        open={noteSheetOpen}
        onOpenChange={setNoteSheetOpen}
        onSuccess={fetchData}
      />
    </div>
  );
}
