import { Router } from "express";
import {
  createMatchSchema,
  listMatchesQuerySchema,
} from "../validation/matches.js";
import { matches } from "../db/schema.js";
import { db } from "../db/db.js";
import { getMatchStatus } from "../utils/match-status.js";
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

      res.json({data});
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

      if(res.app.locals.broadcastMatchCreated){
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
