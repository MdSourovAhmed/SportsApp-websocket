

// import { WebSocket, WebSocketServer } from "ws";
// import { wsArcjet } from "../middleware/arcjet.js";

// // ── Per-match subscription registry ──────────────────────────────────────
// // matchId (number) → Set<WebSocket>
// const matchSubscribers = new Map();

// function addSubscriber(matchId, socket) {
//   if (!matchSubscribers.has(matchId)) {
//     matchSubscribers.set(matchId, new Set());
//   }
//   matchSubscribers.get(matchId).add(socket);
// }

// function removeSubscriber(matchId, socket) {
//   const subs = matchSubscribers.get(matchId);
//   if (!subs) return;
//   subs.delete(socket);
//   if (subs.size === 0) matchSubscribers.delete(matchId);
// }

// function cleanupSocket(socket) {
//   for (const matchId of socket.subscriptions) {
//     removeSubscriber(matchId, socket);
//   }
//   socket.subscriptions.clear();
// }

// // ── Safe JSON send ────────────────────────────────────────────────────────
// function sendJson(socket, payload) {
//   if (socket.readyState !== WebSocket.OPEN) return;
//   try {
//     socket.send(JSON.stringify(payload));
//   } catch (err) {
//     console.error("[WS] sendJson error:", err);
//   }
// }

// // ── Broadcast helpers ─────────────────────────────────────────────────────
// function broadcastToAll(wss, payload) {
//   const data = JSON.stringify(payload);
//   for (const client of wss.clients) {
//     if (client.readyState !== WebSocket.OPEN) continue;
//     if (client.bufferedAmount > 1e6) {
//       console.warn("[WS] Slow client terminated (broadcastToAll)");
//       client.terminate();
//       continue;
//     }
//     try {
//       client.send(data);
//     } catch (err) {
//       console.error("[WS] broadcastToAll send error:", err);
//     }
//   }
// }

// function broadcastToMatch(matchId, payload) {
//   const subs = matchSubscribers.get(matchId);
//   if (!subs || subs.size === 0) return;

//   const data = JSON.stringify(payload);
//   for (const client of subs) {
//     if (client.readyState !== WebSocket.OPEN) continue;
//     if (client.bufferedAmount > 1e6) {
//       console.warn("[WS] Slow match subscriber terminated");
//       client.terminate();
//       continue;
//     }
//     try {
//       client.send(data);
//     } catch (err) {
//       console.error("[WS] broadcastToMatch send error:", err);
//       client.terminate();
//     }
//   }
// }

// // ── Inbound message handler ───────────────────────────────────────────────
// function handleClientMessage(socket, raw) {
//   let msg;
//   try {
//     msg = JSON.parse(raw.toString());
//   } catch {
//     sendJson(socket, { type: "error", message: "Invalid JSON." });
//     return;
//   }

//   // subscribe
//   if (msg?.type === "subscribe" && Number.isInteger(msg.matchId)) {
//     if (socket.subscriptions.size >= 100) {
//       sendJson(socket, { type: "error", message: "Subscription limit reached." });
//       return;
//     }
//     addSubscriber(msg.matchId, socket);
//     socket.subscriptions.add(msg.matchId);
//     sendJson(socket, { type: "subscribed", matchId: msg.matchId });
//     return;
//   }

//   // unsubscribe
//   if (msg?.type === "unsubscribe" && Number.isInteger(msg.matchId)) {
//     removeSubscriber(msg.matchId, socket);
//     socket.subscriptions.delete(msg.matchId);
//     sendJson(socket, { type: "unsubscribed", matchId: msg.matchId });
//     return;
//   }

//   sendJson(socket, { type: "error", message: `Unknown message type: ${msg?.type}` });
// }

// // ── Main export ───────────────────────────────────────────────────────────
// export function attachWebSocketServer(server) {
//   const wss = new WebSocketServer({
//     noServer: true,   // we handle the upgrade manually for Arcjet + path check
//     maxPayload: 64 * 1024,  // 64 KB max inbound frame
//   });

//   // ── Upgrade handler ─────────────────────────────────────────────────────
//   server.on("upgrade", async (req, socket, head) => {
//     // Only handle the /ws path; leave all others to Express or any other WS server
//     let pathname;
//     try {
//       pathname = new URL(req.url, `http://${req.headers.host}`).pathname;
//     } catch {
//       socket.destroy();
//       return;
//     }

//     if (pathname !== "/ws") return;

