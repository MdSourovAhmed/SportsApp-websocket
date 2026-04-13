
// import express from "express";
// import dotenv from "dotenv";
// import cors from "cors";
// import http from "http";
// import helmet from "helmet";
// import { matchRouter } from "./routes/matches.js";
// import { commentaryRouter } from "./routes/commentary.js";
// import { attachWebSocketServer } from "./ws/server.js";
// import { securityMiddleware } from "./arcjet.js";

// dotenv.config();

// const app = express();
// const server = http.createServer(app);

// app.use(cors());
// app.use(express.json());
// app.use(
//   helmet.contentSecurityPolicy({
//     directives: {
//       // FIX #1: was "WS_ORIGIN]" — a malformed string literal with the bracket
//       // inside the quotes. Now correctly reads from the environment variable.
//       "connect-src": ["'self'", process.env.WS_ORIGIN ?? "ws://localhost:7000/ws"],
//     },
//   }),
// );

// // FIX #2: securityMiddleware must be registered BEFORE routes so every
// // endpoint (including /health) is protected. Previously /health was exposed.
// app.use(securityMiddleware());

// app.get("/health", async (req, res) => {
//   res.status(200).json({ message: "Server is in good health" });
// });

// app.use("/matches", matchRouter);
// // app.use("/commentary", commentaryRouter);
// app.use("/matches/:id/commentary", commentaryRouter);

// const { broadcastMatchCreated, broadcastCommentary, broadcastScoreUpdate } =
//   attachWebSocketServer(server);

// app.locals.broadcastMatchCreated = broadcastMatchCreated;
// app.locals.broadcastCommentary = broadcastCommentary;
// // FIX #3: broadcastScoreUpdate was never registered on app.locals, so the
// // PATCH /:id/score handler's broadcast call was always a no-op / would throw.
// app.locals.broadcastScoreUpdate = broadcastScoreUpdate;

// const PORT = process.env.PORT || 7000;
// const HOST = process.env.HOST || "0.0.0.0";
// server.listen(PORT, HOST, () => {
//   const baseUrl =
//     HOST === "0.0.0.0" ? `http://localhost:${PORT}` : `http://${HOST}:${PORT}`;

//   console.log(`Server is running at: ${baseUrl}`);
//   console.log(
//     `WebSocket Server is running at: ${baseUrl.replace("http", "ws")}/ws`,
//   );
// });

// // npm run db:generate
// // npm run db:migrate




// import "dotenv/config";
// import express from "express";
// import http from "http";
// import cors from "cors";
// import helmet from "helmet";

// import { matchRouter } from "./routes/matches.js";
// import { commentaryRouter } from "./routes/commentary.js";
// import { attachWebSocketServer } from "./ws/server.js";
// import { securityMiddleware } from "./middleware/arcjet.js";
// import { notFoundHandler, globalErrorHandler } from "./middleware/error.js";

// // ── App + HTTP server ─────────────────────────────────────────────────────
// const app    = express();
// const server = http.createServer(app);

// // ── CORS ──────────────────────────────────────────────────────────────────
// // Parse CORS_ORIGINS from env: comma-separated list of allowed origins.
// // Falls back to localhost:5173 in development.
// const allowedOrigins = (process.env.CORS_ORIGINS ?? "http://localhost:5173")
//   .split(",")
//   .map((o) => o.trim())
//   .filter(Boolean);

// app.use(
//   cors({
//     origin: (origin, callback) => {
//       // Allow requests with no origin (curl, Postman, server-to-server)
//       if (!origin) return callback(null, true);
//       if (allowedOrigins.includes(origin)) return callback(null, true);
//       callback(new Error(`CORS: origin "${origin}" is not allowed`));
//     },
//     methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
//     allowedHeaders: ["Content-Type", "Authorization"],
//     credentials: true,
//   })
// );

// // ── Helmet ────────────────────────────────────────────────────────────────
// app.use(
//   helmet({
//     contentSecurityPolicy: {
//       directives: {
//         defaultSrc:  ["'self'"],
//         connectSrc:  ["'self'", process.env.WS_ORIGIN ?? "ws://localhost:7000"],
//         scriptSrc:   ["'self'"],
//         styleSrc:    ["'self'", "'unsafe-inline'"],
//         imgSrc:      ["'self'", "data:"],
//       },
//     },
//   })
// );

