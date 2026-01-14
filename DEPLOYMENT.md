# Deployment Guide: GitHub Desktop → Vercel

This guide walks you through deploying the Endowment CRM using GitHub Desktop and Vercel's automatic deployment.

## Prerequisites

- [GitHub Desktop](https://desktop.github.com/) installed
- GitHub account
- [Vercel account](https://vercel.com) (free tier works fine)
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

**DO NOT** add environment variables yet - we'll add the database first.

Click **Deploy** to start the initial deployment.

> **Note**: This first deployment will fail because there's no database yet. That's expected!

### 2.3 Add Postgres Database

1. While the deployment is running (or after it fails), go to your project dashboard
2. Click the **Storage** tab at the top
3. Click **Create Database**
4. Select **Postgres**
5. Click **Continue**
6. Give it a name: `endowment-crm-db`
7. Select a region (choose one close to your users)
8. Click **Create**

Vercel will automatically:
- Create the Postgres database
- Add all the environment variables to your project (`POSTGRES_URL`, etc.)
- Connect them to your app

### 2.4 Push Database Schema

Now we need to create the tables. You'll do this from your local machine:

1. In Vercel dashboard, go to **Storage** → **endowment-crm-db** → **Settings** tab
2. Under **Environment Variables**, click **Show secret** for `POSTGRES_URL`
3. Copy the entire connection string

4. On your local machine, create a `.env.local` file:

```bash
# In your terminal (at the project root)
touch .env.local
```

5. Open `.env.local` and paste the connection string:

```env
POSTGRES_URL="your-vercel-postgres-url-here"
```

6. Install dependencies if you haven't:

```bash
npm install
```

7. Push the schema to the database:

```bash
npm run db:push
```

You should see: "✅ Changes applied successfully!"

### 2.5 Seed Sample Data (Optional)

To populate the database with example data:

```bash
npx tsx src/db/seed.ts
```

This creates:
- 3 Firms (Sequoia, BlackRock, a16z)
- 3 Funds
- 3 Companies (Stripe, OpenAI, Coinbase)
- 4 Notes with entity tags
- 3 Deals

### 2.6 Trigger Redeployment

1. Go back to Vercel dashboard → **Deployments** tab
2. Click **Redeploy** on the latest deployment
   - OR make a small change to any file and push to GitHub (Vercel auto-deploys on push)

This time the deployment will succeed! ✅

## Step 3: Test Your Deployment

1. Once deployment completes, Vercel will show you a URL: `https://endowment-crm-xxx.vercel.app`
2. Click the URL to open your live app
3. You should see the home page with the "Recent Intelligence" feed
4. Test the market type filter tabs (All Markets, Private Markets, Public Markets)

If you seeded the data, you should see 4 sample notes that filter correctly based on market type.

## Step 4: Local Development Setup

To work on the app locally:

1. Keep your `.env.local` file with the Vercel Postgres connection string
2. Run the dev server:

```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000)

## Ongoing Workflow

### Making Changes

1. Edit your code locally
2. Test locally with `npm run dev`
3. Commit changes in GitHub Desktop
4. Push to GitHub
5. Vercel automatically deploys (usually takes 1-2 minutes)

### Environment Variables

All environment variables are automatically managed by Vercel when you add the Postgres database. You don't need to manually configure them in the Vercel dashboard.

If you need to add additional env vars later:
1. Go to Project Settings → Environment Variables
2. Add the variable for Production, Preview, and Development environments

## Troubleshooting

### "Module not found" errors on Vercel
- Make sure you committed all files to GitHub
- Check that `package.json` includes all dependencies
- Try a fresh deployment

### Database connection errors
- Verify the `POSTGRES_URL` is set in `.env.local` for local dev
- For production, verify the database is connected in Vercel's Storage tab
- Check that `npm run db:push` completed successfully

### Build fails on Vercel
- Check the deployment logs in Vercel dashboard
- Verify `npm run build` works locally
- Make sure `drizzle.config.ts` is committed to GitHub

## Next Steps

Now that you're deployed:
1. Test the market type filtering
2. Ready to build entity detail pages
3. Ready to build the pipeline Kanban view

## Useful Commands

```bash
# Local development
npm run dev              # Start dev server
npm run build            # Test production build locally
npm run db:push          # Push schema changes to DB
npm run db:studio        # Open Drizzle Studio (DB GUI)

# Database operations
npx tsx src/db/seed.ts   # Seed sample data
```

## Security Notes

- **Never commit `.env` or `.env.local`** files to GitHub (already in .gitignore)
- Keep your repository **private** if it contains business logic
- The Vercel Postgres connection strings are automatically secured
- Consider adding authentication before exposing this to the public internet
