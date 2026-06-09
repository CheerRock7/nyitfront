import type { Metadata } from "next";
import { IBM_Plex_Mono, IBM_Plex_Sans_Thai } from "next/font/google";
import "./globals.css";
import { SiteChrome } from "@/components/site-chrome";
import { getCategories } from "@/lib/products";
import type { Category } from "@/lib/data";

const ibmThai = IBM_Plex_Sans_Thai({
  subsets: ["thai", "latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-ibm-thai",
});

const ibmMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-ibm-mono",
});

export const metadata: Metadata = {
  title: "COMPUTER HUB",
  description: "ร้านคอมพิวเตอร์ออนไลน์ จัดสเปกคอมและอุปกรณ์ครบ",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Footer category links. Degrade gracefully so the chrome never crashes the
  // whole site if the database is briefly unreachable.
  let categories: Category[] = [];
  try {
    categories = await getCategories();
  } catch {
    categories = [];
  }

  return (
    <html lang="th">
      <body className={`${ibmThai.variable} ${ibmMono.variable}`}>
        <SiteChrome categories={categories}>{children}</SiteChrome>
      </body>
    </html>
  );
}
