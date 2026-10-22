import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-guard";
import { categorySchema } from "@/lib/validation";

type Params = { params: Promise<{ id: string }> };

export async function PUT(req: Request, { params }: Params) {
  const { response } = await requireAdmin();
  if (response) return response;

  const { id } = await params;
  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Invalid body" }, { status: 400 });

  const parsed = categorySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Validation failed", issues: parsed.error.flatten().fieldErrors }, { status: 422 });
  }

  const slugOwner = await prisma.category.findUnique({ where: { slug: parsed.data.slug } });
  if (slugOwner && slugOwner.id !== id) {
    return NextResponse.json({ error: "A category with this slug already exists" }, { status: 409 });
  }

  const category = await prisma.category.update({ where: { id }, data: parsed.data });
  return NextResponse.json({ data: category });
}

export async function DELETE(_req: Request, { params }: Params) {
  const { response } = await requireAdmin();
  if (response) return response;

  const { id } = await params;
  const [projectCount, blogCount] = await Promise.all([
    prisma.project.count({ where: { categoryId: id } }),
    prisma.blog.count({ where: { categoryId: id } }),
  ]);
  if (projectCount > 0 || blogCount > 0) {
    return NextResponse.json(
      { error: "This category is still in use by projects or blog posts and cannot be deleted." },
      { status: 409 }
    );
  }

  await prisma.category.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
