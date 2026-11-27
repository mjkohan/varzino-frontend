# Varzino frontend

Varzino (ورزینو), phase one: a landing page and an admin panel, as two separate Next.js apps in one Turborepo. It is front-end only. There is no backend: the data is generated mock data, and sign-in uses hardcoded accounts.

## Stack

- Turborepo + pnpm workspaces
- Next.js 16 (App Router, Turbopack), React 19, TypeScript
- Tailwind CSS v4, with the tokens in `packages/ui/src/styles/tokens.css`
- Radix UI primitives, lucide icons, Recharts, cmdk, sonner
- IRANYekanX font (local), RTL-first, Persian digits, Jalali dates via `Intl`

## Layout

```
apps/landing             landing site, port 3000
  app/page.tsx           /
  components/            landing sections
apps/panel               admin panel, port 3001
  app/login              phone + password sign-in   /login
  lib/accounts.ts        hardcoded accounts (server only)
  proxy.ts               redirects to /login without a session
  app/(dashboard)        shell + dashboard  /  and 20 module routes (/competitions, /people ...)
  components/            panel shell, lists, views
packages/shared          code both apps use: font, providers, logo, membership card, bracket, cross-app URLs
packages/ui              design tokens, components, charts
packages/demo-data       typed, seeded mock data, one data set per federation (profiles/para.ts, profiles/assoc.ts)
packages/utils           fa-IR formatting: numbers, Toman, Jalali dates
packages/config-typescript
```

## Run

```bash
pnpm install
pnpm dev        # landing http://localhost:3000, panel http://localhost:3001
pnpm --filter landing dev   # one app only
pnpm build      # production build of every workspace
pnpm lint
pnpm typecheck
```

## Federations and sign-in

The panel holds mock data for two federations. The account you sign in with decides which federation's data you see.

- **فدراسیون ورزش‌های جانبازان و توان‌یابان** (`para`): para powerlifting, athletics, table tennis, shooting, archery, sitting volleyball, wheelchair basketball.
- **فدراسیون انجمن‌های ورزشی** (`assoc`): the darts association only (steel and soft darts).

| Federation | Role | Phone | Password |
|---|---|---|---|
| para | Secretary-general (federation) | 09121110001 | Para@1405 |
| para | Provincial board head (Isfahan) | 09121110002 | Para@1405 |
| para | Club manager | 09121110003 | Para@1405 |
| para | Athlete (participant portal) | 09121110004 | Para@1405 |
| assoc | Secretary-general (federation) | 09122220001 | Darts@1405 |
| assoc | Provincial board head (Tehran) | 09122220002 | Darts@1405 |
| assoc | Darts club manager | 09122220003 | Darts@1405 |
| assoc | Athlete (participant portal) | 09122220004 | Darts@1405 |

The phone field also accepts Persian digits. These accounts are not real security: the passwords are in `apps/panel/lib/accounts.ts`, and the session cookie (`varzino-session`) is unsigned. Replace them with a real auth backend before production use. The cookie gets the `Secure` flag only when `NEXT_PUBLIC_PANEL_URL` starts with `https://`.

Server code reads data with `getData()` from `apps/panel/lib/session.ts`. Client components use `useData()` from `apps/panel/components/data-provider.tsx`. To add a federation, add a profile in `packages/demo-data/src/profiles/` and register it in `dataset.ts`.

## Cross-app links

The landing page links to the panel login, and the panel links back to the landing page. The URLs come from `packages/shared/src/urls.ts`, which reads `NEXT_PUBLIC_LANDING_URL` and `NEXT_PUBLIC_PANEL_URL`. See `apps/*/.env.example`. Set both for each deployment, because they are inlined at build time.

## Panel modules

The modules come from the product owner's phase-one list (summary of doc 46).

- **Full screens:** competitions (list, detail with bracket, create wizard), ranking, people (list and profile), organizations, education, licenses (approval workflow), finance.
- **Overview screens:** users and access, documents, messaging, evaluation, venues, camps, events, inspection, talent, leagues, strategy, HR, discipline. They share one template in `apps/panel/app/(dashboard)/[module]/page.tsx`, with data in `packages/demo-data/src/overviews.ts`.

## Design rules

The design direction is in `DESIGN.md`. In short:

- Use only semantic tokens (`bg-surface`, `text-fg-muted`, `border-hairline`, `bg-accent` ...). Do not use raw colors in components.
- Use logical utilities only (`ms-`, `pe-`, `start-`, `end-`). Never use `left`/`right`, except for centering.
- Format every number and date with `@varzino/utils`. Put signed values and Latin text in `<bdi dir="ltr">`.
- Server components cannot pass functions to client components. Charts take a `valueFormat` preset (`"number" | "toman" | "percent" | "decimal"`) instead of a formatter function.

## Dark theme later

Add a `[data-theme="dark"]` block in `packages/ui/src/styles/tokens.css` that redefines the same variables, and switch `data-theme` on `<html>`. Components do not need to change.

## Design skills

The project-scoped Claude Code skills are in `.claude/skills`: `unslop` (by @heydamir, CC BY 4.0), `ui-ux-pro-max`, and Anthropic's `frontend-design`.

## Deploy with Docker Compose

```bash
git clone https://github.com/mjkohan/varzino-frontend.git && cd varzino-frontend
cp .env.example .env      # set LANDING_URL / PANEL_URL to the public addresses
docker compose up -d --build
```

The landing page listens on `LANDING_PORT` (default 3000) and the panel on `PANEL_PORT` (default 3001). One `Dockerfile` builds either app (`--build-arg APP=landing|panel`) with `turbo prune` and Next.js standalone output.
