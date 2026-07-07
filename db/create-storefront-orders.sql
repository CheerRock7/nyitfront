-- Storefront checkout orders.
-- Run this with the database owner/admin role, not the read-only nyit_web role.
-- This table is separate from stocking tables and does not mutate inventory.

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

GRANT SELECT, INSERT ON storefront_orders TO nyit_web;
