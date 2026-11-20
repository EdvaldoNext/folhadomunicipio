'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { requireEditorialUser } from '@/lib/auth/editorial';
import { ensureSameOrigin } from '@/lib/auth/origin';
import { dbErrorMessage, execute } from '@/lib/db/client';
import type { MediaKitLeadStatus } from '@/lib/types/media-kit';

const statusSchema = z.enum(['new', 'contacted', 'archived']);

export async function updateMediaKitLeadStatus(
  id: string,
  status: MediaKitLeadStatus
): Promise<{ ok: true } | { error: string }> {
  const originError = await ensureSameOrigin();
  if (originError) return { error: originError };
  await requireEditorialUser();

  const parsedStatus = statusSchema.safeParse(status);
  if (!parsedStatus.success) {
    return { error: 'Status inválido.' };
  }

  try {
    await execute('UPDATE media_kit_leads SET status = ? WHERE id = ?', [
      parsedStatus.data,
      id,
    ]);
  } catch (err) {
    return { error: dbErrorMessage(err) };
  }

  revalidatePath('/admin/comercial');
  revalidatePath('/admin');
  return { ok: true };
}

export async function deleteMediaKitLead(
  id: string
): Promise<{ ok: true } | { error: string }> {
  const originError = await ensureSameOrigin();
  if (originError) return { error: originError };
  await requireEditorialUser();

  try {
    await execute('DELETE FROM media_kit_leads WHERE id = ?', [id]);
  } catch (err) {
    return { error: dbErrorMessage(err) };
  }

  revalidatePath('/admin/comercial');
  revalidatePath('/admin');
  return { ok: true };
}
