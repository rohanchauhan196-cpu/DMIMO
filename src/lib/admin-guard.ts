import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

/** Returns the session if the request is from an authenticated admin, otherwise an unauthorized response. */
export async function requireAdmin() {
  const session = await auth();
  if (!session?.user) {
    return { session: null, response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  }
  return { session, response: null };
}
