import { asInt, queryAll, queryOne } from '@/lib/db/client';
import type { MediaKitLead } from '@/lib/types/media-kit';

export async function listMediaKitLeads(): Promise<MediaKitLead[]> {
  return queryAll<MediaKitLead>(
    `SELECT id, name, company, email, phone, message, status, created_at
     FROM media_kit_leads ORDER BY created_at DESC`
  );
}

export async function countNewMediaKitLeads(): Promise<number> {
  try {
    const row = await queryOne<{ total: number | bigint }>(
      `SELECT COUNT(*) AS total FROM media_kit_leads WHERE status = 'new'`
    );
    return asInt(row?.total);
  } catch {
    return 0;
  }
}
