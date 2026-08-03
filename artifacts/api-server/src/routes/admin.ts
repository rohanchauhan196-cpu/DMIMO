import { Router, type IRouter } from "express";
import { AdminLoginBody } from "@workspace/api-zod";

const router: IRouter = Router();

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "dmimo-admin-2024";

router.post("/admin/login", async (req, res): Promise<void> => {
  const parsed = AdminLoginBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  if (parsed.data.password !== ADMIN_PASSWORD) {
    res.status(401).json({ error: "Invalid credentials" });
    return;
  }
  (req.session as unknown as Record<string, unknown>).isAdmin = true;
  res.json({ authenticated: true });
});

router.post("/admin/logout", async (req, res): Promise<void> => {
  req.session.destroy(() => {
    res.json({ authenticated: false });
  });
});

router.get("/admin/me", async (req, res): Promise<void> => {
  const isAdmin = !!(req.session as unknown as Record<string, unknown>).isAdmin;
  res.json({ authenticated: isAdmin });
});

export default router;
