import "dotenv/config";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// ── Map config (mirrors src/lib/map-config.ts) ──────────────────────────
const MAP_WIDTH = 2048;
const MAP_HEIGHT = 2048;
const GRID_COLS = 9;
const GRID_ROWS = 9;
const CELL_WIDTH = MAP_WIDTH / GRID_COLS;
const CELL_HEIGHT = MAP_HEIGHT / GRID_ROWS;
const ROW_LABELS_DISPLAY = ["A", "B", "C", "D", "E", "F", "G", "H", "I"];
const COL_LABELS = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];

function gridCellToPixel(cell: string): { x: number; y: number } {
  const rowLabel = cell[0].toUpperCase();
  const colLabel = cell.substring(1);
  const row = ROW_LABELS_DISPLAY.indexOf(rowLabel);
  const col = COL_LABELS.indexOf(colLabel);
  if (row === -1 || col === -1) return { x: MAP_WIDTH / 2, y: MAP_HEIGHT / 2 };
  return {
    x: col * CELL_WIDTH + CELL_WIDTH / 2,
    y: row * CELL_HEIGHT + CELL_HEIGHT / 2,
  };
}

// ── Scraped location data (2026-03-10 to 2026-03-17, all regions identical) ──
// Source: dune.gaming.tools/deep-desert

interface LocationEntry {
  name: string;
  gridCell: string;
  categorySlug: string;
}

const LOCATIONS: LocationEntry[] = [
  // Buried Testing Stations → "testing-station"
  { name: "Buried Testing Station", gridCell: "D3", categorySlug: "testing-station" },
  { name: "Buried Testing Station", gridCell: "D7", categorySlug: "testing-station" },
  { name: "Buried Testing Station", gridCell: "F8", categorySlug: "testing-station" },
  { name: "Buried Testing Station", gridCell: "G3", categorySlug: "testing-station" },
  { name: "Buried Testing Station", gridCell: "H6", categorySlug: "testing-station" },

  // Imperial Testing Stations → "testing-station"
  { name: "Imperial Testing Station No. 37", gridCell: "A2", categorySlug: "testing-station" },
  { name: "Imperial Testing Station No. 148", gridCell: "A4", categorySlug: "testing-station" },
  { name: "Imperial Testing Station No. 185", gridCell: "A3", categorySlug: "testing-station" },
  { name: "Imperial Testing Station No. 186", gridCell: "A8", categorySlug: "testing-station" },
  { name: "Imperial Testing Station No. 217", gridCell: "A9", categorySlug: "testing-station" },
  { name: "Imperial Testing Station No. 93", gridCell: "A5", categorySlug: "testing-station" },

  // Forgotten Caves → "cave"
  { name: "Forgotten Cave", gridCell: "A1", categorySlug: "cave" },
  { name: "Forgotten Cave", gridCell: "A5", categorySlug: "cave" },
  { name: "Forgotten Cave", gridCell: "A8", categorySlug: "cave" },
  { name: "Forgotten Cave", gridCell: "C7", categorySlug: "cave" },
  { name: "Forgotten Cave", gridCell: "D6", categorySlug: "cave" },
  { name: "Forgotten Cave", gridCell: "E7", categorySlug: "cave" },
  { name: "Forgotten Cave", gridCell: "F3", categorySlug: "cave" },
  { name: "Forgotten Cave", gridCell: "H7", categorySlug: "cave" },

  // Unrecovered Shipwrecks → "shipwreck"
  { name: "Unrecovered Shipwreck", gridCell: "F5", categorySlug: "shipwreck" },
  { name: "Unrecovered Shipwreck", gridCell: "F6", categorySlug: "shipwreck" },
  { name: "Unrecovered Shipwreck", gridCell: "I1", categorySlug: "shipwreck" },

  // Named Wrecks → "shipwreck"
  { name: "Wreck of the Archidamas III", gridCell: "A3", categorySlug: "shipwreck" },
  { name: "Wreck of the Cycliadas", gridCell: "A3", categorySlug: "shipwreck" },
  { name: "Wreck of the Dioedas", gridCell: "A4", categorySlug: "shipwreck" },
  { name: "Wreck of the Eumenes", gridCell: "A1", categorySlug: "shipwreck" },
  { name: "Wreck of the Hicetas", gridCell: "A1", categorySlug: "shipwreck" },
  { name: "Wreck of the Hyperbatas", gridCell: "A2", categorySlug: "shipwreck" },
  { name: "Wreck of the Orsippus", gridCell: "A9", categorySlug: "shipwreck" },
  { name: "Wreck of the Proxenus", gridCell: "A7", categorySlug: "shipwreck" },
  { name: "Wreck of the Stasanor", gridCell: "A9", categorySlug: "shipwreck" },
  { name: "Wreck of the Xenophon", gridCell: "A5", categorySlug: "shipwreck" },
];

