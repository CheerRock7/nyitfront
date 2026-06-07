"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Check, RotateCcw, ShoppingCart, Zap } from "lucide-react";
import { baht, budgets, buildParts, buildSlots, type Product } from "@/lib/data";
import { CategoryIcon } from "@/components/icons";
import { useCart } from "@/components/site-chrome";

export function BuilderClient() {
  const params = useSearchParams();
  const [budgetId, setBudgetId] = useState(params.get("budget") || "");
  const [openSlot, setOpenSlot] = useState<string | null>(null);
  const [build, setBuild] = useState<Record<string, Product>>({});
  const { addItem, openCart } = useCart();
  const budget = budgets.find((item) => item.id === budgetId);
  const total = Object.values(build).reduce((sum, part) => sum + part.price, 0);
  const requiredTotal = buildSlots.filter((slot) => slot.required).length;
  const requiredPicked = buildSlots.filter((slot) => slot.required && build[slot.key]).length;
  const percent = budget ? Math.min(100, (total / budget.max) * 100) : 0;
  const complete = requiredPicked === requiredTotal;
  const remaining = requiredTotal - requiredPicked;

  const lines = useMemo(() => buildSlots.map((slot) => ({ slot, part: build[slot.key] })), [build]);

  const choosePart = (slotKey: string, part: Product) => {
    setBuild((current) => {
      const next = { ...current };
      if (next[slotKey]?.id === part.id) delete next[slotKey];
      else next[slotKey] = part;
      return next;
    });
    setOpenSlot(null);
  };

  const addBuild = () => {
    Object.values(build).forEach((part) => addItem(part, 1));
    if (Object.values(build).length) openCart();
  };

  return (
    <main>
      <section className="relative overflow-hidden bg-slate-950 py-14 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(46%_80%_at_88%_20%,rgba(37,99,235,.25),transparent_70%)]" />
        <div className="wrap relative">
          <p className="mono text-xs uppercase tracking-[.18em] text-blue-300">บริการจัดสเปก</p>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight md:text-5xl">จัดสเปกคอมตามงบของคุณ</h1>
          <p className="mt-4 max-w-2xl leading-7 text-slate-400">เลือกชิ้นส่วนทีละรายการ ระบบจะคำนวณราคารวมให้ทันที ครบแล้วเพิ่มลงตะกร้าได้เลย</p>
          <div className="mt-7 flex flex-wrap gap-3">
            {budgets.map((item) => (
              <button
                key={item.id}
                onClick={() => setBudgetId(item.id === budgetId ? "" : item.id)}
                className={`rounded-full border px-5 py-3 text-left transition ${item.id === budgetId ? "border-blue-600 bg-blue-600" : "border-white/15 bg-white/5 hover:border-blue-500"}`}
              >
                <b className="mono block text-sm">{item.label}</b>
                <span className="text-xs text-slate-300">{item.sub}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="wrap grid gap-8 py-10 lg:grid-cols-[1fr_360px]">
        <div className="space-y-4">
          {buildSlots.map((slot) => {
            const selected = build[slot.key];
            return (
              <div key={slot.key} className={`overflow-hidden rounded-[18px] border bg-white transition ${selected ? "border-blue-300" : "border-slate-200"}`}>
                <div className="flex items-center gap-4 p-5">
                  <div className={`grid h-12 w-12 place-items-center rounded-xl ${selected ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-950"}`}>
                    <CategoryIcon name={slot.cat} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="font-semibold">{slot.label}</div>
                    <div className="mono text-xs text-slate-400">{slot.required ? "จำเป็น" : "ไม่บังคับ"}</div>
                  </div>
                  {selected ? (
                    <div className="hidden text-right sm:block">
                      <div className="max-w-[220px] truncate text-sm font-medium">{selected.name}</div>
                      <div className="mono text-sm text-slate-500">{baht(selected.price)}</div>
                    </div>
                  ) : null}
                  <button onClick={() => setOpenSlot(openSlot === slot.key ? null : slot.key)} className="rounded-xl bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700">
                    {selected ? "เปลี่ยน" : "เลือก"}
                  </button>
                </div>
                {openSlot === slot.key ? (
                  <div className="grid gap-3 border-t border-slate-200 bg-slate-50 p-3 md:grid-cols-2">
                    {(buildParts[slot.cat] || []).map((part) => (
                      <button
                        key={part.id}
                        onClick={() => choosePart(slot.key, part)}
                        className={`grid grid-cols-[52px_1fr_auto] items-center gap-3 rounded-2xl border bg-white p-3 text-left transition hover:border-blue-600 ${selected?.id === part.id ? "border-blue-600 ring-4 ring-blue-100" : "border-slate-200"}`}
                      >
                        <span className="grid h-13 w-13 place-items-center rounded-xl bg-slate-100 text-slate-500">
                          <CategoryIcon name={part.glyph} />
                        </span>
                        <span className="min-w-0">
                          <span className="block truncate text-sm font-medium">{part.name}</span>
                          <span className="mono block truncate text-xs text-slate-500">{part.brand} · {part.spec}</span>
                        </span>
                        <span className="mono text-sm font-semibold">{baht(part.price)}</span>
                      </button>
                    ))}
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>

        <aside className="h-fit rounded-[26px] border border-slate-200 bg-white shadow-xl lg:sticky lg:top-24">
          <div className="border-b border-slate-200 p-6">
            <h2 className="text-lg font-semibold">สรุปสเปก</h2>
            <p className="mt-1 text-sm text-slate-500">{budget ? `งบประมาณ: ${budget.label} บาท` : "ยังไม่ได้เลือกงบประมาณ"}</p>
            {budget ? (
              <div className="mt-5">
                <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                  <div className={`h-full rounded-full ${total > budget.max ? "bg-red-500" : "bg-blue-600"}`} style={{ width: `${percent}%` }} />
                </div>
                <div className="mono mt-2 flex justify-between text-xs text-slate-500">
                  <span>{baht(total)}</span>
                  <span>{budget.max >= 999999 ? "ไม่จำกัด" : baht(budget.max)}</span>
                </div>
              </div>
            ) : null}
          </div>
          <div className="max-h-[300px] overflow-y-auto px-6 py-2">
            {lines.map(({ slot, part }) => (
              <div key={slot.key} className="flex justify-between gap-3 border-b border-slate-100 py-3 text-sm">
                <span className="text-slate-500">{slot.label.split(" ")[0]}</span>
                {part ? (
                  <span className="text-right">
                    <b className="block font-medium">{part.name}</b>
                    <span className="mono text-xs text-slate-500">{baht(part.price)}</span>
                  </span>
                ) : (
                  <span className="mono text-xs text-slate-400">{slot.required ? "ยังไม่ได้เลือก" : "-"}</span>
                )}
              </div>
            ))}
          </div>
          <div className="p-6">
            <div className={`mb-4 flex items-center gap-2 rounded-xl p-3 text-sm ${complete ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-600"}`}>
              {complete ? <Check className="h-4 w-4" /> : <Zap className="h-4 w-4" />}
              {complete ? "ชิ้นส่วนหลักครบ พร้อมประกอบ" : `เลือกชิ้นส่วนหลักอีก ${remaining} รายการให้ครบ`}
            </div>
            <div className="mb-5 flex items-baseline justify-between">
              <span className="text-sm text-slate-500">ราคารวม</span>
              <span className="mono text-3xl font-semibold">{baht(total)}</span>
            </div>
            <button onClick={addBuild} className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-blue-600 font-medium text-white shadow-lg shadow-blue-600/20">
              <ShoppingCart className="h-4 w-4" /> เพิ่มสเปกลงตะกร้า
            </button>
            <button onClick={() => setBuild({})} className="mt-3 flex h-12 w-full items-center justify-center gap-2 rounded-full border border-slate-300 bg-white font-medium">
              <RotateCcw className="h-4 w-4" /> เริ่มใหม่
            </button>
          </div>
        </aside>
      </section>
    </main>
  );
}
