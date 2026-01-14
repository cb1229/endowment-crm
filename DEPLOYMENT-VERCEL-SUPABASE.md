# Deployment Guide: GitHub Desktop → Vercel (with Native Supabase Integration)

This guide uses Vercel's native Supabase integration, which automatically handles environment variables and setup - the simplest deployment path with all future capabilities (auth, storage, realtime).

## Why This Approach?

- **Vercel + Supabase Integration**: Environment variables added automatically
- **Future-Ready**: Auth, storage, and realtime built-in
- **Simplest Setup**: No manual environment variable configuration needed
- **Best of Both Worlds**: Vercel's simplicity + Supabase's features

## Prerequisites

- [GitHub Desktop](https://desktop.github.com/) installed
- GitHub account
- [Vercel account](https://vercel.com) (free tier)
- Node.js 18+ installed locally

**Note:** You don't need a separate Supabase account - Vercel creates it for you!

## Step 1: Push to GitHub using GitHub Desktop

### 1.1 Initialize Repository

1. Open **GitHub Desktop**
2. Click **File** → **Add Local Repository**
3. Browse to: `/Users/chrisbrady/Desktop/Claude Code/Endowment-CRM/endowment-crm`
4. If prompted "This directory does not appear to be a Git repository", click **Create a Repository**

### 1.2 Configure Repository

In the "Create a Repository" dialog:
- **Name**: `endowment-crm`
- **Description**: AI-first CRM for endowment investment teams
- **Initialize with README**: Uncheck (we already have one)
- **Git Ignore**: None (we already have .gitignore)
- **License**: MIT
- Click **Create Repository**

### 1.3 Make Initial Commit

1. GitHub Desktop will show all your files in the "Changes" tab
2. Verify the following are **NOT** in the changes list (they should be ignored by .gitignore):
   - `.env` file
   - `node_modules/` folder
   - `.next/` folder
3. In the bottom left:
   - **Summary**: `Initial commit: Database schema and MVP home page`
   - **Description** (optional): Add details about the features
4. Click **Commit to main**

### 1.4 Publish to GitHub

1. Click **Publish repository** in the top bar
2. Choose settings:
   - **Name**: `endowment-crm`
   - **Description**: AI-first CRM for endowment investment teams
   - **Keep this code private**: ✅ (Recommended for business tools)
   - **Organization**: Your personal account or organization
3. Click **Publish repository**

Your code is now on GitHub! 🎉

## Step 2: Deploy to Vercel

### 2.1 Import Project from GitHub

1. Go to [vercel.com/new](https://vercel.com/new)
2. Click **Import Git Repository**
3. Select your **GitHub** account
4. Find and select the `endowment-crm` repository
5. Click **Import**

### 2.2 Configure Project

On the import screen:
- **Framework Preset**: Next.js (auto-detected)
- **Root Directory**: `./` (keep default)
- **Build Command**: `npm run build` (auto-filled)
- **Output Directory**: `.next` (auto-filled)
- **Install Command**: `npm install` (auto-filled)

**DO NOT** add environment variables yet - we'll add the database through Vercel's integration.

Click **Deploy** to start the initial deployment.

> **Note**: This first deployment will fail because there's no database yet. That's expected!

## Step 3: Add Supabase via Vercel Integration

### 3.1 Navigate to Storage/Integrations

1. While the deployment is running (or after it fails), go to your project dashboard
2. Click the **Storage** tab at the top (or **Integrations** if you don't see Storage)
3. Look for **Supabase** in the integrations list
4. Click **Add** or **Connect**

### 3.2 Connect Supabase

1. You'll be prompted to either:
   - **Create a new Supabase project** (recommended)
   - **Link an existing Supabase project**
2. Choose **Create new project**
3. Fill in:
   - **Project name**: `endowment-crm`
   - **Database password**: Auto-generated (or set your own)
   - **Region**: Choose closest to your users
4. Click **Create & Connect**

Vercel will automatically:
- Create a new Supabase project
- Add all environment variables to your Vercel project:
  - `POSTGRES_URL`
  - `SUPABASE_URL`
  - `SUPABASE_ANON_KEY`
  - `SUPABASE_SERVICE_ROLE_KEY`
- Connect them to all environments (Production, Preview, Development)

✅ Database connected!

## Step 4: Get Connection String for Local Development

### 4.1 Find Your Connection String

1. In Vercel dashboard, go to **Settings** → **Environment Variables**
2. Find `POSTGRES_URL` (it should now be set)
3. Click **Show** to reveal the value
4. Copy the entire connection string

It will look like:
```
postgresql://postgres.xxx:password@aws-0-us-west-1.pooler.supabase.com:6543/postgres
```

### 4.2 Set Up Local Environment

On your local machine:

1. Create a `.env.local` file in your project root:

```bash
cd endowment-crm
touch .env.local
```

2. Open `.env.local` and add the connection string:

```env
POSTGRES_URL="your-connection-string-from-vercel"
```

## Step 5: Set Up Database Schema (Local)

### 5.1 Install Dependencies

```bash
npm install
```

### 5.2 Push Database Schema

Run the following command to create all tables, enums, and indexes:

```bash
npm run db:push
```

You should see:
```
✅ Changes applied successfully!
```

This creates:
- 6 tables: firms, funds, companies, notes, note_entity_tags, deals
- 4 enums: market_type, deal_stage, deal_priority, entity_type
- All indexes for performance

### 5.3 Seed Sample Data (Recommended)

Populate the database with example data:

```bash
npm run db:seed
```

This creates:
- 3 Firms (Sequoia Capital, BlackRock, Andreessen Horowitz)
- 3 Funds linked to those firms
- 3 Companies (Stripe, OpenAI, Coinbase)
- 4 Notes with entity tags demonstrating the tagging system
- 3 Deals in the pipeline

## Step 6: Verify Database in Supabase

You now have access to the Supabase dashboard through Vercel!

1. In Vercel, go to **Storage** or **Integrations** tab
2. Click on your Supabase integration
3. Click **View in Supabase** or **Open Dashboard**
4. You'll be taken to the Supabase dashboard
5. Click **Table Editor** in the sidebar
6. You should see all your tables with seeded data

## Step 7: Redeploy on Vercel

1. Go back to Vercel dashboard → **Deployments** tab
2. Click **Redeploy** on the latest deployment
3. Wait for deployment to complete (1-2 minutes)

The deployment should now succeed! ✅

## Step 8: Test Your Deployment

1. Once deployment completes, click the **Visit** button or open your URL: `https://endowment-crm-xxx.vercel.app`
2. You should see the home page with the "Recent Intelligence" feed
3. Test the market type filter tabs:
   - **All Markets**: Should show 4 notes
   - **Private Markets**: Should show 3 notes (Sequoia, a16z related)
   - **Public Markets**: Should show 1 note (BlackRock related)

If you see the notes and filtering works, you're live! 🎉

## Step 9: Test Local Development

1. Make sure `.env.local` has the connection string
2. Run the dev server:

```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000)
4. You should see the same data as production

## Ongoing Workflow

### Making Changes

1. Edit your code locally
2. Test locally with `npm run dev`
3. Commit changes in GitHub Desktop
4. Push to GitHub
5. Vercel automatically deploys (1-2 minutes)

### Environment Variables

All environment variables are automatically managed by Vercel's Supabase integration. If you need to update them:

1. Go to Project Settings → Environment Variables
2. Edit the values
3. Redeploy

### Database Schema Changes

When you modify the schema in `src/db/schema.ts`:

1. Run locally: `npm run db:push`
2. Commit and push to GitHub
3. Vercel will deploy with the new schema

## Future Features (Built into Supabase)

### Authentication (Phase 3)

Your Supabase project already has auth enabled:

1. Access Supabase dashboard through Vercel
2. Go to **Authentication** tab
3. Configure providers (email, Google, GitHub, etc.)
4. Use Supabase Auth SDK in your Next.js app

**Environment variables already set:**
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`

**Resources:**
- [Supabase Auth + Next.js](https://supabase.com/docs/guides/auth/auth-helpers/nextjs)

### Storage (Phase 3+)

1. In Supabase dashboard → **Storage**
2. Create buckets for files (documents, images, etc.)
3. Use Supabase Storage SDK
4. Store meeting recordings, pitch decks, documents

**Resources:**
- [Supabase Storage](https://supabase.com/docs/guides/storage)

### Realtime (Phase 3)

1. Enable realtime on specific tables
2. Subscribe to changes in React components
3. Build live activity feeds

**Resources:**
- [Supabase Realtime](https://supabase.com/docs/guides/realtime)

## Project Structure

```
endowment-crm/
├── src/
│   ├── app/
│   │   ├── api/notes/          # Notes API endpoints
│   │   ├── page.tsx            # Home page with feed
│   │   ├── layout.tsx          # Root layout
│   │   └── globals.css         # Global styles
│   ├── components/
│   │   ├── ui/                 # Shadcn components
│   │   └── note-card.tsx       # Note display
│   ├── db/
│   │   ├── schema.ts           # Database schema
│   │   ├── index.ts            # DB connection
│   │   └── seed.ts             # Seed data
│   └── lib/
│       ├── utils.ts            # Utilities
│       └── date-utils.ts       # Date formatting
├── .env.local                  # Local env vars (not committed)
└── .gitignore                  # Ignores .env files
```

## Troubleshooting

### "Module not found" errors on Vercel
- Verify all files are committed to GitHub
- Check `package.json` includes all dependencies
- Try running `npm run build` locally first

### Database connection errors locally
- Verify `POSTGRES_URL` is in `.env.local`
- Check the connection string is correct (copied from Vercel)
- Try `npm run db:push` again

### Build fails on Vercel
- Check deployment logs in Vercel dashboard
- Verify environment variables are set (Settings → Environment Variables)
- Make sure Supabase integration is connected

### No notes showing
- Run `npm run db:seed` to add sample data
- Check Supabase Table Editor to verify data exists
- Check browser console for API errors

## Available Commands

```bash
# Local development
npm run dev              # Start dev server
npm run build            # Test production build
npm run start            # Start production server
npm run lint             # Run ESLint

# Database operations
npm run db:push          # Push schema to database
npm run db:studio        # Open Drizzle Studio (DB GUI)
npm run db:seed          # Seed sample data
npm run db:generate      # Generate migrations
```

## Cost Breakdown (Free Tier)

**Supabase (via Vercel):**
- 500 MB database space
- 1 GB file storage
- 50,000 monthly active users
- Unlimited API requests
- Perfect for MVP

**Vercel:**
- 100 GB bandwidth/month
- Unlimited deployments
- Automatic HTTPS
- Serverless functions included

Both services are free for your use case! 🎉

## Next Steps

Now that you're deployed:

1. ✅ Database schema created
2. ✅ Recent Intelligence feed working
3. ✅ Market type filtering functional
4. Next: Entity detail pages (Firms, Funds, Companies)
5. Next: Pipeline Kanban view
6. Future: Add authentication using Supabase Auth

## Security Checklist

- [ ] `.env.local` is in `.gitignore` (already configured)
- [ ] Repository is private on GitHub
- [ ] Strong database password set
- [ ] Consider enabling Row Level Security (RLS) in Supabase before production
- [ ] Enable 2FA on GitHub and Vercel accounts

---

**You're all set!** Your CRM is deployed with a powerful, scalable database that's ready to grow with your needs.

Next, we can build the entity detail pages and pipeline views. Ready to continue?
