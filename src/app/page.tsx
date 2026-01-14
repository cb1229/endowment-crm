'use client';

import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { NoteCard } from '@/components/note-card';
import { NoteSheet } from '@/components/note-sheet';
import { Plus, Search } from 'lucide-react';
import Link from 'next/link';

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
  const [noteSheetOpen, setNoteSheetOpen] = useState(false);

  const fetchNotes = async () => {
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
  };

  useEffect(() => {
    fetchNotes();
  }, [marketFilter]);

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
                <Link href="/" className="font-medium text-foreground">
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
                <Link href="/companies" className="text-muted-foreground hover:text-foreground transition-colors">
                  Companies
                </Link>
              </nav>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon">
                <Search className="h-5 w-5" />
              </Button>
              <Button size="sm" onClick={() => setNoteSheetOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                New Note
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        <div className="mb-6">
          <h2 className="text-2xl font-medium mb-1 tracking-tight">Recent Intelligence</h2>
          <p className="text-sm text-muted-foreground">
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
      </main>

      <NoteSheet
        open={noteSheetOpen}
        onOpenChange={setNoteSheetOpen}
        onSuccess={fetchNotes}
      />
    </div>
  );
}
