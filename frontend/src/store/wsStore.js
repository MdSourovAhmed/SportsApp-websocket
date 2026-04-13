// import { create } from "zustand";

// const WS_URL = import.meta.env.VITE_WS_URL || "ws://localhost:7000/ws";
// const RECONNECT_DELAY = 2000;

// // Helper: update a match in matchList by id
// function patchMatchList(list, matchData) {
//   const exists = list.some((m) => m.id === matchData.id);
//   if (!exists) return list;
//   return list.map((m) => (m.id === matchData.id ? { ...m, ...matchData } : m));
// }

// export const useWSStore = create((set, get) => ({
//   // ── Connection ─────────────────────────────────────────────────────────
//   socket:        null,
//   connected:     false,
//   welcomed:      false,
//   wsStatus:      "connecting",
//   subscriptions: new Set(),

//   // ── Data ───────────────────────────────────────────────────────────────
//   matchList: [],
//   // Per-match live state: { [matchId]: { homeScore, awayScore, commentary[] } }
//   matches: {},

//   // ── Connect ────────────────────────────────────────────────────────────
//   connect: () => {
//     if (get().socket) return;
//     set({ wsStatus: "connecting" });

//     const ws = new WebSocket(WS_URL);

//     ws.onopen = () => set({ connected: true });

//     ws.onmessage = (event) => {
//       let msg;
//       try { msg = JSON.parse(event.data); }
//       catch { console.warn("[WS] Non-JSON frame:", event.data); return; }

//       // ── welcome ─────────────────────────────────────────────────────
//       if (msg.type === "welcome") {
//         set({ welcomed: true, wsStatus: "connected" });
//         const { socket, subscriptions } = get();
//         subscriptions.forEach((id) =>
//           socket?.send(JSON.stringify({ type: "subscribe", matchId: id }))
//         );
//         return;
//       }

//       // ── match_created ────────────────────────────────────────────────
//       if (msg.type === "match_created") {
//         set((s) => ({
//           matchList: s.matchList.some((m) => m.id === msg.data.id)
//             ? s.matchList
//             : [msg.data, ...s.matchList],
//         }));
//         return;
//       }

//       // ── score_update ─────────────────────────────────────────────────
//       if (msg.type === "score_update") {
//         const matchId = msg.data.matchId;
//         set((s) => ({
//           matches: {
//             ...s.matches,
//             [matchId]: {
//               ...(s.matches[matchId] || {}),
//               homeScore: msg.data.homeScore,
//               awayScore: msg.data.awayScore,
//             },
//           },
//           matchList: s.matchList.map((m) =>
//             m.id === matchId
//               ? { ...m, homeScore: msg.data.homeScore, awayScore: msg.data.awayScore }
//               : m
//           ),
//         }));
//         return;
//       }

//       // ── commentary ───────────────────────────────────────────────────
//       if (msg.type === "commentary") {
//         const matchId = msg.data?.matchId;
//         if (matchId == null) return;
//         set((s) => {
//           const existing = s.matches[matchId] || {};
//           const feed = existing.commentary || [];
//           if (feed.some((c) => c.id === msg.data.id)) return s;
//           return {
//             matches: {
//               ...s.matches,
//               [matchId]: { ...existing, commentary: [msg.data, ...feed] },
//             },
//           };
//         });
//         return;
//       }

//       // ── match_suspended ──────────────────────────────────────────────
//       // Admin paused the match. Update matchList so lobby cards refresh.
//       // The match itself stays in the list — viewers can still see it.
//       if (msg.type === "match_suspended") {
//         set((s) => ({ matchList: patchMatchList(s.matchList, msg.data) }));
//         return;
//       }

//       // ── match_abandoned ──────────────────────────────────────────────
//       if (msg.type === "match_abandoned") {
//         set((s) => ({ matchList: patchMatchList(s.matchList, msg.data) }));
//         return;
//       }

//       // ── match_rescheduled ────────────────────────────────────────────
//       if (msg.type === "match_rescheduled") {
//         set((s) => ({ matchList: patchMatchList(s.matchList, msg.data) }));
//         return;
//       }

//       // ── match_force_finished ─────────────────────────────────────────
//       if (msg.type === "match_force_finished") {
//         set((s) => ({ matchList: patchMatchList(s.matchList, msg.data) }));
//         return;
//       }

//       // ── match_updated ────────────────────────────────────────────────
//       // General edit (teams, sport, times)
//       if (msg.type === "match_updated") {
//         set((s) => ({ matchList: patchMatchList(s.matchList, msg.data) }));
//         return;
//       }

//       // ── match_deleted ────────────────────────────────────────────────
//       // Remove from list entirely. GameRoom watches this and navigates away.
//       if (msg.type === "match_deleted") {
//         const matchId = msg.data.matchId;
//         set((s) => ({
//           matchList: s.matchList.filter((m) => m.id !== matchId),
//           matches: Object.fromEntries(
//             Object.entries(s.matches).filter(([k]) => Number(k) !== matchId)
//           ),
//         }));
//         return;
//       }
//     };

