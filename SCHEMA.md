# Endowment CRM Database Schema

## Overview
This schema is designed for an endowment investment team tracking firms, funds, companies, and intelligence notes with sophisticated many-to-many relationships.

## Core Entity Types

### 1. **Firms** (`firms` table)
Investment management companies (e.g., Sequoia Capital, Blackstone).

**Key Fields:**
- `market_type`: Enum of `public_markets` or `private_markets`
- Standard metadata: description, website, headquarters, founded year

### 2. **Funds** (`funds` table)
Specific investment vehicles managed by firms (e.g., Sequoia Fund XVI).

**Key Fields:**
- `firm_id`: Foreign key to parent firm (optional - some funds may not have a tracked firm)
- `market_type`: Inherited classification (public/private)
- `vintage_year`: Fund launch year
- `fund_size`: Stored as text for flexibility ("$500M", "€200M", etc.)
- `strategy`: Free text describing investment strategy

**Relationship:** Many funds can belong to one firm.

### 3. **Companies** (`companies` table)
Portfolio companies or investment prospects (e.g., Stripe, OpenAI).

**Key Fields:**
- Standard company metadata: industry, website, headquarters
- No direct market_type field (inferred through relationships)

### 4. **Notes** (`notes` table)
The central "intelligence atom" of the system. These are meeting notes, research memos, call summaries, etc.

**Key Fields:**
- `title` & `content`: The note itself
- `author_id` & `author_name`: Author tracking (denormalized name for performance)
- `is_public`: Visibility flag for future permission systems

**Critical Design:** Notes use a many-to-many relationship system allowing a single note to be tagged to any combination of firms, funds, and companies.

### 5. **Note Entity Tags** (`note_entity_tags` table)
**Junction table enabling the core tagging system.**

**Schema:**
```sql
note_id (UUID) → references notes.id
entity_type (ENUM) → 'firm' | 'fund' | 'company'
entity_id (UUID) → references the specific entity
```

**Example:** A single note from a meeting with Sequoia could be tagged to:
- Firm: Sequoia Capital (firm_id)
- Fund: Sequoia Fund XVI (fund_id)
- Company: Stripe (company_id)

This creates three rows in `note_entity_tags` all pointing to the same `note_id`.

**Querying Notes by Market Type:**
```sql
-- Get all notes related to private markets entities
SELECT DISTINCT n.*
FROM notes n
JOIN note_entity_tags net ON n.id = net.note_id
LEFT JOIN firms f ON net.entity_type = 'firm' AND net.entity_id = f.id
LEFT JOIN funds fu ON net.entity_type = 'fund' AND net.entity_id = fu.id
WHERE f.market_type = 'private_markets'
   OR fu.market_type = 'private_markets';
```

### 6. **Deals** (`deals` table)
Investment pipeline tracking prospective investments.

**Key Fields:**
- `entity_type` & `entity_id`: Polymorphic reference to the target (usually fund or company)
- `stage`: Enum of deal stages (triage → diligence → ic_vote → committed/pass)
- `priority`: Enum of low/medium/high
- `owner_id` & `owner_name`: Deal owner (denormalized for performance)
- `expected_close_date`: Target close date

## Design Decisions

### Why Polymorphic References?
The `note_entity_tags` table uses a "polymorphic" pattern where `entity_type` + `entity_id` can reference different tables. This provides:

1. **Flexibility:** A note can reference any combination of entities
2. **Simplicity:** Single junction table instead of three (note_firms, note_funds, note_companies)
3. **Extensibility:** Easy to add new entity types in the future

**Trade-off:** We lose foreign key constraints on `entity_id`. We accept this for the flexibility gained.

### Market Type Filtering
For the "Recent Intelligence" feed filtered by market type:

**Strategy:** Use joins through the junction table to filter notes by the market_type of their tagged entities:
- If any tagged entity (firm or fund) is `private_markets`, the note appears in the private markets feed
- If any tagged entity is `public_markets`, it appears in public markets feed
- If tagged to both types, it appears in both feeds

### Denormalization
We denormalize `author_name` and `owner_name` fields for performance. This avoids joins to a users table on every query. Trade-off: Names may become stale if a user changes their name, but this is acceptable for this use case.

## Sample Queries

### Get all notes for a specific company
```sql
SELECT n.*
FROM notes n
JOIN note_entity_tags net ON n.id = net.note_id
WHERE net.entity_type = 'company'
  AND net.entity_id = 'company-uuid-here';
```

### Get all entities tagged on a specific note
```sql
-- Firms
SELECT f.*, 'firm' as entity_type
FROM firms f
JOIN note_entity_tags net ON net.entity_id = f.id
WHERE net.note_id = 'note-uuid-here'
  AND net.entity_type = 'firm'

UNION ALL

-- Funds
SELECT fu.*, 'fund' as entity_type
FROM funds fu
JOIN note_entity_tags net ON net.entity_id = fu.id
WHERE net.note_id = 'note-uuid-here'
  AND net.entity_type = 'fund'

UNION ALL

-- Companies
SELECT c.*, 'company' as entity_type
FROM companies c
JOIN note_entity_tags net ON net.entity_id = c.id
WHERE net.note_id = 'note-uuid-here'
  AND net.entity_type = 'company';
```

### Get recent notes filtered by market type
```sql
-- Private Markets Only
SELECT DISTINCT n.*
FROM notes n
JOIN note_entity_tags net ON n.id = net.note_id
LEFT JOIN firms f ON net.entity_type = 'firm' AND net.entity_id = f.id
LEFT JOIN funds fu ON net.entity_type = 'fund' AND net.entity_id = fu.id
WHERE f.market_type = 'private_markets'
   OR fu.market_type = 'private_markets'
ORDER BY n.created_at DESC
LIMIT 20;
```

## Next Steps
1. Run migrations using Drizzle Kit: `npx drizzle-kit push`
2. Create seed data for testing
3. Build API routes for CRUD operations
4. Implement the "Recent Intelligence" feed with market type filtering
