import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { authMiddleware } from "@/middleware/auth";
import { uploadFileToGCS } from "@/lib/gcs";

export const config = {
  api: {
    bodyParser: false, // Required for file uploads
  },
};

export async function POST(req: NextRequest) {
  const user = await authMiddleware(req);
  if (!user || (user as any).error) return user;

  // Parse multipart form data (Next.js API routes require a custom parser)
  const formData = await req.formData();
  const file = formData.get("file") as File;
  if (!file) {
    return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
  }
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const destination = `ghana-cards/${(user as any).id}-${Date.now()}`;
  const url = await uploadFileToGCS(buffer, destination, file.type);

  await prisma.user.update({
    where: { id: (user as any).id },
    data: { ghanaCardUrl: url },
  });

  return NextResponse.json({ url });
}
