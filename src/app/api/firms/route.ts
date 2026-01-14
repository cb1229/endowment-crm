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

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, marketType, description, website, headquarters, foundedYear } = body;

    if (!name || !marketType) {
      return NextResponse.json(
        { error: 'Name and market type are required' },
        { status: 400 }
      );
    }

    const [newFirm] = await db
      .insert(firms)
      .values({
        name,
        marketType,
        description: description || null,
        website: website || null,
        headquarters: headquarters || null,
        foundedYear: foundedYear ? parseInt(foundedYear) : null,
      })
      .returning();

    return NextResponse.json(newFirm, { status: 201 });
  } catch (error) {
    console.error('Error creating firm:', error);
    return NextResponse.json(
      { error: 'Failed to create firm' },
      { status: 500 }
    );
  }
}
