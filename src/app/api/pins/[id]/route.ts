import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

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

  if (pin.userId !== session.user.id) {
    return NextResponse.json({ error: "Not your pin" }, { status: 403 });
  }

  const body = await request.json();
  const { note } = body;

  const updated = await prisma.pin.update({
    where: { id },
    data: { note: note?.trim() || null },
  });

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

  const isOwner = pin.userId === session.user.id;
  const userIsAdmin = session.user.isAdmin === true;

  if (!isOwner && !userIsAdmin) {
    return NextResponse.json({ error: "Not authorized" }, { status: 403 });
  }

  await prisma.pin.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
