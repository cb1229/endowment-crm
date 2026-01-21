# Hybrid Author Attribution System

## Overview

This system implements a "Hybrid Dynamic + Historic" pattern for note authorship that:
- **Updates Live**: When a user changes their name, it appears updated everywhere
- **Preserves History**: If a user is deleted, their historical name is preserved

## Architecture

### Database Schema

#### 1. `profiles` Table (Source of Truth)
```sql
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  email TEXT NOT NULL,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);
```

**Key Features:**
- Automatically created via trigger when users sign up
- Can be updated independently from auth.users
- Deleted when auth user is deleted (CASCADE)

#### 2. Updated `notes` Table
```sql
ALTER TABLE notes ADD COLUMN author_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL;
ALTER TABLE notes ADD COLUMN original_author_name TEXT NOT NULL;
```

**Key Fields:**
- `author_id`: Live reference to profiles (nullable, set to NULL on delete)
- `original_author_name`: Snapshot of author's name at note creation time
- `user_id`: Legacy field (kept for backward compatibility)

### Auto-Creation Trigger

A Postgres trigger automatically creates profile entries:

```sql
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

## Logic Implementation

### Write Logic (Creating a Note)

When a note is created:
1. Get or create the user's profile
2. Extract current display name from profile
3. Save **BOTH**:
   - `author_id`: Link to live profile
   - `original_author_name`: Snapshot of current name

**Code Example:**
```typescript
// Get profile
let [profile] = await db
  .select()
  .from(profiles)
  .where(eq(profiles.id, user.id))
  .limit(1);

// Create note with dual attribution
const [newNote] = await db
  .insert(notes)
  .values({
    title,
    content,
    authorId: profile.id, // Live reference
    originalAuthorName: profile.fullName || profile.email, // Snapshot
    // ... other fields
  })
  .returning();
```

### Read Logic (Displaying Notes)

When fetching notes, we join with profiles and use COALESCE:

```typescript
const selectWithAuthor = {
  id: notes.id,
  title: notes.title,
  content: notes.content,
  // Display name: live profile OR historical snapshot
  authorName: sql<string>`COALESCE(${profiles.fullName}, ${notes.originalAuthorName})`,
  // ... other fields
};

const allNotes = await db
  .select(selectWithAuthor)
  .from(notes)
  .leftJoin(profiles, eq(notes.authorId, profiles.id))
  .orderBy(desc(notes.createdAt));
```

**Display Rule:**
- If `profiles.full_name` exists → Show current name (live update)
- If `profiles.full_name` is NULL (user deleted) → Show `original_author_name` (historical)

## Migration Instructions

### Step 1: Run the SQL Migration

Navigate to your Supabase SQL Editor and run:
```bash
migrations/002_hybrid_author_attribution.sql
```

This will:
1. Create the `profiles` table
2. Set up RLS policies
3. Create the auto-creation trigger
4. Backfill your existing user profile
5. Update the `notes` table schema
6. Migrate existing data

### Step 2: Verify in Supabase Dashboard

1. Check that `public.profiles` table exists
2. Verify your profile was created
3. Confirm trigger is active in Database → Triggers
4. Check existing notes have `author_id` and `original_author_name`

### Step 3: Deploy Code Changes

The following files have been updated:
- `src/db/schema.ts` - Added profiles table and updated notes schema
- `src/app/api/notes/route.ts` - Updated create/read logic
- `src/app/api/companies/[id]/route.ts` - Updated to join profiles
- `src/app/api/firms/[id]/route.ts` - Updated to join profiles
- `src/app/api/funds/[id]/route.ts` - Updated to join profiles

Commit and push these changes to trigger a Vercel deployment.

## Testing the System

### Test 1: Live Updates
1. Create a note
2. Update your profile name in Supabase: `UPDATE profiles SET full_name = 'New Name' WHERE id = 'your-uuid'`
3. Refresh the app - note should show updated name

### Test 2: Historical Preservation
1. Create a test user and note
2. Delete the user from auth.users
3. The note should still display with the original author name

## Benefits

✅ **Live Updates**: User name changes propagate automatically
✅ **Data Preservation**: Deleted users don't break historical records
✅ **Performance**: Single LEFT JOIN adds minimal overhead
✅ **Backward Compatible**: Legacy fields preserved during transition
✅ **Auto-Creation**: New users get profiles automatically via trigger

## Future Cleanup (Optional)

After verifying everything works, you can remove legacy fields:

```sql
ALTER TABLE notes DROP COLUMN user_id;
ALTER TABLE notes DROP COLUMN author_name;
```

This is optional and can be done in a future migration.
