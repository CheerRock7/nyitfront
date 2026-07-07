import { NextResponse } from "next/server";
import { query } from "@/lib/db";

type FeaturedRow = {
  product_id: string;
};

function cleanIds(value: unknown) {
  if (!Array.isArray(value)) return [];
  return [...new Set(value.map((item) => String(item).trim()).filter(Boolean))];
}

function isSetupError(error: unknown) {
  const message = error instanceof Error ? error.message : "";
  return /storefront_featured_products/i.test(message) || /permission denied/i.test(message);
}

export async function GET() {
  try {
    const rows = await query<FeaturedRow>(
      "SELECT product_id FROM storefront_featured_products ORDER BY sort_order, created_at, product_id",
    );
    return NextResponse.json({ ids: rows.map((row) => row.product_id) });
  } catch (error) {
    if (isSetupError(error)) {
      return NextResponse.json({ error: "ยังไม่ได้ตั้งค่าตารางสินค้าติดดาวในฐานข้อมูล" }, { status: 503 });
    }
    return NextResponse.json({ error: "โหลดสินค้าติดดาวไม่สำเร็จ" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  let body: { ids?: unknown };

  try {
    body = (await request.json()) as { ids?: unknown };
  } catch {
    return NextResponse.json({ error: "ข้อมูลสินค้าติดดาวไม่ถูกต้อง" }, { status: 400 });
  }

  const ids = cleanIds(body.ids);

  try {
    if (!ids.length) {
      await query("DELETE FROM storefront_featured_products");
      return NextResponse.json({ ids: [] });
    }

    const sortOrders = ids.map((_, index) => index);
    await query("DELETE FROM storefront_featured_products WHERE NOT (product_id = ANY($1::text[]))", [ids]);
    await query(
      `INSERT INTO storefront_featured_products (product_id, sort_order)
       SELECT product_id, sort_order
         FROM unnest($1::text[], $2::integer[]) AS input(product_id, sort_order)
       ON CONFLICT (product_id)
       DO UPDATE SET sort_order = EXCLUDED.sort_order`,
      [ids, sortOrders],
    );

    return NextResponse.json({ ids });
  } catch (error) {
    if (isSetupError(error)) {
      return NextResponse.json({ error: "ยังไม่ได้ตั้งค่าตารางสินค้าติดดาวในฐานข้อมูล" }, { status: 503 });
    }
    return NextResponse.json({ error: "บันทึกสินค้าติดดาวไม่สำเร็จ" }, { status: 500 });
  }
}
