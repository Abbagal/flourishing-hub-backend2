import { StatusCodes } from "http-status-codes";

import { prisma } from "../database/prisma.js";
import { ApiError } from "../utils/ApiError.js";
import { toCsv } from "../utils/csv.js";
import { createWorkbookBuffer } from "../utils/excel.js";
import { buildPagination } from "../utils/pagination.js";

export const listUsers = async ({ role, search, department, programme, yearOfStudy, cohort, page, limit }) => {
  const pagination = buildPagination(page, limit);

  const where = {
    ...(role ? { role } : {}),
    ...(search
      ? {
          OR: [
            { name: { contains: search, mode: "insensitive" } },
            { email: { contains: search, mode: "insensitive" } },
            {
              studentProfile: {
                rollNumber: { contains: search, mode: "insensitive" }
              }
            }
          ]
        }
      : {}),
    ...((department || programme || yearOfStudy || cohort)
      ? {
          studentProfile: {
            ...(department ? { department } : {}),
            ...(programme ? { programme } : {}),
            ...(yearOfStudy ? { yearOfStudy: Number(yearOfStudy) } : {}),
            ...(cohort ? { cohort } : {})
          }
        }
      : {})
  };

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      include: {
        studentProfile: true,
        instructorProfile: true,
        adminProfile: true,
        registrations: true,
        eventAssignments: true
      },
      skip: pagination.skip,
      take: pagination.limit,
      orderBy: { createdAt: "desc" }
    }),
    prisma.user.count({ where })
  ]);

  return {
    items: users.map((user) => ({
      ...user,
      stats: {
        totalRegistrations: user.registrations.length,
        totalAssignments: user.eventAssignments.length
      }
    })),
    page: pagination.page,
    limit: pagination.limit,
    total
  };
};

export const updateUserRole = async (userId, role) =>
  prisma.user.update({
    where: { id: userId },
    data: {
      role
    }
  });

export const getUserById = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      studentProfile: true,
      instructorProfile: true,
      adminProfile: true,
      registrations: {
        include: {
          event: true
        }
      },
      eventAssignments: true
    }
  });

  if (!user) {
    throw new ApiError(StatusCodes.NOT_FOUND, "User not found");
  }

  return user;
};

export const updateUserProfile = async (userId, payload) =>
  prisma.user.update({
    where: { id: userId },
    data: {
      ...(payload.name !== undefined ? { name: payload.name } : {}),
      ...(payload.email !== undefined ? { email: payload.email.toLowerCase() } : {}),
      ...(payload.profileImageUrl !== undefined ? { profileImageUrl: payload.profileImageUrl } : {}),
      ...(payload.employeeId !== undefined ? { employeeId: payload.employeeId } : {}),
      ...(payload.studentProfile
        ? {
            studentProfile: {
              upsert: {
                create: payload.studentProfile,
                update: payload.studentProfile
              }
            }
          }
        : {}),
      ...(payload.instructorProfile
        ? {
            instructorProfile: {
              upsert: {
                create: payload.instructorProfile,
                update: payload.instructorProfile
              }
            }
          }
        : {}),
      ...(payload.employeeId
        ? {
            adminProfile: {
              upsert: {
                create: {
                  employeeId: payload.employeeId
                },
                update: {
                  employeeId: payload.employeeId
                }
              }
            }
          }
        : {})
    },
    include: {
      studentProfile: true,
      instructorProfile: true,
      adminProfile: true
    }
  });

export const exportUsers = async (query) => {
  const data = await listUsers({
    ...query,
    page: 1,
    limit: 10000
  });

  const rows = data.items.map((user) => ({
    userId: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    department: user.studentProfile?.department || user.instructorProfile?.department || "",
    rollNumber: user.studentProfile?.rollNumber || "",
    programme: user.studentProfile?.programme || "",
    yearOfStudy: user.studentProfile?.yearOfStudy || "",
    cohort: user.studentProfile?.cohort || "",
    employeeId: user.adminProfile?.employeeId || user.employeeId || "",
    totalRegistrations: user.stats.totalRegistrations,
    totalAssignments: user.stats.totalAssignments
  }));

  return {
    fileName: "fh-member-directory",
    csv: toCsv(rows),
    xlsx: await createWorkbookBuffer([
      {
        name: "Members",
        rows
      }
    ])
  };
};
