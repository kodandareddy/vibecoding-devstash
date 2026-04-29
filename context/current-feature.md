# Current Feature

Seed Sample Data

## Status

Completed

## Goals

- Extend `prisma/seed.ts` to populate the dev database with realistic sample data
- Create a demo user (`demo@devstash.io`, name "Demo User", password `12345678` hashed via bcryptjs at 12 rounds, `isPro: false`, `emailVerified: now`)
- Ensure all 7 system item types are seeded (snippet, prompt, command, note, file, image, link)
- Create 5 collections with the items defined in the spec: React Patterns, AI Workflows, DevOps, Terminal Commands, Design Resources
- Use real URLs for link items; seed must be idempotent (safe to re-run)

## Notes

- Full spec: @context/features/seed-spec.md
- Add `bcryptjs` (and `@types/bcryptjs`) for password hashing
- Reuse existing `npm run db:seed` script — no new migration needed
- Items reference `ItemType` by name lookup; collections wire items via `ItemCollection`
- All seeded items belong to the demo user
- Use `upsert` on stable keys (email for User, name+userId for Collection, etc.) for idempotency

## History

- 2026-04-02: Initial setup of Next.js 16 with TypeScript, Tailwind CSS v4, ESLint, and shadcn/ui configured
- 2026-04-09: Completed Dashboard UI Phase 1 — shadcn/ui init, dark mode default, dashboard route with top bar (search + new item button), sidebar and main area placeholders
- 2026-04-10: Completed Dashboard UI Phase 2 — collapsible sidebar with icon rail, item types with colored icons and counts, recent items section, collections with favorites/all and toggle, user avatar area, mobile drawer, smooth width transitions
- 2026-04-14: Completed Dashboard UI Phase 3 — stats cards, collections grid with colored left borders, pinned items, recent items, Inter font, badge and card components
- 2026-04-28: Completed Prisma + Neon PostgreSQL setup — Prisma 7 with pg adapter, full schema (User, NextAuth models, ItemType, Item, Collection, Tag, joins), initial migration `20260414122236_init` applied to Neon, seed script for system item types, `scripts/test-db.ts` connectivity test, `db:*` npm scripts
- 2026-04-29: Completed sample data seed — bcryptjs demo user (`demo@devstash.io`), 5 collections and 18 items (4 snippets, 3 prompts, 5 commands, 6 links) per `seed-spec.md`, idempotent on re-run; `scripts/test-db.ts` extended to print user, collections, item-type breakdown, and sample item previews
