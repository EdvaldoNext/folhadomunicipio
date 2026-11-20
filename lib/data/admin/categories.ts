import { mapCategory } from '@/lib/db/mappers';
import { asInt, queryAll, queryOne } from '@/lib/db/client';
import type { Category } from '@/lib/types';

const CATEGORY_SQL = 'SELECT id, name, slug, color_code, display_order FROM categories';

export async function listAllCategories(): Promise<Category[]> {
  const rows = await queryAll<Parameters<typeof mapCategory>[0]>(
    `${CATEGORY_SQL} ORDER BY display_order ASC`
  );
  return rows.map(mapCategory);
}

export async function getCategoryById(id: string): Promise<Category | null> {
  const row = await queryOne<Parameters<typeof mapCategory>[0]>(
    `${CATEGORY_SQL} WHERE id = ? LIMIT 1`,
    [id]
  );
  return row ? mapCategory(row) : null;
}

export async function getCategoryPostCount(categoryId: string): Promise<number> {
  const row = await queryOne<{ total: number | bigint }>(
    'SELECT COUNT(*) AS total FROM posts WHERE category_id = ?',
    [categoryId]
  );
  return asInt(row?.total);
}
