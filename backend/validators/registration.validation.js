import { z } from "zod";

export const registerForEventSchema = z.object({
  body: z.object({
    eventId: z.string().min(5),
    asVolunteer: z.boolean().optional()
  }),
  params: z.object({}).optional(),
  query: z.object({}).optional()
});



