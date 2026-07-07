"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { LockKeyhole, Mail, UserRound } from "lucide-react";
import { useAuth } from "@/components/app-context";

type AuthFormProps = {
  mode: "login" | "register";
  onModeChange?: (mode: "login" | "register") => void;
  onSuccess?: () => void;
};

const T = {
  registerFail: "\u0e2a\u0e21\u0e31\u0e04\u0e23\u0e2a\u0e21\u0e32\u0e0a\u0e34\u0e01\u0e44\u0e21\u0e48\u0e2a\u0e33\u0e40\u0e23\u0e47\u0e08",
  loginFail: "\u0e40\u0e02\u0e49\u0e32\u0e2a\u0e39\u0e48\u0e23\u0e30\u0e1a\u0e1a\u0e44\u0e21\u0e48\u0e2a\u0e33\u0e40\u0e23\u0e47\u0e08",
  register: "\u0e2a\u0e21\u0e31\u0e04\u0e23\u0e2a\u0e21\u0e32\u0e0a\u0e34\u0e01",
  login: "\u0e40\u0e02\u0e49\u0e32\u0e2a\u0e39\u0e48\u0e23\u0e30\u0e1a\u0e1a",
  registerDesc: "\u0e2a\u0e23\u0e49\u0e32\u0e07\u0e1a\u0e31\u0e0d\u0e0a\u0e35\u0e43\u0e2b\u0e21\u0e48 \u0e23\u0e30\u0e1a\u0e1a\u0e08\u0e30\u0e1a\u0e31\u0e19\u0e17\u0e36\u0e01\u0e02\u0e49\u0e2d\u0e21\u0e39\u0e25\u0e25\u0e07\u0e10\u0e32\u0e19\u0e02\u0e49\u0e2d\u0e21\u0e39\u0e25\u0e02\u0e2d\u0e07\u0e23\u0e49\u0e32\u0e19",
  loginDesc: "\u0e40\u0e02\u0e49\u0e32\u0e2a\u0e39\u0e48\u0e23\u0e30\u0e1a\u0e1a\u0e14\u0e49\u0e27\u0e22\u0e0a\u0e37\u0e48\u0e2d\u0e1c\u0e39\u0e49\u0e43\u0e0a\u0e49\u0e07\u0e32\u0e19\u0e2b\u0e23\u0e37\u0e2d\u0e2d\u0e35\u0e40\u0e21\u0e25",
  username: "\u0e0a\u0e37\u0e48\u0e2d\u0e1c\u0e39\u0e49\u0e43\u0e0a\u0e49\u0e07\u0e32\u0e19",
  email: "\u0e2d\u0e35\u0e40\u0e21\u0e25",
  userOrEmail: "\u0e0a\u0e37\u0e48\u0e2d\u0e1c\u0e39\u0e49\u0e43\u0e0a\u0e49\u0e07\u0e32\u0e19\u0e2b\u0e23\u0e37\u0e2d\u0e2d\u0e35\u0e40\u0e21\u0e25",
  password: "\u0e23\u0e2b\u0e31\u0e2a\u0e1c\u0e48\u0e32\u0e19",
  submitting: "\u0e01\u0e33\u0e25\u0e31\u0e07\u0e1a\u0e31\u0e19\u0e17\u0e36\u0e01...",
  haveAccount: "\u0e21\u0e35\u0e1a\u0e31\u0e0d\u0e0a\u0e35\u0e2d\u0e22\u0e39\u0e48\u0e41\u0e25\u0e49\u0e27?",
  noAccount: "\u0e22\u0e31\u0e07\u0e44\u0e21\u0e48\u0e21\u0e35\u0e1a\u0e31\u0e0d\u0e0a\u0e35?",
} as const;

export function AuthForm({ mode, onModeChange, onSuccess }: AuthFormProps) {
  const router = useRouter();
  const { login, register } = useAuth();
  const isRegister = mode === "register";
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSubmitting(true);

    const result = isRegister ? await register(name, email, password) : await login(email, password);
    setSubmitting(false);

    if (!result.ok) {
      setError(result.error ?? (isRegister ? T.registerFail : T.loginFail));
      return;
    }

    if (onSuccess) onSuccess();
    else router.push("/");
  }

  return (
    <form onSubmit={submit} className="rounded-[22px] border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/60">
      <div className="mb-6">
        <p className="mono text-xs uppercase tracking-[.18em] text-blue-700">NYIT Account</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">{isRegister ? T.register : T.login}</h1>
        <p className="mt-2 text-sm leading-6 text-slate-500">
          {isRegister ? T.registerDesc : T.loginDesc}
        </p>
      </div>

      <div className="space-y-4">
        {isRegister ? (
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-slate-700">{T.username}</span>
            <span className="relative block">
              <UserRound className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
              <input
                required
                name="name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                className="h-12 w-full rounded-xl border border-slate-300 pl-12 pr-4 outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
                placeholder="user"
              />
            </span>
          </label>
        ) : null}

        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-slate-700">{isRegister ? T.email : T.userOrEmail}</span>
          <span className="relative block">
            <Mail className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
            <input
              required
              name="identifier"
              type="text"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="h-12 w-full rounded-xl border border-slate-300 pl-12 pr-4 outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
              placeholder={isRegister ? "email" : "User or email"}
            />
          </span>
        </label>

        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-slate-700">{T.password}</span>
          <span className="relative block">
            <LockKeyhole className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
            <input
              required
              name="password"
              minLength={6}
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="h-12 w-full rounded-xl border border-slate-300 pl-12 pr-4 outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
              placeholder="password"
            />
          </span>
        </label>
      </div>

      {error ? <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p> : null}

      <button type="submit" disabled={submitting} className="mt-6 h-12 w-full rounded-full bg-blue-600 font-medium text-white shadow-lg shadow-blue-600/20 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none">
        {submitting ? T.submitting : isRegister ? T.register : T.login}
      </button>

      <p className="mt-5 text-center text-sm text-slate-500">
          {isRegister ? T.registerDesc : T.loginDesc}
        {onModeChange ? (
          <button
            type="button"
            onClick={() => {
              setError("");
              onModeChange(isRegister ? "login" : "register");
            }}
            className="font-medium text-blue-700"
          >
            {isRegister ? T.login : T.register}
          </button>
        ) : (
          <Link href={isRegister ? "/login" : "/register"} className="font-medium text-blue-700">
            {isRegister ? T.login : T.register}
          </Link>
        )}
      </p>
    </form>
  );
}
