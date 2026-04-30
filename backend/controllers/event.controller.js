import { StatusCodes } from "http-status-codes";

import {
  bulkCreateEvents,
  createEvent,
  deleteEvent,
  exportEventData,
  getEventById,
  getEventRecord,
  listEvents,
  updateEvent
} from "../services/event.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const createEventController = asyncHandler(async (req, res) => {
  const data = await createEvent(req.validated.body, req.user.id);
  res.status(StatusCodes.CREATED).json({
    success: true,
    message: "Event created successfully",
    data
  });
});

export const bulkCreateEventsController = asyncHandler(async (req, res) => {
  const data = await bulkCreateEvents(req.validated.body.events, req.user.id);
  res.status(StatusCodes.CREATED).json({
    success: true,
    message: "Bulk event creation completed",
    data
  });
});

export const listEventsController = asyncHandler(async (req, res) => {
  const data = await listEvents(req.validated.query);
  res.status(StatusCodes.OK).json({
    success: true,
    data
  });
});

export const getEventController = asyncHandler(async (req, res) => {
  const data = await getEventById(req.params.eventId);
  res.status(StatusCodes.OK).json({
    success: true,
    data
  });
});

export const updateEventController = asyncHandler(async (req, res) => {
  const data = await updateEvent(req.validated.params.eventId, req.validated.body);
  res.status(StatusCodes.OK).json({
    success: true,
    message: "Event updated successfully",
    data
  });
});

export const deleteEventController = asyncHandler(async (req, res) => {
  await deleteEvent(req.params.eventId);
  res.status(StatusCodes.OK).json({
    success: true,
    message: "Event deleted successfully"
  });
});

export const getEventRecordController = asyncHandler(async (req, res) => {
  const data = await getEventRecord(req.params.eventId);
  res.status(StatusCodes.OK).json({
    success: true,
    data
  });
});

export const exportEventDataController = asyncHandler(async (req, res) => {
  const data = await exportEventData(req.params.eventId, req.query.moduleId);
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
