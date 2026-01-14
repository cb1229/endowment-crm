import { NextResponse } from 'next/server';
import { db } from '@/db';
import { companies } from '@/db/schema';
import { desc } from 'drizzle-orm';

// Mark this route as dynamic
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const allCompanies = await db
      .select()
      .from(companies)
      .orderBy(desc(companies.createdAt));

    return NextResponse.json(allCompanies);
  } catch (error) {
    console.error('Error fetching companies:', error);
    return NextResponse.json(
      { error: 'Failed to fetch companies' },
      { status: 500 }
    );
  }
}
