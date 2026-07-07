"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import { ChevronDown, ClipboardList, LogOut, Menu, Search, Settings, ShoppingCart, Star, User, X } from "lucide-react";
import { baht, type Category, type Product } from "@/lib/data";
import { CategoryIcon } from "@/components/icons";
import { AuthForm } from "@/components/auth-form";
import { BarcodeScanner } from "@/components/barcode-scanner";
import {
  AuthContext,
  CartContext,
  type AuthContextValue,
  type AuthUser,
  type CartContextValue,
  type CartLine,
  useAuth,
  useCart,
} from "@/components/app-context";
type FooterItem = { label: string; href?: string; external?: boolean };

const T = {
  home: "\u0e2b\u0e19\u0e49\u0e32\u0e41\u0e23\u0e01",
  products: "\u0e2a\u0e34\u0e19\u0e04\u0e49\u0e32",
  builder: "\u0e08\u0e31\u0e14\u0e2a\u0e40\u0e1b\u0e01\u0e04\u0e2d\u0e21",
  contact: "\u0e15\u0e34\u0e14\u0e15\u0e48\u0e2d\u0e40\u0e23\u0e32",
  search: "\u0e04\u0e49\u0e19\u0e2b\u0e32 \u0e01\u0e32\u0e23\u0e4c\u0e14\u0e08\u0e2d, CPU, RAM, SSD, Monitor...",
  closeAccount: "\u0e1b\u0e34\u0e14\u0e40\u0e21\u0e19\u0e39\u0e1a\u0e31\u0e0d\u0e0a\u0e35",
  login: "\u0e40\u0e02\u0e49\u0e32\u0e2a\u0e39\u0e48\u0e23\u0e30\u0e1a\u0e1a",
  cartLabel: "\u0e15\u0e30\u0e01\u0e23\u0e49\u0e32\u0e2a\u0e34\u0e19\u0e04\u0e49\u0e32",
  menu: "\u0e40\u0e21\u0e19\u0e39",
  footerDesc: "\u0e23\u0e49\u0e32\u0e19\u0e04\u0e2d\u0e21\u0e1e\u0e34\u0e27\u0e40\u0e15\u0e2d\u0e23\u0e4c\u0e41\u0e25\u0e30\u0e2d\u0e38\u0e1b\u0e01\u0e23\u0e13\u0e4c\u0e44\u0e2d\u0e17\u0e35\u0e2d\u0e2d\u0e19\u0e44\u0e25\u0e19\u0e4c \u0e08\u0e31\u0e14\u0e2a\u0e40\u0e1b\u0e01\u0e15\u0e32\u0e21\u0e07\u0e1a \u0e1b\u0e23\u0e30\u0e01\u0e2d\u0e1a\u0e1f\u0e23\u0e35 \u0e23\u0e31\u0e1a\u0e1b\u0e23\u0e30\u0e01\u0e31\u0e19\u0e02\u0e2d\u0e07\u0e41\u0e17\u0e49\u0e17\u0e38\u0e01\u0e0a\u0e34\u0e49\u0e19",
  categories: "\u0e2b\u0e21\u0e27\u0e14\u0e2b\u0e21\u0e39\u0e48",
  chiangMai: "\u0e40\u0e0a\u0e35\u0e22\u0e07\u0e43\u0e2b\u0e21\u0e48",
  close: "\u0e1b\u0e34\u0e14",
  settingsSub: "\u0e15\u0e31\u0e49\u0e07\u0e04\u0e48\u0e32\u0e1a\u0e31\u0e0d\u0e0a\u0e35\u0e41\u0e25\u0e30\u0e42\u0e1b\u0e23\u0e44\u0e1f\u0e25\u0e4c",
  adminSub: "\u0e08\u0e31\u0e14\u0e01\u0e32\u0e23\u0e2a\u0e34\u0e19\u0e04\u0e49\u0e32\u0e41\u0e19\u0e30\u0e19\u0e33",
  ordersSub: "\u0e14\u0e39\u0e15\u0e30\u0e01\u0e23\u0e49\u0e32\u0e41\u0e25\u0e30\u0e23\u0e32\u0e22\u0e01\u0e32\u0e23\u0e2a\u0e31\u0e48\u0e07\u0e0b\u0e37\u0e49\u0e2d",
  selectFirst: "\u0e01\u0e23\u0e38\u0e13\u0e32\u0e40\u0e25\u0e37\u0e2d\u0e01\u0e2a\u0e34\u0e19\u0e04\u0e49\u0e32\u0e01\u0e48\u0e2d\u0e19\u0e14\u0e33\u0e40\u0e19\u0e34\u0e19\u0e01\u0e32\u0e23\u0e2a\u0e31\u0e48\u0e07\u0e0b\u0e37\u0e49\u0e2d",
  loginFirst: "\u0e01\u0e23\u0e38\u0e13\u0e32\u0e40\u0e02\u0e49\u0e32\u0e2a\u0e39\u0e48\u0e23\u0e30\u0e1a\u0e1a\u0e01\u0e48\u0e2d\u0e19\u0e14\u0e33\u0e40\u0e19\u0e34\u0e19\u0e01\u0e32\u0e23\u0e2a\u0e31\u0e48\u0e07\u0e0b\u0e37\u0e49\u0e2d",
  orderFail: "\u0e1a\u0e31\u0e19\u0e17\u0e36\u0e01\u0e04\u0e33\u0e2a\u0e31\u0e48\u0e07\u0e0b\u0e37\u0e49\u0e2d\u0e44\u0e21\u0e48\u0e2a\u0e33\u0e40\u0e23\u0e47\u0e08",
  orderOk: "\u0e1a\u0e31\u0e19\u0e17\u0e36\u0e01\u0e04\u0e33\u0e2a\u0e31\u0e48\u0e07\u0e0b\u0e37\u0e49\u0e2d\u0e41\u0e25\u0e49\u0e27 \u0e40\u0e25\u0e02\u0e17\u0e35\u0e48",
  orderConn: "\u0e40\u0e0a\u0e37\u0e48\u0e2d\u0e21\u0e15\u0e48\u0e2d\u0e23\u0e30\u0e1a\u0e1a\u0e04\u0e33\u0e2a\u0e31\u0e48\u0e07\u0e0b\u0e37\u0e49\u0e2d\u0e44\u0e21\u0e48\u0e2a\u0e33\u0e40\u0e23\u0e47\u0e08",
  cartEmpty: "\u0e15\u0e30\u0e01\u0e23\u0e49\u0e32\u0e02\u0e2d\u0e07\u0e04\u0e38\u0e13\u0e22\u0e31\u0e07\u0e27\u0e48\u0e32\u0e07\u0e2d\u0e22\u0e39\u0e48",
  total: "\u0e22\u0e2d\u0e14\u0e23\u0e27\u0e21",
  savingOrder: "\u0e01\u0e33\u0e25\u0e31\u0e07\u0e1a\u0e31\u0e19\u0e17\u0e36\u0e01\u0e04\u0e33\u0e2a\u0e31\u0e48\u0e07\u0e0b\u0e37\u0e49\u0e2d...",
  checkout: "\u0e14\u0e33\u0e40\u0e19\u0e34\u0e19\u0e01\u0e32\u0e23\u0e2a\u0e31\u0e48\u0e07\u0e0b\u0e37\u0e49\u0e2d",
  loginToCheckout: "\u0e40\u0e02\u0e49\u0e32\u0e2a\u0e39\u0e48\u0e23\u0e30\u0e1a\u0e1a\u0e40\u0e1e\u0e37\u0e48\u0e2d\u0e2a\u0e31\u0e48\u0e07\u0e0b\u0e37\u0e49\u0e2d",
  searchProducts: "\u0e04\u0e49\u0e19\u0e2b\u0e32\u0e2a\u0e34\u0e19\u0e04\u0e49\u0e32...",
  register: "\u0e2a\u0e21\u0e31\u0e04\u0e23\u0e2a\u0e21\u0e32\u0e0a\u0e34\u0e01",
} as const;

