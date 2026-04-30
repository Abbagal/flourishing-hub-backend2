import { Router } from "express";

import {
  frontendAssignStaffController,
  frontendAttendanceController,
  frontendAttendanceUpdateController,
  frontendAvailabilityController,
  frontendCheckInController,
  frontendDashboardController,
  frontendEventRegistrationController,
  frontendFeedbackController,
  frontendEventsController,
  frontendLoginController,
  frontendManageEventController,
  frontendMeController,
  frontendRefreshController,
  frontendReviewCheckInController,
  frontendSelfAssignController,
  frontendSessionStartController,
  frontendSessionToggleController,
  frontendVolunteerRegistrationController
} from "../controllers/frontend.controller.js";
import { authenticate } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import {
  frontendAssignStaffSchema,
  frontendAttendanceSchema,
  frontendAttendanceUpdateSchema,
  frontendAvailabilitySchema,
  frontendCheckInSchema,
  frontendEventRegistrationSchema,
  frontendFeedbackSchema,
  frontendLoginSchema,
  frontendManageEventSchema,
  frontendRefreshSchema,
  frontendReviewCheckInSchema,
  frontendSelfAssignSchema,
  frontendSessionStartSchema,
  frontendSessionToggleSchema,
  frontendVolunteerRegistrationSchema
} from "../validators/frontend.validation.js";

export const frontendRoutes = Router();

frontendRoutes.post("/auth/login", validate(frontendLoginSchema), frontendLoginController);
frontendRoutes.post("/auth/refresh", validate(frontendRefreshSchema), frontendRefreshController);
frontendRoutes.get("/auth/me", authenticate, frontendMeController);
frontendRoutes.get("/dashboard", authenticate, frontendDashboardController);
frontendRoutes.get("/events", authenticate, frontendEventsController);
frontendRoutes.get(
  "/events/:eventId/manage",
  authenticate,
  validate(frontendManageEventSchema),
  frontendManageEventController
);
frontendRoutes.post(
  "/events/:eventId/register",
  authenticate,
  validate(frontendEventRegistrationSchema),
  frontendEventRegistrationController
);
frontendRoutes.post(
  "/events/:eventId/volunteer",
  authenticate,
  validate(frontendVolunteerRegistrationSchema),
  frontendVolunteerRegistrationController
);
frontendRoutes.post(
  "/events/:eventId/check-in",
  authenticate,
  validate(frontendCheckInSchema),
  frontendCheckInController
);
frontendRoutes.post(
  "/events/:eventId/attendance",
  authenticate,
  validate(frontendAttendanceUpdateSchema),
  frontendAttendanceUpdateController
);
frontendRoutes.post(
  "/events/:eventId/availability",
  authenticate,
  validate(frontendAvailabilitySchema),
  frontendAvailabilityController
);
frontendRoutes.post(
  "/events/:eventId/self-assign",
  authenticate,
  validate(frontendSelfAssignSchema),
  frontendSelfAssignController
);
frontendRoutes.post(
  "/events/:eventId/assignments",
  authenticate,
  validate(frontendAssignStaffSchema),
  frontendAssignStaffController
);
frontendRoutes.post(
  "/events/:eventId/feedback",
  authenticate,
  validate(frontendFeedbackSchema),
  frontendFeedbackController
);
frontendRoutes.post(
  "/check-ins/:checkInId/review",
  authenticate,
  validate(frontendReviewCheckInSchema),
  frontendReviewCheckInController
);
frontendRoutes.post(
  "/sessions/:sessionId/start",
  authenticate,
  validate(frontendSessionStartSchema),
  frontendSessionStartController
);
frontendRoutes.post(
  "/sessions/:sessionId/attendance",
  authenticate,
  validate(frontendAttendanceSchema),
  frontendAttendanceController
);
frontendRoutes.post(
  "/sessions/:sessionId/toggle",
  authenticate,
  validate(frontendSessionToggleSchema),
  frontendSessionToggleController
);
