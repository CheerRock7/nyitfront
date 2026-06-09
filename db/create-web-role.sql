-- Read-only Postgres role for the website (nyitfront).
-- Run ONCE as the postgres superuser:
--   sudo -u postgres psql -d nyit -f create-web-role.sql
-- (or paste the statements into: sudo -u postgres psql -d nyit)
--
-- IMPORTANT: change the password below, and use the SAME password in .env.local
-- (DATABASE_URL). This role can only SELECT — it cannot modify the stocking data.

CREATE ROLE nyit_web WITH LOGIN PASSWORD 'CHANGE_ME_STRONG_PASSWORD';

GRANT CONNECT ON DATABASE nyit TO nyit_web;
GRANT USAGE ON SCHEMA public TO nyit_web;
-- product_serials carries per-unit price/image/stock the storefront reads.
GRANT SELECT ON products, categories, product_serials, bundles, bundle_items, shop_settings TO nyit_web;
