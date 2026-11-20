import { queryAll, queryOne, asInt } from '@/lib/db/client';
import type { ContactMessage, ContactMessageChannel } from '@/lib/types/contact-message';

const SELECT_FIELDS =
  'id, channel, name, email, phone, subject, message, status, created_at';

export async function listContactMessages(
  channel: ContactMessageChannel
): Promise<ContactMessage[]> {
  return queryAll<ContactMessage>(
    `SELECT ${SELECT_FIELDS} FROM contact_messages
     WHERE channel = ? ORDER BY created_at DESC`,
    [channel]
  );
}

export async function countNewContactMessages(
  channel: ContactMessageChannel
): Promise<number> {
  try {
    const row = await queryOne<{ total: number | bigint }>(
      `SELECT COUNT(*) AS total FROM contact_messages
       WHERE channel = ? AND status = 'new'`,
      [channel]
    );
    return asInt(row?.total);
  } catch {
    return 0;
  }
}
