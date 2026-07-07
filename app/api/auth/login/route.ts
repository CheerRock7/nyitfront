import { NextResponse } from "next/server";
import { createSession, findUserByIdentifier, verifyPassword, toPublicUser, cleanText } from "@/lib/storefront-auth";

function isSetupError(error: unknown) {
  const message = error instanceof Error ? error.message : "";
  return /storefront_users|storefront_sessions|permission denied/i.test(message);
}

export async function POST(request: Request) {
  let body: { identifier?: unknown; password?: unknown };

  try {
    body = (await request.json()) as { identifier?: unknown; password?: unknown };
  } catch {
    return NextResponse.json({ error: "ข้อมูลเข้าสู่ระบบไม่ถูกต้อง" }, { status: 400 });
  }

  const identifier = cleanText(body.identifier);
  const password = cleanText(body.password);
  if (!identifier || !password) {
    return NextResponse.json({ error: "กรุณากรอกชื่อผู้ใช้งาน/อีเมลและรหัสผ่าน" }, { status: 400 });
  }

  try {
    const user = await findUserByIdentifier(identifier);
    if (!user?.password_hash || !verifyPassword(password, user.password_hash)) {
      return NextResponse.json({ error: "ชื่อผู้ใช้งาน/อีเมลหรือรหัสผ่านไม่ถูกต้อง" }, { status: 401 });
    }

    await createSession(String(user.id));
    return NextResponse.json({ user: toPublicUser(user) });
  } catch (error) {
    if (isSetupError(error)) {
      return NextResponse.json({ error: "ยังไม่ได้ตั้งค่าตารางผู้ใช้งานในฐานข้อมูล" }, { status: 503 });
    }
    return NextResponse.json({ error: "เข้าสู่ระบบไม่สำเร็จ" }, { status: 500 });
  }
}
