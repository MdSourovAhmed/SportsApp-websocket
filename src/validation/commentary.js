// import { z } from "zod";

// export const listCommentryQuerySchema = z.object({
//   limit: z.coerce.number().int().positive().max(100).optional(),
// });

// // export const commentryIdParamSchema = z.object({
// //   id: z.coerce.number().int().positive(),
// // });

// // export const matchIdParamSchema = z.object({
// //   matchId: z.coerce.number().int().positive(),
// // });

// export const createCommentrySchema = z.object({
// //   matchId: z.coerce.number().int().positive(),

//   minute: z.coerce.number().int().nonnegative().optional(),

//   sequence: z.coerce.number().int().nonnegative().optional(),

//   sport: z.string().min(1),

//   period: z.string().min(1).optional(),

//   eventType: z.string().min(1).optional(),

//   actor: z.string().min(1).optional(),

//   team: z.string().min(1).optional(),

//   message: z.string().min(1),

//   metadata: z.record(z.string(), z.any()).optional(),

//   tags: z.array(z.string()).optional(),
// });

import { z } from "zod";

export const listCommentaryQuerySchema = z.object({
  limit: z.coerce.number().int().positive().max(100).optional(),
});

export const createCommentarySchema  = z.object({
  sport: z.string().min(1),
  minute: z.coerce.number().int().nonnegative(),
  sequence: z.coerce.number().int().optional(),
  period: z.string().optional(),
  eventType: z.string().optional(),
  actor: z.string().optional(),
  team: z.string().optional(),
  message: z.string().min(1),
  metadata: z.record(z.string(), z.any()).optional(),
  tags: z.array(z.string()).optional(),
});
