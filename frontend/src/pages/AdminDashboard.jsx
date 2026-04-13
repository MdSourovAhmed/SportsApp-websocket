// // import { useEffect, useState } from "react";
// // import { useNavigate } from "react-router-dom";
// // import { useApp } from "../context/AppContext.jsx";
// // import { useWebSocket } from "../hooks/useWebSocket.js";
// // import { api } from "../utils/api.js";
// // import { WSStatusBadge, StatusBadge, SportBadge, Spinner } from "../components/UI.jsx";
// // import { SPORTS, getSport, ALL_SPORT_KEYS } from "../config/sports.js";

// // // ── Small reusable form field ──────────────────────────────────────────────
// // function Field({ label, children, hint }) {
// //   return (
// //     <div>
// //       <label className="block text-xs text-slate-500 uppercase tracking-widest mb-1.5">{label}</label>
// //       {children}
// //       {hint && <p className="text-xs text-slate-600 mt-1">{hint}</p>}
// //     </div>
// //   );
// // }

// // function Input({ className = "", ...props }) {
// //   return (
// //     <input
// //       {...props}
// //       className={`w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-600 focus:outline-none focus:border-red-500/70 transition-colors text-sm ${className}`}
// //     />
// //   );
// // }

// // function Select({ className = "", children, ...props }) {
// //   return (
// //     <select
// //       {...props}
// //       className={`w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-red-500/70 transition-colors text-sm ${className}`}
// //     >
// //       {children}
// //     </select>
// //   );
// // }

// // function Btn({ children, loading, variant = "primary", className = "", ...props }) {
// //   const base = "px-4 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 justify-center disabled:opacity-50";
// //   const variants = {
// //     primary: "bg-red-600 hover:bg-red-500 text-white",
// //     secondary: "bg-slate-700 hover:bg-slate-600 text-white",
// //     success: "bg-emerald-600 hover:bg-emerald-500 text-white",
// //     warning: "bg-amber-600 hover:bg-amber-500 text-white",
// //   };
// //   return (
// //     <button {...props} disabled={loading || props.disabled} className={`${base} ${variants[variant]} ${className}`}>
// //       {loading && <Spinner size={4} />}
// //       {children}
// //     </button>
// //   );
// // }

// // function Toast({ toasts }) {
// //   return (
// //     <div className="fixed top-4 right-4 z-50 space-y-2 pointer-events-none">
// //       {toasts.map(t => (
// //         <div
// //           key={t.id}
// //           className={`px-4 py-3 rounded-xl text-sm font-semibold shadow-xl animate-in slide-in-from-right-4 duration-300 ${
// //             t.type === "success" ? "bg-emerald-600 text-white" : "bg-red-600 text-white"
// //           }`}
// //         >
// //           {t.type === "success" ? "✓ " : "✗ "}{t.message}
// //         </div>
// //       ))}
// //     </div>
// //   );
// // }

// // // ── Create Match Panel ─────────────────────────────────────────────────────
// // function CreateMatchPanel({ onCreated, toast }) {
// //   const [form, setForm] = useState({
// //     sport: "football",
// //     homeTeam: "",
// //     awayTeam: "",
// //     startTime: "",
// //     endTime: "",
// //   });
// //   const [loading, setLoading] = useState(false);
// //   const sport = getSport(form.sport);

// //   const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

// //   const handleSubmit = async (e) => {
// //     e.preventDefault();
// //     setLoading(true);
// //     try {
// //       const payload = {
// //         ...form,
// //         startTime: new Date(form.startTime).toISOString(),
// //         endTime: new Date(form.endTime).toISOString(),
// //       };
// //       const match = await api.createMatch(payload);
// //       toast("success", `${sport.emoji} Match created!`);
// //       setForm({ sport: form.sport, homeTeam: "", awayTeam: "", startTime: "", endTime: "" });
// //       onCreated?.(match);
// //     } catch (err) {
// //       toast("error", err.message);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   return (
// //     <form onSubmit={handleSubmit} className="space-y-4">
// //       <Field label="Sport">
// //         <Select value={form.sport} onChange={e => set("sport", e.target.value)}>
// //           {ALL_SPORT_KEYS.map(k => {
// //             const s = getSport(k);
// //             return <option key={k} value={k}>{s.emoji} {s.label}</option>;
// //           })}
// //         </Select>
// //       </Field>

// //       <div className="grid grid-cols-2 gap-3">
// //         <Field label={sport.scoreLabel[0]}>
// //           <Input
// //             placeholder={`e.g. ${sport.scoreLabel[0]} Team`}
// //             value={form.homeTeam}
// //             onChange={e => set("homeTeam", e.target.value)}
// //             required
// //           />
// //         </Field>
// //         <Field label={sport.scoreLabel[1]}>
// //           <Input
// //             placeholder={`e.g. ${sport.scoreLabel[1]} Team`}
// //             value={form.awayTeam}
// //             onChange={e => set("awayTeam", e.target.value)}
// //             required
// //           />
// //         </Field>
// //       </div>

// //       <div className="grid grid-cols-2 gap-3">
// //         <Field label="Start Time">
// //           <Input
// //             type="datetime-local"
// //             value={form.startTime}
// //             onChange={e => set("startTime", e.target.value)}
// //             required
// //           />
// //         </Field>
// //         <Field label="End Time">
// //           <Input
// //             type="datetime-local"
// //             value={form.endTime}
// //             onChange={e => set("endTime", e.target.value)}
// //             required
// //           />
// //         </Field>
// //       </div>

// //       <Btn type="submit" loading={loading} className="w-full">
// //         Create Match
// //       </Btn>
// //     </form>
// //   );
// // }

// // // ── Score Update Panel ─────────────────────────────────────────────────────
// // function ScorePanel({ liveMatches, toast }) {
// //   const [matchId, setMatchId] = useState("");
// //   const [home, setHome] = useState(0);
// //   const [away, setAway] = useState(0);
// //   const [loading, setLoading] = useState(false);

// //   const selected = liveMatches.find(m => m.id === Number(matchId));
// //   const sport = selected ? getSport(selected.sport) : null;

// //   useEffect(() => {
// //     if (selected) {
// //       setHome(selected.homeScore ?? 0);
// //       setAway(selected.awayScore ?? 0);
// //     }
// //   }, [matchId]);

// //   const handleSubmit = async (e) => {
// //     e.preventDefault();
// //     if (!matchId) return;
// //     setLoading(true);
// //     try {
// //       await api.updateScore(Number(matchId), {
// //         homeScore: Number(home),
// //         awayScore: Number(away),
// //       });
// //       toast("success", "Score updated!");
// //     } catch (err) {
// //       toast("error", err.message);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   return (
// //     <form onSubmit={handleSubmit} className="space-y-4">
// //       <Field label="Live Match">
// //         <Select value={matchId} onChange={e => setMatchId(e.target.value)} required>
// //           <option value="">Select a live match…</option>
// //           {liveMatches.map(m => {
// //             const s = getSport(m.sport);
// //             return (
// //               <option key={m.id} value={m.id}>
// //                 {s.emoji} {m.homeTeam} vs {m.awayTeam}
// //               </option>
// //             );
// //           })}
// //         </Select>
// //         {liveMatches.length === 0 && (
// //           <p className="text-xs text-slate-600 mt-1">No live matches available</p>
// //         )}
// //       </Field>

// //       {selected && sport && (
// //         <>
// //           <div className="rounded-xl bg-slate-800/60 border border-slate-700 p-4">
// //             <div className="flex items-center justify-between mb-3">
// //               <SportBadge sport={selected.sport} config={sport} />
// //               <StatusBadge status={selected.status} />
// //             </div>
// //             <div className="grid grid-cols-2 gap-4">
// //               <Field label={`${sport.scoreLabel[0]} (${selected.homeTeam})`}>
// //                 <Input
// //                   type="number"
// //                   min={0}
// //                   value={home}
// //                   onChange={e => setHome(e.target.value)}
// //                   required
// //                 />
// //               </Field>
// //               <Field label={`${sport.scoreLabel[1]} (${selected.awayTeam})`}>
// //                 <Input
// //                   type="number"
// //                   min={0}
// //                   value={away}
// //                   onChange={e => setAway(e.target.value)}
// //                   required
// //                 />
// //               </Field>
// //             </div>
// //           </div>

// //           <Btn type="submit" loading={loading} variant="success" className="w-full">
// //             Push Score Update
// //           </Btn>
// //         </>
// //       )}
// //     </form>
// //   );
// // }

// // // ── Commentary Panel ───────────────────────────────────────────────────────
// // function CommentaryPanel({ allMatches, toast }) {
// //   const activeMatches = allMatches.filter(m => m.status === "live" || m.status === "scheduled");
// //   const [matchId, setMatchId] = useState("");
// //   const [loading, setLoading] = useState(false);
// //   const [form, setForm] = useState({
// //     eventType: "commentary",
// //     minute: "",
// //     period: "",
// //     actor: "",
// //     team: "",
// //     message: "",
// //     tags: "",
// //   });

// //   const selected = allMatches.find(m => m.id === Number(matchId));
// //   const sport = selected ? getSport(selected.sport) : null;
// //   const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

// //   useEffect(() => {
// //     if (sport) {
// //       set("eventType", "commentary");
// //       set("period", sport.defaultPeriod);
// //     }
// //   }, [matchId]);

// //   const handleSubmit = async (e) => {
// //     e.preventDefault();
// //     if (!matchId) return;
// //     setLoading(true);
// //     try {
// //       const payload = {
// //         sport: selected.sport,
// //         eventType: form.eventType || undefined,
// //         minute: form.minute !== "" ? Number(form.minute) : undefined,
// //         period: form.period || undefined,
// //         actor: form.actor || undefined,
// //         team: form.team || undefined,
// //         message: form.message,
// //         tags: form.tags ? form.tags.split(",").map(t => t.trim()).filter(Boolean) : undefined,
// //       };
// //       await api.postCommentary(Number(matchId), payload);
// //       toast("success", "Commentary posted!");
// //       set("message", "");
// //       set("actor", "");
// //       set("minute", "");
// //     } catch (err) {
// //       toast("error", err.message);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   return (
// //     <form onSubmit={handleSubmit} className="space-y-4">
// //       <Field label="Match">
// //         <Select value={matchId} onChange={e => setMatchId(e.target.value)} required>
// //           <option value="">Select match…</option>
// //           {activeMatches.map(m => {
// //             const s = getSport(m.sport);
// //             return (
// //               <option key={m.id} value={m.id}>
// //                 {s.emoji} {m.homeTeam} vs {m.awayTeam} [{m.status}]
// //               </option>
// //             );
// //           })}
// //         </Select>
// //       </Field>

