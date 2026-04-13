// import { useEffect, useRef, useState } from "react";

// export function WSStatusBadge({ status }) {
//   console.log(status);
//   // status='connected'
//   const map = {
//     connected: {
//       dot: "bg-green-400",
//       ring: "bg-green-400/20",
//       label: "Live",
//       text: "text-green-400",
//     },
//     connecting: {
//       dot: "bg-yellow-400",
//       ring: "bg-yellow-400/20",
//       label: "Connecting…",
//       text: "text-yellow-400",
//     },
//     disconnected: {
//       dot: "bg-red-500",
//       ring: "bg-red-500/20",
//       label: "Reconnecting…",
//       text: "text-red-400",
//     },
//   };
//   const s = map[status] || map.disconnected;
//   return (
//     <span
//       className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold ${s.text} ${s.ring} border border-current/20`}
//     >
//       <span className="relative flex h-2 w-2">
//         {status === "connected" && (
//           <span
//             className={`animate-ping absolute inline-flex h-full w-full rounded-full ${s.dot} opacity-75`}
//           />
//         )}
//         <span
//           className={`relative inline-flex rounded-full h-2 w-2 ${s.dot}`}
//         />
//       </span>
//       {s.label}
//     </span>
//   );
// }

// export function SportBadge({ sport, config }) {
//   return (
//     <span
//       className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wider"
//       style={{
//         background: config.color + "22",
//         color: config.color,
//         border: `1px solid ${config.color}44`,
//       }}
//     >
//       {config.emoji} {config.label}
//     </span>
//   );
// }

// export function IncidentBanner({ match, onDismiss }) {
//   if (!match) return null;

//   let message = null;
//   let style = "bg-yellow-500/10 text-yellow-400 border-yellow-500/30";

//   if (match.incident === "feed_delay") {
//     message = "Live feed is delayed. Attempting to resync…";
//   } else if (match.incident === "server_issue") {
//     style = "bg-red-500/10 text-red-400 border-red-500/30";
//     message = "Server connection issue. Reconnecting viewers…";
//   } else if (match.incident === "rate_limit") {
//     message = "Rate limit reached. Some updates may be delayed.";
//   }

//   if (!message) return null;

//   return (
//     <div
//       className={`flex items-center justify-between gap-3 px-3 py-2 rounded-lg border text-sm ${style}`}
//     >
//       <div className="flex items-center gap-2">
//         <span>⚠️</span>
//         <span>{message}</span>
//       </div>

//       {onDismiss && (
//         <button
//           onClick={onDismiss}
//           className="text-xs opacity-70 hover:opacity-100 transition"
//         >
//           ✕
//         </button>
//       )}
//     </div>
//   );
// }

// export function ConfirmDialog({
//   open,
//   title = "Are you sure?",
//   message,
//   confirmLabel = "Confirm",
//   confirmVariant = "primary",
//   onConfirm,
//   onCancel,
//   children,
// }) {
//   if (!open) return null;

//   const variants = {
//     primary: "bg-blue-600 hover:bg-blue-700",
//     warning: "bg-yellow-500 text-black hover:bg-yellow-600",
//     danger: "bg-red-600 hover:bg-red-700",
//   };

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
//       <div className="bg-slate-900 border border-slate-700 rounded-xl p-6 w-full max-w-sm shadow-xl">
//         <h3 className="text-lg font-semibold mb-2 text-white">{title}</h3>

//         {message && <p className="text-sm text-slate-400 mb-4">{message}</p>}

//         {/* 👇 extra content like IncidentBanner */}
//         {children && <div className="mb-4">{children}</div>}

//         <div className="flex justify-end gap-3">
//           <button
//             onClick={onCancel}
//             className="px-4 py-1.5 rounded bg-slate-700 text-slate-300 text-sm hover:bg-slate-600 transition"
//           >
//             Cancel
//           </button>

