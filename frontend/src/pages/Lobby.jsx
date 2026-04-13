// // import { useEffect, useState, useMemo } from "react";
// // import { useApp } from "../context/AppContext.jsx";
// // import { useWebSocket } from "../hooks/useWebSocket.js";
// // import { api } from "../utils/api.js";
// // import { MatchCard } from "../components/MatchCard.jsx";
// // import { WSStatusBadge, EmptyState, Spinner } from "../components/UI.jsx";
// // import { ALL_SPORT_KEYS, getSport } from "../config/sports.js";

// // const TABS = ["live", "scheduled", "finished"];

// // export default function Lobby() {
// //   const { state, dispatch, handleWsMessage } = useApp();
// //   const [tab, setTab] = useState("live");
// //   const [sportFilter, setSportFilter] = useState("all");
// //   const [loading, setLoading] = useState(true);
// //   const [error, setError] = useState(null);

// //   const { status: status } = useWebSocket(handleWsMessage);

// //   useEffect(() => {
// //     setLoading(true);
// //     api.getMatches(100)
// //       .then(data => dispatch({ type: "SET_MATCHES", payload: data }))
// //       .catch(e => setError(e.message))
// //       .finally(() => setLoading(false));
// //   }, []);

// //   const filtered = useMemo(() => {
// //     return state.matches
// //       .filter(m => m.status === tab)
// //       .filter(m => sportFilter === "all" || m.sport === sportFilter);
// //   }, [state.matches, tab, sportFilter]);

// //   const counts = useMemo(() => ({
// //     live: state.matches.filter(m => m.status === "live").length,
// //     scheduled: state.matches.filter(m => m.status === "scheduled").length,
// //     finished: state.matches.filter(m => m.status === "finished").length,
// //   }), [state.matches]);

// //   const activeSports = useMemo(() => {
// //     const seen = new Set(state.matches.map(m => m.sport?.toLowerCase()).filter(Boolean));
// //     return ["all", ...ALL_SPORT_KEYS.filter(s => seen.has(s))];
// //   }, [state.matches]);

// //   return (
// //     <div className="min-h-screen bg-slate-950 text-white">
// //       {/* Header */}
// //       <header className="sticky top-0 z-30 border-b border-slate-800/80 backdrop-blur-xl bg-slate-950/80">
// //         <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-4">
// //           <div className="flex items-center gap-3">
// //             <span className="text-2xl font-black tracking-tight">
// //               <span className="text-white">ARENA</span>
// //               <span className="text-red-500">LIVE</span>
// //             </span>
// //           </div>
// //           <div className="flex items-center gap-3">
// //             <WSStatusBadge status={status} />
// //             <a
// //               href="/admin"
// //               className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
// //             >
// //               Admin ⚡
// //             </a>
// //           </div>
// //         </div>
// //       </header>

// //       <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
// //         {/* Hero */}
// //         <div className="mb-8">
// //           <h1 className="text-4xl sm:text-5xl font-black tracking-tight mb-2">
// //             {tab === "live" ? (
// //               <>
// //                 <span className="text-red-500">{counts.live}</span>
// //                 <span className="text-white"> Games Live</span>
// //               </>
// //             ) : tab === "scheduled" ? (
// //               <span className="text-white">Upcoming Matches</span>
// //             ) : (
// //               <span className="text-white">Final Results</span>
// //             )}
// //           </h1>
// //           <p className="text-slate-500 text-sm">
// //             {tab === "live" ? "Real-time scores and commentary" :
// //              tab === "scheduled" ? "Matches starting soon" :
// //              "Full results and match reports"}
// //           </p>
// //         </div>

// //         {/* Tabs */}
// //         <div className="flex gap-1 p-1 rounded-xl bg-slate-900 mb-6 w-fit">
// //           {TABS.map(t => (
// //             <button
// //               key={t}
// //               onClick={() => setTab(t)}
// //               className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all ${
// //                 tab === t
// //                   ? "bg-slate-700 text-white shadow"
// //                   : "text-slate-500 hover:text-slate-300"
// //               }`}
// //             >
// //               {t.charAt(0).toUpperCase() + t.slice(1)}
// //               {counts[t] > 0 && (
// //                 <span className={`ml-2 px-1.5 py-0.5 rounded-full text-xs ${
// //                   t === "live" ? "bg-red-500/30 text-red-400" : "bg-slate-700 text-slate-400"
// //                 }`}>
// //                   {counts[t]}
// //                 </span>
// //               )}
// //             </button>
// //           ))}
// //         </div>

