import { prisma } from "../database/prisma.js";

export const createTemplate = async (payload, createdById) =>
  prisma.eventTemplate.create({
    data: {
      ...payload,
      createdById
    }
  });

export const listTemplates = async () =>
  prisma.eventTemplate.findMany({
    orderBy: {
      createdAt: "desc"
    }
  });