// //       {selected && sport && (
// //         <>
// //           {/* Event type grid */}
// //           <Field label="Event Type">
// //             <div className="grid grid-cols-3 sm:grid-cols-4 gap-1.5">
// //               {sport.eventTypes.map(ev => (
// //                 <button
// //                   key={ev.value}
// //                   type="button"
// //                   onClick={() => set("eventType", ev.value)}
// //                   className="flex flex-col items-center gap-1 p-2 rounded-lg border text-xs font-semibold transition-all"
// //                   style={
// //                     form.eventType === ev.value
// //                       ? { background: ev.color + "30", borderColor: ev.color, color: ev.color }
// //                       : { background: "#1e293b", borderColor: "#334155", color: "#64748b" }
// //                   }
// //                 >
// //                   <span className="text-lg">{ev.icon}</span>
// //                   <span className="leading-tight text-center">{ev.label}</span>
// //                 </button>
// //               ))}
// //             </div>
// //           </Field>

// //           <div className="grid grid-cols-3 gap-3">
// //             <Field label={`${sport.minuteLabel} #`}>
// //               <Input
// //                 type="number"
// //                 min={0}
// //                 max={sport.maxMinute}
// //                 placeholder="e.g. 67"
// //                 value={form.minute}
// //                 onChange={e => set("minute", e.target.value)}
// //               />
// //             </Field>
// //             <Field label="Period">
// //               <Select value={form.period} onChange={e => set("period", e.target.value)}>
// //                 {sport.periods.map(p => (
// //                   <option key={p} value={p}>{p}</option>
// //                 ))}
// //               </Select>
// //             </Field>
// //             <Field label="Team">
// //               <Select value={form.team} onChange={e => set("team", e.target.value)}>
// //                 <option value="">— None —</option>
// //                 <option value={selected.homeTeam}>{selected.homeTeam}</option>
// //                 <option value={selected.awayTeam}>{selected.awayTeam}</option>
// //               </Select>
// //             </Field>
// //           </div>

// //           <Field label="Player / Actor">
// //             <Input
// //               placeholder="e.g. Saka, Kohli, Lin Dan…"
// //               value={form.actor}
// //               onChange={e => set("actor", e.target.value)}
// //             />
// //           </Field>

// //           <Field label="Commentary Message" hint="This is what viewers will see in the live feed">
// //             <textarea
// //               rows={3}
// //               placeholder="Describe what happened…"
// //               value={form.message}
// //               onChange={e => set("message", e.target.value)}
// //               required
// //               className="w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-600 focus:outline-none focus:border-red-500/70 transition-colors text-sm resize-none"
// //             />
// //           </Field>

// //           <Field label="Tags" hint="Comma-separated, e.g: goal, saka, arsenal">
// //             <Input
// //               placeholder="goal, saka, arsenal"
// //               value={form.tags}
// //               onChange={e => set("tags", e.target.value)}
// //             />
// //           </Field>

// //           <Btn type="submit" loading={loading} variant="warning" className="w-full">
// //             Post to Live Feed ⚡
// //           </Btn>
// //         </>
// //       )}
// //     </form>
// //   );
// // }

// // // ── Main Dashboard ─────────────────────────────────────────────────────────
// // export default function AdminDashboard() {
// //   const { state, dispatch, logout, handleWsMessage } = useApp();
// //   const navigate = useNavigate();
// //   const [tab, setTab] = useState("create");
// //   const [toasts, setToasts] = useState([]);
// //   const [matchLoading, setMatchLoading] = useState(true);

// //   const { status: wsStatus } = useWebSocket(handleWsMessage);

// //   useEffect(() => {
// //     if (!state.isAdmin) { navigate("/admin"); return; }
// //     api.getMatches(100)
// //       .then(data => dispatch({ type: "SET_MATCHES", payload: data }))
// //       .finally(() => setMatchLoading(false));
// //   }, [state.isAdmin]);

// //   const toast = (type, message) => {
// //     const id = Date.now();
// //     setToasts(t => [...t, { id, type, message }]);
// //     setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3500);
// //   };

// //   const liveMatches = state.matches.filter(m => m.status === "live");

// //   if (!state.isAdmin) return null;

// //   const TABS = [
// //     { id: "create",     label: "➕ New Match" },
// //     { id: "score",      label: "⚡ Score" },
// //     { id: "commentary", label: "🎙️ Commentary" },
// //     { id: "matches",    label: "📋 Matches" },
// //   ];

// //   return (
// //     <div className="min-h-screen bg-slate-950 text-white">
// //       <Toast toasts={toasts} />

// //       {/* Header */}
// //       <header className="sticky top-0 z-30 border-b border-slate-800/80 backdrop-blur-xl bg-slate-950/90">
// //         <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
// //           <div className="flex items-center gap-3">
// //             <span className="font-black tracking-tight text-lg">
// //               <span className="text-white">ARENA</span><span className="text-red-500">LIVE</span>
// //             </span>
// //             <span className="text-xs bg-red-600/20 text-red-400 border border-red-600/30 px-2 py-0.5 rounded font-semibold">
// //               ADMIN
// //             </span>
// //           </div>
// //           <div className="flex items-center gap-3">
// //             <WSStatusBadge status={wsStatus} />
// //             <a href="/" className="text-xs text-slate-500 hover:text-slate-300 transition-colors">
// //               View Site
// //             </a>
// //             <button
// //               onClick={() => { logout(); navigate("/admin"); }}
// //               className="text-xs text-red-500 hover:text-red-400 transition-colors font-semibold"
// //             >
// //               Sign Out
// //             </button>
// //           </div>
// //         </div>
// //       </header>

// //       <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
// //         {/* Stats bar */}
// //         <div className="grid grid-cols-3 gap-3 mb-8">
// //           {[
// //             { label: "Live Now", count: liveMatches.length, color: "text-red-400" },
// //             { label: "Scheduled", count: state.matches.filter(m => m.status === "scheduled").length, color: "text-blue-400" },
// //             { label: "Finished", count: state.matches.filter(m => m.status === "finished").length, color: "text-slate-400" },
// //           ].map(({ label, count, color }) => (
// //             <div key={label} className="rounded-xl bg-slate-900 border border-slate-800 p-4 text-center">
// //               <p className={`text-3xl font-black ${color}`}>{count}</p>
// //               <p className="text-xs text-slate-500 uppercase tracking-widest mt-1">{label}</p>
// //             </div>
// //           ))}
// //         </div>

// //         {/* Tab bar */}
// //         <div className="flex gap-1 p-1 rounded-xl bg-slate-900 mb-6 flex-wrap">
// //           {TABS.map(t => (
// //             <button
// //               key={t.id}
// //               onClick={() => setTab(t.id)}
// //               className={`flex-1 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
// //                 tab === t.id
// //                   ? "bg-slate-700 text-white shadow"
// //                   : "text-slate-500 hover:text-slate-300"
// //               }`}
// //             >
// //               {t.label}
// //             </button>
// //           ))}
// //         </div>

// //         {/* Panel */}
// //         <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6">
// //           {tab === "create" && (
// //             <>
// //               <h2 className="text-base font-bold text-white mb-5">Create New Match</h2>
// //               <CreateMatchPanel
// //                 toast={toast}
// //                 onCreated={m => dispatch({ type: "ADD_MATCH", payload: m })}
// //               />
// //             </>
// //           )}

// //           {tab === "score" && (
// //             <>
// //               <h2 className="text-base font-bold text-white mb-5">Update Live Score</h2>
// //               <ScorePanel liveMatches={liveMatches} toast={toast} />
// //             </>
// //           )}

// //           {tab === "commentary" && (
// //             <>
// //               <h2 className="text-base font-bold text-white mb-5">Post Commentary</h2>
// //               <CommentaryPanel allMatches={state.matches} toast={toast} />
// //             </>
// //           )}

// //           {tab === "matches" && (
// //             <>
// //               <h2 className="text-base font-bold text-white mb-5">All Matches</h2>
// //               {matchLoading ? (
// //                 <div className="flex items-center gap-3 py-8 justify-center text-slate-500">
// //                   <Spinner /> Loading…
// //                 </div>
// //               ) : (
// //                 <div className="space-y-2">
// //                   {state.matches.length === 0 && (
// //                     <p className="text-slate-600 text-sm text-center py-8">No matches yet. Create one →</p>
// //                   )}
// //                   {state.matches.map(m => {
// //                     const s = getSport(m.sport);
// //                     return (
// //                       <div
// //                         key={m.id}
// //                         className="flex items-center gap-3 p-3 rounded-xl bg-slate-800/60 border border-slate-700"
// //                       >
// //                         <span className="text-xl">{s.emoji}</span>
// //                         <div className="flex-1 min-w-0">
// //                           <p className="text-sm font-semibold text-white truncate">
// //                             {m.homeTeam} <span className="text-slate-500">vs</span> {m.awayTeam}
// //                           </p>
// //                           <p className="text-xs text-slate-500">{s.label} · ID #{m.id}</p>
// //                         </div>
// //                         <div className="flex items-center gap-3">
// //                           <span className="text-white font-bold tabular-nums text-sm">
// //                             {m.homeScore ?? 0} — {m.awayScore ?? 0}
// //                           </span>
// //                           <StatusBadge status={m.status} />
// //                         </div>
// //                         <a
// //                           href={m.status === "finished" ? `/results/${m.id}` : `/room/${m.id}`}
// //                           className="text-xs text-slate-500 hover:text-white transition-colors"
// //                         >
// //                           View →
// //                         </a>
// //                       </div>
// //                     );
// //                   })}
// //                 </div>
// //               )}
// //             </>
// //           )}
// //         </div>
// //       </main>
// //     </div>
// //   );
// // }

// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { useWSStore } from "../store/wsStore.js";
// import { useAppStore } from "../store/appStore.js";
// import { api } from "../utils/api.js";
// import {
//   WSStatusBadge,
//   StatusBadge,
//   SportBadge,
//   Spinner,
//   ConfirmDialog,
// } from "../components/UI.jsx";
// import { getSport, ALL_SPORT_KEYS } from "../config/sports.js";

