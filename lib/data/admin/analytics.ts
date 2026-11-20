import { asInt, queryAll } from '@/lib/db/client';

export interface PostViewRow {
  id: string;
  title: string;
  slug: string;
  views_count: number;
  published_at: string;
  category: { name: string; slug: string };
}

interface AnalyticsRow {
  id: string;
  title: string;
  slug: string;
  views_count: number | bigint;
  published_at: string;
  category_name: string;
  category_slug: string;
}

function mapRow(row: AnalyticsRow): PostViewRow {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    views_count: asInt(row.views_count),
    published_at: row.published_at,
    category: { name: row.category_name, slug: row.category_slug },
  };
}

export async function getViewsAnalytics() {
  const rows = (
    await queryAll<AnalyticsRow>(
      `SELECT p.id, p.title, p.slug, p.views_count, p.published_at,
              c.name AS category_name, c.slug AS category_slug
       FROM posts p
       INNER JOIN categories c ON c.id = p.category_id
       WHERE p.status = 'published'
       ORDER BY p.views_count DESC`
    )
  ).map(mapRow);

  const totalViews = rows.reduce((sum, row) => sum + row.views_count, 0);
  const averageViews = rows.length > 0 ? Math.round(totalViews / rows.length) : 0;

  return {
    rows,
    totalViews,
    averageViews,
    top10: rows.slice(0, 10),
  };
}

export async function getTopPosts(limit = 5) {
  const rows = await queryAll<AnalyticsRow>(
    `SELECT p.id, p.title, p.slug, p.views_count, p.published_at,
            c.name AS category_name, c.slug AS category_slug
     FROM posts p
     INNER JOIN categories c ON c.id = p.category_id
     WHERE p.status = 'published'
     ORDER BY p.views_count DESC
     LIMIT ?`,
    [limit]
  );
  return rows.map(mapRow);
}
