import { z } from "zod";

export const ProofStatusSchema = z.enum(["pending", "verified", "rejected"]);

export const ProofCreateSchema = z.object({
  brandSlug: z.string().trim().min(1).max(60),
  month: z.string().trim().min(1).max(20),
  amount: z.number().positive(),
  currency: z.string().trim().min(3).max(3).default("USD").optional(),
});

export type ProofCreateInput = z.infer<typeof ProofCreateSchema>;
export type ProofStatus = z.infer<typeof ProofStatusSchema>;
