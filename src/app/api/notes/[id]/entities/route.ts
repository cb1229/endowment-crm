import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { noteEntityTags, firms, funds, companies } from '@/db/schema';
import { eq, and } from 'drizzle-orm';

// Mark this route as dynamic
export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const noteId = params.id;

    // Get all entity tags for this note
    const tags = await db
      .select()
      .from(noteEntityTags)
      .where(eq(noteEntityTags.noteId, noteId));

    // Fetch the actual entities with names
    const result = [];

    for (const tag of tags) {
      if (tag.entityType === 'firm') {
        const [firm] = await db
          .select()
          .from(firms)
          .where(eq(firms.id, tag.entityId))
          .limit(1);
        if (firm) {
          result.push({
            id: tag.id,
            entityType: 'firm',
            entityId: firm.id,
            entityName: firm.name,
            marketType: firm.marketType,
          });
        }
      } else if (tag.entityType === 'fund') {
        const [fund] = await db
          .select()
          .from(funds)
          .where(eq(funds.id, tag.entityId))
          .limit(1);
        if (fund) {
          result.push({
            id: tag.id,
            entityType: 'fund',
            entityId: fund.id,
            entityName: fund.name,
            marketType: fund.marketType,
          });
        }
      } else if (tag.entityType === 'company') {
        const [company] = await db
          .select()
          .from(companies)
          .where(eq(companies.id, tag.entityId))
          .limit(1);
        if (company) {
          result.push({
            id: tag.id,
            entityType: 'company',
            entityId: company.id,
            entityName: company.name,
          });
        }
      }
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching note entities:', error);
    return NextResponse.json(
      { error: 'Failed to fetch note entities' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const noteId = params.id;
    const body = await request.json();
    const { entityType, entityId } = body;

    if (!entityType || !entityId) {
      return NextResponse.json(
        { error: 'Entity type and ID are required' },
        { status: 400 }
      );
    }

    // Check if relationship already exists
    const existing = await db
      .select()
      .from(noteEntityTags)
      .where(
        and(
          eq(noteEntityTags.noteId, noteId),
          eq(noteEntityTags.entityType, entityType),
          eq(noteEntityTags.entityId, entityId)
        )
      );

    if (existing.length > 0) {
      return NextResponse.json(
        { error: 'Relationship already exists' },
        { status: 400 }
      );
    }

    // Create the relationship
    const [newTag] = await db
      .insert(noteEntityTags)
      .values({
        noteId,
        entityType,
        entityId,
      })
      .returning();

    return NextResponse.json(newTag, { status: 201 });
  } catch (error) {
    console.error('Error adding entity relationship:', error);
    return NextResponse.json(
      { error: 'Failed to add entity relationship' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const noteId = params.id;
    const body = await request.json();
    const { entityType, entityId } = body;

    if (!entityType || !entityId) {
      return NextResponse.json(
        { error: 'Entity type and ID are required' },
        { status: 400 }
      );
    }

    // Delete the relationship
    await db
      .delete(noteEntityTags)
      .where(
        and(
          eq(noteEntityTags.noteId, noteId),
          eq(noteEntityTags.entityType, entityType),
          eq(noteEntityTags.entityId, entityId)
        )
      );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error removing entity relationship:', error);
    return NextResponse.json(
      { error: 'Failed to remove entity relationship' },
      { status: 500 }
    );
  }
}
