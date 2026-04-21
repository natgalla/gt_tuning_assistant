import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ tuneId: string }> }
) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { tuneId } = await params;

  const tune = await prisma.tune.findUnique({ where: { id: tuneId } });
  if (!tune) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  if (tune.userId !== user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  await prisma.tune.delete({ where: { id: tuneId } });

  return NextResponse.json({ success: true });
}
