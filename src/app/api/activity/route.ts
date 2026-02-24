import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id || !session.user.isAdmin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { searchParams } = request.nextUrl;
  const regionSlug = searchParams.get("region");
  const limit = Math.min(parseInt(searchParams.get("limit") || "50"), 200);

  const where: Record<string, unknown> = {};

  if (regionSlug) {
    const region = await prisma.region.findUnique({
      where: { slug: regionSlug },
      select: { id: true },
    });
    if (region) {
      where.regionId = region.id;
    }
  }

  const logs = await prisma.activityLog.findMany({
    where,
    include: {
      user: {
        select: { name: true, image: true },
      },
    },
    orderBy: { createdAt: "desc" },
    take: limit,
  });

  return NextResponse.json(
    logs.map((log) => ({
      id: log.id,
      action: log.action,
      details: JSON.parse(log.details),
      createdAt: log.createdAt.toISOString(),
      user: log.user,
    }))
  );
}
