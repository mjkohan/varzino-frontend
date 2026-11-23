import type { Metadata } from "next";
import { Logo } from "@varzino/shared/logo";
import { RolePicker } from "@/components/role-picker";
import { LANDING_URL } from "@varzino/shared/urls";

export const metadata: Metadata = { title: "ورود به نسخه نمایشی" };

export default function LoginPage() {
  return (
    <div className="flex min-h-dvh flex-col">
      <header className="mx-auto flex h-16 w-full max-w-[1200px] items-center justify-between px-4 md:px-8">
        <a href={LANDING_URL} aria-label="ورزینو، صفحه معرفی">
          <Logo />
        </a>
        <a href={LANDING_URL} className="text-sm text-fg-secondary transition-colors hover:text-fg">
          بازگشت به صفحه معرفی
        </a>
      </header>
      <main className="flex flex-1 items-center justify-center px-4 py-12">
        <div className="w-full max-w-xl">
          <h1 className="text-2xl font-semibold text-fg">ورود به نسخه نمایشی</h1>
          <p className="mt-2 text-base leading-8 text-fg-secondary">
            نقشی را انتخاب کنید تا پنل را از دید همان کاربر ببینید. همه داده‌ها ساختگی است و تغییرات ذخیره نمی‌شود.
          </p>
          <RolePicker />
        </div>
      </main>
    </div>
  );
}