const nav = [
  { href: "/", label: T.home },
  { href: "/products", label: T.products },
  { href: "/builder", label: T.builder },
  { href: "/#contact", label: T.contact },
];

export function SiteChrome({ children, categories }: { children: ReactNode; categories: Category[] }) {
  const pathname = usePathname();
  const router = useRouter();
  const [cart, setCart] = useState<Record<string, number>>({});
  const [cartProducts, setCartProducts] = useState<Record<string, Product>>({});
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [query, setQuery] = useState("");
  const [user, setUser] = useState<AuthUser | null>(null);

  const [authLoading, setAuthLoading] = useState(true);
  const [cartReady, setCartReady] = useState(false);

  const lines = useMemo(
    () =>
      Object.entries(cart)
        .map(([id, quantity]) => (cartProducts[id] ? { ...cartProducts[id], quantity } : null))
        .filter(Boolean) as CartLine[],
    [cart, cartProducts],
  );
  const count = lines.reduce((sum, item) => sum + item.quantity, 0);
  const total = lines.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const setCartFromLines = (items: CartLine[]) => {
    const nextCart: Record<string, number> = {};
    const nextProducts: Record<string, Product> = {};
    for (const item of items) {
      nextCart[item.id] = item.quantity;
      const { quantity: _quantity, ...product } = item;
      nextProducts[item.id] = product;
    }
    setCart(nextCart);
    setCartProducts(nextProducts);
  };

  const loadCart = async () => {
    try {
      const response = await fetch("/api/cart", { cache: "no-store" });
      if (!response.ok) {
        setCart({});
        setCartProducts({});
        setCartReady(true);
        return;
      }
      const payload = (await response.json()) as { items?: CartLine[] };
      setCartFromLines(Array.isArray(payload.items) ? payload.items : []);
    } catch {
      setCart({});
      setCartProducts({});
    } finally {
      setCartReady(true);
    }
  };

  const saveCart = async (nextLines: CartLine[]) => {
    if (!user || !cartReady) return;
    await fetch("/api/cart", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items: nextLines }),
    }).catch(() => undefined);
  };

  useEffect(() => {
    let active = true;
    async function loadSession() {
      try {
        const response = await fetch("/api/auth/session", { cache: "no-store" });
        const payload = (await response.json().catch(() => null)) as { user?: AuthUser | null } | null;
        if (!active) return;
        const nextUser = payload?.user ?? null;
        setUser(nextUser);
        if (nextUser) await loadCart();
        else {
          setCart({});
          setCartProducts({});
          setCartReady(true);
        }
      } catch {
        if (!active) return;
        setUser(null);
        setCart({});
        setCartProducts({});
        setCartReady(true);
      } finally {
        if (active) setAuthLoading(false);
      }
    }
    void loadSession();
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!user || !cartReady) return;
    void saveCart(lines);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lines, user?.id, cartReady]);

  const clearCart = () => {
    setCart({});
    setCartProducts({});
    if (user) void fetch("/api/cart", { method: "DELETE" }).catch(() => undefined);
  };

  const value: CartContextValue = {
    lines,
    total,
    count,
    addItem(product, quantity = 1) {
      if (!user) {
        openAuth("login");
        return;
      }
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
    clearCart,
  };

  const authValue: AuthContextValue = {
    user,
    loading: authLoading,
    async login(identifier, password) {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier, password }),
      });
      const payload = (await response.json().catch(() => null)) as { user?: AuthUser; error?: string } | null;
      if (!response.ok || !payload?.user) return { ok: false, error: payload?.error };
      setUser(payload.user);
      setCartReady(false);
      await loadCart();
      return { ok: true };
    },
    async register(name, identifier, password) {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, identifier, password }),
      });
      const payload = (await response.json().catch(() => null)) as { user?: AuthUser; error?: string } | null;
      if (!response.ok || !payload?.user) return { ok: false, error: payload?.error };
      setUser(payload.user);
      setCartReady(false);
      await loadCart();
      return { ok: true };
    },
    async updateProfile(profile) {
      const response = await fetch("/api/auth/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
      });
      const payload = (await response.json().catch(() => null)) as { user?: AuthUser; error?: string } | null;
      if (!response.ok || !payload?.user) return { ok: false, error: payload?.error };
      setUser(payload.user);
      return { ok: true };
    },
    async logout() {
      await fetch("/api/auth/session", { method: "DELETE" }).catch(() => undefined);
      clearCart();
      setUser(null);
      setAccountOpen(false);
      setDrawerOpen(false);
    },
  };

  const doSearch = () => {
    const q = query.trim();
    router.push(q ? `/products?q=${encodeURIComponent(q)}` : "/products");
    setMenuOpen(false);
  };

  const openAuth = (mode: "login" | "register") => {
    setAuthMode(mode);
    setAuthOpen(true);
    setMenuOpen(false);
  };

  return (
    <CartContext.Provider value={value}>
      <AuthContext.Provider value={authValue}>
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
              placeholder={T.search}
            />
          </div>
          <div className="flex items-center justify-end gap-2">
            <BarcodeScanner />
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
            {user ? (
              <div className="relative hidden md:block">
                <button
                  onClick={() => setAccountOpen((current) => !current)}
                  className="inline-flex h-10 items-center gap-2 rounded-full bg-slate-950 px-4 text-sm font-medium text-white shadow-sm transition hover:bg-slate-800"
                  aria-expanded={accountOpen}
                  aria-haspopup="menu"
                >
                  <User className="h-4 w-4" />
                  {user.name}
                  <ChevronDown className={`h-4 w-4 transition ${accountOpen ? "rotate-180" : ""}`} />
                </button>
                {accountOpen ? (
                  <>
                    <button className="fixed inset-0 z-[60] cursor-default" onClick={() => setAccountOpen(false)} aria-label={T.closeAccount} />
                    <AccountDropdown user={user} onClose={() => setAccountOpen(false)} onCart={() => { setDrawerOpen(true); setAccountOpen(false); }} onLogout={authValue.logout} />
                  </>
                ) : null}
              </div>
            ) : (
              <button
                onClick={() => openAuth("login")}
                className="hidden h-10 rounded-full bg-slate-950 px-4 text-sm font-medium text-white md:inline-flex md:items-center md:gap-2"
              >
                <User className="h-4 w-4" />
                {T.login}
              </button>
            )}
            <button
              onClick={() => setDrawerOpen(true)}
              className="relative grid h-11 w-11 place-items-center rounded-xl border border-slate-200 bg-white transition hover:border-slate-950"
              aria-label={T.cartLabel}
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
              aria-label={T.menu}
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      {children}

      <footer id="contact" className="bg-slate-950 text-slate-300">
        <div className="wrap py-14">
          <div className="grid gap-10 md:grid-cols-[1.5fr_1fr_1fr_1.2fr]">
            <div>
              <Brand dark />
              <p className="mt-5 max-w-sm text-sm leading-7 text-slate-400">
                {T.footerDesc}
              </p>
            </div>
            <FooterList title={T.menu} items={nav} />
            <FooterList
              title={T.categories}
              items={categories.slice(0, 6).map((item) => ({ label: item.name, href: `/products?cat=${encodeURIComponent(item.id)}` }))}
            />
            <FooterList
              title={T.contact}
              items={[
                { label: "Facebook: NYIT Computor", href: "https://www.facebook.com/nycmservice/", external: true },
                { label: "081-961-3869" },
                { label: "support@nyitcomputer.co.th", href: "mailto:support@nyitcomputer.co.th" },
                { label: T.chiangMai },
              ]}
            />
          </div>
          <div className="mono mt-10 border-t border-white/10 pt-6 text-xs text-slate-500">? 2026 NYIT Computer</div>
        </div>
      </footer>

      {(drawerOpen || menuOpen) && <button className="fixed inset-0 z-[70] bg-slate-950/40 backdrop-blur-sm" onClick={() => { setDrawerOpen(false); setMenuOpen(false); }} aria-label={T.close} />}
      <CartDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} onRequireLogin={() => openAuth("login")} />
      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} query={query} setQuery={setQuery} doSearch={doSearch} openAuth={openAuth} />
      <AuthModal open={authOpen} mode={authMode} setMode={setAuthMode} onClose={() => setAuthOpen(false)} />
      </AuthContext.Provider>
    </CartContext.Provider>
  );
}

