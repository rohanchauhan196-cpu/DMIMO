import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-guard";

type Params = { params: Promise<{ id: string }> };

export async function PATCH(req: Request, { params }: Params) {
  const { response } = await requireAdmin();
  if (response) return response;

  const { id } = await params;
  const body = await req.json().catch(() => ({}));
  const read = typeof body.read === "boolean" ? body.read : true;

  const submission = await prisma.contactSubmission.update({ where: { id }, data: { read } });
  return NextResponse.json({ data: submission });
}

export async function DELETE(_req: Request, { params }: Params) {
  const { response } = await requireAdmin();
  if (response) return response;

  const { id } = await params;
  await prisma.contactSubmission.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