// //         {/* Sport filter pills */}
// //         {activeSports.length > 2 && (
// //           <div className="flex flex-wrap gap-2 mb-6">
// //             {activeSports.map(s => {
// //               const cfg = s === "all" ? null : getSport(s);
// //               const active = sportFilter === s;
// //               return (
// //                 <button
// //                   key={s}
// //                   onClick={() => setSportFilter(s)}
// //                   className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all border ${
// //                     active ? "text-white" : "text-slate-500 border-slate-800 hover:border-slate-600"
// //                   }`}
// //                   style={active && cfg ? {
// //                     background: cfg.color + "22",
// //                     borderColor: cfg.color + "66",
// //                     color: cfg.color,
// //                   } : active ? { background: "#334155", borderColor: "#475569" } : {}}
// //                 >
// //                   {s === "all" ? "🌐 All Sports" : `${cfg.emoji} ${cfg.label}`}
// //                 </button>
// //               );
// //             })}
// //           </div>
// //         )}

// //         {/* Content */}
// //         {loading ? (
// //           <div className="flex items-center justify-center py-32 gap-3 text-slate-500">
// //             <Spinner size={6} />
// //             <span>Loading matches…</span>
// //           </div>
// //         ) : error ? (
// //           <div className="flex flex-col items-center justify-center py-24 gap-3">
// //             <span className="text-4xl">⚠️</span>
// //             <p className="text-red-400 font-semibold">{error}</p>
// //             <button
// //               onClick={() => window.location.reload()}
// //               className="px-4 py-2 rounded-lg bg-slate-800 text-sm text-white hover:bg-slate-700"
// //             >
// //               Retry
// //             </button>
// //           </div>
// //         ) : filtered.length === 0 ? (
// //           <EmptyState
// //             icon={tab === "live" ? "📡" : tab === "scheduled" ? "🗓️" : "🏁"}
// //             title={
// //               tab === "live" ? "No live games right now" :
// //               tab === "scheduled" ? "No upcoming matches" :
// //               "No finished matches yet"
// //             }
// //             subtitle={tab === "live" ? "Check back soon or browse scheduled matches" : undefined}
// //           />
// //         ) : (
// //           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
// //             {filtered.map(m => <MatchCard key={m.id} match={m} />)}
// //           </div>
// //         )}
// //       </main>
// //     </div>
// //   );
// // }


// import { useEffect, useState, useMemo } from "react";
// import { useWSStore } from "../store/wsStore.js";
// import { api } from "../utils/api.js";
// import { MatchCard } from "../components/MatchCard.jsx";
// import { WSStatusBadge, EmptyState, Spinner } from "../components/UI.jsx";
// import { ALL_SPORT_KEYS, getSport } from "../config/sports.js";

// // All possible tabs including the two new statuses
// const TABS = ["live", "scheduled", "finished", "suspended", "abandoned"];

// const TAB_CONFIG = {
//   live:      { label:"Live",      color:"text-red-400",    emptyIcon:"📡", emptyTitle:"No live games right now",    emptyHint:"Check scheduled matches" },
//   scheduled: { label:"Scheduled", color:"text-blue-400",   emptyIcon:"🗓️", emptyTitle:"No upcoming matches",       emptyHint:undefined },
//   finished:  { label:"Finished",  color:"text-slate-400",  emptyIcon:"🏁", emptyTitle:"No finished matches yet",   emptyHint:undefined },
//   suspended: { label:"Suspended", color:"text-amber-400",  emptyIcon:"⏸",  emptyTitle:"No suspended matches",     emptyHint:undefined },
//   abandoned: { label:"Abandoned", color:"text-rose-400",   emptyIcon:"✕",  emptyTitle:"No abandoned matches",     emptyHint:undefined },
// };

