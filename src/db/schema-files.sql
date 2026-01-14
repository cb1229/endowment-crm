-- File attachments table
-- This links files stored in Supabase Storage to entities and notes

CREATE TABLE IF NOT EXISTS file_attachments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL, -- Path in Supabase Storage
  file_size BIGINT NOT NULL, -- Size in bytes
  file_type TEXT NOT NULL, -- MIME type
  entity_type TEXT, -- 'firm', 'fund', 'company', or NULL if attached to note
  entity_id UUID, -- ID of the entity
  note_id UUID, -- ID of the note if attached to a note
  uploaded_by TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Ensure at least one association exists
  CONSTRAINT check_has_association CHECK (
    (entity_type IS NOT NULL AND entity_id IS NOT NULL) OR
    (note_id IS NOT NULL)
  )
);

-- Create indexes for faster lookups
CREATE INDEX IF NOT EXISTS idx_file_attachments_entity ON file_attachments(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_file_attachments_note ON file_attachments(note_id);
CREATE INDEX IF NOT EXISTS idx_file_attachments_created ON file_attachments(created_at DESC);

-- Add foreign key relationships (optional, depends on your schema)
-- ALTER TABLE file_attachments ADD FOREIGN KEY (note_id) REFERENCES notes(id) ON DELETE CASCADE;
