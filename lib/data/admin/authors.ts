import { mapAuthor } from '@/lib/db/mappers';
import { queryAll, queryOne } from '@/lib/db/client';
import type { Author } from '@/lib/types';

const AUTHOR_SQL = `
  SELECT id, name, slug, avatar_url, bio, role, instagram, twitter, email, user_id
  FROM authors
`;

export async function listAllAuthors(): Promise<Author[]> {
  const rows = await queryAll<Parameters<typeof mapAuthor>[0]>(
    `${AUTHOR_SQL} ORDER BY name ASC`
  );
  return rows.map(mapAuthor);
}

export async function getAuthorById(id: string): Promise<Author | null> {
  const row = await queryOne<Parameters<typeof mapAuthor>[0]>(
    `${AUTHOR_SQL} WHERE id = ? LIMIT 1`,
    [id]
  );
  return row ? mapAuthor(row) : null;
}
