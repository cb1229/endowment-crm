# GitHub Desktop Workflow

This guide explains how to commit and push changes to GitHub using GitHub Desktop.

## Current Status

You have:
- ✅ All code files created
- ✅ Database schema defined
- ✅ Supabase connected in Vercel
- ✅ Project ready to commit

## Step 1: Open GitHub Desktop

1. Launch **GitHub Desktop**
2. Make sure you're viewing the `endowment-crm` repository
   - If not, click "Current Repository" dropdown and select it
   - If you don't see it, click **File** → **Add Local Repository**
   - Browse to: `/Users/chrisbrady/Desktop/Claude Code/Endowment-CRM/endowment-crm`

## Step 2: Review Changes

In GitHub Desktop, you should see changes to these files:

### Files That SHOULD Be Changed:
- ✅ `src/db/schema.ts` (Database schema)
- ✅ `src/db/index.ts` (Database connection)
- ✅ `src/db/seed.ts` (Seed data)
- ✅ `src/app/page.tsx` (Home page)
- ✅ `src/app/layout.tsx` (Layout)
- ✅ `src/app/api/notes/route.ts` (API routes)
- ✅ `src/components/note-card.tsx` (Components)
- ✅ `package.json` (Dependencies)
- ✅ `README.md` (Updated docs)
- ✅ `.env.example` (Updated)
- ✅ All other project files

### Files That Should NOT Be Changed:
- ❌ `.env` (Should not exist)
- ❌ `.env.local` (Should be ignored by git)
- ❌ `node_modules/` (Should be ignored)
- ❌ `.next/` (Should be ignored)

## Step 3: Verify .gitignore is Working

Before committing, check that sensitive files are ignored:

1. Look at the "Changes" list in GitHub Desktop
2. **Make sure you DO NOT see:**
   - `.env.local` file
   - `node_modules` folder
   - `.next` folder

If you see any of these, STOP and verify your `.gitignore` file is correct.

## Step 4: Make Your Initial Commit

1. In the bottom-left corner of GitHub Desktop, you'll see:
   - **Summary** field (required)
   - **Description** field (optional)

2. Fill in the commit message:
   - **Summary**: `Initial commit: Endowment CRM MVP with database schema`
   - **Description** (optional):
     ```
     - Database schema with Drizzle ORM
     - Home page with Recent Intelligence feed
     - Market type filtering (All/Public/Private)
     - API routes for notes
     - Supabase integration ready
     - Complete deployment documentation
     ```

3. Click **Commit to main**

## Step 5: Publish to GitHub

### If This is Your First Commit:

1. You'll see a button **"Publish repository"**
2. Click it
3. In the dialog:
   - **Name**: `endowment-crm` (should be pre-filled)
   - **Description**: `AI-first CRM for endowment investment teams`
   - **Keep this code private**: ✅ **Check this box**
   - **Organization**: Select your account or organization
4. Click **Publish repository**

### If Repository Already Exists:

1. You'll see a button **"Push origin"** in the top bar
2. Click it
3. Your changes will be pushed to GitHub

## Step 6: Verify on GitHub

