// // // import { useEffect, useState, useCallback } from "react";
// // // import { useParams, useNavigate } from "react-router-dom";
// // // import { useApp } from "../context/AppContext.jsx";
// // // import { useWebSocket } from "../hooks/useWebSocket.js";
// // // import { api } from "../utils/api.js";
// // // import { Scoreboard } from "../components/Scoreboard.jsx";
// // // import { CommentaryFeed } from "../components/CommentaryFeed.jsx";
// // // import { WSStatusBadge, Spinner, EmptyState } from "../components/UI.jsx";
// // // import { getSport } from "../config/sports.js";

// // // export default function GameRoom() {
// // //   const { id } = useParams();
// // //   const matchId = Number(id);
// // //   const navigate = useNavigate();
// // //   const { state, dispatch, handleWsMessage } = useApp();

// // //   const [loading, setLoading] = useState(true);
// // //   const [commentaryLoading, setCommentaryLoading] = useState(true);
// // //   const [error, setError] = useState(null);

// // //   // Per-room WS handler — picks up events for this specific match
// // //   const onMessage = useCallback((msg) => {
// // //     handleWsMessage(msg);
// // //     // If match finishes, redirect to results
// // //     if (msg.type === "score_update" && msg.data?.matchId === matchId) {
// // //       // handled by global state
// // //     }
// // //   }, [handleWsMessage, matchId]);

// // //   const { status: wsStatus, subscribe, unsubscribe } = useWebSocket(onMessage);

// // //   // Subscribe to this room's WS channel
// // //   useEffect(() => {
// // //     if (wsStatus === "connected") subscribe(matchId);
// // //     return () => unsubscribe(matchId);
// // //   }, [wsStatus, matchId, subscribe, unsubscribe]);

// // //   // Load match list if not already in state
// // //   useEffect(() => {
// // //     if (state.matches.length === 0) {
// // //       api.getMatches(100)
// // //         .then(data => dispatch({ type: "SET_MATCHES", payload: data }))
// // //         .catch(e => setError(e.message))
// // //         .finally(() => setLoading(false));
// // //     } else {
// // //       setLoading(false);
// // //     }
// // //   }, []);

// // //   // Load commentary
// // //   useEffect(() => {
// // //     setCommentaryLoading(true);
// // //     api.getCommentary(matchId, 100)
// // //       .then(data => dispatch({ type: "SET_COMMENTARY", payload: { matchId, data } }))
// // //       .catch(() => {})
// // //       .finally(() => setCommentaryLoading(false));
// // //   }, [matchId]);

// // //   const match = state.matches.find(m => m.id === matchId);
// // //   const commentary = state.commentary[matchId] || [];
// // //   const sport = match ? getSport(match.sport) : null;

// // //   // Redirect finished match to results
// // //   useEffect(() => {
// // //     if (match?.status === "finished") navigate(`/results/${matchId}`, { replace: true });
// // //   }, [match?.status]);

// // //   if (loading) {
// // //     return (
// // //       <div className="min-h-screen bg-slate-950 flex items-center justify-center gap-3 text-slate-500">
// // //         <Spinner size={6} /> <span>Loading match…</span>
// // //       </div>
// // //     );
// // //   }

// // //   if (error || !match) {
// // //     return (
// // //       <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center gap-4">
// // //         <EmptyState icon="🔍" title="Match not found" subtitle="It may have moved or been removed." />
// // //         <button onClick={() => navigate("/")} className="px-4 py-2 rounded-lg bg-slate-800 text-white text-sm hover:bg-slate-700">
// // //           ← Back to Lobby
// // //         </button>
// // //       </div>
// // //     );
// // //   }

// // //   return (
// // //     <div className="min-h-screen bg-slate-950 text-white">
// // //       {/* Header */}
// // //       <header
// // //         className="sticky top-0 z-30 border-b backdrop-blur-xl"
// // //         style={{ borderColor: sport.color + "33", background: "#020617ee" }}
// // //       >
// // //         <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
// // //           <button
// // //             onClick={() => navigate("/")}
// // //             className="flex items-center gap-2 text-slate-400 hover:text-white text-sm font-medium transition-colors"
// // //           >
// // //             ← Lobby
// // //           </button>
// // //           <div className="flex items-center gap-2 text-sm font-semibold" style={{ color: sport.color }}>
// // //             <span>{sport.emoji}</span>
// // //             <span>{sport.label}</span>
// // //           </div>
// // //           <WSStatusBadge status={wsStatus} />
// // //         </div>
// // //       </header>

