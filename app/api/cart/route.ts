import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { getSessionUser } from "@/lib/storefront-auth";
import type { Product } from "@/lib/data";

type CartInput = Product & { quantity?: number };
type CartRow = {
  product_id: string;
  quantity: number;
  product_snapshot: Product;
};

function isSetupError(error: unknown) {
  const message = error instanceof Error ? error.message : "";
  return /storefront_carts|storefront_users|storefront_sessions|permission denied/i.test(message);
}

function cleanItem(value: unknown): (Product & { quantity: number }) | null {
  if (!value || typeof value !== "object") return null;
  const item = value as CartInput;
  const id = typeof item.id === "string" ? item.id.trim() : "";
  const name = typeof item.name === "string" ? item.name.trim() : "";
  const quantity = Math.max(1, Math.floor(Number(item.quantity)));
  const price = Number(item.price);
  if (!id || !name || !Number.isFinite(price) || price < 0 || !Number.isFinite(quantity)) return null;

  return {
    ...item,
    id,
    name,
    price,
    quantity,
    brand: typeof item.brand === "string" ? item.brand : "",
    cat: typeof item.cat === "string" ? item.cat : "",
    spec: typeof item.spec === "string" ? item.spec : "",
    glyph: typeof item.glyph === "string" ? item.glyph : "gear",
  };
}

export async function GET() {
  try {
    const user = await getSessionUser();
    if (!user) return NextResponse.json({ items: [] }, { status: 401 });

    const rows = await query<CartRow>(
      `SELECT product_id, quantity, product_snapshot
         FROM storefront_carts
        WHERE user_id = $1
        ORDER BY updated_at DESC, product_id`,
      [user.id],
    );

    return NextResponse.json({
      items: rows.map((row) => ({ ...row.product_snapshot, id: row.product_id, quantity: row.quantity })),
    });
  } catch (error) {
    if (isSetupError(error)) {
      return NextResponse.json({ error: "ยังไม่ได้ตั้งค่าตารางตะกร้าในฐานข้อมูล" }, { status: 503 });
    }
    return NextResponse.json({ error: "โหลดตะกร้าไม่สำเร็จ" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  let body: { items?: unknown[] };

  try {
    body = (await request.json()) as { items?: unknown[] };
  } catch {
    return NextResponse.json({ error: "ข้อมูลตะกร้าไม่ถูกต้อง" }, { status: 400 });
  }

  try {
    const user = await getSessionUser();
    if (!user) return NextResponse.json({ error: "กรุณาเข้าสู่ระบบก่อนใช้ตะกร้า" }, { status: 401 });

    const items = (Array.isArray(body.items) ? body.items : []).map(cleanItem).filter(Boolean) as (Product & { quantity: number })[];
    await query("DELETE FROM storefront_carts WHERE user_id = $1", [user.id]);

    for (const item of items) {
      const { quantity, ...product } = item;
      await query(
        `INSERT INTO storefront_carts (user_id, product_id, quantity, product_snapshot)
         VALUES ($1, $2, $3, $4::jsonb)
         ON CONFLICT (user_id, product_id)
         DO UPDATE SET quantity = EXCLUDED.quantity,
                       product_snapshot = EXCLUDED.product_snapshot,
                       updated_at = now()`,
        [user.id, item.id, quantity, JSON.stringify(product)],
      );
    }

    return NextResponse.json({ items });
  } catch (error) {
    if (isSetupError(error)) {
      return NextResponse.json({ error: "ยังไม่ได้ตั้งค่าตารางตะกร้าในฐานข้อมูล" }, { status: 503 });
    }
    return NextResponse.json({ error: "บันทึกตะกร้าไม่สำเร็จ" }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    const user = await getSessionUser();
    if (!user) return NextResponse.json({ ok: true });
    await query("DELETE FROM storefront_carts WHERE user_id = $1", [user.id]);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: true });
  }
}
