

// import { Router } from "express";
// import { desc, eq, and } from "drizzle-orm";
// import {
//   createMatchSchema,
//   listMatchesQuerySchema,
//   matchIdParamSchema,
//   updateScoreSchema,
//   MATCH_STATUS,
// } from "../validation/matches.js";
// import { matches } from "../db/schema.js";
// import { db } from "../db/db.js";
// import { getMatchStatus, syncMatchStatus } from "../utils/match-status.js";

// export const matchRouter = Router();

// // ── GET /matches ──────────────────────────────────────────────────────────
// // Query params: limit (default 50, max 100), status, sport
// matchRouter.get("/", async (req, res) => {
//   const parsed = listMatchesQuerySchema.safeParse(req.query);
//   if (!parsed.success) {
//     return res.status(400).json({ error: "Invalid query", details: parsed.error.issues });
//   }

//   const { limit = 50, status, sport } = parsed.data;
//   const safeLimit = Math.min(limit, 100);

//   try {
//     // Build conditions array and apply only the ones present
//     const conditions = [];
//     if (status) conditions.push(eq(matches.status, status));
//     if (sport)  conditions.push(eq(matches.sport, sport));

//     const query = db
//       .select()
//       .from(matches)
//       .orderBy(desc(matches.createdAt))
//       .limit(safeLimit);

//     const data = conditions.length > 0
//       ? await query.where(and(...conditions))
//       : await query;

//     res.json({ data });
//   } catch (err) {
//     console.error("[GET /matches]", err);
//     res.status(500).json({ error: "Failed to list matches." });
//   }
// });

// // ── GET /matches/:id ──────────────────────────────────────────────────────
// // Returns a single match by id. Syncs its status against wall-clock time.
// matchRouter.get("/:id", async (req, res) => {
//   const parsed = matchIdParamSchema.safeParse(req.params);
//   if (!parsed.success) {
//     return res.status(400).json({ error: "Invalid match ID.", details: parsed.error.issues });
//   }

//   const { id } = parsed.data;

//   try {
//     const [match] = await db
//       .select()
//       .from(matches)
//       .where(eq(matches.id, id))
//       .limit(1);

//     if (!match) {
//       return res.status(404).json({ error: "Match not found." });
//     }

//     // Sync status on read so the client always sees the current state
//     await syncMatchStatus(match, async (nextStatus) => {
//       await db
//         .update(matches)
//         .set({ status: nextStatus })
//         .where(eq(matches.id, id));
//     });

//     res.json({ data: match });
//   } catch (err) {
//     console.error("[GET /matches/:id]", err);
//     res.status(500).json({ error: "Failed to fetch match." });
//   }
// });

// // ── POST /matches ─────────────────────────────────────────────────────────
// matchRouter.post("/", async (req, res) => {
//   const parsed = createMatchSchema.safeParse(req.body);
//   if (!parsed.success) {
//     return res.status(400).json({ error: "Invalid payload.", details: parsed.error.issues });
//   }

//   const { startTime, endTime, homeScore, awayScore } = parsed.data;

//   try {
//     const [match] = await db
//       .insert(matches)
//       .values({
//         ...parsed.data,
//         startTime: new Date(startTime),
//         endTime:   new Date(endTime),
//         homeScore: homeScore ?? 0,
//         awayScore: awayScore ?? 0,
//         status:    getMatchStatus(startTime, endTime),
//       })
//       .returning();

//     res.app.locals.broadcastMatchCreated?.(match);

//     res.status(201).json({ data: match });
//   } catch (err) {
//     console.error("[POST /matches]", err);
//     res.status(500).json({ error: "Failed to create match.", details: err.message });
//   }
// });

// // ── PATCH /matches/:id/score ──────────────────────────────────────────────
// // Only accepted when the match is LIVE. Auto-syncs status first.
// matchRouter.patch("/:id/score", async (req, res) => {
//   const paramsParsed = matchIdParamSchema.safeParse(req.params);
//   if (!paramsParsed.success) {
//     return res.status(400).json({ error: "Invalid match ID.", details: paramsParsed.error.issues });
//   }

//   const bodyParsed = updateScoreSchema.safeParse(req.body);
//   if (!bodyParsed.success) {
//     return res.status(400).json({ error: "Invalid payload.", details: bodyParsed.error.issues });
//   }

//   const matchId = paramsParsed.data.id;

//   try {
//     const [existing] = await db
//       .select({ id: matches.id, status: matches.status, startTime: matches.startTime, endTime: matches.endTime })
//       .from(matches)
//       .where(eq(matches.id, matchId))
//       .limit(1);

//     if (!existing) {
//       return res.status(404).json({ error: "Match not found." });
//     }

//     const currentStatus = await syncMatchStatus(existing, async (nextStatus) => {
//       await db.update(matches).set({ status: nextStatus }).where(eq(matches.id, matchId));
//     });

