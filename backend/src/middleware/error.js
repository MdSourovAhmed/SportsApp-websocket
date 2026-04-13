// /**
//  * Catch-all 404 handler — must be registered after all routes.
//  */
// export function notFoundHandler(req, res) {
//   res.status(404).json({ error: `Cannot ${req.method} ${req.path}` });
// }

// /**
//  * Global Express error handler — must have exactly 4 params.
//  * Catches anything passed via next(err).
//  */
// // eslint-disable-next-line no-unused-vars
// export function globalErrorHandler(err, req, res, next) {
//   console.error("[Error]", err);

//   // Zod-style validation errors forwarded via next(err)
//   if (err.name === "ZodError") {
//     return res.status(400).json({ error: "Validation error", details: err.issues });
//   }

//   const status  = err.status ?? err.statusCode ?? 500;
//   const message = err.message ?? "Internal server error";
//   res.status(status).json({ error: message });
// }




/**
 * Catch-all 404 handler — must be registered after all routes.
 */
export function notFoundHandler(req, res) {
  res.status(404).json({ error: `Cannot ${req.method} ${req.path}` });
}

/**
 * Global Express error handler — must have exactly 4 params.
 * Catches anything passed via next(err).
 */
// eslint-disable-next-line no-unused-vars
export function globalErrorHandler(err, req, res, next) {
  console.error("[Error]", err);

  // Zod-style validation errors forwarded via next(err)
  if (err.name === "ZodError") {
    return res.status(400).json({ error: "Validation error", details: err.issues });
  }

  const status  = err.status ?? err.statusCode ?? 500;
  const message = err.message ?? "Internal server error";
  res.status(status).json({ error: message });
}