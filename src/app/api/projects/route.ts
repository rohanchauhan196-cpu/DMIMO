import { NextResponse } from "next/server";
import { getProjects } from "@/lib/data";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category") ?? undefined;
  const featuredParam = searchParams.get("featured");
  const featured = featuredParam === null ? undefined : featuredParam === "true";

  const projects = await getProjects({ category, featured });
  return NextResponse.json({ data: projects });
}
