import { Router } from "express";

import { myDashboardController } from "../controllers/dashboard.controller.js";
import { authenticate } from "../middleware/auth.js";
import { cacheResponse } from "../middleware/cacheResponse.js";

export const dashboardRoutes = Router();

dashboardRoutes.get("/me", authenticate, cacheResponse("dashboard", 20), myDashboardController);




