import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-guard";

export async function GET() {
  const { response } = await requireAdmin();
  if (response) return response;

  const enquiries = await prisma.contactSubmission.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json({ data: enquiries });
}
