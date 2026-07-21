"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { AlertTriangle, Check, ChevronDown, Info, Plus, RotateCcw, Search, ShoppingCart, ShieldCheck, Trash2, Zap } from "lucide-react";
import { baht, budgets, buildSlots, type Product } from "@/lib/data";
import { CategoryIcon } from "@/components/icons";
import { useCart } from "@/components/app-context";

const T = {
  service: "\u0e1a\u0e23\u0e34\u0e01\u0e32\u0e23\u0e08\u0e31\u0e14\u0e2a\u0e40\u0e1b\u0e01",
  title: "\u0e08\u0e31\u0e14\u0e2a\u0e40\u0e1b\u0e01\u0e04\u0e2d\u0e21\u0e15\u0e32\u0e21\u0e07\u0e1a\u0e02\u0e2d\u0e07\u0e04\u0e38\u0e13",
  intro:
    "\u0e40\u0e25\u0e37\u0e2d\u0e01\u0e0a\u0e34\u0e49\u0e19\u0e2a\u0e48\u0e27\u0e19\u0e08\u0e32\u0e01\u0e41\u0e15\u0e48\u0e25\u0e30\u0e2b\u0e21\u0e27\u0e14 \u0e04\u0e49\u0e19\u0e2b\u0e32\u0e15\u0e32\u0e21\u0e0a\u0e37\u0e48\u0e2d\u0e2b\u0e23\u0e37\u0e2d\u0e41\u0e1a\u0e23\u0e19\u0e14\u0e4c \u0e41\u0e25\u0e49\u0e27\u0e23\u0e30\u0e1a\u0e1a\u0e08\u0e30\u0e2a\u0e23\u0e38\u0e1b\u0e23\u0e32\u0e04\u0e32\u0e23\u0e27\u0e21\u0e43\u0e2b\u0e49\u0e17\u0e31\u0e19\u0e17\u0e35",
  total: "\u0e22\u0e2d\u0e14\u0e23\u0e27\u0e21\u0e17\u0e31\u0e49\u0e07\u0e2a\u0e34\u0e49\u0e19",
  summary: "\u0e2a\u0e23\u0e38\u0e1b\u0e2a\u0e40\u0e1b\u0e01",
  search: "\u0e04\u0e49\u0e19\u0e2b\u0e32\u0e2a\u0e34\u0e19\u0e04\u0e49\u0e32",
  brands: "Brands",
  allBrands: "\u0e17\u0e38\u0e01\u0e41\u0e1a\u0e23\u0e19\u0e14\u0e4c",
  choose: "\u0e40\u0e25\u0e37\u0e2d\u0e01",
  selected: "\u0e40\u0e25\u0e37\u0e2d\u0e01\u0e41\u0e25\u0e49\u0e27",
  required: "\u0e08\u0e33\u0e40\u0e1b\u0e47\u0e19",
  optional: "\u0e44\u0e21\u0e48\u0e1a\u0e31\u0e07\u0e04\u0e31\u0e1a",
  notSelected: "\u0e22\u0e31\u0e07\u0e44\u0e21\u0e48\u0e44\u0e14\u0e49\u0e40\u0e25\u0e37\u0e2d\u0e01",
  noProduct: "\u0e44\u0e21\u0e48\u0e1e\u0e1a\u0e2a\u0e34\u0e19\u0e04\u0e49\u0e32\u0e43\u0e19\u0e2b\u0e21\u0e27\u0e14\u0e19\u0e35\u0e49",
  addBuild: "\u0e40\u0e1e\u0e34\u0e48\u0e21\u0e2a\u0e40\u0e1b\u0e01\u0e25\u0e07\u0e15\u0e30\u0e01\u0e23\u0e49\u0e32",
  reset: "\u0e40\u0e23\u0e34\u0e48\u0e21\u0e43\u0e2b\u0e21\u0e48",
  remainingPrefix: "\u0e40\u0e25\u0e37\u0e2d\u0e01\u0e0a\u0e34\u0e49\u0e19\u0e2a\u0e48\u0e27\u0e19\u0e2b\u0e25\u0e31\u0e01\u0e2d\u0e35\u0e01",
  remainingSuffix: "\u0e23\u0e32\u0e22\u0e01\u0e32\u0e23\u0e43\u0e2b\u0e49\u0e04\u0e23\u0e1a",
  complete: "\u0e0a\u0e34\u0e49\u0e19\u0e2a\u0e48\u0e27\u0e19\u0e2b\u0e25\u0e31\u0e01\u0e04\u0e23\u0e1a \u0e1e\u0e23\u0e49\u0e2d\u0e21\u0e1b\u0e23\u0e30\u0e01\u0e2d\u0e1a",
  budget: "\u0e07\u0e1a\u0e1b\u0e23\u0e30\u0e21\u0e32\u0e13",
  noLimit: "\u0e44\u0e21\u0e48\u0e08\u0e33\u0e01\u0e31\u0e14",
  lowToHigh: "\u0e23\u0e32\u0e04\u0e32\u0e15\u0e48\u0e33-\u0e2a\u0e39\u0e07",
  highToLow: "\u0e23\u0e32\u0e04\u0e32\u0e2a\u0e39\u0e07-\u0e15\u0e48\u0e33",
  nameSort: "\u0e0a\u0e37\u0e48\u0e2d A-Z",
  x1: "x 1",
  fitBudget: "พอดีงบที่เหลือ",
  ready: "สเปกพร้อมสั่งซื้อ",
  checkSpec: "ตรวจสเปก",
  blocked: "แก้รายการที่ไม่เข้ากันก่อน",
  chooseRequired: "เลือกชิ้นส่วนจำเป็นให้ครบก่อน",
};

