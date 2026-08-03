import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, teamTable } from "@workspace/db";
import {
  CreateTeamMemberBody,
  UpdateTeamMemberBody,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/team", async (_req, res): Promise<void> => {
  const members = await db.select().from(teamTable).orderBy(teamTable.sortOrder, teamTable.createdAt);
  res.json(members);
});

router.post("/team", async (req, res): Promise<void> => {
  const parsed = CreateTeamMemberBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [member] = await db.insert(teamTable).values({
    ...parsed.data,
    sortOrder: parsed.data.sortOrder ?? 0,
  }).returning();
  res.status(201).json(member);
});

router.get("/team/:id", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }
  const [member] = await db.select().from(teamTable).where(eq(teamTable.id, id));
  if (!member) { res.status(404).json({ error: "Team member not found" }); return; }
  res.json(member);
});

router.patch("/team/:id", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }
  const parsed = UpdateTeamMemberBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [member] = await db.update(teamTable).set({ ...parsed.data, updatedAt: new Date() }).where(eq(teamTable.id, id)).returning();
  if (!member) { res.status(404).json({ error: "Team member not found" }); return; }
  res.json(member);
});

router.delete("/team/:id", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }
  const [member] = await db.delete(teamTable).where(eq(teamTable.id, id)).returning();
  if (!member) { res.status(404).json({ error: "Team member not found" }); return; }
  res.sendStatus(204);
});

export default router;
