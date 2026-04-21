import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword, createToken, setAuthCookie } from "@/lib/auth";

export async function POST(request: NextRequest) {
  const { email, password } = await request.json();

  if (!email || !password || password.length < 6) {
    return NextResponse.json(
      { error: "Email and password (min 6 chars) required" },
      { status: 400 },
    );
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json(
      { error: "Email already registered" },
      { status: 409 },
    );
  }

  const passwordHash = await hashPassword(password);
  const user = await prisma.user.create({
    data: { email, passwordHash },
    select: { id: true, email: true },
  });

  const token = await createToken(user.id);
  await setAuthCookie(token);

  return NextResponse.json(user, { status: 201 });
}
