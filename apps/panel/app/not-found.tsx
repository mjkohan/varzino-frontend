import { Button } from "@varzino/ui/components/button";
import Link from "next/link";
import { Logo } from "@varzino/shared/logo";
import { LANDING_URL } from "@varzino/shared/urls";

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
          <Link href="/">رفتن به پیشخوان</Link>
        </Button>
        <Button asChild variant="secondary">
          <a href={LANDING_URL}>صفحه معرفی</a>
        </Button>
      </div>
    </main>
  );
}