1. Go to [github.com](https://github.com)
2. Navigate to your repository
3. You should see all your files
4. Verify `.env.local` is **NOT** visible (it should be gitignored)

## Step 7: Automatic Vercel Deployment

Once you push to GitHub:
1. Vercel automatically detects the push
2. Starts a new deployment (takes 1-2 minutes)
3. Check Vercel dashboard to see deployment progress

## Ongoing Workflow

Every time you make changes:

### 1. Make Changes Locally
- Edit files in your code editor
- Test with `npm run dev`

### 2. Review in GitHub Desktop
- Open GitHub Desktop
- See all changed files
- Review the diffs (click on files to see changes)

### 3. Commit Changes
- Write descriptive commit message
- Click "Commit to main"

### 4. Push to GitHub
- Click "Push origin"
- Vercel auto-deploys

### 5. Verify Deployment
- Check Vercel dashboard
- Test live site

## Useful GitHub Desktop Features

### See File Changes
- Click on any file in the changes list
- See line-by-line diffs
- Green = added, Red = removed

### Discard Changes
- Right-click a file
- Select "Discard Changes"
- Useful if you want to undo changes

### View History
- Click "History" tab
- See all past commits
- Click any commit to see what changed

### Create Branches (Future)
- Click "Current Branch" dropdown
- Click "New Branch"
- Useful for feature development

## Common Scenarios

### Scenario 1: First Time Setup

```
1. Open GitHub Desktop
2. Add local repository
3. Review changes
4. Commit: "Initial commit: Endowment CRM MVP"
5. Publish repository (keep private)
6. Vercel auto-deploys
```

### Scenario 2: Regular Development

```
1. Edit code locally
2. Test with npm run dev
3. Open GitHub Desktop
4. Review changes
5. Commit: "Add entity detail pages"
6. Push origin
7. Vercel auto-deploys
```

### Scenario 3: Fix a Bug

```
1. Fix bug locally
2. Test the fix
3. Open GitHub Desktop
4. Commit: "Fix: Resolve market filter not updating"
5. Push origin
6. Vercel auto-deploys fixed version
```

## Best Practices

### Commit Messages

**Good commit messages:**
- ✅ "Add pipeline Kanban view"
- ✅ "Fix: Market filter not working on mobile"
- ✅ "Update: Improve note card styling"
- ✅ "Add entity detail pages for firms and funds"

**Bad commit messages:**
- ❌ "Update"
- ❌ "Changes"
- ❌ "Fix stuff"
- ❌ "asdfasdf"

### When to Commit

**Commit when you:**
- ✅ Complete a feature
- ✅ Fix a bug
- ✅ Add documentation
- ✅ Refactor code
- ✅ Make the code better in any meaningful way

**Don't commit when:**
- ❌ Code doesn't work
- ❌ Tests are failing
- ❌ You're in the middle of something
- ❌ Just to save (use git stash or just don't commit yet)

### What to Commit

**Always commit:**
- ✅ Source code
- ✅ Configuration files
- ✅ Documentation
- ✅ Package.json changes

**Never commit:**
- ❌ `.env` or `.env.local` files
- ❌ `node_modules/` folder
- ❌ Build artifacts (`.next/` folder)
- ❌ API keys or secrets
- ❌ Large binary files

## Troubleshooting

### "Repository not found" error

- Make sure you've published the repository first
- Check you're logged into the correct GitHub account

### Changes not showing in GitHub Desktop

- Make sure you've saved files in your editor
- Try refreshing: Repository → Refresh
- Close and reopen GitHub Desktop

### Can't push - "Failed to push"

- Check your internet connection
- Make sure you have permission to push to the repo
- Try: Repository → Pull (to sync first, then push)

### Accidentally committed .env.local

If you accidentally committed sensitive files:
1. **Don't panic**
2. Remove from git: `git rm --cached .env.local`
3. Commit: "Remove sensitive file"
4. Push to GitHub
5. **Immediately rotate any API keys/passwords** that were exposed

### Need to undo last commit

In GitHub Desktop:
1. Go to History tab
2. Right-click the last commit
3. Select "Revert changes in commit"

Or from terminal:
```bash
git reset --soft HEAD~1  # Undo commit but keep changes
git reset --hard HEAD~1  # Undo commit and discard changes (careful!)
```

## Next Steps

After your first commit and push:

1. ✅ Code is on GitHub
2. ✅ Vercel auto-deploys
3. ⏭️ Follow ENV-SETUP.md to set up local environment
4. ⏭️ Run `npm run db:push` and `npm run db:seed`
5. ⏭️ Start building entity detail pages and pipeline view

---

**You're all set!** From now on, it's just: code → commit → push → auto-deploy. 🚀
