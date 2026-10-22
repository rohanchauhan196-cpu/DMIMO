import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type");

  const categories = await prisma.category.findMany({
    where: type ? { type: type === "BLOG" ? "BLOG" : "PROJECT" } : undefined,
    orderBy: { order: "asc" },
  });
  return NextResponse.json({ data: categories });
}
