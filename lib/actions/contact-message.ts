'use server';

import { z } from 'zod';
import { dbErrorMessage, execute, newId } from '@/lib/db/client';
import { ensureSameOrigin } from '@/lib/auth/origin';
import { EDITORIAL_EMAILS } from '@/lib/site';
import type { ContactMessageChannel } from '@/lib/types/contact-message';

const channelSchema = z.enum(['redacao', 'comercial']);

const contactMessageSchema = z.object({
  channel: channelSchema,
  name: z.string().trim().min(2, 'Informe seu nome.').max(120),
  email: z.string().trim().email('E-mail inválido.').max(254),
  phone: z
    .string()
    .trim()
    .max(30)
    .optional()
    .transform((value) => value || undefined),
  subject: z.string().trim().min(2, 'Informe o assunto.').max(200),
  message: z.string().trim().min(10, 'A mensagem deve ter pelo menos 10 caracteres.').max(2000),
  website: z.string().optional().default(''),
});

export type ContactMessageInput = z.infer<typeof contactMessageSchema>;

const FALLBACK_EMAIL: Record<ContactMessageChannel, string> = {
  redacao: EDITORIAL_EMAILS.redacao,
  comercial: EDITORIAL_EMAILS.comercial,
};

export async function submitContactMessage(
  input: ContactMessageInput
): Promise<{ ok: true } | { error: string }> {
  const originError = await ensureSameOrigin();
  if (originError) return { error: originError };

  const parsed = contactMessageSchema.safeParse(input);
  if (!parsed.success) {
    const first = parsed.error.issues[0]?.message;
    return { error: first ?? 'Verifique os campos e tente novamente.' };
  }

  if (parsed.data.website.trim()) {
    return { ok: true };
  }

  try {
    await execute(
      `INSERT INTO contact_messages (id, channel, name, email, phone, subject, message)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        newId(),
        parsed.data.channel,
        parsed.data.name,
        parsed.data.email,
        parsed.data.phone ?? null,
        parsed.data.subject,
        parsed.data.message,
      ]
    );
  } catch (err) {
    console.error('[contact-message] submit:', dbErrorMessage(err));
    return {
      error: `Não foi possível enviar agora. Tente novamente ou escreva para ${FALLBACK_EMAIL[parsed.data.channel]}.`,
    };
  }

  return { ok: true };
}
