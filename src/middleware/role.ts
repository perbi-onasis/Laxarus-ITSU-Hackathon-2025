import { NextResponse } from "next/server";

export function requireRole(user: any, role: string) {
  if (user.role !== role) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  return true;
}
