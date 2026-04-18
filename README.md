# 🏟️ ArenaLive

Real-time multi-sport score tracking platform. Live scores, per-match commentary feeds, WebSocket-powered updates, and a full admin panel with casualty management (suspend, abandon, reschedule, force-finish, delete).

---

## Project Structure

```
arena-live/
├── backend/                   Node.js + Express + Drizzle ORM
│   ├── src/
│   │   ├── db/
│   │   │   ├── db.js          pg Pool + Drizzle client
│   │   │   └── schema.js      Table definitions (matches, commentry)
│   │   ├── middleware/
│   │   │   ├── arcjet.js      Rate limiting + bot detection (optional)
│   │   │   └── error.js       Global 404 + error handlers
│   │   ├── routes/
│   │   │   ├── matches.js     All match endpoints
│   │   │   └── commentary.js  Commentary endpoints
│   │   ├── utils/
│   │   │   └── match-status.js  Status calculation + sync
│   │   ├── validation/
│   │   │   ├── matches.js     Zod schemas for match routes
│   │   │   └── commentary.js  Zod schemas for commentary routes
│   │   ├── ws/
│   │   │   └── server.js      WebSocket server + broadcast API
│   │   └── server.js          App entry point
│   ├── Dockerfile
│   ├── drizzle.config.js
│   └── package.json
│
├── frontend/                  React + Vite + Tailwind + Zustand
│   ├── src/
│   │   ├── components/
│   │   │   ├── UI.jsx         Shared: badges, toasts, dialogs, spinner
│   │   │   ├── MatchCard.jsx  Lobby game card
│   │   │   ├── Scoreboard.jsx Live score display
│   │   │   ├── CommentaryFeed.jsx  Sport-typed commentary list
│   │   │   └── ProtectedRoute.jsx  Admin auth guard
│   │   ├── config/
│   │   │   └── sports.js      Sport registry (add new sports here)
│   │   ├── pages/
│   │   │   ├── Lobby.jsx      Match list with live/scheduled/finished tabs
│   │   │   ├── GameRoom.jsx   Live match view + commentary feed
│   │   │   ├── Results.jsx    Final result + match report
│   │   │   ├── AdminLogin.jsx Password gate
│   │   │   └── AdminDashboard.jsx  Full admin panel
│   │   ├── store/
│   │   │   ├── wsStore.js     WebSocket + live data (Zustand)
│   │   │   └── appStore.js    Admin auth (Zustand)
│   │   └── utils/
│   │       └── api.js         Axios client + all REST calls
│   ├── Dockerfile
│   └── package.json
│
├── nginx/
│   └── nginx.conf             SPA routing + API/WS proxy + gzip
│
├── docker-compose.yml         Production
├── docker-compose.dev.yml     Development (hot reload)
├── .env.example
└── .gitignore
```

---

## Sports Supported

Football · Cricket · Badminton · Basketball · Tennis · Volleyball

**Adding a new sport:** open `frontend/src/config/sports.js` and add one entry to the `SPORTS` object with its `periods`, `eventTypes`, `scoreLabel`, and `winCondition`. Nothing else in the app changes.

---

## Match Statuses

| Status | Meaning |
|---|---|
| `scheduled` | Not started yet |
| `live` | In progress — clock-based, auto-set |
| `finished` | Ended naturally or force-finished |
| `suspended` | Admin-paused (incident, injury, weather) |
| `abandoned` | Permanently halted — no winner declared |

---

## Quick Start (Docker)

### Development — hot reload on both frontend and backend

```bash
git clone https://github.com/your-username/arena-live.git
cd arena-live

cp .env.example .env          # edit passwords and secrets

docker compose -f docker-compose.dev.yml up --build
```

| Service | URL |
|---|---|
| Frontend (Vite HMR) | http://localhost:5173 |
| Backend (node --watch) | http://localhost:7000 |
| PostgreSQL | localhost:5432 |

**Apply migrations (first run only):**
```bash
docker compose -f docker-compose.dev.yml exec backend npm run db:generate
docker compose -f docker-compose.dev.yml exec backend npm run db:migrate
```

After the first run, drop `--build` — images are cached:
```bash
docker compose -f docker-compose.dev.yml up
```

---

### Production — optimised, nginx-served

```bash
cp .env.example .env
# Set strong POSTGRES_PASSWORD and ADMIN_PASSWORD before building

docker compose up --build -d
```

| Service | URL |
|---|---|
| App (nginx) | http://localhost:80 |
| Backend | internal only (not exposed) |
| PostgreSQL | internal only (not exposed) |

