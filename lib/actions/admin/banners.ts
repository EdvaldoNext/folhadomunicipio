'use server';

import { revalidatePath } from 'next/cache';
import { requireEditorialUser } from '@/lib/auth/editorial';
import { ensureSameOrigin } from '@/lib/auth/origin';
import { dbErrorMessage, execute, newId } from '@/lib/db/client';
import type { AdPlacement, AdType } from '@/lib/types';

export interface BannerFormInput {
  placement: AdPlacement;
  type: AdType;
  image_url?: string;
  target_url?: string;
  script_code?: string;
  active: boolean;
  expires_at?: string;
}

export async function createBanner(input: BannerFormInput) {
  const originError = await ensureSameOrigin();
  if (originError) return { error: originError };
  await requireEditorialUser();

  try {
    await execute(
      `INSERT INTO ad_banners (
        id, placement, type, image_url, target_url, script_code, active, expires_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        newId(),
        input.placement,
        input.type,
        input.image_url || null,
        input.target_url || null,
        input.script_code || null,
        input.active ? 1 : 0,
        input.expires_at || null,
      ]
    );
  } catch (err) {
    return { error: dbErrorMessage(err) };
  }

  revalidatePath('/admin/banners');
  revalidatePath('/');
  return { ok: true };
}

export async function updateBanner(id: string, input: BannerFormInput) {
  const originError = await ensureSameOrigin();
  if (originError) return { error: originError };
  await requireEditorialUser();

  try {
    await execute(
      `UPDATE ad_banners SET
        placement = ?, type = ?, image_url = ?, target_url = ?, script_code = ?,
        active = ?, expires_at = ?
       WHERE id = ?`,
      [
        input.placement,
        input.type,
        input.image_url || null,
        input.target_url || null,
        input.script_code || null,
        input.active ? 1 : 0,
        input.expires_at || null,
        id,
      ]
    );
  } catch (err) {
    return { error: dbErrorMessage(err) };
  }

  revalidatePath('/admin/banners');
  revalidatePath('/');
  return { ok: true };
}

export async function deleteBanner(id: string) {
  const originError = await ensureSameOrigin();
  if (originError) return { error: originError };
  await requireEditorialUser();

  try {
    await execute('DELETE FROM ad_banners WHERE id = ?', [id]);
  } catch (err) {
    return { error: dbErrorMessage(err) };
  }

  revalidatePath('/admin/banners');
  revalidatePath('/');
  return { ok: true };
}
