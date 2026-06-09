import "server-only";
import { query } from "@/lib/db";
import { categoryMeta, type Category, type Product } from "@/lib/data";

// Build an absolute image URL from a stored path like "/uploads/abc.png".
// Images are served by the stocking app (nyit-app); NEXT_PUBLIC_UPLOADS_BASE_URL
// points at it. Returns undefined when there's no image.
function imageUrl(path: string | null): string | undefined {
  if (!path) return undefined;
  if (/^https?:\/\//i.test(path)) return path;
  const base = (process.env.NEXT_PUBLIC_UPLOADS_BASE_URL ?? "").replace(/\/$/, "");
  if (!base) return undefined;
  return `${base}${path.startsWith("/") ? "" : "/"}${path}`;
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
  image_url: string | null;
};

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
    glyph: meta?.icon ?? slug ?? "set",
    image: imageUrl(row.image_url),
  };
}

export async function getCategories(): Promise<Category[]> {
  const rows = await query<CategoryRow>(
    "SELECT id, name, slug, sort FROM categories ORDER BY sort, name",
  );
  return rows.map((row) => {
    const meta = categoryMeta[row.slug];
    return {
      id: row.slug,
      name: row.name,
      en: meta?.en ?? row.slug.toUpperCase(),
      icon: meta?.icon ?? row.slug,
      feature: meta?.feature,
    };
  });
}

export async function getProducts(): Promise<Product[]> {
  // Price, image and stock live per physical unit in `product_serials` (the
  // stocking system tracks each serial separately). For the storefront we show
  // the cheapest IN-STOCK unit's price, an image from any in-stock unit, and
  // hide products with no in-stock units. `products` itself no longer carries
  // price/image_url.
  const rows = await query<ProductRow>(
    `SELECT p.id, p.name, c.slug AS cat, c.name AS cat_name,
            p.brand, p.model, p.notes, s.price, s.image_url
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
  return rows.map(toProduct);
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
