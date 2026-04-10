"use client";

import Link from "next/link";
import {
  Code,
  Sparkles,
  Terminal,
  StickyNote,
  File,
  Image,
  LinkIcon,
  Star,
  FolderClosed,
  Settings,
  PanelLeft,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  itemTypes,
  itemTypeCounts,
  collections,
  items,
  currentUser,
} from "@/lib/mock-data";
import { createContext, useContext, useState } from "react";

const iconMap: Record<string, React.ElementType> = {
  Code,
  Sparkles,
  Terminal,
  StickyNote,
  File,
  Image,
  Link: LinkIcon,
};

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}

interface SidebarContextValue {
  collapsed: boolean;
  setCollapsed: (value: boolean) => void;
}

const SidebarContext = createContext<SidebarContextValue>({
  collapsed: false,
  setCollapsed: () => {},
});

export function useSidebar() {
  return useContext(SidebarContext);
}

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <SidebarContext.Provider value={{ collapsed, setCollapsed }}>
      {children}
    </SidebarContext.Provider>
  );
}

function SidebarContent({ collapsed = false }: { collapsed?: boolean }) {
  const [collectionsOpen, setCollectionsOpen] = useState(true);
  const recentItems = [...items]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);
  const favoriteCollections = collections.filter((c) => c.isFavorite);
  const allCollections = collections.filter((c) => !c.isFavorite);

  return (
    <div className="flex h-full flex-col">
      {/* Types */}
      <div className="flex-1 overflow-y-auto px-2 py-4">
        {!collapsed && (
          <div className="mb-2 px-2">
            <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Types
            </span>
          </div>
        )}
        <nav className="space-y-0.5">
          {itemTypes.map((type) => {
            const Icon = iconMap[type.icon] ?? Code;
            const count = itemTypeCounts[type.id] ?? 0;
            const slug = type.name.toLowerCase();
            return (
              <Link
                key={type.id}
                href={`/items/${slug}`}
                title={collapsed ? type.name : undefined}
                className={`flex items-center rounded-md text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground ${
                  collapsed ? "justify-center p-2" : "gap-3 px-2 py-1.5"
                }`}
              >
                <Icon className="h-4 w-4 shrink-0" style={{ color: type.color }} />
                {!collapsed && (
                  <>
                    <span className="flex-1 truncate">{type.name}</span>
                    <span className="text-xs tabular-nums text-muted-foreground">
                      {count}
                    </span>
                  </>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Recent Items — hidden when collapsed */}
        {!collapsed && (
          <div className="mt-6">
            <div className="mb-2 px-2">
              <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Recent
              </span>
            </div>
            <nav className="space-y-0.5">
              {recentItems.map((item) => {
                const itemType = itemTypes.find((t) => t.id === item.itemTypeId);
                const Icon = iconMap[itemType?.icon ?? "Code"] ?? Code;
                return (
                  <Link
                    key={item.id}
                    href="#"
                    className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  >
                    <Icon className="h-3.5 w-3.5 shrink-0" style={{ color: itemType?.color }} />
                    <span className="flex-1 truncate">{item.title}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
        )}

        {/* Collections — hidden when collapsed */}
        {!collapsed && (
          <>
            <div className="mb-2 mt-6 flex items-center justify-between px-2">
              <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Collections
              </span>
              <Button
                variant="ghost"
                size="icon-xs"
                onClick={() => setCollectionsOpen(!collectionsOpen)}
              >
                <Plus
                  className={`h-3.5 w-3.5 transition-transform duration-200 ${
                    collectionsOpen ? "rotate-45" : ""
                  }`}
                />
              </Button>
            </div>

            {/* Favorites */}
            {collectionsOpen && favoriteCollections.length > 0 && (
              <div className="mb-3">
                <span className="mb-1 block px-2 text-[11px] font-medium uppercase tracking-wider text-muted-foreground/50">
                  Favorites
                </span>
                <nav className="space-y-0.5">
                  {favoriteCollections.map((col) => (
                    <Link
                      key={col.id}
                      href={`/collections/${col.id}`}
                      className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                    >
                      <Star className="h-3.5 w-3.5 shrink-0 fill-yellow-500 text-yellow-500" />
                      <span className="flex-1 truncate">{col.name}</span>
                    </Link>
                  ))}
                </nav>
              </div>
            )}

            {/* All Collections */}
            {collectionsOpen && allCollections.length > 0 && (
              <div>
                <span className="mb-1 block px-2 text-[11px] font-medium uppercase tracking-wider text-muted-foreground/50">
                  All Collections
                </span>
                <nav className="space-y-0.5">
                  {allCollections.map((col) => (
                    <Link
                      key={col.id}
                      href={`/collections/${col.id}`}
                      className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                    >
                      <FolderClosed className="h-3.5 w-3.5 shrink-0" />
                      <span className="flex-1 truncate">{col.name}</span>
                      <span className="text-xs tabular-nums text-muted-foreground">
                        {col.itemCount}
                      </span>
                    </Link>
                  ))}
                </nav>
              </div>
            )}
          </>
        )}
      </div>

      {/* User Area — hidden when collapsed */}
      {!collapsed && (
        <div className="border-t border-border p-2">
          <div className="flex items-center gap-3 px-1">
            <Avatar className="h-8 w-8 shrink-0">
              <AvatarFallback className="bg-muted text-xs">
                {getInitials(currentUser.name)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 overflow-hidden">
              <p className="truncate text-sm font-medium">{currentUser.name}</p>
              <p className="truncate text-xs text-muted-foreground">
                {currentUser.email}
              </p>
            </div>
            <Button variant="ghost" size="icon-xs">
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export function SidebarToggle() {
  const { collapsed, setCollapsed } = useSidebar();

  return (
    <>
      {/* Desktop toggle */}
      <Button
        variant="ghost"
        size="icon-sm"
        onClick={() => setCollapsed(!collapsed)}
        className="hidden md:inline-flex"
      >
        <PanelLeft className="h-4 w-4" />
      </Button>

      {/* Mobile drawer */}
      <Sheet>
        <SheetTrigger
          render={
            <Button
              variant="ghost"
              size="icon-sm"
              className="md:hidden"
            />
          }
        >
          <PanelLeft className="h-4 w-4" />
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0">
          <SheetTitle className="sr-only">Navigation</SheetTitle>
          <SidebarContent />
        </SheetContent>
      </Sheet>
    </>
  );
}

export function Sidebar() {
  const { collapsed } = useSidebar();

  return (
    <aside
      className={`hidden md:flex shrink-0 border-r border-white/[0.06] transition-[width] duration-300 ease-in-out overflow-hidden ${
        collapsed ? "md:w-14" : "md:w-64"
      }`}
    >
      <div className={`self-stretch transition-[width] duration-300 ease-in-out ${collapsed ? "w-14" : "w-64"}`}>
        <SidebarContent collapsed={collapsed} />
      </div>
    </aside>
  );
}
