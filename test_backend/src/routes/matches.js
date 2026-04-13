// import { Router } from "express";
// import {
//   createMatchSchema,
//   listMatchesQuerySchema,
//   MATCH_STATUS,
// } from "../validation/matches.js";
// import { matches } from "../db/schema.js";
// import { db } from "../db/db.js";
// import { getMatchStatus, syncMatchStatus } from "../utils/match-status.js";
// import { desc, eq } from "drizzle-orm";

// export const matchRouter = Router();

// matchRouter.get("/", async (req, res) => {
//   // res.status(200).json({ message: "Matches List..." });
//   const parsed = listMatchesQuerySchema.safeParse(req.query);
//   console.log("Okay here 1..");
//   if (!parsed.success) {
//     return res.status(400).json({
//       error: "Invalied query",
//       details: JSON.stringify(parsed.error),
//     });
//   }
//   console.log("Okay here 2..");

//   const limit = Math.min(parsed.data.limit ?? 50, 100);

//   console.log("Okay here 3..");
//   try {
//     const data = await db
//       .select()
//       .from(matches)
//       .orderBy(desc(matches.createdAt))
//       .limit(limit);

//     res.json({ data });
//   } catch (err) {
//     res.status(500).json({ error: "Failed to list Matches..." });
//   }
// });

// matchRouter.post("/", async (req, res) => {
//   // res.status(200).json({message:'Matches List...'});

//   const parsed = createMatchSchema.safeParse(req.body);
//   if (!parsed.success) {
//     return res.status(400).json({
//       error: "Invalied payload",
//       details: JSON.stringify(parsed.error),
//     });
//   }
//   const {
//     data: { startTime, endTime, homeScore, awayScore },
//   } = parsed;

//   try {
//     const [event] = await db
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

//     if (res.app.locals.broadcastMatchCreated) {
//       res.app.locals.broadcastMatchCreated(event);
//     }

//     res.status(201).json({ data: event });
//   } catch (error) {
//     return res.status(500).json({
//       error: "Failed to create match",
//       details: JSON.stringify(parsed.error),
//     });
//   }
// });

// matchRouter.patch("/:id/score", async (req, res) => {
//   // res.status(200).json({message:'Matches List...'});

//   const paramsParsed = matchIdParamSchema.safeParse(req.params);
//   if (!paramsParsed.success) {
//     return res.status(400).json({
//       error: "Invalied match Id",
//       // details: JSON.stringify(parsed.error),
//       details: formatZodError(paramsParsed.error),
//     });
//   }
//   const parsed = updateScoreSchema.safeParse(req.body);
//   if (!parsed.success) {
//     return res.status(400).json({
//       error: "Invalid Payload",
//       // details: JSON.stringify(parsed.error),
//       details: formatZodError(parsed.error),
//     });
//   }

//   const matchId = paramsParsed.data.id;

//   try {
//     const [existing] = await db
//       .select({
//         id: matches.id,
//         status: matches.status,
//         startTime: matches.startTime,
//         endTime: matches.endTime,
//       })
//       .from(matches)
//       .where(eq(matches.id, matchId))
//       .limit(1);

//     if (!existing) {
//       return res.status(404).json({ error: "Match not found" });
//     }

//     await syncMatchStatus(existing, async (nexyStatus) => {
//       await db
//         .update(matches)
//         .set({ status: nexyStatus })
//         .where(eq(matches.id, matchId));
//     });

//     if (existing.status !== MATCH_STATUS.LIVE) {
//       return res.status(409).json({ error: "Match is not Live" });
//     }

//     const [updated] = await db
//       .update(matches)
//       .set({
//         homeScore: parsed.data.homeScore,
//         awayScore: parsed.data.awayScore,
//       })
//       .where(eq(matches.id, matchId));

//     if (res.app.locals.broadcastScoreUpdate) {
//       res.app.locals.broadcastScoreUpdate(matchId, {
//         homeScore: updated.homeScore,
//         awayScore: updated.awayScore,
//       });
//     }

//     res.status(200).json({ data: updated });
//   } catch (error) {
//     return res.status(500).json({
//       error: "Failed to update score",
//       details: JSON.stringify(parsed.error),
//     });
//   }
// });

import { Router } from "express";
import {
  createMatchSchema,
  listMatchesQuerySchema,
  // FIX #4: matchIdParamSchema and updateScoreSchema were used in the PATCH
  // handler but never imported, causing an immediate ReferenceError on every
  // PATCH /:id/score request.
  matchIdParamSchema,
  updateScoreSchema,
  MATCH_STATUS,
} from "../validation/matches.js";
import { matches } from "../db/schema.js";
import { db } from "../db/db.js";
import { getMatchStatus, syncMatchStatus } from "../utils/match-status.js";
import { desc, eq } from "drizzle-orm";

