# Deployment Guide: GitHub Desktop → Vercel (with Supabase)

This guide walks you through deploying the Endowment CRM using GitHub Desktop, Vercel, and Supabase for the database (with future auth, storage, and realtime capabilities).

## Why Supabase?

This guide uses Supabase instead of Vercel Postgres because your roadmap includes:
- **Authentication** (user login, team permissions)
- **Storage** (file uploads, documents)
- **Realtime** (live activity feeds, collaborative features)

Supabase provides all of these out-of-the-box, while Vercel Postgres only provides the database.

## Prerequisites

- [GitHub Desktop](https://desktop.github.com/) installed
- GitHub account
- [Vercel account](https://vercel.com) (free tier)
- [Supabase account](https://supabase.com) (free tier)
- Node.js 18+ installed locally

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

## Step 2: Create Supabase Database

### 2.1 Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Click **Start your project**
3. Sign in with GitHub (recommended)
4. Click **New project**
5. Choose your organization (or create one)
6. Fill in project details:
   - **Name**: `endowment-crm`
   - **Database Password**: Generate a strong password (save this!)
   - **Region**: Choose closest to your users (e.g., US West, US East, Europe)
   - **Pricing Plan**: Free (perfect for MVP)
7. Click **Create new project**

Wait 2-3 minutes while Supabase provisions your database.

### 2.2 Get Connection String

1. Once the project is ready, go to **Project Settings** (gear icon in sidebar)
2. Click **Database** in the left menu
3. Scroll to **Connection string** section
4. Select **URI** tab
5. Copy the connection string (looks like: `postgresql://postgres:[YOUR-PASSWORD]@...`)
6. Replace `[YOUR-PASSWORD]` with the database password you created earlier

**Example:**
```
postgresql://postgres:your-password-here@db.abcdefghijk.supabase.co:5432/postgres
```

Save this connection string - you'll need it in the next steps!

### 2.3 (Optional) Explore Supabase Dashboard

While you're here, note these tabs for future use:
- **Table Editor**: Visual database browser (we'll use Drizzle Studio instead)
- **Authentication**: User management (Phase 3)
- **Storage**: File uploads (Phase 3)
- **Database**: SQL editor, connection info

## Step 3: Deploy to Vercel

### 3.1 Import Project from GitHub

1. Go to [vercel.com/new](https://vercel.com/new)
2. Click **Import Git Repository**
3. Select your **GitHub** account
4. Find and select the `endowment-crm` repository
5. Click **Import**

### 3.2 Configure Project

On the import screen:
- **Framework Preset**: Next.js (auto-detected)
- **Root Directory**: `./` (keep default)
- **Build Command**: `npm run build` (auto-filled)
- **Output Directory**: `.next` (auto-filled)
- **Install Command**: `npm install` (auto-filled)

### 3.3 Add Environment Variables

Before deploying, add your database connection:

1. Expand **Environment Variables** section
2. Add the following:
   - **Name**: `POSTGRES_URL`
   - **Value**: Your Supabase connection string from Step 2.2
3. Select all environments: Production, Preview, Development

Click **Deploy** to start the deployment.

> **Note**: This first deployment might fail if the database tables don't exist yet. We'll create them in the next step.

## Step 4: Set Up Database Schema (Local)

Now we need to create the tables. You'll do this from your local machine:

### 4.1 Install Dependencies

```bash
cd endowment-crm
npm install
```

### 4.2 Configure Local Environment

Create a `.env.local` file in your project root:

```bash
touch .env.local
```

Open `.env.local` and add your Supabase connection string:

```env
POSTGRES_URL="postgresql://postgres:your-password@db.xxx.supabase.co:5432/postgres"
```

### 4.3 Push Database Schema

Run the following command to create all tables, enums, and indexes:

```bash
npm run db:push
```

You should see:
```
✅ Changes applied successfully!
```

### 4.4 Seed Sample Data (Optional but Recommended)

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

### 4.5 Verify in Supabase

1. Go back to your Supabase dashboard
2. Click **Table Editor** in the sidebar
3. You should see all your tables: `firms`, `funds`, `companies`, `notes`, etc.
4. Click into any table to see the seeded data

## Step 5: Redeploy on Vercel

1. Go back to Vercel dashboard → **Deployments** tab
2. If the initial deployment failed, click **Redeploy**
3. If it succeeded, you can skip this step

The deployment should now succeed! ✅

## Step 6: Test Your Deployment

1. Once deployment completes, Vercel will show you a URL: `https://endowment-crm-xxx.vercel.app`
2. Click the URL to open your live app
3. You should see the home page with the "Recent Intelligence" feed
4. Test the market type filter tabs:
   - **All Markets**: Should show 4 notes
   - **Private Markets**: Should show 3 notes (Sequoia, a16z related)
   - **Public Markets**: Should show 1 note (BlackRock related)

## Step 7: Local Development Setup

To work on the app locally:

1. Your `.env.local` is already configured with the Supabase connection
2. Run the dev server:

```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000)
4. You should see the same data as your production deployment

## Ongoing Workflow

### Making Changes

1. Edit your code locally
2. Test locally with `npm run dev`
3. Commit changes in GitHub Desktop
4. Push to GitHub
5. Vercel automatically deploys (usually takes 1-2 minutes)

### Environment Variables

Your `POSTGRES_URL` is already set in Vercel. If you need to update it:

1. Go to Project Settings → Environment Variables
2. Find `POSTGRES_URL`
3. Click edit, update the value
4. Redeploy

## Future Features (Built into Supabase)

When you're ready to add these features, they're already available:

### Authentication (Phase 3)

1. In Supabase dashboard → **Authentication**
2. Configure providers (email, Google, GitHub, etc.)
3. Use Supabase Auth SDK in your Next.js app
4. Implement Row Level Security (RLS) for team permissions

**Resources:**
- [Supabase Auth + Next.js](https://supabase.com/docs/guides/auth/auth-helpers/nextjs)

### Storage (Phase 3+)

1. In Supabase dashboard → **Storage**
2. Create buckets for different file types
3. Use Supabase Storage SDK to upload files
4. Store meeting recordings, pitch decks, documents

**Resources:**
- [Supabase Storage](https://supabase.com/docs/guides/storage)

### Realtime (Phase 3)

1. Enable realtime on specific tables
2. Subscribe to changes in your React components
3. Build live activity feeds, collaborative editing

**Resources:**
- [Supabase Realtime](https://supabase.com/docs/guides/realtime)

## Troubleshooting

### "Module not found" errors on Vercel
- Make sure you committed all files to GitHub
- Check that `package.json` includes all dependencies
- Try a fresh deployment

### Database connection errors
- Verify the `POSTGRES_URL` is correct in `.env.local`
- Check that you replaced `[YOUR-PASSWORD]` in the connection string
- Verify your IP isn't blocked (Supabase allows all IPs by default)
- Try `npm run db:push` again

### Build fails on Vercel
- Check the deployment logs in Vercel dashboard
- Verify `npm run build` works locally
- Make sure `POSTGRES_URL` is set in Vercel environment variables

### Can't connect to Supabase
- Check your database password is correct
- Make sure you're using the **URI** connection string (not the transaction pooling URL)
- Verify your Supabase project is active (check dashboard)

## Useful Commands

```bash
# Local development
npm run dev              # Start dev server
npm run build            # Test production build locally
npm run db:push          # Push schema changes to DB
npm run db:studio        # Open Drizzle Studio (DB GUI)
npm run db:seed          # Seed sample data

# Database operations
drizzle-kit studio       # Visual database browser (alternative to Supabase UI)
```

## Cost Breakdown (Free Tier Limits)

**Supabase Free Tier:**
- 500 MB database space
- 1 GB file storage
- 50,000 monthly active users
- 2 GB bandwidth
- Perfect for MVP and early growth

**Vercel Free Tier:**
- 100 GB bandwidth/month
- Unlimited deployments
- Automatic HTTPS
- Perfect for this use case

Both will handle your MVP with room to grow!

## Next Steps

Now that you're deployed:
1. Test the market type filtering
2. Build entity detail pages (Firms, Funds, Companies)
3. Build pipeline Kanban view
4. Add authentication when ready (built into Supabase)

## Security Notes

- **Never commit `.env` or `.env.local`** files to GitHub (already in .gitignore)
- Keep your repository **private** if it contains business logic
- Store your Supabase database password securely (password manager)
- Consider enabling Row Level Security (RLS) before going to production
- Enable 2FA on both GitHub and Vercel accounts
