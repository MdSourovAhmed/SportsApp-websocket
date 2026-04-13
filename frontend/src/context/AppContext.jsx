import { createContext, useContext, useReducer, useCallback, useRef } from "react";

const AppContext = createContext(null);

const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || "admin123";

function reducer(state, action) {
  switch (action.type) {
    case "SET_MATCHES":
      return { ...state, matches: action.payload };

    case "ADD_MATCH": {
      const exists = state.matches.some(m => m.id === action.payload.id);
      return exists ? state : { ...state, matches: [action.payload, ...state.matches] };
    }

    case "UPDATE_SCORE":
      return {
        ...state,
        matches: state.matches.map(m =>
          m.id === action.payload.matchId
            ? {
                ...m,
                homeScore: action.payload.homeScore,
                awayScore: action.payload.awayScore,
              }
            : m
        ),
      };

    case "ADD_COMMENTARY": {
      const { matchId, comment } = action.payload;
      const existing = state.commentary[matchId] || [];
      // Deduplicate by id — WS + initial HTTP load can both deliver the same event
      if (existing.some(c => c.id === comment.id)) return state;
      return {
        ...state,
        commentary: {
          ...state.commentary,
          [matchId]: [comment, ...existing],
        },
      };
    }

    case "SET_COMMENTARY":
      return {
        ...state,
        commentary: {
          ...state.commentary,
          [action.payload.matchId]: action.payload.data,
        },
      };

    case "LOGIN":
      return { ...state, isAdmin: true };

    case "LOGOUT":
      return { ...state, isAdmin: false };

    default:
      return state;
  }
}

const initial = {
  matches: [],
  commentary: {},
  isAdmin: false,
};

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initial);

  // Room-level handlers registered by GameRoom so it can intercept messages
  // that carry a matchId in context (score_update, commentary) and act on
  // them before or after the global dispatch.
  // Shape: Map<matchId, fn>
  const roomHandlersRef = useRef(new Map());

  // ── Global WS message handler ─────────────────────────────────────────
  // Called by every component that owns a useWebSocket instance.
  // Because all WS events are routed here, each event type is handled once.
  const handleWsMessage = useCallback((msg) => {
    console.log(msg);
    switch (msg.type) {

      // Broadcasted to ALL clients when a new match is created
      case "match_created":
        dispatch({ type: "ADD_MATCH", payload: msg.data });
        break;

      // Broadcasted only to subscribers of that match room.
      // Backend payload: { type: "score_update", data: { homeScore, awayScore } }
      // matchId is NOT inside data — it comes via the room subscription context.
      // GameRoom registers a handler via registerRoomHandler(matchId, fn) so we
      // can route it there; the handler is responsible for dispatching UPDATE_SCORE
      // with the correct matchId attached.
      case "score_update":
        roomHandlersRef.current.forEach((fn) => fn(msg));
        break;

      // Broadcasted only to subscribers of that match room.
      // commentary.data includes matchId from the DB record.
      case "commentary":
        if (msg.data?.matchId != null) {
          dispatch({
            type: "ADD_COMMENTARY",
            payload: { matchId: msg.data.matchId, comment: msg.data },
          });
        }
        // Also forward to any room-level handler that wants it
        roomHandlersRef.current.forEach((fn) => fn(msg));
        break;

      // Confirmation frames — informational, no state change needed
      case "subscribed":
      case "unsubscribed":
      case "error":
        break;

      default:
        break;
    }
  }, []);

  // ── Room handler registration ─────────────────────────────────────────
  // GameRoom calls this on mount to receive score_update for its matchId.
  // Returns a cleanup function to deregister on unmount.
  const registerRoomHandler = useCallback((matchId, fn) => {
    roomHandlersRef.current.set(matchId, fn);
    return () => roomHandlersRef.current.delete(matchId);
  }, []);

  const login = useCallback((password) => {
    if (password === ADMIN_PASSWORD) {
      dispatch({ type: "LOGIN" });
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => dispatch({ type: "LOGOUT" }), []);

  return (
    <AppContext.Provider
      value={{ state, dispatch, handleWsMessage, registerRoomHandler, login, logout }}
    >
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);