// // //       <main className="max-w-5xl mx-auto px-4 sm:px-6 py-6 space-y-6">
// // //         {/* Scoreboard */}
// // //         <Scoreboard match={match} />

// // //         {/* Commentary header */}
// // //         <div className="flex items-center justify-between">
// // //           <h2 className="text-lg font-bold text-white">Live Commentary</h2>
// // //           <span className="text-xs text-slate-500">{commentary.length} events</span>
// // //         </div>

// // //         {/* Feed */}
// // //         {commentaryLoading ? (
// // //           <div className="flex items-center gap-3 py-12 justify-center text-slate-500">
// // //             <Spinner /> <span>Loading commentary…</span>
// // //           </div>
// // //         ) : commentary.length === 0 ? (
// // //           <EmptyState
// // //             icon="🎙️"
// // //             title="No commentary yet"
// // //             subtitle="Events will appear here in real time"
// // //           />
// // //         ) : (
// // //           <CommentaryFeed
// // //             commentary={commentary}
// // //             sport={match.sport}
// // //             autoScroll
// // //             maxHeight="calc(100vh - 380px)"
// // //           />
// // //         )}
// // //       </main>
// // //     </div>
// // //   );
// // // }



// // import { useEffect, useState, useCallback } from "react";
// // import { useParams, useNavigate } from "react-router-dom";
// // import { useApp } from "../context/AppContext.jsx";
// // import { useWebSocket } from "../hooks/useWebSocket.js";
// // import { api } from "../utils/api.js";
// // import { Scoreboard } from "../components/Scoreboard.jsx";
// // import { CommentaryFeed } from "../components/CommentaryFeed.jsx";
// // import { WSStatusBadge, Spinner, EmptyState } from "../components/UI.jsx";
// // import { getSport } from "../config/sports.js";

// // export default function GameRoom() {
// //   const { id } = useParams();
// //   const matchId = Number(id);
// //   const navigate = useNavigate();
// //   const { state, dispatch, handleWsMessage, registerRoomHandler } = useApp();

// //   const [loading, setLoading] = useState(true);
// //   const [commentaryLoading, setCommentaryLoading] = useState(true);
// //   const [error, setError] = useState(null);

// //   // ── WebSocket ─────────────────────────────────────────────────────────
// //   const { status: status, subscribe, unsubscribe } = useWebSocket(handleWsMessage);

// //   // Subscribe to this match room once connected
// //   useEffect(() => {
// //     if (status === "connected") subscribe(matchId);
// //     return () => unsubscribe(matchId);
// //   }, [status, matchId, subscribe, unsubscribe]);

// //   // Register a room-level handler so score_update (which has no matchId in
// //   // its payload) can be correctly dispatched with this room's matchId.
// //   useEffect(() => {
// //     const cleanup = registerRoomHandler(matchId, (msg) => {
// //       if (msg.type === "score_update") {
// //         dispatch({
// //           type: "UPDATE_SCORE",
// //           payload: {
// //             matchId,
// //             homeScore: msg.data.homeScore,
// //             awayScore: msg.data.awayScore,
// //           },
// //         });
// //       }
// //     });
// //     return cleanup;
// //   }, [matchId, dispatch, registerRoomHandler]);

// //   // ── Data loading ──────────────────────────────────────────────────────
// //   useEffect(() => {
// //     if (state.matches.length > 0) { setLoading(false); return; }
// //     api.getMatches(100)
// //       .then(data => dispatch({ type: "SET_MATCHES", payload: data }))
// //       .catch(e => setError(e.message))
// //       .finally(() => setLoading(false));
// //   }, []);

// //   useEffect(() => {
// //     setCommentaryLoading(true);
// //     api.getCommentary(matchId, 100)
// //       .then(data => dispatch({ type: "SET_COMMENTARY", payload: { matchId, data } }))
// //       .catch(() => {})
// //       .finally(() => setCommentaryLoading(false));
// //   }, [matchId]);

// //   // ── Derived state ─────────────────────────────────────────────────────
// //   const match = state.matches.find(m => m.id === matchId);
// //   const commentary = state.commentary[matchId] || [];
// //   const sport = match ? getSport(match.sport) : null;

// //   // Redirect to results when match finishes
// //   useEffect(() => {
// //     if (match?.status === "finished") navigate(`/results/${matchId}`, { replace: true });
// //   }, [match?.status]);