// export default function Lobby() {
//   const matchList    = useWSStore((s) => s.matchList);
//   const wsStatus     = useWSStore((s) => s.wsStatus);
//   const setMatchList = useWSStore((s) => s.setMatchList);

//   const [tab, setTab]               = useState("live");
//   const [sportFilter, setSportFilter] = useState("all");
//   const [loading, setLoading]       = useState(true);
//   const [error, setError]           = useState(null);

//   useEffect(() => {
//     setLoading(true);
//     api.getMatches(100)
//       .then((data) => setMatchList(data))
//       .catch((e) => setError(e.message))
//       .finally(() => setLoading(false));
//   }, [setMatchList]);

//   const filtered = useMemo(() =>
//     matchList
//       .filter((m) => m.status === tab)
//       .filter((m) => sportFilter === "all" || m.sport === sportFilter),
//     [matchList, tab, sportFilter]
//   );

//   // Count per status — only show tabs that have matches or are "primary"
//   const counts = useMemo(() =>
//     TABS.reduce((acc, t) => ({ ...acc, [t]: matchList.filter((m) => m.status === t).length }), {}),
//     [matchList]
//   );

//   // Only show suspended/abandoned tabs if there are actually matches in them
//   const visibleTabs = TABS.filter((t) =>
//     ["live","scheduled","finished"].includes(t) || counts[t] > 0
//   );

//   const activeSports = useMemo(() => {
//     const seen = new Set(matchList.map((m) => m.sport?.toLowerCase()).filter(Boolean));
//     return ["all", ...ALL_SPORT_KEYS.filter((s) => seen.has(s))];
//   }, [matchList]);

//   const cfg = TAB_CONFIG[tab];

//   return (
//     <div className="min-h-screen bg-slate-950 text-white">
//       <header className="sticky top-0 z-30 border-b border-slate-800/80 backdrop-blur-xl bg-slate-950/80">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-4">
//           <span className="text-2xl font-black tracking-tight">
//             <span className="text-white">ARENA</span><span className="text-red-500">LIVE</span>
//           </span>
//           <div className="flex items-center gap-3">
//             <WSStatusBadge status={wsStatus} />
//             <a href="/admin" className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors">
//               Admin ⚡
//             </a>
//           </div>
//         </div>
//       </header>

//       <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
//         <div className="mb-8">
//           <h1 className="text-4xl sm:text-5xl font-black tracking-tight mb-2">
//             {tab === "live" ? (
//               <><span className="text-red-500">{counts.live}</span><span className="text-white"> Games Live</span></>
//             ) : tab === "suspended" ? (
//               <span className="text-amber-400">Suspended Matches</span>
//             ) : tab === "abandoned" ? (
//               <span className="text-rose-400">Abandoned Matches</span>
//             ) : tab === "scheduled" ? (
//               <span className="text-white">Upcoming Matches</span>
//             ) : (
//               <span className="text-white">Final Results</span>
//             )}
//           </h1>
//           <p className="text-slate-500 text-sm">
//             {tab === "live"      ? "Real-time scores and commentary"
//               : tab === "scheduled"  ? "Matches starting soon"
//               : tab === "suspended"  ? "Matches temporarily halted"
//               : tab === "abandoned"  ? "Matches that could not be completed"
//               : "Full results and match reports"}
//           </p>
//         </div>

//         {/* Tabs */}
//         <div className="flex gap-1 p-1 rounded-xl bg-slate-900 mb-6 flex-wrap">
//           {visibleTabs.map((t) => {
//             const c = TAB_CONFIG[t];
//             return (
//               <button key={t} onClick={() => setTab(t)}
//                 className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${tab === t ? "bg-slate-700 text-white shadow" : "text-slate-500 hover:text-slate-300"}`}>
//                 {c.label}
//                 {counts[t] > 0 && (
//                   <span className={`ml-2 px-1.5 py-0.5 rounded-full text-xs ${
//                     t === "live"      ? "bg-red-500/30 text-red-400"
//                     : t === "suspended" ? "bg-amber-500/20 text-amber-400"
//                     : t === "abandoned" ? "bg-rose-900/30 text-rose-400"
//                     : "bg-slate-700 text-slate-400"
//                   }`}>
//                     {counts[t]}
//                   </span>
//                 )}
//               </button>
//             );
//           })}
//         </div>

