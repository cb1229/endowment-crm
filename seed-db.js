require('dotenv').config({ path: '.env.local' });
const { execSync } = require('child_process');

console.log('Loading environment variables from .env.local...');
execSync('npx tsx src/db/seed.ts', { stdio: 'inherit' });
