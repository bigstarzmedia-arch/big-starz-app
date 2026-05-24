import "dotenv/config";
import express from "express";
import { createServer } from "http";
import net from "net";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { registerOAuthRoutes } from "./oauth";
import { registerStorageProxy } from "./storageProxy";
import { appRouter } from "../routers";
import { createContext } from "./context";
import { logger } from "./logger";
import { getDb } from "../db";
import { initSentry, Sentry } from "./sentry";
import { createRateLimiter } from "./rateLimiter";

function isPortAvailable(port: number): Promise<boolean> {
  return new Promise((resolve) => {
    const server = net.createServer();
    server.listen(port, () => {
      server.close(() => resolve(true));
    });
    server.on("error", () => resolve(false));
  });
}

async function findAvailablePort(startPort: number = 3000): Promise<number> {
  for (let port = startPort; port < startPort + 20; port++) {
    if (await isPortAvailable(port)) {
      return port;
    }
  }
  throw new Error(`No available port found starting from ${startPort}`);
}

async function startServer() {
  // Initialize Sentry first
  initSentry();

  const app = express();
  const server = createServer(app);

  // Sentry request handler MUST be the first middleware
  if (process.env.SENTRY_DSN) {
    app.use((req, res, next) => {
      Sentry.captureException(new Error("Sentry initialized"));
      next();
    });
  }

  // CORS whitelist - only allow known, trusted origins
  const ALLOWED_ORIGINS = [
    process.env.PRODUCTION_DOMAIN || 'https://bigstarz.app',
    process.env.STAGING_DOMAIN || 'https://staging.bigstarz.app',
    'http://localhost:3000',
    'http://localhost:8081',
    'http://127.0.0.1:3000',
    'http://127.0.0.1:8081',
  ].filter(Boolean);

  // Enable CORS for whitelisted origins only
  app.use((req, res, next) => {
    const origin = req.headers.origin;
    if (origin && ALLOWED_ORIGINS.includes(origin)) {
      res.header("Access-Control-Allow-Origin", origin);
      res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
      res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization",
      );
      res.header("Access-Control-Allow-Credentials", "true");
    }

    // Handle preflight requests
    if (req.method === "OPTIONS") {
      res.sendStatus(200);
      return;
    }
    next();
  });

  // Reduce request size limits to prevent DoS attacks
  app.use(express.json({ limit: "10mb" }));
  app.use(express.urlencoded({ limit: "10mb", extended: true }));

  // Add security headers
  app.use((req, res, next) => {
    res.header("X-Content-Type-Options", "nosniff");
    res.header("X-Frame-Options", "DENY");
    res.header("X-XSS-Protection", "1; mode=block");
    next();
  });

  registerStorageProxy(app);

  // Rate limiting for authentication endpoints: 10 attempts per 15 minutes per IP
  const authLimiter = createRateLimiter(
    15,
    10,
    "Too many authentication attempts. Please try again after 15 minutes."
  );
  app.use("/api/oauth", authLimiter);
  registerOAuthRoutes(app);

  // General API rate limiter: 100 requests per minute per IP
  const apiLimiter = createRateLimiter(
    1,
    100,
    "Too many requests. Please slow down."
  );
  app.use("/api/trpc", apiLimiter);

  // Request logging middleware
  app.use((req, res, next) => {
    const start = Date.now();
    
    res.on("finish", () => {
      const duration = Date.now() - start;
      if (duration > 1000) {
        logger.warn({
          method: req.method,
          url: req.originalUrl,
          status: res.statusCode,
          duration,
        }, "Slow request detected");
      }
    });
    
    next();
  });

  // Debug endpoint for Sentry testing (REMOVE before production)
  if (process.env.NODE_ENV !== "production") {
    app.get("/api/debug-sentry", () => {
      throw new Error("Sentry test error — verify in dashboard");
    });
  }

  // Debug endpoint for environment check (REMOVE before production)
  if (process.env.NODE_ENV !== "production") {
    app.get("/api/debug-env-check", (_req, res) => {
      const vars = ["DATABASE_URL", "SENTRY_DSN", "NODE_ENV", "PORT"];
      const status = vars.reduce((acc, key) => {
        acc[key] = process.env[key] ? "✅ set" : "❌ missing";
        return acc;
      }, {} as Record<string, string>);
      res.json(status);
    });
  }

  // Health check endpoint - verifies API is running
  app.get("/api/health", async (_req, res) => {
    const checks: Record<string, boolean> = {
      api: true,
      database: false,
    };

    try {
      const db = await getDb();
      checks.database = true;
    } catch (error) {
      logger.error({ err: error }, "[Health] Database check failed");
    }

    const allHealthy = Object.values(checks).every(Boolean);
    const statusCode = allHealthy ? 200 : 503;

    res.status(statusCode).json({
      ok: allHealthy,
      timestamp: Date.now(),
      checks,
      uptime: process.uptime(),
    });
  });

  // Readiness endpoint - for Kubernetes readiness probes
  app.get("/api/ready", async (_req, res) => {
    try {
      const db = await getDb();
      res.status(200).json({ ready: true });
    } catch (error) {
      logger.error({ err: error }, "[Readiness] Database check failed");
      res.status(503).json({ ready: false, reason: "database unavailable" });
    }
  });

  app.use(
    "/api/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext,
    }),
  );

  // Sentry error handler MUST be the last middleware (before any custom error handlers)
  if (process.env.SENTRY_DSN) {
    app.use((err: Error, _req: express.Request, res: express.Response, next: express.NextFunction) => {
      Sentry.captureException(err);
      next();
    });
  }

  // Custom error handler goes after Sentry's
  app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    logger.error({ err }, "Unhandled error");
    res.status(500).json({ error: "Internal server error" });
  });

  const preferredPort = parseInt(process.env.PORT || "3000");
  const port = await findAvailablePort(preferredPort);

  if (port !== preferredPort) {
    console.log(`Port ${preferredPort} is busy, using port ${port} instead`);
  }

  server.listen(port, () => {
    console.log(`[api] server listening on port ${port}`);
  });
}

startServer().catch(console.error);
