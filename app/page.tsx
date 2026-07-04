import Link from "next/link";
import {
  ArrowRight,
  Wrench,
} from "lucide-react";
import { builderCategory, categoryMeta, type Category, type Product } from "@/lib/data";
import { getCategories, getProducts } from "@/lib/products";
import { RecommendedProductsCarousel } from "@/components/admin-featured";
import { CategoryProductBanner } from "@/components/category-product-banner";
import { CategoryIcon } from "@/components/icons";
import { PromotionImageBanner } from "@/components/promotion-banner";

export const dynamic = "force-dynamic";

const fallbackCategories: Category[] = [
  { id: "gpu", name: "การ์ดจอ", en: categoryMeta.gpu.en, icon: categoryMeta.gpu.icon },
  { id: "cpu", name: "ซีพียู", en: categoryMeta.cpu.en, icon: categoryMeta.cpu.icon },
  { id: "ram", name: "แรม", en: categoryMeta.ram.en, icon: categoryMeta.ram.icon },
  { id: "ssd", name: "SSD", en: categoryMeta.ssd.en, icon: categoryMeta.ssd.icon },
  { id: "monitor", name: "จอภาพ", en: categoryMeta.monitor.en, icon: categoryMeta.monitor.icon },
];

export default async function HomePage() {
  const { categories, products, dbUnavailable } = await loadHomeData();
  const navCategories = [builderCategory, ...(categories.length ? categories : fallbackCategories)];

  return (
    <main className="bg-[#f5f6f8]">
      <h1 className="sr-only">NYIT Computer</h1>
      <section className="border-b border-slate-200 bg-white py-8 lg:py-10">
        <div className="wrap">
          {dbUnavailable ? (
            <div className="mb-5 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
              กำลังแสดงหน้าแรกแบบตัวอย่าง เพราะยังเชื่อมต่อฐานข้อมูลไม่ได้
            </div>
          ) : null}

          <CategoryProductBanner products={products} />
        </div>
      </section>

      <section className="py-7">
        <div className="wrap grid items-stretch gap-5 lg:grid-cols-2">
          <PromoPanel
            title="จัดสเปกคอมตามงบ"
            eyebrow="PC Builder"
            text="เลือก CPU, VGA, RAM, SSD และอุปกรณ์หลักในชุดเดียว เหมาะกับลูกค้าที่อยากได้เครื่องพร้อมใช้งาน"
            href="/builder"
            cta="เริ่มจัดสเปก"
            icon={<Wrench className="h-6 w-6" />}
          />
          <PromotionImageBanner />
        </div>
      </section>

      <section className="py-14">
        <div className="wrap">
          <SectionHead title="สินค้าแนะนำ" href="/products" />
          <RecommendedProductsCarousel products={products} />
        </div>
      </section>

      <section className="pb-16">
        <div className="wrap">
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
        </div>
      </section>
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

function PromoPanel({
  title,
  eyebrow,
  text,
  href,
  cta,
  icon,
}: {
  title: string;
  eyebrow: string;
  text: string;
  href: string;
  cta: string;
  icon: React.ReactNode;
}) {
  return (
    <Link href={href} className="group flex h-full flex-col rounded-lg border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-xl sm:p-5">
      <div>
        <div className="flex items-center justify-between gap-4">
          <p className="mono text-xs uppercase tracking-[.16em] text-blue-700">{eyebrow}</p>
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-blue-50 text-blue-700">{icon}</span>
        </div>
        <h2 className="mt-4 max-w-md text-2xl font-semibold tracking-tight text-slate-950 md:text-3xl">{title}</h2>
        <p className="mt-3 max-w-lg text-xs leading-5 text-slate-600 sm:text-sm sm:leading-6">{text}</p>
      </div>
      <span className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-slate-950">
        {cta} <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
      </span>
    </Link>
  );
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
