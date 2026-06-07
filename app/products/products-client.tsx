"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { SlidersHorizontal, X } from "lucide-react";
import { baht, categories, categoryMap, products } from "@/lib/data";
import { ProductCard } from "@/components/product-card";

export function ProductsClient() {
  const params = useSearchParams();
  const [q, setQ] = useState(params.get("q") || "");
  const [cats, setCats] = useState<Set<string>>(new Set(params.get("cat") ? [params.get("cat") as string] : []));
  const [brands, setBrands] = useState<Set<string>>(new Set());
  const [max, setMax] = useState(50000);
  const [sort, setSort] = useState("featured");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const brandList = useMemo(() => [...new Set(products.map((product) => product.brand))].sort(), []);

  const list = useMemo(() => {
    const query = q.trim().toLowerCase();
    const filtered = products.filter((product) => {
      const haystack = `${product.name} ${product.brand} ${product.spec} ${categoryMap[product.cat]?.name}`.toLowerCase();
      return (!query || haystack.includes(query)) && (!cats.size || cats.has(product.cat)) && (!brands.size || brands.has(product.brand)) && product.price <= max;
    });
    if (sort === "price-asc") filtered.sort((a, b) => a.price - b.price);
    if (sort === "price-desc") filtered.sort((a, b) => b.price - a.price);
    if (sort === "rating") filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    if (sort === "name") filtered.sort((a, b) => a.name.localeCompare(b.name));
    return filtered;
  }, [brands, cats, max, q, sort]);

  const toggle = (set: Set<string>, value: string, setter: (next: Set<string>) => void) => {
    const next = new Set(set);
    if (next.has(value)) next.delete(value);
    else next.add(value);
    setter(next);
  };

  return (
    <main>
      <section className="border-b border-slate-200 bg-white py-9">
        <div className="wrap">
          <div className="mono mb-3 text-xs text-slate-500">
            <Link href="/">หน้าแรก</Link> / สินค้าทั้งหมด
          </div>
          <h1 className="text-3xl font-semibold tracking-tight">{cats.size === 1 ? categoryMap[[...cats][0]]?.name : q ? `ผลการค้นหา "${q}"` : "สินค้าทั้งหมด"}</h1>
          <input value={q} onChange={(event) => setQ(event.target.value)} className="mt-5 h-12 w-full max-w-xl rounded-full border border-slate-300 px-5 outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100" placeholder="ค้นหา การ์ดจอ, CPU, RAM, SSD, Monitor..." />
        </div>
      </section>
      <section className="wrap grid gap-8 py-10 lg:grid-cols-[260px_1fr]">
        <aside className={`${filtersOpen ? "fixed inset-y-0 left-0 z-[90] w-[300px] overflow-y-auto bg-slate-50 p-5 shadow-2xl" : "hidden"} lg:block`}>
          <FilterGroup title="หมวดหมู่" items={categories.filter((item) => item.id !== "builder").map((item) => ({ id: item.id, label: item.name, count: products.filter((product) => product.cat === item.id).length }))} selected={cats} onToggle={(id) => toggle(cats, id, setCats)} />
          <FilterGroup title="แบรนด์" items={brandList.map((brand) => ({ id: brand, label: brand, count: products.filter((product) => product.brand === brand).length }))} selected={brands} onToggle={(id) => toggle(brands, id, setBrands)} />
          <div className="mt-5 rounded-[18px] border border-slate-200 bg-white p-5">
            <h3 className="mb-3 text-sm font-semibold">ช่วงราคา</h3>
            <input type="range" min={1000} max={50000} step={500} value={max} onChange={(event) => setMax(Number(event.target.value))} className="w-full accent-blue-600" />
            <div className="mono mt-2 text-xs text-slate-500">สูงสุด: {baht(max)}</div>
          </div>
        </aside>
        <div>
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <button onClick={() => setFiltersOpen(true)} className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-4 py-2 text-sm lg:hidden">
              <SlidersHorizontal className="h-4 w-4" /> ตัวกรอง
            </button>
            <span className="text-sm text-slate-500"><b className="mono text-slate-950">{list.length}</b> รายการ</span>
            <select value={sort} onChange={(event) => setSort(event.target.value)} className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm">
              <option value="featured">แนะนำ</option>
              <option value="price-asc">ราคา: น้อยไปมาก</option>
              <option value="price-desc">ราคา: มากไปน้อย</option>
              <option value="rating">คะแนนรีวิว</option>
              <option value="name">ชื่อ A-Z</option>
            </select>
          </div>
          <div className="mb-5 flex flex-wrap gap-2">
            {[...cats].map((cat) => <Chip key={cat} label={categoryMap[cat]?.name || cat} onRemove={() => toggle(cats, cat, setCats)} />)}
            {[...brands].map((brand) => <Chip key={brand} label={brand} onRemove={() => toggle(brands, brand, setBrands)} />)}
          </div>
          {list.length ? (
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
              {list.map((product) => <ProductCard key={product.id} product={product} />)}
            </div>
          ) : (
            <div className="rounded-[18px] border border-slate-200 bg-white p-16 text-center text-slate-500">
              <h3 className="text-lg font-semibold text-slate-950">ไม่พบสินค้าที่ตรงกับเงื่อนไข</h3>
              <p className="mt-2">ลองปรับตัวกรองหรือคำค้นหาใหม่อีกครั้ง</p>
            </div>
          )}
        </div>
      </section>
      {filtersOpen && <button className="fixed inset-0 z-[80] bg-slate-950/40 lg:hidden" onClick={() => setFiltersOpen(false)} aria-label="ปิดตัวกรอง" />}
    </main>
  );
}

function FilterGroup({ title, items, selected, onToggle }: { title: string; items: { id: string; label: string; count: number }[]; selected: Set<string>; onToggle: (id: string) => void }) {
  return (
    <div className="mt-5 rounded-[18px] border border-slate-200 bg-white p-5 first:mt-0">
      <h3 className="mb-3 text-sm font-semibold">{title}</h3>
      <div className="space-y-1">
        {items.map((item) => (
          <label key={item.id} className="flex cursor-pointer items-center gap-3 rounded-xl px-2 py-2 text-sm hover:bg-slate-50">
            <input type="checkbox" checked={selected.has(item.id)} onChange={() => onToggle(item.id)} className="h-4 w-4 accent-blue-600" />
            <span>{item.label}</span>
            <span className="mono ml-auto text-xs text-slate-400">{item.count}</span>
          </label>
        ))}
      </div>
    </div>
  );
}

function Chip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1.5 text-sm text-blue-700">
      {label}
      <button onClick={onRemove}><X className="h-3.5 w-3.5" /></button>
    </span>
  );
}
