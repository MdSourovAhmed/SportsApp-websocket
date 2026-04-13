// import { useEffect, useRef, useState, useCallback } from "react";

// const WS_URL = import.meta.env.VITE_WS_URL || "ws://localhost:7000/ws";
// const RECONNECT_DELAYS = [1000, 2000, 4000, 8000, 15000];

// export function useWebSocket(onMessage) {
//   const [status, setStatus] = useState("connecting"); // connecting | connected | disconnected
//   const wsRef = useRef(null);
//   const reconnectAttempt = useRef(0);
//   const reconnectTimer = useRef(null);
//   const subscriptions = useRef(new Set());
//   const onMessageRef = useRef(onMessage);
//   const unmounted = useRef(false);

//   useEffect(() => { onMessageRef.current = onMessage; }, [onMessage]);

//   const connect = useCallback(() => {
//     if (unmounted.current) return;
//     setStatus("connecting");

//     const ws = new WebSocket(WS_URL);
//     wsRef.current = ws;

//     ws.onopen = () => {
//       if (unmounted.current) return;
//       reconnectAttempt.current = 0;
//       setStatus("connected");
//       // Re-subscribe to all rooms after reconnect
//       subscriptions.current.forEach(id => {
//         ws.send(JSON.stringify({ type: "subscribe", matchId: id }));
//       });
//     };

//     ws.onmessage = (e) => {
//       try {
//         const msg = JSON.parse(e.data);
//         onMessageRef.current?.(msg);
//       } catch {}
//     };

//     ws.onclose = () => {
//       if (unmounted.current) return;
//       setStatus("disconnected");
//       const delay = RECONNECT_DELAYS[
//         Math.min(reconnectAttempt.current, RECONNECT_DELAYS.length - 1)
//       ];
//       reconnectAttempt.current++;
//       reconnectTimer.current = setTimeout(connect, delay);
//     };

//     ws.onerror = () => ws.close();
//   }, []);

//   useEffect(() => {
//     connect();
//     return () => {
//       unmounted.current = true;
//       clearTimeout(reconnectTimer.current);
//       wsRef.current?.close();
//     };
//   }, [connect]);

//   const subscribe = useCallback((matchId) => {
//     subscriptions.current.add(matchId);
//     if (wsRef.current?.readyState === WebSocket.OPEN) {
//       wsRef.current.send(JSON.stringify({ type: "subscribe", matchId }));
//     }
//   }, []);

//   const unsubscribe = useCallback((matchId) => {
//     subscriptions.current.delete(matchId);
//     if (wsRef.current?.readyState === WebSocket.OPEN) {
//       wsRef.current.send(JSON.stringify({ type: "unsubscribe", matchId }));
//     }
//   }, []);

//   return { status, subscribe, unsubscribe };
// }



import { useEffect, useRef, useState, useCallback } from "react";

const WS_URL = import.meta.env.VITE_WS_URL || "ws://localhost:7000/ws";

// Exponential backoff delays (ms): 1s, 2s, 4s, 8s, then cap at 15s
const BACKOFF = [1000, 2000, 4000, 8000, 15000];

export function useWebSocket(onMessage) {
  const [status, setStatus] = useState("connecting");
  const wsRef = useRef(null);
  const attemptRef = useRef(0);
  const timerRef = useRef(null);
  const subsRef = useRef(new Set());   // matchIds currently subscribed
  const onMessageRef = useRef(onMessage);
  const unmountedRef = useRef(false);

  console.log('websocket----');

  // Always call the latest onMessage without resetting the connection
  useEffect(() => { onMessageRef.current = onMessage; }, [onMessage]);
  console.log('websocket----1');
  const connect = useCallback(() => {
    if (unmountedRef.current) return;

    setStatus("connecting");

    const ws = new WebSocket(WS_URL);
    wsRef.current = ws;
    console.log('websocket----2', ws);
    // ── onopen ──────────────────────────────────────────────────────────
    ws.onopen = () => {
      console.log({ 'msg ': 'Websocket is open...' });
      if (unmountedRef.current) { ws.close(); return; }
      // The backend sends { type: "welcome" } immediately on open — we wait
      // for it in onmessage before setting "connected" so we know the server
      // is ready before re-subscribing.
    };

    // ── onmessage ────────────────────────────────────────────────────────
    ws.onmessage = (event) => {
      let msg;
      try {
        msg = JSON.parse(event.data);
        console.log({ 'msg ': msg });
      } catch {
        console.warn("[WS] Received non-JSON frame:", event.data);
        return;
      }

      // Backend welcome handshake — server is ready, reset backoff and
      // re-subscribe to any rooms the hook was tracking before reconnect.
      if (msg.type === "welcome") {
        console.log(msg);
        attemptRef.current = 0;
        setStatus("connected");

        subsRef.current.forEach((matchId) => {
          ws.send(JSON.stringify({ type: "subscribe", matchId }));
        });
        return; // don't forward welcome to consumers
      }

      // Forward everything else (match_created, score_update, commentary,
      // subscribed, unsubscribed, error) to the consumer callback.
      onMessageRef.current?.(msg);
    };

    // ── onclose ──────────────────────────────────────────────────────────
    ws.onclose = (event) => {
      if (unmountedRef.current) return;
      setStatus("disconnected");

      // code 1000 = normal closure (e.g. server shutdown or intentional
      // client close). Still reconnect — the server may restart.
      const delay = BACKOFF[Math.min(attemptRef.current, BACKOFF.length - 1)];
      attemptRef.current += 1;

      console.info(
        `[WS] Closed (code ${event.code}). Reconnecting in ${delay}ms (attempt ${attemptRef.current})`
      );

      timerRef.current = setTimeout(connect, delay);
    };

    // ── onerror ──────────────────────────────────────────────────────────
    // onerror is always followed by onclose in the browser WS API, so we
    // just log here and let onclose handle the reconnect logic.
    ws.onerror = (event) => {
      console.error("[WS] Socket error:", event);
    };
  }, []); // stable — no deps change after mount

  // Mount / unmount lifecycle
  useEffect(() => {
    connect();
    return () => {
      unmountedRef.current = true;
      if (wsRef.current && wsRef.current.readyState === 1) {
        // wsRef.current.close();
        wsRef.current?.close(1000, "component unmounted");
      }
      clearTimeout(timerRef.current);

    };
  }, [connect]);

  // ── subscribe ────────────────────────────────────────────────────────────
  // Safe to call before the socket is open — the id is stored in subsRef and
  // sent automatically once the welcome handshake completes (or on reconnect).
  const subscribe = useCallback((matchId) => {
    subsRef.current.add(matchId);
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type: "subscribe", matchId }));
    }
  }, []);

  // ── unsubscribe ───────────────────────────────────────────────────────────
  const unsubscribe = useCallback((matchId) => {
    subsRef.current.delete(matchId);
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type: "unsubscribe", matchId }));
    }
  }, []);

  // ── send ─────────────────────────────────────────────────────────────────
  // Utility for any ad-hoc message — returns false if socket is not open.
  const send = useCallback((payload) => {
    if (wsRef.current?.readyState !== WebSocket.OPEN) return false;
    wsRef.current.send(JSON.stringify(payload));
    return true;
  }, []);

  return { status, subscribe, unsubscribe, send };
}