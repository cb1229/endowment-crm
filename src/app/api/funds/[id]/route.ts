import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { funds, firms, notes, noteEntityTags, deals } from '@/db/schema';
import { eq, and } from 'drizzle-orm';

// Mark this route as dynamic
export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const fundId = params.id;

    // Get fund details with parent firm
    const [fund] = await db
      .select({
        id: funds.id,
        name: funds.name,
        firmId: funds.firmId,
        marketType: funds.marketType,
        description: funds.description,
        vintageYear: funds.vintageYear,
        fundSize: funds.fundSize,
        strategy: funds.strategy,
        createdAt: funds.createdAt,
        updatedAt: funds.updatedAt,
        firm: {
          id: firms.id,
          name: firms.name,
          marketType: firms.marketType,
        },
      })
      .from(funds)
      .leftJoin(firms, eq(funds.firmId, firms.id))
      .where(eq(funds.id, fundId))
      .limit(1);

    if (!fund) {
      return NextResponse.json(
        { error: 'Fund not found' },
        { status: 404 }
      );
    }

    // Get related notes
    const fundNotes = await db
      .selectDistinct({
        id: notes.id,
        title: notes.title,
        content: notes.content,
        userId: notes.userId,
        authorName: notes.authorName,
        isPublic: notes.isPublic,
        createdAt: notes.createdAt,
        updatedAt: notes.updatedAt,
      })
      .from(notes)
      .innerJoin(noteEntityTags, eq(notes.id, noteEntityTags.noteId))
      .where(
        and(
          eq(noteEntityTags.entityType, 'fund'),
          eq(noteEntityTags.entityId, fundId)
        )
      );

    // Get related deals
    const fundDeals = await db
      .select()
      .from(deals)
      .where(
        and(
          eq(deals.entityType, 'fund'),
          eq(deals.entityId, fundId)
        )
      );

    return NextResponse.json({
      ...fund,
      notes: fundNotes,
      deals: fundDeals,
      stats: {
        noteCount: fundNotes.length,
        dealCount: fundDeals.length,
      },
    });
  } catch (error) {
    console.error('Error fetching fund:', error);
    return NextResponse.json(
      { error: 'Failed to fetch fund' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const fundId = params.id;
    const body = await request.json();
    const { name, firmId, marketType, description, vintageYear, fundSize, strategy } = body;

    const [updatedFund] = await db
      .update(funds)
      .set({
        name,
        firmId: firmId || null,
        marketType,
        description: description || null,
        vintageYear: vintageYear ? parseInt(vintageYear) : null,
        fundSize: fundSize || null,
        strategy: strategy || null,
        updatedAt: new Date(),
      })
      .where(eq(funds.id, fundId))
      .returning();

    if (!updatedFund) {
      return NextResponse.json(
        { error: 'Fund not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedFund);
  } catch (error) {
    console.error('Error updating fund:', error);
    return NextResponse.json(
      { error: 'Failed to update fund' },
      { status: 500 }
    );
  }
}
