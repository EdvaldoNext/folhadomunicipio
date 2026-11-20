import { randomBytes, scrypt as scryptCallback, timingSafeEqual } from 'node:crypto';
import { promisify } from 'node:util';

const scrypt = promisify(scryptCallback);
const KEY_LENGTH = 64;

export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString('base64url');
  const derived = (await scrypt(password, salt, KEY_LENGTH)) as Buffer;
  return `scrypt$${salt}$${derived.toString('base64url')}`;
}

export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const [algorithm, salt, hash] = stored.split('$');
  if (algorithm !== 'scrypt' || !salt || !hash) return false;

  const derived = (await scrypt(password, salt, KEY_LENGTH)) as Buffer;
  const previous = Buffer.from(hash, 'base64url');
  if (derived.length !== previous.length) return false;
  return timingSafeEqual(derived, previous);
}
