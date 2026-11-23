"use client";

import { Button } from "@varzino/ui/components/button";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Logo } from "@varzino/shared/logo";
import { panelLoginUrl } from "@varzino/shared/urls";

const links = [
  { href: "#modules", label: "امکانات" },
  { href: "#roles", label: "برای چه کسانی" },
  { href: "#onboarding", label: "راه‌اندازی" },
  { href: "#faq", label: "پرسش‌ها" },
];

export function LandingHeader() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={
        "sticky top-0 z-40 border-b transition-colors duration-200 " +
        (scrolled || open ? "border-hairline bg-bg/90 backdrop-blur-md" : "border-transparent bg-bg")
      }
    >
      <div className="mx-auto flex h-16 max-w-[1200px] items-center justify-between gap-6 px-4 md:px-8">
        <Link href="/" aria-label="ورزینو، صفحه اصلی">
          <Logo />
        </Link>
        <nav aria-label="بخش‌های صفحه" className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="rounded-control px-3 py-2 text-sm text-fg-secondary transition-colors hover:text-fg">
              {l.label}
            </a>
          ))}
        </nav>
        <div className="hidden items-center gap-4 md:flex">
          <a href={panelLoginUrl} className="text-sm text-fg-secondary transition-colors hover:text-fg">
            نسخه نمایشی
          </a>
          <Button asChild size="md">
            <a href="#contact">درخواست جلسه معرفی</a>
          </Button>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          aria-label={open ? "بستن منو" : "باز کردن منو"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X /> : <Menu />}
        </Button>
      </div>
      {open ? (
        <nav aria-label="منوی موبایل" className="border-t border-hairline px-4 pb-4 pt-2 md:hidden">
          <ul className="flex flex-col">
            {links.map((l) => (
              <li key={l.href}>
                <a href={l.href} onClick={() => setOpen(false)} className="flex h-11 items-center text-base text-fg">
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <Button asChild variant="secondary" size="lg">
              <a href={panelLoginUrl}>نسخه نمایشی</a>
            </Button>
            <Button asChild size="lg">
              <a href="#contact" onClick={() => setOpen(false)}>
                جلسه معرفی
              </a>
            </Button>
          </div>
        </nav>
      ) : null}
    </header>
  );
}
