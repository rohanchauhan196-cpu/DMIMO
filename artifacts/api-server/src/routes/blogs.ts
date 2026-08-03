import { Router, type IRouter } from "express";
import { eq, or } from "drizzle-orm";
import { db, blogsTable } from "@workspace/db";
import {
  CreateBlogBody,
  UpdateBlogBody,
} from "@workspace/api-zod";

const router: IRouter = Router();

function makeSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

router.get("/blogs", async (req, res): Promise<void> => {
  const { status } = req.query as { status?: string };
  let blogs;
  if (status === "published" || status === "draft") {
    blogs = await db.select().from(blogsTable).where(eq(blogsTable.status, status)).orderBy(blogsTable.createdAt);
  } else {
    blogs = await db.select().from(blogsTable).orderBy(blogsTable.createdAt);
  }
  res.json(blogs);
});

router.post("/blogs", async (req, res): Promise<void> => {
  const parsed = CreateBlogBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const data = parsed.data;
  const slug = data.slug || makeSlug(data.title);
  const [blog] = await db.insert(blogsTable).values({
    ...data,
    slug,
    status: data.status ?? "draft",
    featured: data.featured ?? false,
    tags: data.tags ?? [],
  }).returning();
  res.status(201).json(blog);
});

router.get("/blogs/:id", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const numId = parseInt(raw, 10);
  const [blog] = await db.select().from(blogsTable).where(
    isNaN(numId) ? eq(blogsTable.slug, raw) : or(eq(blogsTable.id, numId), eq(blogsTable.slug, raw))
  );
  if (!blog) { res.status(404).json({ error: "Blog not found" }); return; }
  res.json(blog);
});

router.patch("/blogs/:id", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }
  const parsed = UpdateBlogBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [blog] = await db.update(blogsTable).set({ ...parsed.data, updatedAt: new Date() }).where(eq(blogsTable.id, id)).returning();
  if (!blog) { res.status(404).json({ error: "Blog not found" }); return; }
  res.json(blog);
});

router.delete("/blogs/:id", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }
  const [blog] = await db.delete(blogsTable).where(eq(blogsTable.id, id)).returning();
  if (!blog) { res.status(404).json({ error: "Blog not found" }); return; }
  res.sendStatus(204);
});

export default router;
