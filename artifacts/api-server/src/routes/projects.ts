import { Router, type IRouter } from "express";
import { eq, or } from "drizzle-orm";
import { db, projectsTable } from "@workspace/db";
import {
  CreateProjectBody,
  UpdateProjectBody,
} from "@workspace/api-zod";

const router: IRouter = Router();

function makeSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

router.get("/projects", async (req, res): Promise<void> => {
  const { status } = req.query as { status?: string };
  let projects;
  if (status === "published" || status === "draft") {
    projects = await db.select().from(projectsTable).where(eq(projectsTable.status, status)).orderBy(projectsTable.sortOrder, projectsTable.createdAt);
  } else {
    projects = await db.select().from(projectsTable).orderBy(projectsTable.sortOrder, projectsTable.createdAt);
  }
  res.json(projects);
});

router.post("/projects", async (req, res): Promise<void> => {
  const parsed = CreateProjectBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const data = parsed.data;
  const slug = data.slug || makeSlug(data.title);
  const [project] = await db.insert(projectsTable).values({
    ...data,
    slug,
    status: data.status ?? "draft",
    featured: data.featured ?? false,
    images: data.images ?? [],
    tags: data.tags ?? [],
    sortOrder: data.sortOrder ?? 0,
  }).returning();
  res.status(201).json(project);
});

router.get("/projects/:id", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const numId = parseInt(raw, 10);
  const [project] = await db.select().from(projectsTable).where(
    isNaN(numId) ? eq(projectsTable.slug, raw) : or(eq(projectsTable.id, numId), eq(projectsTable.slug, raw))
  );
  if (!project) {
    res.status(404).json({ error: "Project not found" });
    return;
  }
  res.json(project);
});

router.patch("/projects/:id", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }
  const parsed = UpdateProjectBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [project] = await db.update(projectsTable).set({ ...parsed.data, updatedAt: new Date() }).where(eq(projectsTable.id, id)).returning();
  if (!project) { res.status(404).json({ error: "Project not found" }); return; }
  res.json(project);
});

router.delete("/projects/:id", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }
  const [project] = await db.delete(projectsTable).where(eq(projectsTable.id, id)).returning();
  if (!project) { res.status(404).json({ error: "Project not found" }); return; }
  res.sendStatus(204);
});

export default router;
