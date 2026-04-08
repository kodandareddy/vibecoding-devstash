// Mock data for the dashboard UI. Replace with real DB queries later.

export type ContentType = "TEXT" | "FILE" | "URL";

export interface MockUser {
  id: string;
  name: string;
  email: string;
  image: string | null;
  isPro: boolean;
}

export interface MockItemType {
  id: string;
  name: string;
  icon: string; // Lucide icon name
  color: string; // hex
  contentType: ContentType;
  isPro: boolean;
}

export interface MockItem {
  id: string;
  title: string;
  description: string;
  itemTypeId: string;
  contentType: ContentType;
  content: string | null;
  url: string | null;
  language: string | null;
  tags: string[];
  collectionIds: string[];
  isFavorite: boolean;
  isPinned: boolean;
  createdAt: string;
}

export interface MockCollection {
  id: string;
  name: string;
  description: string;
  itemCount: number;
  isFavorite: boolean;
  defaultTypeId: string;
  // Icon types shown on the collection card
  previewTypeIds: string[];
}

// ─── Current User ────────────────────────────────────────────────────────────

export const currentUser: MockUser = {
  id: "user_1",
  name: "John Doe",
  email: "john@example.com",
  image: null,
  isPro: true,
};

// ─── Item Types (System) ─────────────────────────────────────────────────────

export const itemTypes: MockItemType[] = [
  { id: "type_snippet", name: "Snippets", icon: "Code",       color: "#3b82f6", contentType: "TEXT", isPro: false },
  { id: "type_prompt",  name: "Prompts",  icon: "Sparkles",   color: "#8b5cf6", contentType: "TEXT", isPro: false },
  { id: "type_command", name: "Commands", icon: "Terminal",   color: "#f97316", contentType: "TEXT", isPro: false },
  { id: "type_note",    name: "Notes",    icon: "StickyNote", color: "#fde047", contentType: "TEXT", isPro: false },
  { id: "type_file",    name: "Files",    icon: "File",       color: "#6b7280", contentType: "FILE", isPro: true  },
  { id: "type_image",   name: "Images",   icon: "Image",      color: "#ec4899", contentType: "FILE", isPro: true  },
  { id: "type_link",    name: "Links",    icon: "Link",       color: "#10b981", contentType: "URL",  isPro: false },
];

// Counts shown next to each type in the sidebar
export const itemTypeCounts: Record<string, number> = {
  type_snippet: 24,
  type_prompt: 18,
  type_command: 15,
  type_note: 12,
  type_file: 5,
  type_image: 3,
  type_link: 9,
};

// ─── Collections ─────────────────────────────────────────────────────────────

export const collections: MockCollection[] = [
  {
    id: "col_react",
    name: "React Patterns",
    description: "Common React patterns and hooks",
    itemCount: 12,
    isFavorite: true,
    defaultTypeId: "type_snippet",
    previewTypeIds: ["type_snippet", "type_note", "type_link"],
  },
  {
    id: "col_python",
    name: "Python Snippets",
    description: "Useful Python code snippets",
    itemCount: 8,
    isFavorite: false,
    defaultTypeId: "type_snippet",
    previewTypeIds: ["type_snippet", "type_command"],
  },
  {
    id: "col_context",
    name: "Context Files",
    description: "AI context files for projects",
    itemCount: 5,
    isFavorite: true,
    defaultTypeId: "type_file",
    previewTypeIds: ["type_file", "type_note"],
  },
  {
    id: "col_interview",
    name: "Interview Prep",
    description: "Technical interview preparation",
    itemCount: 24,
    isFavorite: false,
    defaultTypeId: "type_note",
    previewTypeIds: ["type_note", "type_snippet", "type_link"],
  },
  {
    id: "col_git",
    name: "Git Commands",
    description: "Frequently used git commands",
    itemCount: 15,
    isFavorite: true,
    defaultTypeId: "type_command",
    previewTypeIds: ["type_command"],
  },
  {
    id: "col_ai_prompts",
    name: "AI Prompts",
    description: "Curated AI prompts for coding",
    itemCount: 18,
    isFavorite: false,
    defaultTypeId: "type_prompt",
    previewTypeIds: ["type_prompt"],
  },
];

// ─── Items ───────────────────────────────────────────────────────────────────

export const items: MockItem[] = [
  {
    id: "item_1",
    title: "useAuth Hook",
    description: "Custom authentication hook for React applications",
    itemTypeId: "type_snippet",
    contentType: "TEXT",
    content:
      "export function useAuth() {\n  const [user, setUser] = useState(null);\n  // ...\n  return { user };\n}",
    url: null,
    language: "typescript",
    tags: ["react", "auth", "hooks"],
    collectionIds: ["col_react"],
    isFavorite: true,
    isPinned: true,
    createdAt: "2026-01-10",
  },
  {
    id: "item_2",
    title: "API Error Handling Pattern",
    description: "Fetch wrapper with exponential backoff retry logic",
    itemTypeId: "type_snippet",
    contentType: "TEXT",
    content:
      "async function fetchWithRetry(url: string, retries = 3) {\n  // ...\n}",
    url: null,
    language: "typescript",
    tags: ["api", "error-handling", "fetch"],
    collectionIds: ["col_react"],
    isFavorite: false,
    isPinned: true,
    createdAt: "2026-01-10",
  },
  {
    id: "item_3",
    title: "Code Review Prompt",
    description: "Detailed prompt for AI-powered code reviews",
    itemTypeId: "type_prompt",
    contentType: "TEXT",
    content: "You are an expert code reviewer. Review the following code...",
    url: null,
    language: null,
    tags: ["ai", "code-review"],
    collectionIds: ["col_ai_prompts"],
    isFavorite: true,
    isPinned: false,
    createdAt: "2026-01-08",
  },
  {
    id: "item_4",
    title: "Reset local branch to remote",
    description: "Hard reset current branch to match origin",
    itemTypeId: "type_command",
    contentType: "TEXT",
    content: "git fetch origin && git reset --hard origin/main",
    url: null,
    language: "bash",
    tags: ["git"],
    collectionIds: ["col_git"],
    isFavorite: false,
    isPinned: false,
    createdAt: "2026-01-05",
  },
  {
    id: "item_5",
    title: "Next.js 16 Docs",
    description: "Official Next.js documentation",
    itemTypeId: "type_link",
    contentType: "URL",
    content: null,
    url: "https://nextjs.org/docs",
    language: null,
    tags: ["nextjs", "docs"],
    collectionIds: ["col_react"],
    isFavorite: false,
    isPinned: false,
    createdAt: "2026-01-04",
  },
  {
    id: "item_6",
    title: "Big-O Cheatsheet",
    description: "Time complexity reference for common algorithms",
    itemTypeId: "type_note",
    contentType: "TEXT",
    content: "# Big-O\n- Array access: O(1)\n- Binary search: O(log n)\n...",
    url: null,
    language: null,
    tags: ["algorithms", "interview"],
    collectionIds: ["col_interview"],
    isFavorite: false,
    isPinned: false,
    createdAt: "2026-01-02",
  },
];
