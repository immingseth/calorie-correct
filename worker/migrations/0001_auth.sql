-- Migration 0001 — auth tables
-- Creates the foundation for user accounts, sessions, and magic-link sign-in.
-- Sync data tables (weights, meals, etc.) come in a separate later migration.

-- Apply remotely with:
--   cd worker
--   npx wrangler d1 migrations apply calorie-correct-db --remote

-- =====================================================================
-- users — one row per signed-in human
-- =====================================================================
-- id is a random uuid generated in the Worker on first sign-in.
-- email is the canonical identifier (lower-cased, trimmed).
-- google_id is set only if they signed in via Google OAuth (links the
--   Google account to our user; lets us match returning Google users).
-- plan: 'free' or 'pro'. Free is default until Stripe is wired up.
-- stripe_customer_id: nullable, populated when they upgrade.
-- All timestamps are unix epoch milliseconds (matches Date.now() in JS).
CREATE TABLE IF NOT EXISTS users (
  id                   TEXT    PRIMARY KEY,
  email                TEXT    UNIQUE NOT NULL,
  name                 TEXT,
  google_id            TEXT    UNIQUE,
  plan                 TEXT    NOT NULL DEFAULT 'free',
  stripe_customer_id   TEXT,
  created_at           INTEGER NOT NULL,
  last_seen_at         INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_users_email     ON users (email);
CREATE INDEX IF NOT EXISTS idx_users_google_id ON users (google_id);

-- =====================================================================
-- sessions — long-lived browser cookies, one row per active session
-- =====================================================================
-- token is a random opaque string set as the cookie value.
--   Stored as the primary key; we look it up on every authenticated request.
-- user_id references users.id; we cascade delete sessions when a user is
--   deleted so cleanup is automatic.
-- expires_at: hard expiry. After this, the session is rejected even if
--   the cookie is still in the browser.
-- last_active_at: refreshed on every request to support sliding expiry
--   (extend session if user is active) and "log out other devices" later.
CREATE TABLE IF NOT EXISTS sessions (
  token            TEXT    PRIMARY KEY,
  user_id          TEXT    NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at       INTEGER NOT NULL,
  expires_at       INTEGER NOT NULL,
  last_active_at   INTEGER NOT NULL,
  user_agent       TEXT
);

CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions (user_id);

-- =====================================================================
-- magic_links — one-time tokens emailed to users for passwordless sign-in
-- =====================================================================
-- token is a random opaque string included in the email link.
-- email is the address we sent it to (case-normalized).
-- expires_at: typically 15 minutes after creation. After that the link is dead.
-- used_at: set when the user clicks the link. Single-use enforced by checking
--   that this is NULL before redeeming.
CREATE TABLE IF NOT EXISTS magic_links (
  token        TEXT    PRIMARY KEY,
  email        TEXT    NOT NULL,
  created_at   INTEGER NOT NULL,
  expires_at   INTEGER NOT NULL,
  used_at      INTEGER
);

CREATE INDEX IF NOT EXISTS idx_magic_links_email ON magic_links (email);