//         {/* Sport filter */}
//         {activeSports.length > 2 && (
//           <div className="flex flex-wrap gap-2 mb-6">
//             {activeSports.map((s) => {
//               const c = s === "all" ? null : getSport(s);
//               const active = sportFilter === s;
//               return (
//                 <button key={s} onClick={() => setSportFilter(s)}
//                   className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all border ${active ? "text-white" : "text-slate-500 border-slate-800 hover:border-slate-600"}`}
//                   style={active && c ? { background:c.color+"22", borderColor:c.color+"66", color:c.color } : active ? { background:"#334155", borderColor:"#475569" } : {}}>
//                   {s === "all" ? "🌐 All Sports" : `${c.emoji} ${c.label}`}
//                 </button>
//               );
//             })}
//           </div>
//         )}

//         {/* Content */}
//         {loading ? (
//           <div className="flex items-center justify-center py-32 gap-3 text-slate-500">
//             <Spinner size={6} /><span>Loading matches…</span>
//           </div>
//         ) : error ? (
//           <div className="flex flex-col items-center justify-center py-24 gap-3">
//             <span className="text-4xl">⚠️</span>
//             <p className="text-red-400 font-semibold">{error}</p>
//             <button onClick={() => window.location.reload()} className="px-4 py-2 rounded-lg bg-slate-800 text-sm text-white hover:bg-slate-700">Retry</button>
//           </div>
//         ) : filtered.length === 0 ? (
//           <EmptyState icon={cfg.emptyIcon} title={cfg.emptyTitle} subtitle={cfg.emptyHint} />
//         ) : (
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
//             {filtered.map((m) => <MatchCard key={m.id} match={m} />)}
//           </div>
//         )}
//       </main>
//     </div>
//   );
// }














import { useEffect, useState, useMemo } from "react";
import { useWSStore } from "../store/wsStore.js";
import { api } from "../utils/api.js";
import { MatchCard } from "../components/MatchCard.jsx";
import { WSStatusBadge, EmptyState, Spinner } from "../components/UI.jsx";
import { ALL_SPORT_KEYS, getSport } from "../config/sports.js";

// All possible tabs including the two new statuses
const TABS = ["live", "scheduled", "finished", "suspended", "abandoned"];

const TAB_CONFIG = {
  live:      { label:"Live",      color:"text-red-400",    emptyIcon:"📡", emptyTitle:"No live games right now",    emptyHint:"Check scheduled matches" },
  scheduled: { label:"Scheduled", color:"text-blue-400",   emptyIcon:"🗓️", emptyTitle:"No upcoming matches",       emptyHint:undefined },
  finished:  { label:"Finished",  color:"text-slate-400",  emptyIcon:"🏁", emptyTitle:"No finished matches yet",   emptyHint:undefined },
  suspended: { label:"Suspended", color:"text-amber-400",  emptyIcon:"⏸",  emptyTitle:"No suspended matches",     emptyHint:undefined },
  abandoned: { label:"Abandoned", color:"text-rose-400",   emptyIcon:"✕",  emptyTitle:"No abandoned matches",     emptyHint:undefined },
};

