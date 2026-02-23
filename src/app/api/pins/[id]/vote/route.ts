import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { rateLimit } from "@/lib/rate-limit";

const HIDE_THRESHOLD = -5;

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const rl = rateLimit(`vote:${session.user.id}`, 60, 60 * 60 * 1000);
  if (!rl.success) {
    return NextResponse.json(
      { error: "Rate limit exceeded" },
      { status: 429 }
    );
  }

  const { id: pinId } = await params;
  const body = await request.json();
  const { value } = body;

  if (value !== 1 && value !== -1) {
    return NextResponse.json(
      { error: "Value must be 1 or -1" },
      { status: 400 }
    );
  }

  const pin = await prisma.pin.findUnique({ where: { id: pinId } });
  if (!pin) {
    return NextResponse.json({ error: "Pin not found" }, { status: 404 });
  }

  // Don't let users vote on their own pins
  if (pin.userId === session.user.id) {
    return NextResponse.json(
      { error: "Cannot vote on your own pin" },
      { status: 400 }
    );
  }

  // Upsert vote and recalculate score in a transaction
  const result = await prisma.$transaction(async (tx) => {
    await tx.vote.upsert({
      where: {
        pinId_userId: { pinId, userId: session.user.id },
      },
      update: { value },
      create: {
        pinId,
        userId: session.user.id,
        value,
      },
    });

    const aggregate = await tx.vote.aggregate({
      where: { pinId },
      _sum: { value: true },
    });

    const newScore = aggregate._sum.value ?? 0;
    const hidden = newScore < HIDE_THRESHOLD;

    const updated = await tx.pin.update({
      where: { id: pinId },
      data: { voteScore: newScore, hidden },
    });

    return updated;
  });

  return NextResponse.json({
    voteScore: result.voteScore,
    hidden: result.hidden,
  });
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id: pinId } = await params;

  const vote = await prisma.vote.findUnique({
    where: {
      pinId_userId: { pinId, userId: session.user.id },
    },
  });

  if (!vote) {
    return NextResponse.json({ error: "No vote to remove" }, { status: 404 });
  }

  const result = await prisma.$transaction(async (tx) => {
    await tx.vote.delete({
      where: { id: vote.id },
    });

    const aggregate = await tx.vote.aggregate({
      where: { pinId },
      _sum: { value: true },
    });

    const newScore = aggregate._sum.value ?? 0;
    const hidden = newScore < HIDE_THRESHOLD;

    const updated = await tx.pin.update({
      where: { id: pinId },
      data: { voteScore: newScore, hidden },
    });

    return updated;
  });

  return NextResponse.json({
    voteScore: result.voteScore,
    hidden: result.hidden,
  });
}
