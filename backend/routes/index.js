import { Router } from "express";

import { authRoutes } from "./auth.routes.js";
import { dashboardRoutes } from "./dashboard.routes.js";
import { eventRoutes } from "./event.routes.js";
import { frontendRoutes } from "./frontend.routes.js";
import { importRoutes } from "./import.routes.js";
import { operationRoutes } from "./operation.routes.js";
import { registrationRoutes } from "./registration.routes.js";
import { userRoutes } from "./user.routes.js";

export const router = Router();

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/events", eventRoutes);
router.use("/event-operations", operationRoutes);
router.use("/registrations", registrationRoutes);
router.use("/dashboards", dashboardRoutes);
router.use("/imports", importRoutes);
router.use("/frontend", frontendRoutes);




