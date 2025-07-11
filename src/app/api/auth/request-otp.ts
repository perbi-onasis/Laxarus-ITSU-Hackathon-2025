import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/lib/prisma";
import { generateOTP } from "@/lib/auth";
import { sendSMS } from "@/lib/africastalking";

const RequestOtpSchema = z.object({
  phone: z.string().optional(),
  email: z.string().email().optional(),
});

export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsed = RequestOtpSchema.safeParse(body);
  if (!parsed.success || (!parsed.data.phone && !parsed.data.email)) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const { phone, email } = parsed.data;
  const otp = generateOTP();

  // Store OTP in DB (for demo, store in User table, production: use a separate OTP table with expiry)
  let user = await prisma.user.findFirst({
    where: { OR: [{ phone }, { email }] },
  });
  if (!user) {
    user = await prisma.user.create({
      data: {
        phone,
        email,
        // role defaults to USER
      },
    });
  }
  await prisma.user.update({
    where: { id: user.id },
    data: { password: otp }, // Not secure, just for demo. Use a separate OTP table in production.
  });

  if (phone) {
    await sendSMS(phone, `Your TTU Docs OTP is: ${otp}`);
  }
  // For email, you would integrate an email provider here.

  return NextResponse.json({ success: true });
}
