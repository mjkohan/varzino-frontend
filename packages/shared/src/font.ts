import localFont from "next/font/local";

/** IRANYekanX, shared by landing and panel. Exposes the CSS variable --font-yekan. */
export const yekan = localFont({
  variable: "--font-yekan",
  display: "swap",
  src: [
    { path: "./fonts/IRANYekanX-Light.woff2", weight: "300", style: "normal" },
    { path: "./fonts/IRANYekanX-Regular.woff2", weight: "400", style: "normal" },
    { path: "./fonts/IRANYekanX-Medium.woff2", weight: "500", style: "normal" },
    { path: "./fonts/IRANYekanX-DemiBold.woff2", weight: "600", style: "normal" },
    { path: "./fonts/IRANYekanX-Bold.woff2", weight: "700", style: "normal" },
  ],
});
