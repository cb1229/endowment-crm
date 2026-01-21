import { pgTable, text, timestamp, uuid, pgEnum, integer, boolean, bigint } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Enums
export const marketTypeEnum = pgEnum('market_type', ['public_markets', 'private_markets']);
export const dealStageEnum = pgEnum('deal_stage', ['triage', 'diligence', 'ic_vote', 'committed', 'pass']);
export const dealPriorityEnum = pgEnum('deal_priority', ['low', 'medium', 'high']);
export const entityTypeEnum = pgEnum('entity_type', ['firm', 'fund', 'company']);

// Investment Firms (Management Companies)
export const firms = pgTable('firms', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  marketType: marketTypeEnum('market_type').notNull(),
  description: text('description'),
  website: text('website'),
  headquarters: text('headquarters'),
  foundedYear: integer('founded_year'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Funds (Investment Vehicles)
export const funds = pgTable('funds', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  firmId: uuid('firm_id').references(() => firms.id, { onDelete: 'cascade' }),
  marketType: marketTypeEnum('market_type').notNull(),
  description: text('description'),
  vintageYear: integer('vintage_year'),
  fundSize: text('fund_size'), // Store as text to handle various formats (e.g., "$500M")
  strategy: text('strategy'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Companies (Portfolio Companies or Prospects)
export const companies = pgTable('companies', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  description: text('description'),
  website: text('website'),
  industry: text('industry'),
  headquarters: text('headquarters'),
  foundedYear: integer('founded_year'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Notes (Central intelligence atom)
export const notes = pgTable('notes', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: text('title').notNull(),
  content: text('content').notNull(),
  userId: uuid('user_id').notNull(), // References auth.users.id
  authorName: text('author_name').notNull(), // Denormalized for performance
  isPublic: boolean('is_public').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Note Tagging System (Junction table for many-to-many relationships)
// A note can be tagged to multiple firms, funds, or companies
export const noteEntityTags = pgTable('note_entity_tags', {
  id: uuid('id').primaryKey().defaultRandom(),
  noteId: uuid('note_id').references(() => notes.id, { onDelete: 'cascade' }).notNull(),
  entityType: entityTypeEnum('entity_type').notNull(),
  entityId: uuid('entity_id').notNull(), // References firm, fund, or company id
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Deals (Pipeline for prospective investments)
export const deals = pgTable('deals', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  entityType: entityTypeEnum('entity_type').notNull(),
  entityId: uuid('entity_id').notNull(), // References the target entity (fund or company typically)
  stage: dealStageEnum('stage').notNull().default('triage'),
  priority: dealPriorityEnum('priority').notNull().default('medium'),
  description: text('description'),
  proposedAmount: text('proposed_amount'), // Store as text for flexibility
  expectedCloseDate: timestamp('expected_close_date'),
  ownerId: text('owner_id').notNull(), // Deal owner/responsible party
  ownerName: text('owner_name').notNull(), // Denormalized
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Relations
export const firmsRelations = relations(firms, ({ many }) => ({
  funds: many(funds),
  noteEntityTags: many(noteEntityTags),
}));

export const fundsRelations = relations(funds, ({ one, many }) => ({
  firm: one(firms, {
    fields: [funds.firmId],
    references: [firms.id],
  }),
  noteEntityTags: many(noteEntityTags),
}));

export const companiesRelations = relations(companies, ({ many }) => ({
  noteEntityTags: many(noteEntityTags),
}));

export const notesRelations = relations(notes, ({ many }) => ({
  noteEntityTags: many(noteEntityTags),
}));

export const noteEntityTagsRelations = relations(noteEntityTags, ({ one }) => ({
  note: one(notes, {
    fields: [noteEntityTags.noteId],
    references: [notes.id],
  }),
}));

// Type exports for use in the application
export type Firm = typeof firms.$inferSelect;
export type NewFirm = typeof firms.$inferInsert;
export type Fund = typeof funds.$inferSelect;
export type NewFund = typeof funds.$inferInsert;
export type Company = typeof companies.$inferSelect;
export type NewCompany = typeof companies.$inferInsert;
export type Note = typeof notes.$inferSelect;
export type NewNote = typeof notes.$inferInsert;
export type NoteEntityTag = typeof noteEntityTags.$inferSelect;
export type NewNoteEntityTag = typeof noteEntityTags.$inferInsert;
export type Deal = typeof deals.$inferSelect;
export type NewDeal = typeof deals.$inferInsert;

// File Attachments
export const fileAttachments = pgTable('file_attachments', {
  id: uuid('id').primaryKey().defaultRandom(),
  fileName: text('file_name').notNull(),
  filePath: text('file_path').notNull(),
  fileSize: bigint('file_size', { mode: 'number' }).notNull(),
  fileType: text('file_type').notNull(),
  entityType: entityTypeEnum('entity_type'),
  entityId: uuid('entity_id'),
  noteId: uuid('note_id').references(() => notes.id, { onDelete: 'cascade' }),
  uploadedBy: text('uploaded_by').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export type FileAttachment = typeof fileAttachments.$inferSelect;
export type NewFileAttachment = typeof fileAttachments.$inferInsert;
