import rateLimit from "express-rate-limit";

export function createRateLimiter(
  windowMinutes: number,
  maxRequests: number,
  message: string
) {
  return rateLimit({
    windowMs: windowMinutes * 60 * 1000,
    max: maxRequests,
    message: { error: message },
    standardHeaders: true,  // Return rate limit info in `RateLimit-*` headers
    legacyHeaders: false,   // Disable `X-RateLimit-*` headers
    // Use a more accurate IP detection when behind a proxy
    keyGenerator: (req) => {
      return req.ip || req.socket.remoteAddress || "unknown";
    },
  });
}
