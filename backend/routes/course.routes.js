import express from "express";
import * as courseController from "../controllers/course.controller.js";
import { authenticate } from "../middleware/auth.js";

const router = express.Router();

// All course routes require authentication
router.use(authenticate);

// Get all courses
router.get("/", courseController.getAllCourses);

// Get course by ID
router.get("/:courseId", courseController.getCourseById);

// Create course (admin only)
router.post("/", courseController.createCourse);

// Update course (admin only)
router.put("/:courseId", courseController.updateCourse);

// Delete course (admin only)
router.delete("/:courseId", courseController.deleteCourse);

export default router;
