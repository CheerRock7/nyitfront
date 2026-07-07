-- Storefront core tables for auth, sessions, carts, orders, settings, and featured products.
-- Run this with the database owner/admin role, not the limited nyit_web role.

CREATE TABLE IF NOT EXISTS storefront_users (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name text NOT NULL,
  username text NOT NULL,
  username_normalized text NOT NULL UNIQUE,
  email text NOT NULL,
  email_normalized text NOT NULL UNIQUE,
  phone text,
  address text,
  password_hash text NOT NULL,
  role text NOT NULL DEFAULT 'customer' CHECK (role IN ('customer', 'admin')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS storefront_users_role_idx
  ON storefront_users (role);

CREATE TABLE IF NOT EXISTS storefront_sessions (
  token_hash text PRIMARY KEY,
  user_id bigint NOT NULL REFERENCES storefront_users(id) ON DELETE CASCADE,
  expires_at timestamptz NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS storefront_sessions_user_id_idx
  ON storefront_sessions (user_id);

CREATE INDEX IF NOT EXISTS storefront_sessions_expires_at_idx
  ON storefront_sessions (expires_at);

CREATE TABLE IF NOT EXISTS storefront_carts (
  user_id bigint NOT NULL REFERENCES storefront_users(id) ON DELETE CASCADE,
  product_id text NOT NULL,
  quantity integer NOT NULL CHECK (quantity > 0),
  product_snapshot jsonb NOT NULL CHECK (jsonb_typeof(product_snapshot) = 'object'),
  updated_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, product_id)
);

CREATE TABLE IF NOT EXISTS storefront_settings (
  key text PRIMARY KEY,
  value jsonb NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS storefront_featured_products (
  product_id text PRIMARY KEY,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS storefront_featured_products_sort_idx
  ON storefront_featured_products (sort_order, created_at);

CREATE TABLE IF NOT EXISTS storefront_orders (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  order_code text NOT NULL UNIQUE DEFAULT (
    'NYIT-' ||
    to_char(clock_timestamp(), 'YYMMDD-HH24MISS') ||
    '-' ||
    upper(substr(md5(random()::text || clock_timestamp()::text), 1, 4))
  ),
  customer_name text NOT NULL,
  customer_identifier text NOT NULL,
  customer_phone text,
  customer_address text,
  status text NOT NULL DEFAULT 'pending',
  total numeric(12, 2) NOT NULL CHECK (total >= 0),
  items jsonb NOT NULL CHECK (jsonb_typeof(items) = 'array'),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS storefront_orders_created_at_idx
  ON storefront_orders (created_at DESC);

CREATE INDEX IF NOT EXISTS storefront_orders_customer_identifier_idx
  ON storefront_orders (customer_identifier);

INSERT INTO storefront_users (
  name,
  username,
  username_normalized,
  email,
  email_normalized,
  password_hash,
  role
)
VALUES (
  'Admin',
  'admin',
  'admin',
  'admin',
  'admin',
  'pbkdf2_sha256$120000$d49185e445fb822f4945853cc847a101$3871ecfe38a3ac203dbcd6d3dc8edc40da2367da0d74c25a8e7b72e0001752ab',
  'admin'
)
ON CONFLICT (username_normalized)
DO UPDATE SET
  name = EXCLUDED.name,
  username = EXCLUDED.username,
  email = EXCLUDED.email,
  email_normalized = EXCLUDED.email_normalized,
  password_hash = EXCLUDED.password_hash,
  role = EXCLUDED.role,
  updated_at = now();

GRANT SELECT, INSERT, UPDATE, DELETE ON storefront_users TO nyit_web;
GRANT SELECT, INSERT, UPDATE, DELETE ON storefront_sessions TO nyit_web;
GRANT SELECT, INSERT, UPDATE, DELETE ON storefront_carts TO nyit_web;
GRANT SELECT, INSERT, UPDATE, DELETE ON storefront_settings TO nyit_web;
GRANT SELECT, INSERT, UPDATE, DELETE ON storefront_featured_products TO nyit_web;
GRANT SELECT, INSERT, UPDATE, DELETE ON storefront_orders TO nyit_web;

GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO nyit_web;
