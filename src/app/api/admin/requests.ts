import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { authMiddleware } from "@/middleware/auth";
import { requireRole } from "@/middleware/role";

export async function GET(req: NextRequest) {
  const user = await authMiddleware(req);
  if (!user || (user as any).error) return user;
  const roleCheck = requireRole(user, "ADMIN");
  if (roleCheck !== true) return roleCheck;

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");
  const where = status ? { status: status as any } : undefined;

  const requests = await prisma.documentRequest.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: { user: true },
  });
  return NextResponse.json({ requests });
}
