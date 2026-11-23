import { Button } from "@varzino/ui/components/button";
import Link from "next/link";
import { Logo } from "@varzino/shared/logo";
import { panelLoginUrl } from "@varzino/shared/urls";

export default function NotFound() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-6 px-4 text-center">
      <Logo />
      <div>
        <h1 className="text-2xl font-medium text-fg">این صفحه پیدا نشد</h1>
        <p className="mt-2 text-fg-secondary">نشانی را بررسی کنید یا از پیشخوان ادامه دهید.</p>
      </div>
      <div className="flex gap-2">
        <Button asChild>
          <a href={panelLoginUrl}>ورود به نسخه نمایشی</a>
        </Button>
        <Button asChild variant="secondary">
          <Link href="/">صفحه اصلی</Link>
        </Button>
      </div>
    </main>
  );
}
