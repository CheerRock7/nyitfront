-- Seed ~10 sample products into the nyit stocking DB so the website looks populated.
-- These are tagged notes = 'seed:web-demo' so they are easy to remove later.
--
-- Run as a user that can write (e.g. the postgres superuser):
--   sudo -u postgres psql -d nyit -f seed-products.sql
--
-- To REMOVE them again, run:
--   sudo -u postgres psql -d nyit -c "DELETE FROM products WHERE notes = 'seed:web-demo';"
--
-- NOTE: these rows also appear in your stocking system's product list (with 0 stock).

BEGIN;

INSERT INTO products (name, category_id, brand, model, sku, cost, price, warranty_months, status, notes)
SELECT v.name, c.id, v.brand, v.model, v.sku, v.cost, v.price, v.warranty, 'active', 'seed:web-demo'
FROM (
  VALUES
    ('RTX 4070 SUPER Gaming OC 12GB', 'gpu',        'ASUS',     'GDDR6X · 12GB · DLSS 3',          'WEB-GPU-4070S',  19000, 21900, 36),
    ('RTX 4060 Ti 8GB Dual',         'gpu',        'Gigabyte', 'GDDR6 · 8GB · DLSS 3',            'WEB-GPU-4060TI', 11500, 13900, 36),
    ('Intel Core i7-14700K',         'cpu',        'Intel',    '20 Core · 28 Thread · 5.6GHz',    'WEB-CPU-14700K', 12000, 14500, 36),
    ('AMD Ryzen 7 7800X3D',          'cpu',        'AMD',      '8 Core · 16 Thread · 3D V-Cache', 'WEB-CPU-7800X3D',12500, 14900, 36),
    ('B650 Gaming Mainboard',        'mb',         'MSI',      'AM5 · DDR5 · WiFi 6',             'WEB-MB-B650',    5200,  6490,  36),
    ('DDR5 RGB RAM 32GB (16x2) 6000','ram',        'G.SKILL',  'DDR5 · CL30 · RGB',               'WEB-RAM-DDR5-32',3400,  4290,  60),
    ('NVMe SSD 1TB Gen4',            'ssd',        'WD',       'PCIe 4.0 · 7,000 MB/s',           'WEB-SSD-1TB',    2100,  2690,  60),
    ('750W Gold Power Supply',       'psu',        'Corsair',  '80+ Gold · Full Modular',         'WEB-PSU-750G',   2500,  3290,  84),
    ('27" Gaming Monitor 165Hz',     'monitor',    'LG',       'QHD · IPS · 1ms · 165Hz',         'WEB-MON-27-165', 6500,  7990,  36),
    ('Mechanical Keyboard RGB',      'peripheral', 'Keychron', 'Hot-swap · Red Switch',           'WEB-KB-MECH',    2100,  2890,  24)
) AS v(name, slug, brand, model, sku, cost, price, warranty)
JOIN categories c ON c.slug = v.slug
-- Skip rows whose SKU already exists, so re-running is safe.
WHERE NOT EXISTS (SELECT 1 FROM products p WHERE p.sku = v.sku);

COMMIT;
