export type Category = {
  id: string;
  name: string;
  en: string;
  icon: string;
  feature?: boolean;
};

export type Product = {
  id: string;
  name: string;
  cat: string;
  brand: string;
  price: number;
  was?: number;
  badge?: "sale" | "hot" | "new" | "";
  spec: string;
  glyph: string;
  rating?: number;
};

export type BuildSlot = {
  key: string;
  label: string;
  cat: string;
  required: boolean;
};

export const categories: Category[] = [
  { id: "builder", name: "จัดสเปกคอม", en: "PC BUILDER", icon: "builder", feature: true },
  { id: "set", name: "คอมเซ็ต", en: "PC SETS", icon: "set" },
  { id: "gpu", name: "การ์ดจอ", en: "GPU", icon: "gpu" },
  { id: "cpu", name: "ซีพียู", en: "CPU", icon: "cpu" },
  { id: "mb", name: "เมนบอร์ด", en: "MAINBOARD", icon: "mb" },
  { id: "ram", name: "แรม", en: "MEMORY", icon: "ram" },
  { id: "ssd", name: "HDD / SSD", en: "STORAGE", icon: "ssd" },
  { id: "psu", name: "Power Supply", en: "PSU", icon: "psu" },
  { id: "case", name: "Case", en: "CASE", icon: "case" },
  { id: "cool", name: "Cooling", en: "COOLING", icon: "cool" },
  { id: "gear", name: "Gaming Gear", en: "GEAR", icon: "gear" },
  { id: "monitor", name: "Monitor", en: "MONITOR", icon: "monitor" },
];

export const categoryMap = Object.fromEntries(categories.map((category) => [category.id, category]));

export const products: Product[] = [
  { id: "p1", name: "RTX 4070 SUPER Gaming OC 12GB", cat: "gpu", brand: "ASUS", price: 21900, was: 24900, badge: "sale", spec: "GDDR6X · 12GB · DLSS 3", glyph: "gpu", rating: 4.9 },
  { id: "p2", name: "Intel Core i7-14700K", cat: "cpu", brand: "Intel", price: 14500, badge: "hot", spec: "20 Core · 28 Thread · 5.6GHz", glyph: "cpu", rating: 4.8 },
  { id: "p3", name: "AMD Ryzen 7 7800X3D", cat: "cpu", brand: "AMD", price: 14900, badge: "hot", spec: "8 Core · 16 Thread · 3D V-Cache", glyph: "cpu", rating: 5 },
  { id: "p4", name: "DDR5 RGB RAM 32GB (16x2) 6000", cat: "ram", brand: "G.SKILL", price: 4290, badge: "new", spec: "DDR5 · CL30 · RGB", glyph: "ram", rating: 4.7 },
  { id: "p5", name: "NVMe SSD 1TB Gen4", cat: "ssd", brand: "WD", price: 2690, badge: "new", spec: "PCIe 4.0 · 7,000 MB/s", glyph: "ssd", rating: 4.8 },
  { id: "p6", name: "Gaming PC Set - Ryzen + RTX", cat: "set", brand: "CHub", price: 45900, was: 49900, badge: "sale", spec: "พร้อมเล่น · ประกอบฟรี", glyph: "set", rating: 4.9 },
  { id: "p7", name: "750W Gold Power Supply", cat: "psu", brand: "Corsair", price: 3290, badge: "", spec: "80+ Gold · Full Modular", glyph: "psu", rating: 4.6 },
  { id: "p8", name: "27 inch Gaming Monitor 165Hz", cat: "monitor", brand: "LG", price: 7990, badge: "hot", spec: "QHD · IPS · 1ms · 165Hz", glyph: "monitor", rating: 4.8 },
  { id: "p9", name: "B650 Gaming Mainboard", cat: "mb", brand: "MSI", price: 6490, badge: "", spec: "AM5 · DDR5 · WiFi 6", glyph: "mb", rating: 4.7 },
  { id: "p10", name: "NZXT H6 Flow Mid-Tower Case", cat: "case", brand: "NZXT", price: 3590, badge: "new", spec: "ATX · กระจก · airflow", glyph: "case", rating: 4.8 },
  { id: "p11", name: "360mm AIO Liquid Cooler", cat: "cool", brand: "Arctic", price: 4290, badge: "", spec: "Liquid · LCD · เงียบ", glyph: "cool", rating: 4.6 },
  { id: "p12", name: "Mechanical Keyboard RGB", cat: "gear", brand: "Keychron", price: 2890, was: 3490, badge: "sale", spec: "Hot-swap · Red Switch", glyph: "gear", rating: 4.9 },
  { id: "p13", name: "RTX 4060 Ti 8GB Dual", cat: "gpu", brand: "Gigabyte", price: 13900, badge: "", spec: "GDDR6 · 8GB · DLSS 3", glyph: "gpu", rating: 4.6 },
  { id: "p14", name: "Wireless Gaming Mouse", cat: "gear", brand: "Logitech", price: 2490, badge: "hot", spec: "26K DPI · เบา 60g", glyph: "gear", rating: 4.9 },
  { id: "p15", name: "Office PC Set - i5", cat: "set", brand: "CHub", price: 18900, badge: "", spec: "ทำงาน · เรียน · พร้อมใช้", glyph: "set", rating: 4.7 },
  { id: "p16", name: "DDR5 RAM 16GB 5600", cat: "ram", brand: "Kingston", price: 1990, badge: "", spec: "DDR5 · CL40", glyph: "ram", rating: 4.5 },
];

