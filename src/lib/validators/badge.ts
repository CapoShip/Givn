import { z } from "zod";

export const BadgeParamsSchema = z.object({
  slug: z.string().trim().min(1).max(60),
});

export type BadgeParams = z.infer<typeof BadgeParamsSchema>;