//     if (currentStatus !== MATCH_STATUS.LIVE) {
//       return res.status(409).json({
//         error: "Score can only be updated while the match is live.",
//         status: currentStatus,
//       });
//     }

//     const [updated] = await db
//       .update(matches)
//       .set({ homeScore: bodyParsed.data.homeScore, awayScore: bodyParsed.data.awayScore })
//       .where(eq(matches.id, matchId))
//       .returning();

//     res.app.locals.broadcastScoreUpdate?.(matchId, {
//       homeScore: updated.homeScore,
//       awayScore: updated.awayScore,
//     });

//     res.status(200).json({ data: updated });
//   } catch (err) {
//     console.error("[PATCH /matches/:id/score]", err);
//     res.status(500).json({ error: "Failed to update score.", details: err.message });
//   }
// });




// import { Router } from "express";
// import { desc, eq, and } from "drizzle-orm";
// import {
//   createMatchSchema,
//   editMatchSchema,
//   listMatchesQuerySchema,
//   matchIdParamSchema,
//   updateScoreSchema,
//   suspendMatchSchema,
//   abandonMatchSchema,
//   rescheduleMatchSchema,
//   forceFinishSchema,
//   MATCH_STATUS,
// } from "../validation/matches.js";
// import { matches, commentry } from "../db/schema.js";
// import { db } from "../db/db.js";
// import { getMatchStatus, syncMatchStatus } from "../utils/match-status.js";

// export const matchRouter = Router();

// // ── Helpers ───────────────────────────────────────────────────────────────

// /** Fetch a single match or return null */
// async function findMatch(id) {
//   const [match] = await db.select().from(matches).where(eq(matches.id, id)).limit(1);
//   return match ?? null;
// }

// /** Broadcast wrapper — never throws into the route */
// function broadcast(fn, ...args) {
//   try { fn?.(...args); } catch (err) { console.error("[Broadcast error]", err); }
// }

// // ── GET /matches ──────────────────────────────────────────────────────────
// matchRouter.get("/", async (req, res) => {
//   const parsed = listMatchesQuerySchema.safeParse(req.query);
//   if (!parsed.success)
//     return res.status(400).json({ error: "Invalid query.", details: parsed.error.issues });

//   const { limit = 50, status, sport } = parsed.data;

//   try {
//     const conditions = [];
//     if (status) conditions.push(eq(matches.status, status));
//     if (sport) conditions.push(eq(matches.sport, sport));

//     const query = db.select().from(matches).orderBy(desc(matches.createdAt)).limit(Math.min(limit, 100));
//     const data = conditions.length > 0 ? await query.where(and(...conditions)) : await query;

//     res.json({ data });
//   } catch (err) {
//     console.error("[GET /matches]", err);
//     res.status(500).json({ error: "Failed to list matches." });
//   }
// });

// // ── GET /matches/:id ──────────────────────────────────────────────────────
// matchRouter.get("/:id", async (req, res) => {
//   const parsed = matchIdParamSchema.safeParse(req.params);
//   if (!parsed.success)
//     return res.status(400).json({ error: "Invalid match ID.", details: parsed.error.issues });

//   try {
//     const match = await findMatch(parsed.data.id);
//     if (!match) return res.status(404).json({ error: "Match not found." });

//     await syncMatchStatus(match, async (nextStatus) => {
//       await db.update(matches).set({ status: nextStatus }).where(eq(matches.id, match.id));
//     });

//     res.json({ data: match });
//   } catch (err) {
//     console.error("[GET /matches/:id]", err);
//     res.status(500).json({ error: "Failed to fetch match." });
//   }
// });

// // ── POST /matches ─────────────────────────────────────────────────────────
// matchRouter.post("/", async (req, res) => {
//   console.log('Creating matches...1');
//   const parsed = createMatchSchema.safeParse(req.body);
//   if (!parsed.success)
//     return res.status(400).json({ error: "Invalid payload.", details: parsed.error.issues });
//   console.log('Creating matches...2');

//   const { startTime, endTime, homeScore, awayScore } = parsed.data;
//   console.log('Creating matches...3', parsed.data);

//   try {
//     // const [match] = await db
//     // .insert(matches)
//     //   .values({
//     //     ...parsed.data,
//     //     startTime: new Date(startTime),
//     //     endTime:   new Date(endTime),
//     //     homeScore: homeScore ?? 0,
//     //     awayScore: awayScore ?? 0,
//     //     status:    getMatchStatus(startTime, endTime),
//     //   })
//     //   .returning();

//     const [match] = await db
//       .insert(matches)
//       .values({
//         ...parsed.data,
//         startTime: new Date(startTime),
//         endTime: new Date(endTime),
//         homeScore: homeScore ?? 0,
//         awayScore: awayScore ?? 0,
//         status: getMatchStatus(startTime, endTime),
//       })
//       .returning();

