-- The stocking system moved per-unit pricing/stock to product_serials.
-- The website now needs to read it (for price, image, and in-stock status).
-- Run ONCE as the postgres superuser:
--   sudo -u postgres psql -d nyit -f grant-web-serials.sql
-- (or: sudo -u postgres psql -d nyit -c "GRANT SELECT ON product_serials TO nyit_web;")
--
-- This is SELECT-only — the website still cannot modify any stocking data.

GRANT SELECT ON product_serials TO nyit_web;
