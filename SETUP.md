# Endowment CRM Setup Guide

## Authentication Setup

This application uses Supabase for authentication. Follow these steps to complete the setup:

### 1. Get Supabase Credentials

1. Go to your Supabase project dashboard: https://supabase.com/dashboard
2. Navigate to Settings → API
3. Copy the following values:
   - **Project URL** (starts with `https://`)
   - **Anon/Public Key** (starts with `eyJ...`)

### 2. Update Environment Variables

Add these to your `.env.local` file:

```bash
# Database (already configured)
POSTGRES_URL="your-existing-postgres-url"

# Supabase Auth (add these)
NEXT_PUBLIC_SUPABASE_URL="https://cueblasymrbzlkphaeey.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key-here"
```

### 3. Enable Email Authentication in Supabase

1. Go to Authentication → Providers in your Supabase dashboard
2. Enable **Email** provider
3. Configure email templates (optional)

### 4. Test Authentication

1. Run `npm run dev`
2. Navigate to `http://localhost:3000`
3. You'll be redirected to `/login`
4. Click "Sign up" to create a test account
5. After signup, sign in with your credentials

## Features Implemented

✅ **Authentication** - Login, signup, protected routes
✅ **Entity Management** - Create/edit firms, funds, companies
✅ **Note System** - Create notes with entity tagging
✅ **Pipeline Kanban** - Drag-and-drop deal management
✅ **Search & Filtering** - Real-time search across entities

## Coming Soon

- Entity relationships & timeline
- Enhanced home page with Bento grid
- AI-powered note features
- Deal management forms
- Advanced filters
- Dashboard analytics
