//db.js

// import { drizzle } from "drizzle-orm/node-postgres";
// import pkg from "pg";
// import dotenv from "dotenv";

// dotenv.config();

// const { Pool } = pkg;

// if (!process.env.DATABASE_URL) {
//   throw new Error('DATABASE_URL is not defined');
// }

// const pool = new Pool({
//   connectionString: process.env.DATABASE_URL,
// });


// export const db = drizzle(pool);


//import { drizzle } from "drizzle-orm/node-postgres";
//import pkg from "pg";
//import dotenv from "dotenv";

//dotenv.config();

//const { Pool } = pkg;

//if (!process.env.DEV_DATABASE_URL) {
 // throw new Error('DEV_DATABASE_URL is not defined');
//}

// FIX #3: No SSL config was provided. Every major hosted Postgres provider
// (Neon, Supabase, Railway, Render) requires SSL and will reject plain TCP
// connections outright — the pool would connect then immediately get closed
// by the server, causing all queries to fail.
//
// rejectUnauthorized: false is required for most managed providers because
// they use certificates not always present in the system CA bundle.
// If your provider supplies a CA certificate, pass it via `ca:` instead.
//const pool = new Pool({
 // connectionString: process.env.DEV_DATABASE_URL,
 // ssl: process.env.NODE_ENV === 'production'
   // ? { rejectUnauthorized: false }
    //: false,
//});

//pool.on('error', (err) => {
 // console.error('Unexpected error on idle client', err);
 // process.exit(-1);
//});

//export const db = drizzle(pool);



import { drizzle } from "drizzle-orm/node-postgres";
import pkg from "pg";
import 'dotenv/config';

//const { drizzle } = require("drizzle-orm/node-postgres");

//const { Pool } = require("pg");

const { Pool } = pkg;

console.log(process.env.DEV_DATABASE_URL);

const pool = new Pool({
  connectionString: process.env.DEV_DATABASE_URL,
});

export const db = drizzle(pool);




// import { drizzle } from "drizzle-orm/node-postgres";
// import pkg from "pg";
// import * as schema from "./schema.js";

// const { Pool } = pkg;

// if (!process.env.DATABASE_URL) {
//   throw new Error("DATABASE_URL is not defined");
// }

// const pool = new Pool({
//   connectionString: process.env.DATABASE_URL,
//   // SSL is required by every major hosted Postgres provider (Neon, Supabase,
//   // Railway, Render). rejectUnauthorized:false handles providers that issue
//   // certificates not in the system CA bundle. Swap for { ca: "..." } if your
//   // provider supplies a root certificate.
//   ssl: process.env.NODE_ENV === "production"
//     ? { rejectUnauthorized: false }
//     : false,
//   max: 10,               // connection pool size
//   idleTimeoutMillis: 30_000,
//   connectionTimeoutMillis: 5_000,
// });

// // Surface pool errors so they don't silently crash the process
// pool.on("error", (err) => {
//   console.error("[DB] Unexpected pool error:", err.message);
// });

// export const db = drizzle(pool, { schema });