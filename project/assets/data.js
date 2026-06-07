/* ============================================================
   COMPUTER HUB — data + icons
   ============================================================ */

/* ---- Inline SVG icons (minimal line set) ---- */
const ICN = {
  search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.2-3.2"/></svg>',
  cart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M3 4h2l2.2 12.3a1.5 1.5 0 0 0 1.5 1.2h8.2a1.5 1.5 0 0 0 1.5-1.2L21 8H6"/><circle cx="9.5" cy="20" r="1.3"/><circle cx="18" cy="20" r="1.3"/></svg>',
  user: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="3.6"/><path d="M4.5 20a7.5 7.5 0 0 1 15 0"/></svg>',
  menu: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M4 7h16M4 12h16M4 17h16"/></svg>',
  close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M6 6l12 12M18 6 6 18"/></svg>',
  plus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>',
  heart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20s-7-4.4-9.3-9C1.2 8 2.7 5 5.8 5 8 5 9.4 6.5 12 9c2.6-2.5 4-4 6.2-4 3.1 0 4.6 3 3.1 6-2.3 4.6-9.3 9-9.3 9Z"/></svg>',
  check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m5 12 4.5 4.5L19 7"/></svg>',
  arrow: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
  bolt: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M13 3 4 14h6l-1 7 9-11h-6l1-7Z"/></svg>',
  shield: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3 5 6v5c0 4.5 3 8 7 10 4-2 7-5.5 7-10V6l-7-3Z"/></svg>',
  truck: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h11v9H3zM14 9h4l3 3v3h-7"/><circle cx="7" cy="18" r="1.6"/><circle cx="17.5" cy="18" r="1.6"/></svg>',
  wrench: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M15 6a3.5 3.5 0 0 0-4.6 4.4l-6 6a1.6 1.6 0 0 0 2.3 2.3l6-6A3.5 3.5 0 0 0 18 9l-2.2 2.2L13.5 9 15.7 7"/></svg>',
  phone: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M6 3h3l1.5 4.5L8 9.5a12 12 0 0 0 6.5 6.5l2-2.5L21 15v3a2 2 0 0 1-2.2 2A16 16 0 0 1 4 5.2 2 2 0 0 1 6 3Z"/></svg>',
  mail: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m4 7 8 6 8-6"/></svg>',
  pin: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21s7-6 7-11a7 7 0 1 0-14 0c0 5 7 11 7 11Z"/><circle cx="12" cy="10" r="2.5"/></svg>',
  chat: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M4 5h16v11H9l-4 3v-3H4Z"/></svg>',
  fb: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M14 8h2V5h-2a3 3 0 0 0-3 3v2H9v3h2v6h3v-6h2.2l.8-3H14V8.5c0-.3.2-.5.5-.5Z"/></svg>',
  ig: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="4" width="16" height="16" rx="5"/><circle cx="12" cy="12" r="3.6"/><circle cx="17" cy="7" r="1"/></svg>',
  yt: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="6" width="18" height="12" rx="3"/><path d="m11 9 4 3-4 3Z"/></svg>',
  trash: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M4 7h16M9 7V5h6v2M6 7l1 13h10l1-13"/></svg>',
};

/* Category glyphs (simple geometric line icons) */
const CATICON = {
  builder: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="3" width="14" height="18" rx="2"/><path d="M8 7h5M8 11h5M8 15h3"/><circle cx="16" cy="7" r="0"/></svg>',
  set: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="13" height="9" rx="1.5"/><path d="M9.5 16v2M6 18h7"/><rect x="18" y="4" width="3" height="16" rx="1"/></svg>',
  gpu: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="6" width="18" height="11" rx="2"/><circle cx="9" cy="11.5" r="2.4"/><circle cx="15.5" cy="11.5" r="2.4"/><path d="M3 17v3"/></svg>',
  cpu: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="7" y="7" width="10" height="10" rx="1.5"/><path d="M10 4v3M14 4v3M10 17v3M14 17v3M4 10h3M4 14h3M17 10h3M17 14h3"/></svg>',
  mb: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="4" width="16" height="16" rx="2"/><rect x="7" y="7" width="5" height="5" rx="1"/><path d="M15 7h2M15 10h2M7 15h10"/></svg>',
  ram: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="7" width="18" height="9" rx="1.5"/><path d="M7 7v9M12 7v9M17 7v9M9 19h6"/></svg>',
  ssd: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="5" width="16" height="14" rx="2"/><circle cx="12" cy="12" r="3.4"/><circle cx="12" cy="12" r="0.6"/></svg>',
  psu: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="6" width="16" height="12" rx="2"/><circle cx="9" cy="12" r="2.6"/><path d="M15 10h3M15 13h3"/></svg>',
  case: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="3" width="12" height="18" rx="2"/><path d="M9 6h6M9 9h6"/><circle cx="12" cy="16" r="2"/></svg>',
  cool: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="2"/><path d="M12 4c2 2 2 4 0 6M12 20c-2-2-2-4 0-6M4 12c2-2 4-2 6 0M20 12c-2 2-4 2-6 0"/></svg>',
  gear: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M4 7h16M7 7v-1a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v1"/><rect x="4" y="7" width="16" height="12" rx="2"/><path d="M9 12h6"/></svg>',
  monitor: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="12" rx="2"/><path d="M9 20h6M12 16v4"/></svg>',
};

