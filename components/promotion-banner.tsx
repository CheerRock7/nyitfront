"use client";

import { useEffect, useState, type ChangeEvent } from "react";
import { ImagePlus, RotateCcw, Save, Upload } from "lucide-react";

const CHANGE_EVENT = "nyit-promotion-banner-change";
const DEFAULT_PROMOTION = {
  src: "/promo-default.svg",
  link: "/products",
  alt: "โปรโมชัน NYIT Computer",
};

type PromotionBanner = {
  src: string;
  link: string;
  alt: string;
};

export const PROMOTION_IMAGE_SIZE = "2048 x 715 px";

async function readPromotionBanner(): Promise<PromotionBanner> {
  try {
    const response = await fetch("/api/settings/promotion-banner", { cache: "no-store" });
    const payload = (await response.json().catch(() => null)) as { banner?: PromotionBanner } | null;
    return payload?.banner ?? DEFAULT_PROMOTION;
  } catch {
    return DEFAULT_PROMOTION;
  }
}

export function usePromotionBanner() {
  const [banner, setBanner] = useState<PromotionBanner>(DEFAULT_PROMOTION);

  useEffect(() => {
    let active = true;
    const sync = async () => {
      const next = await readPromotionBanner();
      if (active) setBanner(next);
    };
    void sync();
    window.addEventListener(CHANGE_EVENT, sync);
    return () => {
      active = false;
      window.removeEventListener(CHANGE_EVENT, sync);
    };
  }, []);

  const save = async (next: PromotionBanner) => {
    const response = await fetch("/api/settings/promotion-banner", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(next),
    });
    const payload = (await response.json().catch(() => null)) as { banner?: PromotionBanner; error?: string } | null;
    if (!response.ok || !payload?.banner) throw new Error(payload?.error ?? "บันทึก banner ไม่สำเร็จ");
    setBanner(payload.banner);
    window.dispatchEvent(new Event(CHANGE_EVENT));
  };

  const reset = async () => {
    const response = await fetch("/api/settings/promotion-banner", { method: "DELETE" });
    const payload = (await response.json().catch(() => null)) as { banner?: PromotionBanner; error?: string } | null;
    if (!response.ok || !payload?.banner) throw new Error(payload?.error ?? "รีเซ็ต banner ไม่สำเร็จ");
    setBanner(payload.banner);
    window.dispatchEvent(new Event(CHANGE_EVENT));
  };

  return { banner, save, reset };
}

export function PromotionImageBanner() {
  const { banner } = usePromotionBanner();
  const content = (
    <div className="relative aspect-[2048/715] w-full overflow-hidden rounded-lg border border-slate-200 bg-slate-950 shadow-sm transition hover:-translate-y-1 hover:shadow-xl lg:aspect-auto lg:h-full">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={banner.src} alt={banner.alt} className="absolute inset-0 h-full w-full object-cover" data-testid="promotion-banner-image" />
    </div>
  );

  if (!banner.link) return content;

  return (
    <a href={banner.link} className="block lg:h-full" aria-label={banner.alt}>
      {content}
    </a>
  );
}

export function PromotionBannerEditor() {
  const { banner, save, reset } = usePromotionBanner();
  const [src, setSrc] = useState(banner.src);
  const [link, setLink] = useState(banner.link);
  const [alt, setAlt] = useState(banner.alt);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setSrc(banner.src);
    setLink(banner.link);
    setAlt(banner.alt);
  }, [banner]);

  async function submit() {
    setSaving(true);
    setMessage("");
    setError("");
    try {
      await save({ src: src.trim() || DEFAULT_PROMOTION.src, link: link.trim(), alt: alt.trim() || DEFAULT_PROMOTION.alt });
      setMessage("บันทึก banner ลงฐานข้อมูลแล้ว");
    } catch (err) {
      setError(err instanceof Error ? err.message : "บันทึก banner ไม่สำเร็จ");
    } finally {
      setSaving(false);
    }
  }

  async function resetBanner() {
    setSaving(true);
    setMessage("");
    setError("");
    try {
      await reset();
      setMessage("รีเซ็ต banner แล้ว");
    } catch (err) {
      setError(err instanceof Error ? err.message : "รีเซ็ต banner ไม่สำเร็จ");
    } finally {
      setSaving(false);
    }
  }

  function onFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") setSrc(reader.result);
    };
    reader.readAsDataURL(file);
  }

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <ImagePlus className="h-5 w-5 text-blue-700" />
            <h2 className="text-lg font-semibold text-slate-950">รูปโปรโมชันหน้าแรก</h2>
          </div>
          <p className="mt-2 text-sm text-slate-500">ขนาดแนะนำ {PROMOTION_IMAGE_SIZE} ใช้ไฟล์ JPG, PNG, WebP หรือ URL รูปภาพ</p>
        </div>
        <div className="grid gap-2">
          {message ? <p className="rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-700">{message}</p> : null}
          {error ? <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p> : null}
        </div>
      </div>

      <div className="mt-5 grid gap-5 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="overflow-hidden rounded-lg border border-slate-200 bg-slate-950">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={src || DEFAULT_PROMOTION.src} alt={alt || DEFAULT_PROMOTION.alt} className="aspect-[2048/715] w-full object-cover" />
        </div>

        <div className="grid content-start gap-3">
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-slate-700">URL รูปภาพ</span>
            <input value={src} onChange={(event) => setSrc(event.target.value)} className="h-11 w-full rounded-lg border border-slate-300 px-3 text-sm outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100" placeholder="https://..." />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-slate-700">ลิงก์เมื่อกดรูป</span>
            <input value={link} onChange={(event) => setLink(event.target.value)} className="h-11 w-full rounded-lg border border-slate-300 px-3 text-sm outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100" placeholder="/products" />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-slate-700">คำอธิบายรูป</span>
            <input value={alt} onChange={(event) => setAlt(event.target.value)} className="h-11 w-full rounded-lg border border-slate-300 px-3 text-sm outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100" placeholder="โปรโมชัน..." />
          </label>
          <label className="inline-flex h-11 cursor-pointer items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 text-sm font-medium text-slate-700 transition hover:border-blue-600 hover:text-blue-700">
            <Upload className="h-4 w-4" />
            อัปโหลดรูป
            <input type="file" accept="image/png,image/jpeg,image/webp,image/svg+xml" onChange={onFileChange} className="sr-only" />
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button type="button" onClick={submit} disabled={saving} className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300">
              <Save className="h-4 w-4" />
              บันทึก
            </button>
            <button type="button" onClick={resetBanner} disabled={saving} className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60">
              <RotateCcw className="h-4 w-4" />
              ค่าเริ่มต้น
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
