'use server';

import { revalidatePath } from 'next/cache';
import { requireEditorialUser } from '@/lib/auth/editorial';
import { ensureSameOrigin } from '@/lib/auth/origin';
import { dbErrorMessage, execute, newId, queryOne } from '@/lib/db/client';
import { slugify } from '@/lib/slug';
import { normalizePostPublication } from '@/lib/posts/publication';
import type { FeaturedPosition, PostStatus } from '@/lib/types';

export interface PostFormInput {
  title: string;
  subtitle?: string;
  slug: string;
  content: string;
  cover_image: string;
  cover_caption?: string;
  author_id: string;
  category_id: string;
  tags: string;
  status: PostStatus;
  featured_position: FeaturedPosition;
  published_at: string;
}

function parseTags(tags: string): string {
  const list = tags
    .split(',')
    .map((tag) => tag.trim())
    .filter(Boolean);
  return JSON.stringify(list);
}

function revalidatePostPaths(categorySlug?: string, postSlug?: string) {
  revalidatePath('/');
  if (categorySlug) {
    revalidatePath(`/editoria/${categorySlug}`);
    if (postSlug) {
      revalidatePath(`/${categorySlug}/${postSlug}`);
    }
  }
  revalidatePath('/admin/posts');
  revalidatePath('/admin');
  revalidatePath('/admin/analytics');
}

async function categorySlugOf(categoryId: string): Promise<string | undefined> {
  const row = await queryOne<{ slug: string }>(
    'SELECT slug FROM categories WHERE id = ? LIMIT 1',
    [categoryId]
  );
  return row?.slug;
}

export async function createPost(input: PostFormInput) {
  const originError = await ensureSameOrigin();
  if (originError) return { error: originError };
  await requireEditorialUser();

  const slug = input.slug || slugify(input.title);
  const publication = normalizePostPublication(input.status, input.published_at);
  const id = newId();

  try {
    await execute(
      `INSERT INTO posts (
        id, title, subtitle, slug, content, cover_image, cover_caption,
        author_id, category_id, tags, status, featured_position, published_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        input.title,
        input.subtitle || null,
        slug,
        input.content,
        input.cover_image,
        input.cover_caption || null,
        input.author_id,
        input.category_id,
        parseTags(input.tags),
        publication.status,
        input.featured_position,
        publication.published_at,
      ]
    );
  } catch (err) {
    return { error: dbErrorMessage(err) };
  }

  revalidatePostPaths(await categorySlugOf(input.category_id), slug);
  return { id };
}

export async function updatePost(id: string, input: PostFormInput) {
  const originError = await ensureSameOrigin();
  if (originError) return { error: originError };
  await requireEditorialUser();

  const publication = normalizePostPublication(input.status, input.published_at);

  try {
    await execute(
      `UPDATE posts SET
        title = ?, subtitle = ?, slug = ?, content = ?, cover_image = ?, cover_caption = ?,
        author_id = ?, category_id = ?, tags = ?, status = ?, featured_position = ?,
        published_at = ?, updated_at = ?
       WHERE id = ?`,
      [
        input.title,
        input.subtitle || null,
        input.slug,
        input.content,
        input.cover_image,
        input.cover_caption || null,
        input.author_id,
        input.category_id,
        parseTags(input.tags),
        publication.status,
        input.featured_position,
        publication.published_at,
        new Date().toISOString(),
        id,
      ]
    );
  } catch (err) {
    return { error: dbErrorMessage(err) };
  }

  revalidatePostPaths(await categorySlugOf(input.category_id), input.slug);
  return { ok: true };
}

export async function deletePost(id: string) {
  const originError = await ensureSameOrigin();
  if (originError) return { error: originError };
  await requireEditorialUser();

  const post = await queryOne<{ slug: string; category_slug: string }>(
    `SELECT p.slug, c.slug AS category_slug
     FROM posts p
     INNER JOIN categories c ON c.id = p.category_id
     WHERE p.id = ? LIMIT 1`,
    [id]
  );

  try {
    await execute('DELETE FROM posts WHERE id = ?', [id]);
  } catch (err) {
    return { error: dbErrorMessage(err) };
  }

  if (post) {
    revalidatePostPaths(post.category_slug, post.slug);
  } else {
    revalidatePostPaths();
  }
  return { ok: true };
}
