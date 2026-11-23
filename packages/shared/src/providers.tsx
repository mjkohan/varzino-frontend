"use client";

import { TooltipProvider } from "@varzino/ui/components/overlays";
import { Direction } from "radix-ui";
import { Toaster } from "sonner";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Direction.Provider dir="rtl">
      <TooltipProvider>
        {children}
        <Toaster
          dir="rtl"
          position="bottom-left"
          toastOptions={{
            style: {
              fontFamily: "var(--font-yekan)",
              background: "var(--surface)",
              color: "var(--fg)",
              border: "1px solid var(--hairline)",
              borderRadius: "12px",
            },
          }}
        />
      </TooltipProvider>
    </Direction.Provider>
  );
}
