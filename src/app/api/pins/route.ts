import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { rateLimit } from "@/lib/rate-limit";
import { pixelToGridCell } from "@/lib/map-config";
import { logActivity } from "@/lib/activity-log";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const regionSlug = searchParams.get("region");
  const search = searchParams.get("search");
  const categorySlugs = searchParams.get("categories");
  const gridCell = searchParams.get("gridCell");
  const includeHidden = searchParams.get("includeHidden") === "true";

  if (!regionSlug) {
    return NextResponse.json({ error: "Region is required" }, { status: 400 });
  }

  const region = await prisma.region.findUnique({
    where: { slug: regionSlug },
  });
  if (!region) {
    return NextResponse.json({ error: "Region not found" }, { status: 404 });
  }

  // Get current user for userVote
  const session = await auth();

  // Build where clause
  const where: Record<string, unknown> = {
    regionId: region.id,
  };

  if (!includeHidden) {
    where.hidden = false;
  }

  if (categorySlugs) {
    const slugs = categorySlugs.split(",");
    const categories = await prisma.category.findMany({
      where: { slug: { in: slugs } },
      select: { id: true },
    });
    where.categoryId = { in: categories.map((c) => c.id) };
  }

  if (gridCell) {
    where.gridCell = gridCell;
  }

  if (search) {
    where.OR = [
      { note: { contains: search, mode: "insensitive" } },
      { category: { name: { contains: search, mode: "insensitive" } } },
    ];
  }

  const pins = await prisma.pin.findMany({
    where,
    include: {
      category: {
        select: {
          id: true,
          name: true,
          slug: true,
          group: true,
          color: true,
          iconPath: true,
        },
      },
      user: {
        select: { id: true, name: true, image: true },
      },
      ...(session?.user?.id
        ? {
            votes: {
              where: { userId: session.user.id },
              select: { value: true },
            },
          }
        : {}),
    },
    orderBy: { createdAt: "desc" },
  });

  const isAdmin = session?.user?.isAdmin === true;

  const result = pins.map((pin) => ({
    id: pin.id,
    x: pin.x,
    y: pin.y,
    gridCell: pin.gridCell,
    note: pin.note,
    voteScore: pin.voteScore,
    hidden: pin.hidden,
    createdAt: pin.createdAt.toISOString(),
    category: pin.category,
    user: isAdmin
      ? pin.user
      : { id: pin.user.id, name: null, image: null },
    userVote:
      "votes" in pin && Array.isArray(pin.votes) && pin.votes.length > 0
        ? Math.sign((pin.votes[0] as { value: number }).value)
        : null,
  }));

  return NextResponse.json(result);
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!session.user.canEdit) {
    return NextResponse.json(
      { error: "Requires Watersealed or Community Admin role" },
      { status: 403 }
    );
  }

  // Rate limit: 10 pins per hour
  const rl = rateLimit(`pin-create:${session.user.id}`, 10, 60 * 60 * 1000);
  if (!rl.success) {
    return NextResponse.json(
      { error: "Rate limit exceeded. Try again later." },
      { status: 429 }
    );
  }

  const body = await request.json();
  const { x, y, categoryId, region: regionSlug, note } = body;

  if (typeof x !== "number" || typeof y !== "number" || !categoryId || !regionSlug) {
    return NextResponse.json(
      { error: "Missing required fields: x, y, categoryId, region" },
      { status: 400 }
    );
  }

  const category = await prisma.category.findUnique({
    where: { id: categoryId },
  });
  if (!category) {
    return NextResponse.json({ error: "Category not found" }, { status: 404 });
  }

  const region = await prisma.region.findUnique({
    where: { slug: regionSlug },
  });
  if (!region) {
    return NextResponse.json({ error: "Region not found" }, { status: 404 });
  }

  // Require note for community pins
  if (category.slug === "community-pin" && !note?.trim()) {
    return NextResponse.json(
      { error: "Community pins require a note" },
      { status: 400 }
    );
  }

  const gridCell = pixelToGridCell(x, y);

  const pin = await prisma.pin.create({
    data: {
      x,
      y,
      gridCell,
      note: note?.trim() || null,
      categoryId: category.id,
      regionId: region.id,
      userId: session.user.id,
    },
    include: {
      category: {
        select: {
          id: true,
          name: true,
          slug: true,
          group: true,
          color: true,
          iconPath: true,
        },
      },
      user: {
        select: { id: true, name: true, image: true },
      },
    },
  });

  logActivity("pin_created", session.user.id, {
    pinId: pin.id,
    category: category.name,
    gridCell,
    note: pin.note,
  }, region.id);

  return NextResponse.json({
    ...pin,
    createdAt: pin.createdAt.toISOString(),
    userVote: null,
  });
}
