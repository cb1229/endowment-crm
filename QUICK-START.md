# Quick Start Checklist

Use this checklist when deploying your Endowment CRM to GitHub + Vercel.

## Pre-Deployment Checklist

- [ ] Verify `.gitignore` includes `.env` and `.env.local`
- [ ] Verify `node_modules/` and `.next/` are in `.gitignore`
- [ ] Do NOT create a `.env` file yet (will get from Vercel)

## Step 1: Push to GitHub (via GitHub Desktop)

- [ ] Open GitHub Desktop
- [ ] Add local repository: `/Users/chrisbrady/Desktop/Claude Code/Endowment-CRM/endowment-crm`
- [ ] Review changes (should see all files except `.env`, `node_modules`, `.next`)
- [ ] Commit with message: "Initial commit: Database schema and MVP home page"
- [ ] Click "Publish repository"
- [ ] Choose "Keep this code private" ✅
- [ ] Publish to GitHub

✅ Your code is now on GitHub!

## Step 2: Deploy to Vercel

- [ ] Go to [vercel.com/new](https://vercel.com/new)
- [ ] Click "Import Git Repository"
- [ ] Select your GitHub account
- [ ] Find and import `endowment-crm`
- [ ] Click "Deploy" (first deployment will fail - that's OK!)

## Step 3: Add Database

- [ ] In Vercel project, click **Storage** tab
- [ ] Click **Create Database**
- [ ] Select **Postgres**
- [ ] Name it: `endowment-crm-db`
- [ ] Select region close to you
- [ ] Click **Create**

✅ Environment variables automatically added!

## Step 4: Set Up Database Schema (Local)

On your local machine:

- [ ] In Vercel dashboard → Storage → Settings, copy `POSTGRES_URL`
- [ ] Create `.env.local` in project root
- [ ] Paste: `POSTGRES_URL="your-url-here"`
- [ ] Run: `npm install`
- [ ] Run: `npm run db:push`
- [ ] (Optional) Run: `npm run db:seed`

✅ Database tables created!

## Step 5: Redeploy

- [ ] In Vercel → Deployments tab
- [ ] Click "Redeploy" on latest deployment

✅ App is now live!

## Step 6: Test

- [ ] Open your Vercel URL
- [ ] Verify home page loads
- [ ] Test market type filter tabs
- [ ] (If seeded) Verify notes appear and filter correctly

## What You Should See

If seeded, you should see:
- 4 notes in "All Markets"
- 3 notes in "Private Markets" (Sequoia, a16z related)
- 1 note in "Public Markets" (BlackRock related)

## Troubleshooting

**Build fails on Vercel:**
- Check deployment logs in Vercel dashboard
- Verify all files are committed to GitHub
- Try running `npm run build` locally first

**Database connection errors:**
- Verify `POSTGRES_URL` is in `.env.local`
- Verify database was created in Vercel Storage
- Try `npm run db:push` again

**No notes showing:**
- You need to seed the database: `npm run db:seed`
- Or manually create notes in the app (once we build that feature)

## Next Development Steps

After successful deployment:
1. Entity detail pages (Firms, Funds, Companies)
2. Pipeline Kanban view
3. Global search
4. Create/edit notes UI

---

**Reference Docs:**
- Full deployment guide: [DEPLOYMENT.md](./DEPLOYMENT.md)
- Schema details: [SCHEMA.md](./SCHEMA.md)
- Main README: [README.md](./README.md)
