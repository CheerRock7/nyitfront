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
    description: "การ์ดจอสำหรับเล่นเกม งานตัดต่อ และงานกราฟิก",
  },
  {
    id: "set",
    title: "CPU Set",
    eyebrow: "Build Ready",
    href: "/builder",
    icon: "set",
    description: "ชุดคอมพร้อมใช้งาน เลือกสเปกให้เข้ากับงบ",
  },
  {
    id: "cpu",
    title: "CPU",
    eyebrow: "Processors",
    href: "/products?cat=cpu",
    icon: "cpu",
    description: "ซีพียู Intel / AMD สำหรับคอมทำงานและเกมมิ่ง",
  },
];

export function CategoryProductBanner({ products }: { products: Product[] }) {
  const [tick, setTick] = useState(0);

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

        return (
          <Link
            key={card.id}
            href={href}
            className="group flex min-h-[350px] flex-col overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:border-slate-300 hover:shadow-xl"
          >
            <div className="relative h-56 overflow-hidden bg-slate-100">
              {card.items.length ? (
                <div
                  className="flex h-full transition-transform duration-500 ease-out"
                  style={{ transform: `translateX(-${active * 100}%)` }}
                >
                  {card.items.map((product) => (
                    <div key={product.id} className="relative h-full min-w-full">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={product.image}
                        alt={product.name}
                        className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid h-full place-items-center">
                  <CategoryIcon name={card.icon} className="h-20 w-20 text-slate-900/20" />
                </div>
              )}
            </div>

            <div className="flex flex-1 flex-col p-5">
              <h2 className="line-clamp-2 text-2xl font-semibold leading-tight tracking-tight text-slate-950">
                {activeProduct?.name ?? card.title}
              </h2>

              <div className="mt-auto flex items-center justify-between pt-5">
                <span className="inline-flex items-center gap-2 text-sm font-medium text-slate-950">
                  ดูสินค้า <ChevronRight className="h-4 w-4 transition group-hover:translate-x-1" />
                </span>
                <span className="flex gap-2">
                  {(card.items.length ? card.items : [undefined, undefined, undefined]).slice(0, 5).map((item, index) => (
                    <i
                      key={item?.id ?? index}
                      className={`h-2 w-2 rounded-full transition ${index === active ? "bg-slate-950/80" : "bg-slate-300"}`}
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
