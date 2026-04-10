"use client";

import { Search, Plus, FolderPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sidebar,
  SidebarToggle,
  SidebarProvider,
} from "@/components/dashboard/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <div className="flex h-screen flex-col">
        {/* Top Bar */}
        <header className="flex shrink-0 items-center gap-3 border-b border-border px-4 py-3">
          <SidebarToggle />

          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-sm font-bold text-white">
              S
            </div>
            <span className="text-lg font-semibold">DevStash</span>
          </div>

          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search items..."
              className="pl-9"
              readOnly
            />
          </div>

          <div className="ml-auto flex items-center gap-2">
            <Button variant="outline" size="sm">
              <FolderPlus className="mr-2 h-4 w-4" />
              New Collection
            </Button>
            <Button size="sm">
              <Plus className="mr-2 h-4 w-4" />
              New Item
            </Button>
          </div>
        </header>

        {/* Main Area */}
        <div className="flex flex-1 overflow-hidden">
          <Sidebar />

          {/* Main Content */}
          <main className="flex-1 overflow-y-auto p-6">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
