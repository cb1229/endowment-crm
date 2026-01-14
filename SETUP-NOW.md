# Quick Setup Guide - Get Your App Working Now

Your app is deployed but showing 404 because the database tables don't exist yet. Let's fix that in 5 minutes!

## Step 1: Get Your Database Connection String

### Option A: From Vercel (Easiest)
1. Go to [vercel.com](https://vercel.com)
2. Open your `endowment-crm` project
3. Click **Settings** (top nav)
4. Click **Environment Variables** (left sidebar)
5. Find **`POSTGRES_URL`**
6. Click the eye icon to reveal it
7. Copy the entire string (starts with `postgresql://`)

### Option B: From Supabase (If Vercel doesn't show it)
1. In Vercel, click the **Storage** or **Integrations** tab
2. Find your Supabase integration
3. Click **View in Supabase**
4. In Supabase: **Settings** → **Database**
5. Find **Connection string** section
6. Select **URI** tab
7. Copy the connection string
8. If it has `[YOUR-PASSWORD]`, replace it with your actual password

## Step 2: Create .env.local File

Open Terminal and run:

```bash
cd /Users/chrisbrady/Desktop/Claude\ Code/Endowment-CRM/endowment-crm
touch .env.local
open .env.local
```

This opens the file in TextEdit. Paste this line:

```env
POSTGRES_URL="postgresql://postgres.xxx:password@xxx.supabase.com:6543/postgres"
```

Replace with YOUR actual connection string (keep the quotes).

**Save and close the file.**

## Step 3: Install Dependencies

In Terminal:

```bash
npm install
```

Wait for it to finish (takes ~1 minute).

## Step 4: Create Database Tables

In Terminal:

```bash
npm run db:push
```

You should see:
```
✅ Changes applied successfully!
```

This creates all 6 tables in your database.

## Step 5: Add Sample Data (Optional but Recommended)

In Terminal:

```bash
npm run db:seed
```

You should see:
```
✅ Database seeded successfully!
```

This adds:
- 3 Firms (Sequoia, BlackRock, a16z)
- 3 Funds
- 3 Companies (Stripe, OpenAI, Coinbase)
- 4 Notes
- 3 Deals

## Step 6: Test Locally

In Terminal:

```bash
npm run dev
```

Open your browser to: **http://localhost:3000**

You should see the home page with notes (if you seeded data).

## Step 7: Check Production

Now go back to your Vercel deployment URL. Refresh the page.

You should see the same thing - your app is now working! 🎉

## Troubleshooting

### "Cannot find module" errors
```bash
npm install
```

### "POSTGRES_URL is not defined"
- Check `.env.local` exists in the project root
- Check the connection string is in quotes
- Check no spaces around the `=` sign
- Make sure file is saved

### "Connection refused" or "authentication failed"
- Check the password in your connection string
- Try getting the string from Supabase directly (see Step 1, Option B)
- Make sure you're using the **URI** format, not "Transaction" or "Session"

### "Table already exists"
This is fine! It means the tables were already created.

### Local works but production shows 404
The tables exist in the database, so production should work. Try:
1. Hard refresh your browser (Cmd+Shift+R on Mac)
2. Wait 1-2 minutes for Vercel's cache to clear
3. Check the URL is correct (not /public or /api)

---

## Summary of Commands

```bash
# Navigate to project
cd /Users/chrisbrady/Desktop/Claude\ Code/Endowment-CRM/endowment-crm

# Create environment file
touch .env.local
# Then add: POSTGRES_URL="your-connection-string"

# Install and setup
npm install
npm run db:push
npm run db:seed

# Run locally
npm run dev
```

## What You'll See

After setup, your home page shows:
- **All Markets** tab: 4 notes
- **Private Markets** tab: 3 notes (Sequoia, a16z)
- **Public Markets** tab: 1 note (BlackRock)

Each note card shows:
- Title
- Content preview
- Author and time
- Tagged entities (firms, funds, companies)

---

**Need help?** Check ENV-SETUP.md for more detailed troubleshooting.

**Ready to build more?** After this works, we can add entity detail pages and the pipeline Kanban view!
