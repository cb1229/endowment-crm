require('dotenv').config({ path: '.env.local' });
const postgres = require('postgres');

const sql = postgres(process.env.POSTGRES_URL, {
  ssl: 'require',
});

async function createTables() {
  console.log('Creating database tables...\n');

  try {
    // Create enum type
    await sql`
      DO $$ BEGIN
        CREATE TYPE market_type AS ENUM ('public_markets', 'private_markets');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `;

    await sql`
      DO $$ BEGIN
        CREATE TYPE entity_type AS ENUM ('firm', 'fund', 'company');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `;

    await sql`
      DO $$ BEGIN
        CREATE TYPE deal_stage AS ENUM ('triage', 'diligence', 'ic_vote', 'legal', 'closed', 'passed');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `;

    await sql`
      DO $$ BEGIN
        CREATE TYPE deal_priority AS ENUM ('low', 'medium', 'high');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `;

    // Create firms table
    await sql`
      CREATE TABLE IF NOT EXISTS firms (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name TEXT NOT NULL,
        market_type market_type NOT NULL,
        description TEXT,
        website TEXT,
        headquarters TEXT,
        founded_year INTEGER,
        created_at TIMESTAMP DEFAULT NOW() NOT NULL,
        updated_at TIMESTAMP DEFAULT NOW() NOT NULL
      )
    `;
    console.log('✓ Created firms table');

    // Create funds table
    await sql`
      CREATE TABLE IF NOT EXISTS funds (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name TEXT NOT NULL,
        firm_id UUID REFERENCES firms(id) ON DELETE CASCADE,
        market_type market_type NOT NULL,
        description TEXT,
        vintage_year INTEGER,
        fund_size TEXT,
        strategy TEXT,
        created_at TIMESTAMP DEFAULT NOW() NOT NULL,
        updated_at TIMESTAMP DEFAULT NOW() NOT NULL
      )
    `;
    console.log('✓ Created funds table');

    // Create companies table
    await sql`
      CREATE TABLE IF NOT EXISTS companies (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name TEXT NOT NULL,
        description TEXT,
        website TEXT,
        industry TEXT,
        headquarters TEXT,
        founded_year INTEGER,
        created_at TIMESTAMP DEFAULT NOW() NOT NULL,
        updated_at TIMESTAMP DEFAULT NOW() NOT NULL
      )
    `;
    console.log('✓ Created companies table');

    // Create notes table
    await sql`
      CREATE TABLE IF NOT EXISTS notes (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        author_id TEXT NOT NULL,
        author_name TEXT NOT NULL,
        is_public BOOLEAN DEFAULT true NOT NULL,
        created_at TIMESTAMP DEFAULT NOW() NOT NULL,
        updated_at TIMESTAMP DEFAULT NOW() NOT NULL
      )
    `;
    console.log('✓ Created notes table');

    // Create note_entity_tags table
    await sql`
      CREATE TABLE IF NOT EXISTS note_entity_tags (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        note_id UUID REFERENCES notes(id) ON DELETE CASCADE NOT NULL,
        entity_type entity_type NOT NULL,
        entity_id UUID NOT NULL,
        created_at TIMESTAMP DEFAULT NOW() NOT NULL
      )
    `;
    console.log('✓ Created note_entity_tags table');

    // Create deals table
    await sql`
      CREATE TABLE IF NOT EXISTS deals (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name TEXT NOT NULL,
        entity_type entity_type NOT NULL,
        entity_id UUID NOT NULL,
        stage deal_stage NOT NULL,
        priority deal_priority NOT NULL,
        description TEXT,
        proposed_amount TEXT,
        expected_close_date DATE,
        actual_close_date DATE,
        owner_id TEXT NOT NULL,
        owner_name TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT NOW() NOT NULL,
        updated_at TIMESTAMP DEFAULT NOW() NOT NULL
      )
    `;
    console.log('✓ Created deals table');

    console.log('\n✅ All tables created successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error creating tables:', error);
    process.exit(1);
  }
}

createTables();
