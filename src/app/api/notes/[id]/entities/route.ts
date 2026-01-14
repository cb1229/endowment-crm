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

    // Fetch the actual entities
    const entities = {
      firms: [] as any[],
      funds: [] as any[],
      companies: [] as any[],
    };

    for (const tag of tags) {
      if (tag.entityType === 'firm') {
        const firm = await db
          .select()
          .from(firms)
          .where(eq(firms.id, tag.entityId))
          .limit(1);
        if (firm[0]) entities.firms.push(firm[0]);
      } else if (tag.entityType === 'fund') {
        const fund = await db
          .select()
          .from(funds)
          .where(eq(funds.id, tag.entityId))
          .limit(1);
        if (fund[0]) entities.funds.push(fund[0]);
      } else if (tag.entityType === 'company') {
        const company = await db
          .select()
          .from(companies)
          .where(eq(companies.id, tag.entityId))
          .limit(1);
        if (company[0]) entities.companies.push(company[0]);
      }
    }

    return NextResponse.json(entities);
  } catch (error) {
    console.error('Error fetching note entities:', error);
    return NextResponse.json(
      { error: 'Failed to fetch note entities' },
      { status: 500 }
    );
  }
}
