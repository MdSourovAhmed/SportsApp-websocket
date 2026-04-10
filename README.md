# 🏟️ Live Sports Score API

A real-time sports match tracking backend built with **Node.js**, **Express**, **Drizzle ORM**, and **WebSockets**. Supports live score updates, match commentary, and per-match subscriptions pushed instantly to connected clients.

---

## Features

- **REST API** for creating matches, updating scores, and posting commentary
- **WebSocket server** for real-time score and commentary broadcasts
- **Per-match subscriptions** — clients only receive events for matches they subscribe to
- **Automatic match status sync** — scheduled → live → finished based on start/end times
- **Request protection** via [Arcjet](https://arcjet.com) (bot detection, rate limiting, shield)
- **Schema validation** with Zod on all inputs
- **PostgreSQL** database with Drizzle ORM migrations

---

## Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js (ESM) |
| Framework | Express |
| Database | PostgreSQL via `pg` |
| ORM | Drizzle ORM |
| Real-time | `ws` WebSocket server |
| Validation | Zod v3 |
| Security | Arcjet |
| Config | dotenv |

---

## Project Structure

```
src/
├── db/
│   ├── db.js           # pg Pool + Drizzle client
│   └── schema.js       # Table definitions (matches, commentry)
├── routes/
│   ├── matches.js      # GET /matches, POST /matches, PATCH /matches/:id/score
│   └── commentary.js   # GET + POST /matches/:id/commentary
├── utils/
│   └── match-status.js # Status calculation and sync logic
├── validation/
│   ├── matches.js      # Zod schemas for match routes
│   └── commentary.js   # Zod schemas for commentary routes
├── ws/
│   └── server.js       # WebSocket server, subscriptions, broadcasts
├── arcjet.js           # Arcjet HTTP + WS protection, security middleware
└── server.js           # App entry point
drizzle.config.js
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database (local or hosted — Neon, Supabase, Railway, etc.)

### Installation

```bash
git clone https://github.com/your-username/your-repo.git
cd your-repo
npm install
```

### Environment Variables

Create a `.env` file in the project root:

```env
# Required
DATABASE_URL=postgresql://user:password@host:5432/dbname

# Server (optional, defaults shown)
PORT=7000
HOST=0.0.0.0
NODE_ENV=development

# Arcjet (optional — protection is disabled if not set)
ARCJET_KEY=your_arcjet_key_here
ARCJET_MODE=LIVE        # or DRY_RUN to log decisions without blocking

# WebSocket CSP origin (optional)
WS_ORIGIN=ws://localhost:7000
```

> **Hosted databases**: SSL is automatically enabled when `NODE_ENV=production`. Most providers (Neon, Supabase, Railway) require this.

### Database Setup

```bash
# Generate migration files from schema
npm run db:generate

# Apply migrations to your database
npm run db:migrate
```

### Run

```bash
# Development
npm run dev

# Production
npm start
```

The server starts at `http://localhost:7000` and the WebSocket server at `ws://localhost:7000/ws`.

---

## REST API

### Health

```
GET /health
```

### Matches

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/matches` | List matches (newest first) |
| `POST` | `/matches` | Create a match |
| `PATCH` | `/matches/:id/score` | Update score (match must be LIVE) |

**POST `/matches` — request body**
```json
{
  "sport": "football",
  "homeTeam": "Arsenal",
  "awayTeam": "Chelsea",
  "startTime": "2025-09-01T15:00:00Z",
  "endTime": "2025-09-01T17:00:00Z",
  "homeScore": 0,
  "awayScore": 0
}
```

**PATCH `/matches/:id/score` — request body**
```json
{
  "homeScore": 2,
  "awayScore": 1
}
```

> Score updates are only accepted when the match status is `live`. The status is automatically synced against the current time on every request.

**Query parameters for `GET /matches`**

| Param | Type | Default | Max |
|---|---|---|---|
| `limit` | integer | 50 | 100 |

### Commentary

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/matches/:id/commentary` | List commentary for a match |
| `POST` | `/matches/:id/commentary` | Post a commentary event |

**POST `/matches/:id/commentary` — request body**
```json
{
  "sport": "football",
  "minute": 67,
  "sequence": 1,
  "period": "second_half",
  "eventType": "goal",
  "actor": "Saka",
  "team": "Arsenal",
  "message": "GOAL! Bukayo Saka tucks it into the bottom corner.",
  "tags": ["goal", "saka"]
}
```

**Query parameters for `GET /matches/:id/commentary`**

| Param | Type | Default | Max |
|---|---|---|---|
| `limit` | integer | 10 | 100 |

---

## Match Status

Matches transition automatically based on `startTime` and `endTime`:

```
now < startTime   →  scheduled
now >= startTime  →  live
now >= endTime    →  finished
```

Status is recalculated and synced to the database on every score update request.

---

## WebSocket

Connect to `ws://localhost:7000/ws`.

On connection you receive a welcome message:
```json
{ "type": "welcome" }
```

### Client → Server messages

**Subscribe to a match**
```json
{ "type": "subscribe", "matchId": 42 }
```
```json
{ "type": "subscribed", "matchId": 42 }
```

**Unsubscribe from a match**
```json
{ "type": "unsubscribe", "matchId": 42 }
```
```json
{ "type": "unsubscribed", "matchId": 42 }
```

### Server → Client events

| Event type | Delivered to | Triggered by |
|---|---|---|
| `match_created` | All connected clients | `POST /matches` |
| `score_update` | Subscribers of that match | `PATCH /matches/:id/score` |
| `commentary` | Subscribers of that match | `POST /matches/:id/commentary` |

**`score_update` payload**
```json
{
  "type": "score_update",
  "data": { "homeScore": 2, "awayScore": 1 }
}
```

**`commentary` payload**
```json
{
  "type": "commentary",
  "data": { "matchId": 42, "minute": 67, "message": "GOAL! ..." }
}
```

Slow clients (buffered > 1 MB) are terminated automatically. A heartbeat ping runs every 30 seconds to cull dead connections.

---

## Security

Protection is provided by [Arcjet](https://arcjet.com) and is **optional** — the server runs without it if `ARCJET_KEY` is not set.

When enabled:

| Layer | Rules |
|---|---|
| HTTP | Shield, bot detection, sliding window: 50 req / 10s |
| WebSocket upgrades | Shield, bot detection, sliding window: 5 req / 2s |

Set `ARCJET_MODE=DRY_RUN` to log decisions without blocking traffic — useful for tuning limits before going live.

---

## Database Schema

### `matches`

| Column | Type | Notes |
|---|---|---|
| `id` | serial PK | |
| `sport` | text | |
| `home_team` | text | |
| `away_team` | text | |
| `status` | enum | `scheduled` \| `live` \| `finished` |
| `start_time` | timestamp | |
| `end_time` | timestamp | |
| `home_score` | integer | default 0 |
| `away_score` | integer | default 0 |
| `created_at` | timestamp | default now |

### `commentry`

| Column | Type | Notes |
|---|---|---|
| `id` | serial PK | |
| `match_id` | integer FK | references `matches.id` |
| `sport` | text | |
| `minute` | integer | |
| `sequence` | integer | |
| `period` | text | |
| `event_type` | text | |
| `actor` | text | |
| `team` | text | |
| `message` | text | |
| `metadata` | jsonb | |
| `tags` | text[] | |
| `created_at` | timestamp | default now |

---

## License

MIT
