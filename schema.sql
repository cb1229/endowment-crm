-- Endowment CRM Database Schema
-- This file provides a complete SQL view of the schema for documentation and manual setup

-- Create Enums
CREATE TYPE market_type AS ENUM ('public_markets', 'private_markets');
CREATE TYPE deal_stage AS ENUM ('triage', 'diligence', 'ic_vote', 'committed', 'pass');
CREATE TYPE deal_priority AS ENUM ('low', 'medium', 'high');
CREATE TYPE entity_type AS ENUM ('firm', 'fund', 'company');

-- Investment Firms Table
CREATE TABLE firms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    market_type market_type NOT NULL,
    description TEXT,
    website TEXT,
    headquarters TEXT,
    founded_year INTEGER,
    created_at TIMESTAMP DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Funds Table (Investment Vehicles)
CREATE TABLE funds (
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
);

-- Companies Table (Portfolio or Prospect Companies)
CREATE TABLE companies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    website TEXT,
    industry TEXT,
    headquarters TEXT,
    founded_year INTEGER,
    created_at TIMESTAMP DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Notes Table (Central Intelligence Atom)
CREATE TABLE notes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    author_id TEXT NOT NULL,
    author_name TEXT NOT NULL,
    is_public BOOLEAN DEFAULT true NOT NULL,
    created_at TIMESTAMP DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Note Entity Tags (Junction Table for Many-to-Many)
-- Allows a single note to be tagged to multiple firms, funds, or companies
CREATE TABLE note_entity_tags (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    note_id UUID REFERENCES notes(id) ON DELETE CASCADE NOT NULL,
    entity_type entity_type NOT NULL,
    entity_id UUID NOT NULL,
    created_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Deals Table (Investment Pipeline)
CREATE TABLE deals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    entity_type entity_type NOT NULL,
    entity_id UUID NOT NULL,
    stage deal_stage DEFAULT 'triage' NOT NULL,
    priority deal_priority DEFAULT 'medium' NOT NULL,
    description TEXT,
    proposed_amount TEXT,
    expected_close_date TIMESTAMP,
    owner_id TEXT NOT NULL,
    owner_name TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Indexes for Performance
CREATE INDEX idx_funds_firm_id ON funds(firm_id);
CREATE INDEX idx_funds_market_type ON funds(market_type);
CREATE INDEX idx_firms_market_type ON firms(market_type);
CREATE INDEX idx_note_entity_tags_note_id ON note_entity_tags(note_id);
CREATE INDEX idx_note_entity_tags_entity ON note_entity_tags(entity_type, entity_id);
CREATE INDEX idx_notes_created_at ON notes(created_at DESC);
CREATE INDEX idx_deals_stage ON deals(stage);
CREATE INDEX idx_deals_entity ON deals(entity_type, entity_id);

-- Comments for documentation
COMMENT ON TABLE firms IS 'Investment management firms (e.g., Sequoia Capital)';
COMMENT ON TABLE funds IS 'Specific investment vehicles managed by firms (e.g., Sequoia Fund XVI)';
COMMENT ON TABLE companies IS 'Portfolio companies or investment prospects (e.g., Stripe)';
COMMENT ON TABLE notes IS 'Intelligence notes that can be tagged to any combination of entities';
COMMENT ON TABLE note_entity_tags IS 'Junction table enabling a note to be associated with multiple firms, funds, and/or companies';
COMMENT ON TABLE deals IS 'Investment pipeline tracking prospective deals';
