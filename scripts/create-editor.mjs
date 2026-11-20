import { randomBytes, scryptSync } from 'node:crypto';
import { createClient } from '@tursodatabase/serverless/compat';

const email = process.env.EDITOR_EMAIL?.trim().toLowerCase();
const password = process.env.EDITOR_PASSWORD;
const role = process.env.EDITOR_ROLE === 'editor' ? 'editor' : 'admin';

if (!email || !password || password.length < 8) {
  console.error('Defina EDITOR_EMAIL e EDITOR_PASSWORD (mínimo 8 caracteres).');
  process.exit(1);
}

const url = process.env.TURSO_DATABASE_URL;
const authToken = process.env.TURSO_AUTH_TOKEN;
if (!url || !authToken) {
  console.error('Defina TURSO_DATABASE_URL e TURSO_AUTH_TOKEN.');
  process.exit(1);
}

const salt = randomBytes(16).toString('base64url');
const hash = scryptSync(password, salt, 64).toString('base64url');
const passwordHash = `scrypt$${salt}$${hash}`;
const id = crypto.randomUUID();

const db = createClient({ url, authToken });
await db.execute({
  sql: `INSERT INTO staff_users (id, email, password_hash, role)
        VALUES (?, ?, ?, ?)
        ON CONFLICT(email) DO UPDATE SET password_hash = excluded.password_hash, role = excluded.role`,
  args: [id, email, passwordHash, role],
});

console.log(`Editor ${role} pronto: ${email}`);