//     console.log(match);

//     broadcast(res.app.locals.broadcastMatchCreated, match);
//     res.status(201).json({ data: match });
//   } catch (err) {
//     console.error("[POST /matches]", err);
//     res.status(500).json({ error: "Failed to create match.", details: err.message });
//   }
// });

// // ── PATCH /matches/:id ────────────────────────────────────────────────────
// // Edit mutable fields. Only allowed while status is "scheduled".
// matchRouter.patch("/:id", async (req, res) => {
//   const paramsParsed = matchIdParamSchema.safeParse(req.params);
//   if (!paramsParsed.success)
//     return res.status(400).json({ error: "Invalid match ID.", details: paramsParsed.error.issues });

//   const bodyParsed = editMatchSchema.safeParse(req.body);
//   if (!bodyParsed.success)
//     return res.status(400).json({ error: "Invalid payload.", details: bodyParsed.error.issues });

//   const matchId = paramsParsed.data.id;

//   try {
//     const existing = await findMatch(matchId);
//     if (!existing) return res.status(404).json({ error: "Match not found." });

//     if (existing.status !== MATCH_STATUS.SCHEDULED) {
//       return res.status(409).json({
//         error: "Only scheduled matches can be edited. Use suspend, reschedule, or force-finish for live matches.",
//         status: existing.status,
//       });
//     }

//     const updates = { ...bodyParsed.data };
//     if (updates.startTime) updates.startTime = new Date(updates.startTime);
//     if (updates.endTime) updates.endTime = new Date(updates.endTime);

//     // Recalculate status if times changed
//     if (updates.startTime || updates.endTime) {
//       updates.status = getMatchStatus(
//         updates.startTime ?? existing.startTime,
//         updates.endTime ?? existing.endTime,
//       );
//     }

//     const [updated] = await db
//       .update(matches)
//       .set(updates)
//       .where(eq(matches.id, matchId))
//       .returning();

//     broadcast(res.app.locals.broadcastMatchUpdated, updated);
//     res.json({ data: updated });
//   } catch (err) {
//     console.error("[PATCH /matches/:id]", err);
//     res.status(500).json({ error: "Failed to update match.", details: err.message });
//   }
// });

// // ── PATCH /matches/:id/score ──────────────────────────────────────────────
// matchRouter.patch("/:id/score", async (req, res) => {
//   const paramsParsed = matchIdParamSchema.safeParse(req.params);
//   if (!paramsParsed.success)
//     return res.status(400).json({ error: "Invalid match ID.", details: paramsParsed.error.issues });

//   const bodyParsed = updateScoreSchema.safeParse(req.body);
//   if (!bodyParsed.success)
//     return res.status(400).json({ error: "Invalid payload.", details: bodyParsed.error.issues });

//   const matchId = paramsParsed.data.id;

//   try {
//     const existing = await findMatch(matchId);
//     if (!existing) return res.status(404).json({ error: "Match not found." });

//     const currentStatus = await syncMatchStatus(existing, async (nextStatus) => {
//       await db.update(matches).set({ status: nextStatus }).where(eq(matches.id, matchId));
//     });

//     if (currentStatus !== MATCH_STATUS.LIVE) {
//       return res.status(409).json({
//         error: "Score can only be updated while the match is live.",
//         status: currentStatus,
//       });
//     }

//     const [updated] = await db
//       .update(matches)
//       .set({ homeScore: bodyParsed.data.homeScore, awayScore: bodyParsed.data.awayScore })
//       .where(eq(matches.id, matchId))
//       .returning();

//     broadcast(res.app.locals.broadcastScoreUpdate, matchId, {
//       matchId,
//       homeScore: updated.homeScore,
//       awayScore: updated.awayScore,
//     });

//     res.json({ data: updated });
//   } catch (err) {
//     console.error("[PATCH /matches/:id/score]", err);
//     res.status(500).json({ error: "Failed to update score.", details: err.message });
//   }
// });

// // ── POST /matches/:id/suspend ─────────────────────────────────────────────
// // Pauses a live or scheduled match due to an incident.
// // Suspended matches can be resumed (rescheduled) or abandoned.
// matchRouter.post("/:id/suspend", async (req, res) => {
//   const paramsParsed = matchIdParamSchema.safeParse(req.params);
//   if (!paramsParsed.success)
//     return res.status(400).json({ error: "Invalid match ID.", details: paramsParsed.error.issues });

//   const bodyParsed = suspendMatchSchema.safeParse(req.body);
//   if (!bodyParsed.success)
//     return res.status(400).json({ error: "Invalid payload.", details: bodyParsed.error.issues });

//   const matchId = paramsParsed.data.id;

