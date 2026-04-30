import { Router } from "express";

import {
  myRegistrationsController,
  registerForEventController
} from "../controllers/registration.controller.js";
import { authenticate } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { registerForEventSchema } from "../validators/registration.validation.js";

export const registrationRoutes = Router();

registrationRoutes.use(authenticate);
registrationRoutes.get("/me", myRegistrationsController);
registrationRoutes.post("/", validate(registerForEventSchema), registerForEventController);




