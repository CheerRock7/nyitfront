import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { cleanText, getSessionUser, hashPassword, normalizeIdentifier, toPublicUser } from "@/lib/storefront-auth";

type UserRow = {
  id: string;
  name: string;
  username: string;
  email: string;
  phone: string | null;
  address: string | null;
  role: "customer" | "admin";
};

function isSetupError(error: unknown) {
  const message = error instanceof Error ? error.message : "";
  return /storefront_users|storefront_sessions|permission denied/i.test(message);
}

export async function PUT(request: Request) {
  let body: { name?: unknown; email?: unknown; username?: unknown; phone?: unknown; address?: unknown; password?: unknown };

  try {
    body = (await request.json()) as { name?: unknown; email?: unknown; username?: unknown; phone?: unknown; address?: unknown; password?: unknown };
  } catch {
    return NextResponse.json({ error: "ข้อมูลโปรไฟล์ไม่ถูกต้อง" }, { status: 400 });
  }

  try {
    const currentUser = await getSessionUser();
    if (!currentUser) {
      return NextResponse.json({ error: "กรุณาเข้าสู่ระบบก่อนแก้ไขข้อมูล" }, { status: 401 });
    }

    const name = cleanText(body.name);
    const email = cleanText(body.email);
    const username = normalizeIdentifier(cleanText(body.username) || name);
    const emailNormalized = normalizeIdentifier(email);
    const phone = cleanText(body.phone) || null;
    const address = cleanText(body.address) || null;
    const password = cleanText(body.password);

    if (!name || !username || !emailNormalized) {
      return NextResponse.json({ error: "กรุณากรอกชื่อผู้ใช้งานและอีเมล" }, { status: 400 });
    }

    const rows = password
      ? await query<UserRow>(
          `UPDATE storefront_users
              SET name = $1,
                  username = $2,
                  username_normalized = $3,
                  email = $4,
                  email_normalized = $5,
                  phone = $6,
                  address = $7,
                  password_hash = $8,
                  updated_at = now()
            WHERE id = $9
            RETURNING id, name, username, email, phone, address, role`,
          [name, username, username, email, emailNormalized, phone, address, hashPassword(password), currentUser.id],
        )
      : await query<UserRow>(
          `UPDATE storefront_users
              SET name = $1,
                  username = $2,
                  username_normalized = $3,
                  email = $4,
                  email_normalized = $5,
                  phone = $6,
                  address = $7,
                  updated_at = now()
            WHERE id = $8
            RETURNING id, name, username, email, phone, address, role`,
          [name, username, username, email, emailNormalized, phone, address, currentUser.id],
        );

    return NextResponse.json({ user: toPublicUser(rows[0]) });
  } catch (error) {
    const message = error instanceof Error ? error.message : "";
    if (/duplicate key|unique constraint/i.test(message)) {
      return NextResponse.json({ error: "ชื่อผู้ใช้งานหรืออีเมลนี้ถูกใช้แล้ว" }, { status: 409 });
    }
    if (isSetupError(error)) {
      return NextResponse.json({ error: "ยังไม่ได้ตั้งค่าตารางผู้ใช้งานในฐานข้อมูล" }, { status: 503 });
    }
    return NextResponse.json({ error: "บันทึกข้อมูลไม่สำเร็จ" }, { status: 500 });
  }
}