// // ── Body parser ───────────────────────────────────────────────────────────
// app.use(express.json({ limit: "256kb" }));

// // ── Security middleware ───────────────────────────────────────────────────
// // Applied before routes so every endpoint is protected (including /health).
// app.use(securityMiddleware());

// // ── Routes ────────────────────────────────────────────────────────────────
// app.get("/health", (_req, res) => {
//   res.status(200).json({ status: "ok", uptime: process.uptime() });
// });

// app.use("/matches", matchRouter);

// // mergeParams on commentaryRouter means /:id is available inside it
// app.use("/matches/:id/commentary", commentaryRouter);

// // ── WebSocket ─────────────────────────────────────────────────────────────
// const { broadcastMatchCreated, broadcastScoreUpdate, broadcastCommentary } =
//   attachWebSocketServer(server);

// // Attach broadcast functions to app.locals so route handlers can call them
// // without creating a circular import between routes and ws/server.js
// app.locals.broadcastMatchCreated  = broadcastMatchCreated;
// app.locals.broadcastScoreUpdate   = broadcastScoreUpdate;
// app.locals.broadcastCommentary    = broadcastCommentary;

// // ── Error handling ────────────────────────────────────────────────────────
// // Order matters: 404 first, then the generic error handler
// app.use(notFoundHandler);
// app.use(globalErrorHandler);

// // ── Start ─────────────────────────────────────────────────────────────────
// const PORT = Number(process.env.PORT) || 7000;
// const HOST = process.env.HOST ?? "0.0.0.0";

// server.listen(PORT, HOST, () => {
//   const base = HOST === "0.0.0.0" ? `http://localhost:${PORT}` : `http://${HOST}:${PORT}`;
//   console.log(`[Server]    REST API  →  ${base}`);
//   console.log(`[Server]    WebSocket →  ${base.replace("http", "ws")}/ws`);
//   console.log(`[Server]    Health    →  ${base}/health`);
// });

// // ── Graceful shutdown ─────────────────────────────────────────────────────
// function shutdown(signal) {
//   console.log(`\n[Server] ${signal} received — shutting down gracefully…`);
//   server.close(() => {
//     console.log("[Server] HTTP server closed.");
//     process.exit(0);
//   });
//   // Force-exit if clean shutdown takes too long
//   setTimeout(() => {
//     console.error("[Server] Forced exit after timeout.");
//     process.exit(1);
//   }, 10_000);
// }

// process.on("SIGTERM", () => shutdown("SIGTERM"));
// process.on("SIGINT",  () => shutdown("SIGINT"));



// import "dotenv/config";
// import express from "express";
// import http from "http";
// import cors from "cors";
// import helmet from "helmet";

// import { matchRouter }    from "./routes/matches.js";
// import { commentaryRouter } from "./routes/commentary.js";
// import { attachWebSocketServer } from "./ws/server.js";
// import { securityMiddleware }    from "./middleware/arcjet.js";
// import { notFoundHandler, globalErrorHandler } from "./middleware/error.js";

// const app    = express();
// const server = http.createServer(app);

// // ── CORS ──────────────────────────────────────────────────────────────────
// const allowedOrigins = (process.env.CORS_ORIGINS ?? "http://localhost:5173")
//   .split(",").map((o) => o.trim()).filter(Boolean);

// app.use(cors({
//   origin: (origin, cb) => {
//     if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
//     cb(new Error(`CORS: origin "${origin}" is not allowed`));
//   },
//   methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
//   allowedHeaders: ["Content-Type", "Authorization"],
//   credentials: true,
// }));

// // ── Helmet ────────────────────────────────────────────────────────────────
// app.use(helmet({
//   contentSecurityPolicy: {
//     directives: {
//       defaultSrc: ["'self'"],
//       connectSrc: ["'self'", process.env.WS_ORIGIN ?? "ws://localhost:7000"],
//       scriptSrc:  ["'self'"],
//       styleSrc:   ["'self'", "'unsafe-inline'"],
//       imgSrc:     ["'self'", "data:"],
//     },
//   },
// }));

// app.use(express.json({ limit: "256kb" }));
// app.use(securityMiddleware());

// // ── Routes ────────────────────────────────────────────────────────────────
// app.get("/health", (_req, res) =>
//   res.json({ status: "ok", uptime: process.uptime() })
// );

