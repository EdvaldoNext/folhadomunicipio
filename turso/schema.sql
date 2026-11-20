-- Folha do Município — schema SQLite / Turso (libSQL)

CREATE TABLE IF NOT EXISTS staff_users (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL UNIQUE COLLATE NOCASE,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('admin', 'editor')),
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);

CREATE TABLE IF NOT EXISTS authors (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  avatar_url TEXT,
  bio TEXT,
  role TEXT NOT NULL DEFAULT 'journalist'
    CHECK (role IN ('journalist', 'columnist', 'editor')),
  instagram TEXT,
  twitter TEXT,
  email TEXT,
  user_id TEXT REFERENCES staff_users (id) ON DELETE SET NULL,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);

CREATE TABLE IF NOT EXISTS categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  color_code TEXT,
  display_order INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS posts (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  subtitle TEXT,
  slug TEXT NOT NULL UNIQUE,
  content TEXT NOT NULL,
  cover_image TEXT NOT NULL,
  cover_caption TEXT,
  author_id TEXT NOT NULL REFERENCES authors (id),
  category_id TEXT NOT NULL REFERENCES categories (id),
  tags TEXT NOT NULL DEFAULT '[]',
  status TEXT NOT NULL DEFAULT 'draft'
    CHECK (status IN ('draft', 'published', 'scheduled')),
  published_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  views_count INTEGER NOT NULL DEFAULT 0,
  allow_comments INTEGER NOT NULL DEFAULT 1,
  featured_position TEXT NOT NULL DEFAULT 'none'
    CHECK (featured_position IN ('main', 'secondary', 'carousel', 'none')),
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);

CREATE TABLE IF NOT EXISTS ad_banners (
  id TEXT PRIMARY KEY,
  placement TEXT NOT NULL CHECK (placement IN (
    'header_top',
    'sidebar_right',
    'sidebar_skyscraper',
    'sidebar_card_1',
    'sidebar_card_2',
    'in_content_1',
    'in_content_2',
    'popup_overlay'
  )),
  type TEXT NOT NULL DEFAULT 'image' CHECK (type IN ('image', 'script')),
  image_url TEXT,
  target_url TEXT,
  script_code TEXT,
  active INTEGER NOT NULL DEFAULT 1,
  expires_at TEXT,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);

CREATE TABLE IF NOT EXISTS media_kit_leads (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL CHECK (length(name) BETWEEN 2 AND 120),
  company TEXT NOT NULL CHECK (length(company) BETWEEN 2 AND 160),
  email TEXT NOT NULL CHECK (length(email) BETWEEN 5 AND 254),
  phone TEXT CHECK (phone IS NULL OR length(phone) <= 30),
  message TEXT CHECK (message IS NULL OR length(message) <= 2000),
  status TEXT NOT NULL DEFAULT 'new'
    CHECK (status IN ('new', 'contacted', 'archived')),
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);

CREATE TABLE IF NOT EXISTS contact_messages (
  id TEXT PRIMARY KEY,
  channel TEXT NOT NULL CHECK (channel IN ('redacao', 'comercial')),
  name TEXT NOT NULL CHECK (length(name) BETWEEN 2 AND 120),
  email TEXT NOT NULL CHECK (length(email) BETWEEN 5 AND 254),
  phone TEXT CHECK (phone IS NULL OR length(phone) <= 30),
  subject TEXT NOT NULL CHECK (length(subject) BETWEEN 2 AND 200),
  message TEXT NOT NULL CHECK (length(message) BETWEEN 10 AND 2000),
  status TEXT NOT NULL DEFAULT 'new'
    CHECK (status IN ('new', 'contacted', 'archived')),
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);

CREATE INDEX IF NOT EXISTS idx_posts_status_published_at
  ON posts (status, published_at DESC);

CREATE INDEX IF NOT EXISTS idx_posts_category_published
  ON posts (category_id, published_at DESC)
  WHERE status = 'published';

CREATE INDEX IF NOT EXISTS idx_posts_featured
  ON posts (featured_position)
  WHERE status = 'published' AND featured_position <> 'none';

CREATE INDEX IF NOT EXISTS idx_posts_views
  ON posts (views_count DESC)
  WHERE status = 'published';

CREATE INDEX IF NOT EXISTS idx_posts_author ON posts (author_id);
CREATE INDEX IF NOT EXISTS idx_authors_user ON authors (user_id);
CREATE INDEX IF NOT EXISTS idx_ad_banners_placement
  ON ad_banners (placement) WHERE active = 1;

CREATE INDEX IF NOT EXISTS idx_media_kit_leads_created_at
  ON media_kit_leads (created_at DESC);

CREATE INDEX IF NOT EXISTS idx_media_kit_leads_status
  ON media_kit_leads (status, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_contact_messages_created_at
  ON contact_messages (created_at DESC);

CREATE INDEX IF NOT EXISTS idx_contact_messages_channel_status
  ON contact_messages (channel, status, created_at DESC);
