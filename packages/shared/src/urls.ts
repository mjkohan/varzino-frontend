/**
 * Landing and panel are separate apps on separate origins.
 * Set these per environment; defaults match `pnpm dev` ports.
 */
export const LANDING_URL = process.env.NEXT_PUBLIC_LANDING_URL ?? "http://localhost:3000";
export const PANEL_URL = process.env.NEXT_PUBLIC_PANEL_URL ?? "http://localhost:3001";

export const panelLoginUrl = `${PANEL_URL}/login`;