//   try {
//     const existing = await findMatch(matchId);
//     if (!existing) return res.status(404).json({ error: "Match not found." });

//     const allowedFrom = [MATCH_STATUS.LIVE, MATCH_STATUS.SCHEDULED];
//     if (!allowedFrom.includes(existing.status)) {
//       return res.status(409).json({
//         error: `Cannot suspend a match with status "${existing.status}". Only live or scheduled matches can be suspended.`,
//         status: existing.status,
//       });
//     }

//     const [updated] = await db
//       .update(matches)
//       .set({
//         status: MATCH_STATUS.SUSPENDED,
//         reason: bodyParsed.data.reason,
//         suspendedAt: new Date(),
//       })
//       .where(eq(matches.id, matchId))
//       .returning();

//     broadcast(res.app.locals.broadcastMatchSuspended, updated);
//     res.json({ data: updated });
//   } catch (err) {
//     console.error("[POST /matches/:id/suspend]", err);
//     res.status(500).json({ error: "Failed to suspend match.", details: err.message });
//   }
// });

// // ── POST /matches/:id/abandon ─────────────────────────────────────────────
// // Permanently halts a live or suspended match. No winner is declared.
// // Scores are kept as-is for record purposes.
// matchRouter.post("/:id/abandon", async (req, res) => {
//   const paramsParsed = matchIdParamSchema.safeParse(req.params);
//   if (!paramsParsed.success)
//     return res.status(400).json({ error: "Invalid match ID.", details: paramsParsed.error.issues });

//   const bodyParsed = abandonMatchSchema.safeParse(req.body);
//   if (!bodyParsed.success)
//     return res.status(400).json({ error: "Invalid payload.", details: bodyParsed.error.issues });

//   const matchId = paramsParsed.data.id;

//   try {
//     const existing = await findMatch(matchId);
//     if (!existing) return res.status(404).json({ error: "Match not found." });

//     const allowedFrom = [MATCH_STATUS.LIVE, MATCH_STATUS.SUSPENDED];
//     if (!allowedFrom.includes(existing.status)) {
//       return res.status(409).json({
//         error: `Cannot abandon a match with status "${existing.status}". Only live or suspended matches can be abandoned.`,
//         status: existing.status,
//       });
//     }

//     const [updated] = await db
//       .update(matches)
//       .set({
//         status: MATCH_STATUS.ABANDONED,
//         reason: bodyParsed.data.reason,
//       })
//       .where(eq(matches.id, matchId))
//       .returning();

//     broadcast(res.app.locals.broadcastMatchAbandoned, updated);
//     res.json({ data: updated });
//   } catch (err) {
//     console.error("[POST /matches/:id/abandon]", err);
//     res.status(500).json({ error: "Failed to abandon match.", details: err.message });
//   }
// });

// // ── POST /matches/:id/reschedule ──────────────────────────────────────────
// // Moves a scheduled or suspended match to a new time window.
// // Sets status back to "scheduled" based on the new times.
// matchRouter.post("/:id/reschedule", async (req, res) => {
//   const paramsParsed = matchIdParamSchema.safeParse(req.params);
//   if (!paramsParsed.success)
//     return res.status(400).json({ error: "Invalid match ID.", details: paramsParsed.error.issues });

//   const bodyParsed = rescheduleMatchSchema.safeParse(req.body);
//   if (!bodyParsed.success)
//     return res.status(400).json({ error: "Invalid payload.", details: bodyParsed.error.issues });

//   const matchId = paramsParsed.data.id;

//   try {
//     const existing = await findMatch(matchId);
//     if (!existing) return res.status(404).json({ error: "Match not found." });

//     const allowedFrom = [MATCH_STATUS.SCHEDULED, MATCH_STATUS.SUSPENDED];
//     if (!allowedFrom.includes(existing.status)) {
//       return res.status(409).json({
//         error: `Cannot reschedule a match with status "${existing.status}". Only scheduled or suspended matches can be rescheduled.`,
//         status: existing.status,
//       });
//     }

//     const newStart = new Date(bodyParsed.data.startTime);
//     const newEnd = new Date(bodyParsed.data.endTime);

//     const [updated] = await db
//       .update(matches)
//       .set({
//         startTime: newStart,
//         endTime: newEnd,
//         status: MATCH_STATUS.SCHEDULED,
//         reason: bodyParsed.data.reason ?? null,
//         suspendedAt: null,
//       })
//       .where(eq(matches.id, matchId))
//       .returning();

//     broadcast(res.app.locals.broadcastMatchRescheduled, updated);
//     res.json({ data: updated });
//   } catch (err) {
//     console.error("[POST /matches/:id/reschedule]", err);
//     res.status(500).json({ error: "Failed to reschedule match.", details: err.message });
//   }
// });

