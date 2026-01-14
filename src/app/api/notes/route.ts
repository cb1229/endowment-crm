import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { notes, noteEntityTags, firms, funds } from '@/db/schema';
import { desc, eq, or, and, sql } from 'drizzle-orm';

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
