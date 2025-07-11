import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { authMiddleware } from "@/middleware/auth";
import { requireRole } from "@/middleware/role";
import { z } from "zod";
import {
  notifyApproval,
  notifyRejection,
  notifyDelivery,
} from "@/lib/notifications";

const UpdateStatusSchema = z.object({
  requestId: z.string(),
  status: z.enum(["APPROVED", "REJECTED", "DELIVERED"]),
  rejectionReason: z.string().optional(),
});

export async function POST(req: NextRequest) {
  const user = await authMiddleware(req);
  if (!user || (user as any).error) return user;
  const roleCheck = requireRole(user, "ADMIN");
  if (roleCheck !== true) return roleCheck;

  const body = await req.json();
  const parsed = UpdateStatusSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const { requestId, status, rejectionReason } = parsed.data;
  const data: any = { status };
  if (status === "REJECTED") data.rejectionReason = rejectionReason;

  const updated = await prisma.documentRequest.update({
    where: { id: requestId },
    data,
  });

  // Send SMS notification
  if (status === "APPROVED") await notifyApproval(updated.userId, updated.type);
  if (status === "REJECTED")
    await notifyRejection(updated.userId, updated.type, rejectionReason || "");
  if (status === "DELIVERED")
    await notifyDelivery(updated.userId, updated.type);

  return NextResponse.json({ request: updated });
}
