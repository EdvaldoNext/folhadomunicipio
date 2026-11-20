import { createClient, type Client, type InValue } from '@tursodatabase/serverless/compat';

let client: Client | null = null;

export function getDb(): Client {
  if (client) return client;

  const url = process.env.TURSO_DATABASE_URL;
  const authToken = process.env.TURSO_AUTH_TOKEN;
  if (!url || !authToken) {
    throw new Error('TURSO_DATABASE_URL e TURSO_AUTH_TOKEN são obrigatórios.');
  }

  client = createClient({ url, authToken });
  return client;
}

export async function queryAll<T>(sql: string, args: InValue[] = []): Promise<T[]> {
  const result = await getDb().execute({ sql, args });
  return result.rows as unknown as T[];
}

export async function queryOne<T>(sql: string, args: InValue[] = []): Promise<T | null> {
  const rows = await queryAll<T>(sql, args);
  return rows[0] ?? null;
}

export async function execute(sql: string, args: InValue[] = []): Promise<void> {
  await getDb().execute({ sql, args });
}

export function dbErrorMessage(err: unknown): string {
  if (err instanceof Error && err.message) return err.message;
  return 'Não foi possível concluir a operação.';
}

export function newId(): string {
  return crypto.randomUUID();
}

export function asBool(value: unknown): boolean {
  return value === 1 || value === true || value === '1';
}

export function asInt(value: unknown): number {
  if (typeof value === 'number') return value;
  if (typeof value === 'bigint') return Number(value);
  if (typeof value === 'string') return Number(value) || 0;
  return 0;
}

export function parseTags(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.filter((tag): tag is string => typeof tag === 'string');
  }
  if (typeof value !== 'string' || value.length === 0) return [];
  try {
    const parsed: unknown = JSON.parse(value);
    return Array.isArray(parsed)
      ? parsed.filter((tag): tag is string => typeof tag === 'string')
      : [];
  } catch {
    return [];
  }
}

export function nowIso(): string {
  return new Date().toISOString();
}
