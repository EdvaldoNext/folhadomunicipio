'use server';

import { revalidatePath } from 'next/cache';
import { requireEditorialUser } from '@/lib/auth/editorial';
import { ensureSameOrigin } from '@/lib/auth/origin';
import { asInt, dbErrorMessage, execute, newId, queryOne } from '@/lib/db/client';
import { slugify } from '@/lib/slug';
import type { AuthorRole } from '@/lib/types';

export interface AuthorFormInput {
  name: string;
  slug: string;
  bio?: string;
  role: AuthorRole;
  instagram?: string;
  twitter?: string;
  email?: string;
  avatar_url?: string;
  user_id?: string;
}

export async function createAuthor(input: AuthorFormInput) {
  const originError = await ensureSameOrigin();
  if (originError) return { error: originError };
  await requireEditorialUser();

  try {
    await execute(
      `INSERT INTO authors (
        id, name, slug, bio, role, instagram, twitter, email, avatar_url, user_id
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        newId(),
        input.name,
        input.slug || slugify(input.name),
        input.bio || null,
        input.role,
        input.instagram || null,
        input.twitter || null,
        input.email || null,
        input.avatar_url || null,
        input.user_id || null,
      ]
    );
  } catch (err) {
    return { error: dbErrorMessage(err) };
  }

  revalidatePath('/admin/autores');
  return { ok: true };
}

export async function updateAuthor(id: string, input: AuthorFormInput) {
  const originError = await ensureSameOrigin();
  if (originError) return { error: originError };
  await requireEditorialUser();

  try {
    await execute(
      `UPDATE authors SET
        name = ?, slug = ?, bio = ?, role = ?, instagram = ?, twitter = ?,
        email = ?, avatar_url = ?, user_id = ?
       WHERE id = ?`,
      [
        input.name,
        input.slug,
        input.bio || null,
        input.role,
        input.instagram || null,
        input.twitter || null,
        input.email || null,
        input.avatar_url || null,
        input.user_id || null,
        id,
      ]
    );
  } catch (err) {
    return { error: dbErrorMessage(err) };
  }

  revalidatePath('/admin/autores');
  return { ok: true };
}

export async function deleteAuthor(id: string) {
  const originError = await ensureSameOrigin();
  if (originError) return { error: originError };
  await requireEditorialUser();

  const row = await queryOne<{ total: number | bigint }>(
    'SELECT COUNT(*) AS total FROM posts WHERE author_id = ?',
    [id]
  );
  if (asInt(row?.total) > 0) {
    return { error: 'Este autor possui notícias vinculadas.' };
  }

  try {
    await execute('DELETE FROM authors WHERE id = ?', [id]);
  } catch (err) {
    return { error: dbErrorMessage(err) };
  }

  revalidatePath('/admin/autores');
  return { ok: true };
}
