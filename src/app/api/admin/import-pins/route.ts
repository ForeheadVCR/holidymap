import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { gridCellToPixel } from "@/lib/map-config";

// ── Scraped locations (2026-03-10 → 2026-03-17, dune.gaming.tools) ──────
interface Loc {
  name: string;
  gridCell: string;
  categorySlug: string;
}

const LOCATIONS: Loc[] = [
  // Buried Testing Stations
  { name: "Buried Testing Station", gridCell: "D3", categorySlug: "testing-station" },
  { name: "Buried Testing Station", gridCell: "D7", categorySlug: "testing-station" },
  { name: "Buried Testing Station", gridCell: "F8", categorySlug: "testing-station" },
  { name: "Buried Testing Station", gridCell: "G3", categorySlug: "testing-station" },
  { name: "Buried Testing Station", gridCell: "H6", categorySlug: "testing-station" },

  // Imperial Testing Stations
  { name: "Imperial Testing Station No. 37", gridCell: "A2", categorySlug: "testing-station" },
  { name: "Imperial Testing Station No. 148", gridCell: "A4", categorySlug: "testing-station" },
  { name: "Imperial Testing Station No. 185", gridCell: "A3", categorySlug: "testing-station" },
  { name: "Imperial Testing Station No. 186", gridCell: "A8", categorySlug: "testing-station" },
  { name: "Imperial Testing Station No. 217", gridCell: "A9", categorySlug: "testing-station" },
  { name: "Imperial Testing Station No. 93", gridCell: "A5", categorySlug: "testing-station" },

  // Forgotten Caves
  { name: "Forgotten Cave", gridCell: "A1", categorySlug: "cave" },
  { name: "Forgotten Cave", gridCell: "A5", categorySlug: "cave" },
  { name: "Forgotten Cave", gridCell: "A8", categorySlug: "cave" },
  { name: "Forgotten Cave", gridCell: "C7", categorySlug: "cave" },
  { name: "Forgotten Cave", gridCell: "D6", categorySlug: "cave" },
  { name: "Forgotten Cave", gridCell: "E7", categorySlug: "cave" },
  { name: "Forgotten Cave", gridCell: "F3", categorySlug: "cave" },
  { name: "Forgotten Cave", gridCell: "H7", categorySlug: "cave" },

  // Unrecovered Shipwrecks
  { name: "Unrecovered Shipwreck", gridCell: "F5", categorySlug: "shipwreck" },
  { name: "Unrecovered Shipwreck", gridCell: "F6", categorySlug: "shipwreck" },
  { name: "Unrecovered Shipwreck", gridCell: "I1", categorySlug: "shipwreck" },

  // Named Wrecks
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

const TARGET_REGION = "north-america";

export async function POST(request: NextRequest) {
  // Admin-only
  const session = await auth();
  if (!session?.user?.id || !session.user.isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Password protection (same as wipe-map)
  const body = await request.json();
  const { password } = body;
  if (password !== "chile2026") {
    return NextResponse.json({ error: "Invalid password" }, { status: 403 });
  }

  // Find or create system user
  let systemUser = await prisma.user.findFirst({
    where: { name: "Map Import" },
  });
  if (!systemUser) {
    systemUser = await prisma.user.create({
      data: { name: "Map Import", email: "system-import@holidymap.local" },
    });
  }

  // Load lookups
  const categories = await prisma.category.findMany();
  const categoryBySlug = new Map(categories.map((c) => [c.slug, c]));

  const region = await prisma.region.findUnique({
    where: { slug: TARGET_REGION },
  });
  if (!region) {
    return NextResponse.json({ error: `Region "${TARGET_REGION}" not found` }, { status: 404 });
  }

  // Clean up previous imports by this user in this region
  const deleted = await prisma.pin.deleteMany({
    where: { userId: systemUser.id, regionId: region.id },
  });

  // Offset logic for pins sharing a grid cell
  const cellCounts = new Map<string, number>();
  function getOffset(gridCell: string): { dx: number; dy: number } {
    const count = cellCounts.get(gridCell) || 0;
    cellCounts.set(gridCell, count + 1);
    if (count === 0) return { dx: 0, dy: 0 };
    const angle = (count * 2 * Math.PI) / 6;
    const radius = 40;
    return { dx: Math.cos(angle) * radius, dy: Math.sin(angle) * radius };
  }

  // Create all pins
  let created = 0;
  const skipped: string[] = [];

  for (const loc of LOCATIONS) {
    const category = categoryBySlug.get(loc.categorySlug);
    if (!category) {
      skipped.push(`${loc.name} (unknown category: ${loc.categorySlug})`);
      continue;
    }

    const center = gridCellToPixel(loc.gridCell);
    const offset = getOffset(loc.gridCell);

    await prisma.pin.create({
      data: {
        x: center.x + offset.dx,
        y: center.y + offset.dy,
        gridCell: loc.gridCell,
        note: loc.name,
        categoryId: category.id,
        regionId: region.id,
        userId: systemUser.id,
      },
    });
    created++;
  }

  return NextResponse.json({
    success: true,
    region: TARGET_REGION,
    created,
    deleted: deleted.count,
    skipped,
  });
}
