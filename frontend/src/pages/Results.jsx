// // import { useEffect, useState } from "react";
// // import { useParams, useNavigate } from "react-router-dom";
// // import { useApp } from "../context/AppContext.jsx";
// // import { api } from "../utils/api.js";
// // import { CommentaryFeed } from "../components/CommentaryFeed.jsx";
// // import { SportBadge, Spinner, EmptyState } from "../components/UI.jsx";
// // import { getSport } from "../config/sports.js";

// // function duration(start, end) {
// //   if (!start || !end) return "—";
// //   const ms = new Date(end) - new Date(start);
// //   const h = Math.floor(ms / 3_600_000);
// //   const m = Math.floor((ms % 3_600_000) / 60_000);
// //   return h > 0 ? `${h}h ${m}m` : `${m} min`;
// // }

// // function formatDateTime(iso) {
// //   if (!iso) return "—";
// //   return new Date(iso).toLocaleString([], {
// //     dateStyle: "medium", timeStyle: "short",
// //   });
// // }

// // export default function Results() {
// //   const { id } = useParams();
// //   const matchId = Number(id);
// //   const navigate = useNavigate();
// //   const { state, dispatch } = useApp();
// //   const [loading, setLoading] = useState(true);
// //   const [commentaryLoading, setCommentaryLoading] = useState(true);

// //   useEffect(() => {
// //     if (state.matches.length === 0) {
// //       api.getMatches(100)
// //         .then(data => dispatch({ type: "SET_MATCHES", payload: data }))
// //         .finally(() => setLoading(false));
// //     } else {
// //       setLoading(false);
// //     }
// //   }, []);

// //   useEffect(() => {
// //     setCommentaryLoading(true);
// //     api.getCommentary(matchId, 200)
// //       .then(data => dispatch({ type: "SET_COMMENTARY", payload: { matchId, data } }))
// //       .finally(() => setCommentaryLoading(false));
// //   }, [matchId]);

// //   const match = state.matches.find(m => m.id === matchId);
// //   const commentary = state.commentary[matchId] || [];

// //   if (loading) {
// //     return (
// //       <div className="min-h-screen bg-slate-950 flex items-center justify-center gap-3 text-slate-500">
// //         <Spinner size={6} /> Loading results…
// //       </div>
// //     );
// //   }

// //   if (!match) {
// //     return (
// //       <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center gap-4">
// //         <EmptyState icon="🔍" title="Match not found" />
// //         <button onClick={() => navigate("/")} className="px-4 py-2 rounded-lg bg-slate-800 text-white text-sm">
// //           ← Lobby
// //         </button>
// //       </div>
// //     );
// //   }

// //   const sport = getSport(match.sport);
// //   const winner = sport.winCondition(match.homeScore, match.awayScore);
// //   const winnerName = winner === "home" ? match.homeTeam : winner === "away" ? match.awayTeam : null;
// //   const isDraw = winner === "draw";

// //   // Build event-type stats from commentary
// //   const eventStats = commentary.reduce((acc, c) => {
// //     if (!c.eventType || c.eventType === "commentary") return acc;
// //     acc[c.eventType] = (acc[c.eventType] || 0) + 1;
// //     return acc;
// //   }, {});

// //   // Split events by team for summary
// //   const homeEvents = commentary.filter(c => c.team === match.homeTeam && c.eventType !== "commentary");
// //   const awayEvents = commentary.filter(c => c.team === match.awayTeam && c.eventType !== "commentary");

// //   return (
// //     <div className="min-h-screen bg-slate-950 text-white">
// //       <header className="border-b border-slate-800/80 backdrop-blur-xl bg-slate-950/80 sticky top-0 z-30">
// //         <div className="max-w-4xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
// //           <button onClick={() => navigate("/")} className="text-slate-400 hover:text-white text-sm">
// //             ← Lobby
// //           </button>
// //           <span className="text-xs text-slate-500 font-semibold uppercase tracking-widest">Final Result</span>
// //           <SportBadge sport={match.sport} config={sport} />
// //         </div>
// //       </header>