// // ── Form primitives ────────────────────────────────────────────────────────
// function Field({ label, hint, children }) {
//   return (
//     <div>
//       <label className="block text-xs text-slate-500 uppercase tracking-widest mb-1.5">
//         {label}
//       </label>
//       {children}
//       {hint && <p className="text-xs text-slate-600 mt-1">{hint}</p>}
//     </div>
//   );
// }
// function Input({ className = "", ...props }) {
//   return (
//     <input
//       {...props}
//       className={`w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-600 focus:outline-none focus:border-red-500/70 transition-colors text-sm ${className}`}
//     />
//   );
// }
// function Textarea({ className = "", ...props }) {
//   return (
//     <textarea
//       {...props}
//       className={`w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-600 focus:outline-none focus:border-red-500/70 transition-colors text-sm resize-none ${className}`}
//     />
//   );
// }
// function Select({ className = "", children, ...props }) {
//   return (
//     <select
//       {...props}
//       className={`w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-red-500/70 transition-colors text-sm ${className}`}
//     >
//       {children}
//     </select>
//   );
// }
// function Btn({
//   children,
//   loading,
//   variant = "primary",
//   className = "",
//   ...props
// }) {
//   const v = {
//     primary: "bg-red-600 hover:bg-red-500",
//     secondary: "bg-slate-700 hover:bg-slate-600",
//     success: "bg-emerald-600 hover:bg-emerald-500",
//     warning: "bg-amber-600 hover:bg-amber-500",
//     danger: "bg-red-800 hover:bg-red-700",
//   };
//   return (
//     <button
//       {...props}
//       disabled={loading || props.disabled}
//       className={`px-4 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 justify-center disabled:opacity-50 text-white ${v[variant]} ${className}`}
//     >
//       {loading && <Spinner size={4} />}
//       {children}
//     </button>
//   );
// }
// function Toast({ toasts }) {
//   return (
//     <div className="fixed top-4 right-4 z-50 space-y-2 pointer-events-none">
//       {toasts.map((t) => (
//         <div
//           key={t.id}
//           className={`px-4 py-3 rounded-xl text-sm font-semibold shadow-xl animate-in slide-in-from-right-4 duration-300 ${t.type === "success" ? "bg-emerald-600" : "bg-red-600"} text-white`}
//         >
//           {t.type === "success" ? "✓ " : "✗ "}
//           {t.message}
//         </div>
//       ))}
//     </div>
//   );
// }

// // ── Create Match ───────────────────────────────────────────────────────────
// function CreateMatchPanel({ onCreated, toast }) {
//   const [form, setForm] = useState({
//     sport: "football",
//     homeTeam: "",
//     awayTeam: "",
//     startTime: "",
//     endTime: "",
//   });
//   const [loading, setLoading] = useState(false);
//   const sport = getSport(form.sport);
//   const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     try {
//       const match = await api.createMatch({
//         ...form,
//         startTime: new Date(form.startTime).toISOString(),
//         endTime: new Date(form.endTime).toISOString(),
//       });
//       toast("success", `${sport.emoji} Match created!`);
//       setForm({
//         sport: form.sport,
//         homeTeam: "",
//         awayTeam: "",
//         startTime: "",
//         endTime: "",
//       });
//       onCreated?.(match);
//     } catch (err) {
//       toast("error", err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit} className="space-y-4">
//       <Field label="Sport">
//         <Select
//           value={form.sport}
//           onChange={(e) => set("sport", e.target.value)}
//         >
//           {ALL_SPORT_KEYS.map((k) => {
//             const s = getSport(k);
//             return (
//               <option key={k} value={k}>
//                 {s.emoji} {s.label}
//               </option>
//             );
//           })}
//         </Select>
//       </Field>
//       <div className="grid grid-cols-2 gap-3">
//         <Field label={sport.scoreLabel[0]}>
//           <Input
//             placeholder="Home team"
//             value={form.homeTeam}
//             onChange={(e) => set("homeTeam", e.target.value)}
//             required
//           />
//         </Field>
//         <Field label={sport.scoreLabel[1]}>
//           <Input
//             placeholder="Away team"
//             value={form.awayTeam}
//             onChange={(e) => set("awayTeam", e.target.value)}
//             required
//           />
//         </Field>
//       </div>
//       <div className="grid grid-cols-2 gap-3">
//         <Field label="Start Time">
//           <Input
//             type="datetime-local"
//             value={form.startTime}
//             onChange={(e) => set("startTime", e.target.value)}
//             required
//           />
//         </Field>
//         <Field label="End Time">
//           <Input
//             type="datetime-local"
//             value={form.endTime}
//             onChange={(e) => set("endTime", e.target.value)}
//             required
//           />
//         </Field>
//       </div>
//       <Btn type="submit" loading={loading} className="w-full">
//         Create Match
//       </Btn>
//     </form>
//   );
// }

// // ── Score Update ───────────────────────────────────────────────────────────
// function ScorePanel({ liveMatches, toast }) {
//   const [matchId, setMatchId] = useState("");
//   const [home, setHome] = useState(0);
//   const [away, setAway] = useState(0);
//   const [loading, setLoading] = useState(false);
//   const selected = liveMatches.find((m) => m.id === Number(matchId));
//   const sport = selected ? getSport(selected.sport) : null;

//   useEffect(() => {
//     if (selected) {
//       setHome(selected.homeScore ?? 0);
//       setAway(selected.awayScore ?? 0);
//     }
//   }, [matchId]);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!matchId) return;
//     setLoading(true);
//     try {
//       await api.updateScore(Number(matchId), {
//         homeScore: Number(home),
//         awayScore: Number(away),
//       });
//       toast("success", "Score updated!");
//     } catch (err) {
//       toast("error", err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit} className="space-y-4">
//       <Field label="Live Match">
//         <Select
//           value={matchId}
//           onChange={(e) => setMatchId(e.target.value)}
//           required
//         >
//           <option value="">Select a live match…</option>
//           {liveMatches.map((m) => {
//             const s = getSport(m.sport);
//             return (
//               <option key={m.id} value={m.id}>
//                 {s.emoji} {m.homeTeam} vs {m.awayTeam}
//               </option>
//             );
//           })}
//         </Select>
//         {liveMatches.length === 0 && (
//           <p className="text-xs text-slate-600 mt-1">
//             No live matches available
//           </p>
//         )}
//       </Field>
//       {selected && sport && (
//         <>
//           <div className="rounded-xl bg-slate-800/60 border border-slate-700 p-4">
//             <div className="flex items-center justify-between mb-3">
//               <SportBadge sport={selected.sport} config={sport} />
//               <StatusBadge status={selected.status} />
//             </div>
//             <div className="grid grid-cols-2 gap-4">
//               <Field label={`${sport.scoreLabel[0]} (${selected.homeTeam})`}>
//                 <Input
//                   type="number"
//                   min={0}
//                   value={home}
//                   onChange={(e) => setHome(e.target.value)}
//                   required
//                 />
//               </Field>
//               <Field label={`${sport.scoreLabel[1]} (${selected.awayTeam})`}>
//                 <Input
//                   type="number"
//                   min={0}
//                   value={away}
//                   onChange={(e) => setAway(e.target.value)}
//                   required
//                 />
//               </Field>
//             </div>
//           </div>
//           <Btn
//             type="submit"
//             loading={loading}
//             variant="success"
//             className="w-full"
//           >
//             Push Score Update
//           </Btn>
//         </>
//       )}
//     </form>
//   );
// }

// // ── Commentary ─────────────────────────────────────────────────────────────
// function CommentaryPanel({ allMatches, toast }) {
//   const active = allMatches.filter(
//     (m) => m.status === "live" || m.status === "scheduled",
//   );
//   const [matchId, setMatchId] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [form, setForm] = useState({
//     eventType: "commentary",
//     minute: "",
//     period: "",
//     actor: "",
//     team: "",
//     message: "",
//     tags: "",
//   });
//   const selected = allMatches.find((m) => m.id === Number(matchId));
//   const sport = selected ? getSport(selected.sport) : null;
//   const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

//   useEffect(() => {
//     if (sport) {
//       set("eventType", "commentary");
//       set("period", sport.defaultPeriod);
//     }
//   }, [matchId]);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!matchId) return;
//     setLoading(true);
//     try {
//       await api.postCommentary(Number(matchId), {
//         sport: selected.sport,
//         eventType: form.eventType || undefined,
//         minute: form.minute !== "" ? Number(form.minute) : undefined,
//         period: form.period || undefined,
//         actor: form.actor || undefined,
//         team: form.team || undefined,
//         message: form.message,
//         tags: form.tags
//           ? form.tags
//               .split(",")
//               .map((t) => t.trim())
//               .filter(Boolean)
//           : undefined,
//       });
//       toast("success", "Commentary posted!");
//       set("message", "");
//       set("actor", "");
//       set("minute", "");
//     } catch (err) {
//       toast("error", err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit} className="space-y-4">
//       <Field label="Match">
//         <Select
//           value={matchId}
//           onChange={(e) => setMatchId(e.target.value)}
//           required
//         >
//           <option value="">Select match…</option>
//           {active.map((m) => {
//             const s = getSport(m.sport);
//             return (
//               <option key={m.id} value={m.id}>
//                 {s.emoji} {m.homeTeam} vs {m.awayTeam} [{m.status}]
//               </option>
//             );
//           })}
//         </Select>
//       </Field>
//       {selected && sport && (
//         <>
//           <Field label="Event Type">
//             <div className="grid grid-cols-3 sm:grid-cols-4 gap-1.5">
//               {sport.eventTypes.map((ev) => (
//                 <button
//                   key={ev.value}
//                   type="button"
//                   onClick={() => set("eventType", ev.value)}
//                   className="flex flex-col items-center gap-1 p-2 rounded-lg border text-xs font-semibold transition-all"
//                   style={
//                     form.eventType === ev.value
//                       ? {
//                           background: ev.color + "30",
//                           borderColor: ev.color,
//                           color: ev.color,
//                         }
//                       : {
//                           background: "#1e293b",
//                           borderColor: "#334155",
//                           color: "#64748b",
//                         }
//                   }
//                 >
//                   <span className="text-lg">{ev.icon}</span>
//                   <span className="leading-tight text-center">{ev.label}</span>
//                 </button>
//               ))}
//             </div>
//           </Field>
//           <div className="grid grid-cols-3 gap-3">
//             <Field label={`${sport.minuteLabel} #`}>
//               <Input
//                 type="number"
//                 min={0}
//                 max={sport.maxMinute}
//                 placeholder="e.g. 67"
//                 value={form.minute}
//                 onChange={(e) => set("minute", e.target.value)}
//               />
//             </Field>
//             <Field label="Period">
//               <Select
//                 value={form.period}
//                 onChange={(e) => set("period", e.target.value)}
//               >
//                 {sport.periods.map((p) => (
//                   <option key={p} value={p}>
//                     {p}
//                   </option>
//                 ))}
//               </Select>
//             </Field>
//             <Field label="Team">
//               <Select
//                 value={form.team}
//                 onChange={(e) => set("team", e.target.value)}
//               >
//                 <option value="">— None —</option>
//                 <option value={selected.homeTeam}>{selected.homeTeam}</option>
//                 <option value={selected.awayTeam}>{selected.awayTeam}</option>
//               </Select>
//             </Field>
//           </div>
//           <Field label="Player / Actor">
//             <Input
//               placeholder="e.g. Saka, Kohli…"
//               value={form.actor}
//               onChange={(e) => set("actor", e.target.value)}
//             />
//           </Field>
//           <Field label="Commentary Message" hint="Shown live to viewers">
//             <Textarea
//               rows={3}
//               placeholder="Describe what happened…"
//               value={form.message}
//               onChange={(e) => set("message", e.target.value)}
//               required
//             />
//           </Field>
//           <Field label="Tags" hint="Comma-separated">
//             <Input
//               placeholder="goal, saka, arsenal"
//               value={form.tags}
//               onChange={(e) => set("tags", e.target.value)}
//             />
//           </Field>
//           <Btn
//             type="submit"
//             loading={loading}
//             variant="warning"
//             className="w-full"
//           >
//             Post to Live Feed ⚡
//           </Btn>
//         </>
//       )}
//     </form>
//   );
// }

