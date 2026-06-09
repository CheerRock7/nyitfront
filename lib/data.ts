// Presentation-only config. The product catalog and categories now come from the
// `nyit` Postgres database (see lib/products.ts). This file only holds types, the
// static presentation overlay for categories (English label + icon), the PC-builder
// slot/budget config, and formatting helpers.

export type Category = {
  id: string; // category slug, e.g. "gpu"
  name: string; // Thai name from the DB
  en: string; // English label (presentation)
  icon: string; // icon key (see components/icons.tsx)
  feature?: boolean;
};

export type Product = {
  id: string;
  name: string;
  cat: string; // category slug
  catName?: string; // Thai category name (denormalized for display)
  catEn?: string; // English category label (denormalized for display)
  brand: string;
  price: number;
  was?: number;
  badge?: "sale" | "hot" | "new" | "";
  spec: string;
  glyph: string;
  image?: string; // absolute image URL when available
  rating?: number;
};

export type BuildSlot = {
  key: string;
  label: string;
  cat: string;
  required: boolean;
};

// Presentation overlay keyed by category slug. The DB supplies the Thai `name`;
// this supplies the English label, the icon, and the "feature" flag. Slugs not in
// the DB (builder, set, case, cool, gear) exist here to support the nav/builder UI.
export const categoryMeta: Record<string, { en: string; icon: string; feature?: boolean }> = {
  builder: { en: "PC BUILDER", icon: "builder", feature: true },
  set: { en: "PC SETS", icon: "set" },
  gpu: { en: "GPU", icon: "gpu" },
  cpu: { en: "CPU", icon: "cpu" },
  mb: { en: "MAINBOARD", icon: "mb" },
  ram: { en: "MEMORY", icon: "ram" },
  ssd: { en: "STORAGE", icon: "ssd" },
  psu: { en: "PSU", icon: "psu" },
  case: { en: "CASE", icon: "case" },
  cool: { en: "COOLING", icon: "cool" },
  gear: { en: "GEAR", icon: "gear" },
  monitor: { en: "MONITOR", icon: "monitor" },
  peripheral: { en: "PERIPHERAL", icon: "gear" },
};

// Virtual category card linking to the PC builder (no DB row behind it).
export const builderCategory: Category = {
  id: "builder",
  name: "จัดสเปกคอม",
  en: categoryMeta.builder.en,
  icon: categoryMeta.builder.icon,
  feature: true,
};

export const buildSlots: BuildSlot[] = [
  { key: "cpu", label: "ซีพียู (CPU)", cat: "cpu", required: true },
  { key: "mb", label: "เมนบอร์ด (Mainboard)", cat: "mb", required: true },
  { key: "gpu", label: "การ์ดจอ (GPU)", cat: "gpu", required: true },
  { key: "ram", label: "แรม (Memory)", cat: "ram", required: true },
  { key: "ssd", label: "จัดเก็บข้อมูล (Storage)", cat: "ssd", required: true },
  { key: "psu", label: "เพาเวอร์ (PSU)", cat: "psu", required: true },
  { key: "case", label: "เคส (Case)", cat: "case", required: false },
  { key: "cool", label: "ระบบระบายความร้อน", cat: "cool", required: false },
];

export const budgets = [
  { id: "b1", label: "ต่ำกว่า 20,000", sub: "เริ่มต้น · ทำงาน/เรียน", max: 20000 },
  { id: "b2", label: "20,000 - 40,000", sub: "เกมมิ่งคุ้มค่า", max: 40000 },
  { id: "b3", label: "40,000 - 70,000", sub: "เล่นเกมลื่นทุกเกม", max: 70000 },
  { id: "b4", label: "มากกว่า 70,000", sub: "สเปกท็อป · ครีเอเตอร์", max: 999999 },
];

export const baht = (value: number) => "฿" + value.toLocaleString("th-TH");
