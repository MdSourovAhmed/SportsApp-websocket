// import { useEffect, useRef, useState } from "react";
// import { getSport } from "../config/sports.js";
// import { StatusBadge, SportBadge } from "./UI.jsx";

// function ScoreDigit({ value, color }) {
//   const [flash, setFlash] = useState(false);
//   const prev = useRef(value);

//   useEffect(() => {
//     if (prev.current !== value) {
//       setFlash(true);
//       const t = setTimeout(() => setFlash(false), 900);
//       prev.current = value;
//       return () => clearTimeout(t);
//     }
//   }, [value]);

//   return (
//     <span
//       className="tabular-nums transition-all duration-300"
//       style={{
//         color: flash ? "#fbbf24" : color,
//         textShadow: flash ? "0 0 30px #fbbf2488" : `0 0 20px ${color}66`,
//         transform: flash ? "scale(1.15)" : "scale(1)",
//         display: "inline-block",
//       }}
//     >
//       {value}
//     </span>
//   );
// }

// export function Scoreboard({ match }) {
//   const sport = getSport(match.sport);
//   const elapsed = match.startTime
//     ? Math.floor((Date.now() - new Date(match.startTime).getTime()) / 60000)
//     : null;

//   return (
//     <div
//       className="rounded-2xl p-6 border"
//       style={{
//         background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
//         borderColor: sport.color + "44",
//         boxShadow: `0 0 40px ${sport.color}22`,
//       }}
//     >
//       {/* Header row */}
//       <div className="flex items-center justify-between mb-6">
//         <SportBadge sport={match.sport} config={sport} />
//         <div className="flex items-center gap-3">
//           {match.status === "live" && elapsed !== null && (
//             <span className="text-xs text-slate-400 tabular-nums">
//               {Math.min(elapsed, 999)}' played
//             </span>
//           )}
//           <StatusBadge status={match.status} />
//         </div>
//       </div>

//       {/* Main scoreline */}
//       <div className="flex items-center justify-between gap-4">
//         {/* Home */}
//         <div className="flex-1 text-center">
//           <p
//             className="text-xs uppercase tracking-widest mb-2 font-semibold"
//             style={{ color: sport.color + "aa" }}
//           >
//             {sport.scoreLabel[0]}
//           </p>
//           <p className="text-2xl font-black text-white leading-none mb-1 truncate">{match.homeTeam}</p>
//         </div>

//         {/* Score */}
//         <div className="flex items-center gap-3 px-4">
//           <span className="text-6xl font-black">
//             <ScoreDigit value={match.homeScore ?? 0} color={sport.color} />
//           </span>
//           <span className="text-slate-700 text-4xl font-thin">—</span>
//           <span className="text-6xl font-black">
//             <ScoreDigit value={match.awayScore ?? 0} color="#f8fafc" />
//           </span>
//         </div>

//         {/* Away */}
//         <div className="flex-1 text-center">
//           <p className="text-xs uppercase tracking-widest mb-2 font-semibold text-slate-500">
//             {sport.scoreLabel[1]}
//           </p>
//           <p className="text-2xl font-black text-white leading-none mb-1 truncate">{match.awayTeam}</p>
//         </div>
//       </div>

//       {/* Sport-specific score label */}
//       <div className="text-center mt-4">
//         <span className="text-xs text-slate-600 uppercase tracking-widest">
//           {sport.scoreUnit}
//         </span>
//       </div>
//     </div>
//   );
// }





import { useEffect, useRef, useState } from "react";
import { getSport } from "../config/sports.js";
import { StatusBadge, SportBadge } from "./UI.jsx";

function ScoreDigit({ value, color }) {
  const [flash, setFlash] = useState(false);
  const prev = useRef(value);

  useEffect(() => {
    if (prev.current !== value) {
      setFlash(true);
      const t = setTimeout(() => setFlash(false), 900);
      prev.current = value;
      return () => clearTimeout(t);
    }
  }, [value]);

  return (
    <span
      className="tabular-nums transition-all duration-300"
      style={{
        color: flash ? "#fbbf24" : color,
        textShadow: flash ? "0 0 30px #fbbf2488" : `0 0 20px ${color}66`,
        transform: flash ? "scale(1.15)" : "scale(1)",
        display: "inline-block",
      }}
    >
      {value}
    </span>
  );
}

export function Scoreboard({ match }) {
  const sport = getSport(match.sport);
  const elapsed = match.startTime
    ? Math.floor((Date.now() - new Date(match.startTime).getTime()) / 60000)
    : null;

  return (
    <div
      className="rounded-2xl p-6 border"
      style={{
        background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
        borderColor: sport.color + "44",
        boxShadow: `0 0 40px ${sport.color}22`,
      }}
    >
      {/* Header row */}
      <div className="flex items-center justify-between mb-6">
        <SportBadge sport={match.sport} config={sport} />
        <div className="flex items-center gap-3">
          {match.status === "live" && elapsed !== null && (
            <span className="text-xs text-slate-400 tabular-nums">
              {Math.min(elapsed, 999)}' played
            </span>
          )}
          <StatusBadge status={match.status} />
        </div>
      </div>

      {/* Main scoreline */}
      <div className="flex items-center justify-between gap-4">
        {/* Home */}
        <div className="flex-1 text-center">
          <p
            className="text-xs uppercase tracking-widest mb-2 font-semibold"
            style={{ color: sport.color + "aa" }}
          >
            {sport.scoreLabel[0]}
          </p>
          <p className="text-2xl font-black text-white leading-none mb-1 truncate">{match.homeTeam}</p>
        </div>

        {/* Score */}
        <div className="flex items-center gap-3 px-4">
          <span className="text-6xl font-black">
            <ScoreDigit value={match.homeScore ?? 0} color={sport.color} />
          </span>
          <span className="text-slate-700 text-4xl font-thin">—</span>
          <span className="text-6xl font-black">
            <ScoreDigit value={match.awayScore ?? 0} color="#f8fafc" />
          </span>
        </div>

        {/* Away */}
        <div className="flex-1 text-center">
          <p className="text-xs uppercase tracking-widest mb-2 font-semibold text-slate-500">
            {sport.scoreLabel[1]}
          </p>
          <p className="text-2xl font-black text-white leading-none mb-1 truncate">{match.awayTeam}</p>
        </div>
      </div>

      {/* Sport-specific score label */}
      <div className="text-center mt-4">
        <span className="text-xs text-slate-600 uppercase tracking-widest">
          {sport.scoreUnit}
        </span>
      </div>
    </div>
  );
}