const CATEGORIES = [
  { id: 'builder',  name: 'จัดสเปกคอม',   en: 'PC BUILDER', icon: 'builder', feature: true },
  { id: 'set',      name: 'คอมเซ็ต',       en: 'PC SETS',    icon: 'set' },
  { id: 'gpu',      name: 'การ์ดจอ',       en: 'GPU',        icon: 'gpu' },
  { id: 'cpu',      name: 'ซีพียู',         en: 'CPU',        icon: 'cpu' },
  { id: 'mb',       name: 'เมนบอร์ด',      en: 'MAINBOARD',  icon: 'mb' },
  { id: 'ram',      name: 'แรม',           en: 'MEMORY',     icon: 'ram' },
  { id: 'ssd',      name: 'HDD / SSD',     en: 'STORAGE',    icon: 'ssd' },
  { id: 'psu',      name: 'Power Supply',  en: 'PSU',        icon: 'psu' },
  { id: 'case',     name: 'Case',          en: 'CASE',       icon: 'case' },
  { id: 'cool',     name: 'Cooling',       en: 'COOLING',    icon: 'cool' },
  { id: 'gear',     name: 'Gaming Gear',   en: 'GEAR',       icon: 'gear' },
  { id: 'monitor',  name: 'Monitor',       en: 'MONITOR',    icon: 'monitor' },
];

const CATMAP = Object.fromEntries(CATEGORIES.map(c => [c.id, c]));

/* products — price in THB */
const PRODUCTS = [
  { id: 'p1',  name: 'RTX 4070 SUPER Gaming OC 12GB', cat: 'gpu',     brand: 'ASUS',    price: 21900, was: 24900, badge: 'sale', spec: 'GDDR6X · 12GB · DLSS 3', glyph: 'gpu', rating: 4.9 },
  { id: 'p2',  name: 'Intel Core i7-14700K',          cat: 'cpu',     brand: 'Intel',   price: 14500, badge: 'hot',  spec: '20 Core · 28 Thread · 5.6GHz', glyph: 'cpu', rating: 4.8 },
  { id: 'p3',  name: 'AMD Ryzen 7 7800X3D',           cat: 'cpu',     brand: 'AMD',     price: 14900, badge: 'hot',  spec: '8 Core · 16 Thread · 3D V-Cache', glyph: 'cpu', rating: 5.0 },
  { id: 'p4',  name: 'DDR5 RGB RAM 32GB (16×2) 6000', cat: 'ram',     brand: 'G.SKILL', price: 4290,  badge: 'new',  spec: 'DDR5 · CL30 · RGB', glyph: 'ram', rating: 4.7 },
  { id: 'p5',  name: 'NVMe SSD 1TB Gen4',             cat: 'ssd',     brand: 'WD',      price: 2690,  badge: 'new',  spec: 'PCIe 4.0 · 7,000 MB/s', glyph: 'ssd', rating: 4.8 },
  { id: 'p6',  name: 'Gaming PC Set — Ryzen + RTX',   cat: 'set',     brand: 'CHub',    price: 45900, was: 49900, badge: 'sale', spec: 'พร้อมเล่น · ประกอบฟรี', glyph: 'set', rating: 4.9 },
  { id: 'p7',  name: '750W Gold Power Supply',        cat: 'psu',     brand: 'Corsair', price: 3290,  badge: '',     spec: '80+ Gold · Full Modular', glyph: 'psu', rating: 4.6 },
  { id: 'p8',  name: '27″ Gaming Monitor 165Hz',      cat: 'monitor', brand: 'LG',      price: 7990,  badge: 'hot',  spec: 'QHD · IPS · 1ms · 165Hz', glyph: 'monitor', rating: 4.8 },
  { id: 'p9',  name: 'B650 Gaming Mainboard',         cat: 'mb',      brand: 'MSI',     price: 6490,  badge: '',     spec: 'AM5 · DDR5 · WiFi 6', glyph: 'mb', rating: 4.7 },
  { id: 'p10', name: 'NZXT H6 Flow Mid-Tower Case',   cat: 'case',    brand: 'NZXT',    price: 3590,  badge: 'new',  spec: 'ATX · กระจก · airflow', glyph: 'case', rating: 4.8 },
  { id: 'p11', name: '360mm AIO Liquid Cooler',       cat: 'cool',    brand: 'Arctic',  price: 4290,  badge: '',     spec: 'Liquid · LCD · เงียบ', glyph: 'cool', rating: 4.6 },
  { id: 'p12', name: 'Mechanical Keyboard RGB',       cat: 'gear',    brand: 'Keychron',price: 2890,  was: 3490, badge: 'sale', spec: 'Hot-swap · Red Switch', glyph: 'gear', rating: 4.9 },
  { id: 'p13', name: 'RTX 4060 Ti 8GB Dual',          cat: 'gpu',     brand: 'Gigabyte',price: 13900, badge: '',     spec: 'GDDR6 · 8GB · DLSS 3', glyph: 'gpu', rating: 4.6 },
  { id: 'p14', name: 'Wireless Gaming Mouse',         cat: 'gear',    brand: 'Logitech',price: 2490,  badge: 'hot',  spec: '26K DPI · เบา 60g', glyph: 'gear', rating: 4.9 },
  { id: 'p15', name: 'Office PC Set — i5',            cat: 'set',     brand: 'CHub',    price: 18900, badge: '',     spec: 'ทำงาน · เรียน · พร้อมใช้', glyph: 'set', rating: 4.7 },
  { id: 'p16', name: 'DDR5 RAM 16GB 5600',            cat: 'ram',     brand: 'Kingston',price: 1990,  badge: '',     spec: 'DDR5 · CL40', glyph: 'ram', rating: 4.5 },
];

