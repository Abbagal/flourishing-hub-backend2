import { StatusCodes } from "http-status-codes";
import { asyncHandler } from "../utils/asyncHandler.js";
import {
  getAllVideos,
  getVideoById,
  incrementVideoView,
  createVideo,
  updateVideo,
  deleteVideo
} from "../services/video.service.js";

// Get all videos
export const getVideosController = asyncHandler(async (req, res) => {
  const { category } = req.query;
  const videos = await getAllVideos(category);

  res.status(StatusCodes.OK).json({
    success: true,
    data: videos
  });
});

// Get video by ID
export const getVideoByIdController = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const video = await getVideoById(videoId);

  res.status(StatusCodes.OK).json({
    success: true,
    data: video
  });
});

// Increment video view
export const incrementVideoViewController = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const video = await incrementVideoView(videoId);

  res.status(StatusCodes.OK).json({
    success: true,
    data: video
  });
});

// Create video (admin only)
export const createVideoController = asyncHandler(async (req, res) => {
  const video = await createVideo(req.body);

  res.status(StatusCodes.CREATED).json({
    success: true,
    message: "Video created successfully",
    data: video
  });
});

// Update video (admin only)
export const updateVideoController = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const video = await updateVideo(videoId, req.body);

  res.status(StatusCodes.OK).json({
    success: true,
    message: "Video updated successfully",
    data: video
  });
});

// Delete video (admin only)
export const deleteVideoController = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  await deleteVideo(videoId);

  res.status(StatusCodes.OK).json({
    success: true,
    message: "Video deleted successfully"
  });
});
