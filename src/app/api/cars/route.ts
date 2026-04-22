import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const fields = request.nextUrl.searchParams.get("fields");

  if (fields === "catalog") {
    const cars = await prisma.car.findMany({
      orderBy: [{ manufacturer: "asc" }, { name: "asc" }],
      select: {
        id: true,
        name: true,
        manufacturer: true,
        year: true,
        drivetrain: true,
        weight: true,
        horsePower: true,
      },
    });
    return NextResponse.json(cars);
  }

  const cars = await prisma.car.findMany({
    orderBy: { id: "asc" },
    include: { tuneConfigs: true },
  });

  return NextResponse.json(cars);
}
