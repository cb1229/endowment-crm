# Migration Guide: Automated User Attribution for Notes

## Overview
This update refactors the note creation system to automatically attribute notes to the currently authenticated user via Supabase Auth, removing the manual "Author" input field.

## Changes Made

### 1. Database Schema (`src/db/schema.ts`)
- **Changed**: `authorId` field renamed to `userId` with UUID type
- **Purpose**: Properly references `auth.users.id` from Supabase Authentication
- **Kept**: `authorName` field remains for denormalized performance (auto-populated from user metadata)

### 2. API Route (`src/app/api/notes/route.ts`)
- **Added**: Import of Supabase server client
- **Updated POST endpoint**:
  - Retrieves authenticated user from session using `supabase.auth.getUser()`
  - Returns 401 Unauthorized if user is not logged in
  - Automatically sets `userId` from session (server-side, secure)
  - Auto-populates `authorName` from user metadata (falls back to email)
  - Removed `authorName` from request body validation
- **Updated GET endpoints**: Changed all references from `authorId` to `userId`

### 3. Frontend Form (`src/components/note-sheet.tsx`)
- **Removed**: "Author" input field entirely from the form
- **Updated**: Form state no longer includes `authorName`
- **Result**: Cleaner UI, automatic attribution

### 4. Note Detail View (`src/components/note-detail-sheet.tsx`)
- **No changes needed**: Component only displays `authorName`, which is still populated

## Database Migration Required

### Option 1: Run the SQL Migration (Recommended)
Execute the migration file in your Supabase SQL editor:

```bash
# Location: migrations/001_add_user_id_to_notes.sql
```

This migration will:
1. Add `user_id` column
2. Migrate existing data from `author_id` to `user_id`
3. Add foreign key constraint to `auth.users`
4. Drop old `author_id` column
5. Create performance index

### Option 2: Use Drizzle Kit (if database credentials are configured)
```bash
npm run db:push
```

## Security Improvements

✅ **Server-side validation**: User ID is retrieved from the session on the server, not passed from the client

✅ **Authentication required**: Unauthenticated users cannot create notes (401 response)

✅ **No ID spoofing**: Client cannot fake or specify a different user ID

✅ **Foreign key constraint**: Database enforces referential integrity with auth.users table

## Testing Checklist

- [ ] Run the database migration in Supabase
- [ ] Verify existing notes have `user_id` populated
- [ ] Test creating a new note while logged in (should succeed)
- [ ] Test creating a note while logged out (should return 401)
- [ ] Verify notes show correct author name in the UI
- [ ] Verify notes list displays properly
- [ ] Check note detail view shows author information

## Rollback Plan

If you need to rollback:

```sql
-- Add back author_id column
ALTER TABLE notes ADD COLUMN author_id TEXT;

-- Copy user_id back to author_id
UPDATE notes SET author_id = user_id::text;

-- Make it NOT NULL
ALTER TABLE notes ALTER COLUMN author_id SET NOT NULL;

-- Drop the new column and constraint
ALTER TABLE notes DROP CONSTRAINT notes_user_id_fkey;
DROP INDEX idx_notes_user_id;
ALTER TABLE notes DROP COLUMN user_id;
```

Then revert the code changes using git.

## Notes

- **User Metadata**: The system uses `user.user_metadata.full_name` from Supabase Auth, falling back to `user.email` if no name is set
- **Author Name**: Still stored denormalized for performance (avoids joins on every query)
- **Existing Notes**: Migration preserves existing notes by copying author_id to user_id
