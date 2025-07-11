import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/lib/prisma";
import { signJWT } from "@/lib/auth";

const VerifyOtpSchema = z.object({
  phone: z.string().optional(),
  email: z.string().email().optional(),
  otp: z.string(),
});

export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsed = VerifyOtpSchema.safeParse(body);
  if (!parsed.success || (!parsed.data.phone && !parsed.data.email)) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const { phone, email, otp } = parsed.data;
  const user = await prisma.user.findFirst({
    where: { OR: [{ phone }, { email }] },
  });
  if (!user || user.password !== otp) {
    return NextResponse.json({ error: "Invalid OTP" }, { status: 401 });
  }

  // Clear OTP (for demo, set password to null)
  await prisma.user.update({
    where: { id: user.id },
    data: { password: null },
  });

  const token = signJWT({ id: user.id, role: user.role });
  return NextResponse.json({ token });
}
