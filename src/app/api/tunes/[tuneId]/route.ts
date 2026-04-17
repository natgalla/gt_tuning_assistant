import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ tuneId: string }> }
) {
  const { tuneId } = await params;

  await prisma.tune.delete({ where: { id: tuneId } });

  return NextResponse.json({ success: true });
}
