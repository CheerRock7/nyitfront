import { NextResponse } from "next/server";
import { clearSession, getSessionUser } from "@/lib/storefront-auth";

function isSetupError(error: unknown) {
  const message = error instanceof Error ? error.message : "";
  return /storefront_users|storefront_sessions|permission denied/i.test(message);
}

export async function GET() {
  try {
    const user = await getSessionUser();
    return NextResponse.json({ user });
  } catch (error) {
    if (isSetupError(error)) {
      return NextResponse.json({ user: null, error: "ยังไม่ได้ตั้งค่าตารางผู้ใช้งานในฐานข้อมูล" }, { status: 503 });
    }
    return NextResponse.json({ user: null }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    await clearSession();
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: true });
  }
}