//     // Arcjet guard (optional — skipped when ARCJET_KEY is not set)
//     if (wsArcjet) {
//       try {
//         const decision = await wsArcjet.protect(req);
//         if (decision.isDenied()) {
//           const isRate = decision.reason?.isRateLimit?.();
//           socket.write(
//             isRate
//               ? "HTTP/1.1 429 Too Many Requests\r\nConnection: close\r\n\r\n"
//               : "HTTP/1.1 403 Forbidden\r\nConnection: close\r\n\r\n"
//           );
//           socket.destroy();
//           return;
//         }
//       } catch (err) {
//         console.error("[WS] Arcjet upgrade error:", err);
//         socket.write("HTTP/1.1 500 Internal Server Error\r\nConnection: close\r\n\r\n");
//         socket.destroy();
//         return;
//       }
//     }

//     wss.handleUpgrade(req, socket, head, (ws) => {
//       ws.meta = {
//         ip: req.socket?.remoteAddress ?? "unknown",
//         connectedAt: Date.now(),
//       };
//       wss.emit("connection", ws, req);
//     });
//   });

//   // ── Connection handler ──────────────────────────────────────────────────
//   wss.on("connection", (ws) => {
//     ws.isAlive      = true;
//     ws.subscriptions = new Set();

//     // Handshake — frontend waits for this before sending subscriptions
//     sendJson(ws, { type: "welcome" });

//     ws.on("pong", () => { ws.isAlive = true; });

//     ws.on("message", (data) => handleClientMessage(ws, data));

//     ws.on("error", (err) => {
//       console.error("[WS] Client error:", err.message);
//       ws.terminate();
//     });

//     ws.on("close", (code, reason) => {
//       cleanupSocket(ws);
//       ws.isAlive = false;
//     });
//   });

//   // ── Heartbeat — 30-second ping/pong cycle ───────────────────────────────
//   // Any client that misses two consecutive pings (missed the first pong) is
//   // terminated. isAlive is reset to false before each ping and set back to
//   // true when the pong arrives.
//   const heartbeat = setInterval(() => {
//     for (const ws of wss.clients) {
//       if (!ws.isAlive) {
//         ws.terminate();
//         continue;
//       }
//       ws.isAlive = false;
//       if (ws.readyState === WebSocket.OPEN) ws.ping();
//     }
//   }, 30_000);

//   wss.on("close", () => clearInterval(heartbeat));

//   // ── Public broadcast API (called by route handlers via app.locals) ───────
//   return {
//     /**
//      * Sent to every connected client when a new match is created.
//      * @param {object} match  Full match row from the DB
//      */
//     broadcastMatchCreated(match) {
//       broadcastToAll(wss, { type: "match_created", data: match });
//     },

//     /**
//      * Sent only to clients subscribed to this match room when the score changes.
//      * Note: matchId is intentionally NOT embedded in data — the frontend derives
//      * it from the room context (which matchId it subscribed to).
//      * @param {number} matchId
//      * @param {{ homeScore: number, awayScore: number }} scores
//      */
//     broadcastScoreUpdate(matchId, scores) {
//       broadcastToMatch(matchId, { type: "score_update", data: scores });
//     },

//     /**
//      * Sent only to clients subscribed to this match room when commentary is posted.
//      * The full DB record is forwarded — it includes matchId as a field.
//      * @param {number} matchId
//      * @param {object} comment  Full commentary row from the DB
//      */
//     broadcastCommentary(matchId, comment) {
//       broadcastToMatch(matchId, { type: "commentary", data: comment });
//     },
//   };
// }



// import { WebSocket, WebSocketServer } from "ws";
// import { wsArcjet } from "../middleware/arcjet.js";

// // ── Per-match subscription registry ──────────────────────────────────────
// const matchSubscribers = new Map();

// function addSubscriber(matchId, socket) {
//   if (!matchSubscribers.has(matchId)) matchSubscribers.set(matchId, new Set());
//   matchSubscribers.get(matchId).add(socket);
// }

// function removeSubscriber(matchId, socket) {
//   const subs = matchSubscribers.get(matchId);
//   if (!subs) return;
//   subs.delete(socket);
//   if (subs.size === 0) matchSubscribers.delete(matchId);
// }

// function cleanupSocket(socket) {
//   for (const matchId of socket.subscriptions) removeSubscriber(matchId, socket);
//   socket.subscriptions.clear();
// }

// // ── Safe JSON send ────────────────────────────────────────────────────────
// function sendJson(socket, payload) {
//   if (socket.readyState !== WebSocket.OPEN) return;
//   try { socket.send(JSON.stringify(payload)); }
//   catch (err) { console.error("[WS] sendJson error:", err); }
// }

