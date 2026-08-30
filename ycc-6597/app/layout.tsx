import type { Metadata, Viewport } from "next";
import { Press_Start_2P, Be_Vietnam_Pro } from "next/font/google";
import { FINAL_CODE, TOTAL_DAYS, vn } from "@/data/event";
import "./globals.css";

const pressStart = Press_Start_2P({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-press-start",
  display: "swap",
});

const beVietnam = Be_Vietnam_Pro({
  weight: ["400", "600", "700"],
  subsets: ["latin", "vietnamese"],
  variable: "--font-be-vietnam",
  display: "swap",
});

export const metadata: Metadata = {
  title: `MÃ ${FINAL_CODE} · Nhật ký Quan sát viên`,
  description: `Young Creation Club · Ngày thứ ${vn(TOTAL_DAYS)}`,
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: "#05060e",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="vi"
      className={`${pressStart.variable} ${beVietnam.variable} h-full antialiased`}
    >
      <body className="bg-void text-helmet min-h-full">{children}</body>
    </html>
  );
}
