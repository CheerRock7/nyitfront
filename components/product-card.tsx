"use client";

import { Heart, ShoppingCart } from "lucide-react";
import { baht, type Product } from "@/lib/data";
import { CategoryIcon } from "@/components/icons";
import { useCart } from "@/components/site-chrome";

const badgeLabel = {
  hot: "ขายดี",
  new: "มาใหม่",
  sale: "ลดราคา",
};

export function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();

  return (
    <article className="group flex min-h-full flex-col overflow-hidden rounded-[18px] border border-slate-200 bg-white transition hover:-translate-y-1.5 hover:border-slate-300 hover:shadow-2xl">
      <div className="relative grid aspect-[4/3] place-items-center overflow-hidden bg-slate-100">
        <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,rgba(15,23,42,.035)_0_11px,transparent_11px_22px)]" />
        {product.badge ? (
          <span className="mono absolute left-3 top-3 rounded-md bg-slate-950 px-2.5 py-1 text-[11px] font-semibold text-white">
            {badgeLabel[product.badge]}
          </span>
        ) : null}
        <button
          className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-lg border border-slate-200 bg-white/90 text-slate-700 opacity-0 transition group-hover:opacity-100"
          aria-label="ถูกใจ"
        >
          <Heart className="h-4 w-4" />
        </button>
        {product.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={product.image}
            alt={product.name}
            className="relative h-full w-full object-cover transition group-hover:scale-105"
          />
        ) : (
          <CategoryIcon name={product.glyph} className="h-20 w-20 text-slate-900/15 transition group-hover:scale-110" />
        )}
        <span className="mono absolute bottom-4 rounded-full border border-slate-200 bg-white/75 px-3 py-1 text-[11px] tracking-wide text-slate-400">
          {product.brand}{product.catEn ? ` · ${product.catEn}` : ""}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-4">
        <span className="mono text-[11px] uppercase tracking-wider text-blue-700">{product.catName}</span>
        <h3 className="mt-1 text-[15.5px] font-medium leading-snug text-slate-950">{product.name}</h3>
        <p className="mt-1 text-sm text-slate-500">{product.spec}</p>
        <div className="mt-auto flex items-end justify-between gap-3 pt-4">
          <div className="mono text-lg font-semibold text-slate-950">
            {product.was ? <span className="block text-xs font-normal text-slate-400 line-through">{baht(product.was)}</span> : null}
            {baht(product.price)}
          </div>
          <button
            onClick={() => addItem(product)}
            className="grid h-11 w-11 place-items-center rounded-xl bg-blue-50 text-blue-700 transition hover:-translate-y-0.5 hover:bg-blue-600 hover:text-white"
            aria-label="เพิ่มลงตะกร้า"
          >
            <ShoppingCart className="h-5 w-5" />
          </button>
        </div>
      </div>
    </article>
  );
}
