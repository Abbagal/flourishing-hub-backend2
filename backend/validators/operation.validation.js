import { z } from "zod";

export const assignmentSchema = z.object({
  body: z.object({
    userId: z.string().min(5),
    role: z.enum(["INSTRUCTOR", "ASSOCIATE_INSTRUCTOR", "VOLUNTEER"]),
    notes: z.string().max(500).optional()
  }),
  params: z.object({
    eventId: z.string().min(5)
  }),
  query: z.object({}).optional()
});

export const attendanceSchema = z.object({
  body: z.object({
    userId: z.string().min(5),
    moduleId: z.string().min(5).optional(),
    status: z.enum(["PRESENT", "ABSENT", "EXCUSED"]),
    source: z.string().max(80).optional()
  }),
  params: z.object({
    eventId: z.string().min(5)
  }),
  query: z.object({}).optional()
});

export const availabilitySchema = z.object({
  body: z.object({
    isAvailable: z.boolean(),
    note: z.string().max(500).optional()
  }),
  params: z.object({
    eventId: z.string().min(5)
  }),
  query: z.object({}).optional()
});

export const selfCheckInSchema = z.object({
  body: z.object({
    moduleId: z.string().min(5).optional(),
    note: z.string().max(500).optional()
  }),
  params: z.object({
    eventId: z.string().min(5)
  }),
  query: z.object({}).optional()
});

export const reviewCheckInSchema = z.object({
  body: z.object({
    status: z.enum(["PENDING", "VERIFIED", "REJECTED"]),
    note: z.string().max(500).optional()
  }),
  params: z.object({
    checkInId: z.string().min(5)
  }),
  query: z.object({}).optional()
});

export const feedbackSchema = z.object({
  body: z.object({
    eventRating: z.coerce.number().int().min(1).max(5),
    instructorRating: z.coerce.number().int().min(1).max(5).optional(),
    eventComment: z.string().max(2000).optional(),
    instructorComment: z.string().max(2000).optional()
  }),
  params: z.object({
    eventId: z.string().min(5)
  }),
  query: z.object({}).optional()
});

export const moduleProgressSchema = z.object({
  body: z.object({
    userId: z.string().min(5),
    marksObtained: z.coerce.number().min(0).max(1000).optional(),
    completedAt: z.string().datetime().optional()
  }),
  params: z.object({
    moduleId: z.string().min(5)
  }),
  query: z.object({}).optional()
});



