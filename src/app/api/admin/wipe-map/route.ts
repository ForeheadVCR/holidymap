import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

const WIPE_PASSWORD = "chile2026";

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id || !session.user.isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { password } = body;

  if (password !== WIPE_PASSWORD) {
    return NextResponse.json({ error: "Invalid password" }, { status: 403 });
  }

  // Delete votes first (foreign key dependency), then pins and activity logs
  await prisma.$transaction([
    prisma.vote.deleteMany({}),
    prisma.activityLog.deleteMany({}),
    prisma.pin.deleteMany({}),
  ]);

  return NextResponse.json({ success: true, message: "All pins have been wiped" });
}
