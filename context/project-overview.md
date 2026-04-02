# DevStash — Project Overview

> **One fast, searchable, AI-enhanced hub for all dev knowledge & resources.**

---

## Table of Contents

- [Problem Statement](#problem-statement)
- [Target Users](#target-users)
- [Tech Stack](#tech-stack)
- [Features](#features)
- [Item Types](#item-types)
- [Data Models & Prisma Schema](#data-models--prisma-schema)
- [Database Diagram](#database-diagram)
- [Monetization](#monetization)
- [UI/UX Guidelines](#uiux-guidelines)
- [Folder Structure](#folder-structure)
- [Key Rules & Constraints](#key-rules--constraints)

---

## Problem Statement

Developers scatter their essentials across too many tools:

| What | Where it lives today |
|---|---|
| Code snippets | VS Code, Notion |
| AI prompts | Chat histories |
| Context files | Buried in projects |
| Useful links | Browser bookmarks |
| Docs & notes | Random folders |
| Commands | `.txt` files, bash history |
| Templates | GitHub Gists |

**Result:** Context switching, lost knowledge, inconsistent workflows.

**DevStash solves this** by providing one unified, fast, and searchable hub — enhanced with AI.

---

## Target Users

| User Type | Primary Need |
|---|---|
| **Everyday Developer** | Quickly grab snippets, prompts, commands, links |
| **AI-first Developer** | Save prompts, system messages, workflows, contexts |
| **Content Creator / Educator** | Store code blocks, explanations, course notes |
| **Full-stack Builder** | Collect patterns, boilerplates, API examples |

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | Next.js 16 / React 19 (SSR + API routes) |
| **Language** | TypeScript |
| **Database** | Neon PostgreSQL |
| **ORM** | Prisma 7 (migrations only — never `db push`) |
| **Cache** | Redis (TBD) |
| **Auth** | NextAuth v5 (Email/password + GitHub OAuth) |
| **File Storage** | Cloudflare R2 |
| **AI** | OpenAI `gpt-4o-mini` |
| **Styling** | Tailwind CSS v4 + shadcn/ui |
| **Payments** | Stripe |

> ⚠️ **DB Rule:** Never use `prisma db push` or modify the DB directly. Always create migrations and run them in dev before prod.

---

## Features

### A. Items & Item Types

Items are the core unit of DevStash. Each item has a **type** that defines how it's displayed and stored.

- Items are quick to create and access via a **slide-in drawer**
- URL pattern: `/items/snippets`, `/items/prompts`, etc.
- Content types: `text`, `url`, or `file`

#### System Item Types (cannot be modified)

| Type | Icon | Color | Hex | Content Type | Plan |
|---|---|---|---|---|---|
| `snippet` | `<Code />` | Blue | `#3b82f6` | text | Free |
| `prompt` | `<Sparkles />` | Purple | `#8b5cf6` | text | Free |
| `note` | `<StickyNote />` | Yellow | `#fde047` | text | Free |
| `command` | `<Terminal />` | Orange | `#f97316` | text | Free |
| `link` | `<Link />` | Emerald | `#10b981` | url | Free |
| `file` | `<File />` | Gray | `#6b7280` | file | **Pro** |
| `image` | `<Image />` | Pink | `#ec4899` | file | **Pro** |

> Users can create **custom types** (Pro — coming later).

---

### B. Collections

- Users create named collections (e.g., "React Patterns", "Context Files")
- Items can belong to **multiple collections** (many-to-many)
- Collections have a `defaultTypeId` for new items
- Examples: `React Patterns` (snippets, notes), `Python Snippets`, `Interview Prep`

---

### C. Search

Full-text search across:
- Item **title**
- Item **content**
- **Tags**
- **Type**

---

### D. Authentication

- Email + password
- GitHub OAuth
- Powered by **NextAuth v5**

---

### E. Core Features

- ⭐ Favorite collections and items
- 📌 Pin items to top
- 🕐 Recently used items
- 📥 Import code from a file
- ✏️ Markdown editor for text types
- 📎 File upload for file/image types
- 📤 Export data (JSON / ZIP) — Pro
- 🌙 Dark mode default, light mode optional
- ➕ Add/remove items to/from multiple collections
- 🔍 View which collections an item belongs to

---

### F. AI Features (Pro Only)

| Feature | Description |
|---|---|
| **Auto-tag suggestions** | AI suggests relevant tags on item creation |
| **AI Summary** | Summarise any item's content |
| **Explain This Code** | Explain a snippet in plain English |
| **Prompt Optimizer** | Improve and refine saved AI prompts |

> During development, all users have access to all features including Pro/AI.

---

## Data Models & Prisma Schema

```prisma
// schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ─── User ───────────────────────────────────────────────────────────────────

model User {
  id                    String       @id @default(cuid())
  name                  String?
  email                 String?      @unique
  emailVerified         DateTime?
  image                 String?
  password              String?      // hashed, null for OAuth users
  isPro                 Boolean      @default(false)
  stripeCustomerId      String?      @unique
  stripeSubscriptionId  String?      @unique
  createdAt             DateTime     @default(now())
  updatedAt             DateTime     @updatedAt

  accounts    Account[]
  sessions    Session[]
  items       Item[]
  itemTypes   ItemType[]
  collections Collection[]
  tags        Tag[]
}

// ─── NextAuth Models ─────────────────────────────────────────────────────────

model Account {
  id                String  @id @default(cuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String?
  access_token      String?
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String?
  session_state     String?

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerAccountId])
}

model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model VerificationToken {
  identifier String
  token      String   @unique
  expires    DateTime

  @@unique([identifier, token])
}

// ─── ItemType ────────────────────────────────────────────────────────────────

model ItemType {
  id       String  @id @default(cuid())
  name     String  // "snippet", "prompt", "note", etc.
  icon     String  // Lucide icon name e.g. "Code", "Sparkles"
  color    String  // Hex color e.g. "#3b82f6"
  isSystem Boolean @default(false)

  userId String?
  user   User?    @relation(fields: [userId], references: [id], onDelete: Cascade)
  // userId is null for system types

  items             Item[]
  collectionDefault Collection[]
}

// ─── Item ─────────────────────────────────────────────────────────────────────

model Item {
  id          String      @id @default(cuid())
  title       String
  contentType ContentType // TEXT | FILE | URL
  content     String?     // text content, null if file
  fileUrl     String?     // Cloudflare R2 URL
  fileName    String?     // original filename
  fileSize    Int?        // bytes
  url         String?     // for link types
  description String?
  language    String?     // e.g. "typescript", "python" — for snippets
  isFavorite  Boolean     @default(false)
  isPinned    Boolean     @default(false)
  lastUsedAt  DateTime?
  createdAt   DateTime    @default(now())
  updatedAt   DateTime    @updatedAt

  userId     String
  user       User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  itemTypeId String
  itemType   ItemType @relation(fields: [itemTypeId], references: [id])

  tags        TagsOnItems[]
  collections ItemCollection[]
}

enum ContentType {
  TEXT
  FILE
  URL
}

// ─── Collection ──────────────────────────────────────────────────────────────

model Collection {
  id            String   @id @default(cuid())
  name          String
  description   String?
  isFavorite    Boolean  @default(false)
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  userId        String
  user          User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  defaultTypeId String?
  defaultType   ItemType? @relation(fields: [defaultTypeId], references: [id])

  items ItemCollection[]
}

// ─── ItemCollection (Join Table) ─────────────────────────────────────────────

model ItemCollection {
  itemId       String
  collectionId String
  addedAt      DateTime @default(now())

  item       Item       @relation(fields: [itemId], references: [id], onDelete: Cascade)
  collection Collection @relation(fields: [collectionId], references: [id], onDelete: Cascade)

  @@id([itemId, collectionId])
}

// ─── Tag ─────────────────────────────────────────────────────────────────────

model Tag {
  id     String @id @default(cuid())
  name   String
  userId String
  user   User   @relation(fields: [userId], references: [id], onDelete: Cascade)

  items TagsOnItems[]

  @@unique([name, userId])
}

// ─── TagsOnItems (Join Table) ─────────────────────────────────────────────────

model TagsOnItems {
  itemId String
  tagId  String

  item Item @relation(fields: [itemId], references: [id], onDelete: Cascade)
  tag  Tag  @relation(fields: [tagId], references: [id], onDelete: Cascade)

  @@id([itemId, tagId])
}
```

---

## Database Diagram

```
User
 ├── Account[]          (NextAuth OAuth)
 ├── Session[]          (NextAuth sessions)
 ├── ItemType[]         (custom types; system types have userId = null)
 ├── Item[]
 │    ├── ItemType      (type of item)
 │    ├── TagsOnItems[] ──► Tag
 │    └── ItemCollection[] ──► Collection
 └── Collection[]
      └── ItemCollection[] ──► Item

ItemType (system)
 └── Item[] (shared across all users)
```

---

## Monetization

### Free Plan

| Limit | Value |
|---|---|
| Items | 50 total |
| Collections | 3 |
| Item types | All system types except `file` and `image` |
| Search | Basic |
| File uploads | ❌ |
| AI features | ❌ |
| Export | ❌ |

### Pro Plan — $8/month or $72/year

| Feature | Value |
|---|---|
| Items | Unlimited |
| Collections | Unlimited |
| File & Image uploads | ✅ |
| Custom types | ✅ (coming later) |
| AI auto-tagging | ✅ |
| AI code explanation | ✅ |
| AI prompt optimizer | ✅ |
| Export (JSON / ZIP) | ✅ |
| Priority support | ✅ |

> 💡 During development, all users have access to all Pro features.

---

## UI/UX Guidelines

### Design Principles

- Modern, minimal, developer-focused
- **Dark mode default**, light mode optional
- Clean typography, generous whitespace
- Subtle borders and shadows
- References: **Notion**, **Linear**, **Raycast**
- Syntax highlighting on all code blocks

### Layout

```
┌──────────────────────────────────────────────┐
│  Sidebar (collapsible)  │  Main Content       │
│                         │                     │
│  Item Types             │  Collection Cards   │
│  ├── Snippets           │  (color-coded by    │
│  ├── Prompts            │   dominant type)    │
│  ├── Commands           │                     │
│  ├── Notes              │  Item Cards         │
│  ├── Links              │  (color-coded       │
│  └── Files (Pro)        │   border by type)   │
│                         │                     │
│  Collections (latest)   │                     │
│                         │                     │
└─────────────────────────┴─────────────────────┘
```

- Individual items open in a **slide-in drawer**
- Sidebar collapses to a drawer on **mobile**

### Color Reference

| Type | Color | Hex |
|---|---|---|
| Snippet | 🔵 Blue | `#3b82f6` |
| Prompt | 🟣 Purple | `#8b5cf6` |
| Command | 🟠 Orange | `#f97316` |
| Note | 🟡 Yellow | `#fde047` |
| File | ⬜ Gray | `#6b7280` |
| Image | 🩷 Pink | `#ec4899` |
| Link | 🟢 Emerald | `#10b981` |

### Micro-interactions

- Smooth CSS transitions on all interactive elements
- Hover states on cards
- Toast notifications for all user actions
- Loading skeletons while data fetches

---

## Folder Structure

```
devstash/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   └── register/
│   ├── (dashboard)/
│   │   ├── items/
│   │   │   └── [type]/        # /items/snippets, /items/prompts etc.
│   │   ├── collections/
│   │   │   └── [id]/
│   │   └── layout.tsx         # sidebar layout
│   └── api/
│       ├── auth/              # NextAuth routes
│       ├── items/
│       ├── collections/
│       ├── tags/
│       ├── upload/            # R2 file uploads
│       └── ai/                # AI feature routes
├── components/
│   ├── ui/                    # shadcn/ui components
│   ├── items/
│   ├── collections/
│   └── drawers/
├── lib/
│   ├── prisma.ts
│   ├── auth.ts
│   ├── r2.ts
│   └── openai.ts
├── prisma/
│   ├── schema.prisma
│   ├── migrations/
│   └── seed.ts                # seeds system item types
└── types/
    └── index.ts
```

---

## Key Rules & Constraints

- 🚫 **Never use `prisma db push`** — always create proper migrations
- 🚫 **Never modify system item types** — they are seeded and locked
- ✅ **Direct plans only** in DB — no `db push` in prod
- ✅ **All AI features gated behind `isPro`** (bypassed in dev)
- ✅ **File uploads (R2) gated behind `isPro`**
- ✅ **Migrations run in dev first, then prod**
- ✅ **Dark mode is the default** — light mode is opt-in
- ✅ **Drawer pattern** for item creation and viewing — keeps context without full navigation

---

*Last updated: March 2026*