type SortKey = "price-asc" | "price-desc" | "name";
type BuildIssue = { kind: "error" | "warning" | "info"; title: string; detail: string };
type BuildAnalysis = { issues: BuildIssue[]; errors: BuildIssue[]; warnings: BuildIssue[]; infos: BuildIssue[]; recommendedPsu?: number; estimatedLoad?: number };

export function BuilderClient({ buildParts }: { buildParts: Record<string, Product[]> }) {
  const params = useSearchParams();
  const [budgetId, setBudgetId] = useState(params.get("budget") || "");
  const [activeSlotKey, setActiveSlotKey] = useState(buildSlots[0]?.key ?? "");
  const [slotSearch, setSlotSearch] = useState<Record<string, string>>({});
  const [brandFilters, setBrandFilters] = useState<Record<string, string[]>>({});
  const [brandOpen, setBrandOpen] = useState(false);
  const [sortBy, setSortBy] = useState<SortKey>("price-asc");
  const [fitBudgetOnly, setFitBudgetOnly] = useState(false);
  const [build, setBuild] = useState<Record<string, Product>>({});
  const { addItem, openCart } = useCart();

  const activeSlot = buildSlots.find((slot) => slot.key === activeSlotKey) ?? buildSlots[0];
  const budget = budgets.find((item) => item.id === budgetId);
  const total = Object.values(build).reduce((sum, part) => sum + part.price, 0);
  const requiredTotal = buildSlots.filter((slot) => slot.required).length;
  const requiredPicked = buildSlots.filter((slot) => slot.required && build[slot.key]).length;
  const percent = budget ? Math.min(100, (total / budget.max) * 100) : 0;
  const complete = requiredPicked === requiredTotal;
  const remaining = requiredTotal - requiredPicked;
  const lines = useMemo(() => buildSlots.map((slot) => ({ slot, part: build[slot.key] })), [build]);
  const analysis = useMemo(() => analyzeBuild(build, budget?.max), [build, budget?.max]);
  const cartReady = complete && analysis.errors.length === 0 && Object.values(build).length > 0;
  const activeSelectedPrice = activeSlot && build[activeSlot.key] ? build[activeSlot.key].price : 0;
  const activeBudgetLeft = budget ? budget.max - total + activeSelectedPrice : Infinity;

  const activeParts = activeSlot ? buildParts[activeSlot.cat] || [] : [];
  const brands = useMemo(() => {
    return [...new Set(activeParts.map((part) => part.brand).filter(Boolean))].sort((a, b) => a.localeCompare(b));
  }, [activeParts]);
  const activeBrands = activeSlot ? brandFilters[activeSlot.key] ?? [] : [];
  const search = activeSlot ? (slotSearch[activeSlot.key] || "").trim().toLowerCase() : "";
  const visibleParts = useMemo(() => {
    const filtered = activeParts.filter((part) => {
      const matchesSearch = search
        ? `${part.name} ${part.brand} ${part.spec} ${part.price}`.toLowerCase().includes(search)
        : true;
      const matchesBrand = activeBrands.length ? activeBrands.includes(part.brand) : true;
      const matchesBudget = fitBudgetOnly && budget ? part.price <= activeBudgetLeft : true;
      return matchesSearch && matchesBrand && matchesBudget;
    });

    return [...filtered].sort((a, b) => {
      if (sortBy === "price-desc") return b.price - a.price;
      if (sortBy === "name") return a.name.localeCompare(b.name);
      return a.price - b.price;
    });
  }, [activeBrands, activeBudgetLeft, activeParts, budget, fitBudgetOnly, search, sortBy]);

  const choosePart = (slotKey: string, part: Product) => {
    setBuild((current) => {
      const next = { ...current };
      if (next[slotKey]?.id === part.id) delete next[slotKey];
      else next[slotKey] = part;
      return next;
    });
  };

  const removePart = (slotKey: string) => {
    setBuild((current) => {
      const next = { ...current };
      delete next[slotKey];
      return next;
    });
  };

  const toggleBrand = (brand: string) => {
    if (!activeSlot) return;
    setBrandFilters((current) => {
      const selected = current[activeSlot.key] ?? [];
      const next = selected.includes(brand) ? selected.filter((item) => item !== brand) : [...selected, brand];
      return { ...current, [activeSlot.key]: next };
    });
  };

  const addBuild = () => {
    if (!cartReady) return;
    Object.values(build).forEach((part) => addItem(part, 1));
    if (Object.values(build).length) openCart();
  };

  return (
    <main className="bg-slate-50">
      <section className="relative overflow-hidden bg-slate-950 py-12 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(46%_80%_at_88%_20%,rgba(37,99,235,.25),transparent_70%)]" />
        <div className="wrap relative">
          <p className="mono text-xs uppercase tracking-[.18em] text-blue-300">{T.service}</p>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight md:text-5xl">{T.title}</h1>
          <p className="mt-4 max-w-2xl leading-7 text-slate-400">{T.intro}</p>
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

      <section className="wrap grid gap-7 py-8 xl:grid-cols-[360px_1fr]">
        <aside className="h-fit rounded-[18px] border border-slate-200 bg-white p-5 shadow-sm xl:sticky xl:top-24">
          <div className="mb-4 flex items-start justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-slate-950">{T.total}</h2>
              <p className="mt-1 text-sm text-slate-500">{T.summary}</p>
            </div>
            <div className="mono text-right text-xl font-semibold text-rose-700">{baht(total)}</div>
          </div>

          {budget ? (
            <div className="mb-4 rounded-2xl bg-slate-50 p-3">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>{T.budget}</span>
                <span>{budget.max >= 999999 ? T.noLimit : baht(budget.max)}</span>
              </div>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-white">
                <div className={`h-full rounded-full ${total > budget.max ? "bg-red-500" : "bg-blue-600"}`} style={{ width: `${percent}%` }} />
              </div>
            </div>
          ) : null}

          <div className="max-h-[620px] space-y-3 overflow-y-auto pr-1">
            {lines.map(({ slot, part }) => {
              const isActive = activeSlot?.key === slot.key;
              return (
                <div
                  key={slot.key}
                  role="button"
                  tabIndex={0}
                  onClick={() => {
                    setActiveSlotKey(slot.key);
                    setBrandOpen(false);
                  }}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      setActiveSlotKey(slot.key);
                      setBrandOpen(false);
                    }
                  }}
                  className={`w-full rounded-2xl border p-3 text-left transition ${
                    isActive ? "border-blue-300 bg-blue-50/70" : "border-transparent bg-slate-50 hover:border-slate-200 hover:bg-white"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <span className="min-w-0">
                      <span className="block text-sm font-semibold text-slate-700">{slot.label.split(" ")[0]}</span>
                      {!part ? <span className="mt-1 block text-xs text-slate-400">{T.notSelected}</span> : null}
                    </span>
                    {part ? <span className="mono shrink-0 text-sm text-slate-500">{baht(part.price)}</span> : null}
                  </div>
                  {part ? (
                    <div className="mt-3 grid grid-cols-[52px_1fr_auto] items-center gap-3">
                      <ProductThumb product={part} size="md" />
                      <span className="min-w-0">
                        <span className="line-clamp-2 text-sm font-medium leading-5 text-slate-700">{part.name}</span>
                        <span className="mt-1 inline-flex rounded-full bg-rose-100 px-3 py-1 text-xs font-semibold text-rose-700">
                          {T.selected}
                        </span>
                      </span>
                      <button
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation();
                          removePart(slot.key);
                        }}
                        className="grid h-9 w-9 place-items-center rounded-full text-rose-500 transition hover:bg-rose-50"
                        aria-label="Remove part"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="mt-3 flex items-center gap-3">
                      <span className="grid h-10 w-10 place-items-center rounded-xl bg-white text-slate-500">
                        <CategoryIcon name={slot.cat} className="h-5 w-5" />
                      </span>
                      <span className="text-sm font-medium text-slate-700">{slot.required ? T.required : T.optional}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="mt-5 border-t border-slate-100 pt-5">
            <div className={`mb-4 flex items-center gap-2 rounded-xl p-3 text-sm ${complete ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-600"}`}>
              {complete ? <Check className="h-4 w-4" /> : <Zap className="h-4 w-4" />}
              {complete ? T.complete : `${T.remainingPrefix} ${remaining} ${T.remainingSuffix}`}
            </div>

            <div className="mb-4 rounded-2xl border border-slate-200 bg-white p-3">
              <div className="mb-3 flex items-center justify-between gap-3">
                <span className="flex items-center gap-2 text-sm font-semibold text-slate-800">
                  <ShieldCheck className="h-4 w-4 text-blue-600" /> {T.checkSpec}
                </span>
                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${cartReady ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>
                  {cartReady ? T.ready : complete ? T.blocked : T.chooseRequired}
                </span>
              </div>
              {analysis.issues.length ? (
                <div className="space-y-2">
                  {analysis.issues.map((issue) => (
                    <SpecIssue key={`${issue.kind}-${issue.title}-${issue.detail}`} issue={issue} />
                  ))}
                </div>
              ) : (
                <div className="flex items-start gap-2 rounded-xl bg-emerald-50 p-3 text-sm text-emerald-700">
                  <Check className="mt-0.5 h-4 w-4 shrink-0" />
                  <span>ยังไม่พบปัญหาความเข้ากันของชิ้นส่วนที่เลือก</span>
                </div>
              )}
            </div>

            <button
              onClick={addBuild}
              disabled={!cartReady}
              title={!complete ? T.chooseRequired : analysis.errors.length ? T.blocked : T.addBuild}
              className={`flex h-12 w-full items-center justify-center gap-2 rounded-full font-medium shadow-lg transition ${
                cartReady ? "bg-blue-600 text-white shadow-blue-600/20 hover:bg-blue-700" : "cursor-not-allowed bg-slate-200 text-slate-500 shadow-none"
              }`}
            >
              <ShoppingCart className="h-4 w-4" /> {T.addBuild}
            </button>
            <button onClick={() => setBuild({})} className="mt-3 flex h-12 w-full items-center justify-center gap-2 rounded-full border border-slate-300 bg-white font-medium transition hover:bg-slate-50">
              <RotateCcw className="h-4 w-4" /> {T.reset}
            </button>
          </div>
        </aside>

        <section className="min-w-0">
          <div className="rounded-[18px] border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-slate-500">{T.choose}</p>
                <h2 className="mt-1 text-2xl font-semibold tracking-tight text-slate-950">{activeSlot?.label}</h2>
              </div>
              <div className="relative w-full max-w-[260px]">
                <select
                  value={sortBy}
                  onChange={(event) => setSortBy(event.target.value as SortKey)}
                  className="h-12 w-full appearance-none rounded-xl border border-slate-200 bg-white px-4 pr-10 text-sm text-slate-600 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                >
                  <option value="price-asc">{T.lowToHigh}</option>
                  <option value="price-desc">{T.highToLow}</option>
                  <option value="name">{T.nameSort}</option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              </div>
            </div>

            <div className="mt-6 grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto]">
              <label className="relative block">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                <input
                  value={activeSlot ? slotSearch[activeSlot.key] || "" : ""}
                  onChange={(event) => activeSlot && setSlotSearch((current) => ({ ...current, [activeSlot.key]: event.target.value }))}
                  placeholder={T.search}
                  className="h-14 w-full rounded-full border border-slate-200 bg-white pl-12 pr-5 text-base outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                />
              </label>

              <div className="flex flex-wrap items-center gap-3">
                {budget ? (
                  <button
                    type="button"
                    onClick={() => setFitBudgetOnly((value) => !value)}
                    className={`inline-flex h-14 items-center justify-center rounded-full px-5 text-sm font-semibold transition ${
                      fitBudgetOnly ? "bg-blue-600 text-white" : "bg-blue-50 text-blue-700 hover:bg-blue-100"
                    }`}
                  >
                    {T.fitBudget}
                  </button>
                ) : null}

                <div className="relative">
                <button
                  type="button"
                  onClick={() => setBrandOpen((open) => !open)}
                  className={`inline-flex h-14 items-center justify-center gap-2 rounded-full px-6 font-semibold transition ${
                    activeBrands.length ? "bg-rose-600 text-white" : "bg-rose-50 text-rose-700 hover:bg-rose-100"
                  }`}
                >
                  {activeBrands.length ? `${T.brands} (${activeBrands.length})` : T.brands}
                  <ChevronDown className="h-4 w-4" />
                </button>
                {brandOpen ? (
                  <div className="absolute right-0 z-20 mt-2 w-64 rounded-2xl border border-slate-200 bg-white p-3 shadow-xl">
                    <button
                      type="button"
                      onClick={() => activeSlot && setBrandFilters((current) => ({ ...current, [activeSlot.key]: [] }))}
                      className={`mb-2 w-full rounded-xl px-3 py-2 text-left text-sm font-medium ${activeBrands.length ? "text-slate-600 hover:bg-slate-50" : "bg-slate-100 text-slate-950"}`}
                    >
                      {T.allBrands}
                    </button>
                    <div className="max-h-56 space-y-1 overflow-y-auto">
                      {brands.map((brand) => (
                        <button
                          key={brand}
                          type="button"
                          onClick={() => toggleBrand(brand)}
                          className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-sm transition ${
                            activeBrands.includes(brand) ? "bg-blue-50 font-semibold text-blue-700" : "text-slate-600 hover:bg-slate-50"
                          }`}
                        >
                          <span className="truncate">{brand}</span>
                          {activeBrands.includes(brand) ? <Check className="h-4 w-4" /> : null}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : null}
                </div>
              </div>
            </div>
          </div>

          {visibleParts.length ? (
            <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
              {visibleParts.map((part) => {
                const isSelected = activeSlot ? build[activeSlot.key]?.id === part.id : false;
                return (
                  <article
                    key={part.id}
                    className={`group flex min-h-[360px] flex-col overflow-hidden rounded-[18px] border bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-lg ${
                      isSelected ? "border-blue-500 ring-4 ring-blue-100" : "border-slate-200"
                    }`}
                  >
                    <div className="grid aspect-[4/3] place-items-center overflow-hidden rounded-2xl bg-white">
                      <ProductThumb product={part} size="card" />
                    </div>
                    <div className="mt-5 flex flex-1 flex-col">
                      <h3 className="line-clamp-3 min-h-[72px] text-base font-semibold leading-6 text-slate-800">{part.name}</h3>
                      <p className="mt-2 line-clamp-1 text-sm text-slate-500">{part.brand || part.spec}</p>
                      <div className="mt-auto flex items-end justify-between gap-3 pt-6">
                        <div className="mono text-xl font-semibold text-slate-950">{baht(part.price)}</div>
                        <button
                          type="button"
                          onClick={() => activeSlot && choosePart(activeSlot.key, part)}
                          className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl border text-lg transition ${
                            isSelected ? "border-blue-600 bg-blue-600 text-white" : "border-rose-300 text-rose-700 hover:bg-rose-50"
                          }`}
                          aria-label={isSelected ? T.selected : T.choose}
                        >
                          {isSelected ? <Check className="h-5 w-5" /> : <Plus className="h-6 w-6" />}
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="mt-6 rounded-[18px] border border-dashed border-slate-200 bg-white p-12 text-center text-slate-500">{T.noProduct}</div>
          )}
        </section>
      </section>
    </main>
  );
}

function ProductThumb({ product, size = "md" }: { product: Product; size?: "sm" | "md" | "card" }) {
  if (size === "card") {
    return product.image ? (
      <img src={product.image} alt={product.name} className="h-full w-full object-contain transition duration-300 group-hover:scale-105" />
    ) : (
      <CategoryIcon name={product.glyph} className="h-20 w-20 text-slate-900/20" />
    );
  }

  const sizeClass = {
    sm: "h-11 w-11 rounded-xl",
    md: "h-14 w-14 rounded-2xl",
  }[size];

  return (
    <span className={`relative grid shrink-0 place-items-center overflow-hidden bg-white text-slate-500 ${sizeClass}`}>
      {product.image ? (
        <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
      ) : (
        <CategoryIcon name={product.glyph} className={size === "sm" ? "h-5 w-5" : "h-6 w-6"} />
      )}
    </span>
  );
}

function SpecIssue({ issue }: { issue: BuildIssue }) {
  const style = {
    error: "bg-red-50 text-red-700",
    warning: "bg-amber-50 text-amber-700",
    info: "bg-blue-50 text-blue-700",
  }[issue.kind];
  const Icon = issue.kind === "error" ? AlertTriangle : issue.kind === "warning" ? Zap : Info;

  return (
    <div className={`flex items-start gap-2 rounded-xl p-3 text-sm ${style}`}>
      <Icon className="mt-0.5 h-4 w-4 shrink-0" />
      <span>
        <span className="block font-semibold">{issue.title}</span>
        <span className="mt-0.5 block leading-5 opacity-85">{issue.detail}</span>
      </span>
    </div>
  );
}

function analyzeBuild(build: Record<string, Product>, budgetMax?: number): BuildAnalysis {
  const issues: BuildIssue[] = [];
  const cpu = build.cpu;
  const mb = build.mb;
  const ram = build.ram;
  const gpu = build.gpu;
  const psu = build.psu;
  const total = Object.values(build).reduce((sum, part) => sum + part.price, 0);

  const cpuSocket = cpu ? readSocket(cpu) : null;
  const mbSocket = mb ? readSocket(mb) : null;
  if (cpu && mb) {
    if (cpuSocket && mbSocket && cpuSocket !== mbSocket) {
      issues.push({
        kind: "error",
        title: "CPU กับเมนบอร์ดไม่ตรงกัน",
        detail: `${cpu.name} เป็น ${cpuSocket} แต่เมนบอร์ดเป็น ${mbSocket}`,
      });
    } else if (!cpuSocket || !mbSocket) {
      issues.push({
        kind: "warning",
        title: "ยังตรวจ socket ได้ไม่ครบ",
        detail: "ควรใส่ข้อมูล socket ในชื่อ/รุ่น/สเปกสินค้า เช่น AM5 หรือ LGA1700 เพื่อให้ระบบเช็คแม่นขึ้น",
      });
    }
  }

  const mbMemory = mb ? readMemoryType(mb) : null;
  const ramMemory = ram ? readMemoryType(ram) : null;
  if (mb && ram) {
    if (mbMemory && ramMemory && mbMemory !== ramMemory) {
      issues.push({
        kind: "error",
        title: "แรมกับเมนบอร์ดคนละชนิด",
        detail: `เมนบอร์ดรองรับ ${mbMemory} แต่แรมที่เลือกเป็น ${ramMemory}`,
      });
    } else if (!mbMemory || !ramMemory) {
      issues.push({
        kind: "warning",
        title: "ยังตรวจชนิดแรมได้ไม่ครบ",
        detail: "ควรมี DDR4 หรือ DDR5 ในข้อมูลเมนบอร์ดและแรม เพื่อกันการเลือกผิดรุ่น",
      });
    }
  }

  const estimatedLoad = estimateSystemLoad(cpu, gpu);
  const recommendedPsu = estimatedLoad ? Math.ceil((estimatedLoad * 1.35) / 50) * 50 : undefined;
  const psuWatt = psu ? readWatt(psu) : null;
  if (psu && estimatedLoad) {
    if (psuWatt && recommendedPsu && psuWatt < estimatedLoad * 1.15) {
      issues.push({
        kind: "error",
        title: "PSU วัตต์ต่ำเกินไป",
        detail: `โหลดโดยประมาณ ${estimatedLoad}W แนะนำอย่างน้อย ${recommendedPsu}W แต่ PSU ที่เลือกคือ ${psuWatt}W`,
      });
    } else if (psuWatt && recommendedPsu && psuWatt < recommendedPsu) {
      issues.push({
        kind: "warning",
        title: "PSU พอใช้แต่เผื่อน้อย",
        detail: `โหลดโดยประมาณ ${estimatedLoad}W แนะนำ ${recommendedPsu}W เพื่อเหลือ headroom`,
      });
    } else if (!psuWatt) {
      issues.push({
        kind: "warning",
        title: "ยังอ่านวัตต์ PSU ไม่ได้",
        detail: "ควรใส่วัตต์ในชื่อ/รุ่น/สเปกสินค้า เช่น 650W เพื่อให้ระบบประเมินไฟได้",
      });
    }
  }

  if (budgetMax && total > budgetMax) {
    issues.push({
      kind: "info",
      title: "เกินงบที่เลือก",
      detail: `ยอดรวมเกินงบประมาณ ${baht(total - budgetMax)} แต่ยังสั่งซื้อได้ถ้าลูกค้ายืนยัน`,
    });
  }

  return {
    issues,
    errors: issues.filter((issue) => issue.kind === "error"),
    warnings: issues.filter((issue) => issue.kind === "warning"),
    infos: issues.filter((issue) => issue.kind === "info"),
    recommendedPsu,
    estimatedLoad,
  };
}

function productText(product: Product) {
  const specRows = product.specs?.flat().join(" ") ?? "";
  return `${product.name} ${product.brand} ${product.spec} ${product.notes ?? ""} ${product.description ?? ""} ${specRows}`.toUpperCase();
}

function readSocket(product: Product) {
  const text = productText(product).replace(/\s+/g, "");
  const patterns = ["LGA1851", "LGA1700", "LGA1200", "LGA1151", "AM5", "AM4", "TR4", "STRX4"];
  return patterns.find((pattern) => text.includes(pattern)) ?? null;
}

function readMemoryType(product: Product) {
  const text = productText(product);
  if (/\bDDR5\b/.test(text)) return "DDR5";
  if (/\bDDR4\b/.test(text)) return "DDR4";
  if (/\bDDR3\b/.test(text)) return "DDR3";
  return null;
}

function readWatt(product: Product) {
  const text = productText(product);
  const matches = [...text.matchAll(/(\d{3,4})\s*(?:W|วัตต์)/g)]
    .map((match) => Number(match[1]))
    .filter((value) => value >= 250 && value <= 2000);
  return matches.length ? Math.max(...matches) : null;
}

function estimateSystemLoad(cpu?: Product, gpu?: Product) {
  const cpuLoad = cpu ? estimateCpuLoad(cpu) : 0;
  const gpuLoad = gpu ? estimateGpuLoad(gpu) : 0;
  if (!cpuLoad && !gpuLoad) return 0;
  return cpuLoad + gpuLoad + 90;
}

function estimateCpuLoad(product: Product) {
  const text = productText(product);
  if (/I9|RYZEN\s*9|R9\b/.test(text)) return 170;
  if (/I7|RYZEN\s*7|R7\b/.test(text)) return 125;
  if (/I5|RYZEN\s*5|R5\b/.test(text)) return 95;
  if (/I3|RYZEN\s*3|R3\b/.test(text)) return 65;
  return 90;
}

function estimateGpuLoad(product: Product) {
  const text = productText(product);
  const table: Array<[RegExp, number]> = [
    [/RTX\s*4090|4090\b/, 450],
    [/RTX\s*4080|4080\b|RX\s*7900/, 330],
    [/RTX\s*4070|4070\b|RX\s*7800/, 240],
    [/RTX\s*4060|4060\b|RX\s*7600/, 170],
    [/RTX\s*3090|3090\b/, 360],
    [/RTX\s*3080|3080\b|RX\s*6800/, 320],
    [/RTX\s*3070|3070\b|RX\s*6700/, 240],
    [/RTX\s*3060|3060\b|RX\s*6600/, 180],
    [/GTX\s*1660|1660\b/, 140],
  ];
  return table.find(([pattern]) => pattern.test(text))?.[1] ?? 220;
}
