import { Router } from "express";
import { adminUserGuard } from "../Middleware/guard.middleware.js";
import { getReport } from "./dashboard.controller.js";

const dashboardRouter = Router();

dashboardRouter.get("/report", adminUserGuard, getReport);

export default dashboardRouter;
