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
  Pin,
  Archive,
  Heart,
  MoreHorizontal,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  items,
  collections,
  itemTypes,
  itemTypeCounts,
} from "@/lib/mock-data";

const iconMap: Record<string, React.ElementType> = {
  Code,
  Sparkles,
  Terminal,
  StickyNote,
  File,
  Image,
  Link: LinkIcon,
};

const totalItems = Object.values(itemTypeCounts).reduce((a, b) => a + b, 0);
const totalCollections = collections.length;
const favoriteItems = items.filter((i) => i.isFavorite).length;
const favoriteCollections = collections.filter((c) => c.isFavorite).length;

const pinnedItems = items.filter((i) => i.isPinned);
const recentItems = [...items]
  .sort(
    (a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )
  .slice(0, 10);

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Your developer knowledge hub</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatsCard
          title="Total Items"
          value={totalItems}
          icon={<Archive className="h-4 w-4 text-blue-500" />}
        />
        <StatsCard
          title="Collections"
          value={totalCollections}
          icon={<FolderClosed className="h-4 w-4 text-emerald-500" />}
        />
        <StatsCard
          title="Favorite Items"
          value={favoriteItems}
          icon={<Heart className="h-4 w-4 text-pink-500" />}
        />
        <StatsCard
          title="Favorite Collections"
          value={favoriteCollections}
          icon={<Star className="h-4 w-4 text-yellow-500" />}
        />
      </div>

      {/* Collections */}
      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Collections</h2>
          <span className="text-sm text-muted-foreground cursor-pointer hover:text-foreground transition-colors">
            View all
          </span>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {collections.map((col) => {
            const defaultType = itemTypes.find(
              (t) => t.id === col.defaultTypeId
            );
            return (
              <div
                key={col.id}
                className="cursor-pointer rounded-lg bg-card border border-border border-l-3 px-3 py-3 transition-colors hover:bg-muted/50"
                style={{ borderLeftColor: defaultType?.color }}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{col.name}</span>
                      {col.isFavorite && (
                        <Star className="h-3.5 w-3.5 fill-yellow-500 text-yellow-500" />
                      )}
                    </div>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {col.itemCount} items
                    </p>
                  </div>
                  <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                </div>
                <p className="mt-2 text-xs text-muted-foreground">
                  {col.description}
                </p>
                <div className="mt-2 flex gap-1.5">
                  {col.previewTypeIds.map((typeId) => {
                    const type = itemTypes.find((t) => t.id === typeId);
                    if (!type) return null;
                    const Icon = iconMap[type.icon] ?? Code;
                    return (
                      <Icon
                        key={typeId}
                        className="h-3.5 w-3.5"
                        style={{ color: type.color }}
                      />
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Pinned Items */}
      {pinnedItems.length > 0 && (
        <section>
          <div className="mb-4 flex items-center gap-2">
            <Pin className="h-4 w-4 text-muted-foreground" />
            <h2 className="text-lg font-semibold">Pinned</h2>
          </div>
          <div className="space-y-3">
            {pinnedItems.map((item) => (
              <ItemRow key={item.id} item={item} />
            ))}
          </div>
        </section>
      )}

      {/* Recent Items */}
      <section>
        <h2 className="mb-4 text-lg font-semibold">Recent Items</h2>
        <div className="space-y-3">
          {recentItems.map((item) => (
            <ItemRow key={item.id} item={item} />
          ))}
        </div>
      </section>
    </div>
  );
}

function StatsCard({
  title,
  value,
  icon,
}: {
  title: string;
  value: number;
  icon: React.ReactNode;
}) {
  return (
    <Card>
      <CardContent className="flex items-center gap-3 px-3 py-2.5">
        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-muted">
          {icon}
        </div>
        <div>
          <p className="text-2xl font-bold">{value}</p>
          <p className="text-xs text-muted-foreground">{title}</p>
        </div>
      </CardContent>
    </Card>
  );
}

function ItemRow({
  item,
}: {
  item: (typeof items)[number];
}) {
  const itemType = itemTypes.find((t) => t.id === item.itemTypeId);
  const Icon = iconMap[itemType?.icon ?? "Code"] ?? Code;

  return (
    <div
      className="flex gap-3 rounded-lg border border-border bg-card px-4 py-3 cursor-pointer transition-colors hover:bg-muted/50 border-l-3"
      style={{ borderLeftColor: itemType?.color }}
    >
      <Icon
        className="mt-0.5 h-4 w-4 shrink-0"
        style={{ color: itemType?.color }}
      />
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">{item.title}</span>
            {item.isPinned && (
              <Pin className="h-3 w-3 text-muted-foreground" />
            )}
            {item.isFavorite && (
              <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
            )}
          </div>
          <span className="shrink-0 text-xs text-muted-foreground">
            {new Date(item.createdAt).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            })}
          </span>
        </div>
        <p className="mt-0.5 text-xs text-muted-foreground">
          {item.description}
        </p>
        {item.tags.length > 0 && (
          <div className="mt-2 flex gap-1.5">
            {item.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-[10px] px-1.5 py-0">
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
