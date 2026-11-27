import type { Metadata } from "next";
import { Logo } from "@varzino/shared/logo";
import { LoginForm } from "@/components/login-form";
import { LANDING_URL } from "@varzino/shared/urls";

export const metadata: Metadata = { title: "ورود به سامانه" };

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
        <div className="w-full max-w-md rounded-card border border-hairline bg-surface p-6 shadow-sm md:p-8">
          <h1 className="text-2xl font-semibold text-fg">ورود به سامانه ورزینو</h1>
          <p className="mt-2 text-base leading-8 text-fg-secondary">با شماره همراه و رمز عبور وارد شوید.</p>
          <LoginForm />
          <p className="mt-6 text-sm leading-7 text-fg-muted">
            رمز عبور خود را فراموش کرده‌اید؟ با دبیرخانه فدراسیون یا هیئت استان خود تماس بگیرید.
          </p>
        </div>
      </main>
    </div>
  );
}
