import "dotenv/config";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";
import { ContentType, PrismaClient } from "../src/generated/prisma/client";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const DEMO_EMAIL = "demo@devstash.io";

const systemItemTypes = [
  { name: "snippet", icon: "Code", color: "#3b82f6" },
  { name: "prompt", icon: "Sparkles", color: "#8b5cf6" },
  { name: "command", icon: "Terminal", color: "#f97316" },
  { name: "note", icon: "StickyNote", color: "#fde047" },
  { name: "file", icon: "File", color: "#6b7280" },
  { name: "image", icon: "Image", color: "#ec4899" },
  { name: "link", icon: "Link", color: "#10b981" },
];

type ItemSeed = {
  title: string;
  type: "snippet" | "prompt" | "command" | "note" | "link";
  description?: string;
  language?: string;
  content?: string;
  url?: string;
};

type CollectionSeed = {
  name: string;
  description: string;
  defaultType: string;
  items: ItemSeed[];
};

const collections: CollectionSeed[] = [
  {
    name: "React Patterns",
    description: "Reusable React patterns and hooks",
    defaultType: "snippet",
    items: [
      {
        title: "useDebounce hook",
        type: "snippet",
        language: "typescript",
        description: "Debounce a value across renders.",
        content: `import { useEffect, useState } from "react";

export function useDebounce<T>(value: T, delay = 300): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return debounced;
}
`,
      },
      {
        title: "ThemeContext provider",
        type: "snippet",
        language: "typescript",
        description: "Light/dark theme context with localStorage persistence.",
        content: `"use client";
import { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark";
const ThemeContext = createContext<{
  theme: Theme;
  toggle: () => void;
} | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("dark");
  useEffect(() => {
    const saved = (localStorage.getItem("theme") as Theme) ?? "dark";
    setTheme(saved);
    document.documentElement.classList.toggle("dark", saved === "dark");
  }, []);
  const toggle = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    localStorage.setItem("theme", next);
    document.documentElement.classList.toggle("dark", next === "dark");
  };
  return (
    <ThemeContext.Provider value={{ theme, toggle }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used inside ThemeProvider");
  return ctx;
};
`,
      },
      {
        title: "cn() className utility",
        type: "snippet",
        language: "typescript",
        description: "Merge Tailwind classes with conflict resolution.",
        content: `import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
`,
      },
    ],
  },
  {
    name: "AI Workflows",
    description: "AI prompts and workflow automations",
    defaultType: "prompt",
    items: [
      {
        title: "Code review prompt",
        type: "prompt",
        description: "Reviews a diff for bugs, security, and style.",
        content: `You are a senior engineer reviewing a pull request. For the diff below:
1. Flag bugs, race conditions, and security issues with line references.
2. Note any patterns that conflict with the existing codebase conventions.
3. Suggest at most 3 high-impact improvements — skip nitpicks.
Be concise. If nothing is wrong, say so.

DIFF:
---
{{diff}}
`,
      },
      {
        title: "Documentation generator",
        type: "prompt",
        description: "Generates README sections from source code.",
        content: `Read the source file below and produce:
- A one-paragraph summary of what it does.
- A "Usage" section with a minimal runnable example.
- A "Parameters" table for any exported function (name, type, description).
Output GitHub-flavored markdown. Do not invent behavior the code does not have.

SOURCE:
---
{{source}}
`,
      },
      {
        title: "Refactor assistant",
        type: "prompt",
        description: "Proposes a refactor with tradeoffs explained.",
        content: `Refactor the code below for {{goal}} (e.g. readability, performance, testability).
Rules:
- Preserve external behavior exactly.
- Explain the tradeoff of your approach in 2-3 sentences.
- Output the refactored code in a single block.

CODE:
---
{{code}}
`,
      },
    ],
  },
  {
    name: "DevOps",
    description: "Infrastructure and deployment resources",
    defaultType: "snippet",
    items: [
      {
        title: "Multi-stage Node Dockerfile",
        type: "snippet",
        language: "dockerfile",
        description: "Production Dockerfile for a Next.js app.",
        content: `FROM node:22-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

FROM node:22-alpine AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app/.next ./.next
COPY --from=build /app/public ./public
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package.json ./package.json
EXPOSE 3000
CMD ["npm", "start"]
`,
      },
      {
        title: "Deploy to Vercel from CLI",
        type: "command",
        description: "Production deploy with explicit project and env.",
        content: "vercel --prod --yes --token $VERCEL_TOKEN",
      },
      {
        title: "Vercel deployment docs",
        type: "link",
        description: "Official Vercel deployment reference.",
        url: "https://vercel.com/docs/deployments/overview",
      },
      {
        title: "GitHub Actions for Node.js",
        type: "link",
        description: "Workflow templates for Node CI/CD.",
        url: "https://docs.github.com/en/actions/automating-builds-and-tests/building-and-testing-nodejs",
      },
    ],
  },
  {
    name: "Terminal Commands",
    description: "Useful shell commands for everyday development",
    defaultType: "command",
    items: [
      {
        title: "Undo last commit (keep changes)",
        type: "command",
        description: "Resets HEAD back one commit, leaves working tree intact.",
        content: "git reset --soft HEAD~1",
      },
      {
        title: "Remove all stopped Docker containers",
        type: "command",
        description: "Frees up space by pruning exited containers.",
        content: "docker container prune -f",
      },
      {
        title: "Find process listening on a port",
        type: "command",
        description: "Show the PID using a given TCP port (macOS/Linux).",
        content: "lsof -nP -iTCP:3000 -sTCP:LISTEN",
      },
      {
        title: "Update all global npm packages",
        type: "command",
        description: "Lists outdated globals, then updates them.",
        content: "npm outdated -g --depth=0 && npm update -g",
      },
    ],
  },
  {
    name: "Design Resources",
    description: "UI/UX resources and references",
    defaultType: "link",
    items: [
      {
        title: "Tailwind CSS docs",
        type: "link",
        description: "Utility-first CSS framework reference.",
        url: "https://tailwindcss.com/docs",
      },
      {
        title: "shadcn/ui",
        type: "link",
        description: "Copy-paste accessible React components.",
        url: "https://ui.shadcn.com",
      },
      {
        title: "Material Design 3",
        type: "link",
        description: "Google's design system specification.",
        url: "https://m3.material.io",
      },
      {
        title: "Lucide icons",
        type: "link",
        description: "Open-source icon set used by shadcn/ui.",
        url: "https://lucide.dev",
      },
    ],
  },
];

