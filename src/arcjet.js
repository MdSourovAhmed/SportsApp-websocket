// // arcjet.js

// import arcjet, { detectBot, shield, slidingWindow } from "@arcjet/node";

// const arcjetKey = process.env.ARCJET_KEY;
// const arcjetMode = process.env.ARCJET_MODE === "DRY_RUN" ? "DRY_RUN" : "LIVE";

// if (!arcjetKey) {
//   //   throw new Error("ARCJET_KEY environment variable is missing...");
//   console.warn("ARCJET_KEY not set; Arcjet protection is disabled.");
// }
// export const httpArcjet = arcjetKey
//   ? arcjet({
//       key: arcjetKey,
//       rules: [
//         shield({ mode: arcjetMode }),
//         detectBot({
//           mode: arcjetMode,
//           allow: ["CATEGORY:SEARCH_ENGINE", "CATEGORY:PREVIEW"],
//         }),
//         slidingWindow({ mode: arcjetMode, interval: "10s", max: 50 }),
//       ],
//     })
//   : null;

// export const wsArcjet = arcjetKey
//   ? arcjet({
//       key: arcjetKey,
//       rules: [
//         shield({ mode: arcjetMode }),
//         detectBot({
//           mode: arcjetMode,
//           allow: ["CATEGORY:SEARCH_ENGINE", "CATEGORY:PREVIEW"],
//         }),
//         slidingWindow({ mode: arcjetMode, interval: "2s", max: 5 }),
//       ],
//     })
//   : null;

// export function securityMiddleware() {
//   return async (req, res, next) => {
//     if (!httpArcjet) return next();

//     try {
//       const decision = await httpArcjet.protect(req);

//       if (decision.isDenied()) {
//         if (decision.reason.isRateLimit()) {
//           return res.status(429).json({ error: "Too many requests..." });
//         }
//         return res.status(503).json({ error: "Forbidden..." });
//       }
//     } catch (e) {
//       console.error("Arcjet middleware error...", e);
//       return res.status(503).json({ error: "Service Unavailable..." });
//     }

//     next();
//   };
// }

// // for(let i=0;i<30;i++){
// //     const ws=new WebSocket("ws://localhost:7000/ws");
// //     ws.onopen=()=>console.log(`Socket ${i} opened`);
// //     ws.onclose=(e)=>console.log(`Socket ${i} closed: ${e.code} ${e.reason}`);
// // }




import arcjet, { detectBot, shield, slidingWindow } from "@arcjet/node";

const arcjetKey = process.env.ARCJET_KEY;
const arcjetMode = process.env.ARCJET_MODE === "DRY_RUN" ? "DRY_RUN" : "LIVE";

if (!arcjetKey) {
  console.warn("ARCJET_KEY not set; Arcjet protection is disabled.");
}

export const httpArcjet = arcjetKey
  ? arcjet({
      key: arcjetKey,
      rules: [
        shield({ mode: arcjetMode }),
        detectBot({
          mode: arcjetMode,
          allow: ["CATEGORY:SEARCH_ENGINE", "CATEGORY:PREVIEW"],
        }),
        slidingWindow({ mode: arcjetMode, interval: "10s", max: 50 }),
      ],
    })
  : null;

export const wsArcjet = arcjetKey
  ? arcjet({
      key: arcjetKey,
      rules: [
        shield({ mode: arcjetMode }),
        detectBot({
          mode: arcjetMode,
          allow: ["CATEGORY:SEARCH_ENGINE", "CATEGORY:PREVIEW"],
        }),
        slidingWindow({ mode: arcjetMode, interval: "2s", max: 5 }),
      ],
    })
  : null;

export function securityMiddleware() {
  return async (req, res, next) => {
    if (!httpArcjet) return next();

    try {
      const decision = await httpArcjet.protect(req);

      if (decision.isDenied()) {
        if (decision.reason.isRateLimit()) {
          return res.status(429).json({ error: "Too many requests." });
        }
        // FIX #4: Was returning 503 ("Service Unavailable") for blocked requests.
        // 503 signals a server-side outage and causes many HTTP clients and proxies
        // to automatically retry — the opposite of what you want for a blocked request.
        // 403 ("Forbidden") is the correct code: access denied by policy.
        return res.status(403).json({ error: "Forbidden." });
      }
    } catch (e) {
      console.error("Arcjet middleware error:", e);
      // 503 is correct here — the Arcjet SDK itself threw, meaning the security
      // layer is genuinely unavailable (not a policy decision).
      return res.status(503).json({ error: "Service Unavailable." });
    }

    next();
  };
}