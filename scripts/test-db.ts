import "dotenv/config";
import { prisma } from "../src/lib/prisma";

async function main() {
  console.log("Testing database connection...\n");

  await prisma.$queryRaw`SELECT 1`;
  console.log("✓ Connected to database");

  const [userCount, itemTypeCount, itemCount, collectionCount, tagCount] =
    await Promise.all([
      prisma.user.count(),
      prisma.itemType.count(),
      prisma.item.count(),
      prisma.collection.count(),
      prisma.tag.count(),
    ]);

  console.log("\nRow counts:");
  console.log(`  users:        ${userCount}`);
  console.log(`  itemTypes:    ${itemTypeCount}`);
  console.log(`  items:        ${itemCount}`);
  console.log(`  collections:  ${collectionCount}`);
  console.log(`  tags:         ${tagCount}`);
}

main()
  .catch((err) => {
    console.error("✗ Database test failed:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
