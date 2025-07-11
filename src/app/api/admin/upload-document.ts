import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { authMiddleware } from "@/middleware/auth";
import { requireRole } from "@/middleware/role";
import { uploadFileToGCS } from "@/lib/gcs";

export const config = {
  api: {
    bodyParser: false, // Required for file uploads
  },
};

export async function POST(req: NextRequest) {
  const user = await authMiddleware(req);
  if (!user || (user as any).error) return user;
  const roleCheck = requireRole(user, "ADMIN");
  if (roleCheck !== true) return roleCheck;

  const formData = await req.formData();
  const file = formData.get("file") as File;
  const requestId = formData.get("requestId") as string;
  if (!file || !requestId) {
    return NextResponse.json(
      { error: "File and requestId required" },
      { status: 400 }
    );
  }
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const destination = `final-documents/${requestId}-${Date.now()}`;
  const url = await uploadFileToGCS(buffer, destination, file.type);

  const updated = await prisma.documentRequest.update({
    where: { id: requestId },
    data: { documentUrl: url },
  });

  return NextResponse.json({ url, request: updated });
}
