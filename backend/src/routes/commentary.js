// import { Router } from "express";

// import { commentry } from "../db/schema.js";
// import {
//   createCommentarySchema,
//   listCommentaryQuerySchema,
// } from "../validation/commentary.js";
// import { matchIdParamSchema } from "../validation/matches.js";
// import { db } from "../db/db.js";
// import { desc, eq } from "drizzle-orm";

// export const commentaryRouter = Router({ mergeParams: true });

// const MAX_LIMIT = 100;

// commentaryRouter.get("/", async (req, res) => {
//   const paramsResult = matchIdParamSchema.safeParse(req.params);
//   if (!paramsResult.success) {
//     return res
//       .status(400)
//       .json({ error: "Invalid match ID.", details: paramsResult.error.issues });
//   }

//   const queryResult = listCommentaryQuerySchema.safeParse(req.query);
//   if (!queryResult.success) {
//     return res.status(400).json({
//       error: "Invalid query parameters.",
//       details: queryResult.error.issues,
//     });
//   }

//   try {
//     const { id: matchId } = paramsResult.data;
//     const { limit = 10 } = queryResult.data;

//     const safeLimit = Math.min(limit, MAX_LIMIT);

//     const results = await db
//       .select()
//       .from(commentry)
//       .where(eq(commentry.matchId, matchId))
//       .orderBy(desc(commentry.createdAt))
//       .limit(safeLimit);


//     console.log(results);
//     res.status(200).json({ data: results });
//   } catch (error) {
//     console.error("Failed to fetch commentary: ", error);
//     // FIX #8: The catch block only logged the error but never sent a response,
//     // leaving the client hanging indefinitely on any database failure.
//     res.status(500).json({ error: "Failed to fetch commentary." });
//   }
// });

// commentaryRouter.post("/", async (req, res) => {
//   const paramResult = matchIdParamSchema.safeParse(req.params);

//   if (!paramResult.success) {
//     return res
//       .status(400)
//       .json({ error: "Invalid match ID.", details: paramResult.error.issues });
//   }

//   const bodyResult = createCommentarySchema.safeParse(req.body);
//   if (!bodyResult.success) {
//     return res.status(400).json({
//       error: "Invalid commentary payload.",
//       details: bodyResult.error.issues,
//     });
//   }

//   try {
//     const { minute, ...rest } = bodyResult.data;
//     const [result] = await db
//       .insert(commentry)
//       .values({
//         matchId: paramResult.data.id,
//         minute,
//         ...rest,
//       })
//       .returning();

//     try {
//       res.app.locals.broadcastCommentary?.(result.matchId, result);
//     } catch (broadcastError) {
//       console.error("Broadcast commentary error:", broadcastError);
//     }

//     res.status(201).json({ data: result });
//   } catch (error) {
//     console.error("Create commentary error:", error);

//     if (
//       error?.code === "23503" ||
//       error?.message?.toLowerCase().includes("foreign key") ||
//       error?.message?.includes("commentry_match_id")
//     ) {
//       return res.status(404).json({ error: "Match not found" });
//     }

//     res.status(500).json({
//       error: "Failed to create commentary.",
//     });
//   }
// });




// import { Router } from "express";
// import { desc, eq } from "drizzle-orm";
// import {
//   createCommentarySchema,
//   listCommentaryQuerySchema,
// } from "../validation/commentary.js";
// import { matchIdParamSchema } from "../validation/matches.js";
// import { commentry } from "../db/schema.js";
// import { matches } from "../db/schema.js";
// import { db } from "../db/db.js";

// // mergeParams: true is required so /:id from the parent router is available
// export const commentaryRouter = Router({ mergeParams: true });

// const MAX_LIMIT = 100;

// // ── GET /matches/:id/commentary ───────────────────────────────────────────
// // Returns commentary events newest-first, limited to MAX_LIMIT.
// commentaryRouter.get("/", async (req, res) => {
//   const paramsResult = matchIdParamSchema.safeParse(req.params);
//   if (!paramsResult.success) {
//     return res
//       .status(400)
//       .json({ error: "Invalid match ID.", details: paramsResult.error.issues });
//   }

//   const queryResult = listCommentaryQuerySchema.safeParse(req.query);
//   if (!queryResult.success) {
//     return res.status(400).json({
//       error: "Invalid query parameters.",
//       details: queryResult.error.issues,
//     });
//   }

//   const { id: matchId } = paramsResult.data;
//   const { limit = 50 } = queryResult.data;
//   const safeLimit = Math.min(limit, MAX_LIMIT);

//   try {
//     const data = await db
//       .select()
//       .from(commentry)
//       .where(eq(commentry.matchId, matchId))
//       .orderBy(desc(commentry.createdAt))
//       .limit(safeLimit);

//     res.status(200).json({ data });
//   } catch (err) {
//     console.error("[GET /matches/:id/commentary]", err);
//     res.status(500).json({ error: "Failed to fetch commentary." });
//   }
// });

// // ── POST /matches/:id/commentary ──────────────────────────────────────────
// // Creates a commentary event and broadcasts it via WebSocket to room subscribers.
// commentaryRouter.post("/", async (req, res) => {
//   const paramsResult = matchIdParamSchema.safeParse(req.params);
//   if (!paramsResult.success) {
//     return res
//       .status(400)
//       .json({ error: "Invalid match ID.", details: paramsResult.error.issues });
//   }

