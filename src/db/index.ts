import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

// Create the postgres connection with SSL configuration
const connectionString = process.env.POSTGRES_URL!;
const client = postgres(connectionString, {
  ssl: 'require',
  connection: {
    application_name: 'endowment-crm',
  },
});

// Create the Drizzle database instance with the schema
export const db = drizzle(client, { schema });
