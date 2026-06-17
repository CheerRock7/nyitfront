"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { ArrowLeft, Pencil, Save, Settings, UserRound, X } from "lucide-react";
import { useAuth } from "@/components/site-chrome";

export function SettingsClient() {
  const { user, updateProfile } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    if (!user) return;
    setName(user.name);
    setEmail(user.email);
    setPhone(user.phone ?? "");
    setAddress(user.address ?? "");
  }, [user]);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setError("");
    const result = updateProfile({ name, email, phone, address, password });
    if (!result.ok) {
      setError(result.error ?? "บันทึกข้อมูลไม่สำเร็จ");
      return;
    }
    setPassword("");
    setMessage("บันทึกข้อมูลเรียบร้อยแล้ว");
    setEditing(false);
  }

  function resetForm() {
    if (!user) return;
    setName(user.name);
    setEmail(user.email);
    setPhone(user.phone ?? "");
    setAddress(user.address ?? "");
    setPassword("");
    setError("");
    setMessage("");
    setEditing(false);
  }

  if (!user) {
    return (
      <main className="bg-slate-50 py-16">
        <div className="wrap">
          <div className="mx-auto max-w-xl rounded-[24px] border border-slate-200 bg-white p-8 text-center shadow-sm">
            <Settings className="mx-auto mb-4 h-12 w-12 text-slate-300" />
            <h1 className="text-2xl font-semibold tracking-tight text-slate-950">กรุณาเข้าสู่ระบบ</h1>
            <p className="mt-3 text-slate-500">ต้องเข้าสู่ระบบก่อนแก้ไขข้อมูลบัญชี</p>
            <Link href="/" className="mt-6 inline-flex h-12 items-center rounded-full bg-blue-600 px-6 font-medium text-white">
              กลับหน้าแรก
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-slate-50 py-10">
      <div className="wrap">
        <Link href="/" className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-blue-700">
          <ArrowLeft className="h-4 w-4" />
          กลับหน้าแรก
        </Link>

        <div className="mt-6 grid gap-8 lg:grid-cols-[300px_1fr]">
          <aside className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="grid h-16 w-16 place-items-center rounded-2xl bg-blue-50 text-blue-700">
              <UserRound className="h-7 w-7" />
            </div>
            <h1 className="mt-5 text-2xl font-semibold tracking-tight text-slate-950">Settings</h1>
            <p className="mt-2 text-sm leading-6 text-slate-500">แก้ไขข้อมูลพื้นฐานของบัญชี storefront บนเครื่องนี้</p>
            <div className="mt-5 rounded-2xl bg-slate-50 p-4">
              <div className="text-sm font-semibold text-slate-950">{user.name}</div>
              <div className="mt-1 break-all text-xs text-slate-500">{user.email}</div>
            </div>
          </aside>

          <section className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="border-b border-slate-100 pb-5">
              <p className="mono text-xs uppercase tracking-[.18em] text-blue-700">Profile</p>
              <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
                <h2 className="text-2xl font-semibold tracking-tight text-slate-950">ข้อมูลบัญชี</h2>
                {!editing ? (
                  <button onClick={() => setEditing(true)} className="inline-flex h-10 items-center gap-2 rounded-full bg-slate-950 px-4 text-sm font-medium text-white">
                    <Pencil className="h-4 w-4" />
                    แก้ไขข้อมูล
                  </button>
                ) : null}
              </div>
            </div>

            {!editing ? (
              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <ProfileItem label="ชื่อผู้ใช้" value={user.name} />
                <ProfileItem label="ID หรืออีเมล" value={user.email} />
                <ProfileItem label="เบอร์โทร" value={user.phone || "-"} />
                <ProfileItem label="รหัสผ่าน" value="••••••••" />
                <ProfileItem label="ที่อยู่" value={user.address || "-"} wide />
                {message ? <p className="rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700 md:col-span-2">{message}</p> : null}
              </div>
            ) : (
              <form onSubmit={submit}>
                <div className="mt-6 grid gap-5 md:grid-cols-2">
                  <Field label="ชื่อผู้ใช้">
                    <input value={name} onChange={(event) => setName(event.target.value)} className="field-input" required />
                  </Field>
                  <Field label="ID หรืออีเมล">
                    <input value={email} onChange={(event) => setEmail(event.target.value)} className="field-input" required />
                  </Field>
                  <Field label="เบอร์โทร">
                    <input value={phone} onChange={(event) => setPhone(event.target.value)} className="field-input" placeholder="เช่น 08x-xxx-xxxx" />
                  </Field>
                  <Field label="รหัสผ่านใหม่">
                    <input value={password} onChange={(event) => setPassword(event.target.value)} type="password" minLength={6} className="field-input" placeholder="เว้นว่างถ้าไม่เปลี่ยน" />
                  </Field>
                  <label className="block md:col-span-2">
                    <span className="mb-1.5 block text-sm font-medium text-slate-700">ที่อยู่</span>
                    <textarea value={address} onChange={(event) => setAddress(event.target.value)} rows={4} className="field-input field-textarea resize-none py-3" placeholder="ที่อยู่สำหรับติดต่อ/จัดส่ง" />
                  </label>
                </div>

                {error ? <p className="mt-5 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p> : null}
                {message ? <p className="mt-5 rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{message}</p> : null}

                <div className="mt-6 flex flex-wrap justify-end gap-3">
                  <button type="button" onClick={resetForm} className="inline-flex h-12 items-center gap-2 rounded-full border border-slate-300 bg-white px-6 font-medium text-slate-700">
                    <X className="h-4 w-4" />
                    ยกเลิก
                  </button>
                  <button className="inline-flex h-12 items-center gap-2 rounded-full bg-blue-600 px-6 font-medium text-white shadow-lg shadow-blue-600/20">
                    <Save className="h-4 w-4" />
                    บันทึกข้อมูล
                  </button>
                </div>
              </form>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}

function ProfileItem({ label, value, wide = false }: { label: string; value: string; wide?: boolean }) {
  return (
    <div className={`rounded-2xl border border-slate-200 bg-slate-50 p-4 ${wide ? "md:col-span-2" : ""}`}>
      <div className="text-xs font-medium uppercase tracking-wider text-slate-400">{label}</div>
      <div className="mt-2 whitespace-pre-wrap break-words text-base font-medium text-slate-950">{value}</div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-slate-700">{label}</span>
      {children}
    </label>
  );
}
