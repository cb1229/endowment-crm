import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { firms, funds, notes, noteEntityTags, deals } from '@/db/schema';
import { eq, and, sql } from 'drizzle-orm';

// Mark this route as dynamic
export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const firmId = params.id;

    // Get firm details
    const [firm] = await db
      .select()
      .from(firms)
      .where(eq(firms.id, firmId))
      .limit(1);

    if (!firm) {
      return NextResponse.json(
        { error: 'Firm not found' },
        { status: 404 }
      );
    }

    // Get related funds
    const firmFunds = await db
      .select()
      .from(funds)
      .where(eq(funds.firmId, firmId));

    // Get related notes
    const firmNotes = await db
      .selectDistinct({
        id: notes.id,
        title: notes.title,
        content: notes.content,
        authorId: notes.authorId,
        authorName: notes.authorName,
        isPublic: notes.isPublic,
        createdAt: notes.createdAt,
        updatedAt: notes.updatedAt,
      })
      .from(notes)
      .innerJoin(noteEntityTags, eq(notes.id, noteEntityTags.noteId))
      .where(
        and(
          eq(noteEntityTags.entityType, 'firm'),
          eq(noteEntityTags.entityId, firmId)
        )
      );

    // Get related deals
    const firmDeals = await db
      .select()
      .from(deals)
      .where(
        and(
          eq(deals.entityType, 'firm'),
          eq(deals.entityId, firmId)
        )
      );

    return NextResponse.json({
      ...firm,
      funds: firmFunds,
      notes: firmNotes,
      deals: firmDeals,
      stats: {
        fundCount: firmFunds.length,
        noteCount: firmNotes.length,
        dealCount: firmDeals.length,
      },
    });
  } catch (error) {
    console.error('Error fetching firm:', error);
    return NextResponse.json(
      { error: 'Failed to fetch firm' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const firmId = params.id;
    const body = await request.json();
    const { name, marketType, description, website, headquarters, foundedYear } = body;

    const [updatedFirm] = await db
      .update(firms)
      .set({
        name,
        marketType,
        description: description || null,
        website: website || null,
        headquarters: headquarters || null,
        foundedYear: foundedYear ? parseInt(foundedYear) : null,
        updatedAt: new Date(),
      })
      .where(eq(firms.id, firmId))
      .returning();

    if (!updatedFirm) {
      return NextResponse.json(
        { error: 'Firm not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedFirm);
  } catch (error) {
    console.error('Error updating firm:', error);
    return NextResponse.json(
      { error: 'Failed to update firm' },
      { status: 500 }
    );
  }
}
