"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { Menu, Search, ShoppingCart, User, X } from "lucide-react";
import { baht, type Category, type Product } from "@/lib/data";
import { CategoryIcon } from "@/components/icons";

type CartLine = Product & { quantity: number };
type CartContextValue = {
  lines: CartLine[];
  total: number;
  count: number;
  addItem: (product: Product, quantity?: number) => void;
  setQuantity: (id: string, quantity: number) => void;
  openCart: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used inside SiteChrome");
  return context;
}

const nav = [
  { href: "/", label: "หน้าแรก" },
  { href: "/products", label: "สินค้า" },
  { href: "/builder", label: "จัดสเปกคอม" },
  { href: "/#promo", label: "โปรโมชั่น" },
  { href: "/#contact", label: "ติดต่อเรา" },
];

export function SiteChrome({ children, categories }: { children: ReactNode; categories: Category[] }) {
  const pathname = usePathname();
  const router = useRouter();
  const [cart, setCart] = useState<Record<string, number>>({});
  const [cartProducts, setCartProducts] = useState<Record<string, Product>>({});
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [query, setQuery] = useState("");

  // Rehydrate the cart (quantities + product details) from localStorage on mount.
  useEffect(() => {
    try {
      setCart(JSON.parse(localStorage.getItem("chub_cart_v2") || "{}"));
      setCartProducts(JSON.parse(localStorage.getItem("chub_cart_products_v1") || "{}"));
    } catch {
      setCart({});
      setCartProducts({});
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("chub_cart_v2", JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem("chub_cart_products_v1", JSON.stringify(cartProducts));
  }, [cartProducts]);

  const lines = useMemo(
    () =>
      Object.entries(cart)
        .map(([id, quantity]) => (cartProducts[id] ? { ...cartProducts[id], quantity } : null))
        .filter(Boolean) as CartLine[],
    [cart, cartProducts],
  );
  const count = lines.reduce((sum, item) => sum + item.quantity, 0);
  const total = lines.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const value: CartContextValue = {
    lines,
    total,
    count,
    addItem(product, quantity = 1) {
      setCartProducts((current) => ({ ...current, [product.id]: product }));
      setCart((current) => ({ ...current, [product.id]: (current[product.id] || 0) + quantity }));
      setDrawerOpen(true);
    },
    setQuantity(id, quantity) {
      setCart((current) => {
        const next = { ...current };
        if (quantity <= 0) delete next[id];
        else next[id] = quantity;
        return next;
      });
    },
    openCart() {
      setDrawerOpen(true);
    },
  };

  const doSearch = () => {
    const q = query.trim();
    router.push(q ? `/products?q=${encodeURIComponent(q)}` : "/products");
    setMenuOpen(false);
  };

  return (
    <CartContext.Provider value={value}>
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/75 backdrop-blur-xl">
        <div className="wrap grid h-[72px] grid-cols-[auto_1fr_auto] items-center gap-5 max-md:h-16 max-md:grid-cols-[auto_auto]">
          <Brand />
          <div className="relative max-md:hidden">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              onKeyDown={(event) => event.key === "Enter" && doSearch()}
              className="h-12 w-full rounded-full border border-slate-300 bg-white pl-12 pr-4 text-sm outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
              placeholder="ค้นหา การ์ดจอ, CPU, RAM, SSD, Monitor..."
            />
          </div>
          <div className="flex items-center justify-end gap-2">
            <nav className="hidden items-center gap-1 lg:flex">
              {nav.slice(0, 3).map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                    pathname === item.href ? "bg-blue-50 text-blue-700" : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
            <button className="hidden h-10 rounded-full bg-slate-950 px-4 text-sm font-medium text-white md:inline-flex md:items-center md:gap-2">
              <User className="h-4 w-4" />
              เข้าสู่ระบบ
            </button>
            <button
              onClick={() => setDrawerOpen(true)}
              className="relative grid h-11 w-11 place-items-center rounded-xl border border-slate-200 bg-white transition hover:border-slate-950"
              aria-label="ตะกร้าสินค้า"
            >
              <ShoppingCart className="h-5 w-5" />
              {count > 0 ? (
                <span className="mono absolute -right-1.5 -top-1.5 grid h-5 min-w-5 place-items-center rounded-full border-2 border-white bg-blue-600 px-1 text-[11px] font-semibold text-white">
                  {count}
                </span>
              ) : null}
            </button>
            <button
              onClick={() => setMenuOpen(true)}
              className="grid h-11 w-11 place-items-center rounded-xl border border-slate-200 bg-white lg:hidden"
              aria-label="เมนู"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      {children}

      <footer className="bg-slate-950 text-slate-300">
        <div className="wrap py-14">
          <div className="grid gap-10 md:grid-cols-[1.5fr_1fr_1fr_1.2fr]">
            <div>
              <Brand dark />
              <p className="mt-5 max-w-sm text-sm leading-7 text-slate-400">
                ร้านคอมพิวเตอร์และอุปกรณ์ไอทีออนไลน์ จัดสเปกตามงบ ประกอบฟรี รับประกันของแท้ทุกชิ้น
              </p>
            </div>
            <FooterList title="เมนู" items={nav.map((item) => item.label)} />
            <FooterList title="หมวดหมู่" items={categories.slice(0, 6).map((item) => item.name)} />
            <FooterList title="ติดต่อเรา" items={["02-XXX-XXXX", "Line: @computerhub", "support@computerhub.co.th", "กรุงเทพมหานคร"]} />
          </div>
          <div className="mono mt-10 border-t border-white/10 pt-6 text-xs text-slate-500">© 2026 COMPUTER HUB</div>
        </div>
      </footer>

      {(drawerOpen || menuOpen) && <button className="fixed inset-0 z-[70] bg-slate-950/40 backdrop-blur-sm" onClick={() => { setDrawerOpen(false); setMenuOpen(false); }} aria-label="ปิด" />}
      <CartDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} query={query} setQuery={setQuery} doSearch={doSearch} />
    </CartContext.Provider>
  );
}

function Brand({ dark = false }: { dark?: boolean }) {
  return (
    <Link href="/" className={`inline-flex items-center gap-3 text-lg font-semibold ${dark ? "text-white" : "text-slate-950"}`}>
      <span className={`grid h-9 w-9 place-items-center rounded-[10px] ${dark ? "bg-white text-slate-950" : "bg-slate-950 text-white"}`}>
        <span className="mono">C</span>
      </span>
      <span>COMPUTER</span>
      <em className="not-italic text-blue-600">HUB</em>
    </Link>
  );
}

function FooterList({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <h4 className="mb-4 text-sm font-semibold text-white">{title}</h4>
      <ul className="space-y-2 text-sm text-slate-400">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

function CartDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { lines, total, setQuantity } = useCart();
  return (
    <aside className={`fixed right-0 top-0 z-[80] flex h-full w-[420px] max-w-[92vw] flex-col bg-white shadow-2xl transition-transform ${open ? "translate-x-0" : "translate-x-full"}`}>
      <div className="flex items-center justify-between border-b border-slate-200 p-6">
        <h3 className="text-lg font-semibold">ตะกร้าสินค้า</h3>
        <button onClick={onClose} className="grid h-10 w-10 place-items-center rounded-xl border border-slate-200">
          <X className="h-5 w-5" />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-6">
        {!lines.length ? (
          <div className="grid h-full place-items-center text-center text-slate-500">
            <div>
              <ShoppingCart className="mx-auto mb-3 h-12 w-12 text-slate-300" />
              ตะกร้าของคุณยังว่างอยู่
            </div>
          </div>
        ) : (
          <div className="space-y-5">
            {lines.map((item) => (
              <div key={item.id} className="grid grid-cols-[64px_1fr_auto] gap-4 border-b border-slate-100 pb-5">
                <div className="grid h-16 w-16 place-items-center rounded-xl bg-slate-100">
                  <CategoryIcon name={item.glyph} className="h-7 w-7 text-slate-400" />
                </div>
                <div>
                  <div className="text-sm font-medium leading-snug">{item.name}</div>
                  <div className="mono mt-1 text-xs text-slate-500">{baht(item.price)}</div>
                  <div className="mt-3 inline-flex rounded-lg border border-slate-200">
                    <button className="h-8 w-8" onClick={() => setQuantity(item.id, item.quantity - 1)}>−</button>
                    <span className="mono grid h-8 w-8 place-items-center text-sm">{item.quantity}</span>
                    <button className="h-8 w-8" onClick={() => setQuantity(item.id, item.quantity + 1)}>+</button>
                  </div>
                </div>
                <div className="mono text-right text-sm font-semibold">{baht(item.price * item.quantity)}</div>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="border-t border-slate-200 p-6">
        <div className="mb-4 flex items-baseline justify-between">
          <span className="text-sm text-slate-500">ยอดรวม</span>
          <span className="mono text-2xl font-semibold">{baht(total)}</span>
        </div>
        <button className="h-12 w-full rounded-full bg-blue-600 font-medium text-white shadow-lg shadow-blue-600/20">ดำเนินการสั่งซื้อ</button>
      </div>
    </aside>
  );
}

function MobileMenu({
  open,
  onClose,
  query,
  setQuery,
  doSearch,
}: {
  open: boolean;
  onClose: () => void;
  query: string;
  setQuery: (value: string) => void;
  doSearch: () => void;
}) {
  return (
    <aside className={`fixed right-0 top-0 z-[80] h-full w-[320px] max-w-[88vw] bg-white p-5 shadow-2xl transition-transform ${open ? "translate-x-0" : "translate-x-full"}`}>
      <div className="mb-4 flex items-center justify-between">
        <Brand />
        <button onClick={onClose} className="grid h-10 w-10 place-items-center rounded-xl border border-slate-200">
          <X className="h-5 w-5" />
        </button>
      </div>
      <div className="relative mb-4">
        <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          onKeyDown={(event) => event.key === "Enter" && doSearch()}
          className="h-12 w-full rounded-full border border-slate-300 pl-12 pr-4 outline-none focus:border-blue-600"
          placeholder="ค้นหาสินค้า..."
        />
      </div>
      <nav className="flex flex-col gap-1">
        {nav.map((item) => (
          <Link key={item.href} href={item.href} onClick={onClose} className="rounded-xl px-4 py-3 font-medium text-slate-700 hover:bg-slate-100">
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
