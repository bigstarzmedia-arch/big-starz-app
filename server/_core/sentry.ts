import * as Sentry from "@sentry/node";
import { nodeProfilingIntegration } from "@sentry/profiling-node";

export function initSentry() {
  if (!process.env.SENTRY_DSN) {
    console.warn("[Sentry] SENTRY_DSN not set — error tracking disabled");
    return;
  }

  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    environment: process.env.NODE_ENV || "development",
    integrations: [
      // Enables profiling for performance bottlenecks
      nodeProfilingIntegration(),
    ],
    // Capture 10% of transactions in production for performance monitoring
    tracesSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 1.0,
    // Profile 5% of transactions to keep costs low
    profilesSampleRate: process.env.NODE_ENV === "production" ? 0.05 : 1.0,
    // Don't send PII by default
    sendDefaultPii: false,
    // Attach stack traces to all messages
    attachStacktrace: true,
    // Ignore common noise
    ignoreErrors: [
      /ECONNREFUSED/i,
      /ECONNRESET/i,
      /socket hang up/i,
      /ResizeObserver loop limit exceeded/i,
    ],
  });

  console.log("[Sentry] Initialized with DSN:", process.env.SENTRY_DSN?.substring(0, 30) + "...");
}

export { Sentry };