// //   // ── Render ────────────────────────────────────────────────────────────
// //   if (loading) {
// //     return (
// //       <div className="min-h-screen bg-slate-950 flex items-center justify-center gap-3 text-slate-500">
// //         <Spinner size={6} /> <span>Loading match…</span>
// //       </div>
// //     );
// //   }

// //   if (error || !match) {
// //     return (
// //       <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center gap-4">
// //         <EmptyState icon="🔍" title="Match not found" subtitle="It may have moved or been removed." />
// //         <button
// //           onClick={() => navigate("/")}
// //           className="px-4 py-2 rounded-lg bg-slate-800 text-white text-sm hover:bg-slate-700"
// //         >
// //           ← Back to Lobby
// //         </button>
// //       </div>
// //     );
// //   }

// //   return (
// //     <div className="min-h-screen bg-slate-950 text-white">
// //       {/* Header */}
// //       <header
// //         className="sticky top-0 z-30 border-b backdrop-blur-xl"
// //         style={{ borderColor: sport.color + "33", background: "#020617ee" }}
// //       >
// //         <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
// //           <button
// //             onClick={() => navigate("/")}
// //             className="flex items-center gap-2 text-slate-400 hover:text-white text-sm font-medium transition-colors"
// //           >
// //             ← Lobby
// //           </button>
// //           <div className="flex items-center gap-2 text-sm font-semibold" style={{ color: sport.color }}>
// //             <span>{sport.emoji}</span>
// //             <span>{sport.label}</span>
// //           </div>
// //           <WSStatusBadge status={status} />
// //         </div>
// //       </header>

// //       <main className="max-w-5xl mx-auto px-4 sm:px-6 py-6 space-y-6">
// //         <Scoreboard match={match} />

// //         <div className="flex items-center justify-between">
// //           <h2 className="text-lg font-bold text-white">Live Commentary</h2>
// //           <span className="text-xs text-slate-500">{commentary.length} events</span>
// //         </div>

// //         {commentaryLoading ? (
// //           <div className="flex items-center gap-3 py-12 justify-center text-slate-500">
// //             <Spinner /> <span>Loading commentary…</span>
// //           </div>
// //         ) : commentary.length === 0 ? (
// //           <EmptyState
// //             icon="🎙️"
// //             title="No commentary yet"
// //             subtitle="Events will appear here in real time"
// //           />
// //         ) : (
// //           <CommentaryFeed
// //             commentary={commentary}
// //             sport={match.sport}
// //             autoScroll
// //             maxHeight="calc(100vh - 380px)"
// //           />
// //         )}
// //       </main>
// //     </div>
// //   );
// // }




// import { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { useWSStore } from "../store/wsStore.js";
// import { api } from "../utils/api.js";
// import { Scoreboard } from "../components/Scoreboard.jsx";
// import { CommentaryFeed } from "../components/CommentaryFeed.jsx";
// // import { WSStatusBadge, Spinner, EmptyState, IncidentBanner } from "../components/UI.jsx";
// import { WSStatusBadge, Spinner, EmptyState } from "../components/UI.jsx";
// import { getSport } from "../config/sports.js";

// export default function GameRoom() {
//   const { id } = useParams();
//   const matchId = Number(id);
//   const navigate = useNavigate();

//   const wsStatus      = useWSStore((s) => s.wsStatus);
//   const welcomed      = useWSStore((s) => s.welcomed);
//   const subscribe     = useWSStore((s) => s.subscribe);
//   const unsubscribe   = useWSStore((s) => s.unsubscribe);
//   const setCommentary = useWSStore((s) => s.setCommentary);

//   const matchFromList = useWSStore((s) => s.matchList.find((m) => m.id === matchId));
//   const liveData      = useWSStore((s) => s.matches[matchId]);

//   // Track if the match was deleted while we're viewing it
//   const matchDeleted  = useWSStore((s) => !s.matchList.some((m) => m.id === matchId));

//   const [loading, setLoading]                   = useState(true);
//   const [commentaryLoading, setCommentaryLoading] = useState(true);
//   const [error, setError]                       = useState(null);
//   const [bannerDismissed, setBannerDismissed]   = useState(false);

//   // Subscribe to this room
//   useEffect(() => {
//     subscribe(matchId);
//     return () => unsubscribe(matchId);
//   }, [matchId, subscribe, unsubscribe]);

//   useEffect(() => {
//     if (welcomed) subscribe(matchId);
//   }, [welcomed, matchId, subscribe]);