function Brand({ dark = false }: { dark?: boolean }) {
  return (
    <Link href="/" className={`inline-flex items-center gap-3 text-lg font-semibold ${dark ? "text-white" : "text-slate-950"}`}>
      <span className={`grid h-9 w-9 place-items-center rounded-[10px] ${dark ? "bg-white text-slate-950" : "bg-slate-950 text-white"}`}>
        <span className="mono">N</span>
      </span>
      <span>NYIT</span>
      <em className="not-italic text-blue-600">Computer</em>
    </Link>
  );
}

function AccountDropdown({ user, onClose, onCart, onLogout }: { user: AuthUser; onClose: () => void; onCart: () => void; onLogout: () => void | Promise<void> }) {
  const admin = user.role === "admin";

  return (
    <div className="absolute right-0 top-12 z-[80] w-72 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-slate-200/80" role="menu">
      <div className="border-b border-slate-100 p-4">
        <div className="text-sm font-semibold text-slate-950">{user.name}</div>
        <div className="mt-1 truncate text-xs text-slate-500">{user.email}</div>
      </div>
      <div className="p-2">
        <Link href="/settings" onClick={onClose} className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm text-slate-700 transition hover:bg-slate-50" role="menuitem">
          <Settings className="h-4 w-4 text-slate-500" />
          <span>
            <span className="block font-medium text-slate-950">Settings</span>
            <span className="text-xs text-slate-500">{T.settingsSub}</span>
          </span>
        </Link>
        {admin ? (
          <Link href="/admin" onClick={onClose} className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm text-slate-700 transition hover:bg-amber-50" role="menuitem">
            <Star className="h-4 w-4 text-amber-500" />
            <span>
              <span className="block font-medium text-slate-950">Admin Dashboard</span>
              <span className="text-xs text-slate-500">{T.adminSub}</span>
            </span>
          </Link>
        ) : null}
        <button onClick={onCart} className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm text-slate-700 transition hover:bg-slate-50" role="menuitem">
          <ClipboardList className="h-4 w-4 text-slate-500" />
          <span>
            <span className="block font-medium text-slate-950">Orders / Cart</span>
            <span className="text-xs text-slate-500">{T.ordersSub}</span>
          </span>
        </button>
      </div>
      <div className="border-t border-slate-100 p-2">
        <button onClick={onLogout} className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-medium text-red-600 transition hover:bg-red-50" role="menuitem">
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </div>
    </div>
  );
}

