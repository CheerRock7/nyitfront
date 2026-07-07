"use client";

import { createContext, useContext } from "react";
import type { Product } from "@/lib/data";

export type CartLine = Product & { quantity: number };
export type AuthUser = { name: string; email: string; username?: string; phone?: string; address?: string };
export type StoredAccount = AuthUser & { password: string };
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
  login: (email: string, password: string) => boolean;
  register: (name: string, email: string, password: string) => boolean;
  updateProfile: (profile: AuthProfileInput) => { ok: boolean; error?: string };
  logout: () => void;
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
  login: () => false,
  register: () => false,
  updateProfile: () => ({ ok: false, error: "ยังไม่พร้อมใช้งาน" }),
  logout: () => {},
};

export function useCart() {
  const context = useContext(CartContext);
  return context ?? fallbackCartContext;
}

export function useAuth() {
  const context = useContext(AuthContext);
  return context ?? fallbackAuthContext;
}