// // ── Broadcast helpers ─────────────────────────────────────────────────────
// function broadcastToAll(wss, payload) {
//   const data = JSON.stringify(payload);
//   for (const client of wss.clients) {
//     if (client.readyState !== WebSocket.OPEN) continue;
//     if (client.bufferedAmount > 1e6) { client.terminate(); continue; }
//     try { client.send(data); } catch (err) { console.error("[WS] broadcastToAll error:", err); }
//   }
// }

// function broadcastToMatch(matchId, payload) {
//   const subs = matchSubscribers.get(matchId);
//   if (!subs || subs.size === 0) return;
//   const data = JSON.stringify(payload);
//   for (const client of subs) {
//     if (client.readyState !== WebSocket.OPEN) continue;
//     if (client.bufferedAmount > 1e6) { client.terminate(); continue; }
//     try { client.send(data); } catch (err) { client.terminate(); }
//   }
// }

// // ── Inbound message handler ───────────────────────────────────────────────
// function handleClientMessage(socket, raw) {
//   let msg;
//   try { msg = JSON.parse(raw.toString()); }
//   catch { sendJson(socket, { type: "error", message: "Invalid JSON." }); return; }

//   if (msg?.type === "subscribe" && Number.isInteger(msg.matchId)) {
//     if (socket.subscriptions.size >= 100) {
//       sendJson(socket, { type: "error", message: "Subscription limit reached." });
//       return;
//     }
//     addSubscriber(msg.matchId, socket);
//     socket.subscriptions.add(msg.matchId);
//     sendJson(socket, { type: "subscribed", matchId: msg.matchId });
//     return;
//   }

//   if (msg?.type === "unsubscribe" && Number.isInteger(msg.matchId)) {
//     removeSubscriber(msg.matchId, socket);
//     socket.subscriptions.delete(msg.matchId);
//     sendJson(socket, { type: "unsubscribed", matchId: msg.matchId });
//     return;
//   }

//   sendJson(socket, { type: "error", message: `Unknown message type: ${msg?.type}` });
// }

// // ── Main export ───────────────────────────────────────────────────────────
// export function attachWebSocketServer(server) {
//   const wss = new WebSocketServer({ noServer: true, maxPayload: 64 * 1024 });

//   server.on("upgrade", async (req, socket, head) => {
//     let pathname;
//     try { pathname = new URL(req.url, `http://${req.headers.host}`).pathname; }
//     catch { socket.destroy(); return; }

//     if (pathname !== "/ws") return;

//     if (wsArcjet) {
//       try {
//         const decision = await wsArcjet.protect(req);
//         if (decision.isDenied()) {
//           const isRate = decision.reason?.isRateLimit?.();
//           socket.write(isRate
//             ? "HTTP/1.1 429 Too Many Requests\r\nConnection: close\r\n\r\n"
//             : "HTTP/1.1 403 Forbidden\r\nConnection: close\r\n\r\n");
//           socket.destroy();
//           return;
//         }
//       } catch (err) {
//         console.error("[WS] Arcjet upgrade error:", err);
//         socket.write("HTTP/1.1 500 Internal Server Error\r\nConnection: close\r\n\r\n");
//         socket.destroy();
//         return;
//       }
//     }

//     wss.handleUpgrade(req, socket, head, (ws) => {
//       ws.meta = { ip: req.socket?.remoteAddress ?? "unknown", connectedAt: Date.now() };
//       wss.emit("connection", ws, req);
//     });
//   });

//   wss.on("connection", (ws) => {
//     ws.isAlive = true;
//     ws.subscriptions = new Set();
//     sendJson(ws, { type: "welcome" });
//     ws.on("pong", () => { ws.isAlive = true; });
//     ws.on("message", (data) => handleClientMessage(ws, data));
//     ws.on("error", (err) => { console.error("[WS] Client error:", err.message); ws.terminate(); });
//     ws.on("close", () => { cleanupSocket(ws); ws.isAlive = false; });
//   });

//   const heartbeat = setInterval(() => {
//     for (const ws of wss.clients) {
//       if (!ws.isAlive) { ws.terminate(); continue; }
//       ws.isAlive = false;
//       if (ws.readyState === WebSocket.OPEN) ws.ping();
//     }
//   }, 30_000);

//   wss.on("close", () => clearInterval(heartbeat));

//   // ── Public broadcast API ─────────────────────────────────────────────────
//   return {
//     /** New match — sent to every connected client */
//     broadcastMatchCreated: (match) =>
//       broadcastToAll(wss, { type: "match_created", data: match }),

//     /** Score change — sent only to room subscribers */
//     broadcastScoreUpdate: (matchId, scores) =>
//       broadcastToMatch(matchId, { type: "score_update", data: { matchId, ...scores } }),

