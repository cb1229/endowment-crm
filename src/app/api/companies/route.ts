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

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, description, website, industry, headquarters, foundedYear } = body;

    if (!name) {
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 }
      );
    }

    const [newCompany] = await db
      .insert(companies)
      .values({
        name,
        description: description || null,
        website: website || null,
        industry: industry || null,
        headquarters: headquarters || null,
        foundedYear: foundedYear ? parseInt(foundedYear) : null,
      })
      .returning();

    return NextResponse.json(newCompany, { status: 201 });
  } catch (error) {
    console.error('Error creating company:', error);
    return NextResponse.json(
      { error: 'Failed to create company' },
      { status: 500 }
    );
  }
}