// //       <main className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-8">

// //         {/* Winner banner */}
// //         <div
// //           className="rounded-3xl p-8 text-center border relative overflow-hidden"
// //           style={{
// //             background: `linear-gradient(135deg, ${sport.color}18 0%, #0f172a 60%)`,
// //             borderColor: sport.color + "44",
// //           }}
// //         >
// //           <div
// //             className="absolute inset-0 opacity-5 pointer-events-none"
// //             style={{ background: `radial-gradient(circle at 50% 0%, ${sport.color}, transparent 70%)` }}
// //           />

// //           {isDraw ? (
// //             <>
// //               <p className="text-slate-400 text-sm font-semibold uppercase tracking-widest mb-2">It's a draw</p>
// //               <p className="text-4xl font-black text-white">{match.homeTeam} vs {match.awayTeam}</p>
// //             </>
// //           ) : (
// //             <>
// //               <p className="text-slate-400 text-sm font-semibold uppercase tracking-widest mb-2">Winner</p>
// //               <p className="text-5xl font-black mb-1" style={{ color: sport.color }}>{winnerName}</p>
// //               <p className="text-slate-400 text-sm">
// //                 defeated {winner === "home" ? match.awayTeam : match.homeTeam}
// //               </p>
// //             </>
// //           )}

// //           {/* Final score */}
// //           <div className="flex items-center justify-center gap-6 mt-6">
// //             <div className="text-center">
// //               <p className="text-xs text-slate-500 uppercase tracking-widest mb-1">{match.homeTeam}</p>
// //               <p
// //                 className="text-6xl font-black tabular-nums"
// //                 style={{ color: winner === "home" ? sport.color : "#cbd5e1" }}
// //               >
// //                 {match.homeScore ?? 0}
// //               </p>
// //             </div>
// //             <div className="text-slate-700 text-3xl font-thin">—</div>
// //             <div className="text-center">
// //               <p className="text-xs text-slate-500 uppercase tracking-widest mb-1">{match.awayTeam}</p>
// //               <p
// //                 className="text-6xl font-black tabular-nums"
// //                 style={{ color: winner === "away" ? sport.color : "#cbd5e1" }}
// //               >
// //                 {match.awayScore ?? 0}
// //               </p>
// //             </div>
// //           </div>
// //         </div>

// //         {/* Match metadata */}
// //         <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
// //           {[
// //             { label: "Sport", value: `${sport.emoji} ${sport.label}` },
// //             { label: "Duration", value: duration(match.startTime, match.endTime) },
// //             { label: "Started", value: formatDateTime(match.startTime) },
// //             { label: "Events", value: commentary.length },
// //           ].map(({ label, value }) => (
// //             <div key={label} className="rounded-xl bg-slate-900 border border-slate-800 p-4 text-center">
// //               <p className="text-xs text-slate-500 uppercase tracking-widest mb-1">{label}</p>
// //               <p className="text-white font-bold">{value}</p>
// //             </div>
// //           ))}
// //         </div>

// //         {/* Event stats */}
// //         {Object.keys(eventStats).length > 0 && (
// //           <div>
// //             <h2 className="text-lg font-bold mb-3 text-white">Match Statistics</h2>
// //             <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
// //               {Object.entries(eventStats).map(([ev, count]) => {
// //                 const evCfg = sport.eventTypes?.find(e => e.value === ev);
// //                 if (!evCfg) return null;
// //                 return (
// //                   <div
// //                     key={ev}
// //                     className="flex items-center gap-3 rounded-xl px-4 py-3 border"
// //                     style={{ background: evCfg.color + "11", borderColor: evCfg.color + "33" }}
// //                   >
// //                     <span className="text-xl">{evCfg.icon}</span>
// //                     <div>
// //                       <p className="text-xs text-slate-500">{evCfg.label}</p>
// //                       <p className="text-white font-bold text-lg">{count}</p>
// //                     </div>
// //                   </div>
// //                 );
// //               })}
// //             </div>
// //           </div>
// //         )}

