import mongoose from "mongoose";
/**
 * TODO: Handle errors
 *
 * Required error format: { error: { message: "..." } }
 *
 * Handle these cases:
 * 1. Mongoose ValidationError → 400 with combined error messages
 * 2. Mongoose CastError → 400 with "Invalid id format"
 * 3. Other errors → Use err.status (or 500) and err.message
 */
export function errorHandler(err, req, res, next) {
  if (err instanceof mongoose.Error.ValidationError) {
    return res.status(400).json({
      error: {
        message: err.message,
      },
    });
  } else if (err instanceof mongoose.Error.CastError) {
    return res.status(400).json({
      error: {
        message: err.message,
      },
    });
  } else {
    return res.status(500).json({ error: err.message });
  }
}
