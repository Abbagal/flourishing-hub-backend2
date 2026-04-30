import { StatusCodes } from "http-status-codes";

import {
  getAdminDashboard,
  getStaffDashboard,
  getStudentDashboard
} from "../services/dashboard.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const myDashboardController = asyncHandler(async (req, res) => {
  let data;

  if (req.user.role === "ADMIN") {
    data = await getAdminDashboard();
  } else if (["INSTRUCTOR", "VOLUNTEER"].includes(req.user.role)) {
    data = await getStaffDashboard(req.user.id);
  } else {
    data = await getStudentDashboard(req.user.id);
  }

  res.status(StatusCodes.OK).json({
    success: true,
    data
  });
});



