"use client";

import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { Scanner, type IDetectedBarcode, type IScannerError } from "@yudiel/react-qr-scanner";
import { ScanLine, X } from "lucide-react";

/**
 * Camera barcode scanner. Uses @yudiel/react-qr-scanner, which wraps the
 * Barcode Detection API (with a ZXing/WASM ponyfill fallback) and owns all the
 * camera/video plumbing, torch, and the aiming overlay.
 *
 * A scanned value is resolved to a product page: if it contains "/products/<id>"
 * (e.g. a full storefront URL) that path is used; otherwise the whole value is
 * treated as the product id and the user is sent to /products/<value>.
 */

/**
 * Pull a product target path out of whatever the barcode encoded.
 * Handles: a full URL containing /products/<id>, a per-unit code
 * "<productId>-<serialId>" (e.g. "8-47" → product 8), and a bare id.
 */
export function resolveProductPath(raw: string): string | null {
  const value = raw.trim();
  if (!value) return null;

  const urlMatch = value.match(/\/products\/([^/?#\s]+)/i);
  if (urlMatch) return `/products/${urlMatch[1]}`;

  // "8" or "8-47" (productId-serialId) → product 8
  const idMatch = value.match(/^(\d+)(?:-\d+)?$/);
  if (idMatch) return `/products/${idMatch[1]}`;

  return `/products/${encodeURIComponent(value)}`;
}

export function BarcodeScanner({ className }: { className?: string }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={
          className ??
          "relative grid h-11 w-11 place-items-center rounded-xl border border-slate-200 bg-white transition hover:border-slate-950"
        }
        aria-label="สแกนบาร์โค้ด"
        title="สแกนบาร์โค้ด"
      >
        <ScanLine className="h-5 w-5" />
      </button>
      {open && <ScannerModal onClose={() => setOpen(false)} />}
    </>
  );
}

function ScannerModal({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [handled, setHandled] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Portal target (document.body) only exists on the client.
  useEffect(() => setMounted(true), []);

  const onScan = useCallback(
    (codes: IDetectedBarcode[]) => {
      if (handled) return;
      const raw = codes[0]?.rawValue;
      if (!raw) return;
      const path = resolveProductPath(raw);
      if (!path) return;
      setHandled(true);
      router.push(path);
      onClose();
    },
    [handled, router, onClose],
  );

  const onError = useCallback((err: IScannerError) => {
    setError(
      err.kind === "permission-denied"
        ? "ไม่ได้รับอนุญาตให้ใช้กล้อง กรุณาอนุญาตในเบราว์เซอร์"
        : err.kind === "insecure-context"
          ? "กล้องต้องเปิดผ่าน HTTPS (หรือ localhost) เท่านั้น"
          : err.kind === "no-camera"
            ? "ไม่พบกล้องบนอุปกรณ์นี้"
            : "เปิดกล้องไม่สำเร็จ อุปกรณ์หรือเบราว์เซอร์อาจไม่รองรับ",
    );
  }, []);

  if (!mounted) return null;

  // Rendered through a portal to document.body so it escapes the header's
  // backdrop-filter containing block — otherwise `position: fixed` is relative
  // to the header, not the viewport, and the overlay can't cover the page.
  // Structural styles are inline so the full-screen black overlay is guaranteed.
  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 2147483647,
        display: "flex",
        flexDirection: "column",
        background: "#000",
        height: "100dvh",
        width: "100vw",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "16px",
          color: "#fff",
          flex: "0 0 auto",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px", fontWeight: 500 }}>
          <ScanLine className="h-5 w-5" />
          สแกนบาร์โค้ดสินค้า
          <span style={{ marginLeft: 8, padding: "2px 8px", borderRadius: 999, background: "#16a34a", fontSize: 12 }}>
            BUILD v4
          </span>
        </div>
        <button
          onClick={onClose}
          aria-label="ปิด"
          style={{
            display: "grid",
            placeItems: "center",
            height: "40px",
            width: "40px",
            borderRadius: "12px",
            border: "1px solid rgba(255,255,255,0.2)",
            color: "#fff",
            background: "transparent",
          }}
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div style={{ position: "relative", flex: "1 1 auto", overflow: "hidden", background: "#000" }}>
        {error ? (
          <div style={{ display: "grid", placeItems: "center", height: "100%", padding: "24px", textAlign: "center" }}>
            <p style={{ maxWidth: "28rem", borderRadius: "12px", background: "rgba(239,68,68,0.2)", padding: "12px 16px", fontSize: "14px", color: "#fee2e2" }}>
              {error}
            </p>
          </div>
        ) : (
          <Scanner
            onScan={onScan}
            onError={(e) => onError(e as IScannerError)}
            constraints={{ facingMode: "environment" }}
            components={{ finder: true, torch: true }}
            styles={{
              container: { width: "100%", height: "100%", position: "absolute", inset: 0 },
              video: { width: "100%", height: "100%", objectFit: "cover" },
            }}
          />
        )}
      </div>

      {!error && (
        <div style={{ padding: "20px", textAlign: "center", fontSize: "14px", color: "#cbd5e1", flex: "0 0 auto" }}>
          เล็งกล้องไปที่บาร์โค้ดสินค้า
        </div>
      )}
    </div>,
    document.body,
  );
}
