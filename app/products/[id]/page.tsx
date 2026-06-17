import { notFound } from "next/navigation";
import { ProductDetailClient } from "@/app/products/[id]/product-detail-client";
import { getProductById, getProducts } from "@/lib/products";

export const dynamic = "force-dynamic";

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [product, products] = await Promise.all([getProductById(id), getProducts()]);

  if (!product) notFound();

  const related = products
    .filter((item) => item.id !== product.id && item.cat === product.cat)
    .slice(0, 4);

  return <ProductDetailClient product={product} related={related} />;
}
