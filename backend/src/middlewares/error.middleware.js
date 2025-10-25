import { ApiError } from "../utils/ApiError.js";

export const errorHandler = (err, req, res, next) => {
  console.error("Error handler caught:", err);

  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: err.success,       // false
      message: err.message,       // e.g. "Email already exists"
      errors: err.errors || [],
      data: err.data ?? null,
    });
  }

  // Fallback for unexpected errors
  return res.status(500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
};