// Only importing for North America
const REGION_SLUGS = ["north-america"];

async function main() {
  console.log("=== Deep Desert Pin Import ===\n");

  // 1. Find or create a system user for imported pins
  let systemUser = await prisma.user.findFirst({
    where: { name: "Map Import" },
  });
  if (!systemUser) {
    systemUser = await prisma.user.create({
      data: {
        name: "Map Import",
        email: "system-import@holidymap.local",
      },
    });
    console.log(`Created system user: ${systemUser.id}`);
  } else {
    console.log(`Using existing system user: ${systemUser.id}`);
  }

  // 2. Load categories by slug
  const categories = await prisma.category.findMany();
  const categoryBySlug = new Map(categories.map((c) => [c.slug, c]));

  // 3. Load regions by slug
  const regions = await prisma.region.findMany();
  const regionBySlug = new Map(regions.map((r) => [r.slug, r]));

  // 4. Track how many pins share each grid cell (per region) for offset
  const cellCounts = new Map<string, number>();

  function getOffset(regionSlug: string, gridCell: string): { dx: number; dy: number } {
    const key = `${regionSlug}:${gridCell}`;
    const count = cellCounts.get(key) || 0;
    cellCounts.set(key, count + 1);

    if (count === 0) return { dx: 0, dy: 0 };

    // Spread overlapping pins in a circle (radius ~40px)
    const angle = (count * 2 * Math.PI) / 6; // up to 6 positions
    const radius = 40;
    return {
      dx: Math.cos(angle) * radius,
      dy: Math.sin(angle) * radius,
    };
  }

  // 5. Delete any previously imported pins (by this system user)
  const deleted = await prisma.pin.deleteMany({
    where: { userId: systemUser.id },
  });
  if (deleted.count > 0) {
    console.log(`Cleaned up ${deleted.count} previously imported pins.\n`);
  }

  // Reset cell counts after cleanup
  cellCounts.clear();

  // 6. Create pins for each region
  let totalCreated = 0;

  for (const regionSlug of REGION_SLUGS) {
    const region = regionBySlug.get(regionSlug);
    if (!region) {
      console.warn(`Region "${regionSlug}" not found, skipping.`);
      continue;
    }

    let regionCount = 0;

    for (const loc of LOCATIONS) {
      const category = categoryBySlug.get(loc.categorySlug);
      if (!category) {
        console.warn(`Category "${loc.categorySlug}" not found, skipping ${loc.name}.`);
        continue;
      }

      const center = gridCellToPixel(loc.gridCell);
      const offset = getOffset(regionSlug, loc.gridCell);
      const x = center.x + offset.dx;
      const y = center.y + offset.dy;

      await prisma.pin.create({
        data: {
          x,
          y,
          gridCell: loc.gridCell,
          note: loc.name,
          categoryId: category.id,
          regionId: region.id,
          userId: systemUser.id,
        },
      });

      regionCount++;
    }

    console.log(`${regionSlug}: created ${regionCount} pins`);
    totalCreated += regionCount;
  }

  console.log(`\nTotal pins created: ${totalCreated}`);
  console.log("Import complete!");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("Import failed:", e);
    await prisma.$disconnect();
    process.exit(1);
  });
