import { NextResponse } from 'next/server';
import { db } from '@/db';
import { firms } from '@/db/schema';
import { desc } from 'drizzle-orm';

// Mark this route as dynamic
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const allFirms = await db
      .select()
      .from(firms)
      .orderBy(desc(firms.createdAt));

    return NextResponse.json(allFirms);
  } catch (error) {
    console.error('Error fetching firms:', error);
    return NextResponse.json(
      { error: 'Failed to fetch firms' },
      { status: 500 }
    );
  }
}
