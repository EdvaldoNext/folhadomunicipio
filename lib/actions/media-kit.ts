'use server';

import { z } from 'zod';
import { ensureSameOrigin } from '@/lib/auth/origin';
import { dbErrorMessage, execute, newId } from '@/lib/db/client';
import { EDITORIAL_EMAILS } from '@/lib/site';

const mediaKitLeadSchema = z.object({
  name: z.string().trim().min(2, 'Informe seu nome.').max(120),
  company: z.string().trim().min(2, 'Informe a empresa.').max(160),
  email: z.string().trim().email('E-mail inválido.').max(254),
  phone: z
    .string()
    .trim()
    .max(30)
    .optional()
    .transform((value) => value || undefined),
  message: z
    .string()
    .trim()
    .max(2000)
    .optional()
    .transform((value) => value || undefined),
  website: z.string().optional().default(''),
});

export type MediaKitLeadInput = z.infer<typeof mediaKitLeadSchema>;

export async function submitMediaKitLead(
  input: MediaKitLeadInput
): Promise<{ ok: true } | { error: string }> {
  const originError = await ensureSameOrigin();
  if (originError) return { error: originError };

  const parsed = mediaKitLeadSchema.safeParse(input);
  if (!parsed.success) {
    const first = parsed.error.issues[0]?.message;
    return { error: first ?? 'Verifique os campos e tente novamente.' };
  }

  if (parsed.data.website.trim()) {
    return { ok: true };
  }

  try {
    await execute(
      `INSERT INTO media_kit_leads (id, name, company, email, phone, message)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        newId(),
        parsed.data.name,
        parsed.data.company,
        parsed.data.email,
        parsed.data.phone ?? null,
        parsed.data.message ?? null,
      ]
    );
  } catch (err) {
    console.error('[media-kit] submit:', dbErrorMessage(err));
    return {
      error: `Não foi possível enviar agora. Tente novamente ou escreva para ${EDITORIAL_EMAILS.comercial}.`,
    };
  }

  return { ok: true };
}