//           <button
//             onClick={onConfirm}
//             className={`px-4 py-1.5 rounded text-sm font-semibold transition ${variants[confirmVariant]}`}
//           >
//             {confirmLabel}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// export function StatusBadge({ status }) {
//   const map = {
//     live: "bg-red-500/20 text-red-400 border-red-500/30",
//     scheduled: "bg-blue-500/20 text-blue-400 border-blue-500/30",
//     finished: "bg-slate-500/20 text-slate-400 border-slate-500/30",
//   };
//   return (
//     <span
//       className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${map[status] || map.finished}`}
//     >
//       {status === "live" && (
//         <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
//       )}
//       {status?.toUpperCase()}
//     </span>
//   );
// }

// export function ScoreFlash({ value, className = "" }) {
//   const [flash, setFlash] = useState(false);
//   const prev = useRef(value);
//   const ref = useRef(null);

//   useEffect(() => {
//     if (prev.current !== value) {
//       setFlash(true);
//       setTimeout(() => setFlash(false), 800);
//       prev.current = value;
//     }
//   }, [value]);

//   return (
//     <span
//       ref={ref}
//       className={`transition-all duration-300 ${flash ? "scale-125 text-yellow-300" : ""} ${className}`}
//       style={{ display: "inline-block" }}
//     >
//       {value}
//     </span>
//   );
// }

// export function Spinner({ size = 5 }) {
//   return (
//     <svg
//       className={`animate-spin h-${size} w-${size} text-current`}
//       fill="none"
//       viewBox="0 0 24 24"
//     >
//       <circle
//         className="opacity-25"
//         cx="12"
//         cy="12"
//         r="10"
//         stroke="currentColor"
//         strokeWidth="4"
//       />
//       <path
//         className="opacity-75"
//         fill="currentColor"
//         d="M4 12a8 8 0 018-8v8z"
//       />
//     </svg>
//   );
// }

// export function EmptyState({ icon, title, subtitle }) {
//   return (
//     <div className="flex flex-col items-center justify-center py-20 gap-3 text-slate-500">
//       <span className="text-5xl">{icon}</span>
//       <p className="text-lg font-semibold text-slate-400">{title}</p>
//       {subtitle && <p className="text-sm">{subtitle}</p>}
//     </div>
//   );
// }





import { useEffect, useRef, useState } from "react";

// ── WS connection badge ───────────────────────────────────────────────────
export function WSStatusBadge({ status }) {
  const map = {
    connected:    { dot: "bg-green-400",  ring: "bg-green-400/20",  label: "Live",          text: "text-green-400" },
    connecting:   { dot: "bg-yellow-400", ring: "bg-yellow-400/20", label: "Connecting…",   text: "text-yellow-400" },
    disconnected: { dot: "bg-red-500",    ring: "bg-red-500/20",    label: "Reconnecting…", text: "text-red-400" },
  };
  const s = map[status] || map.disconnected;
  return (
    <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold ${s.text} ${s.ring} border border-current/20`}>
      <span className="relative flex h-2 w-2">
        {status === "connected" && (
          <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${s.dot} opacity-75`} />
        )}
        <span className={`relative inline-flex rounded-full h-2 w-2 ${s.dot}`} />
      </span>
      {s.label}
    </span>
  );
}

// ── Sport badge ───────────────────────────────────────────────────────────
export function SportBadge({ sport, config }) {
  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wider"
      style={{ background: config.color + "22", color: config.color, border: `1px solid ${config.color}44` }}
    >
      {config.emoji} {config.label}
    </span>
  );
}

