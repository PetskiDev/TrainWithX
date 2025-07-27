
import { z } from "zod";

export const appErrorResponseSchema = z.object({
  status: z.number(),
  message: z.string(),
  errors: z
    .record(
      z.string(), // <-- key type (field name)
      z.object({
        _errors: z.array(z.string()).optional(),
      })
    )
    .optional(),
});

export type AppErrorResponse = z.infer<typeof appErrorResponseSchema>;

export function isAppError(err: unknown): err is AppErrorResponse {
  return appErrorResponseSchema.safeParse(err).success;
}