// // ── Manage Panel — casualty controls per match ─────────────────────────────
// function ManagePanel({ allMatches, toast, onMatchChanged }) {
//   const [matchId, setMatchId] = useState("");
//   const [dialog, setDialog] = useState(null); // { action, title, message, confirmLabel, variant }
//   const [reasonInput, setReasonInput] = useState("");
//   const [rescheduleForm, setRescheduleForm] = useState({
//     startTime: "",
//     endTime: "",
//     reason: "",
//   });
//   const [editForm, setEditForm] = useState({
//     homeTeam: "",
//     awayTeam: "",
//     sport: "",
//   });
//   const [finishForm, setFinishForm] = useState({
//     homeScore: "",
//     awayScore: "",
//     reason: "",
//   });
//   const [loading, setLoading] = useState(false);

//   const selected = allMatches.find((m) => m.id === Number(matchId));
//   const sport = selected ? getSport(selected.sport) : null;

//   const closeDialog = () => {
//     setDialog(null);
//     setReasonInput("");
//   };

//   const canSuspend =
//     selected && ["live", "scheduled"].includes(selected.status);
//   const canAbandon =
//     selected && ["live", "suspended"].includes(selected.status);
//   const canReschedule =
//     selected && ["scheduled", "suspended"].includes(selected.status);
//   const canFinish = selected && ["live", "suspended"].includes(selected.status);
//   const canEdit = selected && selected.status === "scheduled";
//   const canDelete =
//     selected &&
//     ["scheduled", "abandoned", "finished"].includes(selected.status);

//   const run = async (action) => {
//     setLoading(true);
//     try {
//       let updated;
//       if (action === "suspend") {
//         updated = await api.suspendMatch(Number(matchId), reasonInput);
//         toast("success", "Match suspended.");
//       } else if (action === "abandon") {
//         updated = await api.abandonMatch(Number(matchId), reasonInput);
//         toast("success", "Match abandoned.");
//       } else if (action === "reschedule") {
//         updated = await api.rescheduleMatch(Number(matchId), {
//           startTime: new Date(rescheduleForm.startTime).toISOString(),
//           endTime: new Date(rescheduleForm.endTime).toISOString(),
//           reason: rescheduleForm.reason || undefined,
//         });
//         toast("success", "Match rescheduled.");
//       } else if (action === "finish") {
//         updated = await api.forceFinish(Number(matchId), {
//           homeScore:
//             finishForm.homeScore !== ""
//               ? Number(finishForm.homeScore)
//               : undefined,
//           awayScore:
//             finishForm.awayScore !== ""
//               ? Number(finishForm.awayScore)
//               : undefined,
//           reason: finishForm.reason || undefined,
//         });
//         toast("success", "Match force-finished.");
//       } else if (action === "edit") {
//         const body = {};
//         if (editForm.homeTeam) body.homeTeam = editForm.homeTeam;
//         if (editForm.awayTeam) body.awayTeam = editForm.awayTeam;
//         if (editForm.sport) body.sport = editForm.sport;
//         updated = await api.editMatch(Number(matchId), body);
//         toast("success", "Match updated.");
//       } else if (action === "delete") {
//         await api.deleteMatch(Number(matchId));
//         toast("success", "Match deleted.");
//         setMatchId("");
//         onMatchChanged?.({ matchId: Number(matchId), deleted: true });
//         closeDialog();
//         setLoading(false);
//         return;
//       }
//       onMatchChanged?.(updated);
//       closeDialog();
//     } catch (err) {
//       toast("error", err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="space-y-5">
//       {/* Match selector */}
//       <Field label="Select Match">
//         <Select
//           value={matchId}
//           onChange={(e) => {
//             setMatchId(e.target.value);
//           }}
//         >
//           <option value="">Choose a match to manage…</option>
//           {allMatches.map((m) => {
//             const s = getSport(m.sport);
//             return (
//               <option key={m.id} value={m.id}>
//                 {s.emoji} {m.homeTeam} vs {m.awayTeam} [{m.status}]
//               </option>
//             );
//           })}
//         </Select>
//       </Field>

//       {selected && sport && (
//         <>
//           {/* Match info card */}
//           <div className="rounded-xl bg-slate-800/60 border border-slate-700 p-4">
//             <div className="flex items-center justify-between mb-3">
//               <SportBadge sport={selected.sport} config={sport} />
//               <StatusBadge status={selected.status} />
//             </div>
//             <p className="text-white font-bold">
//               {selected.homeTeam}{" "}
//               <span className="text-slate-500 font-normal">vs</span>{" "}
//               {selected.awayTeam}
//             </p>
//             <p className="text-slate-500 text-xs mt-1">
//               Score: {selected.homeScore ?? 0} — {selected.awayScore ?? 0}
//               {selected.reason && (
//                 <span className="ml-3 text-amber-600/80">
//                   Reason: {selected.reason}
//                 </span>
//               )}
//             </p>
//           </div>

//           {/* Action buttons grid */}
//           <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
//             <Btn
//               variant="warning"
//               disabled={!canSuspend}
//               onClick={() => {
//                 setReasonInput("");
//                 setDialog({
//                   action: "suspend",
//                   title: "Suspend Match",
//                   message:
//                     "Provide a reason for the suspension. This will be shown to viewers watching the game.",
//                   confirmLabel: "Suspend Match",
//                   variant: "warning",
//                 });
//               }}
//               className={!canSuspend ? "opacity-40 cursor-not-allowed" : ""}
//             >
//               ⏸ Suspend
//             </Btn>

//             <Btn
//               variant="danger"
//               disabled={!canAbandon}
//               onClick={() => {
//                 setReasonInput("");
//                 setDialog({
//                   action: "abandon",
//                   title: "Abandon Match",
//                   message:
//                     "This permanently halts the match. No winner will be declared. This cannot be undone.",
//                   confirmLabel: "Abandon Match",
//                   variant: "danger",
//                 });
//               }}
//               className={!canAbandon ? "opacity-40 cursor-not-allowed" : ""}
//             >
//               ✕ Abandon
//             </Btn>

//             <Btn
//               variant="secondary"
//               disabled={!canReschedule}
//               onClick={() => {
//                 setRescheduleForm({ startTime: "", endTime: "", reason: "" });
//                 setDialog({
//                   action: "reschedule",
//                   title: "Reschedule Match",
//                   message: "Set a new time window for this match.",
//                   confirmLabel: "Reschedule",
//                   variant: "secondary",
//                 });
//               }}
//               className={!canReschedule ? "opacity-40 cursor-not-allowed" : ""}
//             >
//               📅 Reschedule
//             </Btn>

//             <Btn
//               variant="success"
//               disabled={!canFinish}
//               onClick={() => {
//                 setFinishForm({
//                   homeScore: selected.homeScore ?? "",
//                   awayScore: selected.awayScore ?? "",
//                   reason: "",
//                 });
//                 setDialog({
//                   action: "finish",
//                   title: "Force Finish Match",
//                   message:
//                     "End this match immediately with the current (or updated) scores.",
//                   confirmLabel: "Finish Match",
//                   variant: "success",
//                 });
//               }}
//               className={!canFinish ? "opacity-40 cursor-not-allowed" : ""}
//             >
//               🏁 Force Finish
//             </Btn>

//             <Btn
//               variant="secondary"
//               disabled={!canEdit}
//               onClick={() => {
//                 setEditForm({
//                   homeTeam: selected.homeTeam,
//                   awayTeam: selected.awayTeam,
//                   sport: selected.sport,
//                 });
//                 setDialog({
//                   action: "edit",
//                   title: "Edit Match Details",
//                   message:
//                     "Only scheduled matches can be edited. Leave a field unchanged if you don't want to modify it.",
//                   confirmLabel: "Save Changes",
//                   variant: "secondary",
//                 });
//               }}
//               className={!canEdit ? "opacity-40 cursor-not-allowed" : ""}
//             >
//               ✏️ Edit
//             </Btn>

//             <Btn
//               variant="danger"
//               disabled={!canDelete}
//               onClick={() =>
//                 setDialog({
//                   action: "delete",
//                   title: "Delete Match",
//                   message: `Permanently delete "${selected.homeTeam} vs ${selected.awayTeam}" and all its commentary. This cannot be undone.`,
//                   confirmLabel: "Delete Permanently",
//                   variant: "danger",
//                 })
//               }
//               className={!canDelete ? "opacity-40 cursor-not-allowed" : ""}
//             >
//               🗑 Delete
//             </Btn>
//           </div>

//           {/* Status hints */}
//           <div className="rounded-xl border border-slate-800 p-3 space-y-1">
//             <p className="text-xs text-slate-600 font-semibold uppercase tracking-widest mb-2">
//               Action availability
//             </p>
//             {[
//               { label: "Suspend", ok: canSuspend, hint: "live or scheduled" },
//               { label: "Abandon", ok: canAbandon, hint: "live or suspended" },
//               {
//                 label: "Reschedule",
//                 ok: canReschedule,
//                 hint: "scheduled or suspended",
//               },
//               {
//                 label: "Force Finish",
//                 ok: canFinish,
//                 hint: "live or suspended",
//               },
//               { label: "Edit", ok: canEdit, hint: "scheduled only" },
//               {
//                 label: "Delete",
//                 ok: canDelete,
//                 hint: "scheduled, abandoned, or finished",
//               },
//             ].map(({ label, ok, hint }) => (
//               <div key={label} className="flex items-center gap-2 text-xs">
//                 <span className={ok ? "text-green-500" : "text-slate-700"}>
//                   {ok ? "✓" : "✗"}
//                 </span>
//                 <span className={ok ? "text-slate-300" : "text-slate-600"}>
//                   {label}
//                 </span>
//                 <span className="text-slate-700 ml-auto">{hint}</span>
//               </div>
//             ))}
//           </div>
//         </>
//       )}

