import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-guard";
import { blogSchema } from "@/lib/validation";

export async function GET() {
  const { response } = await requireAdmin();
  if (response) return response;

  const blogs = await prisma.blog.findMany({
    include: { category: true },
    orderBy: { publishedAt: "desc" },
  });
  return NextResponse.json({ data: blogs });
}

export async function POST(req: Request) {
  const { response } = await requireAdmin();
  if (response) return response;

  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Invalid body" }, { status: 400 });

  const parsed = blogSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Validation failed", issues: parsed.error.flatten().fieldErrors }, { status: 422 });
  }

  const existing = await prisma.blog.findUnique({ where: { slug: parsed.data.slug } });
  if (existing) {
    return NextResponse.json({ error: "A blog post with this slug already exists" }, { status: 409 });
  }

  const data = parsed.data;
  const blog = await prisma.blog.create({
    data: {
      ...data,
      seoTitle: data.seoTitle || null,
      seoDescription: data.seoDescription || null,
      publishedAt: data.publishedAt ?? new Date(),
    },
    include: { category: true },
  });

  return NextResponse.json({ data: blog }, { status: 201 });
}
