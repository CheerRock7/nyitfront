import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { cleanText, requireAdminUser } from "@/lib/storefront-auth";

const SETTING_KEY = "promotion_banner";
const T = {
  defaultAlt: "\u0e42\u0e1b\u0e23\u0e42\u0e21\u0e0a\u0e31\u0e19 NYIT Computer",
  setup: "\u0e22\u0e31\u0e07\u0e44\u0e21\u0e48\u0e44\u0e14\u0e49\u0e15\u0e31\u0e49\u0e07\u0e04\u0e48\u0e32\u0e15\u0e32\u0e23\u0e32\u0e07 settings \u0e43\u0e19\u0e10\u0e32\u0e19\u0e02\u0e49\u0e2d\u0e21\u0e39\u0e25",
  invalid: "\u0e02\u0e49\u0e2d\u0e21\u0e39\u0e25 banner \u0e44\u0e21\u0e48\u0e16\u0e39\u0e01\u0e15\u0e49\u0e2d\u0e07",
  adminOnly: "\u0e2a\u0e33\u0e2b\u0e23\u0e31\u0e1a admin \u0e40\u0e17\u0e48\u0e32\u0e19\u0e31\u0e49\u0e19",
  saveFail: "\u0e1a\u0e31\u0e19\u0e17\u0e36\u0e01 banner \u0e44\u0e21\u0e48\u0e2a\u0e33\u0e40\u0e23\u0e47\u0e08",
  resetFail: "\u0e23\u0e35\u0e40\u0e0b\u0e47\u0e15 banner \u0e44\u0e21\u0e48\u0e2a\u0e33\u0e40\u0e23\u0e47\u0e08",
} as const;

const DEFAULT_PROMOTION = {
  src: "/promo-default.svg",
  link: "/products",
  alt: T.defaultAlt,
};

type SettingRow = {
  value: typeof DEFAULT_PROMOTION;
};

function isSetupError(error: unknown) {
  const message = error instanceof Error ? error.message : "";
  return /storefront_settings|storefront_users|storefront_sessions|permission denied/i.test(message);
}

export async function GET() {
  try {
    const rows = await query<SettingRow>("SELECT value FROM storefront_settings WHERE key = $1 LIMIT 1", [SETTING_KEY]);
    return NextResponse.json({ banner: rows[0]?.value ?? DEFAULT_PROMOTION });
  } catch (error) {
    if (isSetupError(error)) {
      return NextResponse.json({ banner: DEFAULT_PROMOTION, error: T.setup }, { status: 503 });
    }
    return NextResponse.json({ banner: DEFAULT_PROMOTION }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  let body: { src?: unknown; link?: unknown; alt?: unknown };

  try {
    body = (await request.json()) as { src?: unknown; link?: unknown; alt?: unknown };
  } catch {
    return NextResponse.json({ error: T.invalid }, { status: 400 });
  }

  try {
    const admin = await requireAdminUser();
    if (!admin) return NextResponse.json({ error: T.adminOnly }, { status: 403 });

    const banner = {
      src: cleanText(body.src) || DEFAULT_PROMOTION.src,
      link: cleanText(body.link),
      alt: cleanText(body.alt) || DEFAULT_PROMOTION.alt,
    };

    await query(
      `INSERT INTO storefront_settings (key, value, updated_at)
       VALUES ($1, $2::jsonb, now())
       ON CONFLICT (key)
       DO UPDATE SET value = EXCLUDED.value, updated_at = now()`,
      [SETTING_KEY, JSON.stringify(banner)],
    );

    return NextResponse.json({ banner });
  } catch (error) {
    if (isSetupError(error)) {
      return NextResponse.json({ error: T.setup }, { status: 503 });
    }
    return NextResponse.json({ error: T.saveFail }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    const admin = await requireAdminUser();
    if (!admin) return NextResponse.json({ error: T.adminOnly }, { status: 403 });
    await query("DELETE FROM storefront_settings WHERE key = $1", [SETTING_KEY]);
    return NextResponse.json({ banner: DEFAULT_PROMOTION });
  } catch (error) {
    if (isSetupError(error)) {
      return NextResponse.json({ error: T.setup }, { status: 503 });
    }
    return NextResponse.json({ error: T.resetFail }, { status: 500 });
  }
}
