import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { companies, notes, noteEntityTags, deals } from '@/db/schema';
import { eq, and } from 'drizzle-orm';

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

    // Get related notes
    const companyNotes = await db
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
