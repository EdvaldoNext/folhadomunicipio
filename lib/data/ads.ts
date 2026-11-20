import { cache } from 'react';
import { mapBanner } from '@/lib/db/mappers';
import { nowIso, queryAll } from '@/lib/db/client';
import type { AdBanner } from '@/lib/types';
import { logDataFetchIssue } from '@/lib/data/fetch-error';

const USE_DEV_ONLY = process.env.NEXT_PUBLIC_USE_DEV_ONLY === 'true';

/** Todos os banners ativos (uma única consulta, reutilizada por posição). */
export const getActiveAds = cache(async (): Promise<AdBanner[]> => {
  if (USE_DEV_ONLY) {
    return [];
  }

  try {
    const rows = await queryAll<Parameters<typeof mapBanner>[0]>(
      `SELECT id, placement, type, image_url, target_url, script_code, active, expires_at
       FROM ad_banners
       WHERE active = 1 AND (expires_at IS NULL OR expires_at > ?)
       ORDER BY created_at ASC`,
      [nowIso()]
    );
    return rows.map(mapBanner);
  } catch (err) {
    logDataFetchIssue('data/ads', err);
    return [];
  }
});
