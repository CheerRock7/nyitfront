import Link from "next/link";
import { AuthForm } from "@/components/auth-form";

export default function LoginPage() {
  return (
    <main className="bg-slate-50 py-16">
      <div className="wrap grid items-center gap-10 lg:grid-cols-[1fr_420px]">
        <section>
          <p className="mono text-xs uppercase tracking-[.18em] text-blue-700">NYIT Computer</p>
          <h1 className="mt-4 max-w-2xl text-4xl font-semibold leading-tight tracking-tight text-slate-950 md:text-5xl">
            เข้าสู่ระบบเพื่อจัดการตะกร้าและรายการสินค้าของคุณ
          </h1>
          <p className="mt-5 max-w-xl leading-8 text-slate-600">
            บัญชีนี้ใช้สำหรับประสบการณ์บน storefront เครื่องนี้เท่านั้น ยังไม่เชื่อมกับระบบ stock หรือฐานข้อมูลลูกค้าจริง
          </p>
          <Link href="/products" className="mt-7 inline-flex h-12 items-center rounded-full border border-slate-300 bg-white px-6 font-medium text-slate-950">
            ดูสินค้าก่อน
          </Link>
        </section>
        <AuthForm mode="login" />
      </div>
    </main>
  );
}