const PMAP = Object.fromEntries(PRODUCTS.map(p => [p.id, p]));

/* PC Builder slots & parts */
const BUILD_SLOTS = [
  { key: 'cpu',  label: 'ซีพียู (CPU)',        cat: 'cpu',     required: true },
  { key: 'mb',   label: 'เมนบอร์ด (Mainboard)', cat: 'mb',     required: true },
  { key: 'gpu',  label: 'การ์ดจอ (GPU)',        cat: 'gpu',     required: true },
  { key: 'ram',  label: 'แรม (Memory)',         cat: 'ram',     required: true },
  { key: 'ssd',  label: 'จัดเก็บข้อมูล (Storage)', cat: 'ssd', required: true },
  { key: 'psu',  label: 'เพาเวอร์ (PSU)',       cat: 'psu',     required: true },
  { key: 'case', label: 'เคส (Case)',           cat: 'case',    required: false },
  { key: 'cool', label: 'ระบบระบายความร้อน',     cat: 'cool',    required: false },
];

/* extra builder-only parts so each slot has choices */
const BUILD_PARTS = {
  cpu:  [PMAP.p2, PMAP.p3, { id: 'b-cpu1', name: 'Intel Core i5-14600K', cat:'cpu', brand:'Intel', price: 9900, spec:'14 Core · 5.3GHz', glyph:'cpu' }],
  mb:   [PMAP.p9, { id:'b-mb1', name:'Z790 Gaming MB', cat:'mb', brand:'ASUS', price:8900, spec:'LGA1700 · DDR5', glyph:'mb' }, { id:'b-mb2', name:'B760M MicroATX', cat:'mb', brand:'MSI', price:4290, spec:'LGA1700 · DDR5', glyph:'mb' }],
  gpu:  [PMAP.p1, PMAP.p13, { id:'b-gpu1', name:'RTX 4080 SUPER 16GB', cat:'gpu', brand:'MSI', price:38900, spec:'GDDR6X · 16GB', glyph:'gpu' }],
  ram:  [PMAP.p4, PMAP.p16, { id:'b-ram1', name:'DDR5 64GB (32×2) 6000', cat:'ram', brand:'Corsair', price:8290, spec:'DDR5 · CL30', glyph:'ram' }],
  ssd:  [PMAP.p5, { id:'b-ssd1', name:'NVMe SSD 2TB Gen4', cat:'ssd', brand:'Samsung', price:5290, spec:'PCIe4 · 7,450MB/s', glyph:'ssd' }, { id:'b-ssd2', name:'SSD 500GB SATA', cat:'ssd', brand:'WD', price:1290, spec:'SATA · 560MB/s', glyph:'ssd' }],
  psu:  [PMAP.p7, { id:'b-psu1', name:'850W Gold Modular', cat:'psu', brand:'Corsair', price:4490, spec:'80+ Gold', glyph:'psu' }, { id:'b-psu2', name:'650W Bronze', cat:'psu', brand:'Antec', price:1990, spec:'80+ Bronze', glyph:'psu' }],
  case: [PMAP.p10, { id:'b-case1', name:'Lian Li O11 Mini', cat:'case', brand:'Lian Li', price:4990, spec:'กระจก 3 ด้าน', glyph:'case' }],
  cool: [PMAP.p11, { id:'b-cool1', name:'Air Cooler Dual Tower', cat:'cool', brand:'Noctua', price:3590, spec:'Air · เงียบมาก', glyph:'cool' }],
};

const BUDGETS = [
  { id: 'b1', label: 'ต่ำกว่า 20,000', sub: 'เริ่มต้น · ทำงาน/เรียน', max: 20000 },
  { id: 'b2', label: '20,000 – 40,000', sub: 'เกมมิ่งคุ้มค่า', max: 40000 },
  { id: 'b3', label: '40,000 – 70,000', sub: 'เล่นเกมลื่นทุกเกม', max: 70000 },
  { id: 'b4', label: 'มากกว่า 70,000', sub: 'สเปกท็อป · ครีเอเตอร์', max: 999999 },
];

const baht = n => '฿' + n.toLocaleString('th-TH');
