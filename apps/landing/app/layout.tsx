import type { Metadata, Viewport } from "next";
import { yekan } from "@varzino/shared/font";
import { Providers } from "@varzino/shared/providers";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "ورزینو، سامانه یکپارچه فدراسیون‌ها و هیئت‌های ورزشی",
    template: "%s | ورزینو",
  },
  description:
    "پرونده ورزشکاران، مسابقات، رنکینگ، آموزش، مجوزها و امور مالی فدراسیون و هیئت‌های استانی در یک سامانه برخط.",
};

export const viewport: Viewport = {
  themeColor: "#f7f8f8",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fa" dir="rtl" className={yekan.variable} data-theme="light">
      <body className="min-h-dvh bg-bg font-sans text-fg">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
