# Quick Start Checklist (Supabase Version)

Use this checklist when deploying your Endowment CRM to GitHub + Vercel + Supabase.

## Pre-Deployment Checklist

- [ ] Verify `.gitignore` includes `.env` and `.env.local`
- [ ] Verify `node_modules/` and `.next/` are in `.gitignore`
- [ ] Do NOT create a `.env` file yet

## Step 1: Push to GitHub (via GitHub Desktop)

- [ ] Open GitHub Desktop
- [ ] Add local repository: `/Users/chrisbrady/Desktop/Claude Code/Endowment-CRM/endowment-crm`
- [ ] Review changes (should see all files except `.env`, `node_modules`, `.next`)
- [ ] Commit with message: "Initial commit: Database schema and MVP home page"
- [ ] Click "Publish repository"
- [ ] Choose "Keep this code private" ✅
- [ ] Publish to GitHub

✅ Your code is now on GitHub!

## Step 2: Create Supabase Database

- [ ] Go to [supabase.com](https://supabase.com)
- [ ] Sign in with GitHub
- [ ] Click "New project"
- [ ] Name: `endowment-crm`
- [ ] Generate strong database password (SAVE THIS!)
- [ ] Choose region close to you
- [ ] Click "Create new project"
- [ ] Wait 2-3 minutes for provisioning

### Get Connection String

- [ ] Go to Project Settings → Database
- [ ] Find "Connection string" section
- [ ] Select "URI" tab
- [ ] Copy connection string
- [ ] Replace `[YOUR-PASSWORD]` with your database password
- [ ] Save this URL somewhere safe

Example format:
```
postgresql://postgres:your-password@db.xxx.supabase.co:5432/postgres
```

✅ Database created!

## Step 3: Deploy to Vercel

- [ ] Go to [vercel.com/new](https://vercel.com/new)
- [ ] Click "Import Git Repository"
- [ ] Select your GitHub account
- [ ] Find and import `endowment-crm`

### Add Environment Variable

- [ ] Expand "Environment Variables" section
- [ ] Name: `POSTGRES_URL`
- [ ] Value: Your Supabase connection string
- [ ] Select all environments (Production, Preview, Development)
- [ ] Click "Deploy"

✅ App deployed (may fail initially - that's OK!)

## Step 4: Set Up Database Schema (Local)

On your local machine:

- [ ] Open terminal in project folder
- [ ] Run: `npm install`
- [ ] Create `.env.local` file
- [ ] Add: `POSTGRES_URL="your-supabase-url-here"`
- [ ] Run: `npm run db:push`
- [ ] See "✅ Changes applied successfully!"
- [ ] Run: `npm run db:seed` (optional but recommended)

✅ Database tables created and seeded!

## Step 5: Verify in Supabase

- [ ] Go to Supabase dashboard
- [ ] Click "Table Editor"
- [ ] See all tables: firms, funds, companies, notes, etc.
- [ ] Click into tables to see seeded data

## Step 6: Redeploy Vercel (if needed)

- [ ] Go to Vercel dashboard → Deployments
- [ ] If initial deployment failed, click "Redeploy"
- [ ] Wait for deployment to complete

✅ App is now live!

## Step 7: Test Deployment

- [ ] Open your Vercel URL (e.g., `endowment-crm-xxx.vercel.app`)
- [ ] Verify home page loads
- [ ] Test "All Markets" tab (should show 4 notes)
- [ ] Test "Private Markets" tab (should show 3 notes)
- [ ] Test "Public Markets" tab (should show 1 note)

✅ Everything working!

## Local Development

- [ ] Run: `npm run dev`
- [ ] Open: http://localhost:3000
- [ ] Verify app works locally

## What You Should See

If seeded correctly:
- **All Markets**: 4 notes
- **Private Markets**: 3 notes (Sequoia/a16z related)
- **Public Markets**: 1 note (BlackRock related)

## Troubleshooting

### Build fails on Vercel
- Check deployment logs
- Verify `POSTGRES_URL` is set in Vercel env vars
- Try running `npm run build` locally first

### Database connection errors
- Verify password in connection string is correct
- Check you're using the URI format (not pooler)
- Try `npm run db:push` again

### No notes showing
- Run `npm run db:seed` to add sample data
- Check Supabase Table Editor to verify data exists

## Future Features Ready to Use

When you're ready, Supabase includes:

**Authentication:**
- Supabase dashboard → Authentication
- Multiple auth providers ready
- Row Level Security for permissions

**Storage:**
- Supabase dashboard → Storage
- File uploads for documents
- Meeting recordings, pitch decks

**Realtime:**
- Enable realtime on tables
- Live activity feeds
- Collaborative features

## Next Development Steps

After successful deployment:
1. Entity detail pages (Firms, Funds, Companies)
2. Pipeline Kanban view
3. Create/edit notes UI
4. Global search
5. Authentication (when ready)

---

**Reference Docs:**
- Full deployment guide: [DEPLOYMENT-SUPABASE.md](./DEPLOYMENT-SUPABASE.md)
- Schema details: [SCHEMA.md](./SCHEMA.md)
- Main README: [README.md](./README.md)
