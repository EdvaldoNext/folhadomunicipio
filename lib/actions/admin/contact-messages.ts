'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { requireEditorialUser } from '@/lib/auth/editorial';
import { ensureSameOrigin } from '@/lib/auth/origin';
import { dbErrorMessage, execute } from '@/lib/db/client';
import type {
  ContactMessageChannel,
  ContactMessageStatus,
} from '@/lib/types/contact-message';

const statusSchema = z.enum(['new', 'contacted', 'archived']);

const REVALIDATE_PATHS: Record<ContactMessageChannel, string[]> = {
  redacao: ['/admin/redacao', '/admin'],
  comercial: ['/admin/comercial', '/admin'],
};

export async function updateContactMessageStatus(
  id: string,
  channel: ContactMessageChannel,
  status: ContactMessageStatus
): Promise<{ ok: true } | { error: string }> {
  const originError = await ensureSameOrigin();
  if (originError) return { error: originError };
  await requireEditorialUser();

  const parsedStatus = statusSchema.safeParse(status);
  if (!parsedStatus.success) {
    return { error: 'Status inválido.' };
  }

  try {
    await execute(
      'UPDATE contact_messages SET status = ? WHERE id = ? AND channel = ?',
      [parsedStatus.data, id, channel]
    );
  } catch (err) {
    return { error: dbErrorMessage(err) };
  }

  for (const path of REVALIDATE_PATHS[channel]) {
    revalidatePath(path);
  }
  return { ok: true };
}

export async function deleteContactMessage(
  id: string,
  channel: ContactMessageChannel
): Promise<{ ok: true } | { error: string }> {
  const originError = await ensureSameOrigin();
  if (originError) return { error: originError };
  await requireEditorialUser();

  try {
    await execute('DELETE FROM contact_messages WHERE id = ? AND channel = ?', [id, channel]);
  } catch (err) {
    return { error: dbErrorMessage(err) };
  }

  for (const path of REVALIDATE_PATHS[channel]) {
    revalidatePath(path);
  }
  return { ok: true };
}
