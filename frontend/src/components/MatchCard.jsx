// import { useNavigate } from "react-router-dom";
// import { getSport } from "../config/sports.js";
// import { SportBadge, StatusBadge } from "./UI.jsx";

// function formatTime(iso) {
//   if (!iso) return "—";
//   return new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
// }

// function formatDate(iso) {
//   if (!iso) return "—";
//   const d = new Date(iso);
//   const today = new Date();
//   if (d.toDateString() === today.toDateString()) return "Today";
//   return d.toLocaleDateString([], { month: "short", day: "numeric" });
// }

// export function MatchCard({ match }) {
//   const navigate = useNavigate();
//   const sport = getSport(match.sport);
//   const isLive = match.status === "live";
//   const isFinished = match.status === "finished";

//   const handleClick = () => {
//     if (isFinished) navigate(`/results/${match.id}`);
//     else navigate(`/room/${match.id}`);
//   };

//   return (
//     <div
//       onClick={handleClick}
//       className="group relative cursor-pointer rounded-2xl overflow-hidden border transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl active:scale-[0.99]"
//       style={{
//         background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
//         borderColor: isLive ? sport.color + "66" : "#334155",
//         boxShadow: isLive ? `0 0 0 1px ${sport.color}33` : "none",
//       }}
//     >
//       {/* Live pulse border */}
//       {isLive && (
//         <div
//           className="absolute inset-0 rounded-2xl pointer-events-none"
//           style={{
//             boxShadow: `inset 0 0 20px ${sport.color}22`,
//             animation: "pulse 2s ease-in-out infinite",
//           }}
//         />
//       )}

//       {/* Header */}
//       <div className="flex items-center justify-between px-4 pt-4 pb-2">
//         <SportBadge sport={match.sport} config={sport} />
//         <StatusBadge status={match.status} />
//       </div>

//       {/* Score board */}
//       <div className="px-4 py-4">
//         <div className="flex items-center justify-between gap-2">
//           {/* Home team */}
//           <div className="flex-1 text-center">
//             <p className="text-xs text-slate-500 uppercase tracking-widest mb-1">{sport.scoreLabel[0]}</p>
//             <p className="font-extrabold text-white text-base leading-tight line-clamp-1">{match.homeTeam}</p>
//           </div>

//           {/* Score */}
//           <div className="flex items-center gap-2 px-4">
//             {isLive || isFinished ? (
//               <>
//                 <span
//                   className="text-4xl font-black tabular-nums"
//                   style={{ color: sport.color, textShadow: `0 0 20px ${sport.color}66` }}
//                 >
//                   {match.homeScore ?? 0}
//                 </span>
//                 <span className="text-slate-600 text-2xl font-thin">—</span>
//                 <span className="text-4xl font-black tabular-nums text-white">
//                   {match.awayScore ?? 0}
//                 </span>
//               </>
//             ) : (
//               <div className="text-center">
//                 <p className="text-slate-500 text-sm font-medium">{formatDate(match.startTime)}</p>
//                 <p className="text-white font-bold text-lg">{formatTime(match.startTime)}</p>
//               </div>
//             )}
//           </div>

//           {/* Away team */}
//           <div className="flex-1 text-center">
//             <p className="text-xs text-slate-500 uppercase tracking-widest mb-1">{sport.scoreLabel[1]}</p>
//             <p className="font-extrabold text-white text-base leading-tight line-clamp-1">{match.awayTeam}</p>
//           </div>
//         </div>
//       </div>

//       {/* Footer CTA */}
//       <div
//         className="px-4 py-3 flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-widest transition-colors"
//         style={{ borderTop: "1px solid #1e293b", color: isLive ? sport.color : "#64748b" }}
//       >
//         {isLive && <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: sport.color }} />}
//         {isLive ? "Watch Live →" : isFinished ? "View Results →" : "View Match →"}
//       </div>
//     </div>
//   );
// }



import { useNavigate } from "react-router-dom";
import { getSport } from "../config/sports.js";
import { SportBadge, StatusBadge } from "./UI.jsx";

function formatTime(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleTimeString([], { hour:"2-digit", minute:"2-digit" });
}
function formatDate(iso) {
  if (!iso) return "—";
  const d = new Date(iso);
  if (d.toDateString() === new Date().toDateString()) return "Today";
  return d.toLocaleDateString([], { month:"short", day:"numeric" });
}

