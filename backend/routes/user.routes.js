import { Router } from "express";

import {
  exportUsersController,
  getUserController,
  listUsersController,
  updateUserProfileController,
  updateUserRoleController
} from "../controllers/user.controller.js";
import { authenticate } from "../middleware/auth.js";
import { authorize } from "../middleware/authorize.js";
import { validate } from "../middleware/validate.js";
import {
  listUsersSchema,
  updateUserProfileSchema,
  updateUserRoleSchema,
  userIdSchema
} from "../validators/user.validation.js";

export const userRoutes = Router();

userRoutes.use(authenticate);
userRoutes.get("/directory/export", authorize("ADMIN"), validate(listUsersSchema), exportUsersController);
userRoutes.get("/", authorize("ADMIN"), validate(listUsersSchema), listUsersController);
userRoutes.get("/:userId", authorize("ADMIN"), validate(userIdSchema), getUserController);
userRoutes.patch(
  "/:userId/profile",
  authorize("ADMIN"),
  validate(updateUserProfileSchema),
  updateUserProfileController
);
userRoutes.patch(
  "/:userId/role",
  authorize("ADMIN"),
  validate(updateUserRoleSchema),
  updateUserRoleController
);
