# 🏟️ SPORTSZ — Real-Time Sports Backend Engine

A scalable backend system for **real-time sports updates**, built with Node.js, WebSockets, PostgreSQL (Neon), and Drizzle ORM.

---

## 🚀 Features

- ⚡ Real-time updates via WebSockets
- 🗄️ PostgreSQL (Neon) database
- 🧠 Drizzle ORM
- ✅ Zod validation
- 🎮 Built-in match simulation engine
- 📡 Live commentary broadcasting
- 🧩 Multi-sport support

---

## 📁 Project Structure

```
SPORTSZ/
├── src/
│   ├── db/
│   ├── routes/
│   ├── validation/
│   ├── utils/
│   ├── ws/
│   ├── simulator/
│   │   └── simulator.js
│   ├── index.js
```

---

## ⚙️ Setup

```bash
npm install
```

Create `.env`:

```
DATABASE_URL=your_database_url
PORT=4000
```

Run migrations:

```bash
npm run db:generate
npm run db:migrate
```

Start server:

```bash
node src/index.js
```

---

## 📡 WebSocket

Connect to:

```
ws://localhost:4000
```

---

## 🎮 Simulation Engine

Create file:

### 📁 src/simulator/simulator.js

```javascript
import { db } from "../db/db.js";
import { commentry } from "../db/schema.js";

const events = [
  { eventType: "goal", message: "GOAL! Incredible finish!" },
  { eventType: "foul", message: "A rough challenge there." },
  { eventType: "corner", message: "Corner kick awarded." },
];

function getRandomEvent() {
  return events[Math.floor(Math.random() * events.length)];
}

export async function simulateMatch(matchId) {
  let minute = 1;
  let sequence = 1;

  const interval = setInterval(async () => {
    if (minute > 90) {
      clearInterval(interval);
      console.log("🏁 Match ended");
      return;
    }

    const event = getRandomEvent();

    const commentary = {
      matchId,
      minute,
      sequence,
      sport: "football",
      ...event,
    };

    console.log("📡 EVENT:", commentary);

    await db.insert(commentry).values(commentary);

    minute += Math.floor(Math.random() * 5) + 1;
    sequence++;
  }, 2000);
}
```

---

## ▶️ Run Simulation

```javascript
import { simulateMatch } from "./simulator/simulator.js";

simulateMatch(1);
```

---

## 🧪 Example Commentary

```json
{
  "matchId": 1,
  "minute": 45,
  "eventType": "goal",
  "message": "GOAL! Stunning strike!"
}
```

---

## 🏁 Summary

SPORTSZ is a powerful backend engine capable of real-time sports updates, simulation, and multi-sport support.

---
