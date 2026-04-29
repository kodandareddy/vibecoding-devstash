import "dotenv/config";
import { prisma } from "../src/lib/prisma";

const DEMO_EMAIL = "demo@devstash.io";

async function main() {
  console.log("Testing database connection...\n");

  await prisma.$queryRaw`SELECT 1`;
  console.log("✓ Connected to database\n");

  const [userCount, itemTypeCount, itemCount, collectionCount, tagCount] =
    await Promise.all([
      prisma.user.count(),
      prisma.itemType.count(),
      prisma.item.count(),
      prisma.collection.count(),
      prisma.tag.count(),
    ]);

  console.log("Row counts:");
  console.log(`  users:        ${userCount}`);
  console.log(`  itemTypes:    ${itemTypeCount}`);
  console.log(`  items:        ${itemCount}`);
  console.log(`  collections:  ${collectionCount}`);
  console.log(`  tags:         ${tagCount}`);

  const itemTypes = await prisma.itemType.findMany({
    where: { isSystem: true },
    orderBy: { name: "asc" },
  });
  console.log("\nSystem item types:");
  for (const t of itemTypes) {
    console.log(`  ${t.color}  ${t.name.padEnd(8)} (${t.icon})`);
  }

  const user = await prisma.user.findUnique({
    where: { email: DEMO_EMAIL },
    include: {
      collections: {
        orderBy: { createdAt: "asc" },
        include: {
          defaultType: true,
          _count: { select: { items: true } },
        },
      },
      items: {
        orderBy: { createdAt: "asc" },
        include: { itemType: true },
      },
    },
  });

  if (!user) {
    console.log(`\n✗ Demo user (${DEMO_EMAIL}) not found. Run: npm run db:seed`);
    return;
  }

  console.log(`\nDemo user:`);
  console.log(`  id:            ${user.id}`);
  console.log(`  email:         ${user.email}`);
  console.log(`  name:          ${user.name}`);
  console.log(`  isPro:         ${user.isPro}`);
  console.log(`  emailVerified: ${user.emailVerified?.toISOString() ?? "—"}`);
  console.log(`  hasPassword:   ${Boolean(user.password)}`);

  console.log(`\nCollections (${user.collections.length}):`);
  for (const c of user.collections) {
    console.log(
      `  📁 ${c.name.padEnd(20)} ${String(c._count.items).padStart(2)} items   default: ${c.defaultType?.name ?? "—"}`,
    );
  }

  const itemsByType = user.items.reduce<Record<string, number>>((acc, it) => {
    acc[it.itemType.name] = (acc[it.itemType.name] ?? 0) + 1;
    return acc;
  }, {});
  console.log(`\nItems by type:`);
  for (const [type, count] of Object.entries(itemsByType).sort()) {
    console.log(`  ${type.padEnd(8)} ${count}`);
  }

  console.log(`\nFirst 3 items:`);
  for (const it of user.items.slice(0, 3)) {
    const preview =
      it.contentType === "URL"
        ? it.url
        : (it.content ?? "").replace(/\s+/g, " ").slice(0, 60);
    console.log(
      `  • [${it.itemType.name}] ${it.title}\n    ${preview}${preview && preview.length === 60 ? "…" : ""}`,
    );
  }

  console.log("\n✓ All checks passed.");
}

main()
  .catch((err) => {
    console.error("✗ Database test failed:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
