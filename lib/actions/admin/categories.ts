'use server';

import { revalidatePath } from 'next/cache';
import { requireEditorialUser } from '@/lib/auth/editorial';
import { ensureSameOrigin } from '@/lib/auth/origin';
import { dbErrorMessage, execute, newId } from '@/lib/db/client';
import { getCategoryPostCount } from '@/lib/data/admin/categories';
import { slugify } from '@/lib/slug';

export interface CategoryFormInput {
  name: string;
  slug: string;
  color_code: string;
  display_order: number;
}

export async function createCategory(input: CategoryFormInput) {
  const originError = await ensureSameOrigin();
  if (originError) return { error: originError };
  await requireEditorialUser();

  try {
    await execute(
      `INSERT INTO categories (id, name, slug, color_code, display_order)
       VALUES (?, ?, ?, ?, ?)`,
      [
        newId(),
        input.name,
        input.slug || slugify(input.name),
        input.color_code,
        input.display_order,
      ]
    );
  } catch (err) {
    return { error: dbErrorMessage(err) };
  }

  revalidatePath('/admin/categorias');
  revalidatePath('/');
  return { ok: true };
}

export async function updateCategory(id: string, input: CategoryFormInput) {
  const originError = await ensureSameOrigin();
  if (originError) return { error: originError };
  await requireEditorialUser();

  try {
    await execute(
      `UPDATE categories SET name = ?, slug = ?, color_code = ?, display_order = ?
       WHERE id = ?`,
      [input.name, input.slug, input.color_code, input.display_order, id]
    );
  } catch (err) {
    return { error: dbErrorMessage(err) };
  }

  revalidatePath('/admin/categorias');
  revalidatePath('/');
  revalidatePath(`/editoria/${input.slug}`);
  return { ok: true };
}

export async function deleteCategory(id: string) {
  const originError = await ensureSameOrigin();
  if (originError) return { error: originError };
  await requireEditorialUser();

  const count = await getCategoryPostCount(id);
  if (count > 0) {
    return { error: `Esta editoria possui ${count} notícia(s). Remova ou mova antes de excluir.` };
  }

  try {
    await execute('DELETE FROM categories WHERE id = ?', [id]);
  } catch (err) {
    return { error: dbErrorMessage(err) };
  }

  revalidatePath('/admin/categorias');
  revalidatePath('/');
  return { ok: true };
}