// //         {/* Team breakdown */}
// //         {(homeEvents.length > 0 || awayEvents.length > 0) && (
// //           <div>
// //             <h2 className="text-lg font-bold mb-3 text-white">Team Events</h2>
// //             <div className="grid grid-cols-2 gap-4">
// //               {[
// //                 { team: match.homeTeam, events: homeEvents, side: "home" },
// //                 { team: match.awayTeam, events: awayEvents, side: "away" },
// //               ].map(({ team, events }) => (
// //                 <div key={team} className="rounded-xl bg-slate-900 border border-slate-800 p-4">
// //                   <p className="font-bold text-white mb-3 truncate">{team}</p>
// //                   {events.length === 0 ? (
// //                     <p className="text-xs text-slate-600">No events recorded</p>
// //                   ) : (
// //                     <ul className="space-y-1">
// //                       {events.slice(0, 8).map((c, i) => {
// //                         const ev = sport.eventTypes?.find(e => e.value === c.eventType);
// //                         return (
// //                           <li key={i} className="flex items-center gap-2 text-sm">
// //                             <span>{ev?.icon ?? "•"}</span>
// //                             <span className="text-slate-400 truncate">{c.actor || ev?.label}</span>
// //                             {c.minute != null && (
// //                               <span className="text-slate-600 text-xs ml-auto">{c.minute}'</span>
// //                             )}
// //                           </li>
// //                         );
// //                       })}
// //                       {events.length > 8 && (
// //                         <li className="text-xs text-slate-600">+{events.length - 8} more</li>
// //                       )}
// //                     </ul>
// //                   )}
// //                 </div>
// //               ))}
// //             </div>
// //           </div>
// //         )}

// //         {/* Full timeline */}
// //         <div>
// //           <h2 className="text-lg font-bold mb-3 text-white">Match Report</h2>
// //           {commentaryLoading ? (
// //             <div className="flex items-center gap-3 py-8 justify-center text-slate-500">
// //               <Spinner /> Loading report…
// //             </div>
// //           ) : commentary.length === 0 ? (
// //             <EmptyState icon="🎙️" title="No commentary recorded" />
// //           ) : (
// //             <CommentaryFeed
// //               commentary={commentary}
// //               sport={match.sport}
// //               autoScroll={false}
// //               maxHeight="600px"
// //             />
// //           )}
// //         </div>
// //       </main>
// //     </div>
// //   );
// // }



// import { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { useWSStore } from "../store/wsStore.js";
// import { api } from "../utils/api.js";
// import { CommentaryFeed } from "../components/CommentaryFeed.jsx";
// import { SportBadge, Spinner, EmptyState } from "../components/UI.jsx";
// import { getSport } from "../config/sports.js";

// function duration(start, end) {
//   if (!start || !end) return "—";
//   const ms = new Date(end) - new Date(start);
//   const h = Math.floor(ms / 3_600_000);
//   const m = Math.floor((ms % 3_600_000) / 60_000);
//   return h > 0 ? `${h}h ${m}m` : `${m} min`;
// }

// function formatDateTime(iso) {
//   if (!iso) return "—";
//   return new Date(iso).toLocaleString([], { dateStyle: "medium", timeStyle: "short" });
// }

// export default function Results() {
//   const { id } = useParams();
//   const matchId = Number(id);
//   const navigate = useNavigate();

//   const matchFromList  = useWSStore((s) => s.matchList.find((m) => m.id === matchId));
//   const liveData       = useWSStore((s) => s.matches[matchId]);
//   const setMatchList   = useWSStore((s) => s.setMatchList);
//   const setCommentary  = useWSStore((s) => s.setCommentary);

//   const [loading, setLoading]                   = useState(true);
//   const [commentaryLoading, setCommentaryLoading] = useState(true);

//   useEffect(() => {
//     if (matchFromList) { setLoading(false); return; }
//     api.getMatches(100)
//       .then((data) => setMatchList(data))
//       .finally(() => setLoading(false));
//   }, [matchId, matchFromList, setMatchList]);

