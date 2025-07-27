import { AppError } from "@src/utils/AppError.js";
import { ErrorRequestHandler } from "express";

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  if (err instanceof AppError) {
    console.error("[HANDLED ERROR]", err.message);
    res.status(err.statusCode).json({
      status: err.statusCode,
      message: err.message,
      errors: err.details || null,
    });
    return;
  }
  // Unexpected error (maybe not instanceof Error)
  const isRealError = err instanceof Error;

  console.error(
    "[UNHANDLED ERROR]",
    isRealError ? err.stack || err.message : err
  );

  console.error("[UNHANDLED ERROR]", err);
  res.status(500).json({ status: 500, message: "Internal server error" });
};
