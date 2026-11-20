import { headers } from 'next/headers';

/** Garante que a Server Action partiu do próprio site. */
export async function ensureSameOrigin(): Promise<string | null> {
  const headerList = await headers();
  const origin = headerList.get('origin');
  const host = headerList.get('x-forwarded-host') ?? headerList.get('host');
  if (!origin || !host) return null;

  try {
    if (new URL(origin).host !== host) {
      return 'Origem inválida.';
    }
  } catch {
    return 'Origem inválida.';
  }

  return null;
}
