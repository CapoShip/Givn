import { z } from "zod";

export const VerifySchema = z.object({
  proofId: z.string().trim().min(1),
  verified: z.boolean(),
});

export type VerifyInput = z.infer<typeof VerifySchema>;
