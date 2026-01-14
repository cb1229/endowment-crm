import { NextResponse } from 'next/server';
import { db } from '@/db';
import { funds, firms } from '@/db/schema';
import { desc, eq } from 'drizzle-orm';

// Mark this route as dynamic
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const allFunds = await db
      .select({
        id: funds.id,
        name: funds.name,
        firmId: funds.firmId,
        marketType: funds.marketType,
        description: funds.description,
        vintageYear: funds.vintageYear,
        fundSize: funds.fundSize,
        strategy: funds.strategy,
        createdAt: funds.createdAt,
        updatedAt: funds.updatedAt,
        firm: {
          id: firms.id,
          name: firms.name,
        },
      })
      .from(funds)
      .leftJoin(firms, eq(funds.firmId, firms.id))
      .orderBy(desc(funds.createdAt));

    return NextResponse.json(allFunds);
  } catch (error) {
    console.error('Error fetching funds:', error);
    return NextResponse.json(
      { error: 'Failed to fetch funds' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, firmId, marketType, description, vintageYear, fundSize, strategy } = body;

    if (!name || !marketType) {
      return NextResponse.json(
        { error: 'Name and market type are required' },
        { status: 400 }
      );
    }

    const [newFund] = await db
      .insert(funds)
      .values({
        name,
        firmId: firmId || null,
        marketType,
        description: description || null,
        vintageYear: vintageYear ? parseInt(vintageYear) : null,
        fundSize: fundSize || null,
        strategy: strategy || null,
      })
      .returning();

    return NextResponse.json(newFund, { status: 201 });
  } catch (error) {
    console.error('Error creating fund:', error);
    return NextResponse.json(
      { error: 'Failed to create fund' },
      { status: 500 }
    );
  }
}