//   // Load match list if needed
//   useEffect(() => {
//     if (matchFromList) { setLoading(false); return; }
//     api.getMatches(100)
//       .then((data) => useWSStore.getState().setMatchList(data))
//       .catch((e) => setError(e.message))
//       .finally(() => setLoading(false));
//   }, [matchId, matchFromList]);

//   // Load commentary history
//   useEffect(() => {
//     setCommentaryLoading(true);
//     api.getCommentary(matchId, 100)
//       .then((data) => setCommentary(matchId, data))
//       .catch(() => {})
//       .finally(() => setCommentaryLoading(false));
//   }, [matchId, setCommentary]);

//   // Reset banner dismissal when status changes
//   useEffect(() => { setBannerDismissed(false); }, [matchFromList?.status]);

//   // ── Navigation side-effects ────────────────────────────────────────────
//   useEffect(() => {
//     if (match?.status === "finished") navigate(`/results/${matchId}`, { replace: true });
//   }, [match?.status, matchId, navigate]);

//   // If the match was deleted while we're watching, redirect to lobby
//   useEffect(() => {
//     if (!loading && matchDeleted) navigate("/", { replace: true });
//   }, [loading, matchDeleted, navigate]);

//   // Merge REST data with live WS overrides
//   const match = matchFromList
//     ? {
//         ...matchFromList,
//         homeScore: liveData?.homeScore ?? matchFromList.homeScore,
//         awayScore: liveData?.awayScore ?? matchFromList.awayScore,
//       }
//     : null;

//   const commentary = liveData?.commentary || [];
//   const sport = match ? getSport(match.sport) : null;

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-slate-950 flex items-center justify-center gap-3 text-slate-500">
//         <Spinner size={6} /><span>Loading match…</span>
//       </div>
//     );
//   }

//   if (error || !match) {
//     return (
//       <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center gap-4">
//         <EmptyState icon="🔍" title="Match not found" subtitle="It may have moved or been removed." />
//         <button onClick={() => navigate("/")} className="px-4 py-2 rounded-lg bg-slate-800 text-white text-sm hover:bg-slate-700">
//           ← Back to Lobby
//         </button>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-slate-950 text-white">
//       <header className="sticky top-0 z-30 border-b backdrop-blur-xl"
//         style={{ borderColor: sport.color+"33", background:"#020617ee" }}>
//         <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
//           <button onClick={() => navigate("/")} className="flex items-center gap-2 text-slate-400 hover:text-white text-sm font-medium transition-colors">
//             ← Lobby
//           </button>
//           <div className="flex items-center gap-2 text-sm font-semibold" style={{ color: sport.color }}>
//             <span>{sport.emoji}</span><span>{sport.label}</span>
//           </div>
//           <WSStatusBadge status={wsStatus} />
//         </div>
//       </header>

//       <main className="max-w-5xl mx-auto px-4 sm:px-6 py-6 space-y-6">
//         {/* Incident banner — shown when match is suspended or abandoned */}
//         {!bannerDismissed && (
//           <IncidentBanner
//             match={match}
//             onDismiss={() => setBannerDismissed(true)}
//           />
//         )}

//         <Scoreboard match={match} />

//         <div className="flex items-center justify-between">
//           <h2 className="text-lg font-bold text-white">
//             {match.status === "abandoned" ? "Match Report" : "Live Commentary"}
//           </h2>
//           <span className="text-xs text-slate-500">{commentary.length} events</span>
//         </div>

//         {commentaryLoading ? (
//           <div className="flex items-center gap-3 py-12 justify-center text-slate-500">
//             <Spinner /><span>Loading commentary…</span>
//           </div>
//         ) : commentary.length === 0 ? (
//           <EmptyState icon="🎙️" title="No commentary yet" subtitle="Events will appear here in real time" />
//         ) : (
//           <CommentaryFeed commentary={commentary} sport={match.sport} autoScroll maxHeight="calc(100vh - 380px)" />
//         )}
//       </main>
//     </div>
//   );
// }









import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useWSStore } from "../store/wsStore.js";
import { api } from "../utils/api.js";
import { Scoreboard } from "../components/Scoreboard.jsx";
import { CommentaryFeed } from "../components/CommentaryFeed.jsx";
import { WSStatusBadge, Spinner, EmptyState, IncidentBanner } from "../components/UI.jsx";
import { getSport } from "../config/sports.js";

