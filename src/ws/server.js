import { WebSocket, WebSocketServer } from "ws";
import { wsArcjet } from "../arcjet.js";

function sendJson(socket, payload) {
  if (socket.readyState !== WebSocket.OPEN) return;
  socket.send(JSON.stringify(payload));
}

function broadcast(wss, payload) {
  const data = JSON.stringify(payload);

  for (const client of wss.clients) {
    if (client.readyState !== WebSocket.OPEN) continue;

    if (client.bufferedAmount > 1e6) {
      console.warn("Slow client terminated");
      client.terminate();
      continue;
    }

    try {
      client.send(data);
    } catch (err) {
      console.error("Broadcast error:", err);
    }
  }
}

export function attachWebSocketServer(server) {
  const wss = new WebSocketServer({
    noServer: true, // ✅ important
    maxPayload: 1024 * 1024,
  });

  server.on("upgrade", async (req, socket, head) => {
    let pathname;

    try {
      pathname = new URL(req.url, `http://${req.headers.host}`).pathname;
    } catch {
      socket.destroy();
      return;
    }

    if (pathname !== "/ws") return;

    if (wsArcjet) {
      try {
        const decision = await wsArcjet.protect(req);

        if (decision.isDenied()) {
          const isRateLimit = decision.reason?.isRateLimit?.();

          const response = isRateLimit
            ? "HTTP/1.1 429 Too Many Requests\r\nConnection: close\r\n\r\n"
            : "HTTP/1.1 403 Forbidden\r\nConnection: close\r\n\r\n";

          socket.write(response);
          socket.destroy();
          return;
        }
      } catch (e) {
        console.error("WS upgrade protection error", e);
        socket.write(
          "HTTP/1.1 500 Internal Server Error\r\nConnection: close\r\n\r\n"
        );
        socket.destroy();
        return;
      }
    }

    wss.handleUpgrade(req, socket, head, (ws) => {
      ws.meta = {
        ip: req.socket.remoteAddress,
        connectedAt: Date.now(),
      };

      wss.emit("connection", ws, req);
    });
  });

  wss.on("connection", (ws) => {
    ws.isAlive = true;

    sendJson(ws, { type: "welcome" });

    ws.on("pong", () => {
      ws.isAlive = true;
    });

    ws.on("close", () => {
      ws.isAlive = false;
    });

    ws.on("error", (err) => {
      console.error("WebSocket client error", err);
    });
  });

  const interval = setInterval(() => {
    wss.clients.forEach((ws) => {
      if (!ws.isAlive) {
        ws.terminate();
        return;
      }

      ws.isAlive = false;

      if (ws.readyState === WebSocket.OPEN) {
        ws.ping();
      }
    });
  }, 30000);

  wss.on("close", () => clearInterval(interval));

  function broadcastMatchCreated(match) {
    broadcast(wss, { type: "match_created", data: match });
  }

  return { broadcastMatchCreated };
}