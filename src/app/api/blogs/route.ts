import { NextResponse } from "next/server";
import { getBlogs } from "@/lib/data";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category") ?? undefined;
  const page = Number(searchParams.get("page") ?? 1) || 1;

  const result = await getBlogs({ category, page });
  return NextResponse.json({ data: result.items, meta: { total: result.total, page: result.page, totalPages: result.totalPages } });
}
