import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-guard";
import { serviceSchema } from "@/lib/validation";

export async function GET() {
  const { response } = await requireAdmin();
  if (response) return response;

  const services = await prisma.service.findMany({ orderBy: { order: "asc" } });
  return NextResponse.json({ data: services });
}

export async function POST(req: Request) {
  const { response } = await requireAdmin();
  if (response) return response;

  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Invalid body" }, { status: 400 });

  const parsed = serviceSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Validation failed", issues: parsed.error.flatten().fieldErrors }, { status: 422 });
  }

  const existing = await prisma.service.findUnique({ where: { slug: parsed.data.slug } });
  if (existing) {
    return NextResponse.json({ error: "A service with this slug already exists" }, { status: 409 });
  }

  const service = await prisma.service.create({ data: parsed.data });
  return NextResponse.json({ data: service }, { status: 201 });
}
