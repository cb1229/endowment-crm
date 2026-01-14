import { NextResponse } from 'next/server';
import { db } from '@/db';
import { deals } from '@/db/schema';
import { desc } from 'drizzle-orm';

// Mark this route as dynamic
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const allDeals = await db
      .select()
      .from(deals)
      .orderBy(desc(deals.createdAt));

    return NextResponse.json(allDeals);
  } catch (error) {
    console.error('Error fetching deals:', error);
    return NextResponse.json(
      { error: 'Failed to fetch deals' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, entityType, entityId, stage, priority, description, proposedAmount, expectedCloseDate, ownerName } = body;

    if (!name || !entityType || !entityId || !ownerName) {
      return NextResponse.json(
        { error: 'Name, entity type, entity ID, and owner name are required' },
        { status: 400 }
      );
    }

    const [newDeal] = await db
      .insert(deals)
      .values({
        name,
        entityType,
        entityId,
        stage: stage || 'triage',
        priority: priority || 'medium',
        description: description || null,
        proposedAmount: proposedAmount || null,
        expectedCloseDate: expectedCloseDate ? new Date(expectedCloseDate) : null,
        ownerId: 'default-user', // TODO: Use actual user ID from auth
        ownerName,
      })
      .returning();

    return NextResponse.json(newDeal, { status: 201 });
  } catch (error) {
    console.error('Error creating deal:', error);
    return NextResponse.json(
      { error: 'Failed to create deal' },
      { status: 500 }
    );
  }
}
