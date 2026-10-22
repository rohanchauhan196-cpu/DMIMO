import { NextResponse } from "next/server";
import { unlink } from "fs/promises";
import path from "path";
import { del } from "@vercel/blob";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-guard";

type Params = { params: Promise<{ id: string }> };

export async function DELETE(_req: Request, { params }: Params) {
  const { response } = await requireAdmin();
  if (response) return response;

  const { id } = await params;
  const asset = await prisma.mediaAsset.findUnique({ where: { id } });
  if (!asset) return NextResponse.json({ error: "Not found" }, { status: 404 });

  if (asset.url.startsWith("/uploads/")) {
    const filePath = path.join(process.cwd(), "public", asset.url);
    await unlink(filePath).catch(() => {});
  } else if (asset.url.includes(".blob.vercel-storage.com/") && process.env.BLOB_READ_WRITE_TOKEN) {
    await del(asset.url).catch(() => {});
  }

  await prisma.mediaAsset.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