// // ── POST /matches/:id/finish ──────────────────────────────────────────────
// // Admin manually ends a live or suspended match immediately.
// // Optionally overrides scores. Used when a match ends early due to an incident.
// matchRouter.post("/:id/finish", async (req, res) => {
//   const paramsParsed = matchIdParamSchema.safeParse(req.params);
//   if (!paramsParsed.success)
//     return res.status(400).json({ error: "Invalid match ID.", details: paramsParsed.error.issues });

//   const bodyParsed = forceFinishSchema.safeParse(req.body);
//   if (!bodyParsed.success)
//     return res.status(400).json({ error: "Invalid payload.", details: bodyParsed.error.issues });

//   const matchId = paramsParsed.data.id;

//   try {
//     const existing = await findMatch(matchId);
//     if (!existing) return res.status(404).json({ error: "Match not found." });

//     const allowedFrom = [MATCH_STATUS.LIVE, MATCH_STATUS.SUSPENDED];
//     if (!allowedFrom.includes(existing.status)) {
//       return res.status(409).json({
//         error: `Cannot force-finish a match with status "${existing.status}". Only live or suspended matches can be force-finished.`,
//         status: existing.status,
//       });
//     }

//     const [updated] = await db
//       .update(matches)
//       .set({
//         status: MATCH_STATUS.FINISHED,
//         homeScore: bodyParsed.data.homeScore ?? existing.homeScore,
//         awayScore: bodyParsed.data.awayScore ?? existing.awayScore,
//         reason: bodyParsed.data.reason ?? null,
//         endTime: new Date(), // record actual end time
//       })
//       .where(eq(matches.id, matchId))
//       .returning();

//     broadcast(res.app.locals.broadcastMatchForceFinished, updated);
//     res.json({ data: updated });
//   } catch (err) {
//     console.error("[POST /matches/:id/finish]", err);
//     res.status(500).json({ error: "Failed to force-finish match.", details: err.message });
//   }
// });

// // ── DELETE /matches/:id ───────────────────────────────────────────────────
// // Hard-deletes a match and all its commentary (CASCADE on FK).
// // Only allowed for scheduled or abandoned matches to prevent accidental
// // deletion of active games. Use abandon first for live matches.
// matchRouter.delete("/:id", async (req, res) => {
//   const parsed = matchIdParamSchema.safeParse(req.params);
//   if (!parsed.success)
//     return res.status(400).json({ error: "Invalid match ID.", details: parsed.error.issues });

//   const matchId = parsed.data.id;

//   try {
//     const existing = await findMatch(matchId);
//     if (!existing) return res.status(404).json({ error: "Match not found." });

//     const allowedFrom = [MATCH_STATUS.SCHEDULED, MATCH_STATUS.ABANDONED, MATCH_STATUS.FINISHED];
//     if (!allowedFrom.includes(existing.status)) {
//       return res.status(409).json({
//         error: `Cannot delete a "${existing.status}" match. Suspend or abandon it first.`,
//         status: existing.status,
//         hint: "POST /matches/:id/abandon to halt it, then DELETE.",
//       });
//     }

//     // Commentary rows are deleted automatically via ON DELETE CASCADE
//     await db.delete(matches).where(eq(matches.id, matchId));

//     broadcast(res.app.locals.broadcastMatchDeleted, matchId);
//     res.status(200).json({ data: { matchId, deleted: true } });
//   } catch (err) {
//     console.error("[DELETE /matches/:id]", err);
//     res.status(500).json({ error: "Failed to delete match.", details: err.message });
//   }
// });




import { Router } from "express";
import { desc, eq, and } from "drizzle-orm";
import {
  createMatchSchema,
  editMatchSchema,
  listMatchesQuerySchema,
  matchIdParamSchema,
  updateScoreSchema,
  suspendMatchSchema,
  abandonMatchSchema,
  rescheduleMatchSchema,
  forceFinishSchema,
  MATCH_STATUS,
} from "../validation/matches.js";
import { matches, commentry } from "../db/schema.js";
import { db } from "../db/db.js";
import { getMatchStatus, syncMatchStatus } from "../utils/match-status.js";

export const matchRouter = Router();

// ── Helpers ───────────────────────────────────────────────────────────────

/** Fetch a single match or return null */
async function findMatch(id) {
  const [match] = await db.select().from(matches).where(eq(matches.id, id)).limit(1);
  return match ?? null;
}

/** Broadcast wrapper — never throws into the route */
function broadcast(fn, ...args) {
  try { fn?.(...args); } catch (err) { console.error("[Broadcast error]", err); }
}

