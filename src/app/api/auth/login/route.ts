import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { signJWT } from "@/lib/auth";
import { z } from "zod";

const LoginSchema = z.object({
  phone: z.string().optional(),
  email: z.string().email().optional(),
  password: z.string(),
});

export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsed = LoginSchema.safeParse(body);
  if (!parsed.success || (!parsed.data.phone && !parsed.data.email)) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const { phone, email, password } = parsed.data;
  const user = await prisma.user.findFirst({
    where: { OR: [{ phone }, { email }] },
  });
  if (!user || !user.password || user.password !== password) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const token = signJWT({ id: user.id, role: user.role });
  return NextResponse.json({ token });
}
