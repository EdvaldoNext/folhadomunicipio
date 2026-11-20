'use server';

import { cookies } from 'next/headers';
import { ensureSameOrigin } from '@/lib/auth/origin';
import { verifyPassword } from '@/lib/auth/password';
import {
  createSessionToken,
  SESSION_COOKIE,
  sessionCookieOptions,
} from '@/lib/auth/session';
import type { EditorialRole } from '@/lib/auth/types';
import { queryOne } from '@/lib/db/client';

interface StaffRow {
  id: string;
  email: string;
  password_hash: string;
  role: string;
}

export async function loginEditorial(
  email: string,
  password: string
): Promise<{ ok: true } | { error: string }> {
  const originError = await ensureSameOrigin();
  if (originError) return { error: originError };

  const normalized = email.trim().toLowerCase();
  if (!normalized || !password) {
    return { error: 'Informe e-mail e senha.' };
  }

  const user = await queryOne<StaffRow>(
    'SELECT id, email, password_hash, role FROM staff_users WHERE email = ? LIMIT 1',
    [normalized]
  );

  if (!user || (user.role !== 'admin' && user.role !== 'editor')) {
    return { error: 'E-mail ou senha incorretos.' };
  }

  const valid = await verifyPassword(password, user.password_hash);
  if (!valid) {
    return { error: 'E-mail ou senha incorretos.' };
  }

  const role: EditorialRole = user.role;
  const token = await createSessionToken({
    id: user.id,
    email: user.email,
    role,
  });

  const store = await cookies();
  store.set(SESSION_COOKIE, token, sessionCookieOptions());
  return { ok: true };
}

export async function logoutEditorial(): Promise<void> {
  const store = await cookies();
  store.set(SESSION_COOKIE, '', { ...sessionCookieOptions(), maxAge: 0 });
}
