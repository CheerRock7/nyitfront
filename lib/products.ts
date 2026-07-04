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
  name: string;
  cat: string | null;
  cat_name: string | null;
  brand: string | null;
  price: string;
  model: string | null;
  notes: string | null;
  description: string | null;
  specs: [string, string][] | null;
  image_url: string | null;
};

type BundleRow = ProductRow;

function toProduct(row: ProductRow): Product {
  const slug = row.cat ?? "";
  const meta = categoryMeta[slug];
  return {
    id: String(row.id),
    name: row.name,
    cat: slug,
    catName: row.cat_name ?? undefined,
    catEn: meta?.en,
    brand: row.brand ?? "",
    price: Number(row.price),
    spec: row.model || row.notes || "",
    description: row.description ?? undefined,
    specs: row.specs ?? undefined,
    glyph: meta?.icon ?? slug ?? "set",
    image: imageUrl(row.image_url),
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
            ROUND(COALESCE(SUM(s.price), 0) * (1 - COALESCE(b.discount_pct, 0) / 100), 2)::text AS price,
            (COUNT(p.id)::text || ' รายการในชุด') AS model,
            STRING_AGG(p.name, ' + ' ORDER BY p.id) AS notes,
            NULL::text AS description,
            NULL::jsonb AS specs,
            (ARRAY_AGG(s.image_url ORDER BY p.id)
              FILTER (WHERE s.image_url IS NOT NULL))[1] AS image_url
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
      GROUP BY b.id, b.name, b.discount_pct
      ORDER BY b.id`,
    [bundleId ?? null],
  );
  return rows.map(toProduct);
}

export async function getProducts(): Promise<Product[]> {
  // Price, image and stock live per physical unit in `product_serials` (the
  // stocking system tracks each serial separately). For the storefront we show
  // the cheapest IN-STOCK unit's price, an image from any in-stock unit, and
  // hide products with no in-stock units. `products` itself no longer carries
  // price/image_url.
  const rows = await query<ProductRow>(
    `SELECT p.id, p.name, c.slug AS cat, c.name AS cat_name,
            p.brand, p.model, p.notes, p.description, p.specs, s.price, s.image_url
       FROM products p
       LEFT JOIN categories c ON c.id = p.category_id
       JOIN LATERAL (
         SELECT MIN(ps.price) AS price,
                (ARRAY_AGG(ps.image_url ORDER BY ps.price, ps.id)
                   FILTER (WHERE ps.image_url IS NOT NULL))[1] AS image_url
           FROM product_serials ps
          WHERE ps.product_id = p.id AND ps.status = 'in_stock'
          GROUP BY ps.product_id
       ) s ON true
      WHERE p.status = 'active'
      ORDER BY p.id`,
  );
  const products = rows.map(toProduct);
  const bundles = await getBundleProducts();
  return [...products, ...bundles];
}

export async function getProductById(id: string): Promise<Product | null> {
  if (id.startsWith("bundle-")) {
    const bundles = await getBundleProducts(id.replace("bundle-", ""));
    return bundles[0] ?? null;
  }

  const rows = await query<ProductRow>(
    `SELECT p.id, p.name, c.slug AS cat, c.name AS cat_name,
            p.brand, p.model, p.notes, p.description, p.specs, s.price, s.image_url
       FROM products p
       LEFT JOIN categories c ON c.id = p.category_id
       JOIN LATERAL (
         SELECT MIN(ps.price) AS price,
                (ARRAY_AGG(ps.image_url ORDER BY ps.price, ps.id)
                   FILTER (WHERE ps.image_url IS NOT NULL))[1] AS image_url
           FROM product_serials ps
          WHERE ps.product_id = p.id AND ps.status = 'in_stock'
          GROUP BY ps.product_id
       ) s ON true
      WHERE p.status = 'active' AND p.id = $1
      LIMIT 1`,
    [id],
  );
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