export default function Lobby() {
  const matchList    = useWSStore((s) => s.matchList);
  const wsStatus     = useWSStore((s) => s.wsStatus);
  const setMatchList = useWSStore((s) => s.setMatchList);

  const [tab, setTab]               = useState("live");
  const [sportFilter, setSportFilter] = useState("all");
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState(null);

  useEffect(() => {
    setLoading(true);
    api.getMatches(100)
      .then((data) => setMatchList(data))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [setMatchList]);

  const filtered = useMemo(() =>
    matchList
      .filter((m) => m.status === tab)
      .filter((m) => sportFilter === "all" || m.sport === sportFilter),
    [matchList, tab, sportFilter]
  );

  // Count per status — only show tabs that have matches or are "primary"
  const counts = useMemo(() =>
    TABS.reduce((acc, t) => ({ ...acc, [t]: matchList.filter((m) => m.status === t).length }), {}),
    [matchList]
  );

  // Only show suspended/abandoned tabs if there are actually matches in them
  const visibleTabs = TABS.filter((t) =>
    ["live","scheduled","finished"].includes(t) || counts[t] > 0
  );

  const activeSports = useMemo(() => {
    const seen = new Set(matchList.map((m) => m.sport?.toLowerCase()).filter(Boolean));
    return ["all", ...ALL_SPORT_KEYS.filter((s) => seen.has(s))];
  }, [matchList]);

  const cfg = TAB_CONFIG[tab];

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <header className="sticky top-0 z-30 border-b border-slate-800/80 backdrop-blur-xl bg-slate-950/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-4">
          <span className="text-2xl font-black tracking-tight">
            <span className="text-white">ARENA</span><span className="text-red-500">LIVE</span>
          </span>
          <div className="flex items-center gap-3">
            <WSStatusBadge status={wsStatus} />
            <a href="/admin" className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors">
              Admin ⚡
            </a>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="mb-8">
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight mb-2">
            {tab === "live" ? (
              <><span className="text-red-500">{counts.live}</span><span className="text-white"> Games Live</span></>
            ) : tab === "suspended" ? (
              <span className="text-amber-400">Suspended Matches</span>
            ) : tab === "abandoned" ? (
              <span className="text-rose-400">Abandoned Matches</span>
            ) : tab === "scheduled" ? (
              <span className="text-white">Upcoming Matches</span>
            ) : (
              <span className="text-white">Final Results</span>
            )}
          </h1>
          <p className="text-slate-500 text-sm">
            {tab === "live"      ? "Real-time scores and commentary"
              : tab === "scheduled"  ? "Matches starting soon"
              : tab === "suspended"  ? "Matches temporarily halted"
              : tab === "abandoned"  ? "Matches that could not be completed"
              : "Full results and match reports"}
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 p-1 rounded-xl bg-slate-900 mb-6 flex-wrap">
          {visibleTabs.map((t) => {
            const c = TAB_CONFIG[t];
            return (
              <button key={t} onClick={() => setTab(t)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${tab === t ? "bg-slate-700 text-white shadow" : "text-slate-500 hover:text-slate-300"}`}>
                {c.label}
                {counts[t] > 0 && (
                  <span className={`ml-2 px-1.5 py-0.5 rounded-full text-xs ${
                    t === "live"      ? "bg-red-500/30 text-red-400"
                    : t === "suspended" ? "bg-amber-500/20 text-amber-400"
                    : t === "abandoned" ? "bg-rose-900/30 text-rose-400"
                    : "bg-slate-700 text-slate-400"
                  }`}>
                    {counts[t]}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Sport filter */}
        {activeSports.length > 2 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {activeSports.map((s) => {
              const c = s === "all" ? null : getSport(s);
              const active = sportFilter === s;
              return (
                <button key={s} onClick={() => setSportFilter(s)}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all border ${active ? "text-white" : "text-slate-500 border-slate-800 hover:border-slate-600"}`}
                  style={active && c ? { background:c.color+"22", borderColor:c.color+"66", color:c.color } : active ? { background:"#334155", borderColor:"#475569" } : {}}>
                  {s === "all" ? "🌐 All Sports" : `${c.emoji} ${c.label}`}
                </button>
              );
            })}
          </div>
        )}

        {/* Content */}
        {loading ? (
          <div className="flex items-center justify-center py-32 gap-3 text-slate-500">
            <Spinner size={6} /><span>Loading matches…</span>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-24 gap-3">
            <span className="text-4xl">⚠️</span>
            <p className="text-red-400 font-semibold">{error}</p>
            <button onClick={() => window.location.reload()} className="px-4 py-2 rounded-lg bg-slate-800 text-sm text-white hover:bg-slate-700">Retry</button>
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState icon={cfg.emptyIcon} title={cfg.emptyTitle} subtitle={cfg.emptyHint} />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((m) => <MatchCard key={m.id} match={m} />)}
          </div>
        )}
      </main>
    </div>
  );
}