export const productMap = Object.fromEntries(products.map((product) => [product.id, product]));

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

export const buildParts: Record<string, Product[]> = {
  cpu: [productMap.p2, productMap.p3, { id: "b-cpu1", name: "Intel Core i5-14600K", cat: "cpu", brand: "Intel", price: 9900, spec: "14 Core · 5.3GHz", glyph: "cpu" }],
  mb: [productMap.p9, { id: "b-mb1", name: "Z790 Gaming MB", cat: "mb", brand: "ASUS", price: 8900, spec: "LGA1700 · DDR5", glyph: "mb" }, { id: "b-mb2", name: "B760M MicroATX", cat: "mb", brand: "MSI", price: 4290, spec: "LGA1700 · DDR5", glyph: "mb" }],
  gpu: [productMap.p1, productMap.p13, { id: "b-gpu1", name: "RTX 4080 SUPER 16GB", cat: "gpu", brand: "MSI", price: 38900, spec: "GDDR6X · 16GB", glyph: "gpu" }],
  ram: [productMap.p4, productMap.p16, { id: "b-ram1", name: "DDR5 64GB (32x2) 6000", cat: "ram", brand: "Corsair", price: 8290, spec: "DDR5 · CL30", glyph: "ram" }],
  ssd: [productMap.p5, { id: "b-ssd1", name: "NVMe SSD 2TB Gen4", cat: "ssd", brand: "Samsung", price: 5290, spec: "PCIe4 · 7,450MB/s", glyph: "ssd" }, { id: "b-ssd2", name: "SSD 500GB SATA", cat: "ssd", brand: "WD", price: 1290, spec: "SATA · 560MB/s", glyph: "ssd" }],
  psu: [productMap.p7, { id: "b-psu1", name: "850W Gold Modular", cat: "psu", brand: "Corsair", price: 4490, spec: "80+ Gold", glyph: "psu" }, { id: "b-psu2", name: "650W Bronze", cat: "psu", brand: "Antec", price: 1990, spec: "80+ Bronze", glyph: "psu" }],
  case: [productMap.p10, { id: "b-case1", name: "Lian Li O11 Mini", cat: "case", brand: "Lian Li", price: 4990, spec: "กระจก 3 ด้าน", glyph: "case" }],
  cool: [productMap.p11, { id: "b-cool1", name: "Air Cooler Dual Tower", cat: "cool", brand: "Noctua", price: 3590, spec: "Air · เงียบมาก", glyph: "cool" }],
};

export const budgets = [
  { id: "b1", label: "ต่ำกว่า 20,000", sub: "เริ่มต้น · ทำงาน/เรียน", max: 20000 },
  { id: "b2", label: "20,000 - 40,000", sub: "เกมมิ่งคุ้มค่า", max: 40000 },
  { id: "b3", label: "40,000 - 70,000", sub: "เล่นเกมลื่นทุกเกม", max: 70000 },
  { id: "b4", label: "มากกว่า 70,000", sub: "สเปกท็อป · ครีเอเตอร์", max: 999999 },
];

export const baht = (value: number) => "฿" + value.toLocaleString("th-TH");
