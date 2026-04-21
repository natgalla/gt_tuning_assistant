import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const carId = request.nextUrl.searchParams.get("carId");
  const user = await getCurrentUser();

  const where: Record<string, unknown> = {};
  if (carId) {
    where.carId = parseInt(carId, 10);
  } else if (user) {
    where.userId = user.id;
  }

  const tunes = await prisma.tune.findMany({
    where,
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(tunes);
}

export async function POST(request: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();

  const tune = await prisma.tune.create({
    data: {
      name: body.name,
      carId: body.carId ?? null,
      carName: body.carName ?? null,
      userId: user.id,
      track: body.track ?? null,
      bestLap: body.bestLap ?? null,
      suspensionType: body.suspensionType,
      tireType: body.tireType,
      weight: body.weight,
      horsePower: body.horsePower,
      bodyHeightFront: body.bodyHeightFront,
      bodyHeightRear: body.bodyHeightRear,
      natFreqFront: body.natFreqFront,
      natFreqRear: body.natFreqRear,
      antiRollFront: body.antiRollFront,
      antiRollRear: body.antiRollRear,
      compressionFront: body.compressionFront,
      compressionRear: body.compressionRear,
      expansionFront: body.expansionFront,
      expansionRear: body.expansionRear,
      camberFront: body.camberFront,
      camberRear: body.camberRear,
      toeFront: body.toeFront,
      toeRear: body.toeRear,
      lsdInitFront: body.lsdInitFront,
      lsdAccelFront: body.lsdAccelFront,
      lsdDecelFront: body.lsdDecelFront,
      lsdInitRear: body.lsdInitRear,
      lsdAccelRear: body.lsdAccelRear,
      lsdDecelRear: body.lsdDecelRear,
    },
  });

  return NextResponse.json(tune, { status: 201 });
}
