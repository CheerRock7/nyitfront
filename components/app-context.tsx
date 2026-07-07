"use client";

import { createContext, useContext } from "react";
import type { Product } from "@/lib/data";

export type CartLine = Product & { quantity: number };
export type AuthUser = {
  id?: string;
  name: string;
  email: string;
  username?: string;
  phone?: string;
  address?: string;
  role?: "customer" | "admin";
};
export type AuthProfileInput = AuthUser & { password?: string };

export type CartContextValue = {
  lines: CartLine[];
  total: number;
  count: number;
  addItem: (product: Product, quantity?: number) => void;
  setQuantity: (id: string, quantity: number) => void;
  openCart: () => void;
  clearCart: () => void;
};

export type AuthContextValue = {
  user: AuthUser | null;
  loading: boolean;
  login: (identifier: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  register: (name: string, identifier: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  updateProfile: (profile: AuthProfileInput) => Promise<{ ok: boolean; error?: string }>;
  logout: () => Promise<void>;
};

export const CartContext = createContext<CartContextValue | null>(null);
export const AuthContext = createContext<AuthContextValue | null>(null);

const fallbackCartContext: CartContextValue = {
  lines: [],
  total: 0,
  count: 0,
  addItem: () => {},
  setQuantity: () => {},
  openCart: () => {},
  clearCart: () => {},
};

const fallbackAuthContext: AuthContextValue = {
  user: null,
  loading: false,
  login: async () => ({ ok: false }),
  register: async () => ({ ok: false }),
  updateProfile: async () => ({ ok: false, error: "ยังไม่พร้อมใช้งาน" }),
  logout: async () => {},
};

export function useCart() {
  const context = useContext(CartContext);
  return context ?? fallbackCartContext;
}

export function useAuth() {
  const context = useContext(AuthContext);
  return context ?? fallbackAuthContext;
}
