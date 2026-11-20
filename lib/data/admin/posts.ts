import { asInt, queryAll } from '@/lib/db/client';
import { ADMIN_COLUMNS, mapPostWithRelations } from '@/lib/db/mappers';
import type { Post, PostWithRelations } from '@/lib/types';

const FROM_ADMIN = `
  FROM posts p
  INNER JOIN categories c ON c.id = p.category_id
  INNER JOIN authors a ON a.id = p.author_id
`;

export async function listAllPosts(): Promise<PostWithRelations[]> {
  const rows = await queryAll<Parameters<typeof mapPostWithRelations>[0]>(
    `SELECT ${ADMIN_COLUMNS} ${FROM_ADMIN} ORDER BY p.updated_at DESC`
  );
  return rows.map(mapPostWithRelations);
}

export async function getPostById(id: string): Promise<PostWithRelations | null> {
  const rows = await queryAll<Parameters<typeof mapPostWithRelations>[0]>(
    `SELECT ${ADMIN_COLUMNS} ${FROM_ADMIN} WHERE p.id = ? LIMIT 1`,
    [id]
  );
  const row = rows[0];
  return row ? mapPostWithRelations(row) : null;
}

export async function getPostStats() {
  const rows = await queryAll<Pick<Post, 'id' | 'status'> & { views_count: number | bigint }>(
    'SELECT id, status, views_count FROM posts'
  );
  const published = rows.filter((post) => post.status === 'published').length;
  const drafts = rows.filter((post) => post.status === 'draft').length;
  const totalViews = rows.reduce((sum, post) => sum + asInt(post.views_count), 0);
  return { published, drafts, total: rows.length, totalViews };
}
