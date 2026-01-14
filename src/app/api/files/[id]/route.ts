import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { fileAttachments } from '@/db/schema';
import { eq } from 'drizzle-orm';

export const dynamic = 'force-dynamic';

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const fileId = params.id;

    await db
      .delete(fileAttachments)
      .where(eq(fileAttachments.id, fileId));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting file metadata:', error);
    return NextResponse.json(
      { error: 'Failed to delete file metadata' },
      { status: 500 }
    );
  }
}