//     /** Commentary event — sent only to room subscribers */
//     broadcastCommentary: (matchId, comment) =>
//       broadcastToMatch(matchId, { type: "commentary", data: comment }),

//     /**
//      * Match suspended — sent to ALL clients so lobby cards update,
//      * and to room subscribers so viewers see the alert.
//      * payload: { matchId, reason, status: "suspended" }
//      */
//     broadcastMatchSuspended: (match) => {
//       broadcastToAll(wss, { type: "match_suspended", data: match });
//     },

//     /**
//      * Match abandoned — sent to ALL clients.
//      * payload: full match row with status: "abandoned"
//      */
//     broadcastMatchAbandoned: (match) => {
//       broadcastToAll(wss, { type: "match_abandoned", data: match });
//     },

//     /**
//      * Match rescheduled — sent to ALL clients.
//      * payload: full match row with new startTime/endTime
//      */
//     broadcastMatchRescheduled: (match) => {
//       broadcastToAll(wss, { type: "match_rescheduled", data: match });
//     },

//     /**
//      * Match force-finished — sent to ALL clients.
//      * payload: full match row with status: "finished"
//      */
//     broadcastMatchForceFinished: (match) => {
//       broadcastToAll(wss, { type: "match_force_finished", data: match });
//     },

//     /**
//      * Match edited — sent to ALL clients so any stale data is refreshed.
//      * payload: full updated match row
//      */
//     broadcastMatchUpdated: (match) => {
//       broadcastToAll(wss, { type: "match_updated", data: match });
//     },

//     /**
//      * Match deleted — sent to ALL clients.
//      * Clients in that game room should navigate away.
//      * payload: { matchId }
//      */
//     broadcastMatchDeleted: (matchId) => {
//       broadcastToAll(wss, { type: "match_deleted", data: { matchId } });
//     },
//   };
// }





import { WebSocket, WebSocketServer } from "ws";
import { wsArcjet } from "../middleware/arcjet.js";

// ── Per-match subscription registry ──────────────────────────────────────
const matchSubscribers = new Map();

function addSubscriber(matchId, socket) {
  if (!matchSubscribers.has(matchId)) matchSubscribers.set(matchId, new Set());
  matchSubscribers.get(matchId).add(socket);
}

function removeSubscriber(matchId, socket) {
  const subs = matchSubscribers.get(matchId);
  if (!subs) return;
  subs.delete(socket);
  if (subs.size === 0) matchSubscribers.delete(matchId);
}

function cleanupSocket(socket) {
  for (const matchId of socket.subscriptions) removeSubscriber(matchId, socket);
  socket.subscriptions.clear();
}

// ── Safe JSON send ────────────────────────────────────────────────────────
function sendJson(socket, payload) {
  if (socket.readyState !== WebSocket.OPEN) return;
  try { socket.send(JSON.stringify(payload)); }
  catch (err) { console.error("[WS] sendJson error:", err); }
}

// ── Broadcast helpers ─────────────────────────────────────────────────────
function broadcastToAll(wss, payload) {
  const data = JSON.stringify(payload);
  for (const client of wss.clients) {
    if (client.readyState !== WebSocket.OPEN) continue;
    if (client.bufferedAmount > 1e6) { client.terminate(); continue; }
    try { client.send(data); } catch (err) { console.error("[WS] broadcastToAll error:", err); }
  }
}

function broadcastToMatch(matchId, payload) {
  const subs = matchSubscribers.get(matchId);
  if (!subs || subs.size === 0) return;
  const data = JSON.stringify(payload);
  for (const client of subs) {
    if (client.readyState !== WebSocket.OPEN) continue;
    if (client.bufferedAmount > 1e6) { client.terminate(); continue; }
    try { client.send(data); } catch (err) { client.terminate(); }
  }
}

// ── Inbound message handler ───────────────────────────────────────────────
function handleClientMessage(socket, raw) {
  let msg;
  try { msg = JSON.parse(raw.toString()); }
  catch { sendJson(socket, { type: "error", message: "Invalid JSON." }); return; }

  if (msg?.type === "subscribe" && Number.isInteger(msg.matchId)) {
    if (socket.subscriptions.size >= 100) {
      sendJson(socket, { type: "error", message: "Subscription limit reached." });
      return;
    }
    addSubscriber(msg.matchId, socket);
    socket.subscriptions.add(msg.matchId);
    sendJson(socket, { type: "subscribed", matchId: msg.matchId });
    return;
  }

  if (msg?.type === "unsubscribe" && Number.isInteger(msg.matchId)) {
    removeSubscriber(msg.matchId, socket);
    socket.subscriptions.delete(msg.matchId);
    sendJson(socket, { type: "unsubscribed", matchId: msg.matchId });
    return;
  }

  sendJson(socket, { type: "error", message: `Unknown message type: ${msg?.type}` });
}