function FooterList({ title, items }: { title: string; items: FooterItem[] }) {
  return (
    <div>
      <h4 className="mb-4 text-sm font-semibold text-white">{title}</h4>
      <ul className="space-y-2 text-sm text-slate-400">
        {items.map((item) => {
          const isExternal = item.external || /^(https?:|mailto:|tel:)/.test(item.href ?? "");

          return (
            <li key={`${item.label}-${item.href ?? ""}`}>
              {item.href ? (
                isExternal ? (
                  <a href={item.href} target={item.external ? "_blank" : undefined} rel={item.external ? "noreferrer" : undefined} className="transition hover:text-white">
                    {item.label}
                  </a>
                ) : (
                  <Link href={item.href} className="transition hover:text-white">
                    {item.label}
                  </Link>
                )
              ) : (
                item.label
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function CartDrawer({ open, onClose, onRequireLogin }: { open: boolean; onClose: () => void; onRequireLogin: () => void }) {
  const { lines, total, setQuantity, clearCart } = useCart();
  const { user } = useAuth();
  const [notice, setNotice] = useState("");
  const [checkingOut, setCheckingOut] = useState(false);

  const checkout = async () => {
    if (!lines.length) {
      setNotice(T.selectFirst);
      return;
    }
    if (!user) {
      setNotice(T.loginFirst);
      onRequireLogin();
      return;
    }
    setCheckingOut(true);
    setNotice("");

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer: user,
          items: lines.map((item) => ({
            id: item.id,
            name: item.name,
            brand: item.brand,
            price: item.price,
            quantity: item.quantity,
            image: item.image,
            category: item.catName ?? item.cat,
          })),
        }),
      });
      const payload = (await response.json().catch(() => null)) as { orderCode?: string; error?: string } | null;

      if (!response.ok) {
        setNotice(payload?.error ?? T.orderFail);
        return;
      }

      clearCart();
      setNotice(`${T.orderOk} ${payload?.orderCode ?? "-"}`);
    } catch {
      setNotice(T.orderConn);
    } finally {
      setCheckingOut(false);
    }
  };

  return (
    <aside className={`fixed right-0 top-0 z-[80] flex h-full w-[420px] max-w-[92vw] flex-col bg-white shadow-2xl transition-transform ${open ? "translate-x-0" : "translate-x-full"}`}>
      <div className="flex items-center justify-between border-b border-slate-200 p-6">
        <h3 className="text-lg font-semibold">{T.cartLabel}</h3>
        <button onClick={onClose} className="grid h-10 w-10 place-items-center rounded-xl border border-slate-200">
          <X className="h-5 w-5" />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-6">
        {!lines.length ? (
          <div className="grid h-full place-items-center text-center text-slate-500">
            <div>
              <ShoppingCart className="mx-auto mb-3 h-12 w-12 text-slate-300" />
              {T.cartEmpty}
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
                    <button className="h-8 w-8" onClick={() => setQuantity(item.id, item.quantity - 1)}>?</button>
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
          <span className="text-sm text-slate-500">{T.total}</span>
          <span className="mono text-2xl font-semibold">{baht(total)}</span>
        </div>
        {notice ? <p className="mb-3 rounded-xl bg-blue-50 px-4 py-3 text-sm text-blue-700">{notice}</p> : null}
        <button onClick={checkout} disabled={checkingOut} className="h-12 w-full rounded-full bg-blue-600 font-medium text-white shadow-lg shadow-blue-600/20 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none">
          {checkingOut ? T.savingOrder : user ? T.checkout : T.loginToCheckout}
        </button>
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
  openAuth,
}: {
  open: boolean;
  onClose: () => void;
  query: string;
  setQuery: (value: string) => void;
  doSearch: () => void;
  openAuth: (mode: "login" | "register") => void;
}) {
  const { user, logout } = useAuth();
  const { openCart } = useCart();

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
          placeholder={T.searchProducts}
        />
      </div>
      <nav className="flex flex-col gap-1">
        {nav.map((item) => (
          <Link key={item.href} href={item.href} onClick={onClose} className="rounded-xl px-4 py-3 font-medium text-slate-700 hover:bg-slate-100">
            {item.label}
          </Link>
        ))}
      </nav>
      <div className="mt-5 border-t border-slate-200 pt-5">
        {user ? (
          <div className="grid gap-2">
            <div className="rounded-xl bg-slate-50 px-4 py-3">
              <div className="text-sm font-semibold text-slate-950">{user.name}</div>
              <div className="truncate text-xs text-slate-500">{user.email}</div>
            </div>
            <Link href="/settings" onClick={onClose} className="flex w-full items-center gap-3 rounded-xl border border-slate-200 px-4 py-3 font-medium text-slate-700">
              <Settings className="h-4 w-4" />
              Settings
            </Link>
            <button
              onClick={() => {
                openCart();
                onClose();
              }}
              className="flex w-full items-center gap-3 rounded-xl border border-slate-200 px-4 py-3 font-medium text-slate-700"
            >
              <ClipboardList className="h-4 w-4" />
              Orders / Cart
            </button>
            <button
              onClick={() => {
                logout();
                onClose();
              }}
              className="flex w-full items-center gap-3 rounded-xl bg-slate-950 px-4 py-3 font-medium text-white"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
        ) : (
          <div className="grid gap-2">
            <button onClick={() => openAuth("login")} className="rounded-xl bg-slate-950 px-4 py-3 text-center font-medium text-white">
              {T.login}
            </button>
            <button onClick={() => openAuth("register")} className="rounded-xl border border-slate-300 px-4 py-3 text-center font-medium text-slate-700">
              {T.register}
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}

function AuthModal({
  open,
  mode,
  setMode,
  onClose,
}: {
  open: boolean;
  mode: "login" | "register";
  setMode: (mode: "login" | "register") => void;
  onClose: () => void;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[90] grid place-items-center bg-slate-950/55 p-4 backdrop-blur-sm" role="dialog" aria-modal="true">
      <div className="relative w-full max-w-[440px]">
        <button
          onClick={onClose}
          className="absolute -right-2 -top-2 z-10 grid h-10 w-10 place-items-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-lg"
          aria-label={T.close}
        >
          <X className="h-5 w-5" />
        </button>
        <AuthForm mode={mode} onModeChange={setMode} onSuccess={onClose} />
      </div>
    </div>
  );
}
