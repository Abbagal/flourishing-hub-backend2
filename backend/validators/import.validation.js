import { z } from "zod";

export const importTypeEnum = z.enum([
  "USERS",
  "EVENT_REGISTRATIONS",
  "EVENTS",
  "MARKS",
  "ATTENDANCE"
]);

export const createImportJobSchema = z.object({
  body: z.object({
    type: importTypeEnum,
    fileName: z.string().min(3).max(255),
    fileUrl: z.string().url().optional(),
    meta: z.record(z.any()).optional()
  }),
  params: z.object({}).optional(),
  query: z.object({}).optional()
});

export const downloadImportTemplateSchema = z.object({
  body: z.object({}).optional(),
  params: z.object({
    type: importTypeEnum
  }),
  query: z.object({}).optional()
});