// ── Status badge — all five match statuses ────────────────────────────────
export function StatusBadge({ status }) {
  const map = {
    live:      { cls: "bg-red-500/20 text-red-400 border-red-500/30",       dot: true,  icon: null },
    scheduled: { cls: "bg-blue-500/20 text-blue-400 border-blue-500/30",    dot: false, icon: null },
    finished:  { cls: "bg-slate-500/20 text-slate-400 border-slate-500/30", dot: false, icon: null },
    suspended: { cls: "bg-amber-500/20 text-amber-400 border-amber-500/30", dot: false, icon: "⏸" },
    abandoned: { cls: "bg-rose-900/30 text-rose-400 border-rose-700/40",    dot: false, icon: "✕" },
  };
  const s = map[status] || map.finished;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${s.cls}`}>
      {s.dot && <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />}
      {s.icon && <span className="text-xs leading-none">{s.icon}</span>}
      {status?.toUpperCase()}
    </span>
  );
}

// ── Incident banner — viewer-facing alert in GameRoom ────────────────────
export function IncidentBanner({ match, onDismiss }) {
  const isSuspended = match?.status === "suspended";
  const isAbandoned = match?.status === "abandoned";
  if (!isSuspended && !isAbandoned) return null;

  const cfg = isSuspended
    ? { icon: "⏸", title: "Match Suspended", bg: "bg-amber-950/80", border: "border-amber-700/50", text: "text-amber-300", btn: "text-amber-400 hover:text-amber-200" }
    : { icon: "✕", title: "Match Abandoned",  bg: "bg-rose-950/80",  border: "border-rose-800/50",  text: "text-rose-300",  btn: "text-rose-400 hover:text-rose-200" };

  return (
    <div className={`${cfg.bg} ${cfg.border} border rounded-2xl p-5 flex items-start gap-4 animate-in slide-in-from-top-4 duration-300`}>
      <span className="text-3xl flex-shrink-0">{cfg.icon}</span>
      <div className="flex-1 min-w-0">
        <p className={`font-bold text-base ${cfg.text}`}>{cfg.title}</p>
        {match.reason && <p className="text-sm text-slate-400 mt-1">{match.reason}</p>}
        {isSuspended && <p className="text-xs text-slate-500 mt-2">The match has been temporarily halted. Updates will resume if play continues.</p>}
        {isAbandoned && <p className="text-xs text-slate-500 mt-2">This match has been permanently stopped. No official result will be declared.</p>}
      </div>
      {onDismiss && (
        <button onClick={onDismiss} className={`text-xs font-semibold flex-shrink-0 transition-colors ${cfg.btn}`}>Dismiss</button>
      )}
    </div>
  );
}

// ── Confirm dialog ────────────────────────────────────────────────────────
// FIX: was only mapping "danger" correctly. "warning", "secondary", "success",
// and "primary" all silently rendered amber. Full variant map added.
// Also added: Escape key closes the dialog; aria roles for accessibility.
export function ConfirmDialog({ open, title, message, confirmLabel = "Confirm", confirmVariant = "danger", onConfirm, onCancel, children }) {
  if (!open) return null;

  const variantMap = {
    danger:    "bg-red-600 hover:bg-red-500 focus:ring-red-500",
    warning:   "bg-amber-600 hover:bg-amber-500 focus:ring-amber-500",
    success:   "bg-emerald-600 hover:bg-emerald-500 focus:ring-emerald-500",
    secondary: "bg-slate-600 hover:bg-slate-500 focus:ring-slate-500",
    primary:   "bg-blue-600 hover:bg-blue-500 focus:ring-blue-500",
  };
  const btnCls = variantMap[confirmVariant] ?? variantMap.danger;

  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") onCancel?.(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onCancel]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onCancel} aria-hidden="true" />
      <div role="dialog" aria-modal="true" className="relative bg-slate-900 border border-slate-700 rounded-2xl p-6 w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-200">
        <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
        <p className="text-sm text-slate-400 mb-4">{message}</p>
        {children && <div className="mb-5 space-y-3">{children}</div>}
        <div className="flex gap-3 justify-end">
          <button onClick={onCancel} className="px-4 py-2 rounded-xl bg-slate-700 hover:bg-slate-600 text-white text-sm font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-slate-500">
            Cancel
          </button>
          <button onClick={onConfirm} className={`px-4 py-2 rounded-xl text-white text-sm font-semibold transition-colors focus:outline-none focus:ring-2 ${btnCls}`}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Toast notification system ─────────────────────────────────────────────
// MISSING FUNCTION: every page had a copy-pasted local Toast component.
// This shared version provides useToast() for state management and
// <ToastContainer /> for rendering. Supports 4 types with coloured accents.
//
// Usage (in any page):
//   const { toasts, toast, dismiss } = useToast();
//   toast("success", "Score updated!");
//   toast("error",   err.message);
//   toast("warning", "Match is suspended.");
//   toast("info",    "Connecting…");
//   return (
//     <>
//       <ToastContainer toasts={toasts} onDismiss={dismiss} />
//       ...rest of page...
//     </>
//   );
export function useToast(autoDismissMs = 3500) {
  const [toasts, setToasts] = useState([]);

  const toast = (type, message) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), autoDismissMs);
  };

  const dismiss = (id) => setToasts((prev) => prev.filter((t) => t.id !== id));

  return { toasts, toast, dismiss };
}

const TOAST_STYLES = {
  success: { bar: "bg-emerald-500", bg: "bg-emerald-950/90 border-emerald-700/50", text: "text-emerald-300", icon: "✓" },
  error:   { bar: "bg-red-500",     bg: "bg-red-950/90 border-red-700/50",         text: "text-red-300",     icon: "✗" },
  warning: { bar: "bg-amber-500",   bg: "bg-amber-950/90 border-amber-700/50",     text: "text-amber-300",   icon: "⚠" },
  info:    { bar: "bg-blue-500",    bg: "bg-blue-950/90 border-blue-700/50",       text: "text-blue-300",    icon: "ℹ" },
};

export function ToastContainer({ toasts, onDismiss }) {
  return (
    <div aria-live="polite" className="fixed top-4 right-4 z-50 flex flex-col gap-2 pointer-events-none w-80">
      {toasts.map((t) => {
        const s = TOAST_STYLES[t.type] ?? TOAST_STYLES.info;
        return (
          <div key={t.id} className={`pointer-events-auto relative overflow-hidden rounded-xl border shadow-2xl ${s.bg} animate-in slide-in-from-right-4 duration-300`}>
            <div className={`absolute left-0 top-0 bottom-0 w-1 ${s.bar}`} />
            <div className="flex items-start gap-3 px-4 py-3 pl-5">
              <span className={`text-sm font-bold flex-shrink-0 ${s.text}`}>{s.icon}</span>
              <p className="text-sm text-slate-200 flex-1 leading-snug">{t.message}</p>
              <button onClick={() => onDismiss?.(t.id)} className="text-slate-500 hover:text-slate-300 text-xs flex-shrink-0 transition-colors leading-none pt-0.5" aria-label="Dismiss">✕</button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ── Score flash — number pulses yellow when it changes ────────────────────
export function ScoreFlash({ value, className = "" }) {
  const [flash, setFlash] = useState(false);
  const prev = useRef(value);
  useEffect(() => {
    if (prev.current !== value) {
      setFlash(true);
      const t = setTimeout(() => setFlash(false), 800);
      prev.current = value;
      return () => clearTimeout(t);
    }
  }, [value]);
  return (
    <span className={`transition-all duration-300 ${flash ? "scale-125 text-yellow-300" : ""} ${className}`} style={{ display: "inline-block" }}>
      {value}
    </span>
  );
}

// ── Spinner ───────────────────────────────────────────────────────────────
export function Spinner({ size = 5 }) {
  return (
    <svg className={`animate-spin h-${size} w-${size} text-current`} fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
    </svg>
  );
}

// ── Empty state ───────────────────────────────────────────────────────────
export function EmptyState({ icon, title, subtitle }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-3 text-slate-500">
      <span className="text-5xl">{icon}</span>
      <p className="text-lg font-semibold text-slate-400">{title}</p>
      {subtitle && <p className="text-sm text-center max-w-xs">{subtitle}</p>}
    </div>
  );
}