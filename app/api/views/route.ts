import { incrementPostViews } from '@/lib/data/posts';

const WINDOW_MS = 30 * 60 * 1000;
const hits = new Map<string, number>();

function clientKey(request: Request, slug: string): string {
  const forwarded = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim();
  return `${forwarded || 'local'}:${slug}`;
}

export async function POST(request: Request) {
  const origin = request.headers.get('origin');
  const host = request.headers.get('x-forwarded-host') ?? request.headers.get('host');
  if (origin && host) {
    try {
      if (new URL(origin).host !== host) {
        return Response.json({ error: 'Origem inválida.' }, { status: 403 });
      }
    } catch {
      return Response.json({ error: 'Origem inválida.' }, { status: 403 });
    }
  }

  let slug = '';
  try {
    const body: unknown = await request.json();
    if (body && typeof body === 'object' && 'slug' in body && typeof body.slug === 'string') {
      slug = body.slug;
    }
  } catch {
    return Response.json({ error: 'Pedido inválido.' }, { status: 400 });
  }

  if (!/^[\w-]{1,180}$/.test(slug)) {
    return Response.json({ error: 'Slug inválido.' }, { status: 400 });
  }

  const key = clientKey(request, slug);
  const now = Date.now();
  const previous = hits.get(key) ?? 0;
  if (now - previous < WINDOW_MS) {
    return Response.json({ ok: true });
  }

  if (hits.size > 5000) hits.clear();
  hits.set(key, now);
  await incrementPostViews(slug);
  return Response.json({ ok: true });
}
