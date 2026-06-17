import Link from "next/link";
import { ArrowRight, Cpu, HardDrive, Monitor, PackageCheck, ShieldCheck, Sparkles, Wrench, Zap } from "lucide-react";
import { baht, type Product } from "@/lib/data";

export function HeroProductBanner({ products }: { products: Product[] }) {
  const featuredProduct = products.find((product) => product.price > 0) ?? products[0];
  const productCount = products.length;

  return (
    <section className="relative overflow-hidden rounded-[28px] bg-slate-950 text-white shadow-2xl shadow-slate-300/70">
      <div className="absolute inset-0 bg-[radial-gradient(70%_90%_at_88%_14%,rgba(37,99,235,.48),transparent_58%),radial-gradient(60%_70%_at_4%_100%,rgba(20,184,166,.32),transparent_62%)]" />
      <div className="absolute inset-x-0 top-0 h-1 bg-[linear-gradient(90deg,#2563eb,#14b8a6,#22c55e)]" />
      <div className="relative grid gap-9 px-6 py-8 md:px-9 md:py-10 lg:grid-cols-[minmax(0,1fr)_520px] lg:items-center lg:px-12 lg:py-12">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-blue-100 ring-1 ring-white/10">
            <Sparkles className="h-4 w-4" />
            NYIT Computer
          </div>
          <h1 className="mt-6 max-w-2xl text-4xl font-semibold leading-tight tracking-tight md:text-6xl">
            คอมแรง อุปกรณ์ครบ พร้อมประกอบให้จบในที่เดียว
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-8 text-slate-300 md:text-lg">
            เลือกซื้อคอมเซ็ต การ์ดจอ ซีพียู เมนบอร์ด แรม SSD และจอมอนิเตอร์ พร้อมทีมช่วยดูสเปกให้เหมาะกับงบของคุณ
          </p>

          <div className="mt-7 flex flex-wrap gap-3">
            <Link href="/products" className="inline-flex h-12 items-center gap-2 rounded-full bg-blue-600 px-6 font-medium text-white shadow-lg shadow-blue-950/30 transition hover:-translate-y-0.5 hover:bg-blue-500">
              ดูสินค้าทั้งหมด <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/builder" className="inline-flex h-12 items-center gap-2 rounded-full bg-white px-6 font-medium text-slate-950 transition hover:-translate-y-0.5 hover:bg-slate-100">
              จัดสเปกคอม
            </Link>
          </div>

          <div className="mt-8 grid max-w-xl grid-cols-3 gap-3">
            {[
              [productCount ? `${productCount}+` : "พร้อม", "สินค้าในระบบ"],
              ["มือ 1-2", "คัดสภาพพร้อมรับประกัน"],
              ["ฟรี", "ช่วยจัดสเปก"],
            ].map(([value, label]) => (
              <div key={value} className="rounded-2xl bg-white/8 p-4 ring-1 ring-white/10">
                <b className="mono block text-lg font-semibold text-white md:text-2xl">{value}</b>
                <span className="mt-1 block text-xs text-slate-300 md:text-sm">{label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative hidden min-h-[390px] lg:block">
          <div className="absolute inset-0 rounded-[28px] bg-white/8 ring-1 ring-white/10" />
          <div className="absolute inset-5 rounded-[24px] bg-slate-900/80 shadow-2xl shadow-black/20 ring-1 ring-white/10" />

          <div className="absolute left-8 right-8 top-8 rounded-[20px] bg-slate-950/85 p-4 ring-1 ring-white/10">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-sm font-medium text-slate-200">NYIT Build Preview</span>
              <span className="rounded-full bg-emerald-400/15 px-3 py-1 text-xs font-medium text-emerald-200">พร้อมขาย</span>
            </div>
            <div className="grid aspect-[16/9] place-items-center rounded-2xl bg-[linear-gradient(135deg,#1e3a8a,#0f172a_56%,#064e3b)]">
              <Monitor className="h-24 w-24 text-white/35" />
            </div>
          </div>

          <div className="absolute bottom-8 left-8 right-8 grid grid-cols-2 gap-3">
            <SpecTile icon={<Cpu />} label="CPU / GPU" value="เลือกได้ตามงบ" />
            <SpecTile icon={<HardDrive />} label="RAM / SSD" value="พร้อมอัปเกรด" />
            <SpecTile icon={<ShieldCheck />} label="Warranty" value="มือ 1-2 พร้อมรับประกัน" />
            <SpecTile icon={<Wrench />} label="Service" value="ประกอบและเช็กเครื่อง" />
          </div>

          {featuredProduct ? (
            <div className="absolute -right-3 top-24 hidden w-48 rounded-2xl bg-white p-4 text-slate-950 shadow-xl shadow-black/20 ring-1 ring-slate-200 md:block">
              <div className="flex items-center gap-2 text-xs font-medium text-blue-700">
                <PackageCheck className="h-4 w-4" />
                สินค้าแนะนำ
              </div>
              <div className="mt-2 line-clamp-2 text-sm font-semibold leading-snug">{featuredProduct.name}</div>
              <div className="mono mt-2 text-lg font-semibold">{baht(featuredProduct.price)}</div>
            </div>
          ) : null}

          <div className="absolute -left-3 top-16 hidden rounded-2xl bg-blue-600 px-4 py-3 text-sm font-medium text-white shadow-xl shadow-blue-950/30 md:flex md:items-center md:gap-2">
            <Zap className="h-4 w-4" />
            Ready to build
          </div>
        </div>
      </div>
    </section>
  );
}

function SpecTile({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-white/9 p-3 ring-1 ring-white/10">
      <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-xl bg-white/10 text-blue-100">
        {icon}
      </div>
      <div className="mono text-[10px] uppercase tracking-wider text-blue-200">{label}</div>
      <div className="mt-1 text-xs font-medium text-white">{value}</div>
    </div>
  );
}
