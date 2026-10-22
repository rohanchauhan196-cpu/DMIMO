import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-guard";
import { projectSchema } from "@/lib/validation";

export async function GET() {
  const { response } = await requireAdmin();
  if (response) return response;

  const projects = await prisma.project.findMany({
    include: { category: true, gallery: true },
    orderBy: { order: "asc" },
  });
  return NextResponse.json({ data: projects });
}

export async function POST(req: Request) {
  const { response } = await requireAdmin();
  if (response) return response;

  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Invalid body" }, { status: 400 });

  const parsed = projectSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Validation failed", issues: parsed.error.flatten().fieldErrors }, { status: 422 });
  }

  const existing = await prisma.project.findUnique({ where: { slug: parsed.data.slug } });
  if (existing) {
    return NextResponse.json({ error: "A project with this slug already exists" }, { status: 409 });
  }

  const { gallery, ...data } = parsed.data;

  const project = await prisma.project.create({
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

  return NextResponse.json({ data: project }, { status: 201 });
}
