# Deployment Checklist: Hybrid Author Attribution

## Pre-Deployment

- [x] Code changes committed
- [ ] Pushed to GitHub
- [ ] Migration SQL ready

## Step 1: Push to GitHub

```bash
git push
```

Or use GitHub Desktop to push the latest commit.

## Step 2: Run Migration in Production Supabase

1. Go to your Supabase project dashboard (production)
2. Navigate to **SQL Editor**
3. Copy and paste the contents of `migrations/002_hybrid_author_attribution.sql`
4. **IMPORTANT**: Verify your user UUID in the backfill section (line 61-68)
5. Click **Run** to execute the migration

## Step 3: Verify Migration Success

In Supabase SQL Editor, run these verification queries:

```sql
-- Check profiles table exists and has your profile
SELECT * FROM public.profiles;

-- Check notes have new columns
SELECT id, title, author_id, original_author_name
FROM notes
LIMIT 5;

-- Verify trigger exists
SELECT trigger_name
FROM information_schema.triggers
WHERE trigger_name = 'on_auth_user_created';
```

Expected results:
- ✅ Your profile appears in profiles table
- ✅ Existing notes have author_id populated
- ✅ All notes have original_author_name
- ✅ Trigger is listed

## Step 4: Wait for Vercel Deployment

Vercel will automatically detect the push and start building. Check:
- Vercel dashboard for build progress
- Build should succeed (no TypeScript errors)
- Deployment should go live

## Step 5: Test in Production

1. **Test Live Updates:**
   - Create a new note
   - Verify it appears with your name

2. **Test Author Display:**
   - Check existing notes show correct author
   - Verify notes list loads without errors

3. **Test Profile Update (Optional):**
   ```sql
   UPDATE profiles
   SET full_name = 'Your New Name'
   WHERE id = 'your-uuid';
   ```
   - Refresh app
   - Notes should show new name

## Rollback Plan (If Needed)

If something goes wrong, you can rollback:

```sql
-- Remove new columns
ALTER TABLE notes DROP COLUMN author_id;
ALTER TABLE notes DROP COLUMN original_author_name;

-- Remove trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Drop profiles table
DROP TABLE IF EXISTS public.profiles;
```

Then revert the code commit and redeploy.

## Troubleshooting

### Error: "column author_id does not exist"
- Migration didn't run successfully
- Re-run the migration script

### Error: "relation profiles does not exist"
- Profiles table wasn't created
- Check if migration ran completely

### Notes show "null" for author
- Profile wasn't backfilled correctly
- Run the backfill section of migration again

### Build fails with TypeScript errors
- Pull latest changes
- Verify all imports include `profiles`
- Check schema exports

## Success Criteria

✅ Migration executes without errors
✅ Profiles table populated with your user
✅ Existing notes have author_id and original_author_name
✅ New notes create successfully
✅ Author names display correctly
✅ Vercel build succeeds
✅ Production app loads without errors
