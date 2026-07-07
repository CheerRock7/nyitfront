-- Storefront featured products selected by admin.
-- Run this with the database owner/admin role.
-- This table is separate from stocking tables and does not mutate inventory.

CREATE TABLE IF NOT EXISTS storefront_featured_products (
  product_id text PRIMARY KEY,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS storefront_featured_products_sort_idx
  ON storefront_featured_products (sort_order, created_at);

GRANT SELECT, INSERT, UPDATE, DELETE ON storefront_featured_products TO nyit_web;
