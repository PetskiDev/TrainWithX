import { appErrorResponseSchema } from '@trainwithx/shared';
import { ZodError } from 'zod';

export async function handleThrowAppError(res: Response): Promise<never> {
  let data: unknown;

  try {
    data = await res.json();
  } catch {
    data = {
      status: res.status,
      message:
        res.status === 404 ? 'Endpoint not found' : 'Something went wrong',
    };
  }

  const parsed = appErrorResponseSchema.safeParse({
    ...(typeof data === 'object' && data ? data : {}),
    status: res.status,
  });

  if (!parsed.success) {
    throw {
      status: res.status,
      message: 'Unexpected error',
    };
  }

  throw parsed.data;
}

export function zodErrorToFieldErrors<T extends Record<string, any>>(
  error: ZodError
): Partial<Record<keyof T, string>> {
  const fieldErrors: Partial<Record<keyof T, string>> = {};

  console.log('ZOD ERROR: ');
  console.log(error.issues);
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
