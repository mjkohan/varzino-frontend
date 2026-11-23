# Varzino design direction

Written before building, following the unslop and frontend-design skills in `.claude/skills/`.

- **Product.** One system where a sport federation and its provincial boards run members, competitions, rankings, courses, licenses and money.
- **Character.** Exact, official, athletic.
- **World.** The competition hall and the federation registry: mat lines, the scoreboard, the membership card with its code and stamp.
- **Moments.** Landing: a live competition view (bracket, schedule, medal table) and a membership card object rendered in code. Panel: the registrations chart on the dashboard and the bracket on the competition page.
- **Signature.** The code chip. Every membership code, license number and letter number sits in a small bordered chip with tabular Persian digits, like a bib number. Used only for identifiers.

## Tokens

- Neutrals: one cool graphite ramp. Surfaces stay neutral in the panel; the landing may tint darker in one band.
- Accent: court green `#0E7A5A` (white text 5.3:1). Darker ink `#0A5C44` when the accent is text on a light surface.
- Medals (charts and ranking only): gold `#B8860B`, silver `#8A949A`, bronze `#A0612F`.
- Semantic: positive `#15803D`, warning `#B45309`, negative `#DC2626`, info `#2B59C3`, used only for meaning.
- Type: IRANYekanX, weights 400/500/600. Body 15px / 1.75. Letter spacing 0 on Persian, always.
- Radius: control 8, card 14, panel 18. Spacing on the 4px grid.
- Motion: one curve `cubic-bezier(0.22, 1, 0.36, 1)`; 150ms feedback, 200ms menus, 400ms entrances.

## Rules

- RTL first: logical utilities only (`ms-`, `pe-`, `start-`), directional icons mirrored with `.icon-dir`.
- Persian digits everywhere via `@varzino/utils` formatters; signed changes in `<bdi dir="ltr">`.
- Light theme only for now. Components use semantic CSS variables, so a dark theme is one `[data-theme="dark"]` block in `packages/ui/src/styles/tokens.css`.
