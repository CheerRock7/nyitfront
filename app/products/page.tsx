import { Suspense } from "react";
import { ProductsClient } from "@/app/products/products-client";

export default function ProductsPage() {
  return (
    <Suspense>
      <ProductsClient />
    </Suspense>
  );
}
