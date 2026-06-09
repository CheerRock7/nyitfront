import { Suspense } from "react";
import { ProductsClient } from "@/app/products/products-client";
import { getCategories, getProducts } from "@/lib/products";

export const dynamic = "force-dynamic";

export default async function ProductsPage() {
  const [products, categories] = await Promise.all([getProducts(), getCategories()]);
  return (
    <Suspense>
      <ProductsClient products={products} categories={categories} />
    </Suspense>
  );
}