// ── GET /matches ──────────────────────────────────────────────────────────
matchRouter.get("/", async (req, res) => {
  const parsed = listMatchesQuerySchema.safeParse(req.query);
  if (!parsed.success)
    return res.status(400).json({ error: "Invalid query.", details: parsed.error.issues });

  const { limit = 50, status, sport } = parsed.data;

  try {
    const conditions = [];
    if (status) conditions.push(eq(matches.status, status));
    if (sport)  conditions.push(eq(matches.sport, sport));

    const query = db.select().from(matches).orderBy(desc(matches.createdAt)).limit(Math.min(limit, 100));
    const data  = conditions.length > 0 ? await query.where(and(...conditions)) : await query;

    res.json({ data });
  } catch (err) {
    console.error("[GET /matches]", err);
    res.status(500).json({ error: "Failed to list matches." });
  }
});

// ── GET /matches/:id ──────────────────────────────────────────────────────
matchRouter.get("/:id", async (req, res) => {
  const parsed = matchIdParamSchema.safeParse(req.params);
  if (!parsed.success)
    return res.status(400).json({ error: "Invalid match ID.", details: parsed.error.issues });

  try {
    const match = await findMatch(parsed.data.id);
    if (!match) return res.status(404).json({ error: "Match not found." });

    await syncMatchStatus(match, async (nextStatus) => {
      await db.update(matches).set({ status: nextStatus }).where(eq(matches.id, match.id));
    });

    res.json({ data: match });
  } catch (err) {
    console.error("[GET /matches/:id]", err);
    res.status(500).json({ error: "Failed to fetch match." });
  }
});

// ── POST /matches ─────────────────────────────────────────────────────────
matchRouter.post("/", async (req, res) => {
  const parsed = createMatchSchema.safeParse(req.body);
  if (!parsed.success)
    return res.status(400).json({ error: "Invalid payload.", details: parsed.error.issues });

  const { startTime, endTime, homeScore, awayScore } = parsed.data;

  try {
    const [match] = await db
      .insert(matches)
      .values({
        ...parsed.data,
        startTime: new Date(startTime),
        endTime:   new Date(endTime),
        homeScore: homeScore ?? 0,
        awayScore: awayScore ?? 0,
        status:    getMatchStatus(startTime, endTime),
      })
      .returning();

    broadcast(res.app.locals.broadcastMatchCreated, match);
    res.status(201).json({ data: match });
  } catch (err) {
    console.error("[POST /matches]", err);
    res.status(500).json({ error: "Failed to create match.", details: err.message });
  }
});

// ── PATCH /matches/:id ────────────────────────────────────────────────────
// Edit mutable fields. Only allowed while status is "scheduled".
matchRouter.patch("/:id", async (req, res) => {
  const paramsParsed = matchIdParamSchema.safeParse(req.params);
  if (!paramsParsed.success)
    return res.status(400).json({ error: "Invalid match ID.", details: paramsParsed.error.issues });

  const bodyParsed = editMatchSchema.safeParse(req.body);
  if (!bodyParsed.success)
    return res.status(400).json({ error: "Invalid payload.", details: bodyParsed.error.issues });

  const matchId = paramsParsed.data.id;

  try {
    const existing = await findMatch(matchId);
    if (!existing) return res.status(404).json({ error: "Match not found." });

    if (existing.status !== MATCH_STATUS.SCHEDULED) {
      return res.status(409).json({
        error: "Only scheduled matches can be edited. Use suspend, reschedule, or force-finish for live matches.",
        status: existing.status,
      });
    }

    const updates = { ...bodyParsed.data };
    if (updates.startTime) updates.startTime = new Date(updates.startTime);
    if (updates.endTime)   updates.endTime   = new Date(updates.endTime);

    // Recalculate status if times changed
    if (updates.startTime || updates.endTime) {
      updates.status = getMatchStatus(
        updates.startTime ?? existing.startTime,
        updates.endTime   ?? existing.endTime,
      );
    }

    const [updated] = await db
      .update(matches)
      .set(updates)
      .where(eq(matches.id, matchId))
      .returning();

    broadcast(res.app.locals.broadcastMatchUpdated, updated);
    res.json({ data: updated });
  } catch (err) {
    console.error("[PATCH /matches/:id]", err);
    res.status(500).json({ error: "Failed to update match.", details: err.message });
  }
});