//       {/* ── Dialogs ── */}
//       {/* Suspend dialog */}
//       <ConfirmDialog
//         open={dialog?.action === "suspend"}
//         title={dialog?.title}
//         message={dialog?.message}
//         confirmLabel={dialog?.confirmLabel}
//         confirmVariant="warning"
//         onCancel={closeDialog}
//         onConfirm={() => run("suspend")}
//       >
//         <Field label="Reason (shown to viewers)">
//           <Input
//             value={reasonInput}
//             onChange={(e) => setReasonInput(e.target.value)}
//             placeholder="e.g. Player injury on pitch"
//             autoFocus
//           />
//         </Field>
//       </ConfirmDialog>

//       {/* Abandon dialog */}
//       <ConfirmDialog
//         open={dialog?.action === "abandon"}
//         title={dialog?.title}
//         message={dialog?.message}
//         confirmLabel={dialog?.confirmLabel}
//         confirmVariant="danger"
//         onCancel={closeDialog}
//         onConfirm={() => run("abandon")}
//       >
//         <Field label="Reason (shown to viewers)">
//           <Input
//             value={reasonInput}
//             onChange={(e) => setReasonInput(e.target.value)}
//             placeholder="e.g. Severe weather, crowd incident"
//             autoFocus
//           />
//         </Field>
//       </ConfirmDialog>

//       {/* Reschedule dialog */}
//       <ConfirmDialog
//         open={dialog?.action === "reschedule"}
//         title={dialog?.title}
//         message={dialog?.message}
//         confirmLabel={dialog?.confirmLabel}
//         confirmVariant="secondary"
//         onCancel={closeDialog}
//         onConfirm={() => run("reschedule")}
//       >
//         <div className="space-y-3">
//           <div className="grid grid-cols-2 gap-3">
//             <Field label="New Start Time">
//               <Input
//                 type="datetime-local"
//                 value={rescheduleForm.startTime}
//                 onChange={(e) =>
//                   setRescheduleForm((f) => ({
//                     ...f,
//                     startTime: e.target.value,
//                   }))
//                 }
//                 required
//               />
//             </Field>
//             <Field label="New End Time">
//               <Input
//                 type="datetime-local"
//                 value={rescheduleForm.endTime}
//                 onChange={(e) =>
//                   setRescheduleForm((f) => ({ ...f, endTime: e.target.value }))
//                 }
//                 required
//               />
//             </Field>
//           </div>
//           <Field label="Reason (optional)">
//             <Input
//               value={rescheduleForm.reason}
//               onChange={(e) =>
//                 setRescheduleForm((f) => ({ ...f, reason: e.target.value }))
//               }
//               placeholder="e.g. Weather delay"
//             />
//           </Field>
//         </div>
//       </ConfirmDialog>

//       {/* Force Finish dialog */}
//       <ConfirmDialog
//         open={dialog?.action === "finish"}
//         title={dialog?.title}
//         message={dialog?.message}
//         confirmLabel={dialog?.confirmLabel}
//         confirmVariant="success"
//         onCancel={closeDialog}
//         onConfirm={() => run("finish")}
//       >
//         <div className="space-y-3">
//           <div className="grid grid-cols-2 gap-3">
//             <Field label={`${sport?.scoreLabel?.[0] ?? "Home"} Score`}>
//               <Input
//                 type="number"
//                 min={0}
//                 value={finishForm.homeScore}
//                 onChange={(e) =>
//                   setFinishForm((f) => ({ ...f, homeScore: e.target.value }))
//                 }
//               />
//             </Field>
//             <Field label={`${sport?.scoreLabel?.[1] ?? "Away"} Score`}>
//               <Input
//                 type="number"
//                 min={0}
//                 value={finishForm.awayScore}
//                 onChange={(e) =>
//                   setFinishForm((f) => ({ ...f, awayScore: e.target.value }))
//                 }
//               />
//             </Field>
//           </div>
//           <Field label="Reason (optional)">
//             <Input
//               value={finishForm.reason}
//               onChange={(e) =>
//                 setFinishForm((f) => ({ ...f, reason: e.target.value }))
//               }
//               placeholder="e.g. Match awarded due to forfeit"
//             />
//           </Field>
//         </div>
//       </ConfirmDialog>

//       {/* Edit dialog */}
//       <ConfirmDialog
//         open={dialog?.action === "edit"}
//         title={dialog?.title}
//         message={dialog?.message}
//         confirmLabel={dialog?.confirmLabel}
//         confirmVariant="secondary"
//         onCancel={closeDialog}
//         onConfirm={() => run("edit")}
//       >
//         <div className="space-y-3">
//           <Field label="Sport">
//             <Select
//               value={editForm.sport}
//               onChange={(e) =>
//                 setEditForm((f) => ({ ...f, sport: e.target.value }))
//               }
//             >
//               {ALL_SPORT_KEYS.map((k) => {
//                 const s = getSport(k);
//                 return (
//                   <option key={k} value={k}>
//                     {s.emoji} {s.label}
//                   </option>
//                 );
//               })}
//             </Select>
//           </Field>
//           <div className="grid grid-cols-2 gap-3">
//             <Field label="Home Team">
//               <Input
//                 value={editForm.homeTeam}
//                 onChange={(e) =>
//                   setEditForm((f) => ({ ...f, homeTeam: e.target.value }))
//                 }
//               />
//             </Field>
//             <Field label="Away Team">
//               <Input
//                 value={editForm.awayTeam}
//                 onChange={(e) =>
//                   setEditForm((f) => ({ ...f, awayTeam: e.target.value }))
//                 }
//               />
//             </Field>
//           </div>
//         </div>
//       </ConfirmDialog>

//       {/* Delete dialog */}
//       <ConfirmDialog
//         open={dialog?.action === "delete"}
//         title={dialog?.title}
//         message={dialog?.message}
//         confirmLabel={dialog?.confirmLabel}
//         confirmVariant="danger"
//         onCancel={closeDialog}
//         onConfirm={() => run("delete")}
//       />
//     </div>
//   );
// }

// // ── All Matches list ───────────────────────────────────────────────────────
// function MatchesPanel({ matchList, loading }) {
//   if (loading)
//     return (
//       <div className="flex items-center gap-3 py-8 justify-center text-slate-500">
//         <Spinner /> Loading…
//       </div>
//     );
//   if (matchList.length === 0)
//     return (
//       <p className="text-slate-600 text-sm text-center py-8">
//         No matches yet. Create one →
//       </p>
//     );

//   return (
//     <div className="space-y-2">
//       {matchList.map((m) => {
//         const s = getSport(m.sport);
//         const dest =
//           m.status === "finished" || m.status === "abandoned"
//             ? `/results/${m.id}`
//             : `/room/${m.id}`;
//         return (
//           <div
//             key={m.id}
//             className="flex items-center gap-3 p-3 rounded-xl bg-slate-800/60 border border-slate-700"
//           >
//             <span className="text-xl">{s.emoji}</span>
//             <div className="flex-1 min-w-0">
//               <p className="text-sm font-semibold text-white truncate">
//                 {m.homeTeam} <span className="text-slate-500">vs</span>{" "}
//                 {m.awayTeam}
//               </p>
//               <p className="text-xs text-slate-500">
//                 {s.label} · ID #{m.id}
//                 {m.reason && (
//                   <span className="ml-2 text-amber-700/80 truncate">
//                     · {m.reason}
//                   </span>
//                 )}
//               </p>
//             </div>
//             <div className="flex items-center gap-3">
//               <span className="text-white font-bold tabular-nums text-sm">
//                 {m.homeScore ?? 0} — {m.awayScore ?? 0}
//               </span>
//               <StatusBadge status={m.status} />
//             </div>
//             <a
//               href={dest}
//               className="text-xs text-slate-500 hover:text-white transition-colors flex-shrink-0"
//             >
//               View →
//             </a>
//           </div>
//         );
//       })}
//     </div>
//   );
// }

// // ── Main Dashboard ─────────────────────────────────────────────────────────
// export default function AdminDashboard() {
//   const navigate = useNavigate();
//   const isAdmin = useAppStore((s) => s.isAdmin);
//   const logout = useAppStore((s) => s.logout);
//   const wsStatus = useWSStore((s) => s.wsStatus);
//   const matchList = useWSStore((s) => s.matchList);
//   const setMatchList = useWSStore((s) => s.setMatchList);
//   const upsertMatch = useWSStore((s) => s.upsertMatch);
//   const removeMatch = useWSStore((s) => s.removeMatch);

//   const [tab, setTab] = useState("create");
//   const [toasts, setToasts] = useState([]);
//   const [matchLoading, setMatchLoading] = useState(true);

//   useEffect(() => {
//     if (!isAdmin) {
//       navigate("/admin");
//       return;
//     }
//     api
//       .getMatches(100)
//       .then((data) => setMatchList(data))
//       .finally(() => setMatchLoading(false));
//   }, [isAdmin, navigate, setMatchList]);

//   const toast = (type, message) => {
//     const id = Date.now();
//     setToasts((t) => [...t, { id, type, message }]);
//     setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3500);
//   };

//   const handleMatchChanged = (result) => {
//     if (result?.deleted) {
//       removeMatch(result.matchId);
//     } else if (result) {
//       upsertMatch(result);
//     }
//   };

//   const liveMatches = matchList.filter((m) => m.status === "live");

//   if (!isAdmin) return null;

//   const TABS = [
//     { id: "create", label: "➕ New Match" },
//     { id: "score", label: "⚡ Score" },
//     { id: "commentary", label: "🎙️ Commentary" },
//     { id: "manage", label: "🚨 Manage" },
//     { id: "matches", label: "📋 All Matches" },
//   ];

//   // Stats including new statuses
//   const stats = [
//     {
//       label: "Live",
//       count: matchList.filter((m) => m.status === "live").length,
//       color: "text-red-400",
//     },
//     {
//       label: "Scheduled",
//       count: matchList.filter((m) => m.status === "scheduled").length,
//       color: "text-blue-400",
//     },
//     {
//       label: "Suspended",
//       count: matchList.filter((m) => m.status === "suspended").length,
//       color: "text-amber-400",
//     },
//     {
//       label: "Abandoned",
//       count: matchList.filter((m) => m.status === "abandoned").length,
//       color: "text-rose-400",
//     },
//     {
//       label: "Finished",
//       count: matchList.filter((m) => m.status === "finished").length,
//       color: "text-slate-400",
//     },
//   ];

//   return (
//     <div className="min-h-screen bg-slate-950 text-white">
//       <Toast toasts={toasts} />

