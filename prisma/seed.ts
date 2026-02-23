import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { CATEGORIES, REGIONS } from "../src/lib/categories";

const prisma = new PrismaClient();

async function main() {
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
