import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { authMiddleware } from "@/middleware/auth";
import { requireRole } from "@/middleware/role";

export async function GET(req: NextRequest) {
  const user = await authMiddleware(req);
  if (!user || (user as any).error) return user;
  const roleCheck = requireRole(user, "ADMIN");
  if (roleCheck !== true) return roleCheck;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [pendingCount, todayCount, recentActivity] = await Promise.all([
    prisma.documentRequest.count({ where: { status: "PENDING" } }),
    prisma.documentRequest.count({ where: { createdAt: { gte: today } } }),
    prisma.documentRequest.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      include: { user: { select: { email: true } } },
    }),
  ]);

  return NextResponse.json({
    pendingCount,
    todayCount,
    recentActivity,
  });
}