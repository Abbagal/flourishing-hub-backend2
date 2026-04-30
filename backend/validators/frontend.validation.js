import { z } from "zod";

export const frontendLoginSchema = z.object({
  body: z.object({
    email: z.string().email().endsWith("@iitb.ac.in"),
    password: z.string().min(8)
  }),
  params: z.object({}).optional(),
  query: z.object({}).optional()
});

export const frontendRefreshSchema = z.object({
  body: z.object({
    refreshToken: z.string().min(20)
  }),
  params: z.object({}).optional(),
  query: z.object({}).optional()
});

export const frontendAttendanceSchema = z.object({
  body: z.object({
    entries: z
      .array(
        z.object({
          userId: z.string().min(5),
          status: z.enum(["present", "absent"])
        })
      )
      .min(1),
    source: z.string().max(80).optional()
  }),
  params: z.object({
    sessionId: z.string().min(5)
  }),
  query: z.object({}).optional()
});

export const frontendVolunteerRegistrationSchema = z.object({
  body: z.object({
    register: z.boolean().optional()
  }),
  params: z.object({
    eventId: z.string().min(5)
  }),
  query: z.object({}).optional()
});

export const frontendEventRegistrationSchema = z.object({
  body: z.object({
    register: z.boolean().optional(),
    moduleId: z.string().min(5).optional()
  }),
  params: z.object({
    eventId: z.string().min(5)
  }),
  query: z.object({}).optional()
});

export const frontendSessionToggleSchema = z.object({
  body: z.object({
    type: z.enum(["quiz", "feedback"]),
    active: z.boolean().optional()
  }),
  params: z.object({
    sessionId: z.string().min(5)
  }),
  query: z.object({}).optional()
});

export const frontendSessionStartSchema = z.object({
  body: z.object({
    notifyParticipants: z.boolean().optional()
  }).optional(),
  params: z.object({
    sessionId: z.string().min(5)
  }),
  query: z.object({}).optional()
});

export const frontendCheckInSchema = z.object({
  body: z.object({
    moduleId: z.string().min(5).optional(),
    note: z.string().max(500).optional()
  }).optional(),
  params: z.object({
    eventId: z.string().min(5)
  }),
  query: z.object({}).optional()
});

export const frontendManageEventSchema = z.object({
  body: z.object({}).optional(),
  params: z.object({
    eventId: z.string().min(5)
  }),
  query: z.object({}).optional()
});

export const frontendAttendanceUpdateSchema = z.object({
  body: z.object({
    userId: z.string().min(5),
    moduleId: z.string().min(5).optional(),
    status: z.enum(["present", "absent", "excused"])
  }),
  params: z.object({
    eventId: z.string().min(5)
  }),
  query: z.object({}).optional()
});

export const frontendAvailabilitySchema = z.object({
  body: z.object({
    isAvailable: z.boolean(),
    note: z.string().max(500).optional()
  }),
  params: z.object({
    eventId: z.string().min(5)
  }),
  query: z.object({}).optional()
});

export const frontendSelfAssignSchema = z.object({
  body: z.object({
    note: z.string().max(500).optional()
  }).optional(),
  params: z.object({
    eventId: z.string().min(5)
  }),
  query: z.object({}).optional()
});

export const frontendAssignStaffSchema = z.object({
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

export const frontendReviewCheckInSchema = z.object({
  body: z.object({
    status: z.enum(["VERIFIED", "REJECTED"]),
    note: z.string().max(500).optional()
  }),
  params: z.object({
    checkInId: z.string().min(5)
  }),
  query: z.object({}).optional()
});

export const frontendFeedbackSchema = z.object({
  body: z.object({
    eventRating: z.coerce.number().int().min(1).max(5),
    instructorRating: z.coerce.number().int().min(1).max(5),
    eventComment: z.string().max(2000).optional(),
    instructorComment: z.string().max(2000).optional()
  }),
  params: z.object({
    eventId: z.string().min(5)
  }),
  query: z.object({}).optional()
});
