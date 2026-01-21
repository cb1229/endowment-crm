-- Migration 002: Hybrid Author Attribution System
-- This migration creates a profiles table and updates notes to support
-- both live user updates and historical preservation

-- ============================================================================
-- PART 1: Create the Profiles Table (Source of Truth for User Data)
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  email TEXT NOT NULL,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);

-- Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Users can read all profiles but only update their own
CREATE POLICY "Public profiles are viewable by everyone"
  ON public.profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- ============================================================================
-- PART 2: Create Trigger to Auto-Create Profiles on User Signup
-- ============================================================================

-- Function to handle new user creation
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

-- Trigger to call the function on new user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================================
-- PART 3: Backfill Profile for Existing User
-- ============================================================================

-- Insert profile for your existing user (update email if different)
INSERT INTO public.profiles (id, email, full_name)
VALUES (
  'e17b451a-4302-49c7-9c3a-98874360223e',
  (SELECT email FROM auth.users WHERE id = 'e17b451a-4302-49c7-9c3a-98874360223e'),
  (SELECT COALESCE(raw_user_meta_data->>'full_name', email) FROM auth.users WHERE id = 'e17b451a-4302-49c7-9c3a-98874360223e')
)
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  full_name = EXCLUDED.full_name;

-- ============================================================================
-- PART 4: Update Notes Table Schema
-- ============================================================================

-- Add new columns to notes table
ALTER TABLE notes ADD COLUMN IF NOT EXISTS author_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL;
ALTER TABLE notes ADD COLUMN IF NOT EXISTS original_author_name TEXT;

-- Backfill data: Set author_id and original_author_name from existing data
UPDATE notes
SET
  author_id = 'e17b451a-4302-49c7-9c3a-98874360223e',
  original_author_name = COALESCE(author_name, 'Unknown')
WHERE author_id IS NULL;

-- Make original_author_name NOT NULL after backfill
ALTER TABLE notes ALTER COLUMN original_author_name SET NOT NULL;

-- Create index on author_id for better join performance
CREATE INDEX IF NOT EXISTS idx_notes_author_id ON notes(author_id);

-- ============================================================================
-- PART 5: Optional Cleanup (Run after verifying everything works)
-- ============================================================================

-- After confirming the migration works, you can drop the old columns:
-- ALTER TABLE notes DROP COLUMN IF EXISTS user_id;
-- ALTER TABLE notes DROP COLUMN IF EXISTS author_name;

-- Note: We're keeping these columns for now to maintain backward compatibility
-- You can remove them in a future migration after updating all code references
