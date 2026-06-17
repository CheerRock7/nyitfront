import Link from "next/link";
import { AuthForm } from "@/components/auth-form";

export default function RegisterPage() {
  return (
    <main className="bg-slate-50 py-16">
      <div className="wrap grid items-center gap-10 lg:grid-cols-[1fr_420px]">
        <section>
          <p className="mono text-xs uppercase tracking-[.18em] text-blue-700">NYIT Computer</p>
          <h1 className="mt-4 max-w-2xl text-4xl font-semibold leading-tight tracking-tight text-slate-950 md:text-5xl">
            สมัครสมาชิก NYIT Computer
          </h1>
          <p className="mt-5 max-w-xl leading-8 text-slate-600">
            สร้างบัญชีทดลองสำหรับ storefront นี้ เพื่อเตรียม flow ก่อนต่อ backend auth จริงในอนาคต
          </p>
          <Link href="/products" className="mt-7 inline-flex h-12 items-center rounded-full border border-slate-300 bg-white px-6 font-medium text-slate-950">
            เลือกดูสินค้า
          </Link>
        </section>
        <AuthForm mode="register" />
      </div>
    </main>
  );
}
