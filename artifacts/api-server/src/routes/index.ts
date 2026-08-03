import { Router, type IRouter } from "express";
import healthRouter from "./health";
import projectsRouter from "./projects";
import blogsRouter from "./blogs";
import teamRouter from "./team";
import settingsRouter from "./settings";
import inquiriesRouter from "./inquiries";
import adminRouter from "./admin";

const router: IRouter = Router();

router.use(healthRouter);
router.use(projectsRouter);
router.use(blogsRouter);
router.use(teamRouter);
router.use(settingsRouter);
router.use(inquiriesRouter);
router.use(adminRouter);

export default router;