//   useEffect(() => {
//     setCommentaryLoading(true);
//     api.getCommentary(matchId, 200)
//       .then((data) => setCommentary(matchId, data))
//       .finally(() => setCommentaryLoading(false));
//   }, [matchId, setCommentary]);

//   const match = matchFromList || null;
//   const commentary = liveData?.commentary || [];

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-slate-950 flex items-center justify-center gap-3 text-slate-500">
//         <Spinner size={6} /> Loading results…
//       </div>
//     );
//   }

//   if (!match) {
//     return (
//       <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center gap-4">
//         <EmptyState icon="🔍" title="Match not found" />
//         <button onClick={() => navigate("/")} className="px-4 py-2 rounded-lg bg-slate-800 text-white text-sm">← Lobby</button>
//       </div>
//     );
//   }

//   const sport = getSport(match.sport);
//   const winner = sport.winCondition(match.homeScore, match.awayScore);
//   const winnerName = winner === "home" ? match.homeTeam : winner === "away" ? match.awayTeam : null;
//   const isDraw = winner === "draw";

//   const eventStats = commentary.reduce((acc, c) => {
//     if (!c.eventType || c.eventType === "commentary") return acc;
//     acc[c.eventType] = (acc[c.eventType] || 0) + 1;
//     return acc;
//   }, {});

//   const homeEvents = commentary.filter((c) => c.team === match.homeTeam && c.eventType !== "commentary");
//   const awayEvents = commentary.filter((c) => c.team === match.awayTeam && c.eventType !== "commentary");

//   return (
//     <div className="min-h-screen bg-slate-950 text-white">
//       <header className="border-b border-slate-800/80 backdrop-blur-xl bg-slate-950/80 sticky top-0 z-30">
//         <div className="max-w-4xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
//           <button onClick={() => navigate("/")} className="text-slate-400 hover:text-white text-sm">← Lobby</button>
//           <span className="text-xs text-slate-500 font-semibold uppercase tracking-widest">Final Result</span>
//           <SportBadge sport={match.sport} config={sport} />
//         </div>
//       </header>

//       <main className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-8">
//         {/* Winner banner */}
//         <div className="rounded-3xl p-8 text-center border relative overflow-hidden"
//           style={{ background: `linear-gradient(135deg, ${sport.color}18 0%, #0f172a 60%)`, borderColor: sport.color + "44" }}>
//           <div className="absolute inset-0 opacity-5 pointer-events-none"
//             style={{ background: `radial-gradient(circle at 50% 0%, ${sport.color}, transparent 70%)` }} />
//           {isDraw ? (
//             <>
//               <p className="text-slate-400 text-sm font-semibold uppercase tracking-widest mb-2">It's a draw</p>
//               <p className="text-4xl font-black text-white">{match.homeTeam} vs {match.awayTeam}</p>
//             </>
//           ) : (
//             <>
//               <p className="text-slate-400 text-sm font-semibold uppercase tracking-widest mb-2">Winner</p>
//               <p className="text-5xl font-black mb-1" style={{ color: sport.color }}>{winnerName}</p>
//               <p className="text-slate-400 text-sm">defeated {winner === "home" ? match.awayTeam : match.homeTeam}</p>
//             </>
//           )}
//           <div className="flex items-center justify-center gap-6 mt-6">
//             <div className="text-center">
//               <p className="text-xs text-slate-500 uppercase tracking-widest mb-1">{match.homeTeam}</p>
//               <p className="text-6xl font-black tabular-nums" style={{ color: winner === "home" ? sport.color : "#cbd5e1" }}>{match.homeScore ?? 0}</p>
//             </div>
//             <div className="text-slate-700 text-3xl font-thin">—</div>
//             <div className="text-center">
//               <p className="text-xs text-slate-500 uppercase tracking-widest mb-1">{match.awayTeam}</p>
//               <p className="text-6xl font-black tabular-nums" style={{ color: winner === "away" ? sport.color : "#cbd5e1" }}>{match.awayScore ?? 0}</p>
//             </div>
//           </div>
//         </div>