// app.use("/matches", matchRouter);
// app.use("/matches/:id/commentary", commentaryRouter);

// // ── WebSocket ─────────────────────────────────────────────────────────────
// const broadcasts = attachWebSocketServer(server);

// // Attach every broadcast function to app.locals so route handlers can call
// // them without creating a circular dependency on ws/server.js
// Object.assign(app.locals, broadcasts);

// // ── Error handling ────────────────────────────────────────────────────────
// app.use(notFoundHandler);
// app.use(globalErrorHandler);

// // ── Start ─────────────────────────────────────────────────────────────────
// const PORT = Number(process.env.PORT) || 7000;
// const HOST = process.env.HOST ?? "0.0.0.0";

// server.listen(PORT, HOST, () => {
//   const base = HOST === "0.0.0.0" ? `http://localhost:${PORT}` : `http://${HOST}:${PORT}`;
//   console.log(`[Server]  REST      →  ${base}`);
//   console.log(`[Server]  WebSocket →  ${base.replace("http", "ws")}/ws`);
// });

// // ── Graceful shutdown ─────────────────────────────────────────────────────
// function shutdown(signal) {
//   console.log(`\n[Server] ${signal} — shutting down…`);
//   server.close(() => { console.log("[Server] closed."); process.exit(0); });
//   setTimeout(() => { console.error("[Server] force exit."); process.exit(1); }, 10_000);
// }
// process.on("SIGTERM", () => shutdown("SIGTERM"));
// process.on("SIGINT",  () => shutdown("SIGINT"));






import "dotenv/config";
import express from "express";
import http from "http";
import cors from "cors";
import helmet from "helmet";

import { matchRouter }    from "./routes/matches.js";
import { commentaryRouter } from "./routes/commentary.js";
import { attachWebSocketServer } from "./ws/server.js";
import { securityMiddleware }    from "./middleware/arcjet.js";
import { notFoundHandler, globalErrorHandler } from "./middleware/error.js";

const app    = express();
const server = http.createServer(app);

// ── CORS ──────────────────────────────────────────────────────────────────
const allowedOrigins = (process.env.CORS_ORIGINS ?? "http://localhost:5173")
  .split(",").map((o) => o.trim()).filter(Boolean);

app.use(cors({
  origin: (origin, cb) => {
    if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
    cb(new Error(`CORS: origin "${origin}" is not allowed`));
  },
  methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
}));

// ── Helmet ────────────────────────────────────────────────────────────────
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      connectSrc: ["'self'", process.env.WS_ORIGIN ?? "ws://localhost:7000"],
      scriptSrc:  ["'self'"],
      styleSrc:   ["'self'", "'unsafe-inline'"],
      imgSrc:     ["'self'", "data:"],
    },
  },
}));

app.use(express.json({ limit: "256kb" }));
app.use(securityMiddleware());

// ── Routes ────────────────────────────────────────────────────────────────
app.get("/health", (_req, res) =>
  res.json({ status: "ok", uptime: process.uptime() })
);

app.use("/matches", matchRouter);
app.use("/matches/:id/commentary", commentaryRouter);

// ── WebSocket ─────────────────────────────────────────────────────────────
const broadcasts = attachWebSocketServer(server);

// Attach every broadcast function to app.locals so route handlers can call
// them without creating a circular dependency on ws/server.js
Object.assign(app.locals, broadcasts);

// ── Error handling ────────────────────────────────────────────────────────
app.use(notFoundHandler);
app.use(globalErrorHandler);

// ── Start ─────────────────────────────────────────────────────────────────
const PORT = Number(process.env.PORT) || 7000;
const HOST = process.env.HOST ?? "0.0.0.0";

server.listen(PORT, HOST, () => {
  const base = HOST === "0.0.0.0" ? `http://localhost:${PORT}` : `http://${HOST}:${PORT}`;
  console.log(`[Server]  REST      →  ${base}`);
  console.log(`[Server]  WebSocket →  ${base.replace("http", "ws")}/ws`);
});

// ── Graceful shutdown ─────────────────────────────────────────────────────
function shutdown(signal) {
  console.log(`\n[Server] ${signal} — shutting down…`);
  server.close(() => { console.log("[Server] closed."); process.exit(0); });
  setTimeout(() => { console.error("[Server] force exit."); process.exit(1); }, 10_000);
}
process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT",  () => shutdown("SIGINT"));