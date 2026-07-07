import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { cleanText, createSession, hashPassword, normalizeIdentifier, toPublicUser } from "@/lib/storefront-auth";

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

export async function POST(request: Request) {
  let body: { name?: unknown; identifier?: unknown; password?: unknown };

  try {
    body = (await request.json()) as { name?: unknown; identifier?: unknown; password?: unknown };
  } catch {
    return NextResponse.json({ error: "ข้อมูลสมัครสมาชิกไม่ถูกต้อง" }, { status: 400 });
  }

  const name = cleanText(body.name);
  const identifier = cleanText(body.identifier);
  const password = cleanText(body.password);
  const username = normalizeIdentifier(name);
  const email = identifier;
  const emailNormalized = normalizeIdentifier(identifier);

  if (!name || !username || !emailNormalized || password.length < 6) {
    return NextResponse.json({ error: "กรุณากรอกข้อมูลให้ครบ และรหัสผ่านอย่างน้อย 6 ตัว" }, { status: 400 });
  }

  try {
    const rows = await query<UserRow>(
      `INSERT INTO storefront_users
        (name, username, username_normalized, email, email_normalized, password_hash, role)
       VALUES ($1, $2, $3, $4, $5, $6, 'customer')
       RETURNING id, name, username, email, phone, address, role`,
      [name, username, username, email, emailNormalized, hashPassword(password)],
    );

    await createSession(String(rows[0].id));
    return NextResponse.json({ user: toPublicUser(rows[0]) });
  } catch (error) {
    const message = error instanceof Error ? error.message : "";
    if (/duplicate key|unique constraint/i.test(message)) {
      return NextResponse.json({ error: "ชื่อผู้ใช้งานหรืออีเมลนี้ถูกใช้แล้ว" }, { status: 409 });
    }
    if (isSetupError(error)) {
      return NextResponse.json({ error: "ยังไม่ได้ตั้งค่าตารางผู้ใช้งานในฐานข้อมูล" }, { status: 503 });
    }
    return NextResponse.json({ error: "สมัครสมาชิกไม่สำเร็จ" }, { status: 500 });
  }
}
