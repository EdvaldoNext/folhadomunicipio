import { cache } from 'react';
import { nowIso, queryAll } from '@/lib/db/client';
import { mapPostSummary, SUMMARY_COLUMNS } from '@/lib/db/mappers';
import type { PostSummary } from '@/lib/types';
import { getDevHomePostsData } from '@/lib/data/dev-fallback';
import { logDataFetchIssue } from '@/lib/data/fetch-error';

const USE_DEV_FALLBACK =
  process.env.NODE_ENV === 'development' &&
  process.env.NEXT_PUBLIC_USE_DEV_FALLBACK !== 'false';

const USE_DEV_ONLY = process.env.NEXT_PUBLIC_USE_DEV_ONLY === 'true';

export interface HomePostsData {
  main: PostSummary | null;
  secondary: PostSummary[];
  carousel: PostSummary[];
  mostRead: PostSummary[];
  postsByCategorySlug: Record<string, PostSummary[]>;
}

const EMPTY_HOME: HomePostsData = {
  main: null,
  secondary: [],
  carousel: [],
  mostRead: [],
  postsByCategorySlug: {},
};

/**
 * Uma única consulta para montar a Home.
 */
export const getHomePostsData = cache(async (): Promise<HomePostsData> => {
  if (USE_DEV_ONLY) {
    return getDevHomePostsData();
  }

  try {
    const rows = await queryAll<Parameters<typeof mapPostSummary>[0]>(
      `SELECT ${SUMMARY_COLUMNS}
       FROM posts p
       INNER JOIN categories c ON c.id = p.category_id
       INNER JOIN authors a ON a.id = p.author_id
       WHERE p.status = 'published' AND p.published_at <= ?
       ORDER BY p.published_at DESC
       LIMIT 60`,
      [nowIso()]
    );
    const posts = rows.map(mapPostSummary);

    const main = posts.find((post) => post.featured_position === 'main') ?? null;
    const secondary = posts
      .filter((post) => post.featured_position === 'secondary')
      .slice(0, 3);
    const carousel = posts
      .filter((post) => post.featured_position === 'carousel')
      .slice(0, 4);
    const mostRead = [...posts]
      .sort((a, b) => b.views_count - a.views_count)
      .slice(0, 5);

    const postsByCategorySlug: Record<string, PostSummary[]> = {};
    for (const post of posts) {
      const slug = post.category.slug;
      if (!postsByCategorySlug[slug]) {
        postsByCategorySlug[slug] = [];
      }
      if (postsByCategorySlug[slug].length < 4) {
        postsByCategorySlug[slug].push(post);
      }
    }

    return { main, secondary, carousel, mostRead, postsByCategorySlug };
  } catch (err) {
    if (USE_DEV_FALLBACK) {
      logDataFetchIssue('data/home', err, { usingFallback: true });
      return getDevHomePostsData();
    }
    logDataFetchIssue('data/home', err);
    return EMPTY_HOME;
  }
});
