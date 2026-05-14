import { Router } from "express";
import { authenticate, authorize } from "../middleware/auth.js";
import {
  getVideosController,
  getVideoByIdController,
  incrementVideoViewController,
  createVideoController,
  updateVideoController,
  deleteVideoController
} from "../controllers/video.controller.js";

export const videoRoutes = Router();

// Public routes (authenticated users)
videoRoutes.get("/", authenticate, getVideosController);
videoRoutes.get("/:videoId", authenticate, getVideoByIdController);
videoRoutes.post("/:videoId/view", authenticate, incrementVideoViewController);

// Admin only routes
videoRoutes.post("/", authenticate, authorize(["ADMIN"]), createVideoController);
videoRoutes.put("/:videoId", authenticate, authorize(["ADMIN"]), updateVideoController);
videoRoutes.delete("/:videoId", authenticate, authorize(["ADMIN"]), deleteVideoController);
