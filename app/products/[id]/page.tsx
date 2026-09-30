import { notFound } from "next/navigation";
import { ProductDetailClient } from "@/app/products/[id]/product-detail-client";
import { getProductById, getProducts } from "@/lib/products";

export const dynamic = "force-dynamic";

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [product, products] = await Promise.all([getProductById(id), getProducts()]);

  if (!product) notFound();

  // Other units of this same product first, then the rest of the category.
  const others = products.filter((item) => item.id !== product.id);
  const siblings = product.productId ? others.filter((item) => item.productId === product.productId) : [];
  const related = [...siblings, ...others.filter((item) => item.cat === product.cat && !siblings.includes(item))].slice(0, 4);

  return <ProductDetailClient product={product} related={related} />;
}
