'use server';

import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { requireEditorialUser } from '@/lib/auth/editorial';
import { ensureSameOrigin } from '@/lib/auth/origin';

const ALLOWED: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
};

const MAX_SIZE = 2 * 1024 * 1024;

export async function uploadNewsImage(
  formData: FormData
): Promise<{ url: string } | { error: string }> {
  const originError = await ensureSameOrigin();
  if (originError) return { error: originError };

  await requireEditorialUser();

  const file = formData.get('file');
  const folderRaw = formData.get('folder');
  const folder =
    typeof folderRaw === 'string' && /^[a-z0-9-]{1,32}$/.test(folderRaw)
      ? folderRaw
      : 'covers';

  if (!(file instanceof File)) {
    return { error: 'Arquivo inválido.' };
  }

  const extension = ALLOWED[file.type];
  if (!extension) return { error: 'Use JPG, PNG ou WebP.' };
  if (file.size > MAX_SIZE) return { error: 'Arquivo muito grande (máx. 2 MB).' };

  const filename = `${Date.now()}-${crypto.randomUUID()}.${extension}`;
  const directory = path.join(process.cwd(), 'public', 'uploads', folder);
  await mkdir(directory, { recursive: true });
  await writeFile(path.join(directory, filename), Buffer.from(await file.arrayBuffer()));

  return { url: `/uploads/${folder}/${filename}` };
}
