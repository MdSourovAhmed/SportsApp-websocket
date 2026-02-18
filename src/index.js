import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import http from "http";
import { matchRouter } from "./routes/matches.js";
import { attachWebSocketServer } from "./ws/server.js";


dotenv.config();

const app = express();
const server = http.createServer(app);

app.use(cors());
app.use(express.json());

app.get("/health", async (req, res) => {
  res.status(200).json({ message: "Server is in good health" });
});
// server.post("/matches", async (req, res) => {
//   return res
//     .status(200)
//     .json({ message: "Server is in good health"});
// });

app.use("/matches", matchRouter);

const { broadcastMatchCreated } = attachWebSocketServer(server);
app.locals.broadcastMatchCreated = broadcastMatchCreated;

const PORT = process.env.PORT || 7000;
const HOST = process.env.HOST || "0.0.0.0";
server.listen(PORT,HOST, () => {
  const baseUrl =
    HOST === "0.0.0.0" ? `http://localhost:${PORT}` : `http://${HOST}:${PORT}`;

  console.log(`Server is running at: ${baseUrl}`);
  console.log(
    `WebSocket Server is running at: ${baseUrl.replace("http", "ws")}/ws`,
  );
});
