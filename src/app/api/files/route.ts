import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { fileAttachments } from '@/db/schema';
import { eq, and } from 'drizzle-orm';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const entityType = searchParams.get('entityType');
    const entityId = searchParams.get('entityId');
    const noteId = searchParams.get('noteId');

    let query = db.select().from(fileAttachments);

    // Filter by entity or note
    if (entityType && entityId) {
      query = query.where(
        and(
          eq(fileAttachments.entityType, entityType as any),
          eq(fileAttachments.entityId, entityId)
        )
      ) as any;
    } else if (noteId) {
      query = query.where(eq(fileAttachments.noteId, noteId)) as any;
    }

    const files = await query;
    return NextResponse.json(files);
  } catch (error) {
    console.error('Error fetching files:', error);
    return NextResponse.json(
      { error: 'Failed to fetch files' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { fileName, filePath, fileSize, fileType, entityType, entityId, noteId } = body;

    if (!fileName || !filePath || !fileSize || !fileType) {
      return NextResponse.json(
        { error: 'File name, path, size, and type are required' },
        { status: 400 }
      );
    }

    const [newFile] = await db
      .insert(fileAttachments)
      .values({
        fileName,
        filePath,
        fileSize,
        fileType,
        entityType: entityType || null,
        entityId: entityId || null,
        noteId: noteId || null,
        uploadedBy: 'current-user', // TODO: Get from auth session
      })
      .returning();

    return NextResponse.json(newFile, { status: 201 });
  } catch (error) {
    console.error('Error saving file metadata:', error);
    return NextResponse.json(
      { error: 'Failed to save file metadata' },
      { status: 500 }
    );
  }
}