//   const bodyResult = createCommentarySchema.safeParse(req.body);
//   if (!bodyResult.success) {
//     return res.status(400).json({
//       error: "Invalid commentary payload.",
//       details: bodyResult.error.issues,
//     });
//   }

//   const matchId = paramsResult.data.id;

//   try {
//     // Verify the match exists before inserting — gives a clean 404 instead of
//     // relying solely on the FK constraint error code.
//     const [matchExists] = await db
//       .select({ id: matches.id })
//       .from(matches)
//       .where(eq(matches.id, matchId))
//       .limit(1);

//     if (!matchExists) {
//       return res.status(404).json({ error: "Match not found." });
//     }

//     const [result] = await db
//       .insert(commentry)
//       .values({
//         matchId,
//         ...bodyResult.data,
//       })
//       .returning();

//     // Broadcast to all WebSocket clients subscribed to this match room.
//     // Wrapped in its own try/catch so a broadcast failure never blocks the
//     // HTTP response — the commentary is already persisted.
//     try {
//       res.app.locals.broadcastCommentary?.(result.matchId, result);
//     } catch (broadcastErr) {
//       console.error("[POST /commentary] Broadcast error:", broadcastErr);
//     }

//     res.status(201).json({ data: result });
//   } catch (err) {
//     console.error("[POST /matches/:id/commentary]", err);

//     // Fallback FK violation detection in case the explicit check above was
//     // bypassed by a race condition.
//     if (
//       err?.code === "23503" ||
//       err?.message?.toLowerCase().includes("foreign key")
//     ) {
//       return res.status(404).json({ error: "Match not found." });
//     }

//     res.status(500).json({ error: "Failed to create commentary." });
//   }
// });



import { Router } from "express";
import { desc, eq } from "drizzle-orm";
import {
  createCommentarySchema,
  listCommentaryQuerySchema,
} from "../validation/commentary.js";
import { matchIdParamSchema } from "../validation/matches.js";
import { commentry } from "../db/schema.js";
import { matches } from "../db/schema.js";
import { db } from "../db/db.js";

// mergeParams: true is required so /:id from the parent router is available
export const commentaryRouter = Router({ mergeParams: true });

const MAX_LIMIT = 100;

// ── GET /matches/:id/commentary ───────────────────────────────────────────
// Returns commentary events newest-first, limited to MAX_LIMIT.
commentaryRouter.get("/", async (req, res) => {
  const paramsResult = matchIdParamSchema.safeParse(req.params);
  if (!paramsResult.success) {
    return res
      .status(400)
      .json({ error: "Invalid match ID.", details: paramsResult.error.issues });
  }

  const queryResult = listCommentaryQuerySchema.safeParse(req.query);
  if (!queryResult.success) {
    return res.status(400).json({
      error: "Invalid query parameters.",
      details: queryResult.error.issues,
    });
  }

  const { id: matchId } = paramsResult.data;
  const { limit = 50 } = queryResult.data;
  const safeLimit = Math.min(limit, MAX_LIMIT);

  try {
    const data = await db
      .select()
      .from(commentry)
      .where(eq(commentry.matchId, matchId))
      .orderBy(desc(commentry.createdAt))
      .limit(safeLimit);

    res.status(200).json({ data });
  } catch (err) {
    console.error("[GET /matches/:id/commentary]", err);
    res.status(500).json({ error: "Failed to fetch commentary." });
  }
});

// ── POST /matches/:id/commentary ──────────────────────────────────────────
// Creates a commentary event and broadcasts it via WebSocket to room subscribers.
commentaryRouter.post("/", async (req, res) => {
  const paramsResult = matchIdParamSchema.safeParse(req.params);
  if (!paramsResult.success) {
    return res
      .status(400)
      .json({ error: "Invalid match ID.", details: paramsResult.error.issues });
  }

  const bodyResult = createCommentarySchema.safeParse(req.body);
  if (!bodyResult.success) {
    return res.status(400).json({
      error: "Invalid commentary payload.",
      details: bodyResult.error.issues,
    });
  }

  const matchId = paramsResult.data.id;

  try {
    // Verify the match exists before inserting — gives a clean 404 instead of
    // relying solely on the FK constraint error code.
    const [matchExists] = await db
      .select({ id: matches.id })
      .from(matches)
      .where(eq(matches.id, matchId))
      .limit(1);

    if (!matchExists) {
      return res.status(404).json({ error: "Match not found." });
    }

    const [result] = await db
      .insert(commentry)
      .values({
        matchId,
        ...bodyResult.data,
      })
      .returning();

    // Broadcast to all WebSocket clients subscribed to this match room.
    // Wrapped in its own try/catch so a broadcast failure never blocks the
    // HTTP response — the commentary is already persisted.
    try {
      res.app.locals.broadcastCommentary?.(result.matchId, result);
    } catch (broadcastErr) {
      console.error("[POST /commentary] Broadcast error:", broadcastErr);
    }

    res.status(201).json({ data: result });
  } catch (err) {
    console.error("[POST /matches/:id/commentary]", err);

    // Fallback FK violation detection in case the explicit check above was
    // bypassed by a race condition.
    if (
      err?.code === "23503" ||
      err?.message?.toLowerCase().includes("foreign key")
    ) {
      return res.status(404).json({ error: "Match not found." });
    }

    res.status(500).json({ error: "Failed to create commentary." });
  }
});