// ── Main export ───────────────────────────────────────────────────────────
export function attachWebSocketServer(server) {
  const wss = new WebSocketServer({ noServer: true, maxPayload: 64 * 1024 });

  server.on("upgrade", async (req, socket, head) => {
    let pathname;
    try { pathname = new URL(req.url, `http://${req.headers.host}`).pathname; }
    catch { socket.destroy(); return; }

    if (pathname !== "/ws") return;

    if (wsArcjet) {
      try {
        const decision = await wsArcjet.protect(req);
        if (decision.isDenied()) {
          const isRate = decision.reason?.isRateLimit?.();
          socket.write(isRate
            ? "HTTP/1.1 429 Too Many Requests\r\nConnection: close\r\n\r\n"
            : "HTTP/1.1 403 Forbidden\r\nConnection: close\r\n\r\n");
          socket.destroy();
          return;
        }
      } catch (err) {
        console.error("[WS] Arcjet upgrade error:", err);
        socket.write("HTTP/1.1 500 Internal Server Error\r\nConnection: close\r\n\r\n");
        socket.destroy();
        return;
      }
    }

    wss.handleUpgrade(req, socket, head, (ws) => {
      ws.meta = { ip: req.socket?.remoteAddress ?? "unknown", connectedAt: Date.now() };
      wss.emit("connection", ws, req);
    });
  });

  wss.on("connection", (ws) => {
    ws.isAlive = true;
    ws.subscriptions = new Set();
    sendJson(ws, { type: "welcome" });
    ws.on("pong", () => { ws.isAlive = true; });
    ws.on("message", (data) => handleClientMessage(ws, data));
    ws.on("error", (err) => { console.error("[WS] Client error:", err.message); ws.terminate(); });
    ws.on("close", () => { cleanupSocket(ws); ws.isAlive = false; });
  });

  const heartbeat = setInterval(() => {
    for (const ws of wss.clients) {
      if (!ws.isAlive) { ws.terminate(); continue; }
      ws.isAlive = false;
      if (ws.readyState === WebSocket.OPEN) ws.ping();
    }
  }, 30_000);

  wss.on("close", () => clearInterval(heartbeat));

  // ── Public broadcast API ─────────────────────────────────────────────────
  return {
    /** New match — sent to every connected client */
    broadcastMatchCreated: (match) =>
      broadcastToAll(wss, { type: "match_created", data: match }),

    /** Score change — sent only to room subscribers */
    broadcastScoreUpdate: (matchId, scores) =>
      broadcastToMatch(matchId, { type: "score_update", data: { matchId, ...scores } }),

    /** Commentary event — sent only to room subscribers */
    broadcastCommentary: (matchId, comment) =>
      broadcastToMatch(matchId, { type: "commentary", data: comment }),

    /**
     * Match suspended — sent to ALL clients so lobby cards update,
     * and to room subscribers so viewers see the alert.
     * payload: { matchId, reason, status: "suspended" }
     */
    broadcastMatchSuspended: (match) => {
      broadcastToAll(wss, { type: "match_suspended", data: match });
    },

    /**
     * Match abandoned — sent to ALL clients.
     * payload: full match row with status: "abandoned"
     */
    broadcastMatchAbandoned: (match) => {
      broadcastToAll(wss, { type: "match_abandoned", data: match });
    },

    /**
     * Match rescheduled — sent to ALL clients.
     * payload: full match row with new startTime/endTime
     */
    broadcastMatchRescheduled: (match) => {
      broadcastToAll(wss, { type: "match_rescheduled", data: match });
    },

    /**
     * Match force-finished — sent to ALL clients.
     * payload: full match row with status: "finished"
     */
    broadcastMatchForceFinished: (match) => {
      broadcastToAll(wss, { type: "match_force_finished", data: match });
    },

    /**
     * Match edited — sent to ALL clients so any stale data is refreshed.
     * payload: full updated match row
     */
    broadcastMatchUpdated: (match) => {
      broadcastToAll(wss, { type: "match_updated", data: match });
    },

    /**
     * Match deleted — sent to ALL clients.
     * Clients in that game room should navigate away.
     * payload: { matchId }
     */
    broadcastMatchDeleted: (matchId) => {
      broadcastToAll(wss, { type: "match_deleted", data: { matchId } });
    },
  };
}