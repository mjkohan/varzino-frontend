import { ArrowRight } from "lucide-react";
import Link from "next/link";

/** Back to the parent list. In RTL "back" points right. */
export function BackLink({ href, label }: { href: string; label: string }) {
  return (
    <Link href={href} className="inline-flex items-center gap-1.5 text-sm text-fg-muted transition-colors hover:text-fg">
      <ArrowRight aria-hidden className="size-4" strokeWidth={1.75} />
      {label}
    </Link>
  );
}
