import Link from "next/link";
import { builderCategory, categoryMeta, type Category, type Product } from "@/lib/data";
import { getCategories, getProducts } from "@/lib/products";
import { RecommendedProductsCarousel } from "@/components/admin-featured";
import { HomeHero, type CategoryStat } from "@/components/home-hero";
import { CategoryIcon } from "@/components/icons";
import { PcBuilderFeature } from "@/components/pc-builder-feature";
import { PromotionImageBanner } from "@/components/promotion-banner";
import { SnapScroll } from "@/components/snap-scroll";

export const dynamic = "force-dynamic";

const fallbackCategories: Category[] = [
  { id: "gpu", name: "การ์ดจอ", en: categoryMeta.gpu.en, icon: categoryMeta.gpu.icon },
  { id: "cpu", name: "ซีพียู", en: categoryMeta.cpu.en, icon: categoryMeta.cpu.icon },
  { id: "ram", name: "แรม", en: categoryMeta.ram.en, icon: categoryMeta.ram.icon },
  { id: "ssd", name: "SSD", en: categoryMeta.ssd.en, icon: categoryMeta.ssd.icon },
  { id: "monitor", name: "จอภาพ", en: categoryMeta.monitor.en, icon: categoryMeta.monitor.icon },
];

function statFor(products: Product[], cat: string): CategoryStat {
  const items = products.filter((product) => product.cat === cat);
  const from = items.reduce((min, product) => (product.price > 0 && product.price < min ? product.price : min), Infinity);
  // Whole baht for the "เริ่มต้น" pill — bundle prices carry satang decimals.
  return { count: items.length, from: Number.isFinite(from) ? Math.round(from) : 0 };
}

export default async function HomePage() {
  const { categories, products, dbUnavailable } = await loadHomeData();
  const navCategories = [builderCategory, ...(categories.length ? categories : fallbackCategories)];
  const stats = {
    gpu: statFor(products, "gpu"),
    cpu: statFor(products, "cpu"),
    set: statFor(products, "set"),
  };

  return (
    <main className="home">
      <h1 className="sr-only">NYIT Computer</h1>
      <SnapScroll />

      {/* Layer 1 + 2: dark hero and the frosted glass band */}
      <div className="home-hero-zone" data-snap>
        {dbUnavailable ? (
          <div className="wrap pt-4">
            <div className="rounded-xl border border-amber-300/40 bg-amber-400/10 px-4 py-3 text-sm text-amber-100">
              กำลังแสดงหน้าแรกแบบตัวอย่าง เพราะยังเชื่อมต่อฐานข้อมูลไม่ได้
            </div>
          </div>
        ) : null}

        <HomeHero stats={stats} />
      </div>

      {/* White sheet rising over the dark hero */}
      <div className="body-zone" data-snap>
        <section className="wrap pb-14">
          <SectionHead title="สินค้าแนะนำ" href="/products" />
          <RecommendedProductsCarousel products={products} />
        </section>

        <section className="wrap pb-12">
          <SectionHead title="หมวดหมู่สินค้า" href="/products" />
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-6">
            {navCategories.slice(0, 12).map((category) => (
              <Link
                key={category.id}
                href={category.id === "builder" ? "/builder" : `/products?cat=${category.id}`}
                className={`group rounded-lg border p-4 text-center transition hover:-translate-y-1 hover:shadow-lg ${
                  category.feature ? "border-slate-950 bg-slate-950 text-white" : "border-slate-200 bg-white"
                }`}
              >
                <div
                  className={`mx-auto mb-3 grid h-12 w-12 place-items-center rounded-lg ${
                    category.feature ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-950 group-hover:bg-blue-600 group-hover:text-white"
                  }`}
                >
                  <CategoryIcon name={category.icon} />
                </div>
                <div className="font-medium">{category.name}</div>
                <div className="mono mt-1 text-[10px] tracking-widest opacity-55">{category.en}</div>
              </Link>
              ))}
          </div>
        </section>

        {/* Ads: PC Builder + Promotion, below the categories */}
        <section className="wrap grid gap-8 pb-16">
          <PcBuilderFeature />
          <div className="promo-ad">
            <div className="promo-head">
              <span className="promo-tag mono">โปรโมชัน</span>
              <span className="promo-sub">ดีลและของแถม อัปเดตทุกสัปดาห์</span>
            </div>
            <PromotionImageBanner />
          </div>
        </section>
      </div>
    </main>
  );
}

async function loadHomeData() {
  try {
    const [categories, products] = await Promise.all([getCategories(), getProducts()]);
    return { categories, products, dbUnavailable: false };
  } catch {
    return { categories: [] as Category[], products: [] as Product[], dbUnavailable: true };
  }
}

function SectionHead({ title, href }: { title: string; href: string }) {
  return (
    <div className="mb-7 flex items-end justify-between gap-5">
      <h2 className="text-2xl font-semibold tracking-tight text-slate-950 md:text-3xl">{title}</h2>
      <Link href={href} className="hidden rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-blue-600 hover:text-blue-700 md:inline-flex">
        ดูทั้งหมด
      </Link>
    </div>
  );
}
