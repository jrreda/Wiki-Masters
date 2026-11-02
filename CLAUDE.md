# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

Package manager is **pnpm** (`pnpm-lock.yaml`).

```bash
pnpm dev       # Next.js dev server on http://localhost:3000
pnpm build     # production build (also the main type-check)
pnpm lint      # biome check (lint + format check + import sorting)
pnpm format    # biome format --write
pnpm exec biome check --write <path>   # auto-fix lint/format/imports for a file
```

There is no test runner set up yet.

## Stack and non-obvious config

- **Next.js 16 (App Router) + React 19**, source under `src/`, path alias `@/*` → `src/*`. Next 16 differs from older versions — check `node_modules/next/dist/docs/` before using Next APIs.
- `next.config.ts` enables `cacheComponents`, `partialPrefetching`, and `reactCompiler`. With the React Compiler on, don't add manual `useMemo`/`useCallback` for performance. With Cache Components on, dynamic data access in server components needs `<Suspense>` boundaries or `"use cache"`.
- Page/layout props use Next's generated global types, e.g. `LayoutProps<"/">` / `PageProps<"/wiki/[id]">`.
- **Tailwind CSS v4**, CSS-first config in `src/app/globals.css` (no `tailwind.config`), wired through a Turbopack loader rule in `next.config.ts`.
- **Biome** replaces ESLint/Prettier (2-space indent, Next + React recommended rule domains, organize-imports on).
- **shadcn/ui** with the `base-nova` style, built on **Base UI** (`@base-ui/react`), not Radix — component APIs (e.g. `render` prop instead of `asChild`) follow Base UI. Add components with `pnpm dlx shadcn add <name>`; they land in `src/components/ui/`. `cn` is re-exported from the `cn` package in `src/lib/utils.ts`. Icons: `lucide-react`.

## Architecture

Wikimasters is an early-stage wiki/article site.

- `src/app/layout.tsx` — root layout; renders the global `NavBar` (`src/components/nav-bar.tsx`) above every page.
- `src/app/page.tsx` — home page listing articles as `WikiCard`s (currently hardcoded data) linking to `/wiki/[id]`.
- Planned but not yet implemented: `/wiki/[id]`, `/wiki/new`, `/wiki/[id]/edit` routes.
- **Auth** is Neon Auth (managed Better Auth) via `@neon/auth` — Neon hosts the auth server, so never call `betterAuth()`, add a DB adapter, or pass `plugins`. Pieces:
  - `src/lib/auth/server.ts` — `auth` instance (`createNeonAuth`, env `NEON_AUTH_BASE_URL` + `NEON_AUTH_COOKIE_SECRET`); `src/lib/auth/client.ts` — browser `authClient`.
  - `src/app/api/auth/[...path]/route.ts` — proxies auth requests to Neon.
  - `src/proxy.ts` — `auth.middleware()` redirects signed-out users to `/auth/sign-in`; its `matcher` lists protected routes. It's only an optimistic check: server actions/route handlers that mutate data must call `auth.getSession()` and reject when `session?.user` is missing.
  - `src/app/auth/actions.ts` — sign-in/up/out server actions used by `/auth/sign-in`, `/auth/sign-up` (shared `AuthForm` component) and the `NavBar`.
  - With Cache Components, a server component reading the session must sit under `<Suspense>` and `await connection()` before `auth.getSession()` (otherwise the SDK logs prerender bail-outs as errors) — see `AuthControls` in `nav-bar.tsx`. Don't use `export const dynamic`.
- Data: `.env` defines `DATABASE_URL`, `DATABASE_URL_POOLED` (Neon Postgres); no DB code exists yet. The folder is linked (git-ignored `.neon`) to Neon project `wikimasters` (`cold-fire-14567999`, branch `production`), so `neon` CLI commands need no `--project-id`. `.env` is maintained by hand; pass `--no-env-pull` to `neon link`/`neon checkout` to avoid overwriting it.
