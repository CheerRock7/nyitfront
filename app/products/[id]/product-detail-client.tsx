"use client";

import Link from "next/link";
import { ArrowLeft, ShoppingCart } from "lucide-react";
import { baht, type Product } from "@/lib/data";
import { CategoryIcon } from "@/components/icons";
import { useCart } from "@/components/app-context";
import { ProductCard } from "@/components/product-card";
import { AdminFavoriteButton } from "@/components/admin-featured";

export function ProductDetailClient({ product, related }: { product: Product; related: Product[] }) {
  const { addItem } = useCart();

  return (
    <main className="bg-slate-50">
      <section className="border-b border-slate-200 bg-white py-5">
        <div className="wrap">
          <Link href="/products" className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-blue-700">
            <ArrowLeft className="h-4 w-4" />
            กลับไปหน้าสินค้า
          </Link>
        </div>
      </section>

      <section className="wrap grid gap-8 py-10 lg:grid-cols-[1fr_460px]">
        <div className="self-start overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-sm">
          <div className="relative grid place-items-center bg-slate-100 p-6">
            <div className="absolute inset-0 bg-[radial-gradient(60%_60%_at_50%_30%,rgba(37,99,235,.13),transparent_70%)]" />
            <AdminFavoriteButton product={product} className="absolute right-4 top-4 z-10" />
            {product.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={product.image} alt={product.name} className="relative max-h-[560px] max-w-full object-contain" />
            ) : (
              <CategoryIcon name={product.glyph} className="relative h-32 w-32 text-slate-900/15" />
            )}
          </div>
        </div>

        <aside className="flex min-h-[520px] flex-col rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm lg:sticky lg:top-24 lg:self-start">
          <div>
            <div className="mono text-xs uppercase tracking-[.18em] text-blue-700">{product.catName ?? product.catEn ?? "NYIT Product"}</div>
            <h1 className="mt-3 text-3xl font-semibold leading-tight tracking-tight text-slate-950">{product.name}</h1>
            {product.spec ? <p className="mt-4 leading-7 text-slate-600">{product.spec}</p> : null}
            {product.description ? <p className="mt-3 leading-7 text-slate-600">{product.description}</p> : null}
            {product.specs && product.specs.length > 0 ? (
              <div className="mt-4 overflow-hidden rounded-xl border border-slate-200">
                <table className="w-full text-sm">
                  <tbody>
                    {product.specs.map(([key, value], i) => (
                      <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-slate-50"}>
                        <td className="w-[42%] px-4 py-2 font-medium text-slate-500">{key}</td>
                        <td className="px-4 py-2 text-slate-800">{value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : null}

            <div className="mt-6 rounded-2xl bg-slate-50 p-5">
              <div className="text-sm text-slate-500">ราคา</div>
              <div className="mono mt-1 text-4xl font-semibold text-slate-950">{baht(product.price)}</div>
            </div>
          </div>

          <button
            onClick={() => addItem(product)}
            className="mt-auto inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-blue-600 px-6 font-medium text-white shadow-lg shadow-blue-600/20 transition hover:-translate-y-0.5 hover:bg-blue-700"
          >
            <ShoppingCart className="h-5 w-5" />
            เพิ่มลงตะกร้า
          </button>
        </aside>
      </section>

      <section className="wrap pb-16">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <p className="mono text-xs uppercase tracking-[.18em] text-blue-700">Related</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">สินค้าใกล้เคียง</h2>
          </div>
          <Link href={`/products?cat=${product.cat}`} className="hidden rounded-full border border-slate-300 bg-white px-5 py-2.5 text-sm font-medium md:inline-flex">
            ดูหมวดนี้
          </Link>
        </div>
        {related.length ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
          </div>
        ) : (
          <div className="rounded-[18px] border border-slate-200 bg-white p-8 text-center text-slate-500">ยังไม่มีสินค้าใกล้เคียง</div>
        )}
      </section>
    </main>
  );
}
