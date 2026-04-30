import { z } from "zod";

export const createTemplateSchema = z.object({
  body: z.object({
    title: z.string().min(3).max(160),
    description: z.string().min(10).max(5000),
    defaultType: z.enum(["OPEN_WORKSHOP", "WELLNESS_COURSE", "PLACEMENT_WORKSHOP", "PHD_WORKSHOP", "OTHER"]),
    quizLink: z.string().url().optional(),
    feedbackLink: z.string().url().optional(),
    lockedCoreContent: z.boolean().optional(),
    defaultModules: z
      .array(
        z.object({
          title: z.string().min(2).max(160),
          description: z.string().max(2000).optional(),
          venue: z.string().max(200).optional(),
          meetLink: z.string().url().optional(),
          startOffsetDays: z.coerce.number().int().min(0).optional(),
          durationMinutes: z.coerce.number().int().min(15).max(600).optional(),
          maxMarks: z.coerce.number().int().min(1).max(1000).optional(),
          quizLink: z.string().url().optional(),
          feedbackLink: z.string().url().optional()
        })
      )
      .optional()
  }),
  params: z.object({}).optional(),
  query: z.object({}).optional()
});



