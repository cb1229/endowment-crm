import { drizzle } from 'drizzle-orm/vercel-postgres';
import { sql } from '@vercel/postgres';
import * as schema from './schema';

// Create the Drizzle database instance with the schema
export const db = drizzle(sql, { schema });
