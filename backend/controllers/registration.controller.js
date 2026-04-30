import { StatusCodes } from "http-status-codes";

import { listMyRegistrations, registerForEvent } from "../services/registration.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const registerForEventController = asyncHandler(async (req, res) => {
  const data = await registerForEvent(req.validated.body, req.user);
  res.status(StatusCodes.CREATED).json({
    success: true,
    message: "Registered for event successfully",
    data
  });
});

export const myRegistrationsController = asyncHandler(async (req, res) => {
  const data = await listMyRegistrations(req.user.id);
  res.status(StatusCodes.OK).json({
    success: true,
    data
  });
});



