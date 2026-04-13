// drizzle.config.js
// FIX #1: Removed duplicate dotenv loading.
// 'import dotenv/config' is an ESM side-effect import that calls dotenv.config()
// immediately. The separate `import dotenv from "dotenv"` + `dotenv.config()` below
// it was doing the exact same thing a second time. One is enough.
// import 'dotenv/config';
// import { defineConfig } from 'drizzle-kit';

// if (!process.env.DEV_DATABASE_URL) {
//   throw new Error('DEV_DATABASE_URL is missing in .env');
// }

// export default defineConfig({
//   // FIX #2: './src/db/*.js' matched every file in the db folder, including db.js
//   // (which has no schema exports). Drizzle processes all matched files and can
//   // emit warnings or misinterpret non-schema exports. Point directly at schema.js.
//   schema: './src/db/schema.js',
//   out: './drizzle',
//   dialect: 'postgresql',
//   dbCredentials: {
//     url: process.env.DEV_DATABASE_URL,
//   },
// });



// drizzle.config.ts example
//import { defineConfig } from "drizzle-kit";
//import * as dotenv from "dotenv";
//dotenv.config();

//export default defineConfig({
//  schema: './src/db/schema.js',
// out: './drizzle',
// dialect: "postgresql",
// dbCredentials: {
// url: process.env.DEV_DATABASE_URL!, // Use the full URL
// },
//});



// export default function abc()= ()=> {
//   schema: "./src/db/schema.js",
//   out: "./drizzle",
//   dialect: "postgresql",
//   dbCredentials: {
//     url: process.env.module.exports = {
//   schema: "./src/db/schema.js",
//   out: "./drizzle",
//   dialect: "postgresql",
//   dbCredentials: {
//     url: process.env.DEV_DATABASE_URL,
//   },
// },
//   },
// };


import { defineConfig } from 'drizzle-kit';
import 'dotenv/config';

if (!process.env.DEV_DATABASE_URL) {
  throw new Error('DEV_DATABASE_URL is missing in .env');
}
console.log(process.env.DEV_DATABASE_URL);
export default defineConfig({
  schema: './src/db/schema.js',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DEV_DATABASE_URL,
  },
});


// import "dotenv/config";
// import { defineConfig } from "drizzle-kit";

// if (!process.env.DATABASE_URL) {
//   throw new Error("DATABASE_URL is missing in .env");
// }

// export default defineConfig({
//   schema: "./src/db/schema.js",
//   out: "./drizzle",
//   dialect: "postgresql",
//   dbCredentials: {
//     url: process.env.DATABASE_URL,
//   },
// });

