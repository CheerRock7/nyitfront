"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { CategoryIcon } from "@/components/icons";
import { type Product } from "@/lib/data";

const cards = [
  {
    id: "gpu",
    title: "VGA",
    eyebrow: "Graphic Cards",
    href: "/products?cat=gpu",
    icon: "gpu",
    accent: "text-blue-700",
    description: "การ์ดจอสำหรับเล่นเกม งานตัดต่อ และงานกราฟิก",
  },
  {
    id: "set",
    title: "CPU Set",
    eyebrow: "Build Ready",
    href: "/builder",
    icon: "set",
    accent: "text-emerald-700",
    description: "ชุดคอมพร้อมใช้งาน เลือกสเปกให้เข้ากับงบ",
  },
  {
    id: "cpu",
    title: "CPU",
    eyebrow: "Processors",
    href: "/products?cat=cpu",
    icon: "cpu",
    accent: "text-violet-700",
    description: "ซีพียู Intel / AMD สำหรับคอมทำงานและเกมมิ่ง",
  },
];

export function CategoryProductBanner({ products }: { products: Product[] }) {
  const [tick, setTick] = useState(0);
  const [failed, setFailed] = useState<Record<string, boolean>>({});

  const grouped = useMemo(() => {
    return cards.map((card) => {
      const items = products.filter((product) => product.cat === card.id && product.image).slice(0, 5);
      return { ...card, items };
    });
  }, [products]);

  useEffect(() => {
    const timer = window.setInterval(() => setTick((current) => current + 1), 4200);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <section className="grid gap-5 lg:grid-cols-3">
      {grouped.map((card) => {
        const active = card.items.length ? tick % card.items.length : 0;
        const activeProduct = card.items[active];
        const href = activeProduct ? `/products/${activeProduct.id}` : card.href;

        const showImage = card.items.length > 0;

        return (
          <Link
            key={card.id}
            href={href}
            className="group flex min-h-[350px] flex-col overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:border-slate-300 hover:shadow-xl"
          >
            <div className="relative h-56 overflow-hidden bg-slate-50">
              {showImage ? (
                <div
                  className="flex h-full transition-transform duration-500 ease-out"
                  style={{ transform: `translateX(-${active * 100}%)` }}
                >
                  {card.items.map((product) =>
                    failed[product.id] ? (
                      <div key={product.id} className="grid h-full min-w-full place-items-center bg-slate-50">
                        <CategoryIcon name={card.icon} className="h-16 w-16 text-slate-900/15" />
                      </div>
                    ) : (
                      <div key={product.id} className="relative h-full min-w-full">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={product.image}
                          alt={product.name}
                          onError={() => setFailed((current) => ({ ...current, [product.id]: true }))}
                          className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105"
                        />
                      </div>
                    ),
                  )}
                </div>
              ) : (
                <div className="grid h-full place-items-center">
                  <CategoryIcon name={card.icon} className="h-20 w-20 text-slate-900/15" />
                </div>
              )}
              <span className={`mono absolute left-4 top-4 rounded-md bg-white/90 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-widest shadow-sm ${card.accent}`}>
                {card.eyebrow}
              </span>
            </div>

            <div className="flex flex-1 flex-col p-5">
              <h2 className="line-clamp-2 text-xl font-semibold leading-snug tracking-tight text-slate-950">
                {activeProduct?.name ?? card.title}
              </h2>
              <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-500">{card.description}</p>

              <div className="mt-auto flex items-center justify-between pt-5">
                <span className={`inline-flex items-center gap-1.5 text-sm font-medium ${card.accent}`}>
                  ดูสินค้า <ChevronRight className="h-4 w-4 transition group-hover:translate-x-1" />
                </span>
                <span className="flex gap-1.5">
                  {(card.items.length ? card.items : [undefined, undefined, undefined]).slice(0, 5).map((item, index) => (
                    <i
                      key={item?.id ?? index}
                      className={`h-1.5 w-1.5 rounded-full transition ${index === active ? "w-4 bg-slate-900" : "bg-slate-300"}`}
                    />
                  ))}
                </span>
              </div>
            </div>
          </Link>
        );
      })}
    </section>
  );
}
