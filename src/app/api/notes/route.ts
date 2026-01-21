import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { notes, noteEntityTags, firms, funds, profiles } from '@/db/schema';
import { desc, eq, or, and, sql } from 'drizzle-orm';
import { createClient } from '@/lib/supabase/server';

// Mark this route as dynamic
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const marketFilter = searchParams.get('market') as 'all' | 'public_markets' | 'private_markets' | null;
    const limit = parseInt(searchParams.get('limit') || '20');

    // Helper function to compute display author name
    // Rule: Use live profile name if exists, otherwise use historical snapshot
    const selectWithAuthor = {
      id: notes.id,
      title: notes.title,
      content: notes.content,
      userId: notes.userId,
      authorId: notes.authorId,
      // Display name: live profile name OR historical snapshot
      authorName: sql<string>`COALESCE(${profiles.fullName}, ${notes.originalAuthorName})`.as('author_name'),
      authorAvatarUrl: profiles.avatarUrl,
      originalAuthorName: notes.originalAuthorName,
      isPublic: notes.isPublic,
      createdAt: notes.createdAt,
      updatedAt: notes.updatedAt,
    };

    // If filtering by market type, we need to join through the tagging system
    if (marketFilter && marketFilter !== 'all') {
      const notesWithMarketType = await db
        .selectDistinct(selectWithAuthor)
        .from(notes)
        .leftJoin(profiles, eq(notes.authorId, profiles.id))
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

    // If no filter or 'all', just return all notes with author profile join
    const allNotes = await db
      .select(selectWithAuthor)
      .from(notes)
      .leftJoin(profiles, eq(notes.authorId, profiles.id))
      .orderBy(desc(notes.createdAt))
      .limit(limit);

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
    // Get the authenticated user from the session
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized - You must be logged in to create notes' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { title, content, isPublic, entityTags } = body;

    if (!title || !content) {
      return NextResponse.json(
        { error: 'Title and content are required' },
        { status: 400 }
      );
    }

    // Get user profile (or create if doesn't exist)
    let [profile] = await db
      .select()
      .from(profiles)
      .where(eq(profiles.id, user.id))
      .limit(1);

    // If profile doesn't exist, create it
    if (!profile) {
      const authorName = user.user_metadata?.full_name || user.email || 'Unknown User';
      [profile] = await db
        .insert(profiles)
        .values({
          id: user.id,
          email: user.email || 'unknown@example.com',
          fullName: authorName,
          avatarUrl: user.user_metadata?.avatar_url,
        })
        .returning();
    }

    // Determine the display name to store as historical snapshot
    const originalAuthorName = profile.fullName || profile.email;

    // Create the note with BOTH author_id (live link) and original_author_name (snapshot)
    const [newNote] = await db
      .insert(notes)
      .values({
        title,
        content,
        userId: user.id, // Legacy field
        authorId: profile.id, // Live reference to profiles
        originalAuthorName, // Historical snapshot
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
