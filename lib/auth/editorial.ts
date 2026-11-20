import { redirect } from 'next/navigation';
import { readSessionFromCookies } from '@/lib/auth/session';
import type { EditorialUser } from '@/lib/auth/types';
import { queryOne } from '@/lib/db/client';

export type { EditorialRole, EditorialUser } from '@/lib/auth/types';

/** Retorna o usuário editorial logado ou null. */
export async function getEditorialUser(): Promise<EditorialUser | null> {
  const session = await readSessionFromCookies();
  if (!session) return null;

  try {
    const row = await queryOne<{ id: string; email: string; role: string }>(
      'SELECT id, email, role FROM staff_users WHERE id = ?',
      [session.id]
    );
    if (!row || (row.role !== 'admin' && row.role !== 'editor')) return null;
    if (row.email !== session.email || row.role !== session.role) return null;
    return { id: row.id, email: row.email, role: row.role };
  } catch {
    return null;
  }
}

/** Exige usuário editorial; redireciona para login se ausente. */
export async function requireEditorialUser(): Promise<EditorialUser> {
  const user = await getEditorialUser();
  if (!user) {
    redirect('/admin/login');
  }
  return user;
}
