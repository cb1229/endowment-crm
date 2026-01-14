'use client';

import { useState, useEffect } from 'react';
import { Briefcase, Plus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DealSheet } from '@/components/deal-sheet';
import Link from 'next/link';
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragEndEvent,
} from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

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

function DealCard({ deal }: { deal: Deal }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: deal.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <Card className="card-hover cursor-grab active:cursor-grabbing">
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
    </div>
  );
}

export default function PipelinePage() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeDeal, setActiveDeal] = useState<Deal | null>(null);
  const [dealSheetOpen, setDealSheetOpen] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor)
  );

  const fetchDeals = async () => {
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
  };

  useEffect(() => {
    fetchDeals();
  }, []);

  const dealsByStage = STAGES.reduce((acc, stage) => {
    acc[stage.id] = deals.filter((deal) => deal.stage === stage.id);
    return acc;
  }, {} as Record<string, Deal[]>);

  const handleDragStart = (event: DragStartEvent) => {
    const deal = deals.find((d) => d.id === event.active.id);
    setActiveDeal(deal || null);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveDeal(null);

    if (!over) return;

    const dealId = active.id as string;
    const newStage = over.id as string;

    // Find if the drop target is a stage
    const targetStage = STAGES.find((s) => s.id === newStage);
    if (!targetStage) return;

    // Update deal stage locally
    setDeals((prev) =>
      prev.map((deal) =>
        deal.id === dealId ? { ...deal, stage: newStage as Deal['stage'] } : deal
      )
    );

    // Update on server
    try {
      await fetch(`/api/deals/${dealId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stage: newStage }),
      });
    } catch (error) {
      console.error('Error updating deal:', error);
      // Revert on error
      fetchDeals();
    }
  };

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
        <div className="mb-6 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Briefcase className="h-6 w-6 text-primary" />
              <h1 className="text-2xl font-medium tracking-tight">Deal Pipeline</h1>
            </div>
            <p className="text-sm text-muted-foreground">
              Drag deals between stages to update their status
            </p>
          </div>
          <Button onClick={() => setDealSheetOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Deal
          </Button>
        </div>

        {/* Kanban Board */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-sm text-muted-foreground">Loading pipeline...</div>
          </div>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          >
            <div className="grid grid-cols-5 gap-4">
              {STAGES.map((stage) => (
                <SortableContext
                  key={stage.id}
                  id={stage.id}
                  items={dealsByStage[stage.id]?.map((d) => d.id) || []}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="flex flex-col">
                    <div className="mb-3 flex items-center justify-between">
                      <h3 className="text-sm font-medium tracking-tight">{stage.label}</h3>
                      <Badge variant="outline" className="text-xs rounded-full badge-gray">
                        {dealsByStage[stage.id]?.length || 0}
                      </Badge>
                    </div>
                    <div className="space-y-3 min-h-[200px] bg-muted/20 rounded-lg p-3">
                      {dealsByStage[stage.id]?.map((deal) => (
                        <DealCard key={deal.id} deal={deal} />
                      ))}
                    </div>
                  </div>
                </SortableContext>
              ))}
            </div>
            <DragOverlay>
              {activeDeal ? (
                <Card className="cursor-grabbing shadow-lg">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm tracking-tight">{activeDeal.name}</CardTitle>
                  </CardHeader>
                </Card>
              ) : null}
            </DragOverlay>
          </DndContext>
        )}
      </main>

      <DealSheet
        open={dealSheetOpen}
        onOpenChange={setDealSheetOpen}
        onSuccess={fetchDeals}
      />
    </div>
  );
}
