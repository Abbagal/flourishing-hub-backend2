import multer from "multer";

import { ApiError } from "../utils/ApiError.js";

const allowedMimeTypes = new Set([
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "text/csv",
  "application/csv"
]);

const storage = multer.memoryStorage();

const fileFilter = (_req, file, cb) => {
  const isAllowedExtension = /\.(xlsx|csv)$/i.test(file.originalname || "");

  if (allowedMimeTypes.has(file.mimetype) || isAllowedExtension) {
    cb(null, true);
    return;
  }

  cb(new ApiError(400, "Only .xlsx or .csv files are allowed"));
};

export const spreadsheetUpload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024
  },
  fileFilter
});
