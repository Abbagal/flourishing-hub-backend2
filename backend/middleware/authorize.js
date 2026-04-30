import { StatusCodes } from "http-status-codes";

import { ApiError } from "../utils/ApiError.js";

export const authorize = (...roles) => (req, _res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    throw new ApiError(StatusCodes.FORBIDDEN, "You do not have access to this resource");
  }

  next();
};