export const matchRouter = Router();

matchRouter.get("/", async (req, res) => {
  const parsed = listMatchesQuerySchema.safeParse(req.query);
  if (!parsed.success) {
    return res.status(400).json({
      error: "Invalid query",
      details: parsed.error.issues,
    });
  }

  const limit = Math.min(parsed.data.limit ?? 50, 100);

  try {
    const data = await db
      .select()
      .from(matches)
      .orderBy(desc(matches.createdAt))
      .limit(limit);

    res.json({ data });
  } catch (err) {
    res.status(500).json({ error: "Failed to list Matches." });
  }
});

// matchRouter.post("/", async (req, res) => {
//   const parsed = createMatchSchema.safeParse(req.body);
//   if (!parsed.success) {
//     return res.status(400).json({
//       error: "Invalid payload",
//       details: parsed.error.issues,
//     });
//   }

//   const {
//     data: { startTime, endTime, homeScore, awayScore },
//   } = parsed;

//   try {
//     const [event] = await db
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

//     if (res.app.locals.broadcastMatchCreated) {
//       res.app.locals.broadcastMatchCreated(event);
//     }

//     res.status(201).json({ data: event });
//   } catch (error) {
//     return res.status(500).json({
//       error: "Failed to create match",
//       details: error.message,
//     });
//   }
// });



matchRouter.post("/", async (req, res) => {
  const parsed = createMatchSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({
      error: "Invalid payload",
      details: parsed.error.issues,
    });
  }

  const {
    startTime,
    endTime,
    homeScore,
    awayScore,
  } = parsed.data;

  const safeStartTime = startTime ? new Date(startTime) : null;
  const safeEndTime = endTime ? new Date(endTime) : null;

  console.log('Inserting into db...');

  try {
    const [event] = await db
      .insert(matches)
      .values({
        ...parsed.data,
        startTime: safeStartTime,
        endTime: safeEndTime,
        homeScore: homeScore ?? 0,
        awayScore: awayScore ?? 0,
        status: getMatchStatus(safeStartTime, safeEndTime),
      })
      .returning();

       console.log('Insertion into db done...');

    if (res.app.locals.broadcastMatchCreated) {
      res.app.locals.broadcastMatchCreated(event);
    }

    res.status(201).json({ data: event });
  } catch (error) {
    console.error(error); // 🔥 ALWAYS log full error
    return res.status(500).json({
      error: "Failed to create match",
      details: error.message,
    });
  }
});

matchRouter.patch("/:id/score", async (req, res) => {
  const paramsParsed = matchIdParamSchema.safeParse(req.params);
  if (!paramsParsed.success) {
    return res.status(400).json({
      error: "Invalid match ID",
      // FIX #5: formatZodError was called but never imported or defined anywhere
      // in the codebase. Replaced with .issues which is the standard Zod shape.
      details: paramsParsed.error.issues,
    });
  }

  const parsed = updateScoreSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({
      error: "Invalid payload",
      details: parsed.error.issues,
    });
  }

  const matchId = paramsParsed.data.id;

  try {
    const [existing] = await db
      .select({
        id: matches.id,
        status: matches.status,
        startTime: matches.startTime,
        endTime: matches.endTime,
      })
      .from(matches)
      .where(eq(matches.id, matchId))
      .limit(1);

    if (!existing) {
      return res.status(404).json({ error: "Match not found" });
    }

    // FIX #7: Use the explicit return value of syncMatchStatus rather than
    // relying on the implicit in-place mutation of existing.status, which is
    // fragile and easy to break if syncMatchStatus is refactored.
    const currentStatus = await syncMatchStatus(
      existing,
      async (nextStatus) => {
        await db
          .update(matches)
          .set({ status: nextStatus })
          .where(eq(matches.id, matchId));
      },
    );

    if (currentStatus !== MATCH_STATUS.LIVE) {
      return res.status(409).json({ error: "Match is not Live" });
    }

    // FIX #6: .update() without .returning() gives back query metadata, not the
    // updated row. updated was always undefined, crashing the broadcast below.
    const [updated] = await db
      .update(matches)
      .set({
        homeScore: parsed.data.homeScore,
        awayScore: parsed.data.awayScore,
      })
      .where(eq(matches.id, matchId))
      .returning();

    if (res.app.locals.broadcastScoreUpdate) {
      res.app.locals.broadcastScoreUpdate(matchId, {
        homeScore: updated.homeScore,
        awayScore: updated.awayScore,
      });
    }

    res.status(200).json({ data: updated });
  } catch (error) {
    return res.status(500).json({
      error: "Failed to update score",
      details: error.message,
    });
  }
});