//       <header className="sticky top-0 z-30 border-b border-slate-800/80 backdrop-blur-xl bg-slate-950/90">
//         <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
//           <div className="flex items-center gap-3">
//             <span className="font-black tracking-tight text-lg">
//               <span className="text-white">ARENA</span>
//               <span className="text-red-500">LIVE</span>
//             </span>
//             <span className="text-xs bg-red-600/20 text-red-400 border border-red-600/30 px-2 py-0.5 rounded font-semibold">
//               ADMIN
//             </span>
//           </div>
//           <div className="flex items-center gap-3">
//             <WSStatusBadge status={wsStatus} />
//             <a
//               href="/"
//               className="text-xs text-slate-500 hover:text-slate-300 transition-colors"
//             >
//               View Site
//             </a>
//             <button
//               onClick={() => {
//                 logout();
//                 navigate("/admin");
//               }}
//               className="text-xs text-red-500 hover:text-red-400 transition-colors font-semibold"
//             >
//               Sign Out
//             </button>
//           </div>
//         </div>
//       </header>

//       <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
//         {/* Stats bar */}
//         <div className="grid grid-cols-5 gap-2 mb-8">
//           {stats.map(({ label, count, color }) => (
//             <div
//               key={label}
//               className="rounded-xl bg-slate-900 border border-slate-800 p-3 text-center"
//             >
//               <p className={`text-2xl font-black ${color}`}>{count}</p>
//               <p className="text-xs text-slate-500 uppercase tracking-widest mt-1">
//                 {label}
//               </p>
//             </div>
//           ))}
//         </div>

//         {/* Tab bar */}
//         <div className="flex gap-1 p-1 rounded-xl bg-slate-900 mb-6 flex-wrap">
//           {TABS.map((t) => (
//             <button
//               key={t.id}
//               onClick={() => setTab(t.id)}
//               className={`flex-1 px-3 py-2 rounded-lg text-sm font-semibold transition-all ${tab === t.id ? "bg-slate-700 text-white shadow" : "text-slate-500 hover:text-slate-300"} ${t.id === "manage" && tab !== "manage" ? "text-amber-500/70 hover:text-amber-400" : ""}`}
//             >
//               {t.label}
//             </button>
//           ))}
//         </div>

//         {/* Panel */}
//         <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6">
//           {tab === "create" && (
//             <>
//               <h2 className="text-base font-bold text-white mb-5">
//                 Create New Match
//               </h2>
//               <CreateMatchPanel
//                 toast={toast}
//                 onCreated={(m) => upsertMatch(m)}
//               />
//             </>
//           )}
//           {tab === "score" && (
//             <>
//               <h2 className="text-base font-bold text-white mb-5">
//                 Update Live Score
//               </h2>
//               <ScorePanel liveMatches={liveMatches} toast={toast} />
//             </>
//           )}
//           {tab === "commentary" && (
//             <>
//               <h2 className="text-base font-bold text-white mb-5">
//                 Post Commentary
//               </h2>
//               <CommentaryPanel allMatches={matchList} toast={toast} />
//             </>
//           )}
//           {tab === "manage" && (
//             <>
//               <h2 className="text-base font-bold text-white mb-1">
//                 Manage Matches
//               </h2>
//               <p className="text-xs text-slate-500 mb-5">
//                 Suspend, abandon, reschedule, force-finish, edit, or delete
//                 matches
//               </p>
//               <ManagePanel
//                 allMatches={matchList}
//                 toast={toast}
//                 onMatchChanged={handleMatchChanged}
//               />
//             </>
//           )}
//           {tab === "matches" && (
//             <>
//               <h2 className="text-base font-bold text-white mb-5">
//                 All Matches
//               </h2>
//               <MatchesPanel matchList={matchList} loading={matchLoading} />
//             </>
//           )}
//         </div>
//       </main>
//     </div>
//   );
// }














import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useWSStore } from "../store/wsStore.js";
import { useAppStore } from "../store/appStore.js";
import { api } from "../utils/api.js";
import { WSStatusBadge, StatusBadge, SportBadge, Spinner, ConfirmDialog, useToast, ToastContainer } from "../components/UI.jsx";
import { getSport, ALL_SPORT_KEYS } from "../config/sports.js";

// ── Form primitives ────────────────────────────────────────────────────────
function Field({ label, hint, children }) {
  return (
    <div>
      <label className="block text-xs text-slate-500 uppercase tracking-widest mb-1.5">{label}</label>
      {children}
      {hint && <p className="text-xs text-slate-600 mt-1">{hint}</p>}
    </div>
  );
}
function Input({ className = "", ...props }) {
  return <input {...props} className={`w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-600 focus:outline-none focus:border-red-500/70 transition-colors text-sm ${className}`} />;
}
function Textarea({ className = "", ...props }) {
  return <textarea {...props} className={`w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-600 focus:outline-none focus:border-red-500/70 transition-colors text-sm resize-none ${className}`} />;
}
function Select({ className = "", children, ...props }) {
  return <select {...props} className={`w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-red-500/70 transition-colors text-sm ${className}`}>{children}</select>;
}
function Btn({ children, loading, variant = "primary", className = "", ...props }) {
  const v = { primary:"bg-red-600 hover:bg-red-500", secondary:"bg-slate-700 hover:bg-slate-600", success:"bg-emerald-600 hover:bg-emerald-500", warning:"bg-amber-600 hover:bg-amber-500", danger:"bg-red-800 hover:bg-red-700" };
  return (
    <button {...props} disabled={loading || props.disabled}
      className={`px-4 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 justify-center disabled:opacity-50 text-white ${v[variant]} ${className}`}>
      {loading && <Spinner size={4} />}{children}
    </button>
  );
}

// ── Create Match ───────────────────────────────────────────────────────────
function CreateMatchPanel({ onCreated, toast }) {
  const [form, setForm] = useState({ sport:"football", homeTeam:"", awayTeam:"", startTime:"", endTime:"" });
  const [loading, setLoading] = useState(false);
  const sport = getSport(form.sport);
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const match = await api.createMatch({ ...form, startTime: new Date(form.startTime).toISOString(), endTime: new Date(form.endTime).toISOString() });
      toast("success", `${sport.emoji} Match created!`);
      setForm({ sport: form.sport, homeTeam:"", awayTeam:"", startTime:"", endTime:"" });
      onCreated?.(match);
    } catch (err) { toast("error", err.message); }
    finally { setLoading(false); }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Field label="Sport">
        <Select value={form.sport} onChange={(e) => set("sport", e.target.value)}>
          {ALL_SPORT_KEYS.map((k) => { const s = getSport(k); return <option key={k} value={k}>{s.emoji} {s.label}</option>; })}
        </Select>
      </Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label={sport.scoreLabel[0]}><Input placeholder="Home team" value={form.homeTeam} onChange={(e) => set("homeTeam", e.target.value)} required /></Field>
        <Field label={sport.scoreLabel[1]}><Input placeholder="Away team" value={form.awayTeam} onChange={(e) => set("awayTeam", e.target.value)} required /></Field>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Start Time"><Input type="datetime-local" value={form.startTime} onChange={(e) => set("startTime", e.target.value)} required /></Field>
        <Field label="End Time"><Input type="datetime-local" value={form.endTime} onChange={(e) => set("endTime", e.target.value)} required /></Field>
      </div>
      <Btn type="submit" loading={loading} className="w-full">Create Match</Btn>
    </form>
  );
}

// ── Score Update ───────────────────────────────────────────────────────────
function ScorePanel({ liveMatches, toast }) {
  const [matchId, setMatchId] = useState("");
  const [home, setHome] = useState(0);
  const [away, setAway] = useState(0);
  const [loading, setLoading] = useState(false);
  const selected = liveMatches.find((m) => m.id === Number(matchId));
  const sport = selected ? getSport(selected.sport) : null;

  useEffect(() => {
    if (selected) { setHome(selected.homeScore ?? 0); setAway(selected.awayScore ?? 0); }
  }, [matchId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!matchId) return;
    setLoading(true);
    try {
      await api.updateScore(Number(matchId), { homeScore: Number(home), awayScore: Number(away) });
      toast("success", "Score updated!");
    } catch (err) { toast("error", err.message); }
    finally { setLoading(false); }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Field label="Live Match">
        <Select value={matchId} onChange={(e) => setMatchId(e.target.value)} required>
          <option value="">Select a live match…</option>
          {liveMatches.map((m) => { const s = getSport(m.sport); return <option key={m.id} value={m.id}>{s.emoji} {m.homeTeam} vs {m.awayTeam}</option>; })}
        </Select>
        {liveMatches.length === 0 && <p className="text-xs text-slate-600 mt-1">No live matches available</p>}
      </Field>
      {selected && sport && (
        <>
          <div className="rounded-xl bg-slate-800/60 border border-slate-700 p-4">
            <div className="flex items-center justify-between mb-3">
              <SportBadge sport={selected.sport} config={sport} /><StatusBadge status={selected.status} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Field label={`${sport.scoreLabel[0]} (${selected.homeTeam})`}><Input type="number" min={0} value={home} onChange={(e) => setHome(e.target.value)} required /></Field>
              <Field label={`${sport.scoreLabel[1]} (${selected.awayTeam})`}><Input type="number" min={0} value={away} onChange={(e) => setAway(e.target.value)} required /></Field>
            </div>
          </div>
          <Btn type="submit" loading={loading} variant="success" className="w-full">Push Score Update</Btn>
        </>
      )}
    </form>
  );
}

