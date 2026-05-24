import { prisma } from "../database/prisma.js";
import { ApiError } from "../utils/ApiError.js";
import { StatusCodes } from "http-status-codes";

// Get all courses
export const getAllCourses = async (filters = {}) => {
  const { status } = filters;
  
  const where = {};
  if (status) {
    where.status = status;
  }

  const courses = await prisma.course.findMany({
    where,
    orderBy: {
      createdAt: 'desc'
    }
  });

  return courses;
};

// Get course by ID
export const getCourseById = async (courseId) => {
  const course = await prisma.course.findUnique({
    where: { id: courseId }
  });

  if (!course) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Course not found");
  }

  return course;
};

// Create course
export const createCourse = async (data) => {
  const course = await prisma.course.create({
    data: {
      name: data.name,
      description: data.description,
      duration: data.duration,
      instructorName: data.instructorName,
      status: data.status || 'ACTIVE',
      startDate: data.startDate ? new Date(data.startDate) : null,
      endDate: data.endDate ? new Date(data.endDate) : null,
      capacity: data.capacity,
      enrolledCount: 0
    }
  });

  return course;
};

// Update course
export const updateCourse = async (courseId, data) => {
  const existingCourse = await prisma.course.findUnique({
    where: { id: courseId }
  });

  if (!existingCourse) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Course not found");
  }

  const updateData = {};
  if (data.name !== undefined) updateData.name = data.name;
  if (data.description !== undefined) updateData.description = data.description;
  if (data.duration !== undefined) updateData.duration = data.duration;
  if (data.instructorName !== undefined) updateData.instructorName = data.instructorName;
  if (data.status !== undefined) updateData.status = data.status;
  if (data.startDate !== undefined) updateData.startDate = data.startDate ? new Date(data.startDate) : null;
  if (data.endDate !== undefined) updateData.endDate = data.endDate ? new Date(data.endDate) : null;
  if (data.capacity !== undefined) updateData.capacity = data.capacity;

  const course = await prisma.course.update({
    where: { id: courseId },
    data: updateData
  });

  return course;
};

// Delete course
export const deleteCourse = async (courseId) => {
  const existingCourse = await prisma.course.findUnique({
    where: { id: courseId }
  });

  if (!existingCourse) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Course not found");
  }

  await prisma.course.delete({
    where: { id: courseId }
  });

  return { message: "Course deleted successfully" };
};
