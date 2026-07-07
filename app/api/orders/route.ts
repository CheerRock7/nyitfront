import { NextResponse } from "next/server";
import { query } from "@/lib/db";

type OrderCustomer = {
  name?: string;
  email?: string;
  username?: string;
  phone?: string;
  address?: string;
};

type OrderItem = {
  id?: string;
  name?: string;
  brand?: string;
  price?: number;
  quantity?: number;
  image?: string;
  category?: string;
};

type OrderRow = {
  id: string;
  order_code: string;
};

function cleanText(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

export async function POST(request: Request) {
  let body: { customer?: OrderCustomer; items?: OrderItem[] };

  try {
    body = (await request.json()) as { customer?: OrderCustomer; items?: OrderItem[] };
  } catch {
    return NextResponse.json({ error: "ข้อมูลคำสั่งซื้อไม่ถูกต้อง" }, { status: 400 });
  }

  const customer = body.customer;
  const rawItems = Array.isArray(body.items) ? body.items : [];

  if (!customer?.name || !customer.email) {
    return NextResponse.json({ error: "กรุณาเข้าสู่ระบบก่อนสั่งซื้อ" }, { status: 401 });
  }

  const items = rawItems
    .map((item) => ({
      id: cleanText(item.id),
      name: cleanText(item.name),
      brand: cleanText(item.brand),
      image: cleanText(item.image),
      category: cleanText(item.category),
      price: Number(item.price),
      quantity: Math.max(1, Math.floor(Number(item.quantity))),
    }))
    .filter((item) => item.id && item.name && Number.isFinite(item.price) && item.price >= 0 && Number.isFinite(item.quantity));

  if (!items.length) {
    return NextResponse.json({ error: "กรุณาเลือกสินค้าก่อนสั่งซื้อ" }, { status: 400 });
  }

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const identifier = cleanText(customer.username) || cleanText(customer.email);

  try {
    const rows = await query<OrderRow>(
      `INSERT INTO storefront_orders
        (customer_name, customer_identifier, customer_phone, customer_address, total, items)
       VALUES ($1, $2, $3, $4, $5, $6::jsonb)
       RETURNING id, order_code`,
      [
        cleanText(customer.name),
        identifier,
        cleanText(customer.phone) || null,
        cleanText(customer.address) || null,
        total,
        JSON.stringify(items),
      ],
    );

    return NextResponse.json({ ok: true, orderId: rows[0]?.id, orderCode: rows[0]?.order_code });
  } catch (error) {
    const message = error instanceof Error ? error.message : "";
    if (/storefront_orders/i.test(message) || /permission denied/i.test(message)) {
      return NextResponse.json({ error: "ยังไม่ได้ตั้งค่าตารางคำสั่งซื้อในฐานข้อมูล" }, { status: 503 });
    }
    return NextResponse.json({ error: "บันทึกคำสั่งซื้อไม่สำเร็จ" }, { status: 500 });
  }
}
