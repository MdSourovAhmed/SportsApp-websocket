// import {
//   pgTable,
//   serial,
//   text,
//   integer,
//   timestamp,
//   pgEnum,
//   jsonb,
// } from "drizzle-orm/pg-core";

// export const matchStatusEnum = pgEnum("match_status", [
//   "scheduled",
//   "live",
//   "finished",
// ]);

// export const matches = pgTable("matches", {
//   id:        serial("id").primaryKey(),
//   sport:     text("sport").notNull(),
//   homeTeam:  text("home_team").notNull(),
//   awayTeam:  text("away_team").notNull(),
//   status:    matchStatusEnum("status").notNull().default("scheduled"),
//   startTime: timestamp("start_time"),
//   endTime:   timestamp("end_time"),
//   homeScore: integer("home_score").notNull().default(0),
//   awayScore: integer("away_score").notNull().default(0),
//   createdAt: timestamp("created_at").notNull().defaultNow(),
// });

// // Note: table name is kept as "commentry" to match the original migration.
// // Rename via a new migration if you want to correct the spelling.
// export const commentry = pgTable("commentry", {
//   id:        serial("id").primaryKey(),
//   matchId:   integer("match_id")
//                .notNull()
//                .references(() => matches.id),
//   minute:    integer("minute"),
//   sequence:  integer("sequence"),
//   sport:     text("sport").notNull(),
//   period:    text("period"),
//   eventType: text("event_type"),
//   actor:     text("actor"),
//   team:      text("team"),
//   message:   text("message").notNull(),
//   metadata:  jsonb("metadata"),
//   tags:      text("tags").array(),
//   createdAt: timestamp("created_at").notNull().defaultNow(),
// });



// import {
//   pgTable,
//   serial,
//   text,
//   integer,
//   timestamp,
//   pgEnum,
//   jsonb,
// } from "drizzle-orm/pg-core";

// // ── Status enum ───────────────────────────────────────────────────────────
// // suspended : admin manually paused the match (casualty, weather, etc.)
// // abandoned : match cannot continue and is permanently halted
// export const matchStatusEnum = pgEnum("match_status", [
//   "scheduled",
//   "live",
//   "finished",
//   "suspended",
//   "abandoned",
// ]);

// // ── matches ───────────────────────────────────────────────────────────────
// export const matches = pgTable("matches", {
//   id:          serial("id").primaryKey(),
//   sport:       text("sport").notNull(),
//   homeTeam:    text("home_team").notNull(),
//   awayTeam:    text("away_team").notNull(),
//   status:      matchStatusEnum("status").notNull().default("scheduled"),
//   startTime:   timestamp("start_time"),
//   endTime:     timestamp("end_time"),
//   homeScore:   integer("home_score").notNull().default(0),
//   awayScore:   integer("away_score").notNull().default(0),
//   // Reason stored when admin suspends, abandons, or force-finishes a match.
//   // Shown to viewers in the UI so they know why the match state changed.
//   reason:      text("reason"),
//   // Timestamp of the most recent admin-triggered status override.
//   suspendedAt: timestamp("suspended_at"),
//   createdAt:   timestamp("created_at").notNull().defaultNow(),
// });

// // ── commentry ─────────────────────────────────────────────────────────────
// // Table name kept as "commentry" to match the original migration.
// export const commentry = pgTable("commentry", {
//   id:        serial("id").primaryKey(),
//   matchId:   integer("match_id")
//                .notNull()
//                .references(() => matches.id, { onDelete: "cascade" }),
//   minute:    integer("minute"),
//   sequence:  integer("sequence"),
//   sport:     text("sport").notNull(),
//   period:    text("period"),
//   eventType: text("event_type"),
//   actor:     text("actor"),
//   team:      text("team"),
//   message:   text("message").notNull(),
//   metadata:  jsonb("metadata"),
//   tags:      text("tags").array(),
//   createdAt: timestamp("created_at").notNull().defaultNow(),
// });




import {
  pgTable,
  serial,
  text,
  integer,
  timestamp,
  pgEnum,
  jsonb,
} from "drizzle-orm/pg-core";

// ── Status enum ───────────────────────────────────────────────────────────
// suspended : admin manually paused the match (casualty, weather, etc.)
// abandoned : match cannot continue and is permanently halted
export const matchStatusEnum = pgEnum("match_status", [
  "scheduled",
  "live",
  "finished",
  "suspended",
  "abandoned",
]);

// ── matches ───────────────────────────────────────────────────────────────
export const matches = pgTable("matches", {
  id:          serial("id").primaryKey(),
  sport:       text("sport").notNull(),
  homeTeam:    text("home_team").notNull(),
  awayTeam:    text("away_team").notNull(),
  status:      matchStatusEnum("status").notNull().default("scheduled"),
  startTime:   timestamp("start_time"),
  endTime:     timestamp("end_time"),
  homeScore:   integer("home_score").notNull().default(0),
  awayScore:   integer("away_score").notNull().default(0),
  // Reason stored when admin suspends, abandons, or force-finishes a match.
  // Shown to viewers in the UI so they know why the match state changed.
  reason:      text("reason"),
  // Timestamp of the most recent admin-triggered status override.
  suspendedAt: timestamp("suspended_at"),
  createdAt:   timestamp("created_at").notNull().defaultNow(),
});

// ── commentry ─────────────────────────────────────────────────────────────
// Table name kept as "commentry" to match the original migration.
export const commentry = pgTable("commentry", {
  id:        serial("id").primaryKey(),
  matchId:   integer("match_id")
               .notNull()
               .references(() => matches.id, { onDelete: "cascade" }),
  minute:    integer("minute"),
  sequence:  integer("sequence"),
  sport:     text("sport").notNull(),
  period:    text("period"),
  eventType: text("event_type"),
  actor:     text("actor"),
  team:      text("team"),
  message:   text("message").notNull(),
  metadata:  jsonb("metadata"),
  tags:      text("tags").array(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});