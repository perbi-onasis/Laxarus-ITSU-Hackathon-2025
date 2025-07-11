import { NextRequest, NextResponse } from "next/server";
import { verifyJWT } from "@/lib/auth";

export async function authMiddleware(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const token = authHeader.replace("Bearer ", "");
  try {
    const user = verifyJWT(token);
    // Attach user to request (Next.js API doesn't support mutating req, so pass user in context or re-verify in handler)
    return user;
  } catch (e) {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }
}
