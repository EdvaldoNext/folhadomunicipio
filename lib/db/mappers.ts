import { asBool, asInt, parseTags } from '@/lib/db/client';
import type { AdBanner, Author, Category, Post, PostSummary, PostWithRelations } from '@/lib/types';

interface JoinedPostRow {
  id: string;
  title: string;
  subtitle: string | null;
  slug: string;
  content?: string;
  cover_image: string;
  cover_caption?: string | null;
  author_id: string;
  category_id: string;
  tags: string;
  status: Post['status'];
  published_at: string;
  views_count: number | bigint;
  allow_comments?: number | bigint;
  featured_position: Post['featured_position'];
  created_at?: string;
  updated_at?: string;
  category_name: string;
  category_slug: string;
  category_color: string | null;
  category_order: number | bigint;
  author_name: string;
  author_slug: string;
  author_avatar: string | null;
  author_role: Author['role'];
  author_bio?: string | null;
  author_instagram?: string | null;
  author_twitter?: string | null;
  author_email?: string | null;
}

export const PUBLIC_POST_FILTER = `p.status = 'published' AND p.published_at <= ?`;

export const SUMMARY_COLUMNS = `
  p.id, p.title, p.subtitle, p.slug, p.cover_image, p.published_at, p.views_count,
  p.featured_position, p.author_id, p.category_id, p.tags, p.status,
  c.name AS category_name, c.slug AS category_slug, c.color_code AS category_color,
  c.display_order AS category_order,
  a.name AS author_name, a.slug AS author_slug, a.avatar_url AS author_avatar, a.role AS author_role
`;

export const FULL_COLUMNS = `
  ${SUMMARY_COLUMNS},
  p.content, p.cover_caption, p.allow_comments, p.created_at, p.updated_at,
  a.bio AS author_bio, a.instagram AS author_instagram, a.twitter AS author_twitter
`;

export const ADMIN_COLUMNS = `
  ${FULL_COLUMNS},
  a.email AS author_email
`;

function categoryFrom(row: JoinedPostRow): Category {
  return {
    id: row.category_id,
    name: row.category_name,
    slug: row.category_slug,
    color_code: row.category_color,
    display_order: asInt(row.category_order),
  };
}

function authorSummaryFrom(row: JoinedPostRow): PostSummary['author'] {
  return {
    id: row.author_id,
    name: row.author_name,
    slug: row.author_slug,
    avatar_url: row.author_avatar,
    role: row.author_role,
  };
}

export function mapPostSummary(row: JoinedPostRow): PostSummary {
  return {
    id: row.id,
    title: row.title,
    subtitle: row.subtitle,
    slug: row.slug,
    cover_image: row.cover_image,
    published_at: row.published_at,
    views_count: asInt(row.views_count),
    featured_position: row.featured_position,
    category: categoryFrom(row),
    author: authorSummaryFrom(row),
  };
}

export function mapPostWithRelations(row: JoinedPostRow): PostWithRelations {
  const summary = mapPostSummary(row);
  return {
    ...summary,
    content: row.content ?? '',
    cover_caption: row.cover_caption ?? null,
    author_id: row.author_id,
    category_id: row.category_id,
    tags: parseTags(row.tags),
    status: row.status,
    allow_comments: asBool(row.allow_comments ?? 1),
    created_at: row.created_at ?? row.published_at,
    updated_at: row.updated_at ?? row.published_at,
    author: {
      ...authorSummaryFrom(row),
      bio: row.author_bio ?? null,
      instagram: row.author_instagram ?? null,
      twitter: row.author_twitter ?? null,
      email: row.author_email ?? null,
    },
  };
}

interface AuthorRow {
  id: string;
  name: string;
  slug: string;
  avatar_url: string | null;
  bio: string | null;
  role: Author['role'];
  instagram: string | null;
  twitter: string | null;
  email: string | null;
  user_id: string | null;
}

export function mapAuthor(row: AuthorRow): Author {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    avatar_url: row.avatar_url,
    bio: row.bio,
    role: row.role,
    instagram: row.instagram,
    twitter: row.twitter,
    email: row.email,
    user_id: row.user_id,
  };
}

interface CategoryRow {
  id: string;
  name: string;
  slug: string;
  color_code: string | null;
  display_order: number | bigint;
}

export function mapCategory(row: CategoryRow): Category {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    color_code: row.color_code,
    display_order: asInt(row.display_order),
  };
}

interface BannerRow {
  id: string;
  placement: AdBanner['placement'];
  type: AdBanner['type'];
  image_url: string | null;
  target_url: string | null;
  script_code: string | null;
  active: number | bigint | boolean;
  expires_at: string | null;
}

export function mapBanner(row: BannerRow): AdBanner {
  return {
    id: row.id,
    placement: row.placement,
    type: row.type,
    image_url: row.image_url,
    target_url: row.target_url,
    script_code: row.script_code,
    active: asBool(row.active),
    expires_at: row.expires_at,
  };
}
