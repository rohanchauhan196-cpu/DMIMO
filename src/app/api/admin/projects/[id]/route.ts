import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-guard";
import { projectSchema } from "@/lib/validation";

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: Request, { params }: Params) {
  const { response } = await requireAdmin();
  if (response) return response;

  const { id } = await params;
  const project = await prisma.project.findUnique({
    where: { id },
    include: { category: true, gallery: { orderBy: { order: "asc" } } },
  });
  if (!project) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ data: project });
}

export async function PUT(req: Request, { params }: Params) {
  const { response } = await requireAdmin();
  if (response) return response;

  const { id } = await params;
  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Invalid body" }, { status: 400 });

  const parsed = projectSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Validation failed", issues: parsed.error.flatten().fieldErrors }, { status: 422 });
  }

  const slugOwner = await prisma.project.findUnique({ where: { slug: parsed.data.slug } });
  if (slugOwner && slugOwner.id !== id) {
    return NextResponse.json({ error: "A project with this slug already exists" }, { status: 409 });
  }

  const { gallery, ...data } = parsed.data;

  const project = await prisma.$transaction(async (tx) => {
    await tx.projectImage.deleteMany({ where: { projectId: id } });
    return tx.project.update({
      where: { id },
      data: {
        ...data,
        client: data.client || null,
        architect: data.architect || null,
        area: data.area || null,
        seoTitle: data.seoTitle || null,
        seoDescription: data.seoDescription || null,
        gallery: {
          create: gallery.map((g, i) => ({ url: g.url, caption: g.caption || null, layout: g.layout, order: i })),
        },
      },
      include: { category: true, gallery: true },
    });
  });

  return NextResponse.json({ data: project });
}

export async function DELETE(_req: Request, { params }: Params) {
  const { response } = await requireAdmin();
  if (response) return response;

  const { id } = await params;
  await prisma.project.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
