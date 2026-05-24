import pino from "pino";

const isProduction = process.env.NODE_ENV === "production";

export const logger = pino({
  level: process.env.LOG_LEVEL || "info",
  // In production, output JSON for log aggregators
  // In development, pretty-print for readability
  transport: isProduction
    ? undefined
    : {
        target: "pino-pretty",
        options: {
          colorize: true,
          ignore: "pid,hostname",
        },
      },
  // Redact sensitive fields automatically
  redact: [
    "password",
    "token",
    "authorization",
    "cookie",
    "email",
    "phoneNumber",
  ],
});

// Type-safe child loggers for different parts of the app
export function createContextLogger(context: Record<string, unknown>) {
  return logger.child(context);
}
