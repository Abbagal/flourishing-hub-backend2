import { StatusCodes } from "http-status-codes";

import {
  assignFrontendEventStaff,
  createFrontendEventCheckIn,
  refreshFrontendSession,
  getFrontendDashboard,
  getFrontendEventManagement,
  getFrontendMe,
  listFrontendEvents,
  loginForFrontend,
  saveFrontendAttendance,
  saveFrontendAvailability,
  startFrontendSession,
  submitFrontendEventFeedback,
  toggleFrontendEventRegistration,
  toggleFrontendSessionState,
  toggleFrontendVolunteerRegistration,
  updateFrontendAttendanceRecord,
  selfAssignFrontendEvent,
  reviewFrontendCheckIn
} from "../services/frontend.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const frontendLoginController = asyncHandler(async (req, res) => {
  const data = await loginForFrontend(req.validated.body);
  res.status(StatusCodes.OK).json({
    success: true,
    message: "Frontend login successful",
    data
  });
});

export const frontendMeController = asyncHandler(async (req, res) => {
  const data = await getFrontendMe(req.user, req.frontendRole);
  res.status(StatusCodes.OK).json({
    success: true,
    data
  });
});

export const frontendRefreshController = asyncHandler(async (req, res) => {
  const data = await refreshFrontendSession(req.validated.body.refreshToken);
  res.status(StatusCodes.OK).json({
    success: true,
    message: "Frontend session refreshed successfully",
    data
  });
});

export const frontendDashboardController = asyncHandler(async (req, res) => {
  const data = await getFrontendDashboard(req.user, req.frontendRole);
  res.status(StatusCodes.OK).json({
    success: true,
    data
  });
});

export const frontendEventsController = asyncHandler(async (req, res) => {
  const data = await listFrontendEvents(req.user, req.frontendRole);
  res.status(StatusCodes.OK).json({
    success: true,
    data
  });
});

export const frontendVolunteerRegistrationController = asyncHandler(async (req, res) => {
  const data = await toggleFrontendVolunteerRegistration(
    req.validated.params.eventId,
    req.user,
    req.validated.body.register
  );

  res.status(StatusCodes.OK).json({
    success: true,
    message: data.registered ? "Volunteer registration saved" : "Volunteer registration removed",
    data
  });
});

export const frontendEventRegistrationController = asyncHandler(async (req, res) => {
  const data = await toggleFrontendEventRegistration(
    req.validated.params.eventId,
    req.user,
    req.validated.body.register,
    req.validated.body.moduleId
  );

  res.status(StatusCodes.OK).json({
    success: true,
    message: data.registered ? "Event registration saved" : "Event registration removed",
    data
  });
});

export const frontendAttendanceController = asyncHandler(async (req, res) => {
  const data = await saveFrontendAttendance(
    req.validated.params.sessionId,
    req.validated.body.entries,
    req.user,
    req.validated.body.source
  );

  res.status(StatusCodes.OK).json({
    success: true,
    message: "Attendance saved",
    data
  });
});

export const frontendSessionToggleController = asyncHandler(async (req, res) => {
  const data = await toggleFrontendSessionState(
    req.validated.params.sessionId,
    req.validated.body
  );

  res.status(StatusCodes.OK).json({
    success: true,
    message: `${req.validated.body.type === "quiz" ? "Quiz" : "Feedback"} state updated`,
    data
  });
});

export const frontendSessionStartController = asyncHandler(async (req, res) => {
  const data = await startFrontendSession(req.validated.params.sessionId);

  res.status(StatusCodes.OK).json({
    success: true,
    message: "Session started successfully",
    data
  });
});

export const frontendCheckInController = asyncHandler(async (req, res) => {
  const data = await createFrontendEventCheckIn(
    req.validated.params.eventId,
    req.validated.body,
    req.user
  );

  res.status(StatusCodes.OK).json({
    success: true,
    message: "Checked in successfully",
    data
  });
});

export const frontendManageEventController = asyncHandler(async (req, res) => {
  const data = await getFrontendEventManagement(req.validated.params.eventId, req.user);
  res.status(StatusCodes.OK).json({
    success: true,
    data
  });
});

export const frontendAttendanceUpdateController = asyncHandler(async (req, res) => {
  const data = await updateFrontendAttendanceRecord(
    req.validated.params.eventId,
    req.validated.body,
    req.user
  );

  res.status(StatusCodes.OK).json({
    success: true,
    message: "Attendance updated successfully",
    data
  });
});

export const frontendAvailabilityController = asyncHandler(async (req, res) => {
  const data = await saveFrontendAvailability(
    req.validated.params.eventId,
    req.validated.body,
    req.user
  );

  res.status(StatusCodes.OK).json({
    success: true,
    message: "Availability saved successfully",
    data
  });
});

export const frontendSelfAssignController = asyncHandler(async (req, res) => {
  const data = await selfAssignFrontendEvent(
    req.validated.params.eventId,
    req.validated.body,
    req.user,
    req.frontendRole
  );

  res.status(StatusCodes.OK).json({
    success: true,
    message: "You are assigned to the event",
    data
  });
});

export const frontendAssignStaffController = asyncHandler(async (req, res) => {
  const data = await assignFrontendEventStaff(
    req.validated.params.eventId,
    req.validated.body,
    req.user
  );

  res.status(StatusCodes.OK).json({
    success: true,
    message: "Staff assigned successfully",
    data
  });
});

export const frontendReviewCheckInController = asyncHandler(async (req, res) => {
  const data = await reviewFrontendCheckIn(
    req.validated.params.checkInId,
    req.validated.body,
    req.user
  );

  res.status(StatusCodes.OK).json({
    success: true,
    message: "Check-in reviewed successfully",
    data
  });
});

export const frontendFeedbackController = asyncHandler(async (req, res) => {
  const data = await submitFrontendEventFeedback(
    req.validated.params.eventId,
    req.validated.body,
    req.user
  );

  res.status(StatusCodes.OK).json({
    success: true,
    message: "Feedback submitted successfully",
    data
  });
});
