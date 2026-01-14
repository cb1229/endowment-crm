# Finding Your Vercel Environment Variables

If you've already connected Supabase to Vercel but can't see the environment variables, follow these steps:

## Step 1: Check Vercel Project Settings

1. Go to your Vercel dashboard: [vercel.com](https://vercel.com)
2. Select your `endowment-crm` project
3. Click **Settings** (top navigation)
4. Click **Environment Variables** (left sidebar)

## Step 2: Look for POSTGRES_URL

You should see these variables (automatically added by Supabase integration):
- `POSTGRES_URL` ⭐ (This is the main one you need)
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

### If You See Them:

1. Click the eye icon to reveal `POSTGRES_URL`
2. Copy the entire value (starts with `postgresql://`)
3. Continue to "Step 3: Set Up Locally" below

### If You DON'T See Them:

The Supabase integration might not be fully connected. Try this:

1. Go to **Integrations** tab (or **Storage** tab)
2. Look for Supabase in the list
3. If you see it, click **Configure** or **Manage**
4. If you don't see it, click **Browse Marketplace** and search for "Supabase"
5. Click **Add Integration**
6. Follow prompts to connect/create Supabase project
7. Once connected, go back to **Settings** → **Environment Variables**

## Step 3: Alternative - Get from Supabase Directly

If Vercel integration isn't showing variables, get them directly from Supabase:

1. Find your Supabase project:
   - If created through Vercel: Click the Supabase integration in Vercel → "View in Supabase"
   - Or go directly to [supabase.com](https://supabase.com) and find your project

2. In Supabase dashboard:
   - Click the **Settings** icon (gear) in the sidebar
   - Click **Database** in the left menu
   - Scroll to **Connection string** section
   - Select **URI** tab (not "Transaction" or "Session")
   - Copy the connection string

3. The connection string looks like:
   ```
   postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-us-west-1.pooler.supabase.com:6543/postgres
   ```

4. You'll need to replace `[PASSWORD]` with your database password
   - If you don't have it, you can reset it in Supabase:
   - Settings → Database → Database Password → Reset

## Step 4: Set Up Locally

Once you have the `POSTGRES_URL`:

1. **Create `.env.local` file** in your project root:
   ```bash
   cd /Users/chrisbrady/Desktop/Claude\ Code/Endowment-CRM/endowment-crm
   touch .env.local
   ```

2. **Open `.env.local`** in your editor and add:
   ```env
   POSTGRES_URL="postgresql://postgres.xxx:password@aws-0-us-west-1.pooler.supabase.com:6543/postgres"
   ```
   (Replace with your actual connection string)

3. **Save the file**

## Step 5: Install and Push Schema

Now run these commands in order:

```bash
# Install all dependencies
npm install

# Push database schema (creates all tables)
npm run db:push

# Seed sample data (optional but recommended)
npm run db:seed

# Start development server
npm run dev
```

## Step 6: Test Locally

1. Open [http://localhost:3000](http://localhost:3000)
2. You should see the home page
3. Test the market filter tabs
4. If seeded, you should see 4 sample notes

## Step 7: Commit and Push to GitHub

Once everything works locally:

1. Open GitHub Desktop
2. You should see changes to:
   - `.env.example` (updated)
   - Other project files
3. **Make sure `.env.local` is NOT in the changes** (it should be ignored)
4. Commit with message: "Update environment configuration"
5. Click **Push origin**

## Step 8: Redeploy on Vercel

After pushing to GitHub:
- Vercel automatically redeploys
- Or manually: Deployments tab → Redeploy

---

## Troubleshooting

### "Can't connect to database" error

**Check your connection string format:**
- Must start with `postgresql://`
- Must include the password (no `[PASSWORD]` placeholder)
- Must be in quotes in `.env.local`

**Test the connection string:**
```bash
npm run db:push
```

If this succeeds, your connection is working!

### "POSTGRES_URL is not defined" error

Make sure:
1. `.env.local` file exists in project root
2. Variable is named exactly `POSTGRES_URL` (all caps)
3. Connection string is in quotes
4. No spaces around the `=` sign

### Vercel deployment works but local doesn't

- Your `.env.local` might be missing or incorrect
- Double-check you copied the connection string correctly
- Try getting it directly from Supabase (Step 3 above)

### I reset my Supabase password and now nothing works

1. Get the new connection string from Supabase
2. Update Vercel environment variables:
   - Settings → Environment Variables
   - Edit `POSTGRES_URL`
   - Paste new connection string
   - Redeploy
3. Update `.env.local` locally with new string

---

## Quick Reference

**Vercel Environment Variables:**
`Settings → Environment Variables`

**Supabase Connection String:**
`Settings → Database → Connection string → URI tab`

**Local environment file:**
`.env.local` (in project root, not committed to git)

**Test connection:**
```bash
npm run db:push
```

**Seed data:**
```bash
npm run db:seed
```

**Start dev server:**
```bash
npm run dev
```