export function MatchCard({ match }) {
  const navigate = useNavigate();
  const sport      = getSport(match.sport);
  const isLive      = match.status === "live";
  const isFinished  = match.status === "finished";
  const isSuspended = match.status === "suspended";
  const isAbandoned = match.status === "abandoned";
  const showScore   = isLive || isFinished || isSuspended || isAbandoned;

  const handleClick = () => {
    if (isFinished || isAbandoned) navigate(`/results/${match.id}`);
    else navigate(`/room/${match.id}`);
  };

  // Visual treatment per status
  const borderColor = isLive      ? sport.color + "66"
                    : isSuspended ? "#b45309aa"
                    : isAbandoned ? "#9f1239aa"
                    : "#334155";
  const glowColor   = isLive      ? `0 0 0 1px ${sport.color}33`
                    : isSuspended ? "0 0 0 1px #b4530933"
                    : "none";

  return (
    <div
      onClick={handleClick}
      className="group relative cursor-pointer rounded-2xl overflow-hidden border transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl active:scale-[0.99]"
      style={{ background:"linear-gradient(135deg, #0f172a 0%, #1e293b 100%)", borderColor, boxShadow: glowColor }}
    >
      {/* Status overlay stripe for suspended / abandoned */}
      {isSuspended && (
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-amber-500" />
      )}
      {isAbandoned && (
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-rose-600" />
      )}
      {isLive && (
        <div className="absolute inset-0 rounded-2xl pointer-events-none"
          style={{ boxShadow:`inset 0 0 20px ${sport.color}22`, animation:"pulse 2s ease-in-out infinite" }} />
      )}

      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-4 pb-2">
        <SportBadge sport={match.sport} config={sport} />
        <StatusBadge status={match.status} />
      </div>

      {/* Reason pill for suspended / abandoned */}
      {(isSuspended || isAbandoned) && match.reason && (
        <div className="px-4 pb-2">
          <p className={`text-xs truncate ${isSuspended ? "text-amber-500/80" : "text-rose-500/80"}`}>
            {isSuspended ? "⏸ " : "✕ "}{match.reason}
          </p>
        </div>
      )}

      {/* Score board */}
      <div className="px-4 py-4">
        <div className="flex items-center justify-between gap-2">
          <div className="flex-1 text-center">
            <p className="text-xs text-slate-500 uppercase tracking-widest mb-1">{sport.scoreLabel[0]}</p>
            <p className={`font-extrabold text-base leading-tight line-clamp-1 ${isAbandoned ? "text-slate-500" : "text-white"}`}>{match.homeTeam}</p>
          </div>

          <div className="flex items-center gap-2 px-4">
            {showScore ? (
              <>
                <span className="text-4xl font-black tabular-nums"
                  style={{ color: isAbandoned ? "#64748b" : isSuspended ? "#f59e0b" : sport.color,
                           textShadow: isLive ? `0 0 20px ${sport.color}66` : "none" }}>
                  {match.homeScore ?? 0}
                </span>
                <span className="text-slate-600 text-2xl font-thin">—</span>
                <span className={`text-4xl font-black tabular-nums ${isAbandoned ? "text-slate-500" : "text-white"}`}>
                  {match.awayScore ?? 0}
                </span>
              </>
            ) : (
              <div className="text-center">
                <p className="text-slate-500 text-sm font-medium">{formatDate(match.startTime)}</p>
                <p className="text-white font-bold text-lg">{formatTime(match.startTime)}</p>
              </div>
            )}
          </div>

          <div className="flex-1 text-center">
            <p className="text-xs text-slate-500 uppercase tracking-widest mb-1">{sport.scoreLabel[1]}</p>
            <p className={`font-extrabold text-base leading-tight line-clamp-1 ${isAbandoned ? "text-slate-500" : "text-white"}`}>{match.awayTeam}</p>
          </div>
        </div>
      </div>

      {/* Footer CTA */}
      <div className="px-4 py-3 flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-widest transition-colors"
        style={{ borderTop:"1px solid #1e293b",
                 color: isLive ? sport.color : isSuspended ? "#f59e0b" : isAbandoned ? "#9f1239" : "#64748b" }}>
        {isLive      && <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: sport.color }} />}
        {isSuspended && <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />}
        {isLive      ? "Watch Live →"
          : isFinished  ? "View Results →"
          : isSuspended ? "Suspended — View →"
          : isAbandoned ? "Abandoned — View Report →"
          : "View Match →"}
      </div>
    </div>
  );
}