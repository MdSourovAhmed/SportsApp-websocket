import { Router } from "express";

import { commentry } from "../db/schema.js";
import {
  createCommentarySchema,
  listCommentaryQuerySchema,
} from "../validation/commentary.js";
import { matchIdParamSchema } from "../validation/matches.js";
import { db } from "../db/db.js";
import { desc,eq } from "drizzle-orm";

// const router = express.Router();
export const commentaryRouter = Router({ mergeParams: true });

const MAX_LIMIT = 100;

commentaryRouter.get("/", async (req, res) => {
  console.log("Serving Commentary List...");

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

  try {
    const { id: matchId } = paramsResult.data;
    const { limit = 10 } = queryResult.data;

    const safeLimit = Math.min(limit, MAX_LIMIT);

    const results = await db
      .select()
      .from(commentry)
      .where(eq(commentry.matchId, matchId))
      .orderBy(desc(commentry.createdAt))
      .limit(safeLimit);
    res.status(200).json({ data: results });
  } catch (error) {
    console.error("Failed to fetch commentary: ", error);
  }
});

commentaryRouter.post("/", async (req, res) => {
  const paramResult = matchIdParamSchema.safeParse(req.params);
  console.log("It's working...");

  if (!paramResult.success) {
    return res
      .status(400)
      .json({ error: "Invalied match Id", details: paramResult.error.issues });
  }
  const bodyResult = createCommentarySchema.safeParse(req.body);

  if (!bodyResult.success) {
    return res.status(400).json({
      error: "Invalied commentary payload",
      details: bodyResult.error.issues,
    });
  }

  try {
    const { minute, ...rest } = bodyResult.data;
    const [result] = await db
      .insert(commentry)
      .values({
        matchId: paramResult.data.id,
        minute,
        ...rest,
      })
      .returning();

    try {
      res.app.locals.broadcastCommentary?.(result.matchId, result);
    } catch (broadcastError) {
      console.error("Broadcast commentary error:", broadcastError);
    }

    res.status(201).json({ data: result });
  } catch (error) {
    console.error("Create commentary error:", error);

    // Detect Postgres foreign key violation from db.insert(commentry).values(...)
    if (
      error?.code === "23503" ||
      error?.message?.toLowerCase().includes("foreign key") ||
      error?.message?.includes("commentry_match_id")
    ) {
      return res.status(404).json({ error: "Match not found" });
    }

    res.status(500).json({
      error: "Failed to create commentary.",
    });
  }
});

// export default commentaryRouter;
