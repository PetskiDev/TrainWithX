import { appErrorResponseSchema } from '@trainwithx/shared';
import { ZodError } from 'zod';

export async function handleThrowAppError(res: Response): Promise<never> {
  let data: unknown;

  try {
    data = await res.json();
  } catch {
    // fallback if response is not JSON
    throw {
      status: res.status,
      message:
        res.status === 404 ? 'Endpoint not found' : 'Something went wrong',
    };
  }

  // Ensure the required fields exist in the parsed object
  const base = {
    status: res.status,
    ...(typeof data === 'object' && data !== null ? data : {}),
  };

  const parsed = appErrorResponseSchema.safeParse(base);

  if (!parsed.success) {
    throw {
      status: res.status,
      message: res.status === 404 ? 'Endpoint not found' : 'Unexpected error',
    };
  }

  throw parsed.data;
}

export function zodErrorToFieldErrors<T extends Record<string, any>>(
  error: ZodError
): Partial<Record<keyof T, string>> {
  const fieldErrors: Partial<Record<keyof T, string>> = {};

  error.issues.forEach((err) => {
    if (err.path.length > 0) {
      const key = err.path[0] as keyof T;
      if (!fieldErrors[key]) {
        fieldErrors[key] = err.message;
      }
    }
  });

  return fieldErrors;
}
