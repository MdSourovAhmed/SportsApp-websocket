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
//       "connect-src": ["'self'", "WS_ORIGIN]"],
//     },
//   }),
// );

// app.get("/health", async (req, res) => {
//   res.status(200).json({ message: "Server is in good health" });
// });
// app.use(securityMiddleware());

// app.use("/matches", matchRouter);
// app.use("/matches/:id/commentary", commentaryRouter);

// const { broadcastMatchCreated, broadcastCommentary } =
//   attachWebSocketServer(server);
// app.locals.broadcastMatchCreated = broadcastMatchCreated;
// app.locals.broadcastCommentary = broadcastCommentary;

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



import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import http from "http";
import helmet from "helmet";
import { matchRouter } from "./routes/matches.js";
import { commentaryRouter } from "./routes/commentary.js";
import { attachWebSocketServer } from "./ws/server.js";
import { securityMiddleware } from "./arcjet.js";

dotenv.config();

const app = express();
const server = http.createServer(app);

app.use(cors());
app.use(express.json());
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      // FIX #1: was "WS_ORIGIN]" — a malformed string literal with the bracket
      // inside the quotes. Now correctly reads from the environment variable.
      "connect-src": ["'self'", process.env.WS_ORIGIN ?? "ws://localhost:7000/ws"],
    },
  }),
);

// FIX #2: securityMiddleware must be registered BEFORE routes so every
// endpoint (including /health) is protected. Previously /health was exposed.
app.use(securityMiddleware());

app.get("/health", async (req, res) => {
  res.status(200).json({ message: "Server is in good health" });
});

app.use("/matches", matchRouter);
// app.use("/commentary", commentaryRouter);
app.use("/matches/:id/commentary", commentaryRouter);

const { broadcastMatchCreated, broadcastCommentary, broadcastScoreUpdate } =
  attachWebSocketServer(server);

app.locals.broadcastMatchCreated = broadcastMatchCreated;
app.locals.broadcastCommentary = broadcastCommentary;
// FIX #3: broadcastScoreUpdate was never registered on app.locals, so the
// PATCH /:id/score handler's broadcast call was always a no-op / would throw.
app.locals.broadcastScoreUpdate = broadcastScoreUpdate;

const PORT = process.env.PORT || 7000;
const HOST = process.env.HOST || "0.0.0.0";
server.listen(PORT, HOST, () => {
  const baseUrl =
    HOST === "0.0.0.0" ? `http://localhost:${PORT}` : `http://${HOST}:${PORT}`;

  console.log(`Server is running at: ${baseUrl}`);
  console.log(
    `WebSocket Server is running at: ${baseUrl.replace("http", "ws")}/ws`,
  );
});

// npm run db:generate
// npm run db:migrate
