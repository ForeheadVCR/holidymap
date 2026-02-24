import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { logActivity } from "@/lib/activity-log";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const pin = await prisma.pin.findUnique({ where: { id } });
  if (!pin) {
    return NextResponse.json({ error: "Pin not found" }, { status: 404 });
  }

  if (!session.user.canEdit || pin.userId !== session.user.id) {
    return NextResponse.json({ error: "Not authorized" }, { status: 403 });
  }

  const body = await request.json();
  const { note } = body;

  const updated = await prisma.pin.update({
    where: { id },
    data: { note: note?.trim() || null },
    include: { category: { select: { name: true } } },
  });

  logActivity("pin_edited", session.user.id, {
    pinId: id,
    category: updated.category.name,
    gridCell: pin.gridCell,
    note: updated.note,
  }, pin.regionId);

  return NextResponse.json(updated);
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const pin = await prisma.pin.findUnique({ where: { id } });
  if (!pin) {
    return NextResponse.json({ error: "Pin not found" }, { status: 404 });
  }

  const canEdit = session.user.canEdit === true;
  const isOwner = pin.userId === session.user.id;
  const userIsAdmin = session.user.isAdmin === true;

  if (!canEdit || (!isOwner && !userIsAdmin)) {
    return NextResponse.json({ error: "Not authorized" }, { status: 403 });
  }

  // Look up category name before deleting
  const pinWithCategory = await prisma.pin.findUnique({
    where: { id },
    include: { category: { select: { name: true } } },
  });

  await prisma.pin.delete({ where: { id } });

  logActivity("pin_deleted", session.user.id, {
    pinId: id,
    category: pinWithCategory?.category.name,
    gridCell: pin.gridCell,
  }, pin.regionId);

  return NextResponse.json({ success: true });
}
