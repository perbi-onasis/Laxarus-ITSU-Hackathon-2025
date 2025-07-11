import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { authMiddleware } from "@/middleware/auth";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const user = await authMiddleware(req);
  if (!user || (user as any).error) return user;

  const { id } = params;
  const request = await prisma.documentRequest.findUnique({ where: { id } });
  if (!request || request.userId !== (user as any).id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json({ request });
}
