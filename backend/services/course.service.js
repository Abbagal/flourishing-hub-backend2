import { prisma } from "../database/prisma.js";
import { ApiError } from "../utils/ApiError.js";
import { StatusCodes } from "http-status-codes";

export const getAllCourses = async (filters = {}) => {
  const { status } = filters;
  const where = {};
  if (status) where.status = status;

  return prisma.course.findMany({
    where,
    include: {
      _count: {
        select: { modules: true, events: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });
};

export const getCourseById = async (courseId) => {
  const course = await prisma.course.findUnique({
    where: { id: courseId },
    include: {
      modules: {
        where: { isActive: true },
        include: { _count: { select: { events: true } } },
        orderBy: { order: "asc" },
      },
      _count: { select: { modules: true, events: true } },
    },
  });

  if (!course) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Course not found");
  }
  return course;
};

export const createCourse = async (data) => {
  return prisma.course.create({
    data: {
      name: data.name,
      description: data.description,
      posterUrl: data.posterUrl,
      duration: data.duration,
      instructorName: data.instructorName,
      status: data.status || "ACTIVE",
      startDate: data.startDate ? new Date(data.startDate) : null,
      endDate: data.endDate ? new Date(data.endDate) : null,
      capacity: data.capacity,
      enrolledCount: 0,
    },
  });
};

export const updateCourse = async (courseId, data) => {
  const existing = await prisma.course.findUnique({ where: { id: courseId } });
  if (!existing) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Course not found");
  }

  const updateData = {};
  if (data.name !== undefined) updateData.name = data.name;
  if (data.description !== undefined) updateData.description = data.description;
  if (data.posterUrl !== undefined) updateData.posterUrl = data.posterUrl;
  if (data.duration !== undefined) updateData.duration = data.duration;
  if (data.instructorName !== undefined) updateData.instructorName = data.instructorName;
  if (data.status !== undefined) updateData.status = data.status;
  if (data.startDate !== undefined) updateData.startDate = data.startDate ? new Date(data.startDate) : null;
  if (data.endDate !== undefined) updateData.endDate = data.endDate ? new Date(data.endDate) : null;
  if (data.capacity !== undefined) updateData.capacity = data.capacity;

  return prisma.course.update({ where: { id: courseId }, data: updateData });
};

export const deleteCourse = async (courseId) => {
  const existing = await prisma.course.findUnique({ where: { id: courseId } });
  if (!existing) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Course not found");
  }
  await prisma.course.delete({ where: { id: courseId } });
  return { message: "Course deleted successfully" };
};

export const getCourseAnalytics = async (courseId) => {
  const course = await prisma.course.findUnique({
    where: { id: courseId },
    include: {
      modules: {
        include: {
          _count: { select: { events: true } },
          events: {
            select: {
              id: true,
              title: true,
              startAt: true,
              status: true,
              batch: true,
              _count: { select: { registrations: true } },
            },
            orderBy: { startAt: "desc" },
          },
        },
        orderBy: { order: "asc" },
      },
      _count: { select: { modules: true, events: true } },
    },
  });

  if (!course) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Course not found");
  }

  const totalWorkshops = course._count.events;
  const moduleStats = course.modules.map((m) => ({
    moduleId: m.id,
    moduleTitle: m.title,
    usageCount: m._count.events,
    recentWorkshops: m.events.slice(0, 3),
  }));

  const mostUsed = [...moduleStats].sort((a, b) => b.usageCount - a.usageCount).slice(0, 5);

  return {
    courseId: course.id,
    courseName: course.name,
    totalModules: course._count.modules,
    totalWorkshops,
    moduleStats,
    mostUsedModules: mostUsed,
  };
};
