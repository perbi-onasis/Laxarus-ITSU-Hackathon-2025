import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { z } from "zod";
import { authMiddleware } from "@/middleware/auth";

const CreateRequestSchema = z.object({
  type: z.enum(["TRANSCRIPT", "ATTESTATION", "CERTIFICATE"]),
  ghanaCardUrl: z.string().url(),
});

export async function POST(req: NextRequest) {
  const user = await authMiddleware(req);
  if (!user || (user as any).error) return user;

  const body = await req.json();
  const parsed = CreateRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const { type, ghanaCardUrl } = parsed.data;
  const request = await prisma.documentRequest.create({
    data: {
      userId: (user as any).id,
      type,
      ghanaCardUrl,
      status: "PENDING",
    },
  });
  return NextResponse.json({ request });
}

export async function GET(req: NextRequest) {
  const user = await authMiddleware(req);
  if (!user || (user as any).error) return user;

  const requests = await prisma.documentRequest.findMany({
    where: { userId: (user as any).id },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({ requests });
}