//     ws.onclose = (event) => {
//       set({ socket: null, connected: false, welcomed: false, wsStatus: "disconnected" });
//       console.info(`[WS] Closed (${event.code}). Reconnecting in ${RECONNECT_DELAY}ms…`);
//       setTimeout(() => get().connect(), RECONNECT_DELAY);
//     };

//     ws.onerror = (err) => console.error("[WS] Error:", err);

//     set({ socket: ws });
//   },

//   disconnect: () => {
//     const { socket } = get();
//     if (!socket) return;
//     set({ socket: null, connected: false, welcomed: false, wsStatus: "disconnected" });
//     socket.close(1000, "intentional disconnect");
//   },

//   subscribe: (matchId) => {
//     const { socket, welcomed, subscriptions } = get();
//     if (subscriptions.has(matchId)) return;
//     subscriptions.add(matchId);
//     set({ subscriptions: new Set(subscriptions) });
//     if (socket && welcomed)
//       socket.send(JSON.stringify({ type: "subscribe", matchId }));
//   },

//   unsubscribe: (matchId) => {
//     const { socket, subscriptions } = get();
//     if (!subscriptions.has(matchId)) return;
//     subscriptions.delete(matchId);
//     set({ subscriptions: new Set(subscriptions) });
//     if (socket?.readyState === WebSocket.OPEN)
//       socket.send(JSON.stringify({ type: "unsubscribe", matchId }));
//   },

//   // ── REST setters ─────────────────────────────────────────────────────
//   setMatchList: (list) => set({ matchList: list }),

//   setCommentary: (matchId, items) =>
//     set((s) => {
//       const existing = s.matches[matchId] || {};
//       const liveFeed = existing.commentary || [];
//       const merged = [...liveFeed];
//       for (const item of items) {
//         if (!merged.some((c) => c.id === item.id)) merged.push(item);
//       }
//       merged.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
//       return { matches: { ...s.matches, [matchId]: { ...existing, commentary: merged } } };
//     }),

//   upsertMatch: (match) =>
//     set((s) => ({
//       matchList: s.matchList.some((m) => m.id === match.id)
//         ? s.matchList.map((m) => (m.id === match.id ? match : m))
//         : [match, ...s.matchList],
//     })),

//   removeMatch: (matchId) =>
//     set((s) => ({
//       matchList: s.matchList.filter((m) => m.id !== matchId),
//       matches: Object.fromEntries(
//         Object.entries(s.matches).filter(([k]) => Number(k) !== matchId)
//       ),
//     })),
// }));






import { create } from "zustand";

const WS_URL = import.meta.env.VITE_WS_URL || "ws://localhost:7000/ws";
const RECONNECT_DELAY = 2000;

// Helper: update a match in matchList by id
function patchMatchList(list, matchData) {
  const exists = list.some((m) => m.id === matchData.id);
  if (!exists) return list;
  return list.map((m) => (m.id === matchData.id ? { ...m, ...matchData } : m));
}

