import { StatusCodes } from "http-status-codes";
import * as courseModuleService from "../services/courseModule.service.js";

export const listModules = async (req, res, next) => {
  try {
    const { courseId } = req.params;
    const modules = await courseModuleService.getModulesByCourse(courseId);
    res.status(StatusCodes.OK).json({ success: true, data: modules });
  } catch (error) {
    next(error);
  }
};

export const getModule = async (req, res, next) => {
  try {
    const { id } = req.params;
    const module = await courseModuleService.getModuleById(id);
    res.status(StatusCodes.OK).json({ success: true, data: module });
  } catch (error) {
    next(error);
  }
};

export const createModule = async (req, res, next) => {
  try {
    const { courseId } = req.params;
    const module = await courseModuleService.createModule(courseId, req.body);
    res.status(StatusCodes.CREATED).json({
      success: true,
      data: module,
      message: "Module created successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const updateModule = async (req, res, next) => {
  try {
    const { id } = req.params;
    const module = await courseModuleService.updateModule(id, req.body);
    res.status(StatusCodes.OK).json({
      success: true,
      data: module,
      message: "Module updated successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const deleteModule = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await courseModuleService.deleteModule(id);
    res.status(StatusCodes.OK).json({ success: true, message: result.message });
  } catch (error) {
    next(error);
  }
};

export const getModuleUsage = async (req, res, next) => {
  try {
    const { id } = req.params;
    const stats = await courseModuleService.getModuleUsageStats(id);
    res.status(StatusCodes.OK).json({ success: true, data: stats });
  } catch (error) {
    next(error);
  }
};
