// import { useEffect, useRef } from "react";
// import { getEventType } from "../config/sports.js";

// function timeAgo(iso) {
//   const diff = Date.now() - new Date(iso).getTime();
//   const s = Math.floor(diff / 1000);
//   if (s < 60) return `${s}s ago`;
//   const m = Math.floor(s / 60);
//   if (m < 60) return `${m}m ago`;
//   return `${Math.floor(m / 60)}h ago`;
// }

// export function CommentaryFeed({ commentary = [], sport, autoScroll = true, maxHeight = "calc(100vh - 320px)" }) {
//   const bottomRef = useRef(null);
//   const containerRef = useRef(null);
//   const userScrolled = useRef(false);

//   useEffect(() => {
//     if (!autoScroll || userScrolled.current) return;
//     bottomRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [commentary.length, autoScroll]);

//   const handleScroll = () => {
//     const el = containerRef.current;
//     if (!el) return;
//     const atBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 60;
//     userScrolled.current = !atBottom;
//   };

//   // newest first from backend; reverse for chronological display
//   const sorted = [...commentary].reverse();

//   return (
//     <div
//       ref={containerRef}
//       onScroll={handleScroll}
//       className="overflow-y-auto pr-1 space-y-1"
//       style={{ maxHeight }}
//     >
//       {sorted.map((c, i) => {
//         const ev = getEventType(sport, c.eventType);
//         const isGoalLike = ["goal", "wicket", "six", "century", "match_point", "three_pointer"].includes(c.eventType);

//         return (
//           <div
//             key={c.id ?? i}
//             className={`flex gap-3 p-3 rounded-xl transition-all animate-in fade-in slide-in-from-bottom-2 duration-300 ${
//               isGoalLike
//                 ? "border"
//                 : "hover:bg-slate-800/40"
//             }`}
//             style={
//               isGoalLike
//                 ? { background: ev.color + "15", borderColor: ev.color + "44" }
//                 : {}
//             }
//           >
//             {/* Minute bubble */}
//             <div className="flex-shrink-0 flex flex-col items-center gap-0.5">
//               <span
//                 className="w-10 h-10 rounded-full flex items-center justify-center text-lg flex-shrink-0"
//                 style={isGoalLike ? { background: ev.color + "30" } : { background: "#1e293b" }}
//                 title={ev.label}
//               >
//                 {ev.icon}
//               </span>
//               {c.minute != null && (
//                 <span className="text-xs text-slate-500 tabular-nums">{c.minute}'</span>
//               )}
//             </div>

//             {/* Content */}
//             <div className="flex-1 min-w-0">
//               {c.actor && (
//                 <div className="flex items-center gap-2 mb-0.5">
//                   <span
//                     className="text-xs font-bold"
//                     style={{ color: ev.color }}
//                   >
//                     {ev.label}
//                   </span>
//                   {c.team && (
//                     <span className="text-xs text-slate-500">· {c.team}</span>
//                   )}
//                 </div>
//               )}
//               {c.actor && (
//                 <p className="text-sm font-semibold text-white">{c.actor}</p>
//               )}
//               <p className={`text-sm leading-snug ${isGoalLike ? "text-slate-200" : "text-slate-400"}`}>
//                 {c.message}
//               </p>
//               {c.period && (
//                 <p className="text-xs text-slate-600 mt-1">{c.period}</p>
//               )}
//             </div>

//             {/* Time */}
//             <div className="flex-shrink-0 text-xs text-slate-600 whitespace-nowrap pt-0.5">
//               {timeAgo(c.createdAt)}
//             </div>
//           </div>
//         );
//       })}
//       <div ref={bottomRef} />
//     </div>
//   );
// }




import { useEffect, useRef } from "react";
import { getEventType } from "../config/sports.js";

function timeAgo(iso) {
  const diff = Date.now() - new Date(iso).getTime();
  const s = Math.floor(diff / 1000);
  if (s < 60) return `${s}s ago`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  return `${Math.floor(m / 60)}h ago`;
}

export function CommentaryFeed({ commentary = [], sport, autoScroll = true, maxHeight = "calc(100vh - 320px)" }) {
  const bottomRef = useRef(null);
  const containerRef = useRef(null);
  const userScrolled = useRef(false);

  useEffect(() => {
    if (!autoScroll || userScrolled.current) return;
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [commentary.length, autoScroll]);

  const handleScroll = () => {
    const el = containerRef.current;
    if (!el) return;
    const atBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 60;
    userScrolled.current = !atBottom;
  };

  // newest first from backend; reverse for chronological display
  const sorted = [...commentary].reverse();

  return (
    <div
      ref={containerRef}
      onScroll={handleScroll}
      className="overflow-y-auto pr-1 space-y-1"
      style={{ maxHeight }}
    >
      {sorted.map((c, i) => {
        const ev = getEventType(sport, c.eventType);
        const isGoalLike = ["goal", "wicket", "six", "century", "match_point", "three_pointer"].includes(c.eventType);

        return (
          <div
            key={c.id ?? i}
            className={`flex gap-3 p-3 rounded-xl transition-all animate-in fade-in slide-in-from-bottom-2 duration-300 ${
              isGoalLike
                ? "border"
                : "hover:bg-slate-800/40"
            }`}
            style={
              isGoalLike
                ? { background: ev.color + "15", borderColor: ev.color + "44" }
                : {}
            }
          >
            {/* Minute bubble */}
            <div className="flex-shrink-0 flex flex-col items-center gap-0.5">
              <span
                className="w-10 h-10 rounded-full flex items-center justify-center text-lg flex-shrink-0"
                style={isGoalLike ? { background: ev.color + "30" } : { background: "#1e293b" }}
                title={ev.label}
              >
                {ev.icon}
              </span>
              {c.minute != null && (
                <span className="text-xs text-slate-500 tabular-nums">{c.minute}'</span>
              )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              {c.actor && (
                <div className="flex items-center gap-2 mb-0.5">
                  <span
                    className="text-xs font-bold"
                    style={{ color: ev.color }}
                  >
                    {ev.label}
                  </span>
                  {c.team && (
                    <span className="text-xs text-slate-500">· {c.team}</span>
                  )}
                </div>
              )}
              {c.actor && (
                <p className="text-sm font-semibold text-white">{c.actor}</p>
              )}
              <p className={`text-sm leading-snug ${isGoalLike ? "text-slate-200" : "text-slate-400"}`}>
                {c.message}
              </p>
              {c.period && (
                <p className="text-xs text-slate-600 mt-1">{c.period}</p>
              )}
            </div>

            {/* Time */}
            <div className="flex-shrink-0 text-xs text-slate-600 whitespace-nowrap pt-0.5">
              {timeAgo(c.createdAt)}
            </div>
          </div>
        );
      })}
      <div ref={bottomRef} />
    </div>
  );
}