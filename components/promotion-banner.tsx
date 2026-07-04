"use client";

import { useEffect, useState, type ChangeEvent } from "react";
import { ImagePlus, RotateCcw, Save, Upload } from "lucide-react";

const STORAGE_KEY = "nyit_promotion_banner_v1";
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

function readPromotionBanner(): PromotionBanner {
  if (typeof window === "undefined") return DEFAULT_PROMOTION;
  try {
    const value = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || "null") as Partial<PromotionBanner> | null;
    return {
      src: value?.src || DEFAULT_PROMOTION.src,
      link: value?.link || DEFAULT_PROMOTION.link,
      alt: value?.alt || DEFAULT_PROMOTION.alt,
    };
  } catch {
    return DEFAULT_PROMOTION;
  }
}

function writePromotionBanner(value: PromotionBanner) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

export function usePromotionBanner() {
  const [banner, setBanner] = useState<PromotionBanner>(DEFAULT_PROMOTION);

  useEffect(() => {
    const sync = () => setBanner(readPromotionBanner());
    sync();
    window.addEventListener("storage", sync);
    window.addEventListener(CHANGE_EVENT, sync);
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener(CHANGE_EVENT, sync);
    };
  }, []);

  const save = (next: PromotionBanner) => {
    setBanner(next);
    writePromotionBanner(next);
  };

  const reset = () => {
    setBanner(DEFAULT_PROMOTION);
    window.localStorage.removeItem(STORAGE_KEY);
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

  useEffect(() => {
    setSrc(banner.src);
    setLink(banner.link);
    setAlt(banner.alt);
  }, [banner]);

  function submit() {
    save({ src: src.trim() || DEFAULT_PROMOTION.src, link: link.trim(), alt: alt.trim() || DEFAULT_PROMOTION.alt });
    setMessage("บันทึกรูปโปรโมชั่นแล้ว");
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
            <h2 className="text-lg font-semibold text-slate-950">รูปโปรโมชั่นหน้าแรก</h2>
          </div>
          <p className="mt-2 text-sm text-slate-500">ขนาดแนะนำ {PROMOTION_IMAGE_SIZE} ใช้ไฟล์ JPG, PNG, WebP หรือ URL รูปภาพ</p>
        </div>
        {message ? <p className="rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-700">{message}</p> : null}
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
            <button type="button" onClick={submit} className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition hover:bg-blue-700">
              <Save className="h-4 w-4" />
              บันทึก
            </button>
            <button type="button" onClick={reset} className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 text-sm font-medium text-slate-700 transition hover:bg-slate-50">
              <RotateCcw className="h-4 w-4" />
              ค่าเริ่มต้น
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
