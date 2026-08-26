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
  serial_note: string | null;
  serial_warranty_months: number | null;
  serial_warranty_text: string | null;
  description: string | null;
  specs: [string, string][] | null;
  image_url: string | null;
  image_urls: string[] | null;
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
  const images = [...new Set([...(row.image_urls ?? []), row.image_url].map((image) => imageUrl(image)).filter(Boolean))] as string[];
  return {
    id: String(row.id),
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
            NULL::text AS serial_note,
            NULL::integer AS serial_warranty_months,
            NULL::text AS serial_warranty_text,
            NULL::text AS description,
            NULL::jsonb AS specs,
            (ARRAY_AGG(s.image_url ORDER BY p.id)
              FILTER (WHERE s.image_url IS NOT NULL))[1] AS image_url,
            ARRAY_REMOVE(ARRAY_AGG(s.image_url ORDER BY p.id), NULL) AS image_urls
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
            p.brand, p.model, p.notes, s.serial_note, s.serial_warranty_months, s.serial_warranty_text, p.description, p.specs, s.price, s.image_url, s.image_urls
       FROM products p
       LEFT JOIN categories c ON c.id = p.category_id
       JOIN LATERAL (
         SELECT MIN(ps.price) AS price,
                (ARRAY_AGG(NULLIF(ps.note, '') ORDER BY ps.price, ps.id)
                   FILTER (WHERE ps.note IS NOT NULL AND ps.note <> ''))[1] AS serial_note,
                (ARRAY_AGG(ps.warranty_months ORDER BY ps.price, ps.id))[1] AS serial_warranty_months,
                (ARRAY_AGG(NULLIF(ps.warranty_text, '') ORDER BY ps.price, ps.id))[1] AS serial_warranty_text,
                (ARRAY_AGG(ps.image_url ORDER BY ps.price, ps.id)
                   FILTER (WHERE ps.image_url IS NOT NULL))[1] AS image_url,
                ARRAY(
                  SELECT gallery.image
                    FROM (
                      SELECT ps2.image_url AS image, ps2.price, ps2.id AS serial_id, 0 AS image_order
                        FROM product_serials ps2
                       WHERE ps2.product_id = p.id AND ps2.status = 'in_stock' AND ps2.image_url IS NOT NULL
                      UNION ALL
                      SELECT img.image, ps2.price, ps2.id AS serial_id, 1 AS image_order
                        FROM product_serials ps2
                        CROSS JOIN LATERAL jsonb_array_elements_text(
                          CASE WHEN jsonb_typeof(ps2.images) = 'array' THEN ps2.images ELSE '[]'::jsonb END
                        ) AS img(image)
                       WHERE ps2.product_id = p.id AND ps2.status = 'in_stock'
                    ) gallery
                   WHERE gallery.image IS NOT NULL AND gallery.image <> ''
                   ORDER BY gallery.price, gallery.serial_id, gallery.image_order
                ) AS image_urls
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
            p.brand, p.model, p.notes, s.serial_note, s.serial_warranty_months, s.serial_warranty_text, p.description, p.specs, s.price, s.image_url, s.image_urls
       FROM products p
       LEFT JOIN categories c ON c.id = p.category_id
       JOIN LATERAL (
         SELECT MIN(ps.price) AS price,
                (ARRAY_AGG(NULLIF(ps.note, '') ORDER BY ps.price, ps.id)
                   FILTER (WHERE ps.note IS NOT NULL AND ps.note <> ''))[1] AS serial_note,
                (ARRAY_AGG(ps.warranty_months ORDER BY ps.price, ps.id))[1] AS serial_warranty_months,
                (ARRAY_AGG(NULLIF(ps.warranty_text, '') ORDER BY ps.price, ps.id))[1] AS serial_warranty_text,
                (ARRAY_AGG(ps.image_url ORDER BY ps.price, ps.id)
                   FILTER (WHERE ps.image_url IS NOT NULL))[1] AS image_url,
                ARRAY(
                  SELECT gallery.image
                    FROM (
                      SELECT ps2.image_url AS image, ps2.price, ps2.id AS serial_id, 0 AS image_order
                        FROM product_serials ps2
                       WHERE ps2.product_id = p.id AND ps2.status = 'in_stock' AND ps2.image_url IS NOT NULL
                      UNION ALL
                      SELECT img.image, ps2.price, ps2.id AS serial_id, 1 AS image_order
                        FROM product_serials ps2
                        CROSS JOIN LATERAL jsonb_array_elements_text(
                          CASE WHEN jsonb_typeof(ps2.images) = 'array' THEN ps2.images ELSE '[]'::jsonb END
                        ) AS img(image)
                       WHERE ps2.product_id = p.id AND ps2.status = 'in_stock'
                    ) gallery
                   WHERE gallery.image IS NOT NULL AND gallery.image <> ''
                   ORDER BY gallery.price, gallery.serial_id, gallery.image_order
                ) AS image_urls
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
