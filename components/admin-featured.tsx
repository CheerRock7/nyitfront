"use client";

import Link from "next/link";
import { ChevronLeft, ChevronRight, ImagePlus, Search, Star, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { baht, type Product } from "@/lib/data";
import { CategoryIcon } from "@/components/icons";
import { useAuth } from "@/components/app-context";
import { PromotionBannerEditor } from "@/components/promotion-banner";

const CHANGE_EVENT = "nyit-admin-featured-change";
let featuredIdsCache: string[] = [];
let featuredLoaded = false;
let featuredSaving = false;
let featuredError = "";
const featuredListeners = new Set<() => void>();

export function isAdminUser(user: { name?: string; email?: string; username?: string; role?: string } | null) {
  return user?.role === "admin";
}

function notifyFeaturedChange() {
  if (typeof window !== "undefined") window.dispatchEvent(new Event(CHANGE_EVENT));
  for (const listener of featuredListeners) listener();
}

async function loadFeaturedIds() {
  try {
    const response = await fetch("/api/admin/featured", { cache: "no-store" });
    const payload = (await response.json().catch(() => null)) as { ids?: string[]; error?: string } | null;
    if (!response.ok) throw new Error(payload?.error ?? "โหลดสินค้าติดดาวไม่สำเร็จ");
    featuredIdsCache = Array.isArray(payload?.ids) ? payload.ids.map(String) : [];
    featuredError = "";
  } catch (error) {
    featuredError = error instanceof Error ? error.message : "โหลดสินค้าติดดาวไม่สำเร็จ";
  } finally {
    featuredLoaded = true;
    notifyFeaturedChange();
  }
}

async function saveFeaturedIds(ids: string[]) {
  const previous = featuredIdsCache;
  featuredIdsCache = ids;
  featuredSaving = true;
  featuredError = "";
  notifyFeaturedChange();

  try {
    const response = await fetch("/api/admin/featured", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids }),
    });
    const payload = (await response.json().catch(() => null)) as { ids?: string[]; error?: string } | null;
    if (!response.ok) throw new Error(payload?.error ?? "บันทึกสินค้าติดดาวไม่สำเร็จ");
    featuredIdsCache = Array.isArray(payload?.ids) ? payload.ids.map(String) : ids;
  } catch (error) {
    featuredIdsCache = previous;
    featuredError = error instanceof Error ? error.message : "บันทึกสินค้าติดดาวไม่สำเร็จ";
  } finally {
    featuredSaving = false;
    featuredLoaded = true;
    notifyFeaturedChange();
  }
}

export function useAdminFeaturedIds() {
  const [, refresh] = useState(0);

  useEffect(() => {
    const sync = () => refresh((value) => value + 1);
    featuredListeners.add(sync);
    window.addEventListener(CHANGE_EVENT, sync);
    if (!featuredLoaded) void loadFeaturedIds();
    return () => {
      featuredListeners.delete(sync);
      window.removeEventListener(CHANGE_EVENT, sync);
    };
  }, []);

  const toggle = (productId: string) => {
    const next = featuredIdsCache.includes(productId) ? featuredIdsCache.filter((id) => id !== productId) : [...featuredIdsCache, productId];
    void saveFeaturedIds(next);
  };

  const remove = (productId: string) => {
    const next = featuredIdsCache.filter((id) => id !== productId);
    void saveFeaturedIds(next);
  };

  return { ids: featuredIdsCache, toggle, remove, loading: !featuredLoaded, saving: featuredSaving, error: featuredError };
}

export function AdminFavoriteButton({ product, className = "" }: { product: Product; className?: string }) {
  const { user } = useAuth();
  const { ids, toggle, saving } = useAdminFeaturedIds();
  const isAdmin = isAdminUser(user);
  const active = ids.includes(product.id);

  if (!isAdmin) return null;

  return (
    <button
      type="button"
      disabled={saving}
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        toggle(product.id);
      }}
      className={`grid h-9 w-9 place-items-center rounded-lg border bg-white/95 shadow-sm transition hover:-translate-y-0.5 ${
        active ? "border-amber-300 text-amber-500" : "border-slate-200 text-slate-500 hover:text-amber-500"
      } ${className}`}
      aria-label={active ? "เอาออกจากสินค้าแนะนำ" : "ติดดาวเป็นสินค้าแนะนำ"}
      title={active ? "เอาออกจากสินค้าแนะนำ" : "ติดดาวเป็นสินค้าแนะนำ"}
    >
      <Star className={`h-4 w-4 ${active ? "fill-current" : ""}`} />
    </button>
  );
}