// ── Commentary ─────────────────────────────────────────────────────────────
function CommentaryPanel({ allMatches, toast }) {
  const active = allMatches.filter((m) => m.status === "live" || m.status === "scheduled");
  const [matchId, setMatchId] = useState("");
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ eventType:"commentary", minute:"", period:"", actor:"", team:"", message:"", tags:"" });
  const selected = allMatches.find((m) => m.id === Number(matchId));
  const sport = selected ? getSport(selected.sport) : null;
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  useEffect(() => {
    if (sport) { set("eventType", "commentary"); set("period", sport.defaultPeriod); }
  }, [matchId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!matchId) return;
    setLoading(true);
    try {
      await api.postCommentary(Number(matchId), {
        sport: selected.sport,
        eventType: form.eventType || undefined,
        minute: form.minute !== "" ? Number(form.minute) : undefined,
        period: form.period || undefined,
        actor: form.actor || undefined,
        team: form.team || undefined,
        message: form.message,
        tags: form.tags ? form.tags.split(",").map((t) => t.trim()).filter(Boolean) : undefined,
      });
      toast("success", "Commentary posted!");
      set("message", ""); set("actor", ""); set("minute", "");
    } catch (err) { toast("error", err.message); }
    finally { setLoading(false); }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Field label="Match">
        <Select value={matchId} onChange={(e) => setMatchId(e.target.value)} required>
          <option value="">Select match…</option>
          {active.map((m) => { const s = getSport(m.sport); return <option key={m.id} value={m.id}>{s.emoji} {m.homeTeam} vs {m.awayTeam} [{m.status}]</option>; })}
        </Select>
      </Field>
      {selected && sport && (
        <>
          <Field label="Event Type">
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-1.5">
              {sport.eventTypes.map((ev) => (
                <button key={ev.value} type="button" onClick={() => set("eventType", ev.value)}
                  className="flex flex-col items-center gap-1 p-2 rounded-lg border text-xs font-semibold transition-all"
                  style={form.eventType === ev.value ? { background:ev.color+"30", borderColor:ev.color, color:ev.color } : { background:"#1e293b", borderColor:"#334155", color:"#64748b" }}>
                  <span className="text-lg">{ev.icon}</span>
                  <span className="leading-tight text-center">{ev.label}</span>
                </button>
              ))}
            </div>
          </Field>
          <div className="grid grid-cols-3 gap-3">
            <Field label={`${sport.minuteLabel} #`}><Input type="number" min={0} max={sport.maxMinute} placeholder="e.g. 67" value={form.minute} onChange={(e) => set("minute", e.target.value)} /></Field>
            <Field label="Period"><Select value={form.period} onChange={(e) => set("period", e.target.value)}>{sport.periods.map((p) => <option key={p} value={p}>{p}</option>)}</Select></Field>
            <Field label="Team"><Select value={form.team} onChange={(e) => set("team", e.target.value)}><option value="">— None —</option><option value={selected.homeTeam}>{selected.homeTeam}</option><option value={selected.awayTeam}>{selected.awayTeam}</option></Select></Field>
          </div>
          <Field label="Player / Actor"><Input placeholder="e.g. Saka, Kohli…" value={form.actor} onChange={(e) => set("actor", e.target.value)} /></Field>
          <Field label="Commentary Message" hint="Shown live to viewers">
            <Textarea rows={3} placeholder="Describe what happened…" value={form.message} onChange={(e) => set("message", e.target.value)} required />
          </Field>
          <Field label="Tags" hint="Comma-separated"><Input placeholder="goal, saka, arsenal" value={form.tags} onChange={(e) => set("tags", e.target.value)} /></Field>
          <Btn type="submit" loading={loading} variant="warning" className="w-full">Post to Live Feed ⚡</Btn>
        </>
      )}
    </form>
  );
}

