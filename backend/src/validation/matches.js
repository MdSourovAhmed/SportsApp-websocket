
// import { z } from "zod";

// export const MATCH_STATUS = {
//   SCHEDULED: "scheduled",
//   LIVE:      "live",
//   FINISHED:  "finished",
// };

// export const listMatchesQuerySchema = z.object({
//   limit:  z.coerce.number().int().positive().max(100).optional(),
//   status: z.enum(["scheduled", "live", "finished"]).optional(),
//   sport:  z.string().min(1).optional(),
// });

// export const matchIdParamSchema = z.object({
//   id: z.coerce.number().int().positive(),
// });

// export const createMatchSchema = z
//   .object({
//     sport:     z.string().min(1),
//     homeTeam:  z.string().min(1),
//     awayTeam:  z.string().min(1),
//     startTime: z.string().datetime(),
//     endTime:   z.string().datetime(),
//     homeScore: z.coerce.number().int().nonnegative().optional(),
//     awayScore: z.coerce.number().int().nonnegative().optional(),
//   })
//   .superRefine((data, ctx) => {
//     if (new Date(data.endTime) <= new Date(data.startTime)) {
//       ctx.addIssue({
//         code: z.ZodIssueCode.custom,
//         message: "endTime must be after startTime",
//         path: ["endTime"],
//       });
//     }
//   });

// export const updateScoreSchema = z.object({
//   homeScore: z.coerce.number().int().nonnegative(),
//   awayScore: z.coerce.number().int().nonnegative(),
// });



// import { z } from "zod";

// // ── Status constants ──────────────────────────────────────────────────────
// export const MATCH_STATUS = {
//   SCHEDULED:  "scheduled",
//   LIVE:       "live",
//   FINISHED:   "finished",
//   SUSPENDED:  "suspended",
//   ABANDONED:  "abandoned",
// };

// // All valid statuses as a Zod enum
// export const matchStatusEnum = z.enum([
//   "scheduled", "live", "finished", "suspended", "abandoned",
// ]);

// // ── List query ────────────────────────────────────────────────────────────
// export const listMatchesQuerySchema = z.object({
//   limit:  z.coerce.number().int().positive().max(100).optional(),
//   status: matchStatusEnum.optional(),
//   sport:  z.string().min(1).optional(),
// });

// // ── Param ─────────────────────────────────────────────────────────────────
// export const matchIdParamSchema = z.object({
//   id: z.coerce.number().int().positive(),
// });

// // ── Create ────────────────────────────────────────────────────────────────
// export const createMatchSchema = z
//   .object({
//     sport:     z.string().min(1),
//     homeTeam:  z.string().min(1),
//     awayTeam:  z.string().min(1),
//     startTime: z.string().datetime(),
//     endTime:   z.string().datetime(),
//     homeScore: z.coerce.number().int().nonnegative().optional(),
//     awayScore: z.coerce.number().int().nonnegative().optional(),
//   })
//   .superRefine((data, ctx) => {
//     if (new Date(data.endTime) <= new Date(data.startTime)) {
//       ctx.addIssue({
//         code: z.ZodIssueCode.custom,
//         message: "endTime must be after startTime",
//         path: ["endTime"],
//       });
//     }
//   });

// // ── Score update ──────────────────────────────────────────────────────────
// export const updateScoreSchema = z.object({
//   homeScore: z.coerce.number().int().nonnegative(),
//   awayScore: z.coerce.number().int().nonnegative(),
// });

// // ── Edit (partial update of mutable fields) ───────────────────────────────
// // Only allowed while status is "scheduled". Validated in the route handler.
// export const editMatchSchema = z
//   .object({
//     sport:     z.string().min(1).optional(),
//     homeTeam:  z.string().min(1).optional(),
//     awayTeam:  z.string().min(1).optional(),
//     startTime: z.string().datetime().optional(),
//     endTime:   z.string().datetime().optional(),
//     homeScore: z.coerce.number().int().nonnegative().optional(),
//     awayScore: z.coerce.number().int().nonnegative().optional(),
//   })
//   .refine((d) => Object.keys(d).length > 0, {
//     message: "At least one field must be provided.",
//   })
//   .superRefine((data, ctx) => {
//     if (data.startTime && data.endTime) {
//       if (new Date(data.endTime) <= new Date(data.startTime)) {
//         ctx.addIssue({
//           code: z.ZodIssueCode.custom,
//           message: "endTime must be after startTime",
//           path: ["endTime"],
//         });
//       }
//     }
//   });

// // ── Suspend ───────────────────────────────────────────────────────────────
// // Pauses a live or scheduled match. Requires a reason for the viewers.
// export const suspendMatchSchema = z.object({
//   reason: z.string().min(3, "Please provide a reason (min 3 chars)."),
// });

// // ── Abandon ───────────────────────────────────────────────────────────────
// // Permanently halts a live or suspended match. Requires a reason.
// export const abandonMatchSchema = z.object({
//   reason: z.string().min(3, "Please provide a reason (min 3 chars)."),
// });

