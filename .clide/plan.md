# Implementation Plan: Entity Detail Pages & Pipeline Kanban with Modern UI

## Overview
Building entity detail pages (Firms, Funds, Companies) and a Pipeline Kanban board with a high-density, enterprise-grade design aesthetic inspired by Linear, Attio, and Affinity.

## Current State Analysis

### Existing Components
- **UI Library**: Shadcn/UI with Radix UI primitives
- **Current Components**: Button, Tabs, Card, Badge
- **Font**: Inter (Next.js default)
- **Design**: Basic shadcn defaults with some shadows and standard spacing

### Database Schema
- **Firms**: name, marketType, description, website, headquarters, foundedYear
- **Funds**: name, firmId, marketType, description, vintageYear, fundSize, strategy
- **Companies**: name, description, website, industry, headquarters, foundedYear
- **Deals**: name, entityType, entityId, stage (triage→diligence→ic_vote→committed→pass), priority, description, proposedAmount, expectedCloseDate, ownerId, ownerName
- **Notes**: Polymorphic tagging to all entities via noteEntityTags junction table

## Design System Updates

### 1. Typography & Font System
**Changes to make:**
- Switch from Inter to Geist Sans (Vercel's font family)
- Set `text-sm` as default for data-dense components
- Use `text-xs` for metadata/timestamps/badges
- Strict font-weight hierarchy: `font-medium` for primary, `font-normal text-muted-foreground` for secondary

**Files to modify:**
- `src/app/layout.tsx` - Import and apply Geist Sans
- `tailwind.config.ts` - Add custom fontSize scales if needed

### 2. Color & Visual System
**Changes to make:**
- Reduce shadows, emphasize borders
- Update card component to be flat with `border` instead of `shadow`
- Add muted background colors for depth: `bg-muted/50`, `bg-slate-50`
- Create pastel badge variants: `bg-blue-100 text-blue-700`, `bg-green-100 text-green-700`, etc.

**Files to modify:**
- `src/app/globals.css` - Add custom utility classes for high-density layouts
- `src/components/ui/card.tsx` - Remove shadow, add flat bordered variant
- `src/components/ui/badge.tsx` - Add pastel color variants

### 3. Layout Density
**Changes to make:**
- Reduce default paddings in cards and containers
- Tighter line-height for data tables
- Compact form controls and inputs

**Files to modify:**
- `src/app/globals.css` - Add density utility classes
- Update component padding throughout

## Feature Implementation

### Phase 1: Enhanced UI Components

#### 1.1 Add Missing Shadcn Components
**Components needed:**
- `Sheet` (slide-over panel) - for editing entities without full page navigation
- `Table` - for data-dense lists of entities
- `Dialog` - for confirmations
- `Select` - for dropdowns
- `Input` & `Textarea` - for forms
- `Separator` - for visual divisions

**Action**: Install via shadcn CLI

#### 1.2 Create Custom Components
- **Entity Badge Component** (`src/components/ui/entity-badge.tsx`)
  - Displays entity type icon + name in pill format
  - Variants for firm (Building2), fund (TrendingUp), company (Building)
  - Pastel colors based on entity type

- **Status Badge Component** (`src/components/ui/status-badge.tsx`)
  - For deal stages with color coding
  - triage (gray), diligence (blue), ic_vote (yellow), committed (green), pass (red)

- **Priority Badge Component** (`src/components/ui/priority-badge.tsx`)
  - low (gray), medium (yellow), high (red)

- **Data Table Component** (`src/components/ui/data-table.tsx`)
  - Reusable table with sticky headers, hover states, sorting
  - High-density spacing

### Phase 2: API Routes

#### 2.1 Firm API Routes
- `GET /api/firms` - List all firms with pagination/filtering
- `GET /api/firms/[id]` - Get single firm with related data (funds, notes, deals)
- `GET /api/firms/[id]/notes` - Get all notes tagged to a firm
- `GET /api/firms/[id]/funds` - Get all funds for a firm
- `GET /api/firms/[id]/deals` - Get all deals related to a firm

#### 2.2 Fund API Routes
- `GET /api/funds` - List all funds
- `GET /api/funds/[id]` - Get single fund with related data
- `GET /api/funds/[id]/notes` - Get all notes tagged to a fund
- `GET /api/funds/[id]/deals` - Get all deals for a fund

#### 2.3 Company API Routes
- `GET /api/companies` - List all companies
- `GET /api/companies/[id]` - Get single company with related data
- `GET /api/companies/[id]/notes` - Get all notes tagged to a company
- `GET /api/companies/[id]/deals` - Get all deals for a company

#### 2.4 Deal API Routes
- `GET /api/deals` - List all deals (for Kanban board)
- `GET /api/deals/[id]` - Get single deal
- `PATCH /api/deals/[id]` - Update deal (for drag-and-drop stage changes)

### Phase 3: Entity Detail Pages

#### 3.1 Firm Detail Page (`src/app/firms/[id]/page.tsx`)
**Layout:**
```
┌─────────────────────────────────────────────────┐
│ Header: Firm Name + Edit Button (opens Sheet)   │
├─────────────────────────────────────────────────┤
│ Metadata Bar: Market Type • HQ • Founded • Link │
├─────────────────────────────────────────────────┤
│ ┌──────────────┐  ┌──────────────────────────┐ │
│ │ Description  │  │ Quick Stats              │ │
│ └──────────────┘  │ - # of Funds             │ │
│                   │ - # of Notes             │ │
│                   │ - # of Active Deals      │ │
│                   └──────────────────────────┘ │
├─────────────────────────────────────────────────┤
│ Tabs: Funds | Notes | Deals                     │
│ ┌───────────────────────────────────────────┐   │
│ │ [Tab Content - Data Table or Card Grid]   │   │
│ └───────────────────────────────────────────┘   │
└─────────────────────────────────────────────────┘
```

**Features:**
- Breadcrumb navigation: Home > Firms > [Firm Name]
- Market type badge (Public/Private)
- External link to website
- Tabs switch between related entities
- All data fetched server-side, passed to client components

#### 3.2 Fund Detail Page (`src/app/funds/[id]/page.tsx`)
**Similar structure to Firm page with:**
- Link to parent Firm
- Additional metadata: Vintage Year, Fund Size, Strategy
- Tabs: Notes | Deals

#### 3.3 Company Detail Page (`src/app/companies/[id]/page.tsx`)
**Similar structure with:**
- Industry badge
- Tabs: Notes | Deals

#### 3.4 Entity List Pages
- `src/app/firms/page.tsx` - Data table of all firms
- `src/app/funds/page.tsx` - Data table of all funds
- `src/app/companies/page.tsx` - Data table of all companies

**Features:**
- Search/filter bar
- Sortable columns
- High-density table view
- Click row to navigate to detail page

### Phase 4: Pipeline Kanban Board

#### 4.1 Pipeline Page (`src/app/pipeline/page.tsx`)
**Layout:**
```
┌──────────────────────────────────────────────────────────┐
│ Pipeline Header + Filters (Priority, Owner, Entity Type) │
├──────────────────────────────────────────────────────────┤
│ ┌─────────┬─────────────┬─────────┬───────────┬────────┐ │
│ │ Triage  │  Diligence  │ IC Vote │ Committed │  Pass  │ │
│ │ (3)     │     (2)     │   (1)   │    (4)    │  (1)   │ │
│ ├─────────┼─────────────┼─────────┼───────────┼────────┤ │
│ │ ┌─────┐ │  ┌────────┐ │ ┌─────┐ │  ┌──────┐ │ ┌────┐││
│ │ │Deal │ │  │ Deal   │ │ │Deal │ │  │Deal  │ │ │Deal│││
│ │ │Card │ │  │ Card   │ │ │Card │ │  │Card  │ │ │Card│││
│ │ └─────┘ │  └────────┘ │ └─────┘ │  └──────┘ │ └────┘││
│ │ ┌─────┐ │  ┌────────┐ │         │  ┌──────┐ │       ││
│ │ │Deal │ │  │ Deal   │ │         │  │Deal  │ │       ││
│ │ │Card │ │  │ Card   │ │         │  │Card  │ │       ││
│ │ └─────┘ │  └────────┘ │         │  └──────┘ │       ││
│ └─────────┴─────────────┴─────────┴───────────┴────────┘ │
└──────────────────────────────────────────────────────────┘
```

**Deal Card Structure:**
```
┌────────────────────────────────┐
│ Deal Name                      │
│ [Priority Badge] [Entity Type] │
│ $Amount • Expected Close Date  │
│ Owner Name                     │
│ [View Details →]               │
└────────────────────────────────┘
```

**Implementation:**
- Use CSS Grid for columns (5 stages)
- Each column has fixed width, scrollable
- Drag-and-drop using native HTML5 or react-beautiful-dnd (if needed)
- On drop, call PATCH /api/deals/[id] to update stage
- Optimistic UI updates
- Filter deals by priority, owner, or entity type

**Components to create:**
- `src/components/pipeline/kanban-board.tsx` - Main board container
- `src/components/pipeline/kanban-column.tsx` - Single stage column
- `src/components/pipeline/deal-card.tsx` - Individual deal card
- `src/components/pipeline/pipeline-filters.tsx` - Filter controls

### Phase 5: Enhanced Home Page

#### 5.1 Bento Grid Layout (`src/app/page.tsx` update)
**Replace vertical stack with CSS Grid:**
```
┌───────────────────┬───────────────────┐
│                   │                   │
│  Recent           │  Pipeline         │
│  Intelligence     │  Overview         │
│  (Notes Feed)     │  (Deal Summary)   │
│                   │                   │
│  [Takes 2/3]      │  [Takes 1/3]      │
│                   │                   │
├───────────────────┴───────────────────┤
│  Quick Stats: # Firms | # Funds | ...  │
└───────────────────────────────────────┘
```

**Pipeline Overview Widget:**
- Mini Kanban showing count per stage
- Click to navigate to full pipeline
- Bar chart or simple count badges

### Phase 6: Sheet Panels for Editing

#### 6.1 Entity Edit Sheets
- `src/components/sheets/firm-edit-sheet.tsx`
- `src/components/sheets/fund-edit-sheet.tsx`
- `src/components/sheets/company-edit-sheet.tsx`
- `src/components/sheets/deal-edit-sheet.tsx`

**Features:**
- Slide in from right side
- Form with all entity fields
- Save/Cancel buttons
- Validation
- Keep user on same page (no navigation)

## Implementation Order

### Step 1: Design System Foundation (30 min)
1. Update `tailwind.config.ts` to add Geist font
2. Update `src/app/layout.tsx` to import Geist Sans
3. Update `src/app/globals.css` with high-density utility classes
4. Update `src/components/ui/card.tsx` to remove shadows
5. Update `src/components/ui/badge.tsx` to add pastel variants

### Step 2: Install Additional UI Components (10 min)
```bash
npx shadcn-ui@latest add sheet table dialog select input textarea separator
```

### Step 3: Create Custom Badges & Utilities (20 min)
- Entity badges
- Status badges
- Priority badges
- Data table wrapper

### Step 4: Build API Routes (1 hour)
- All GET routes for firms, funds, companies, deals
- PATCH route for deals
- Include related data joins

### Step 5: Build Entity List Pages (45 min)
- Firms list
- Funds list
- Companies list
- Data tables with navigation to detail pages

### Step 6: Build Entity Detail Pages (1.5 hours)
- Firm detail
- Fund detail
- Company detail
- Tabs, metadata, related entities

### Step 7: Build Pipeline Kanban (1 hour)
- Kanban board layout
- Deal cards
- Drag-and-drop
- Filters

### Step 8: Update Home Page with Bento Grid (30 min)
- Redesign layout
- Add pipeline overview widget
- Add quick stats

### Step 9: Add Sheet Panels (Optional, if time permits)
- Edit sheets for each entity type

## Design Principles to Follow Throughout

1. **Borders over Shadows**: All cards use `border` class, no `shadow` classes
2. **High Density**: Use `text-sm` default, `py-2 px-3` for cards instead of `py-4 px-6`
3. **Muted Backgrounds**: Secondary sections use `bg-muted/50` for subtle depth
4. **Pill Badges**: All badges are rounded-full with pastel backgrounds
5. **Hover States**: Every interactive element has `hover:bg-muted/50` or similar
6. **Sticky Headers**: All tables have sticky headers
7. **Minimal Line Heights**: Use `leading-tight` for data-dense views
8. **Font Hierarchy**: `font-medium` for primary data, `font-normal text-muted-foreground` for secondary

## Success Criteria

- [ ] All entity types have list and detail pages
- [ ] Pipeline Kanban board is functional with drag-and-drop
- [ ] Design matches Linear/Attio aesthetic (high-density, minimal shadows, border-focused)
- [ ] Home page uses Bento grid layout
- [ ] All pages use Geist Sans font
- [ ] Navigation between entities works seamlessly
- [ ] Data loads correctly from database via API routes

## Risks & Considerations

1. **Drag-and-Drop Complexity**: May need to use library like dnd-kit or react-beautiful-dnd
2. **Performance**: Loading all deals at once for Kanban might be slow with large datasets
3. **Sheet Panels**: Radix Sheet component may need customization for full-screen-like experience
4. **Font Loading**: Geist Sans needs to be loaded via next/font properly

## Next Steps After Approval

1. Start with design system updates (foundations)
2. Install necessary UI components
3. Build API routes (backend first)
4. Build pages incrementally (firms → funds → companies → pipeline)
5. Test and refine design details
6. Deploy to Vercel
