import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-guard";
import { blogSchema } from "@/lib/validation";

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: Request, { params }: Params) {
  const { response } = await requireAdmin();
  if (response) return response;

  const { id } = await params;
  const blog = await prisma.blog.findUnique({ where: { id }, include: { category: true } });
  if (!blog) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ data: blog });
}

export async function PUT(req: Request, { params }: Params) {
  const { response } = await requireAdmin();
  if (response) return response;

  const { id } = await params;
  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Invalid body" }, { status: 400 });

  const parsed = blogSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Validation failed", issues: parsed.error.flatten().fieldErrors }, { status: 422 });
  }

  const slugOwner = await prisma.blog.findUnique({ where: { slug: parsed.data.slug } });
  if (slugOwner && slugOwner.id !== id) {
    return NextResponse.json({ error: "A blog post with this slug already exists" }, { status: 409 });
  }

  const data = parsed.data;
  const blog = await prisma.blog.update({
    where: { id },
    data: {
      ...data,
      seoTitle: data.seoTitle || null,
      seoDescription: data.seoDescription || null,
      ...(data.publishedAt ? { publishedAt: data.publishedAt } : {}),
    },
    include: { category: true },
  });

  return NextResponse.json({ data: blog });
}

export async function DELETE(_req: Request, { params }: Params) {
  const { response } = await requireAdmin();
  if (response) return response;

  const { id } = await params;
  await prisma.blog.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
