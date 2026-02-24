import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { CATEGORIES, REGIONS, REMOVED_CATEGORY_SLUGS } from "../src/lib/categories";

const prisma = new PrismaClient();

async function main() {
  // Clean up removed categories (delete pins first due to FK constraint)
  if (REMOVED_CATEGORY_SLUGS.length > 0) {
    console.log(`Cleaning up ${REMOVED_CATEGORY_SLUGS.length} removed categories...`);
    const removedCategories = await prisma.category.findMany({
      where: { slug: { in: [...REMOVED_CATEGORY_SLUGS] } },
      select: { id: true, slug: true },
    });

    if (removedCategories.length > 0) {
      const categoryIds = removedCategories.map((c) => c.id);
      // Delete votes on pins in removed categories
      const deletedVotes = await prisma.vote.deleteMany({
        where: { pin: { categoryId: { in: categoryIds } } },
      });
      console.log(`  Deleted ${deletedVotes.count} votes on removed-category pins.`);
      // Delete pins in removed categories
      const deletedPins = await prisma.pin.deleteMany({
        where: { categoryId: { in: categoryIds } },
      });
      console.log(`  Deleted ${deletedPins.count} pins in removed categories.`);
      // Delete the categories themselves
      const deletedCats = await prisma.category.deleteMany({
        where: { id: { in: categoryIds } },
      });
      console.log(`  Deleted ${deletedCats.count} categories.`);
    } else {
      console.log("  No removed categories found in DB (already clean).");
    }
  }

  console.log("Seeding categories...");
  for (const cat of CATEGORIES) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {
        name: cat.name,
        group: cat.group,
        color: cat.color,
        sortOrder: cat.sortOrder,
        iconPath: `/icons/${cat.slug}.svg`,
      },
      create: {
        name: cat.name,
        group: cat.group,
        slug: cat.slug,
        color: cat.color,
        sortOrder: cat.sortOrder,
        iconPath: `/icons/${cat.slug}.svg`,
      },
    });
  }
  console.log(`Seeded ${CATEGORIES.length} categories.`);

  console.log("Seeding regions...");
  for (const region of REGIONS) {
    await prisma.region.upsert({
      where: { slug: region.slug },
      update: { name: region.name },
      create: {
        name: region.name,
        slug: region.slug,
      },
    });
  }
  console.log(`Seeded ${REGIONS.length} regions.`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
