import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import sharp from "sharp";
import { put } from "@vercel/blob";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-guard";

const ALLOWED_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};

// On Vercel, uploads go to Vercel Blob (serverless disks are not persistent) and
// request bodies are capped at 4.5 MB. On a normal server they are saved to public/uploads.
const USE_BLOB = Boolean(process.env.BLOB_READ_WRITE_TOKEN);
const MAX_SIZE = USE_BLOB ? 4 * 1024 * 1024 : 10 * 1024 * 1024;

export async function POST(req: Request) {
  const { response } = await requireAdmin();
  if (response) return response;

  const formData = await req.formData().catch(() => null);
  const file = formData?.get("file");

  if (!file || !(file instanceof File)) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  const extension = ALLOWED_TYPES[file.type];
  if (!extension) {
    return NextResponse.json({ error: "Unsupported file type. Use JPEG, PNG, WebP or GIF." }, { status: 415 });
  }

  if (file.size > MAX_SIZE) {
    return NextResponse.json(
      { error: `File is too large. Maximum size is ${MAX_SIZE / (1024 * 1024)}MB.` },
      { status: 413 },
    );
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const filename = `${randomUUID()}.${extension}`;

  let url: string;
  if (USE_BLOB) {
    const blob = await put(`uploads/${filename}`, buffer, {
      access: "public",
      contentType: file.type,
    });
    url = blob.url;
  } else {
    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    await mkdir(uploadsDir, { recursive: true });
    await writeFile(path.join(uploadsDir, filename), buffer);
    url = `/uploads/${filename}`;
  }

  let width: number | undefined;
  let height: number | undefined;
  try {
    const meta = await sharp(buffer).metadata();
    width = meta.width;
    height = meta.height;
  } catch {
    // dimension probing is best-effort only
  }

  const asset = await prisma.mediaAsset.create({
    data: {
      url,
      filename: file.name,
      width,
      height,
      size: file.size,
    },
  });

  return NextResponse.json({ data: asset }, { status: 201 });
}