**Apply migrations:**
```bash
docker compose exec backend npm run db:migrate
```

**View logs:**
```bash
docker compose logs -f
docker compose logs -f backend
docker compose logs -f frontend
```

**Stop:**
```bash
docker compose down               # keep data
docker compose down -v            # also delete postgres volume
```

---

## REST API

### Matches

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/matches` | List matches (`?limit`, `?status`, `?sport`) |
| `GET` | `/matches/:id` | Single match |
| `POST` | `/matches` | Create match |
| `PATCH` | `/matches/:id` | Edit fields (scheduled only) |
| `PATCH` | `/matches/:id/score` | Update score (live only) |
| `POST` | `/matches/:id/suspend` | Suspend with reason |
| `POST` | `/matches/:id/abandon` | Abandon with reason |
| `POST` | `/matches/:id/reschedule` | Move to new time |
| `POST` | `/matches/:id/finish` | Force-finish with optional score override |
| `DELETE` | `/matches/:id` | Hard delete (scheduled/abandoned/finished) |

### Commentary

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/matches/:id/commentary` | List events (`?limit`) |
| `POST` | `/matches/:id/commentary` | Post event |

### Health

```
GET /health  →  { status: "ok", uptime: 123 }
```

---

## WebSocket

Connect to `ws://localhost:7000/ws` (dev) or `ws://your-domain/ws` (prod via nginx).

### Server → Client events

| Event | Delivered to | Trigger |
|---|---|---|
| `welcome` | Connecting client | On connection |
| `match_created` | All clients | POST /matches |
| `score_update` | Room subscribers | PATCH /score |
| `commentary` | Room subscribers | POST /commentary |
| `match_suspended` | All clients | POST /suspend |
| `match_abandoned` | All clients | POST /abandon |
| `match_rescheduled` | All clients | POST /reschedule |
| `match_force_finished` | All clients | POST /finish |
| `match_updated` | All clients | PATCH /matches/:id |
| `match_deleted` | All clients | DELETE /matches/:id |

### Client → Server messages

```json
{ "type": "subscribe",   "matchId": 42 }
{ "type": "unsubscribe", "matchId": 42 }
```

---

## Environment Variables

Copy `.env.example` to `.env` and fill in:

| Variable | Required | Description |
|---|---|---|
| `POSTGRES_USER` | Yes | Database username |
| `POSTGRES_PASSWORD` | Yes | Database password — change before deploying |
| `POSTGRES_DB` | No | Database name (default: `arena_live`) |
| `ADMIN_PASSWORD` | Yes | Admin panel password |
| `ARCJET_KEY` | No | Leave blank to disable security middleware |
| `ARCJET_MODE` | No | `LIVE` or `DRY_RUN` (default: `DRY_RUN`) |
| `VITE_API_URL` | Prod only | Leave empty in production (nginx proxies) |
| `VITE_WS_URL` | Prod only | Leave empty in production (nginx proxies) |
| `FRONTEND_PORT` | No | Host port for nginx (default: `80`) |

---

## Architecture

```
Browser
  │
  ├── HTTP/HTTPS ──► nginx ──► /matches, /health ──► backend:7000
  │                        └── /ws ──────────────► backend:7000/ws (WebSocket)
  │
  └── Static files ─────── nginx serves /usr/share/nginx/html (React build)

backend:7000
  └── postgres:5432 (internal Docker network — not exposed in production)
```

In **development**, there is no nginx. The Vite dev server runs on `:5173` and the backend runs directly on `:7000`. The frontend uses absolute URLs (`VITE_API_URL=http://localhost:7000`).

In **production**, everything goes through nginx on port 80. `VITE_API_URL` and `VITE_WS_URL` are left empty so the frontend uses relative paths, which nginx proxies internally.

---

## Database

Managed with [Drizzle ORM](https://orm.drizzle.team).

```bash
# Generate migration SQL from schema changes
docker compose exec backend npm run db:generate

# Apply migrations
docker compose exec backend npm run db:migrate

# Open Drizzle Studio (visual DB browser)
docker compose exec backend npm run db:studio
```

---

## Admin Panel

Navigate to `/admin`. Default password: `admin123` (set `ADMIN_PASSWORD` in `.env`).

| Tab | Purpose |
|---|---|
| ➕ New Match | Create a match with sport, teams, and time window |
| ⚡ Score | Push live score updates |
| 🎙️ Commentary | Post sport-typed events to the live feed |
| 🚨 Manage | Suspend, abandon, reschedule, force-finish, edit, delete |
| 📋 All Matches | Overview of every match with status |