// ── Manage Panel — casualty controls per match ─────────────────────────────
function ManagePanel({ allMatches, toast, onMatchChanged }) {
  const [matchId, setMatchId]       = useState("");
  const [dialog, setDialog]         = useState(null); // { action, title, message, confirmLabel, variant }
  const [reasonInput, setReasonInput] = useState("");
  const [rescheduleForm, setRescheduleForm] = useState({ startTime:"", endTime:"", reason:"" });
  const [editForm, setEditForm]     = useState({ homeTeam:"", awayTeam:"", sport:"" });
  const [finishForm, setFinishForm] = useState({ homeScore:"", awayScore:"", reason:"" });
  const [loading, setLoading]       = useState(false);

  const selected = allMatches.find((m) => m.id === Number(matchId));
  const sport    = selected ? getSport(selected.sport) : null;

  const closeDialog = () => { setDialog(null); setReasonInput(""); };

  const canSuspend    = selected && ["live","scheduled"].includes(selected.status);
  const canAbandon    = selected && ["live","suspended"].includes(selected.status);
  const canReschedule = selected && ["scheduled","suspended"].includes(selected.status);
  const canFinish     = selected && ["live","suspended"].includes(selected.status);
  const canEdit       = selected && selected.status === "scheduled";
  const canDelete     = selected && ["scheduled","abandoned","finished"].includes(selected.status);

  const run = async (action) => {
    setLoading(true);
    try {
      let updated;
      if (action === "suspend") {
        updated = await api.suspendMatch(Number(matchId), reasonInput);
        toast("success", "Match suspended.");
      } else if (action === "abandon") {
        updated = await api.abandonMatch(Number(matchId), reasonInput);
        toast("success", "Match abandoned.");
      } else if (action === "reschedule") {
        updated = await api.rescheduleMatch(Number(matchId), {
          startTime: new Date(rescheduleForm.startTime).toISOString(),
          endTime:   new Date(rescheduleForm.endTime).toISOString(),
          reason:    rescheduleForm.reason || undefined,
        });
        toast("success", "Match rescheduled.");
      } else if (action === "finish") {
        updated = await api.forceFinish(Number(matchId), {
          homeScore: finishForm.homeScore !== "" ? Number(finishForm.homeScore) : undefined,
          awayScore: finishForm.awayScore !== "" ? Number(finishForm.awayScore) : undefined,
          reason:    finishForm.reason || undefined,
        });
        toast("success", "Match force-finished.");
      } else if (action === "edit") {
        const body = {};
        if (editForm.homeTeam) body.homeTeam = editForm.homeTeam;
        if (editForm.awayTeam) body.awayTeam = editForm.awayTeam;
        if (editForm.sport)    body.sport    = editForm.sport;
        updated = await api.editMatch(Number(matchId), body);
        toast("success", "Match updated.");
      } else if (action === "delete") {
        await api.deleteMatch(Number(matchId));
        toast("success", "Match deleted.");
        setMatchId("");
        onMatchChanged?.({ matchId: Number(matchId), deleted: true });
        closeDialog();
        setLoading(false);
        return;
      }
      onMatchChanged?.(updated);
      closeDialog();
    } catch (err) {
      toast("error", err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-5">
      {/* Match selector */}
      <Field label="Select Match">
        <Select value={matchId} onChange={(e) => { setMatchId(e.target.value); }}>
          <option value="">Choose a match to manage…</option>
          {allMatches.map((m) => {
            const s = getSport(m.sport);
            return <option key={m.id} value={m.id}>{s.emoji} {m.homeTeam} vs {m.awayTeam} [{m.status}]</option>;
          })}
        </Select>
      </Field>

      {selected && sport && (
        <>
          {/* Match info card */}
          <div className="rounded-xl bg-slate-800/60 border border-slate-700 p-4">
            <div className="flex items-center justify-between mb-3">
              <SportBadge sport={selected.sport} config={sport} />
              <StatusBadge status={selected.status} />
            </div>
            <p className="text-white font-bold">{selected.homeTeam} <span className="text-slate-500 font-normal">vs</span> {selected.awayTeam}</p>
            <p className="text-slate-500 text-xs mt-1">
              Score: {selected.homeScore ?? 0} — {selected.awayScore ?? 0}
              {selected.reason && <span className="ml-3 text-amber-600/80">Reason: {selected.reason}</span>}
            </p>
          </div>

          {/* Action buttons grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            <Btn
              variant="warning"
              disabled={!canSuspend}
              onClick={() => { setReasonInput(""); setDialog({ action:"suspend", title:"Suspend Match", message:"Provide a reason for the suspension. This will be shown to viewers watching the game.", confirmLabel:"Suspend Match", variant:"warning" }); }}
              className={!canSuspend ? "opacity-40 cursor-not-allowed" : ""}
            >
              ⏸ Suspend
            </Btn>

            <Btn
              variant="danger"
              disabled={!canAbandon}
              onClick={() => { setReasonInput(""); setDialog({ action:"abandon", title:"Abandon Match", message:"This permanently halts the match. No winner will be declared. This cannot be undone.", confirmLabel:"Abandon Match", variant:"danger" }); }}
              className={!canAbandon ? "opacity-40 cursor-not-allowed" : ""}
            >
              ✕ Abandon
            </Btn>

            <Btn
              variant="secondary"
              disabled={!canReschedule}
              onClick={() => { setRescheduleForm({ startTime:"", endTime:"", reason:"" }); setDialog({ action:"reschedule", title:"Reschedule Match", message:"Set a new time window for this match.", confirmLabel:"Reschedule", variant:"secondary" }); }}
              className={!canReschedule ? "opacity-40 cursor-not-allowed" : ""}
            >
              📅 Reschedule
            </Btn>

            <Btn
              variant="success"
              disabled={!canFinish}
              onClick={() => { setFinishForm({ homeScore: selected.homeScore ?? "", awayScore: selected.awayScore ?? "", reason:"" }); setDialog({ action:"finish", title:"Force Finish Match", message:"End this match immediately with the current (or updated) scores.", confirmLabel:"Finish Match", variant:"success" }); }}
              className={!canFinish ? "opacity-40 cursor-not-allowed" : ""}
            >
              🏁 Force Finish
            </Btn>

            <Btn
              variant="secondary"
              disabled={!canEdit}
              onClick={() => { setEditForm({ homeTeam: selected.homeTeam, awayTeam: selected.awayTeam, sport: selected.sport }); setDialog({ action:"edit", title:"Edit Match Details", message:"Only scheduled matches can be edited. Leave a field unchanged if you don't want to modify it.", confirmLabel:"Save Changes", variant:"secondary" }); }}
              className={!canEdit ? "opacity-40 cursor-not-allowed" : ""}
            >
              ✏️ Edit
            </Btn>

            <Btn
              variant="danger"
              disabled={!canDelete}
              onClick={() => setDialog({ action:"delete", title:"Delete Match", message:`Permanently delete "${selected.homeTeam} vs ${selected.awayTeam}" and all its commentary. This cannot be undone.`, confirmLabel:"Delete Permanently", variant:"danger" })}
              className={!canDelete ? "opacity-40 cursor-not-allowed" : ""}
            >
              🗑 Delete
            </Btn>
          </div>

          {/* Status hints */}
          <div className="rounded-xl border border-slate-800 p-3 space-y-1">
            <p className="text-xs text-slate-600 font-semibold uppercase tracking-widest mb-2">Action availability</p>
            {[
              { label:"Suspend",     ok: canSuspend,    hint:"live or scheduled" },
              { label:"Abandon",     ok: canAbandon,    hint:"live or suspended" },
              { label:"Reschedule",  ok: canReschedule, hint:"scheduled or suspended" },
              { label:"Force Finish",ok: canFinish,     hint:"live or suspended" },
              { label:"Edit",        ok: canEdit,       hint:"scheduled only" },
              { label:"Delete",      ok: canDelete,     hint:"scheduled, abandoned, or finished" },
            ].map(({ label, ok, hint }) => (
              <div key={label} className="flex items-center gap-2 text-xs">
                <span className={ok ? "text-green-500" : "text-slate-700"}>
                  {ok ? "✓" : "✗"}
                </span>
                <span className={ok ? "text-slate-300" : "text-slate-600"}>{label}</span>
                <span className="text-slate-700 ml-auto">{hint}</span>
              </div>
            ))}
          </div>
        </>
      )}

      {/* ── Dialogs ── */}
      {/* Suspend dialog */}
      <ConfirmDialog
        open={dialog?.action === "suspend"}
        title={dialog?.title}
        message={dialog?.message}
        confirmLabel={dialog?.confirmLabel}
        confirmVariant="warning"
        onCancel={closeDialog}
        onConfirm={() => run("suspend")}
      >
        <Field label="Reason (shown to viewers)">
          <Input value={reasonInput} onChange={(e) => setReasonInput(e.target.value)} placeholder="e.g. Player injury on pitch" autoFocus />
        </Field>
      </ConfirmDialog>

      {/* Abandon dialog */}
      <ConfirmDialog
        open={dialog?.action === "abandon"}
        title={dialog?.title}
        message={dialog?.message}
        confirmLabel={dialog?.confirmLabel}
        confirmVariant="danger"
        onCancel={closeDialog}
        onConfirm={() => run("abandon")}
      >
        <Field label="Reason (shown to viewers)">
          <Input value={reasonInput} onChange={(e) => setReasonInput(e.target.value)} placeholder="e.g. Severe weather, crowd incident" autoFocus />
        </Field>
      </ConfirmDialog>

      {/* Reschedule dialog */}
      <ConfirmDialog
        open={dialog?.action === "reschedule"}
        title={dialog?.title}
        message={dialog?.message}
        confirmLabel={dialog?.confirmLabel}
        confirmVariant="secondary"
        onCancel={closeDialog}
        onConfirm={() => run("reschedule")}
      >
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <Field label="New Start Time"><Input type="datetime-local" value={rescheduleForm.startTime} onChange={(e) => setRescheduleForm((f) => ({ ...f, startTime: e.target.value }))} required /></Field>
            <Field label="New End Time"><Input type="datetime-local" value={rescheduleForm.endTime} onChange={(e) => setRescheduleForm((f) => ({ ...f, endTime: e.target.value }))} required /></Field>
          </div>
          <Field label="Reason (optional)">
            <Input value={rescheduleForm.reason} onChange={(e) => setRescheduleForm((f) => ({ ...f, reason: e.target.value }))} placeholder="e.g. Weather delay" />
          </Field>
        </div>
      </ConfirmDialog>

      {/* Force Finish dialog */}
      <ConfirmDialog
        open={dialog?.action === "finish"}
        title={dialog?.title}
        message={dialog?.message}
        confirmLabel={dialog?.confirmLabel}
        confirmVariant="success"
        onCancel={closeDialog}
        onConfirm={() => run("finish")}
      >
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <Field label={`${sport?.scoreLabel?.[0] ?? "Home"} Score`}><Input type="number" min={0} value={finishForm.homeScore} onChange={(e) => setFinishForm((f) => ({ ...f, homeScore: e.target.value }))} /></Field>
            <Field label={`${sport?.scoreLabel?.[1] ?? "Away"} Score`}><Input type="number" min={0} value={finishForm.awayScore} onChange={(e) => setFinishForm((f) => ({ ...f, awayScore: e.target.value }))} /></Field>
          </div>
          <Field label="Reason (optional)">
            <Input value={finishForm.reason} onChange={(e) => setFinishForm((f) => ({ ...f, reason: e.target.value }))} placeholder="e.g. Match awarded due to forfeit" />
          </Field>
        </div>
      </ConfirmDialog>

      {/* Edit dialog */}
      <ConfirmDialog
        open={dialog?.action === "edit"}
        title={dialog?.title}
        message={dialog?.message}
        confirmLabel={dialog?.confirmLabel}
        confirmVariant="secondary"
        onCancel={closeDialog}
        onConfirm={() => run("edit")}
      >
        <div className="space-y-3">
          <Field label="Sport">
            <Select value={editForm.sport} onChange={(e) => setEditForm((f) => ({ ...f, sport: e.target.value }))}>
              {ALL_SPORT_KEYS.map((k) => { const s = getSport(k); return <option key={k} value={k}>{s.emoji} {s.label}</option>; })}
            </Select>
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Home Team"><Input value={editForm.homeTeam} onChange={(e) => setEditForm((f) => ({ ...f, homeTeam: e.target.value }))} /></Field>
            <Field label="Away Team"><Input value={editForm.awayTeam} onChange={(e) => setEditForm((f) => ({ ...f, awayTeam: e.target.value }))} /></Field>
          </div>
        </div>
      </ConfirmDialog>

      {/* Delete dialog */}
      <ConfirmDialog
        open={dialog?.action === "delete"}
        title={dialog?.title}
        message={dialog?.message}
        confirmLabel={dialog?.confirmLabel}
        confirmVariant="danger"
        onCancel={closeDialog}
        onConfirm={() => run("delete")}
      />
    </div>
  );
}

// ── All Matches list ───────────────────────────────────────────────────────
function MatchesPanel({ matchList, loading }) {
  if (loading) return <div className="flex items-center gap-3 py-8 justify-center text-slate-500"><Spinner /> Loading…</div>;
  if (matchList.length === 0) return <p className="text-slate-600 text-sm text-center py-8">No matches yet. Create one →</p>;

  return (
    <div className="space-y-2">
      {matchList.map((m) => {
        const s = getSport(m.sport);
        const dest = m.status === "finished" || m.status === "abandoned" ? `/results/${m.id}` : `/room/${m.id}`;
        return (
          <div key={m.id} className="flex items-center gap-3 p-3 rounded-xl bg-slate-800/60 border border-slate-700">
            <span className="text-xl">{s.emoji}</span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate">{m.homeTeam} <span className="text-slate-500">vs</span> {m.awayTeam}</p>
              <p className="text-xs text-slate-500">
                {s.label} · ID #{m.id}
                {m.reason && <span className="ml-2 text-amber-700/80 truncate">· {m.reason}</span>}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-white font-bold tabular-nums text-sm">{m.homeScore ?? 0} — {m.awayScore ?? 0}</span>
              <StatusBadge status={m.status} />
            </div>
            <a href={dest} className="text-xs text-slate-500 hover:text-white transition-colors flex-shrink-0">View →</a>
          </div>
        );
      })}
    </div>
  );
}

// ── Main Dashboard ─────────────────────────────────────────────────────────
export default function AdminDashboard() {
  const navigate     = useNavigate();
  const isAdmin      = useAppStore((s) => s.isAdmin);
  const logout       = useAppStore((s) => s.logout);
  const wsStatus     = useWSStore((s) => s.wsStatus);
  const matchList    = useWSStore((s) => s.matchList);
  const setMatchList = useWSStore((s) => s.setMatchList);
  const upsertMatch  = useWSStore((s) => s.upsertMatch);
  const removeMatch  = useWSStore((s) => s.removeMatch);

  const [tab, setTab]               = useState("create");
  const { toasts, toast, dismiss } = useToast();
  const [matchLoading, setMatchLoading] = useState(true);

  useEffect(() => {
    if (!isAdmin) { navigate("/admin"); return; }
    api.getMatches(100)
      .then((data) => setMatchList(data))
      .finally(() => setMatchLoading(false));
  }, [isAdmin, navigate, setMatchList]);

  const handleMatchChanged = (result) => {
    if (result?.deleted) {
      removeMatch(result.matchId);
    } else if (result) {
      upsertMatch(result);
    }
  };

  const liveMatches = matchList.filter((m) => m.status === "live");

  if (!isAdmin) return null;

  const TABS = [
    { id:"create",     label:"➕ New Match" },
    { id:"score",      label:"⚡ Score" },
    { id:"commentary", label:"🎙️ Commentary" },
    { id:"manage",     label:"🚨 Manage" },
    { id:"matches",    label:"📋 All Matches" },
  ];

  // Stats including new statuses
  const stats = [
    { label:"Live",      count: matchList.filter((m) => m.status === "live").length,      color:"text-red-400" },
    { label:"Scheduled", count: matchList.filter((m) => m.status === "scheduled").length,  color:"text-blue-400" },
    { label:"Suspended", count: matchList.filter((m) => m.status === "suspended").length,  color:"text-amber-400" },
    { label:"Abandoned", count: matchList.filter((m) => m.status === "abandoned").length,  color:"text-rose-400" },
    { label:"Finished",  count: matchList.filter((m) => m.status === "finished").length,   color:"text-slate-400" },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <ToastContainer toasts={toasts} onDismiss={dismiss} />

      <header className="sticky top-0 z-30 border-b border-slate-800/80 backdrop-blur-xl bg-slate-950/90">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="font-black tracking-tight text-lg"><span className="text-white">ARENA</span><span className="text-red-500">LIVE</span></span>
            <span className="text-xs bg-red-600/20 text-red-400 border border-red-600/30 px-2 py-0.5 rounded font-semibold">ADMIN</span>
          </div>
          <div className="flex items-center gap-3">
            <WSStatusBadge status={wsStatus} />
            <a href="/" className="text-xs text-slate-500 hover:text-slate-300 transition-colors">View Site</a>
            <button onClick={() => { logout(); navigate("/admin"); }} className="text-xs text-red-500 hover:text-red-400 transition-colors font-semibold">Sign Out</button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        {/* Stats bar */}
        <div className="grid grid-cols-5 gap-2 mb-8">
          {stats.map(({ label, count, color }) => (
            <div key={label} className="rounded-xl bg-slate-900 border border-slate-800 p-3 text-center">
              <p className={`text-2xl font-black ${color}`}>{count}</p>
              <p className="text-xs text-slate-500 uppercase tracking-widest mt-1">{label}</p>
            </div>
          ))}
        </div>

        {/* Tab bar */}
        <div className="flex gap-1 p-1 rounded-xl bg-slate-900 mb-6 flex-wrap">
          {TABS.map((t) => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`flex-1 px-3 py-2 rounded-lg text-sm font-semibold transition-all ${tab === t.id ? "bg-slate-700 text-white shadow" : "text-slate-500 hover:text-slate-300"} ${t.id === "manage" && tab !== "manage" ? "text-amber-500/70 hover:text-amber-400" : ""}`}>
              {t.label}
            </button>
          ))}
        </div>

        {/* Panel */}
        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6">
          {tab === "create" && (
            <><h2 className="text-base font-bold text-white mb-5">Create New Match</h2>
              <CreateMatchPanel toast={toast} onCreated={(m) => upsertMatch(m)} /></>
          )}
          {tab === "score" && (
            <><h2 className="text-base font-bold text-white mb-5">Update Live Score</h2>
              <ScorePanel liveMatches={liveMatches} toast={toast} /></>
          )}
          {tab === "commentary" && (
            <><h2 className="text-base font-bold text-white mb-5">Post Commentary</h2>
              <CommentaryPanel allMatches={matchList} toast={toast} /></>
          )}
          {tab === "manage" && (
            <><h2 className="text-base font-bold text-white mb-1">Manage Matches</h2>
              <p className="text-xs text-slate-500 mb-5">Suspend, abandon, reschedule, force-finish, edit, or delete matches</p>
              <ManagePanel allMatches={matchList} toast={toast} onMatchChanged={handleMatchChanged} /></>
          )}
          {tab === "matches" && (
            <><h2 className="text-base font-bold text-white mb-5">All Matches</h2>
              <MatchesPanel matchList={matchList} loading={matchLoading} /></>
          )}
        </div>
      </main>
    </div>
  );
}