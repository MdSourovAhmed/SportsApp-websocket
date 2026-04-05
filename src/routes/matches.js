import { Router } from "express";
import {
  createMatchSchema,
  listMatchesQuerySchema,
  MATCH_STATUS,
} from "../validation/matches.js";
import { matches } from "../db/schema.js";
import { db } from "../db/db.js";
import { getMatchStatus, syncMatchStatus } from "../utils/match-status.js";
import { desc } from "drizzle-orm";

export const matchRouter = Router();

matchRouter.get("/", async (req, res) => {
  // res.status(200).json({ message: "Matches List..." });
  const parsed = listMatchesQuerySchema.safeParse(req.query);

  if (!parsed.success) {
    return res.status(400).json({
      error: "Invalied query",
      details: JSON.stringify(parsed.error),
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
    res.status(500).json({ error: "Failed to list Matches..." });
  }
});

matchRouter.post("/", async (req, res) => {
  // res.status(200).json({message:'Matches List...'});

  const parsed = createMatchSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({
      error: "Invalied payload",
      details: JSON.stringify(parsed.error),
    });
  }
  const {
    data: { startTime, endTime, homeScore, awayScore },
  } = parsed;

  try {
    const [event] = await db
      .insert(matches)
      .values({
        ...parsed.data,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        homeScore: homeScore ?? 0,
        awayScore: awayScore ?? 0,
        status: getMatchStatus(startTime, endTime),
      })
      .returning();

    if (res.app.locals.broadcastMatchCreated) {
      res.app.locals.broadcastMatchCreated(event);
    }

    res.status(201).json({ data: event });
  } catch (error) {
    return res.status(500).json({
      error: "Failed to create match",
      details: JSON.stringify(parsed.error),
    });
  }
});

matchRouter.patch("/:id/score", async (req, res) => {
  // res.status(200).json({message:'Matches List...'});

  const paramsParsed = createMatchSchema.safeParse(req.params);
  if (!paramsParsed.success) {
    return res.status(400).json({
      error: "Invalied match Id",
      // details: JSON.stringify(parsed.error),
      details: formatZodError(parsed.error),
    });
  }
  const parsed = createMatchSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({
      error: "Invalied Payload",
      // details: JSON.stringify(parsed.error),
      details: formatZodError(parsed.error),
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

    await syncMatchStatus(existing, async (nexyStatus) => {
      await db
        .update(matches)
        .set({ status: nexyStatus })
        .where(eq(matches.id, matchId));
    });

    if (existing.status !== MATCH_STATUS.LIVE) {
      return res.status(409).json({ error: "Match is not Live" });
    }

    const [updated] = await db
      .update(matches)
      .set({
        homeScore: parsed.data.homeScore,
        awayScore: parsed.data.awayScore,
      })
      .where(eq(matches.id, matchId));

    if (res.app.locals.broadcastScoreUpdate) {
      res.app.locals.broadcastScoreUpdate(matchId, {
        homeScore: updated.homeScore,
        awayScore: updated.awayScore,
      });
    }

    res.status(201).json({ data: updated });
  } catch (error) {
    return res.status(500).json({
      error: "Failed to update score",
      details: JSON.stringify(parsed.error),
    });
  }
});
