import { StatusCodes } from "http-status-codes";

import { login, refreshUserToken, register } from "../services/auth.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const registerController = asyncHandler(async (req, res) => {
  const response = await register(req.validated.body);
  res.status(StatusCodes.CREATED).json({
    success: true,
    message: "User registered successfully",
    data: response
  });
});

export const loginController = asyncHandler(async (req, res) => {
  const response = await login(req.validated.body);
  res.status(StatusCodes.OK).json({
    success: true,
    message: "Login successful",
    data: response
  });
});

export const refreshController = asyncHandler(async (req, res) => {
  const response = await refreshUserToken(req.validated.body.refreshToken);
  res.status(StatusCodes.OK).json({
    success: true,
    message: "Token refreshed successfully",
    data: response
  });
});

export const meController = asyncHandler(async (req, res) => {
  res.status(StatusCodes.OK).json({
    success: true,
    data: req.user
  });
});