function contentTypeFor(type: ItemSeed["type"]): ContentType {
  return type === "link" ? ContentType.URL : ContentType.TEXT;
}

async function main() {
  console.log("Seeding system item types...");
  for (const t of systemItemTypes) {
    await prisma.itemType.upsert({
      where: { id: t.name },
      update: { icon: t.icon, color: t.color },
      create: {
        id: t.name,
        name: t.name,
        icon: t.icon,
        color: t.color,
        isSystem: true,
      },
    });
    console.log(`  ✓ ${t.name}`);
  }

  console.log("\nSeeding demo user...");
  const passwordHash = await bcrypt.hash("12345678", 12);
  const user = await prisma.user.upsert({
    where: { email: DEMO_EMAIL },
    update: {
      name: "Demo User",
      password: passwordHash,
      isPro: false,
      emailVerified: new Date(),
    },
    create: {
      email: DEMO_EMAIL,
      name: "Demo User",
      password: passwordHash,
      isPro: false,
      emailVerified: new Date(),
    },
  });
  console.log(`  ✓ ${user.email}`);

  console.log("\nResetting demo user's collections and items...");
  await prisma.item.deleteMany({ where: { userId: user.id } });
  await prisma.collection.deleteMany({ where: { userId: user.id } });

  console.log("\nSeeding collections and items...");
  for (const col of collections) {
    const collection = await prisma.collection.create({
      data: {
        name: col.name,
        description: col.description,
        userId: user.id,
        defaultTypeId: col.defaultType,
      },
    });
    console.log(`  📁 ${collection.name}`);

    for (const item of col.items) {
      const created = await prisma.item.create({
        data: {
          title: item.title,
          contentType: contentTypeFor(item.type),
          content: item.content ?? null,
          url: item.url ?? null,
          description: item.description ?? null,
          language: item.language ?? null,
          userId: user.id,
          itemTypeId: item.type,
          collections: {
            create: { collectionId: collection.id },
          },
        },
      });
      console.log(`    • [${item.type}] ${created.title}`);
    }
  }

  console.log("\n✓ Seeding complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