//         {/* Meta */}
//         <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
//           {[
//             { label: "Sport",    value: `${sport.emoji} ${sport.label}` },
//             { label: "Duration", value: duration(match.startTime, match.endTime) },
//             { label: "Started",  value: formatDateTime(match.startTime) },
//             { label: "Events",   value: commentary.length },
//           ].map(({ label, value }) => (
//             <div key={label} className="rounded-xl bg-slate-900 border border-slate-800 p-4 text-center">
//               <p className="text-xs text-slate-500 uppercase tracking-widest mb-1">{label}</p>
//               <p className="text-white font-bold">{value}</p>
//             </div>
//           ))}
//         </div>

//         {/* Event stats */}
//         {Object.keys(eventStats).length > 0 && (
//           <div>
//             <h2 className="text-lg font-bold mb-3 text-white">Match Statistics</h2>
//             <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
//               {Object.entries(eventStats).map(([ev, count]) => {
//                 const evCfg = sport.eventTypes?.find((e) => e.value === ev);
//                 if (!evCfg) return null;
//                 return (
//                   <div key={ev} className="flex items-center gap-3 rounded-xl px-4 py-3 border"
//                     style={{ background: evCfg.color + "11", borderColor: evCfg.color + "33" }}>
//                     <span className="text-xl">{evCfg.icon}</span>
//                     <div>
//                       <p className="text-xs text-slate-500">{evCfg.label}</p>
//                       <p className="text-white font-bold text-lg">{count}</p>
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>
//           </div>
//         )}

//         {/* Team breakdown */}
//         {(homeEvents.length > 0 || awayEvents.length > 0) && (
//           <div>
//             <h2 className="text-lg font-bold mb-3 text-white">Team Events</h2>
//             <div className="grid grid-cols-2 gap-4">
//               {[{ team: match.homeTeam, events: homeEvents }, { team: match.awayTeam, events: awayEvents }].map(({ team, events }) => (
//                 <div key={team} className="rounded-xl bg-slate-900 border border-slate-800 p-4">
//                   <p className="font-bold text-white mb-3 truncate">{team}</p>
//                   {events.length === 0 ? (
//                     <p className="text-xs text-slate-600">No events recorded</p>
//                   ) : (
//                     <ul className="space-y-1">
//                       {events.slice(0, 8).map((c, i) => {
//                         const ev = sport.eventTypes?.find((e) => e.value === c.eventType);
//                         return (
//                           <li key={i} className="flex items-center gap-2 text-sm">
//                             <span>{ev?.icon ?? "•"}</span>
//                             <span className="text-slate-400 truncate">{c.actor || ev?.label}</span>
//                             {c.minute != null && <span className="text-slate-600 text-xs ml-auto">{c.minute}'</span>}
//                           </li>
//                         );
//                       })}
//                       {events.length > 8 && <li className="text-xs text-slate-600">+{events.length - 8} more</li>}
//                     </ul>
//                   )}
//                 </div>
//               ))}
//             </div>
//           </div>
//         )}

//         {/* Full timeline */}
//         <div>
//           <h2 className="text-lg font-bold mb-3 text-white">Match Report</h2>
//           {commentaryLoading ? (
//             <div className="flex items-center gap-3 py-8 justify-center text-slate-500"><Spinner /> Loading report…</div>
//           ) : commentary.length === 0 ? (
//             <EmptyState icon="🎙️" title="No commentary recorded" />
//           ) : (
//             <CommentaryFeed commentary={commentary} sport={match.sport} autoScroll={false} maxHeight="600px" />
//           )}
//         </div>
//       </main>
//     </div>
//   );
// }
















import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useWSStore } from "../store/wsStore.js";
import { api } from "../utils/api.js";
import { CommentaryFeed } from "../components/CommentaryFeed.jsx";
import { SportBadge, Spinner, EmptyState } from "../components/UI.jsx";
import { getSport } from "../config/sports.js";

