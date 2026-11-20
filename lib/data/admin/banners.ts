import { mapBanner } from '@/lib/db/mappers';
import { queryAll, queryOne } from '@/lib/db/client';
import type { AdBanner } from '@/lib/types';

const BANNER_SQL = `
  SELECT id, placement, type, image_url, target_url, script_code, active, expires_at
  FROM ad_banners
`;

export async function listAllBanners(): Promise<AdBanner[]> {
  const rows = await queryAll<Parameters<typeof mapBanner>[0]>(
    `${BANNER_SQL} ORDER BY placement ASC`
  );
  return rows.map(mapBanner);
}

export async function getBannerById(id: string): Promise<AdBanner | null> {
  const row = await queryOne<Parameters<typeof mapBanner>[0]>(
    `${BANNER_SQL} WHERE id = ? LIMIT 1`,
    [id]
  );
  return row ? mapBanner(row) : null;
}
