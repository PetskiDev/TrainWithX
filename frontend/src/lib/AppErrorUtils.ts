
import { appErrorResponseSchema } from "@trainwithx/shared";
console.log("HAHAHAHA" + appErrorResponseSchema);

export async function handleThrowAppError(res: Response): Promise<never> {
  let data: unknown;

  try {
    data = await res.json();
  } catch {
    data = {
      status: res.status,
      message:
        res.status === 404 ? "Endpoint not found" : "Something went wrong",
    };
  }

  const parsed = appErrorResponseSchema.safeParse({
    ...(typeof data === "object" && data ? data : {}),
    status: res.status,
  });

  if (!parsed.success) {
    throw {
      status: res.status,
      message: "Unexpected error",
    };
  }

  throw parsed.data;
}
