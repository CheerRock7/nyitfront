import { AdminDashboardClient } from "@/components/admin-featured";
import { type Product } from "@/lib/data";
import { getProducts } from "@/lib/products";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  let products: Product[] = [];
  try {
    products = await getProducts();
  } catch {
    products = [];
  }

  return <AdminDashboardClient products={products} />;
}
