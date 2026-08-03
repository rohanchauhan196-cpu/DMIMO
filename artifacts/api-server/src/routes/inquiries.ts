import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, inquiriesTable } from "@workspace/db";
import { CreateInquiryBody, UpdateInquiryBody } from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/inquiries", async (_req, res): Promise<void> => {
  const inquiries = await db.select().from(inquiriesTable).orderBy(inquiriesTable.createdAt);
  res.json(inquiries);
});

router.post("/inquiries", async (req, res): Promise<void> => {
  const parsed = CreateInquiryBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [inquiry] = await db.insert(inquiriesTable).values({
    ...parsed.data,
    status: "new",
  }).returning();
  res.status(201).json(inquiry);
});

router.patch("/inquiries/:id", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }
  const parsed = UpdateInquiryBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [inquiry] = await db.update(inquiriesTable).set(parsed.data).where(eq(inquiriesTable.id, id)).returning();
  if (!inquiry) { res.status(404).json({ error: "Inquiry not found" }); return; }
  res.json(inquiry);
});

router.delete("/inquiries/:id", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }
  const [inquiry] = await db.delete(inquiriesTable).where(eq(inquiriesTable.id, id)).returning();
  if (!inquiry) { res.status(404).json({ error: "Inquiry not found" }); return; }
  res.sendStatus(204);
});

export default router;
