import "server-only";
import { query } from "@/lib/db";
import { categoryMeta, type Category, type Product } from "@/lib/data";

// Build an absolute image URL from a stored path like "/uploads/abc.png".
// Images are served by the stocking app (nyit-app); NEXT_PUBLIC_UPLOADS_BASE_URL
// points at it. Returns undefined when there's no image.
function imageUrl(path: string | null): string | undefined {
  if (!path) return undefined;
  if (/^https?:\/\//i.test(path)) return path;
  const rel = path.startsWith("/") ? path : `/${path}`;
  const base = (process.env.NEXT_PUBLIC_UPLOADS_BASE_URL ?? "").replace(/\/$/, "");
  // With no base, return a same-origin relative path (e.g. "/uploads/abc.png").
  // next.config rewrites /uploads/* to the VPS, so images load over the page's
  // own origin — avoids mixed-content blocking when served over HTTPS (ngrok).
  return base ? `${base}${rel}` : rel;
}

type CategoryRow = { id: string; name: string; slug: string; sort: number };

type ProductRow = {
  id: string;
  /** Parent catalog product id (units only). */
  product_id?: string | null;
  name: string;
  cat: string | null;
  cat_name: string | null;
  brand: string | null;
  price: string;
  model: string | null;
  notes: string | null;
  serial_note: string | null;
  serial_warranty_months: number | null;
  serial_warranty_text: string | null;
  description: string | null;
  specs: [string, string][] | null;
  image_url: string | null;
  image_urls: string[] | null;
  stock_count?: number | null;
};

type BundleRow = ProductRow;

function warrantyLabel(text: string | null, months: number | null): string | undefined {
  const trimmed = text?.trim();
  if (trimmed) return `\u0e1b\u0e23\u0e30\u0e01\u0e31\u0e19 ${trimmed}`;
  if (months && months > 0) return `\u0e1b\u0e23\u0e30\u0e01\u0e31\u0e19 ${months} \u0e40\u0e14\u0e37\u0e2d\u0e19`;
  return undefined;
}

function toProduct(row: ProductRow): Product {
  const slug = row.cat ?? "";
  const meta = categoryMeta[slug];
  const images = [...new Set([row.image_url, ...(row.image_urls ?? [])].map((image) => imageUrl(image)).filter(Boolean))] as string[];
  return {
    id: String(row.id),
    productId: row.product_id ? String(row.product_id) : undefined,
    name: row.name,
    cat: slug,
    catName: row.cat_name ?? undefined,
    catEn: meta?.en,
    brand: row.brand ?? "",
    price: Number(row.price),
    spec: row.model || row.notes || "",
    notes: row.serial_note ?? (String(row.id).startsWith("bundle-") ? row.notes ?? undefined : undefined),
    warranty: warrantyLabel(row.serial_warranty_text, row.serial_warranty_months),
    description: row.description ?? undefined,
    specs: row.specs ?? undefined,
    glyph: meta?.icon ?? slug ?? "set",
    image: images[0],
    images: images.length ? images : undefined,
    stockCount: row.stock_count == null ? undefined : Number(row.stock_count),
  };
}

export async function getCategories(): Promise<Category[]> {
  const rows = await query<CategoryRow>(
    "SELECT id, name, slug, sort FROM categories ORDER BY sort, name",
  );
  const categories: Category[] = rows.map((row) => {
    const meta = categoryMeta[row.slug];
    return {
      id: row.slug,
      name: row.name,
      en: meta?.en ?? row.slug.toUpperCase(),
      icon: meta?.icon ?? row.slug,
      feature: meta?.feature,
    };
  });
  if (!categories.some((category) => category.id === "set")) {
    categories.unshift({
      id: "set",
      name: "สินค้าแบบชุด",
      en: categoryMeta.set.en,
      icon: categoryMeta.set.icon,
    });
  }
  return categories;
}

async function getBundleProducts(bundleId?: string): Promise<Product[]> {
  const rows = await query<BundleRow>(
    `SELECT ('bundle-' || b.id) AS id,
            b.name,
            'set' AS cat,
            'สินค้าแบบชุด' AS cat_name,
            'NYIT' AS brand,
            -- Same rule as the POS: minus percent, then minus flat baht per set
            -- (never below 0), then plus the assembly fee.
            (GREATEST(ROUND(COALESCE(SUM(s.price), 0) * (1 - COALESCE(b.discount_pct, 0) / 100), 2)
                      - COALESCE(b.discount_thb, 0), 0)
             + COALESCE(b.assembly_fee, 0))::text AS price,
            (COUNT(p.id)::text || ' รายการในชุด') AS model,
            -- Parts in the order the shop arranged them in the POS (bundle_items.sort).
            STRING_AGG(p.name, ' + ' ORDER BY bi.sort, p.name) AS notes,
            NULL::text AS serial_note,
            NULL::integer AS serial_warranty_months,
            NULL::text AS serial_warranty_text,
            NULL::text AS description,
            NULL::jsonb AS specs,
            (ARRAY_AGG(s.image_url ORDER BY bi.sort, p.name)
              FILTER (WHERE s.image_url IS NOT NULL))[1] AS image_url,
            ARRAY_REMOVE(ARRAY_AGG(s.image_url ORDER BY bi.sort, p.name), NULL) AS image_urls
       FROM bundles b
       LEFT JOIN bundle_items bi ON bi.bundle_id = b.id
       LEFT JOIN products p ON p.id = bi.product_id
       LEFT JOIN LATERAL (
         SELECT MIN(ps.price) AS price,
                (ARRAY_AGG(ps.image_url ORDER BY ps.price, ps.id)
                   FILTER (WHERE ps.image_url IS NOT NULL))[1] AS image_url
           FROM product_serials ps
          WHERE ps.product_id = p.id AND ps.status = 'in_stock'
          GROUP BY ps.product_id
       ) s ON true
      WHERE ($1::bigint IS NULL OR b.id = $1::bigint)
      GROUP BY b.id, b.name, b.discount_pct, b.discount_thb, b.assembly_fee
      ORDER BY b.id`,
    [bundleId ?? null],
  );
  return rows.map(toProduct);
}

// Every physical unit in stock is its own storefront item (units of the same
// product can differ in price, photos, warranty and condition). Id = "unit-<serial id>".
const UNIT_SELECT = `
  SELECT ('unit-' || ps.id) AS id, p.id::text AS product_id, p.name, c.slug AS cat, c.name AS cat_name,
         p.brand, p.model, p.notes, NULLIF(ps.note, '') AS serial_note,
         ps.warranty_months AS serial_warranty_months, NULLIF(ps.warranty_text, '') AS serial_warranty_text,
         p.description, p.specs, ps.price, ps.image_url,
         COUNT(*) OVER (PARTITION BY p.id)::int AS stock_count,
         ARRAY(
           SELECT img
             FROM jsonb_array_elements_text(
               CASE WHEN jsonb_typeof(ps.images) = 'array' THEN ps.images ELSE '[]'::jsonb END
             ) AS img
            WHERE img <> ''
         ) AS image_urls
    FROM product_serials ps
    JOIN products p ON p.id = ps.product_id
    LEFT JOIN categories c ON c.id = p.category_id
   WHERE ps.status = 'in_stock' AND p.status = 'active'`;

export async function getProducts(): Promise<Product[]> {
  const rows = await query<ProductRow>(`${UNIT_SELECT} ORDER BY p.id, ps.price, ps.id`);
  const units = rows.map(toProduct);
  const bundles = await getBundleProducts();
  return [...units, ...bundles];
}

// "unit-<id>" → that unit; "bundle-<id>" → that bundle; a bare product id (old
// links, carts and featured picks from before units were listed) → that
// product's cheapest in-stock unit.
export async function getProductById(id: string): Promise<Product | null> {
  if (id.startsWith("bundle-")) {
    const bundles = await getBundleProducts(id.replace("bundle-", ""));
    return bundles[0] ?? null;
  }
  const unitId = id.startsWith("unit-") ? id.slice(5) : null;
  if (!/^\d+$/.test(unitId ?? id)) return null;
  const rows = unitId
    ? await query<ProductRow>(`${UNIT_SELECT} AND ps.id = $1`, [unitId])
    : await query<ProductRow>(`${UNIT_SELECT} AND p.id = $1 ORDER BY ps.price, ps.id LIMIT 1`, [id]);
  return rows[0] ? toProduct(rows[0]) : null;
}

// Products grouped by category slug, for the PC builder slot pickers.
export async function getBuildParts(): Promise<Record<string, Product[]>> {
  const products = await getProducts();
  const grouped: Record<string, Product[]> = {};
  for (const product of products) {
    (grouped[product.cat] ??= []).push(product);
  }
  return grouped;
}
