import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyPaystackSignature } from "@/lib/paystack";
import { notifyPayment } from "@/lib/notifications";

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(req: NextRequest) {
  const body = await req.json();
  if (!verifyPaystackSignature(req)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  if (body.event === "charge.success") {
    const reference = body.data.reference;
    const updated = await prisma.documentRequest.updateMany({
      where: { paymentRef: reference },
      data: { status: "PAID", paid: true },
    });
    // Notify user (find request and user)
    const reqs = await prisma.documentRequest.findMany({
      where: { paymentRef: reference },
    });
    for (const req of reqs) {
      await notifyPayment(req.userId, req.type);
    }
  }

  return NextResponse.json({ received: true });
}