// ── PATCH /matches/:id/score ──────────────────────────────────────────────
matchRouter.patch("/:id/score", async (req, res) => {
  const paramsParsed = matchIdParamSchema.safeParse(req.params);
  if (!paramsParsed.success)
    return res.status(400).json({ error: "Invalid match ID.", details: paramsParsed.error.issues });

  const bodyParsed = updateScoreSchema.safeParse(req.body);
  if (!bodyParsed.success)
    return res.status(400).json({ error: "Invalid payload.", details: bodyParsed.error.issues });

  const matchId = paramsParsed.data.id;

  try {
    const existing = await findMatch(matchId);
    if (!existing) return res.status(404).json({ error: "Match not found." });

    const currentStatus = await syncMatchStatus(existing, async (nextStatus) => {
      await db.update(matches).set({ status: nextStatus }).where(eq(matches.id, matchId));
    });

    if (currentStatus !== MATCH_STATUS.LIVE) {
      return res.status(409).json({
        error: "Score can only be updated while the match is live.",
        status: currentStatus,
      });
    }

    const [updated] = await db
      .update(matches)
      .set({ homeScore: bodyParsed.data.homeScore, awayScore: bodyParsed.data.awayScore })
      .where(eq(matches.id, matchId))
      .returning();

    broadcast(res.app.locals.broadcastScoreUpdate, matchId, {
      matchId,
      homeScore: updated.homeScore,
      awayScore: updated.awayScore,
    });

    res.json({ data: updated });
  } catch (err) {
    console.error("[PATCH /matches/:id/score]", err);
    res.status(500).json({ error: "Failed to update score.", details: err.message });
  }
});

// ── POST /matches/:id/suspend ─────────────────────────────────────────────
// Pauses a live or scheduled match due to an incident.
// Suspended matches can be resumed (rescheduled) or abandoned.
matchRouter.post("/:id/suspend", async (req, res) => {
  const paramsParsed = matchIdParamSchema.safeParse(req.params);
  if (!paramsParsed.success)
    return res.status(400).json({ error: "Invalid match ID.", details: paramsParsed.error.issues });

  const bodyParsed = suspendMatchSchema.safeParse(req.body);
  if (!bodyParsed.success)
    return res.status(400).json({ error: "Invalid payload.", details: bodyParsed.error.issues });

  const matchId = paramsParsed.data.id;

  try {
    const existing = await findMatch(matchId);
    if (!existing) return res.status(404).json({ error: "Match not found." });

    const allowedFrom = [MATCH_STATUS.LIVE, MATCH_STATUS.SCHEDULED];
    if (!allowedFrom.includes(existing.status)) {
      return res.status(409).json({
        error: `Cannot suspend a match with status "${existing.status}". Only live or scheduled matches can be suspended.`,
        status: existing.status,
      });
    }

    const [updated] = await db
      .update(matches)
      .set({
        status:      MATCH_STATUS.SUSPENDED,
        reason:      bodyParsed.data.reason,
        suspendedAt: new Date(),
      })
      .where(eq(matches.id, matchId))
      .returning();

    broadcast(res.app.locals.broadcastMatchSuspended, updated);
    res.json({ data: updated });
  } catch (err) {
    console.error("[POST /matches/:id/suspend]", err);
    res.status(500).json({ error: "Failed to suspend match.", details: err.message });
  }
});

// ── POST /matches/:id/abandon ─────────────────────────────────────────────
// Permanently halts a live or suspended match. No winner is declared.
// Scores are kept as-is for record purposes.
matchRouter.post("/:id/abandon", async (req, res) => {
  const paramsParsed = matchIdParamSchema.safeParse(req.params);
  if (!paramsParsed.success)
    return res.status(400).json({ error: "Invalid match ID.", details: paramsParsed.error.issues });

  const bodyParsed = abandonMatchSchema.safeParse(req.body);
  if (!bodyParsed.success)
    return res.status(400).json({ error: "Invalid payload.", details: bodyParsed.error.issues });

  const matchId = paramsParsed.data.id;

  try {
    const existing = await findMatch(matchId);
    if (!existing) return res.status(404).json({ error: "Match not found." });

    const allowedFrom = [MATCH_STATUS.LIVE, MATCH_STATUS.SUSPENDED];
    if (!allowedFrom.includes(existing.status)) {
      return res.status(409).json({
        error: `Cannot abandon a match with status "${existing.status}". Only live or suspended matches can be abandoned.`,
        status: existing.status,
      });
    }

    const [updated] = await db
      .update(matches)
      .set({
        status: MATCH_STATUS.ABANDONED,
        reason: bodyParsed.data.reason,
      })
      .where(eq(matches.id, matchId))
      .returning();

    broadcast(res.app.locals.broadcastMatchAbandoned, updated);
    res.json({ data: updated });
  } catch (err) {
    console.error("[POST /matches/:id/abandon]", err);
    res.status(500).json({ error: "Failed to abandon match.", details: err.message });
  }
});

