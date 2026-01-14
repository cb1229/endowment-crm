'use client';

import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { NoteCard } from '@/components/note-card';
import { Plus, Search } from 'lucide-react';

type MarketFilter = 'all' | 'public_markets' | 'private_markets';

interface Note {
  id: string;
  title: string;
  content: string;
  authorName: string;
  createdAt: string;
}

export default function HomePage() {
  const [marketFilter, setMarketFilter] = useState<MarketFilter>('all');
  const [notes, setNotes] = useState<Note[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchNotes() {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/notes?market=${marketFilter}&limit=20`);
        if (response.ok) {
          const data = await response.json();
          setNotes(data);
        }
      } catch (error) {
        console.error('Error fetching notes:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchNotes();
  }, [marketFilter]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-8">
              <h1 className="text-2xl font-bold">Endowment CRM</h1>
              <nav className="flex items-center gap-6 text-sm">
                <a href="/" className="font-medium text-foreground">
                  Intelligence
                </a>
                <a href="/pipeline" className="text-muted-foreground hover:text-foreground transition-colors">
                  Pipeline
                </a>
                <a href="/firms" className="text-muted-foreground hover:text-foreground transition-colors">
                  Firms
                </a>
                <a href="/funds" className="text-muted-foreground hover:text-foreground transition-colors">
                  Funds
                </a>
                <a href="/companies" className="text-muted-foreground hover:text-foreground transition-colors">
                  Companies
                </a>
              </nav>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon">
                <Search className="h-5 w-5" />
              </Button>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                New Note
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">Recent Intelligence</h2>
          <p className="text-muted-foreground">
            Latest notes, meetings, and research across your portfolio
          </p>
        </div>

        {/* Market Type Filter */}
        <Tabs value={marketFilter} onValueChange={(value) => setMarketFilter(value as MarketFilter)} className="mb-6">
          <TabsList>
            <TabsTrigger value="all">All Markets</TabsTrigger>
            <TabsTrigger value="private_markets">Private Markets</TabsTrigger>
            <TabsTrigger value="public_markets">Public Markets</TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Notes Feed */}
        <div className="space-y-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-muted-foreground">Loading notes...</div>
            </div>
          ) : notes.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 border-2 border-dashed rounded-lg">
              <p className="text-muted-foreground mb-4">No notes found</p>
              <Button>
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
      </main>
    </div>
  );
}
