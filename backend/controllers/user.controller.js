import { StatusCodes } from "http-status-codes";

import {
  exportUsers,
  getUserById,
  listUsers,
  updateUserProfile,
  updateUserRole
} from "../services/user.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const listUsersController = asyncHandler(async (req, res) => {
  const data = await listUsers(req.validated.query);
  res.status(StatusCodes.OK).json({
    success: true,
    data
  });
});

export const getUserController = asyncHandler(async (req, res) => {
  const data = await getUserById(req.validated.params.userId);
  res.status(StatusCodes.OK).json({
    success: true,
    data
  });
});

export const updateUserRoleController = asyncHandler(async (req, res) => {
  const data = await updateUserRole(req.validated.params.userId, req.validated.body.role);
  res.status(StatusCodes.OK).json({
    success: true,
    message: "User role updated successfully",
    data
  });
});

export const updateUserProfileController = asyncHandler(async (req, res) => {
  const data = await updateUserProfile(req.validated.params.userId, req.validated.body);
  res.status(StatusCodes.OK).json({
    success: true,
    message: "User profile updated successfully",
    data
  });
});

export const exportUsersController = asyncHandler(async (req, res) => {
  const data = await exportUsers(req.validated.query);
  const format = String(req.query.format || "csv").toLowerCase();

  if (format === "xlsx") {
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader("Content-Disposition", `attachment; filename="${data.fileName}.xlsx"`);
    res.status(StatusCodes.OK).send(data.xlsx);
    return;
  }

  res.setHeader("Content-Type", "text/csv; charset=utf-8");
  res.setHeader("Content-Disposition", `attachment; filename="${data.fileName}.csv"`);
  res.status(StatusCodes.OK).send(data.csv);
});
