# nyitfront — Real Data Integration Design

**Date:** 2026-06-09
**Status:** Approved

## Goal

Replace the hardcoded mockup catalog in `lib/data.ts` with **live data** read from the
existing `nyit` stocking-system Postgres database on the Contabo VPS. The website becomes a
read-only mirror of the stocking system: products entered there appear on the site.

## Current state

- `nyitfront` is a Next.js 16 app, all data hardcoded in `lib/data.ts`. No DB client, no API
  routes, no env files. Deployed on the VPS as PM2 process `nyitfront` (port 3001).
- `nyit` Postgres DB (owner `nyit`) tables: `products`, `categories`, `bundles`,
  `bundle_items`, plus stocking-only tables (`sales`, `stock_movements`, `product_serials`, …).
- DB currently holds **8 categories** (`gpu, cpu, mb, ram, ssd, psu, monitor, peripheral`),
  **1 test product**, **0 bundles**. We will seed ~10 sample products.

## Decisions (from brainstorming)

1. **Connection:** direct read of the `nyit` Postgres (no intermediate API).
2. **Credentials:** dedicated read-only role `nyit_web` (SELECT only).
3. **Local dev:** real data via SSH tunnel to the VPS Postgres (no mock fallback).
4. **Seed:** insert ~10 realistic sample products tagged `notes = 'seed:web-demo'` (undoable).

## Components

### 1. Seed data (one-time, run by user)
SQL `INSERT … SELECT … JOIN categories ON slug` for ~10 products across the 8 categories,
`status='active'`, `notes='seed:web-demo'`. Plus an undo: `DELETE FROM products WHERE notes='seed:web-demo'`.

### 2. Read-only DB role (one-time, run by user)
`CREATE ROLE nyit_web LOGIN PASSWORD …` + `GRANT CONNECT`, `GRANT USAGE ON SCHEMA public`,
`GRANT SELECT` on `products, categories, bundles, bundle_items, shop_settings`.

### 3. `lib/db.ts`
`pg` connection pool from `DATABASE_URL` env. Server-only.

### 4. `lib/products.ts` (server-only)
- `getCategories()` → DB categories ordered by `sort`, merged with static presentation meta
  (English label, icon) keyed by slug.
- `getProducts()` → active products joined to category slug, mapped to the `Product` shape.
- `getBuildParts()` → active products grouped by category slug for the PC builder.

### 5. Column mapping (DB → `Product`)
| `Product` field | Source |
| --- | --- |
| `id` | `products.id` (string) |
| `name`, `brand`, `price` | direct |
| `cat` | `categories.slug` (joined) |
| `spec` | `model` ?? `notes` ?? "" |
| `glyph` | category slug (icon lookup) |
| `image` (new optional) | `image_url` → `NEXT_PUBLIC_UPLOADS_BASE_URL` + path |
| `was`, `badge`, `rating` | dropped (not in DB) |

### 6. `lib/data.ts` (keep presentation-only)
Types (`Category`, `Product`, `BuildSlot`), `categoryMeta` (slug → en/icon/feature),
`buildSlots`, `budgets`, `baht()`. Remove the hardcoded `products`/`categories` arrays and
`buildParts`.

### 7. Pages → fetch on server, pass props to client components
- `app/page.tsx` (server): fetch categories + products, render featured grid + nav.
- `app/products/page.tsx` (server): fetch products + categories, pass to `ProductsClient`.
- `app/builder/page.tsx` (server): fetch build parts, pass to `BuilderClient`.
- `ProductsClient` / `BuilderClient` accept data via props instead of importing `lib/data`
  arrays. Use `export const dynamic = "force-dynamic"` so pages render per request (DB may be
  unreachable at build).

### 8. Card image support
`ProductCard` renders `<img src={product.image}>` when present, else the existing glyph icon.
Add `peripheral → Keyboard` to the icon map.

### 9. Config
- `.env.local` (gitignored): `DATABASE_URL`, `NEXT_PUBLIC_UPLOADS_BASE_URL`.
- `.env.example` (committed): documented placeholders.
- `next.config.ts`: `serverExternalPackages: ['pg']`.
- `DEPLOY.md`: add env setup + read-only role + SSH tunnel notes.

## Empty-state behavior
- PC Sets (bundles) empty → section shows a "coming soon" empty state.
- Builder slots without DB products (`case`, `cool`) show no options gracefully.

## Out of scope
- Writing to the DB from the website (cart/checkout stays client-only/mock).
- Auth, the `bundles` PC-set feature population, image uploads.

## Verification
- `npm run build` succeeds.
- With SSH tunnel up + `.env.local`, `npm run dev` shows the 10 seeded products, category
  filters, and builder options sourced from the DB.
