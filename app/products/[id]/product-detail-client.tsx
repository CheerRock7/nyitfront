"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowLeft, ChevronLeft, ChevronRight, ShoppingCart } from "lucide-react";
import { baht, type Product } from "@/lib/data";
import { CategoryIcon } from "@/components/icons";
import { useCart } from "@/components/app-context";
import { ProductCard } from "@/components/product-card";
import { AdminFavoriteButton } from "@/components/admin-featured";

export function ProductDetailClient({ product, related }: { product: Product; related: Product[] }) {
  const { addItem } = useCart();
  const note = product.notes?.trim();
  const showSpec = product.spec && product.spec.trim() !== note;

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
        <ProductGallery product={product} />

        <aside className="flex min-h-[520px] flex-col rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm lg:sticky lg:top-24 lg:self-start">
          <div>
            <div className="mono text-xs uppercase tracking-[.18em] text-blue-700">{product.catName ?? product.catEn ?? "NYIT Product"}</div>
            <h1 className="mt-3 text-3xl font-semibold leading-tight tracking-tight text-slate-950">{product.name}</h1>
            {showSpec ? <p className="mt-4 leading-7 text-slate-600">{product.spec}</p> : null}
            {note ? (
              <div className="mt-4 rounded-2xl border border-blue-100 bg-blue-50/70 p-4">
                <div className="text-sm font-semibold text-blue-700">{"\u0e42\u0e19\u0e49\u0e15\u0e2a\u0e34\u0e19\u0e04\u0e49\u0e32"}</div>
                <p className="mt-1 leading-7 text-slate-700 whitespace-pre-line">{note}</p>
              </div>
            ) : null}
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

function ProductGallery({ product }: { product: Product }) {
  const images = useMemo(() => [...new Set(product.images?.length ? product.images : product.image ? [product.image] : [])], [product.image, product.images]);
  const [active, setActive] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);
  const hasImages = images.length > 0;
  const hasMultiple = images.length > 1;

  const move = (direction: 1 | -1) => {
    if (!hasMultiple) return;
    setDirection(direction);
    setActive((current) => (current + direction + images.length) % images.length);
  };

  const selectImage = (index: number) => {
    if (index === active) return;
    setDirection(index > active ? 1 : -1);
    setActive(index);
  };

  return (
    <div className="self-start rounded-[24px] border border-slate-200 bg-white p-4 shadow-sm transition-shadow duration-300 hover:shadow-md">
      <div className="relative grid min-h-[360px] place-items-center overflow-hidden rounded-[18px] bg-slate-100 p-4 md:min-h-[520px]">
        <div className="absolute inset-0 bg-[radial-gradient(60%_60%_at_50%_30%,rgba(37,99,235,.13),transparent_70%)]" />
        <AdminFavoriteButton product={product} className="absolute right-4 top-4 z-20" />
        {hasMultiple ? (
          <>
            <button
              type="button"
              onClick={() => move(-1)}
              className="absolute left-3 top-1/2 z-10 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-slate-700 shadow-sm ring-1 ring-slate-200 transition duration-200 hover:scale-105 hover:bg-white hover:text-blue-700 active:scale-95"
              aria-label="รูปก่อนหน้า"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => move(1)}
              className="absolute right-3 top-1/2 z-10 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-slate-700 shadow-sm ring-1 ring-slate-200 transition duration-200 hover:scale-105 hover:bg-white hover:text-blue-700 active:scale-95"
              aria-label="รูปถัดไป"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        ) : null}
        {hasImages ? (
          <div className="relative z-10 h-[300px] w-full md:h-[480px]">
            {images.map((image, index) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={image}
                src={image}
                alt={product.name}
                className={`absolute inset-0 h-full w-full object-contain transition-[opacity,transform,filter] duration-500 ease-out ${
                  index === active
                    ? "translate-x-0 scale-100 opacity-100 blur-0"
                    : direction === 1
                      ? "-translate-x-6 scale-[.98] opacity-0 blur-[2px]"
                      : "translate-x-6 scale-[.98] opacity-0 blur-[2px]"
                }`}
              />
            ))}
          </div>
        ) : (
          <CategoryIcon name={product.glyph} className="relative h-32 w-32 text-slate-900/15 transition duration-300" />
        )}
      </div>

      {hasImages ? (
        <div className="mt-4 flex items-center gap-3">
          <button
            type="button"
            onClick={() => move(-1)}
            disabled={!hasMultiple}
            className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-slate-200 bg-white text-slate-500 transition duration-200 hover:scale-105 hover:border-blue-300 hover:text-blue-700 active:scale-95 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:scale-100"
            aria-label="รูปก่อนหน้า"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <div className="flex min-w-0 flex-1 gap-3 overflow-x-auto pb-1">
            {images.map((image, index) => (
              <button
                key={`${image}-${index}`}
                type="button"
                onClick={() => selectImage(index)}
                className={`grid h-20 w-24 shrink-0 place-items-center overflow-hidden rounded-xl border bg-slate-100 transition duration-300 ease-out ${
                  index === active ? "scale-105 border-blue-500 shadow-md ring-4 ring-blue-100" : "border-slate-200 hover:-translate-y-0.5 hover:border-blue-300"
                }`}
                aria-label={`ดูรูปสินค้า ${index + 1}`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={image} alt={`${product.name} ${index + 1}`} className="h-full w-full object-cover transition duration-300" />
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={() => move(1)}
            disabled={!hasMultiple}
            className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-slate-200 bg-white text-slate-500 transition duration-200 hover:scale-105 hover:border-blue-300 hover:text-blue-700 active:scale-95 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:scale-100"
            aria-label="รูปถัดไป"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      ) : null}
    </div>
  );
}