export function RecommendedProductsCarousel({ products }: { products: Product[] }) {
  const { ids } = useAdminFeaturedIds();
  const [visible, setVisible] = useState(4);
  const [active, setActive] = useState(0);

  const list = useMemo(() => {
    const productMap = new Map(products.map((product) => [product.id, product]));
    const selected = ids.map((id) => productMap.get(id)).filter(Boolean) as Product[];
    return selected.length ? selected : products.slice(0, 8);
  }, [ids, products]);

  const total = list.length;
  const maxStart = Math.max(0, total - visible);
  const cardWidth = 100 / visible;

  useEffect(() => {
    const updateVisible = () => {
      if (window.matchMedia("(min-width: 1280px)").matches) setVisible(4);
      else if (window.matchMedia("(min-width: 768px)").matches) setVisible(2);
      else setVisible(1);
    };
    updateVisible();
    window.addEventListener("resize", updateVisible);
    return () => window.removeEventListener("resize", updateVisible);
  }, []);

  useEffect(() => {
    setActive((current) => Math.min(current, maxStart));
  }, [maxStart]);

  useEffect(() => {
    if (total <= visible) return;
    const timer = window.setInterval(() => setActive((current) => (current >= maxStart ? 0 : current + 1)), 5000);
    return () => window.clearInterval(timer);
  }, [maxStart, total, visible]);

  if (!total) {
    return (
      <div className="grid min-h-[220px] place-items-center rounded-lg border border-dashed border-slate-300 bg-white p-8 text-center">
        <div>
          <Star className="mx-auto h-9 w-9 text-slate-300" />
          <p className="mt-4 font-medium text-slate-950">ยังไม่มีสินค้าแนะนำ</p>
          <p className="mt-1 text-sm text-slate-500">เข้าสู่ระบบ admin แล้วติดดาวสินค้าที่ต้องการแสดงตรงนี้</p>
        </div>
      </div>
    );
  }

  const move = (direction: 1 | -1) => {
    setActive((current) => {
      if (direction > 0) return current >= maxStart ? 0 : current + 1;
      return current <= 0 ? maxStart : current - 1;
    });
  };

  return (
    <div className="relative" data-testid="recommended-products-carousel">
      <div className="overflow-hidden">
        <div className="flex transition-transform duration-500 ease-out" style={{ transform: `translateX(-${active * cardWidth}%)` }}>
          {list.map((product) => (
            <div key={product.id} className="shrink-0 px-2.5" style={{ flexBasis: `${cardWidth}%` }}>
              <FeaturedProductTile product={product} />
            </div>
          ))}
        </div>
      </div>
      {total > visible ? (
        <>
          <button
            type="button"
            aria-label="สินค้าแนะนำก่อนหน้า"
            title="สินค้าแนะนำก่อนหน้า"
            onClick={() => move(-1)}
            className="absolute -left-3 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-lg bg-white text-slate-950 shadow-md ring-1 ring-slate-200 transition hover:bg-slate-50"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            aria-label="สินค้าแนะนำถัดไป"
            title="สินค้าแนะนำถัดไป"
            onClick={() => move(1)}
            className="absolute -right-3 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-lg bg-white text-slate-950 shadow-md ring-1 ring-slate-200 transition hover:bg-slate-50"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </>
      ) : null}
    </div>
  );
}

function FeaturedProductTile({ product }: { product: Product }) {
  return (
    <article className="group flex min-h-full flex-col overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:border-slate-300 hover:shadow-xl">
      <Link href={`/products/${product.id}`} className="relative grid aspect-[4/3] place-items-center overflow-hidden bg-slate-100">
        {product.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={product.image} alt={product.name} className="h-full w-full object-cover transition group-hover:scale-105" />
        ) : (
          <CategoryIcon name={product.glyph} className="h-20 w-20 text-slate-900/15" />
        )}
        <AdminFavoriteButton product={product} className="absolute right-3 top-3 opacity-0 group-hover:opacity-100" />
      </Link>
      <div className="flex flex-1 flex-col p-4">
        <Link href={`/products/${product.id}`} className="block">
          <span className="mono text-[11px] uppercase tracking-wider text-blue-700">{product.catName ?? product.catEn}</span>
          <h3 className="mt-1 line-clamp-2 text-[15px] font-medium leading-snug text-slate-950 transition group-hover:text-blue-700">{product.name}</h3>
        </Link>
        <div className="mono mt-auto pt-4 text-lg font-semibold text-slate-950">{baht(product.price)}</div>
      </div>
    </article>
  );
}

