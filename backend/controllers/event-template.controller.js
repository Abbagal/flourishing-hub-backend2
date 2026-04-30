import { StatusCodes } from "http-status-codes";

import { createTemplate, listTemplates } from "../services/event-template.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const createTemplateController = asyncHandler(async (req, res) => {
  const data = await createTemplate(req.validated.body, req.user.id);
  res.status(StatusCodes.CREATED).json({
    success: true,
    message: "Event template created successfully",
    data
  });
});

export const listTemplatesController = asyncHandler(async (_req, res) => {
  const data = await listTemplates();
  res.status(StatusCodes.OK).json({
    success: true,
    data
  });
});



