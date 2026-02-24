import { WebSocket, WebSocketServer } from "ws";
import { wsArcjet } from "../arcjet.js";

function sendJson(socket, payload) {
  if (socket.readyState !== WebSocket.OPEN) return;

  socket.send(JSON.stringify(payload));
}

function broadcast(wss, payload) {
  for (const client of wss.clients) {
    if (client.readyState !== WebSocket.OPEN) continue;

    client.send(JSON.stringify(payload));
  }
}

export function attachWebSocketServer(server) {
  const wss = new WebSocketServer({
    server,
    path: "/ws",
    maxPayload: 1024 * 1024,
  });

  // wss.on("connection", async (socket, req) => {
  //   if (wsArcjet) {
  //     try {
  //       const decesion = await wsArcjet.protect(req);

  //       if (decesion.isDenied()) {
  //         const code = decesion.reason.isRateLimit() ? 1013 : 1003;
  //         const reason = decesion.reason.isRateLimit()
  //           ? "Rate limit exceeded..."
  //           : "Access denies...";

  //         socket.close(code, reason);
  //         return;
  //       }
  //     } catch (e) {
  //       console.error("WS connection error...");
  //       socket.close(1011, "Server security error...");
  //       return;
  //     }
  //   }

  //   socket.isAlive = true;
  //   socket.on("pong", () => {
  //     socket.isAlive = true;
  //   });
  //   sendJson(socket, { type: "welcome" });

  //   socket.on("error", console.error);
  // });

  wss.on("connection", async (socket, req) => {
    if (wsArcjet) {
      try {
        const decision = await wsArcjet.protect(req);

        if (decision.isDenied()) {
          const isRateLimit = decision.reason?.isRateLimit?.();
          const code = isRateLimit ? 1013 : 1003;
          const reason = isRateLimit
            ? "Rate limit exceeded..."
            : "Access denied...";

          sendJson(socket, { type: "error", message: reason });
          socket.close(code, reason);
          return;
        }
      } catch (e) {
        console.error("WS connection error:", e);
        socket.close(1011, "Server security error...");
        return;
      }
    }

    socket.isAlive = true;

    socket.clientInfo = {
      ip: req.socket.remoteAddress,
      connectedAt: Date.now(),
    };

    socket.on("pong", () => {
      socket.isAlive = true;
    });

    socket.on("close", () => {
      socket.isAlive = false;
    });

    socket.on("error", (err) => {
      console.error("Socket error:", err);
    });

    sendJson(socket, { type: "welcome" });
  });

  const interval = setInterval(() => {
    wss.clients.forEach((ws) => {
      if (ws.isAlive === false) return ws.terminate();

      ws.isAlive = false;
      // ws.ping();
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
