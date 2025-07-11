import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { authMiddleware } from "@/middleware/auth";
import { initiatePaystackTransaction } from "@/lib/paystack";
import { z } from "zod";

const InitiateSchema = z.object({
  requestId: z.string(),
  email: z.string().email(),
  amount: z.number().min(1),
});

export async function POST(req: NextRequest) {
  const user = await authMiddleware(req);
  if (!user || (user as any).error) return user;

  const body = await req.json();
  const parsed = InitiateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const { requestId, email, amount } = parsed.data;
  const reference = `${requestId}-${Date.now()}`;
  const callback_url = process.env.PAYSTACK_CALLBACK_URL!;
  const paystackRes = await initiatePaystackTransaction(
    email,
    amount,
    reference,
    callback_url
  );

  await prisma.documentRequest.update({
    where: { id: requestId },
    data: { paymentRef: reference },
  });

  return NextResponse.json({ url: paystackRes.data.authorization_url });
}