export const useWSStore = create((set, get) => ({
  // ── Connection ─────────────────────────────────────────────────────────
  socket:        null,
  connected:     false,
  welcomed:      false,
  wsStatus:      "connecting",
  subscriptions: new Set(),

  // ── Data ───────────────────────────────────────────────────────────────
  matchList: [],
  // Per-match live state: { [matchId]: { homeScore, awayScore, commentary[] } }
  matches: {},

  // ── Connect ────────────────────────────────────────────────────────────
  connect: () => {
    if (get().socket) return;
    set({ wsStatus: "connecting" });

    const ws = new WebSocket(WS_URL);

    ws.onopen = () => set({ connected: true });

    ws.onmessage = (event) => {
      let msg;
      try { msg = JSON.parse(event.data); }
      catch { console.warn("[WS] Non-JSON frame:", event.data); return; }

      // ── welcome ─────────────────────────────────────────────────────
      if (msg.type === "welcome") {
        set({ welcomed: true, wsStatus: "connected" });
        const { socket, subscriptions } = get();
        subscriptions.forEach((id) =>
          socket?.send(JSON.stringify({ type: "subscribe", matchId: id }))
        );
        return;
      }

      // ── match_created ────────────────────────────────────────────────
      if (msg.type === "match_created") {
        set((s) => ({
          matchList: s.matchList.some((m) => m.id === msg.data.id)
            ? s.matchList
            : [msg.data, ...s.matchList],
        }));
        return;
      }

      // ── score_update ─────────────────────────────────────────────────
      if (msg.type === "score_update") {
        const matchId = msg.data.matchId;
        set((s) => ({
          matches: {
            ...s.matches,
            [matchId]: {
              ...(s.matches[matchId] || {}),
              homeScore: msg.data.homeScore,
              awayScore: msg.data.awayScore,
            },
          },
          matchList: s.matchList.map((m) =>
            m.id === matchId
              ? { ...m, homeScore: msg.data.homeScore, awayScore: msg.data.awayScore }
              : m
          ),
        }));
        return;
      }

      // ── commentary ───────────────────────────────────────────────────
      if (msg.type === "commentary") {
        const matchId = msg.data?.matchId;
        if (matchId == null) return;
        set((s) => {
          const existing = s.matches[matchId] || {};
          const feed = existing.commentary || [];
          if (feed.some((c) => c.id === msg.data.id)) return s;
          return {
            matches: {
              ...s.matches,
              [matchId]: { ...existing, commentary: [msg.data, ...feed] },
            },
          };
        });
        return;
      }

      // ── match_suspended ──────────────────────────────────────────────
      // Admin paused the match. Update matchList so lobby cards refresh.
      // The match itself stays in the list — viewers can still see it.
      if (msg.type === "match_suspended") {
        set((s) => ({ matchList: patchMatchList(s.matchList, msg.data) }));
        return;
      }

      // ── match_abandoned ──────────────────────────────────────────────
      if (msg.type === "match_abandoned") {
        set((s) => ({ matchList: patchMatchList(s.matchList, msg.data) }));
        return;
      }

      // ── match_rescheduled ────────────────────────────────────────────
      if (msg.type === "match_rescheduled") {
        set((s) => ({ matchList: patchMatchList(s.matchList, msg.data) }));
        return;
      }

      // ── match_force_finished ─────────────────────────────────────────
      if (msg.type === "match_force_finished") {
        set((s) => ({ matchList: patchMatchList(s.matchList, msg.data) }));
        return;
      }

      // ── match_updated ────────────────────────────────────────────────
      // General edit (teams, sport, times)
      if (msg.type === "match_updated") {
        set((s) => ({ matchList: patchMatchList(s.matchList, msg.data) }));
        return;
      }

      // ── match_deleted ────────────────────────────────────────────────
      // Remove from list entirely. GameRoom watches this and navigates away.
      if (msg.type === "match_deleted") {
        const matchId = msg.data.matchId;
        set((s) => ({
          matchList: s.matchList.filter((m) => m.id !== matchId),
          matches: Object.fromEntries(
            Object.entries(s.matches).filter(([k]) => Number(k) !== matchId)
          ),
        }));
        return;
      }
    };

    ws.onclose = (event) => {
      set({ socket: null, connected: false, welcomed: false, wsStatus: "disconnected" });
      console.info(`[WS] Closed (${event.code}). Reconnecting in ${RECONNECT_DELAY}ms…`);
      setTimeout(() => get().connect(), RECONNECT_DELAY);
    };

    ws.onerror = (err) => console.error("[WS] Error:", err);

    set({ socket: ws });
  },

  disconnect: () => {
    const { socket } = get();
    if (!socket) return;
    set({ socket: null, connected: false, welcomed: false, wsStatus: "disconnected" });
    socket.close(1000, "intentional disconnect");
  },

  subscribe: (matchId) => {
    const { socket, welcomed, subscriptions } = get();
    if (subscriptions.has(matchId)) return;
    subscriptions.add(matchId);
    set({ subscriptions: new Set(subscriptions) });
    if (socket && welcomed)
      socket.send(JSON.stringify({ type: "subscribe", matchId }));
  },

  unsubscribe: (matchId) => {
    const { socket, subscriptions } = get();
    if (!subscriptions.has(matchId)) return;
    subscriptions.delete(matchId);
    set({ subscriptions: new Set(subscriptions) });
    if (socket?.readyState === WebSocket.OPEN)
      socket.send(JSON.stringify({ type: "unsubscribe", matchId }));
  },

  // ── REST setters ─────────────────────────────────────────────────────
  setMatchList: (list) => set({ matchList: list }),

  setCommentary: (matchId, items) =>
    set((s) => {
      const existing = s.matches[matchId] || {};
      const liveFeed = existing.commentary || [];
      const merged = [...liveFeed];
      for (const item of items) {
        if (!merged.some((c) => c.id === item.id)) merged.push(item);
      }
      merged.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      return { matches: { ...s.matches, [matchId]: { ...existing, commentary: merged } } };
    }),

  upsertMatch: (match) =>
    set((s) => ({
      matchList: s.matchList.some((m) => m.id === match.id)
        ? s.matchList.map((m) => (m.id === match.id ? match : m))
        : [match, ...s.matchList],
    })),

  removeMatch: (matchId) =>
    set((s) => ({
      matchList: s.matchList.filter((m) => m.id !== matchId),
      matches: Object.fromEntries(
        Object.entries(s.matches).filter(([k]) => Number(k) !== matchId)
      ),
    })),
}));