export function AdminDashboardClient({ products }: { products: Product[] }) {
  const { user } = useAuth();
  const { ids, toggle, remove, loading, saving, error } = useAdminFeaturedIds();
  const [query, setQuery] = useState("");
  const [section, setSection] = useState<"featured" | "banner">("featured");
  const admin = isAdminUser(user);
  const productMap = useMemo(() => new Map(products.map((product) => [product.id, product])), [products]);
  const featured = ids.map((id) => productMap.get(id)).filter(Boolean) as Product[];
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return products;
    return products.filter((product) => `${product.name} ${product.brand} ${product.catName} ${product.catEn}`.toLowerCase().includes(q));
  }, [products, query]);

  if (!admin) {
    return (
      <main className="wrap py-12">
        <div className="rounded-lg border border-slate-200 bg-white p-8">
          <p className="mono text-xs uppercase tracking-[.18em] text-blue-700">Admin Dashboard</p>
          <h1 className="mt-3 text-3xl font-semibold text-slate-950">สำหรับ admin เท่านั้น</h1>
          <p className="mt-3 text-slate-600">กรุณาเข้าสู่ระบบด้วยบัญชี admin เพื่อจัดการสินค้าแนะนำ</p>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-slate-50">
      <section className="border-b border-slate-200 bg-white py-9">
        <div className="wrap flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="mono text-xs uppercase tracking-[.18em] text-blue-700">Admin Dashboard</p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">จัดการหน้าแรก</h1>
            <p className="mt-2 text-sm text-slate-500">เลือกหมวดเพื่อจัดการสินค้าติดดาวหรือรูป Banner โปรโมชั่น</p>
          </div>
          <div className="grid w-full grid-cols-2 rounded-lg border border-slate-200 bg-slate-50 p-1 sm:w-auto">
            <button
              type="button"
              data-testid="admin-section-featured"
              onClick={() => setSection("featured")}
              className={`inline-flex h-11 items-center justify-center gap-2 rounded-md px-4 text-sm font-medium transition ${
                section === "featured" ? "bg-white text-blue-700 shadow-sm" : "text-slate-600 hover:text-slate-950"
              }`}
            >
              <Star className={`h-4 w-4 ${section === "featured" ? "fill-amber-400 text-amber-400" : ""}`} />
              สินค้าติดดาว
            </button>
            <button
              type="button"
              data-testid="admin-section-banner"
              onClick={() => setSection("banner")}
              className={`inline-flex h-11 items-center justify-center gap-2 rounded-md px-4 text-sm font-medium transition ${
                section === "banner" ? "bg-white text-blue-700 shadow-sm" : "text-slate-600 hover:text-slate-950"
              }`}
            >
              <ImagePlus className="h-4 w-4" />
              รูป Banner
            </button>
          </div>
        </div>
      </section>

      {section === "featured" ? (
        <section className="wrap grid gap-8 py-10 lg:grid-cols-[360px_1fr]">
          <aside className="rounded-lg border border-slate-200 bg-white p-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold text-slate-950">ติดดาวแล้ว</h2>
                <p className="text-sm text-slate-500">{loading ? "กำลังโหลด..." : `${featured.length} รายการ`}</p>
              </div>
              <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
            </div>
            {error ? <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p> : null}
            {saving ? <p className="mt-4 rounded-lg bg-blue-50 px-3 py-2 text-sm text-blue-700">กำลังบันทึกสินค้าติดดาว...</p> : null}
            <div className="mt-5 space-y-3">
              {featured.length ? (
                featured.map((product) => (
                  <div key={product.id} className="grid grid-cols-[64px_1fr_auto] items-center gap-3 rounded-lg border border-slate-100 p-2">
                    <ProductThumb product={product} />
                    <div className="min-w-0">
                      <div className="truncate text-sm font-medium text-slate-950">{product.name}</div>
                      <div className="mono mt-0.5 text-xs text-slate-500">{baht(product.price)}</div>
                    </div>
                    <button
                      type="button"
                      disabled={saving}
                      onClick={() => remove(product.id)}
                      className="grid h-9 w-9 place-items-center rounded-lg text-slate-400 transition hover:bg-red-50 hover:text-red-600"
                      aria-label="เอาออก"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))
              ) : (
                <div className="rounded-lg border border-dashed border-slate-300 p-5 text-sm text-slate-500">ยังไม่มีสินค้าแนะนำ</div>
              )}
            </div>
          </aside>

          <div className="rounded-lg border border-slate-200 bg-white p-5">
            <div className="mb-5 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <h2 className="text-lg font-semibold text-slate-950">สินค้าทั้งหมด</h2>
              <div className="relative w-full md:w-80">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  className="h-11 w-full rounded-lg border border-slate-300 pl-10 pr-3 text-sm outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
                  placeholder="ค้นหาสินค้า"
                />
              </div>
            </div>
            <div className="grid gap-3">
              {filtered.map((product) => {
                const active = ids.includes(product.id);
                return (
                  <button
                    key={product.id}
                    type="button"
                    disabled={saving}
                    data-testid="admin-product-toggle"
                    onClick={() => toggle(product.id)}
                    className={`grid grid-cols-[72px_1fr_auto] items-center gap-4 rounded-lg border p-3 text-left transition ${
                      active ? "border-amber-300 bg-amber-50" : "border-slate-200 hover:border-blue-300 hover:bg-blue-50/40"
                    }`}
                  >
                    <ProductThumb product={product} />
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-medium text-slate-950">{product.name}</span>
                      <span className="mono mt-1 block text-xs text-slate-500">{product.catName ?? product.catEn} / {baht(product.price)}</span>
                    </span>
                    <Star className={`h-5 w-5 ${active ? "fill-amber-400 text-amber-400" : "text-slate-300"}`} />
                  </button>
                );
              })}
            </div>
          </div>
        </section>
      ) : (
        <section className="wrap py-10">
          <PromotionBannerEditor />
        </section>
      )}
    </main>
  );
}

function ProductThumb({ product }: { product: Product }) {
  return (
    <span className="grid h-16 w-16 place-items-center overflow-hidden rounded-lg bg-slate-100">
      {product.image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
      ) : (
        <CategoryIcon name={product.glyph} className="h-7 w-7 text-slate-400" />
      )}
    </span>
  );
}
