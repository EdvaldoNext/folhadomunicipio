import { cookies } from 'next/headers';
import type { NextRequest } from 'next/server';
import type { EditorialRole, EditorialUser } from '@/lib/auth/types';

export const SESSION_COOKIE = 'fm_session';
const MAX_AGE_SECONDS = 60 * 60 * 12;

interface SessionPayload {
  sub: string;
  email: string;
  role: EditorialRole;
  exp: number;
}

function secret(): string {
  const value = process.env.SESSION_SECRET;
  if (!value || value.length < 32) {
    throw new Error('SESSION_SECRET precisa ter pelo menos 32 caracteres.');
  }
  return value;
}

function bytesToBase64Url(bytes: Uint8Array): string {
  let binary = '';
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replaceAll('+', '-').replaceAll('/', '_').replace(/=+$/, '');
}

function base64UrlToBytes(value: string): Uint8Array {
  const padding = value.length % 4 === 0 ? '' : '='.repeat(4 - (value.length % 4));
  const base64 = value.replaceAll('-', '+').replaceAll('_', '/') + padding;
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }
  return bytes;
}

async function hmac(value: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret()),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const signature = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(value));
  return bytesToBase64Url(new Uint8Array(signature));
}

function encodePayload(payload: SessionPayload): string {
  const json = JSON.stringify(payload);
  return bytesToBase64Url(new TextEncoder().encode(json));
}

function decodePayload(encoded: string): SessionPayload | null {
  try {
    const json = new TextDecoder().decode(base64UrlToBytes(encoded));
    const parsed: unknown = JSON.parse(json);
    if (!parsed || typeof parsed !== 'object') return null;
    const record = parsed as Record<string, unknown>;
    if (
      typeof record.sub !== 'string' ||
      typeof record.email !== 'string' ||
      (record.role !== 'admin' && record.role !== 'editor') ||
      typeof record.exp !== 'number'
    ) {
      return null;
    }
    return {
      sub: record.sub,
      email: record.email,
      role: record.role,
      exp: record.exp,
    };
  } catch {
    return null;
  }
}

async function verifyToken(token: string): Promise<EditorialUser | null> {
  const separator = token.lastIndexOf('.');
  if (separator <= 0) return null;
  const encoded = token.slice(0, separator);
  const signature = token.slice(separator + 1);
  const expected = await hmac(encoded);
  if (signature.length !== expected.length) return null;

  let mismatch = 0;
  for (let index = 0; index < signature.length; index += 1) {
    mismatch |= signature.charCodeAt(index) ^ expected.charCodeAt(index);
  }
  if (mismatch !== 0) return null;

  const payload = decodePayload(encoded);
  if (!payload || payload.exp < Date.now()) return null;
  return { id: payload.sub, email: payload.email, role: payload.role };
}

export async function createSessionToken(user: EditorialUser): Promise<string> {
  const encoded = encodePayload({
    sub: user.id,
    email: user.email,
    role: user.role,
    exp: Date.now() + MAX_AGE_SECONDS * 1000,
  });
  const signature = await hmac(encoded);
  return `${encoded}.${signature}`;
}

export function sessionCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict' as const,
    path: '/',
    maxAge: MAX_AGE_SECONDS,
  };
}

export async function readSessionToken(token: string | undefined): Promise<EditorialUser | null> {
  if (!token) return null;
  try {
    return await verifyToken(token);
  } catch {
    return null;
  }
}

export async function readSessionFromRequest(request: NextRequest): Promise<EditorialUser | null> {
  return readSessionToken(request.cookies.get(SESSION_COOKIE)?.value);
}

export async function readSessionFromCookies(): Promise<EditorialUser | null> {
  const store = await cookies();
  return readSessionToken(store.get(SESSION_COOKIE)?.value);
}
