import Link from "next/link";
import { ArrowRight, MessageCircle, Search, ShieldCheck, Truck, Wrench, Zap } from "lucide-react";
import { budgets, builderCategory } from "@/lib/data";
import { getCategories, getProducts } from "@/lib/products";
import { CategoryIcon } from "@/components/icons";
import { ProductCard } from "@/components/product-card";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [categories, products] = await Promise.all([getCategories(), getProducts()]);
  const navCategories = [builderCategory, ...categories];
  const featured = products.slice(0, 8);

  return (
    <main>
      <section className="relative overflow-hidden py-20 lg:py-24">
        <div className="absolute inset-0 bg-[radial-gradient(60%_70%_at_78%_18%,rgba(37,99,235,.12),transparent_70%),radial-gradient(40%_50%_at_12%_90%,rgba(20,181,114,.10),transparent_70%)]" />
        <div className="wrap relative grid items-center gap-12 lg:grid-cols-[1.05fr_.95fr]">
          <div>
            <p className="mono text-xs uppercase tracking-[.18em] text-blue-700">ร้านคอมออนไลน์ · ของแท้ · ประกอบฟรี</p>
            <h1 className="mt-5 max-w-3xl text-4xl font-semibold leading-[1.04] tracking-tight text-slate-950 md:text-6xl">
              คอมแรง อุปกรณ์ครบ <span className="text-blue-700">จัดสเปกได้</span> ในที่เดียว
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
              เลือกซื้อคอมเซ็ต การ์ดจอ ซีพียู เมนบอร์ด แรม และเกมมิ่งเกียร์ พร้อมบริการจัดสเปกตามงบประมาณของคุณ
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/builder" className="inline-flex h-12 items-center gap-2 rounded-full bg-blue-600 px-6 font-medium text-white shadow-lg shadow-blue-600/25">
                เริ่มจัดสเปกคอม <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/products" className="inline-flex h-12 items-center rounded-full border border-slate-300 bg-white px-6 font-medium text-slate-950">
                ดูสินค้าทั้งหมด
              </Link>
            </div>
            <div className="mt-10 flex gap-8">
              {[
                ["12K+", "ลูกค้าไว้วางใจ"],
                ["4.9", "คะแนนรีวิว"],
                ["24ชม.", "จัดส่งด่วน"],
              ].map(([value, label]) => (
                <div key={value}>
                  <b className="mono block text-2xl font-semibold">{value}</b>
                  <span className="text-sm text-slate-500">{label}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="relative">
            <div className="overflow-hidden rounded-[26px] border border-slate-200 bg-white p-5 shadow-2xl">
              <div className="mb-4 flex gap-2">
                <span className="h-3 w-3 rounded-full bg-slate-200" />
                <span className="h-3 w-3 rounded-full bg-slate-200" />
                <span className="h-3 w-3 rounded-full bg-slate-200" />
              </div>
              <div className="grid aspect-[16/10] place-items-center rounded-2xl bg-slate-100">
                <CategoryIcon name="gpu" className="h-28 w-28 text-slate-900/15" />
                <span className="mono rounded-full border border-slate-200 bg-white/70 px-4 py-1 text-xs text-slate-400">PREMIUM GAMING RIG</span>
              </div>
            </div>
            <FloatCard className="-left-6 top-4" icon={<Zap />} title="RTX 4070 SUPER" text="พร้อม DLSS 3" />
            <FloatCard className="-right-5 bottom-8" icon={<Truck />} title="ส่งฟรีทั่วไทย" text="เมื่อครบ ฿3,000" />
          </div>
        </div>
      </section>

      <section className="border-y border-slate-200 bg-white">
        <div className="wrap grid gap-5 py-6 md:grid-cols-4">
          {[
            [ShieldCheck, "ของแท้ 100%", "รับประกันศูนย์ไทย"],
            [Wrench, "ประกอบฟรี", "เมื่อซื้อครบชุด"],
            [Truck, "ส่งฟรี", "สั่งครบ ฿3,000"],
            [MessageCircle, "ปรึกษาฟรี", "ทีมงานผู้เชี่ยวชาญ"],
          ].map(([Icon, title, text]) => (
            <div key={String(title)} className="flex items-center gap-3">
              <div className="grid h-11 w-11 place-items-center rounded-xl bg-slate-100 text-blue-700">
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <b className="block text-sm">{title as string}</b>
                <span className="text-xs text-slate-500">{text as string}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white py-14">
        <div className="wrap">
          <div className="rounded-[26px] border border-slate-200 bg-gradient-to-b from-white to-slate-50 p-6 shadow-sm md:p-9">
            <form action="/products" className="relative">
              <Search className="absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
              <input name="q" className="h-14 w-full rounded-full border border-slate-300 pl-14 pr-32 outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100" placeholder="ค้นหา การ์ดจอ, CPU, RAM, SSD, Monitor..." />
              <button className="absolute right-1.5 top-1.5 h-11 rounded-full bg-blue-600 px-6 font-medium text-white">ค้นหา</button>
            </form>
            <div className="mt-4 flex flex-wrap gap-2">
              {["RTX 4070", "Ryzen 7", "DDR5 RAM", "NVMe SSD", "Monitor 165Hz"].map((tag) => (
                <Link key={tag} href={`/products?q=${encodeURIComponent(tag)}`} className="rounded-full border border-slate-200 px-4 py-2 text-sm text-slate-600 hover:border-blue-600 hover:text-blue-700">
                  {tag}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="wrap">
          <SectionHead eyebrow="หมวดหมู่สินค้า" title="เลือกช้อปตามหมวดหมู่" href="/products" />
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-6">
            {navCategories.map((category) => (
              <Link key={category.id} href={category.id === "builder" ? "/builder" : `/products?cat=${category.id}`} className={`group rounded-[18px] border p-5 text-center transition hover:-translate-y-1 hover:shadow-xl ${category.feature ? "border-slate-950 bg-slate-950 text-white" : "border-slate-200 bg-white"}`}>
                <div className={`mx-auto mb-3 grid h-14 w-14 place-items-center rounded-2xl ${category.feature ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-950 group-hover:bg-blue-600 group-hover:text-white"}`}>
                  <CategoryIcon name={category.icon} />
                </div>
                <div className="font-medium">{category.name}</div>
                <div className="mono mt-0.5 text-[10px] tracking-widest opacity-55">{category.en}</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="pb-20">
        <div className="wrap">
          <SectionHead eyebrow="คัดมาเพื่อคุณ" title="สินค้าแนะนำ" href="/products" />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {featured.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      <section id="promo" className="bg-slate-950 py-20 text-white">
        <div className="wrap grid items-center gap-10 lg:grid-cols-2">
          <div>
            <p className="mono text-xs uppercase tracking-[.18em] text-blue-300">บริการจัดสเปก</p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight md:text-4xl">จัดสเปกคอมตามงบของคุณ</h2>
            <p className="mt-4 max-w-xl text-slate-400">บอกงบประมาณแล้วเลือกชิ้นส่วนที่เข้ากันได้ ครบทั้งเครื่อง พร้อมประกอบและทดสอบฟรีก่อนส่ง</p>
            <Link href="/builder" className="mt-7 inline-flex h-12 items-center gap-2 rounded-full bg-blue-600 px-6 font-medium">
              เปิดเครื่องมือจัดสเปก <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {budgets.map((budget) => (
              <Link href={`/builder?budget=${budget.id}`} key={budget.id} className="rounded-2xl border border-white/10 bg-white/5 p-5 transition hover:-translate-y-1 hover:border-blue-500 hover:bg-white/10">
                <b className="mono block">{budget.label}</b>
                <span className="text-sm text-slate-400">{budget.sub}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

function FloatCard({ className, icon, title, text }: { className: string; icon: React.ReactNode; title: string; text: string }) {
  return (
    <div className={`absolute hidden items-center gap-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-xl md:flex ${className}`}>
      <div className="grid h-10 w-10 place-items-center rounded-xl bg-blue-50 text-blue-700">{icon}</div>
      <div>
        <b className="block text-sm">{title}</b>
        <span className="text-xs text-slate-500">{text}</span>
      </div>
    </div>
  );
}

function SectionHead({ eyebrow, title, href }: { eyebrow: string; title: string; href: string }) {
  return (
    <div className="mb-9 flex items-end justify-between gap-5">
      <div>
        <p className="mono text-xs uppercase tracking-[.18em] text-blue-700">{eyebrow}</p>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight">{title}</h2>
      </div>
      <Link href={href} className="hidden rounded-full border border-slate-300 bg-white px-5 py-2.5 text-sm font-medium md:inline-flex">
        ดูทั้งหมด
      </Link>
    </div>
  );
}
