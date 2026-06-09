# Developing nyitfront

Everything you need to run, develop, and understand this project.

## Stack

- **Next.js 16** (App Router, Turbopack) + **React 19** + **TypeScript**
- **Tailwind CSS 4** (via `@tailwindcss/postcss`)
- **lucide-react** for icons
- **pg** (node-postgres) — reads the live `nyit` stocking-system Postgres DB (read-only)

The site is a read-only front end over the stocking database: products you add in the
stocking system appear here automatically. See `DEPLOY.md` for deployment.

---

## 1. Prerequisites

- Node.js 20+ and npm
- An `ssh` client (for the database tunnel during local dev)
- The `nyit_web` database password (kept in `.env.local`, never committed)

## 2. Local development

The database only listens on the VPS's localhost, so local dev reaches it through an
**SSH tunnel**.

**Step 1 — open the tunnel** (in its own terminal window; leave it open while you work):

```bash
ssh -L 5433:localhost:5432 root@194.233.88.142
```

This forwards your PC's port **5433** to the VPS's Postgres (port 5432).

**Step 2 — create `.env.local`** in the project root (copy from `.env.example`):

```
DATABASE_URL=postgres://nyit_web:THE_PASSWORD@localhost:5433/nyit
NEXT_PUBLIC_UPLOADS_BASE_URL=http://194.233.88.142:3000
```

`.env.local` is gitignored. Replace `THE_PASSWORD` with the real `nyit_web` password.

**Step 3 — install and run:**

```bash
npm install
npm run dev            # http://127.0.0.1:3000
```

To run on port 3001 (same port the live site uses) instead:

```bash
npx next dev --hostname 127.0.0.1 --port 3001
```

> If the pages error with "DATABASE_URL is not set" or a connection timeout, the tunnel
> isn't open or `.env.local` is missing/incorrect.

## 3. Common commands

| Command | What it does |
| --- | --- |
| `npm run dev` | Dev server with hot reload (port 3000) |
| `npm run build` | Production build (`.next/`) |
| `npm start` | Run the production build locally |
| `npx tsc --noEmit` | Type-check only |

## 4. Project structure

```
app/
  layout.tsx              Root layout; fetches categories for the chrome
  page.tsx                Home (server component, fetches from DB)
  products/page.tsx       Products page (server) -> products-client.tsx (client UI)
  builder/page.tsx        PC builder (server) -> builder-client.tsx (client UI)
components/
  site-chrome.tsx         Header/footer + cart (client)
  product-card.tsx        Product card (image with icon fallback)
  icons.tsx               Category -> lucide icon map
lib/
  db.ts                   Lazy pg connection pool (reads DATABASE_URL)
  products.ts             getCategories / getProducts / getBuildParts + DB->UI mapping
  data.ts                 Presentation-only config (types, category meta, builder/budgets)
db/
  create-web-role.sql     One-time read-only role setup
  seed-products.sql       ~10 sample products (tagged notes='seed:web-demo')
docs/superpowers/specs/    Design spec for the DB integration
```

Data flow: **server component fetches from DB → passes props → client component renders.**
Client components can't query the DB directly, so all DB reads happen in `page.tsx`/`layout.tsx`.

---

## 5. Database reference

| | |
| --- | --- |
| Host (VPS) | `194.233.88.142` (Contabo, hostname `vmi2765302`, Ubuntu 24.04, root SSH) |
| Database | `nyit` |
| Port | `5432` — **localhost only** on the VPS (not exposed to the internet) |
| Owner role | `nyit` (full read/write — password not stored here; use the superuser instead) |
| App role | `nyit_web` — **read-only** (SELECT only), used by this website |
| Images | served by the stocking app (`nyit-app`) on port `3000` at `/uploads/...` |

### Tables (the website reads `products`, `categories`, `product_serials`, `bundles`, `bundle_items`, `shop_settings`)

plus stocking-only: `sales`, `sale_items`, `stock_movements`, `users`.

### `products` / `product_serials` columns

The stocking system tracks inventory **per physical unit**. `products` is the product
definition; price/sku/cost/image/warranty live on each serial in `product_serials`.

- `products`: `id, category_id, name, brand, model, low, notes,
  status ('active'|'draft'), created_by, created_at, updated_at`
- `product_serials`: `id, product_id, serial, status ('in_stock'|'draft'|...), sale_id,
  sku, cost, price, warranty_months, note, image_url, created_at`

The site shows `status='active'` products **that have at least one `in_stock` serial**
(sold-out products are hidden). Per product: `price` = lowest in-stock serial price,
`image` = an in-stock serial's `image_url`, `spec` = `model`, category from the
`categories.slug` join. (`was`/`badge`/`rating` don't exist in the DB.)

### Categories (slug)

`gpu, cpu, mb, ram, ssd, psu, monitor, peripheral`

### Accessing the database

**On the VPS as superuser (full access — for admin/edits):**

```bash
sudo -u postgres psql -d nyit
\dt                 # list tables
\d products         # describe a table
```

**As the read-only web role** (on the VPS, or via the tunnel from your PC):

```bash
psql postgres://nyit_web:THE_PASSWORD@localhost:5432/nyit      # on the VPS
psql postgres://nyit_web:THE_PASSWORD@localhost:5433/nyit      # from your PC, tunnel open
```

A GUI (DBeaver, pgAdmin, TablePlus) works too — point it at `localhost:5433` with user
`nyit_web` while the tunnel is open.

### Sample data

The 10 seeded demo products are tagged `notes='seed:web-demo'`. Remove them anytime:

```sql
DELETE FROM products WHERE notes = 'seed:web-demo';
```

### Managing the web role

```sql
-- change the read-only password (do this as superuser):
ALTER ROLE nyit_web WITH PASSWORD 'new-password';
-- then update DATABASE_URL in .env.local (local) and on the VPS.

-- the role's grants (already applied once):
GRANT SELECT ON products, categories, bundles, bundle_items, shop_settings TO nyit_web;
```

---

## 6. Security notes

- **Never commit secrets.** `.env.local` is gitignored; this repo is **public**.
- The `nyit_web` role is read-only and the DB port is not internet-exposed, so a leaked
  password is low-risk — but still rotate it from the demo value to something strong.
- The website cannot modify stocking data by design (SELECT-only role).