// // ── Reschedule ────────────────────────────────────────────────────────────
// // Moves a scheduled or suspended match to a new time.
// export const rescheduleMatchSchema = z
//   .object({
//     startTime: z.string().datetime(),
//     endTime:   z.string().datetime(),
//     reason:    z.string().min(3).optional(),
//   })
//   .superRefine((data, ctx) => {
//     if (new Date(data.endTime) <= new Date(data.startTime)) {
//       ctx.addIssue({
//         code: z.ZodIssueCode.custom,
//         message: "endTime must be after startTime",
//         path: ["endTime"],
//       });
//     }
//   });

// // ── Force-finish ──────────────────────────────────────────────────────────
// // Admin manually ends a live or suspended match with the current (or overridden) scores.
// export const forceFinishSchema = z.object({
//   homeScore: z.coerce.number().int().nonnegative().optional(),
//   awayScore: z.coerce.number().int().nonnegative().optional(),
//   reason:    z.string().min(3).optional(),
// });



import { z } from "zod";

// ── Status constants ──────────────────────────────────────────────────────
export const MATCH_STATUS = {
  SCHEDULED:  "scheduled",
  LIVE:       "live",
  FINISHED:   "finished",
  SUSPENDED:  "suspended",
  ABANDONED:  "abandoned",
};

// All valid statuses as a Zod enum
export const matchStatusEnum = z.enum([
  "scheduled", "live", "finished", "suspended", "abandoned",
]);

// ── List query ────────────────────────────────────────────────────────────
export const listMatchesQuerySchema = z.object({
  limit:  z.coerce.number().int().positive().max(100).optional(),
  status: matchStatusEnum.optional(),
  sport:  z.string().min(1).optional(),
});

// ── Param ─────────────────────────────────────────────────────────────────
export const matchIdParamSchema = z.object({
  id: z.coerce.number().int().positive(),
});

// ── Create ────────────────────────────────────────────────────────────────
export const createMatchSchema = z
  .object({
    sport:     z.string().min(1),
    homeTeam:  z.string().min(1),
    awayTeam:  z.string().min(1),
    startTime: z.string().datetime(),
    endTime:   z.string().datetime(),
    homeScore: z.coerce.number().int().nonnegative().optional(),
    awayScore: z.coerce.number().int().nonnegative().optional(),
  })
  .superRefine((data, ctx) => {
    if (new Date(data.endTime) <= new Date(data.startTime)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "endTime must be after startTime",
        path: ["endTime"],
      });
    }
  });

// ── Score update ──────────────────────────────────────────────────────────
export const updateScoreSchema = z.object({
  homeScore: z.coerce.number().int().nonnegative(),
  awayScore: z.coerce.number().int().nonnegative(),
});

// ── Edit (partial update of mutable fields) ───────────────────────────────
// Only allowed while status is "scheduled". Validated in the route handler.
export const editMatchSchema = z
  .object({
    sport:     z.string().min(1).optional(),
    homeTeam:  z.string().min(1).optional(),
    awayTeam:  z.string().min(1).optional(),
    startTime: z.string().datetime().optional(),
    endTime:   z.string().datetime().optional(),
    homeScore: z.coerce.number().int().nonnegative().optional(),
    awayScore: z.coerce.number().int().nonnegative().optional(),
  })
  .refine((d) => Object.keys(d).length > 0, {
    message: "At least one field must be provided.",
  })
  .superRefine((data, ctx) => {
    if (data.startTime && data.endTime) {
      if (new Date(data.endTime) <= new Date(data.startTime)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "endTime must be after startTime",
          path: ["endTime"],
        });
      }
    }
  });

// ── Suspend ───────────────────────────────────────────────────────────────
// Pauses a live or scheduled match. Requires a reason for the viewers.
export const suspendMatchSchema = z.object({
  reason: z.string().min(3, "Please provide a reason (min 3 chars)."),
});

// ── Abandon ───────────────────────────────────────────────────────────────
// Permanently halts a live or suspended match. Requires a reason.
export const abandonMatchSchema = z.object({
  reason: z.string().min(3, "Please provide a reason (min 3 chars)."),
});

// ── Reschedule ────────────────────────────────────────────────────────────
// Moves a scheduled or suspended match to a new time.
export const rescheduleMatchSchema = z
  .object({
    startTime: z.string().datetime(),
    endTime:   z.string().datetime(),
    reason:    z.string().min(3).optional(),
  })
  .superRefine((data, ctx) => {
    if (new Date(data.endTime) <= new Date(data.startTime)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "endTime must be after startTime",
        path: ["endTime"],
      });
    }
  });

// ── Force-finish ──────────────────────────────────────────────────────────
// Admin manually ends a live or suspended match with the current (or overridden) scores.
export const forceFinishSchema = z.object({
  homeScore: z.coerce.number().int().nonnegative().optional(),
  awayScore: z.coerce.number().int().nonnegative().optional(),
  reason:    z.string().min(3).optional(),
});