function duration(start, end) {
  if (!start || !end) return "—";
  const ms = new Date(end) - new Date(start);
  const h = Math.floor(ms / 3_600_000);
  const m = Math.floor((ms % 3_600_000) / 60_000);
  return h > 0 ? `${h}h ${m}m` : `${m} min`;
}

function formatDateTime(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleString([], { dateStyle: "medium", timeStyle: "short" });
}

export default function Results() {
  const { id } = useParams();
  const matchId = Number(id);
  const navigate = useNavigate();

  const matchFromList  = useWSStore((s) => s.matchList.find((m) => m.id === matchId));
  const liveData       = useWSStore((s) => s.matches[matchId]);
  const setMatchList   = useWSStore((s) => s.setMatchList);
  const setCommentary  = useWSStore((s) => s.setCommentary);

  const [loading, setLoading]                   = useState(true);
  const [commentaryLoading, setCommentaryLoading] = useState(true);

  useEffect(() => {
    if (matchFromList) { setLoading(false); return; }
    api.getMatches(100)
      .then((data) => setMatchList(data))
      .finally(() => setLoading(false));
  }, [matchId, matchFromList, setMatchList]);

  useEffect(() => {
    setCommentaryLoading(true);
    api.getCommentary(matchId, 200)
      .then((data) => setCommentary(matchId, data))
      .finally(() => setCommentaryLoading(false));
  }, [matchId, setCommentary]);

  const match = matchFromList || null;
  const commentary = liveData?.commentary || [];

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center gap-3 text-slate-500">
        <Spinner size={6} /> Loading results…
      </div>
    );
  }

  if (!match) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center gap-4">
        <EmptyState icon="🔍" title="Match not found" />
        <button onClick={() => navigate("/")} className="px-4 py-2 rounded-lg bg-slate-800 text-white text-sm">← Lobby</button>
      </div>
    );
  }

  const sport = getSport(match.sport);
  const winner = sport.winCondition(match.homeScore, match.awayScore);
  const winnerName = winner === "home" ? match.homeTeam : winner === "away" ? match.awayTeam : null;
  const isDraw = winner === "draw";

  const eventStats = commentary.reduce((acc, c) => {
    if (!c.eventType || c.eventType === "commentary") return acc;
    acc[c.eventType] = (acc[c.eventType] || 0) + 1;
    return acc;
  }, {});

  const homeEvents = commentary.filter((c) => c.team === match.homeTeam && c.eventType !== "commentary");
  const awayEvents = commentary.filter((c) => c.team === match.awayTeam && c.eventType !== "commentary");

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <header className="border-b border-slate-800/80 backdrop-blur-xl bg-slate-950/80 sticky top-0 z-30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <button onClick={() => navigate("/")} className="text-slate-400 hover:text-white text-sm">← Lobby</button>
          <span className="text-xs text-slate-500 font-semibold uppercase tracking-widest">Final Result</span>
          <SportBadge sport={match.sport} config={sport} />
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-8">
        {/* Winner banner */}
        <div className="rounded-3xl p-8 text-center border relative overflow-hidden"
          style={{ background: `linear-gradient(135deg, ${sport.color}18 0%, #0f172a 60%)`, borderColor: sport.color + "44" }}>
          <div className="absolute inset-0 opacity-5 pointer-events-none"
            style={{ background: `radial-gradient(circle at 50% 0%, ${sport.color}, transparent 70%)` }} />
          {isDraw ? (
            <>
              <p className="text-slate-400 text-sm font-semibold uppercase tracking-widest mb-2">It's a draw</p>
              <p className="text-4xl font-black text-white">{match.homeTeam} vs {match.awayTeam}</p>
            </>
          ) : (
            <>
              <p className="text-slate-400 text-sm font-semibold uppercase tracking-widest mb-2">Winner</p>
              <p className="text-5xl font-black mb-1" style={{ color: sport.color }}>{winnerName}</p>
              <p className="text-slate-400 text-sm">defeated {winner === "home" ? match.awayTeam : match.homeTeam}</p>
            </>
          )}
          <div className="flex items-center justify-center gap-6 mt-6">
            <div className="text-center">
              <p className="text-xs text-slate-500 uppercase tracking-widest mb-1">{match.homeTeam}</p>
              <p className="text-6xl font-black tabular-nums" style={{ color: winner === "home" ? sport.color : "#cbd5e1" }}>{match.homeScore ?? 0}</p>
            </div>
            <div className="text-slate-700 text-3xl font-thin">—</div>
            <div className="text-center">
              <p className="text-xs text-slate-500 uppercase tracking-widest mb-1">{match.awayTeam}</p>
              <p className="text-6xl font-black tabular-nums" style={{ color: winner === "away" ? sport.color : "#cbd5e1" }}>{match.awayScore ?? 0}</p>
            </div>
          </div>
        </div>

        {/* Meta */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "Sport",    value: `${sport.emoji} ${sport.label}` },
            { label: "Duration", value: duration(match.startTime, match.endTime) },
            { label: "Started",  value: formatDateTime(match.startTime) },
            { label: "Events",   value: commentary.length },
          ].map(({ label, value }) => (
            <div key={label} className="rounded-xl bg-slate-900 border border-slate-800 p-4 text-center">
              <p className="text-xs text-slate-500 uppercase tracking-widest mb-1">{label}</p>
              <p className="text-white font-bold">{value}</p>
            </div>
          ))}
        </div>

        {/* Event stats */}
        {Object.keys(eventStats).length > 0 && (
          <div>
            <h2 className="text-lg font-bold mb-3 text-white">Match Statistics</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {Object.entries(eventStats).map(([ev, count]) => {
                const evCfg = sport.eventTypes?.find((e) => e.value === ev);
                if (!evCfg) return null;
                return (
                  <div key={ev} className="flex items-center gap-3 rounded-xl px-4 py-3 border"
                    style={{ background: evCfg.color + "11", borderColor: evCfg.color + "33" }}>
                    <span className="text-xl">{evCfg.icon}</span>
                    <div>
                      <p className="text-xs text-slate-500">{evCfg.label}</p>
                      <p className="text-white font-bold text-lg">{count}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Team breakdown */}
        {(homeEvents.length > 0 || awayEvents.length > 0) && (
          <div>
            <h2 className="text-lg font-bold mb-3 text-white">Team Events</h2>
            <div className="grid grid-cols-2 gap-4">
              {[{ team: match.homeTeam, events: homeEvents }, { team: match.awayTeam, events: awayEvents }].map(({ team, events }) => (
                <div key={team} className="rounded-xl bg-slate-900 border border-slate-800 p-4">
                  <p className="font-bold text-white mb-3 truncate">{team}</p>
                  {events.length === 0 ? (
                    <p className="text-xs text-slate-600">No events recorded</p>
                  ) : (
                    <ul className="space-y-1">
                      {events.slice(0, 8).map((c, i) => {
                        const ev = sport.eventTypes?.find((e) => e.value === c.eventType);
                        return (
                          <li key={i} className="flex items-center gap-2 text-sm">
                            <span>{ev?.icon ?? "•"}</span>
                            <span className="text-slate-400 truncate">{c.actor || ev?.label}</span>
                            {c.minute != null && <span className="text-slate-600 text-xs ml-auto">{c.minute}'</span>}
                          </li>
                        );
                      })}
                      {events.length > 8 && <li className="text-xs text-slate-600">+{events.length - 8} more</li>}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Full timeline */}
        <div>
          <h2 className="text-lg font-bold mb-3 text-white">Match Report</h2>
          {commentaryLoading ? (
            <div className="flex items-center gap-3 py-8 justify-center text-slate-500"><Spinner /> Loading report…</div>
          ) : commentary.length === 0 ? (
            <EmptyState icon="🎙️" title="No commentary recorded" />
          ) : (
            <CommentaryFeed commentary={commentary} sport={match.sport} autoScroll={false} maxHeight="600px" />
          )}
        </div>
      </main>
    </div>
  );
}