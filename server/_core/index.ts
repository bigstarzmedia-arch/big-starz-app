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
  const app = express();
  const server = createServer(app);

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
  registerOAuthRoutes(app);

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

  const preferredPort = parseInt(process.env.PORT || "3000");
  const port = await findAvailablePort(preferredPort);

  if (port !== preferredPort) {
    console.log(`Port ${preferredPort} is busy, using port ${port} instead`);
  }

  server.listen(port, () => {
    logger.info({ port }, "[api] server listening on port");
  });
}

startServer().catch(console.error);
