# Endowment CRM

An AI-first CRM built specifically for endowment investment teams. Track firms, funds, companies, and intelligence with sophisticated market filtering and deal pipeline management.

## Features

### Core Capabilities
- **Recent Intelligence Feed**: News feed-style display of latest notes, meetings, and research
- **Market Type Filtering**: Toggle between All Markets, Private Markets, and Public Markets
- **Smart Tagging**: Notes can be tagged to multiple firms, funds, and companies simultaneously
- **Investment Pipeline**: Track prospective deals with stages and priority levels
- **Entity Management**: Comprehensive views for firms, funds, and portfolio companies

### Tech Stack
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Database**: Vercel Postgres
- **ORM**: Drizzle ORM
- **UI**: Tailwind CSS + Shadcn/UI
- **AI**: Vercel AI SDK (for future features)

## Database Schema

### Core Tables
1. **Firms** - Investment management companies (e.g., Sequoia Capital)
2. **Funds** - Investment vehicles (e.g., Sequoia Fund XVI)
3. **Companies** - Portfolio companies or prospects (e.g., Stripe)
4. **Notes** - Intelligence notes that can be tagged to multiple entities
5. **Note Entity Tags** - Junction table enabling many-to-many relationships
6. **Deals** - Investment pipeline tracking

See [SCHEMA.md](./SCHEMA.md) for detailed documentation.

## Getting Started

### Deployment (Recommended)

For deploying via GitHub Desktop + Vercel with Supabase:

**→ [DEPLOYMENT-VERCEL-SUPABASE.md](./DEPLOYMENT-VERCEL-SUPABASE.md)** - Complete deployment guide with native Supabase integration

*Alternative guides:*
- [DEPLOYMENT.md](./DEPLOYMENT.md) - Vercel Postgres (simpler, but no auth/storage)
- [DEPLOYMENT-SUPABASE.md](./DEPLOYMENT-SUPABASE.md) - Manual Supabase setup

### Local Development

If you just want to run locally:

1. **Install dependencies**:
```bash
npm install
```

2. **Set up database**: Get a Vercel Postgres connection string and add it to `.env.local`:
```env
POSTGRES_URL="your-connection-string-here"
```

3. **Push schema to database**:
```bash
npm run db:push
```

4. **Seed sample data** (optional):
```bash
npm run db:seed
```

5. **Run dev server**:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
endowment-crm/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/               # API routes
│   │   │   └── notes/         # Notes endpoints
│   │   ├── page.tsx           # Home page (Recent Intelligence)
│   │   ├── layout.tsx         # Root layout
│   │   └── globals.css        # Global styles
│   ├── components/            # React components
│   │   ├── ui/               # Shadcn UI components
│   │   └── note-card.tsx     # Note display component
│   ├── db/                    # Database
│   │   ├── schema.ts         # Drizzle schema
│   │   ├── index.ts          # DB connection
│   │   └── seed.ts           # Seed script
│   └── lib/                   # Utilities
│       ├── utils.ts          # General utilities
│       └── date-utils.ts     # Date formatting
├── drizzle.config.ts          # Drizzle configuration
├── schema.sql                 # SQL schema reference
└── SCHEMA.md                  # Schema documentation
```

## Key Design Decisions

### Note Tagging System
Notes use a polymorphic many-to-many relationship pattern. A single note can be tagged to:
- Multiple firms
- Multiple funds
- Multiple companies

This is implemented via the `note_entity_tags` junction table with an `entity_type` enum.

**Example**: A meeting note can be tagged to "Sequoia Capital" (firm), "Sequoia Fund XVI" (fund), AND "Stripe" (company) simultaneously.

### Market Type Filtering
Firms and Funds have a `market_type` field (public_markets or private_markets). Notes are filtered by checking the market type of their tagged entities through joins.

## Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint

npm run db:push      # Push schema to database
npm run db:studio    # Open Drizzle Studio (DB GUI)
npm run db:generate  # Generate migrations
npm run db:seed      # Seed database with sample data
```

## API Endpoints

### GET /api/notes
Fetch notes with optional market type filtering.

**Query Parameters:**
- `market`: 'all' | 'public_markets' | 'private_markets'
- `limit`: number (default: 20)

**Example:**
```bash
GET /api/notes?market=private_markets&limit=10
```

### GET /api/notes/[id]/entities
Get all entities (firms, funds, companies) tagged to a specific note.

**Example:**
```bash
GET /api/notes/abc123/entities
```

Returns:
```json
{
  "firms": [...],
  "funds": [...],
  "companies": [...]
}
```

## Roadmap

### Phase 1: MVP (Current)
- [x] Database schema
- [x] Recent Intelligence feed
- [x] Market type filtering
- [ ] Entity detail pages
- [ ] Pipeline Kanban view

### Phase 2: Enhanced Intelligence
- [ ] Global search
- [ ] AI-powered note summarization
- [ ] Auto-tagging using LLM
- [ ] Smart entity extraction from notes

### Phase 3: Collaboration
- [ ] User authentication
- [ ] Team permissions
- [ ] Activity feed
- [ ] Email integration

### Phase 4: Analytics
- [ ] Portfolio dashboards
- [ ] Performance tracking
- [ ] Custom reports
- [ ] Data export

## Contributing

This is an internal tool for endowment teams. If you're building something similar, feel free to fork and adapt!

## License

MIT
