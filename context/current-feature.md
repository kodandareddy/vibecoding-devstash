# Current Feature

Prisma + Neon PostgreSQL Setup

## Status

Completed

## Goals

- Set up Prisma ORM with Neon PostgreSQL (serverless)
- Create initial schema based on data models in project-overview.md
- Include NextAuth models (Account, Session, VerificationToken)
- Add appropriate indexes and cascade deletes
- Use Prisma 7 (with breaking changes from v6)
- Create proper migrations (never use db push)

## Notes

- Use Neon PostgreSQL serverless database
- Development branch for DATABASE_URL, separate production branch
- Always create migrations, never push directly unless specified
- Full spec: @context/features/database-spec.md
- Prisma 7 upgrade guide: https://www.prisma.io/docs/orm/more/upgrade-guides/upgrading-versions/upgrading-to-prisma-7
- Prisma setup guide: https://www.prisma.io/docs/getting-started/prisma-orm/quickstart/prisma-postgres

## History

- 2026-04-02: Initial setup of Next.js 16 with TypeScript, Tailwind CSS v4, ESLint, and shadcn/ui configured
- 2026-04-09: Completed Dashboard UI Phase 1 — shadcn/ui init, dark mode default, dashboard route with top bar (search + new item button), sidebar and main area placeholders
- 2026-04-10: Completed Dashboard UI Phase 2 — collapsible sidebar with icon rail, item types with colored icons and counts, recent items section, collections with favorites/all and toggle, user avatar area, mobile drawer, smooth width transitions
- 2026-04-14: Completed Dashboard UI Phase 3 — stats cards, collections grid with colored left borders, pinned items, recent items, Inter font, badge and card components
- 2026-04-28: Completed Prisma + Neon PostgreSQL setup — Prisma 7 with pg adapter, full schema (User, NextAuth models, ItemType, Item, Collection, Tag, joins), initial migration `20260414122236_init` applied to Neon, seed script for system item types, `scripts/test-db.ts` connectivity test, `db:*` npm scripts
