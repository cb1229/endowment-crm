import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { companies, notes, noteEntityTags, deals, profiles } from '@/db/schema';
import { eq, and, sql } from 'drizzle-orm';

// Mark this route as dynamic
export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const companyId = params.id;

    // Get company details
    const [company] = await db
      .select()
      .from(companies)
      .where(eq(companies.id, companyId))
      .limit(1);

    if (!company) {
      return NextResponse.json(
        { error: 'Company not found' },
        { status: 404 }
      );
    }

    // Get related notes with live/historic author names
    const companyNotes = await db
      .selectDistinct({
        id: notes.id,
        title: notes.title,
        content: notes.content,
        userId: notes.userId,
        authorId: notes.authorId,
        // Display name: live profile name OR historical snapshot
        authorName: sql<string>`COALESCE(${profiles.fullName}, ${notes.originalAuthorName})`.as('author_name'),
        originalAuthorName: notes.originalAuthorName,
        isPublic: notes.isPublic,
        createdAt: notes.createdAt,
        updatedAt: notes.updatedAt,
      })
      .from(notes)
      .leftJoin(profiles, eq(notes.authorId, profiles.id))
      .innerJoin(noteEntityTags, eq(notes.id, noteEntityTags.noteId))
      .where(
        and(
          eq(noteEntityTags.entityType, 'company'),
          eq(noteEntityTags.entityId, companyId)
        )
      );

    // Get related deals
    const companyDeals = await db
      .select()
      .from(deals)
      .where(
        and(
          eq(deals.entityType, 'company'),
          eq(deals.entityId, companyId)
        )
      );

    return NextResponse.json({
      ...company,
      notes: companyNotes,
      deals: companyDeals,
      stats: {
        noteCount: companyNotes.length,
        dealCount: companyDeals.length,
      },
    });
  } catch (error) {
    console.error('Error fetching company:', error);
    return NextResponse.json(
      { error: 'Failed to fetch company' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const companyId = params.id;
    const body = await request.json();
    const { name, description, website, industry, headquarters, foundedYear } = body;

    const [updatedCompany] = await db
      .update(companies)
      .set({
        name,
        description: description || null,
        website: website || null,
        industry: industry || null,
        headquarters: headquarters || null,
        foundedYear: foundedYear ? parseInt(foundedYear) : null,
        updatedAt: new Date(),
      })
      .where(eq(companies.id, companyId))
      .returning();

    if (!updatedCompany) {
      return NextResponse.json(
        { error: 'Company not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedCompany);
  } catch (error) {
    console.error('Error updating company:', error);
    return NextResponse.json(
      { error: 'Failed to update company' },
      { status: 500 }
    );
  }
}
