import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { contactSchema } from "@/lib/validation";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: parsed.error.flatten().fieldErrors },
      { status: 422 }
    );
  }

  const data = parsed.data;

  const submission = await prisma.contactSubmission.create({
    data: {
      name: data.name,
      email: data.email,
      phone: data.phone || undefined,
      company: data.company || undefined,
      projectType: data.projectType || undefined,
      location: data.location || undefined,
      budgetRange: data.budgetRange || undefined,
      message: data.message,
    },
  });

  return NextResponse.json({ success: true, id: submission.id }, { status: 201 });
}
