require('dotenv').config({ path: '.env.local' });
const { execSync } = require('child_process');

if (!process.env.POSTGRES_URL) {
  console.error('Error: POSTGRES_URL not found in .env.local');
  process.exit(1);
}

try {
  execSync('npx drizzle-kit push:pg', { stdio: 'inherit' });
} catch (error) {
  process.exit(1);
}
