import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-guard";
import { categorySchema } from "@/lib/validation";

export async function GET() {
  const { response } = await requireAdmin();
  if (response) return response;

  const categories = await prisma.category.findMany({
    include: { _count: { select: { projects: true, blogs: true } } },
    orderBy: [{ type: "asc" }, { order: "asc" }],
  });
  return NextResponse.json({ data: categories });
}

export async function POST(req: Request) {
  const { response } = await requireAdmin();
  if (response) return response;

  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Invalid body" }, { status: 400 });

  const parsed = categorySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Validation failed", issues: parsed.error.flatten().fieldErrors }, { status: 422 });
  }

  const existing = await prisma.category.findUnique({ where: { slug: parsed.data.slug } });
  if (existing) {
    return NextResponse.json({ error: "A category with this slug already exists" }, { status: 409 });
  }

  const category = await prisma.category.create({ data: parsed.data });
  return NextResponse.json({ data: category }, { status: 201 });
}
