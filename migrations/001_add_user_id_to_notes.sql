-- Migration: Add user_id column to notes table and reference auth.users
-- This migration changes the notes table to automatically link notes to authenticated users

-- Step 1: Add the new user_id column (initially nullable)
ALTER TABLE notes ADD COLUMN user_id UUID;

-- Step 2: Migrate existing data - set user_id from existing author_id
-- Note: This assumes author_id contains valid user IDs. Adjust as needed.
-- If author_id doesn't contain valid UUIDs, you may need to set a default user or handle differently
UPDATE notes SET user_id = author_id::uuid WHERE author_id IS NOT NULL;

-- Step 3: Make user_id NOT NULL after data migration
ALTER TABLE notes ALTER COLUMN user_id SET NOT NULL;

-- Step 4: Add foreign key constraint to reference auth.users
-- Note: auth.users is the Supabase authentication table
ALTER TABLE notes ADD CONSTRAINT notes_user_id_fkey
  FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- Step 5: Drop the old author_id column (optional - keep if you need it for backwards compatibility)
ALTER TABLE notes DROP COLUMN author_id;

-- Step 6: Create an index on user_id for better query performance
CREATE INDEX idx_notes_user_id ON notes(user_id);

-- Note: The author_name column is kept for denormalized performance
-- It will be automatically populated from the user's metadata or email
