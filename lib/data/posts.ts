import { cache } from 'react';
import { nowIso, queryAll, queryOne } from '@/lib/db/client';
import {
  FULL_COLUMNS,
  mapPostSummary,
  mapPostWithRelations,
  PUBLIC_POST_FILTER,
  SUMMARY_COLUMNS,
} from '@/lib/db/mappers';
import type { PostSummary, PostWithRelations } from '@/lib/types';
import { logDataFetchIssue } from '@/lib/data/fetch-error';
import {
  getDevCarouselPosts,
  getDevLatestPosts,
  getDevMostRead,
  getDevPostBySlug,
  getDevPostsByCategory,
} from '@/lib/data/dev-fallback';

const USE_DEV_FALLBACK =
  process.env.NODE_ENV === 'development' &&
  process.env.NEXT_PUBLIC_USE_DEV_FALLBACK !== 'false';

const FROM_PUBLIC = `
  FROM posts p
  INNER JOIN categories c ON c.id = p.category_id
  INNER JOIN authors a ON a.id = p.author_id
  WHERE ${PUBLIC_POST_FILTER}
`;

/** Manchete principal da Home. */
export const getMainHeadline = cache(async (): Promise<PostSummary | null> => {
  try {
    const row = await queryOne<Parameters<typeof mapPostSummary>[0]>(
      `SELECT ${SUMMARY_COLUMNS} ${FROM_PUBLIC} AND p.featured_position = 'main'
       ORDER BY p.published_at DESC LIMIT 1`,
      [nowIso()]
    );
    return row ? mapPostSummary(row) : null;
  } catch (err) {
    logDataFetchIssue('data/posts getMainHeadline', err);
    return null;
  }
});

/** Destaques secundários ao lado da manchete. */
export const getSecondaryHighlights = cache(async (limit = 3): Promise<PostSummary[]> => {
  try {
    const rows = await queryAll<Parameters<typeof mapPostSummary>[0]>(
      `SELECT ${SUMMARY_COLUMNS} ${FROM_PUBLIC} AND p.featured_position = 'secondary'
       ORDER BY p.published_at DESC LIMIT ?`,
      [nowIso(), limit]
    );
    return rows.map(mapPostSummary);
  } catch (err) {
    logDataFetchIssue('data/posts getSecondaryHighlights', err);
    return [];
  }
});

/** Posts do carrossel de opinião/colunistas. */
export const getCarouselPosts = cache(async (limit = 6): Promise<PostSummary[]> => {
  try {
    const rows = await queryAll<Parameters<typeof mapPostSummary>[0]>(
      `SELECT ${SUMMARY_COLUMNS} ${FROM_PUBLIC} AND p.featured_position = 'carousel'
       ORDER BY p.published_at DESC LIMIT ?`,
      [nowIso(), limit]
    );
    const posts = rows.map(mapPostSummary);
    if (posts.length === 0 && USE_DEV_FALLBACK) return getDevCarouselPosts(limit);
    return posts;
  } catch (err) {
    if (USE_DEV_FALLBACK) {
      logDataFetchIssue('data/posts getCarouselPosts', err, { usingFallback: true });
      return getDevCarouselPosts(limit);
    }
    logDataFetchIssue('data/posts getCarouselPosts', err);
    return [];
  }
});

/** Últimas notícias de uma editoria. */
export const getPostsByCategory = cache(async (
  categorySlug: string,
  limit = 4,
  offset = 0
): Promise<PostSummary[]> => {
  try {
    const rows = await queryAll<Parameters<typeof mapPostSummary>[0]>(
      `SELECT ${SUMMARY_COLUMNS} ${FROM_PUBLIC} AND c.slug = ?
       ORDER BY p.published_at DESC LIMIT ? OFFSET ?`,
      [nowIso(), categorySlug, limit, offset]
    );
    const posts = rows.map(mapPostSummary);
    if (posts.length === 0 && USE_DEV_FALLBACK) {
      return getDevPostsByCategory(categorySlug, limit, offset);
    }
    return posts;
  } catch (err) {
    if (USE_DEV_FALLBACK) {
      logDataFetchIssue('data/posts getPostsByCategory', err, { usingFallback: true });
      return getDevPostsByCategory(categorySlug, limit, offset);
    }
    logDataFetchIssue('data/posts getPostsByCategory', err);
    return [];
  }
});