// ── POST /matches/:id/reschedule ──────────────────────────────────────────
// Moves a scheduled or suspended match to a new time window.
// Sets status back to "scheduled" based on the new times.
matchRouter.post("/:id/reschedule", async (req, res) => {
  const paramsParsed = matchIdParamSchema.safeParse(req.params);
  if (!paramsParsed.success)
    return res.status(400).json({ error: "Invalid match ID.", details: paramsParsed.error.issues });

  const bodyParsed = rescheduleMatchSchema.safeParse(req.body);
  if (!bodyParsed.success)
    return res.status(400).json({ error: "Invalid payload.", details: bodyParsed.error.issues });

  const matchId = paramsParsed.data.id;

  try {
    const existing = await findMatch(matchId);
    if (!existing) return res.status(404).json({ error: "Match not found." });

    const allowedFrom = [MATCH_STATUS.SCHEDULED, MATCH_STATUS.SUSPENDED];
    if (!allowedFrom.includes(existing.status)) {
      return res.status(409).json({
        error: `Cannot reschedule a match with status "${existing.status}". Only scheduled or suspended matches can be rescheduled.`,
        status: existing.status,
      });
    }

    const newStart = new Date(bodyParsed.data.startTime);
    const newEnd   = new Date(bodyParsed.data.endTime);

    const [updated] = await db
      .update(matches)
      .set({
        startTime:   newStart,
        endTime:     newEnd,
        status:      MATCH_STATUS.SCHEDULED,
        reason:      bodyParsed.data.reason ?? null,
        suspendedAt: null,
      })
      .where(eq(matches.id, matchId))
      .returning();

    broadcast(res.app.locals.broadcastMatchRescheduled, updated);
    res.json({ data: updated });
  } catch (err) {
    console.error("[POST /matches/:id/reschedule]", err);
    res.status(500).json({ error: "Failed to reschedule match.", details: err.message });
  }
});

// ── POST /matches/:id/finish ──────────────────────────────────────────────
// Admin manually ends a live or suspended match immediately.
// Optionally overrides scores. Used when a match ends early due to an incident.
matchRouter.post("/:id/finish", async (req, res) => {
  const paramsParsed = matchIdParamSchema.safeParse(req.params);
  if (!paramsParsed.success)
    return res.status(400).json({ error: "Invalid match ID.", details: paramsParsed.error.issues });

  const bodyParsed = forceFinishSchema.safeParse(req.body);
  if (!bodyParsed.success)
    return res.status(400).json({ error: "Invalid payload.", details: bodyParsed.error.issues });

  const matchId = paramsParsed.data.id;

  try {
    const existing = await findMatch(matchId);
    if (!existing) return res.status(404).json({ error: "Match not found." });

    const allowedFrom = [MATCH_STATUS.LIVE, MATCH_STATUS.SUSPENDED];
    if (!allowedFrom.includes(existing.status)) {
      return res.status(409).json({
        error: `Cannot force-finish a match with status "${existing.status}". Only live or suspended matches can be force-finished.`,
        status: existing.status,
      });
    }

    const [updated] = await db
      .update(matches)
      .set({
        status:    MATCH_STATUS.FINISHED,
        homeScore: bodyParsed.data.homeScore ?? existing.homeScore,
        awayScore: bodyParsed.data.awayScore ?? existing.awayScore,
        reason:    bodyParsed.data.reason ?? null,
        endTime:   new Date(), // record actual end time
      })
      .where(eq(matches.id, matchId))
      .returning();

    broadcast(res.app.locals.broadcastMatchForceFinished, updated);
    res.json({ data: updated });
  } catch (err) {
    console.error("[POST /matches/:id/finish]", err);
    res.status(500).json({ error: "Failed to force-finish match.", details: err.message });
  }
});

// ── DELETE /matches/:id ───────────────────────────────────────────────────
// Hard-deletes a match and all its commentary (CASCADE on FK).
// Only allowed for scheduled or abandoned matches to prevent accidental
// deletion of active games. Use abandon first for live matches.
matchRouter.delete("/:id", async (req, res) => {
  const parsed = matchIdParamSchema.safeParse(req.params);
  if (!parsed.success)
    return res.status(400).json({ error: "Invalid match ID.", details: parsed.error.issues });

  const matchId = parsed.data.id;

  try {
    const existing = await findMatch(matchId);
    if (!existing) return res.status(404).json({ error: "Match not found." });

    const allowedFrom = [MATCH_STATUS.SCHEDULED, MATCH_STATUS.ABANDONED, MATCH_STATUS.FINISHED];
    if (!allowedFrom.includes(existing.status)) {
      return res.status(409).json({
        error: `Cannot delete a "${existing.status}" match. Suspend or abandon it first.`,
        status: existing.status,
        hint: "POST /matches/:id/abandon to halt it, then DELETE.",
      });
    }

    // Commentary rows are deleted automatically via ON DELETE CASCADE
    await db.delete(matches).where(eq(matches.id, matchId));

    broadcast(res.app.locals.broadcastMatchDeleted, matchId);
    res.status(200).json({ data: { matchId, deleted: true } });
  } catch (err) {
    console.error("[DELETE /matches/:id]", err);
    res.status(500).json({ error: "Failed to delete match.", details: err.message });
  }
});