export default function GameRoom() {
  const { id } = useParams();
  const matchId = Number(id);
  const navigate = useNavigate();

  const wsStatus      = useWSStore((s) => s.wsStatus);
  const welcomed      = useWSStore((s) => s.welcomed);
  const subscribe     = useWSStore((s) => s.subscribe);
  const unsubscribe   = useWSStore((s) => s.unsubscribe);
  const setCommentary = useWSStore((s) => s.setCommentary);

  const matchFromList = useWSStore((s) => s.matchList.find((m) => m.id === matchId));
  const liveData      = useWSStore((s) => s.matches[matchId]);

  // Track if the match was deleted while we're viewing it
  const matchDeleted  = useWSStore((s) => !s.matchList.some((m) => m.id === matchId));

  const [loading, setLoading]                   = useState(true);
  const [commentaryLoading, setCommentaryLoading] = useState(true);
  const [error, setError]                       = useState(null);
  const [bannerDismissed, setBannerDismissed]   = useState(false);

  // Subscribe to this room
  useEffect(() => {
    subscribe(matchId);
    return () => unsubscribe(matchId);
  }, [matchId, subscribe, unsubscribe]);

  useEffect(() => {
    if (welcomed) subscribe(matchId);
  }, [welcomed, matchId, subscribe]);

  // Load match list if needed
  useEffect(() => {
    if (matchFromList) { setLoading(false); return; }
    api.getMatches(100)
      .then((data) => useWSStore.getState().setMatchList(data))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [matchId, matchFromList]);

  // Load commentary history
  useEffect(() => {
    setCommentaryLoading(true);
    api.getCommentary(matchId, 100)
      .then((data) => setCommentary(matchId, data))
      .catch(() => {})
      .finally(() => setCommentaryLoading(false));
  }, [matchId, setCommentary]);

  // Reset banner dismissal when status changes
  useEffect(() => { setBannerDismissed(false); }, [matchFromList?.status]);

  // ── Navigation side-effects ────────────────────────────────────────────
  useEffect(() => {
    if (match?.status === "finished") navigate(`/results/${matchId}`, { replace: true });
  }, [ matchId, navigate]);

  // If the match was deleted while we're watching, redirect to lobby
  useEffect(() => {
    if (!loading && matchDeleted) navigate("/", { replace: true });
  }, [loading, matchDeleted, navigate]);

  // Merge REST data with live WS overrides
  const match = matchFromList
    ? {
        ...matchFromList,
        homeScore: liveData?.homeScore ?? matchFromList.homeScore,
        awayScore: liveData?.awayScore ?? matchFromList.awayScore,
      }
    : null;

  const commentary = liveData?.commentary || [];
  const sport = match ? getSport(match.sport) : null;

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center gap-3 text-slate-500">
        <Spinner size={6} /><span>Loading match…</span>
      </div>
    );
  }

  if (error || !match) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center gap-4">
        <EmptyState icon="🔍" title="Match not found" subtitle="It may have moved or been removed." />
        <button onClick={() => navigate("/")} className="px-4 py-2 rounded-lg bg-slate-800 text-white text-sm hover:bg-slate-700">
          ← Back to Lobby
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <header className="sticky top-0 z-30 border-b backdrop-blur-xl"
        style={{ borderColor: sport.color+"33", background:"#020617ee" }}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
          <button onClick={() => navigate("/")} className="flex items-center gap-2 text-slate-400 hover:text-white text-sm font-medium transition-colors">
            ← Lobby
          </button>
          <div className="flex items-center gap-2 text-sm font-semibold" style={{ color: sport.color }}>
            <span>{sport.emoji}</span><span>{sport.label}</span>
          </div>
          <WSStatusBadge status={wsStatus} />
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Incident banner — shown when match is suspended or abandoned */}
        {!bannerDismissed && (
          <IncidentBanner
            match={match}
            onDismiss={() => setBannerDismissed(true)}
          />
        )}

        <Scoreboard match={match} />

        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white">
            {match.status === "abandoned" ? "Match Report" : "Live Commentary"}
          </h2>
          <span className="text-xs text-slate-500">{commentary.length} events</span>
        </div>

        {commentaryLoading ? (
          <div className="flex items-center gap-3 py-12 justify-center text-slate-500">
            <Spinner /><span>Loading commentary…</span>
          </div>
        ) : commentary.length === 0 ? (
          <EmptyState icon="🎙️" title="No commentary yet" subtitle="Events will appear here in real time" />
        ) : (
          <CommentaryFeed commentary={commentary} sport={match.sport} autoScroll maxHeight="calc(100vh - 380px)" />
        )}
      </main>
    </div>
  );
}