/** Ranking de mais lidas (sidebar). */
export const getMostRead = cache(async (limit = 5): Promise<PostSummary[]> => {
  try {
    const rows = await queryAll<Parameters<typeof mapPostSummary>[0]>(
      `SELECT ${SUMMARY_COLUMNS} ${FROM_PUBLIC}
       ORDER BY p.views_count DESC LIMIT ?`,
      [nowIso(), limit]
    );
    const posts = rows.map(mapPostSummary);
    if (posts.length === 0 && USE_DEV_FALLBACK) return getDevMostRead(limit);
    return posts;
  } catch (err) {
    if (USE_DEV_FALLBACK) {
      logDataFetchIssue('data/posts getMostRead', err, { usingFallback: true });
      return getDevMostRead(limit);
    }
    logDataFetchIssue('data/posts getMostRead', err);
    return [];
  }
});

/** Últimas notícias gerais. */
export const getLatestPosts = cache(async (limit = 10): Promise<PostSummary[]> => {
  try {
    const rows = await queryAll<Parameters<typeof mapPostSummary>[0]>(
      `SELECT ${SUMMARY_COLUMNS} ${FROM_PUBLIC}
       ORDER BY p.published_at DESC LIMIT ?`,
      [nowIso(), limit]
    );
    const posts = rows.map(mapPostSummary);
    if (posts.length === 0 && USE_DEV_FALLBACK) return getDevLatestPosts(limit);
    return posts;
  } catch (err) {
    if (USE_DEV_FALLBACK) {
      logDataFetchIssue('data/posts getLatestPosts', err, { usingFallback: true });
      return getDevLatestPosts(limit);
    }
    logDataFetchIssue('data/posts getLatestPosts', err);
    return [];
  }
});

/** Notícia completa para a página interna. */
export const getPostBySlug = cache(async (
  slug: string
): Promise<PostWithRelations | null> => {
  try {
    const row = await queryOne<Parameters<typeof mapPostWithRelations>[0]>(
      `SELECT ${FULL_COLUMNS} ${FROM_PUBLIC} AND p.slug = ? LIMIT 1`,
      [nowIso(), slug]
    );
    if (row) return mapPostWithRelations(row);
    return USE_DEV_FALLBACK ? getDevPostBySlug(slug) : null;
  } catch (err) {
    if (USE_DEV_FALLBACK) {
      logDataFetchIssue('data/posts getPostBySlug', err, { usingFallback: true });
      return getDevPostBySlug(slug);
    }
    logDataFetchIssue('data/posts getPostBySlug', err);
    return null;
  }
});

/** Notícias relacionadas (mesma editoria, exclui a atual). */
export const getRelatedPosts = cache(async (
  categorySlug: string,
  excludeId: string,
  limit = 4
): Promise<PostSummary[]> => {
  try {
    const rows = await queryAll<Parameters<typeof mapPostSummary>[0]>(
      `SELECT ${SUMMARY_COLUMNS} ${FROM_PUBLIC} AND c.slug = ? AND p.id <> ?
       ORDER BY p.published_at DESC LIMIT ?`,
      [nowIso(), categorySlug, excludeId, limit]
    );
    const posts = rows.map(mapPostSummary);
    if (posts.length === 0 && USE_DEV_FALLBACK) {
      return getDevPostsByCategory(categorySlug, limit + 1)
        .filter((post) => post.id !== excludeId)
        .slice(0, limit);
    }
    return posts;
  } catch (err) {
    if (USE_DEV_FALLBACK) {
      logDataFetchIssue('data/posts getRelatedPosts', err, { usingFallback: true });
      return getDevPostsByCategory(categorySlug, limit + 1)
        .filter((post) => post.id !== excludeId)
        .slice(0, limit);
    }
    logDataFetchIssue('data/posts getRelatedPosts', err);
    return [];
  }
});

/** Incrementa o contador de visualizações de uma matéria publicada. */
export async function incrementPostViews(slug: string): Promise<void> {
  try {
    const { execute } = await import('@/lib/db/client');
    await execute(
      `UPDATE posts SET views_count = views_count + 1
       WHERE slug = ? AND status = 'published' AND published_at <= ?`,
      [slug, nowIso()]
    );
  } catch (err) {
    logDataFetchIssue('data/posts incrementPostViews', err);
  }
}
