'use server';

import { getEditorialUser } from '@/lib/auth/editorial';
import { asInt, execute, queryOne } from '@/lib/db/client';

/** Zera views_count de todas as matérias. */
export async function resetDemoViewsCount(): Promise<{ updated: number }> {
  const user = await getEditorialUser();
  if (!user) {
    throw new Error('Acesso editorial necessário.');
  }

  const row = await queryOne<{ total: number | bigint }>(
    'SELECT COUNT(*) AS total FROM posts WHERE views_count <> 0'
  );
  await execute('UPDATE posts SET views_count = 0 WHERE views_count <> 0');
  return { updated: asInt(row?.total) };
}
