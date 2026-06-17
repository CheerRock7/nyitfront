"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { LockKeyhole, Mail, UserRound } from "lucide-react";
import { useAuth } from "@/components/site-chrome";

type AuthFormProps = {
  mode: "login" | "register";
  onModeChange?: (mode: "login" | "register") => void;
  onSuccess?: () => void;
};

export function AuthForm({ mode, onModeChange, onSuccess }: AuthFormProps) {
  const router = useRouter();
  const { login, register } = useAuth();
  const isRegister = mode === "register";
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (isRegister) {
      const ok = register(name, email, password);
      if (!ok) {
        setError("อีเมลนี้ถูกใช้แล้ว");
        return;
      }
    } else {
      const ok = login(email, password);
      if (!ok) {
        setError("อีเมลหรือรหัสผ่านไม่ถูกต้อง");
        return;
      }
    }

    if (onSuccess) {
      onSuccess();
    } else {
      router.push("/");
    }
  }

  return (
    <form onSubmit={submit} className="rounded-[22px] border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/60">
      <div className="mb-6">
        <p className="mono text-xs uppercase tracking-[.18em] text-blue-700">NYIT Account</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">
          {isRegister ? "สมัครสมาชิก" : "เข้าสู่ระบบ"}
        </h1>
        <p className="mt-2 text-sm leading-6 text-slate-500">
          {isRegister ? "สร้างบัญชีสำหรับเก็บข้อมูลการใช้งานบนเครื่องนี้" : "เข้าสู่ระบบบัญชีที่สมัครไว้บนเครื่องนี้"}
        </p>
      </div>

      <div className="space-y-4">
        {isRegister ? (
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-slate-700">ชื่อผู้ใช้</span>
            <span className="relative block">
              <UserRound className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
              <input
                required
                value={name}
                onChange={(event) => setName(event.target.value)}
                className="h-12 w-full rounded-xl border border-slate-300 pl-12 pr-4 outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
                placeholder="NYIT customer"
              />
            </span>
          </label>
        ) : null}

        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-slate-700">{isRegister ? "อีเมล" : "ID หรืออีเมล"}</span>
          <span className="relative block">
            <Mail className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
            <input
              required
              type={isRegister ? "email" : "text"}
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="h-12 w-full rounded-xl border border-slate-300 pl-12 pr-4 outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
              placeholder={isRegister ? "you@example.com" : "admin หรือ you@example.com"}
            />
          </span>
        </label>

        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-slate-700">รหัสผ่าน</span>
          <span className="relative block">
            <LockKeyhole className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
            <input
              required
              minLength={6}
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="h-12 w-full rounded-xl border border-slate-300 pl-12 pr-4 outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
              placeholder="อย่างน้อย 6 ตัวอักษร"
            />
          </span>
        </label>
      </div>

      {error ? <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p> : null}

      <button className="mt-6 h-12 w-full rounded-full bg-blue-600 font-medium text-white shadow-lg shadow-blue-600/20">
        {isRegister ? "สมัครสมาชิก" : "เข้าสู่ระบบ"}
      </button>

      <p className="mt-5 text-center text-sm text-slate-500">
        {isRegister ? "มีบัญชีอยู่แล้ว?" : "ยังไม่มีบัญชี?"}{" "}
        {onModeChange ? (
          <button
            type="button"
            onClick={() => {
              setError("");
              onModeChange(isRegister ? "login" : "register");
            }}
            className="font-medium text-blue-700"
          >
            {isRegister ? "เข้าสู่ระบบ" : "สมัครสมาชิก"}
          </button>
        ) : (
          <Link href={isRegister ? "/login" : "/register"} className="font-medium text-blue-700">
            {isRegister ? "เข้าสู่ระบบ" : "สมัครสมาชิก"}
          </Link>
        )}
      </p>
    </form>
  );
}
