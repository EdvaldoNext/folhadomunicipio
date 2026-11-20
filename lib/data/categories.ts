import { cache } from 'react';
import { mapCategory } from '@/lib/db/mappers';
import { queryAll, queryOne } from '@/lib/db/client';
import type { Category } from '@/lib/types';
import { DEV_CATEGORIES } from '@/lib/data/dev-fallback';
import { logDataFetchIssue } from '@/lib/data/fetch-error';

const USE_DEV_FALLBACK =
  process.env.NODE_ENV === 'development' &&
  process.env.NEXT_PUBLIC_USE_DEV_FALLBACK !== 'false';

const USE_DEV_ONLY = process.env.NEXT_PUBLIC_USE_DEV_ONLY === 'true';

const CATEGORY_SQL = 'SELECT id, name, slug, color_code, display_order FROM categories';

/** Todas as editorias ordenadas para o menu de navegação. */
export const getCategories = cache(async (): Promise<Category[]> => {
  if (USE_DEV_ONLY) {
    return DEV_CATEGORIES;
  }

  try {
    const rows = await queryAll<Parameters<typeof mapCategory>[0]>(
      `${CATEGORY_SQL} ORDER BY display_order ASC`
    );
    return rows.map(mapCategory);
  } catch (err) {
    if (USE_DEV_FALLBACK) {
      logDataFetchIssue('data/categories', err, { usingFallback: true });
      return DEV_CATEGORIES;
    }
    logDataFetchIssue('data/categories', err);
    return [];
  }
});

/** Editoria específica pelo slug. */
export const getCategoryBySlug = cache(
  async (slug: string): Promise<Category | null> => {
    try {
      const row = await queryOne<Parameters<typeof mapCategory>[0]>(
        `${CATEGORY_SQL} WHERE slug = ? LIMIT 1`,
        [slug]
      );
      return row ? mapCategory(row) : null;
    } catch (err) {
      if (USE_DEV_FALLBACK) {
        return DEV_CATEGORIES.find((category) => category.slug === slug) ?? null;
      }
      logDataFetchIssue('data/categories getCategoryBySlug', err);
      return null;
    }
  }
);
