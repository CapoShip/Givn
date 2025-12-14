import { z } from "zod";

export const LeadCreateSchema = z.object({
  email: z.string().trim().email("Invalid email."),
  name: z.string().trim().min(1).max(80).optional(),
});

export type LeadCreateInput = z.infer<typeof LeadCreateSchema>;
