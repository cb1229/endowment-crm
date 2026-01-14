import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { notes, noteEntityTags, firms, funds } from '@/db/schema';
import { desc, eq, or, and, sql } from 'drizzle-orm';

// Mark this route as dynamic
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const marketFilter = searchParams.get('market') as 'all' | 'public_markets' | 'private_markets' | null;
    const limit = parseInt(searchParams.get('limit') || '20');

    // Base query to get notes with their entity tags
    let query = db
      .select({
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
      .orderBy(desc(notes.createdAt))
      .limit(limit);

    // If filtering by market type, we need to join through the tagging system
    if (marketFilter && marketFilter !== 'all') {
      const notesWithMarketType = await db
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
        .leftJoin(
          firms,
          and(
            eq(noteEntityTags.entityType, 'firm'),
            eq(noteEntityTags.entityId, firms.id)
          )
        )
        .leftJoin(
          funds,
          and(
            eq(noteEntityTags.entityType, 'fund'),
            eq(noteEntityTags.entityId, funds.id)
          )
        )
        .where(
          or(
            eq(firms.marketType, marketFilter),
            eq(funds.marketType, marketFilter)
          )
        )
        .orderBy(desc(notes.createdAt))
        .limit(limit);

      return NextResponse.json(notesWithMarketType);
    }

    // If no filter or 'all', just return all notes
    const allNotes = await query;
    return NextResponse.json(allNotes);
  } catch (error) {
    console.error('Error fetching notes:', error);
    return NextResponse.json(
      { error: 'Failed to fetch notes' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, content, authorName, authorId, isPublic, entityTags } = body;

    if (!title || !content || !authorName) {
      return NextResponse.json(
        { error: 'Title, content, and author name are required' },
        { status: 400 }
      );
    }

    // Create the note
    const [newNote] = await db
      .insert(notes)
      .values({
        title,
        content,
        authorName,
        authorId: authorId || 'default-user',
        isPublic: isPublic ?? true,
      })
      .returning();

    // Create entity tags if provided
    if (entityTags && Array.isArray(entityTags) && entityTags.length > 0) {
      const tagValues = entityTags.map((tag: { entityType: 'firm' | 'fund' | 'company'; entityId: string }) => ({
        noteId: newNote.id,
        entityType: tag.entityType as 'firm' | 'fund' | 'company',
        entityId: tag.entityId,
      }));

      await db.insert(noteEntityTags).values(tagValues);
    }

    return NextResponse.json(newNote, { status: 201 });
  } catch (error) {
    console.error('Error creating note:', error);
    return NextResponse.json(
      { error: 'Failed to create note' },
      { status: 500 }
    );
  }
}
